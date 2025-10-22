import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface PlanReportGeneratorProps {
    workspace: any;
    disabled: boolean;
    onReportGenerated: (reportData: any) => void;
}

interface ReportInsights {
    executiveSummary: string;
    strengths: string[];
    opportunities: string[];
    budgetAnalysis: string;
    keywordStrategy: string;
    campaignStructure: string;
    recommendations: string[];
}

const LoadingSpinner = () => <div className="spinner"></div>;

export const PlanReportGenerator: React.FC<PlanReportGeneratorProps> = ({ 
    workspace, 
    disabled,
    onReportGenerated 
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportInsights, setReportInsights] = useState<ReportInsights | null>(null);
    const [showReport, setShowReport] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    const generateReport = async () => {
        if (!workspace) return;

        setIsGenerating(true);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // Prepare data summary for AI analysis
            const totalCampaigns = workspace.campaigns.length;
            const totalAdGroups = workspace.adGroups.length;
            const totalKeywords = workspace.keywords.length;
            const totalProducts = workspace.products.length;
            const totalBudget = workspace.campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
            
            const assignedKeywordsCount = new Set(
                workspace.adGroups.flatMap(ag => (ag.keywords || []).map(k => k.id))
            ).size;

            const campaignTypes = workspace.campaigns.reduce((acc, c) => {
                acc[c.type] = (acc[c.type] || 0) + 1;
                return acc;
            }, {});

            const campaignThemes = workspace.campaigns.reduce((acc, c) => {
                acc[c.theme] = (acc[c.theme] || 0) + 1;
                return acc;
            }, {});

            const intentBreakdown = workspace.keywords.reduce((acc, k) => {
                acc[k.intent] = (acc[k.intent] || 0) + 1;
                return acc;
            }, {});

            const averageBid = workspace.adGroups.length > 0 
                ? workspace.adGroups.reduce((sum, ag) => sum + (ag.defaultBid || 0), 0) / workspace.adGroups.length
                : 0;

            const goals = workspace.goals || [];

            const prompt = `You are an expert Amazon PPC strategist creating a professional brand presentation report.

Analyze the following PPC plan for brand "${workspace.brand}":

CAMPAIGN OVERVIEW:
- Total Campaigns: ${totalCampaigns}
- Total Ad Groups: ${totalAdGroups}
- Total Daily Budget: $${totalBudget.toFixed(2)}
- Campaign Types: ${JSON.stringify(campaignTypes)}
- Campaign Themes: ${JSON.stringify(campaignThemes)}

KEYWORD STRATEGY:
- Total Keywords: ${totalKeywords}
- Assigned Keywords: ${assignedKeywordsCount}
- Assignment Rate: ${totalKeywords > 0 ? ((assignedKeywordsCount / totalKeywords) * 100).toFixed(0) : 0}%
- Intent Breakdown: ${JSON.stringify(intentBreakdown)}

BIDDING STRATEGY:
- Average Default Bid: $${averageBid.toFixed(2)}
- Total Products: ${totalProducts}

PERFORMANCE GOALS:
${goals.length > 0 ? goals.map(g => `- ${g.type}: ${g.value}%`).join('\n') : '- No goals set'}

Create a comprehensive, professional report that includes:
1. An executive summary highlighting the overall strategy
2. Key strengths of the current plan (3-5 points)
3. Growth opportunities and optimization areas (3-5 points)
4. Budget analysis and allocation strategy
5. Keyword strategy assessment
6. Campaign structure evaluation
7. Actionable recommendations (3-5 specific items)

Use professional, brand-friendly language suitable for client presentation.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            executiveSummary: {
                                type: Type.STRING,
                                description: 'A concise executive summary of the PPC plan strategy'
                            },
                            strengths: {
                                type: Type.ARRAY,
                                description: 'List of key strengths in the current plan',
                                items: { type: Type.STRING }
                            },
                            opportunities: {
                                type: Type.ARRAY,
                                description: 'Growth opportunities and areas for optimization',
                                items: { type: Type.STRING }
                            },
                            budgetAnalysis: {
                                type: Type.STRING,
                                description: 'Analysis of budget allocation and strategy'
                            },
                            keywordStrategy: {
                                type: Type.STRING,
                                description: 'Assessment of keyword strategy and coverage'
                            },
                            campaignStructure: {
                                type: Type.STRING,
                                description: 'Evaluation of campaign structure and organization'
                            },
                            recommendations: {
                                type: Type.ARRAY,
                                description: 'Specific, actionable recommendations',
                                items: { type: Type.STRING }
                            }
                        },
                        required: ['executiveSummary', 'strengths', 'opportunities', 'budgetAnalysis', 'keywordStrategy', 'campaignStructure', 'recommendations']
                    }
                }
            });

            const insights = JSON.parse(response.text);
            setReportInsights(insights);
            setShowReport(true);
            
            onReportGenerated({
                timestamp: new Date().toISOString(),
                insights,
                planSnapshot: {
                    brand: workspace.brand,
                    totalCampaigns,
                    totalAdGroups,
                    totalKeywords,
                    totalBudget,
                }
            });

        } catch (error) {
            console.error("Error generating report:", error);
            let errorMsg = "Failed to generate report.";
            if (error && typeof error === "object") {
                if (error.message) {
                    errorMsg += `\nDetails: ${error.message}`;
                } else {
                    errorMsg += `\nDetails: ${JSON.stringify(error)}`;
                }
            } else if (typeof error === "string") {
                errorMsg += `\nDetails: ${error}`;
            }
            errorMsg += "\nPlease ensure your API key is set and try again.";
            alert(errorMsg);
        } finally {
            setIsGenerating(false);
        }
    };

    const exportReport = () => {
        if (!reportRef.current || !workspace) return;

        const reportContent = reportRef.current.innerHTML;
        const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${workspace.brand} - PPC Plan Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem;
        }
        .report-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .report-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        .report-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        .report-header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .report-content {
            padding: 2rem;
        }
        .section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 12px;
            border-left: 4px solid #667eea;
        }
        .section h2 {
            color: #667eea;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .section p {
            color: #555;
            line-height: 1.8;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            padding: 0.75rem 0;
            padding-left: 1.5rem;
            position: relative;
            color: #555;
        }
        li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .stat-card .value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 0.5rem;
        }
        .stat-card .label {
            color: #777;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .report-footer {
            background: #f8f9fa;
            padding: 2rem;
            text-align: center;
            color: #777;
            font-size: 0.9rem;
            border-top: 2px solid #e9ecef;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .report-container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    ${reportContent}
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${workspace.brand.replace(/\s/g, '_')}_PPC_Report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!workspace) {
        return (
            <div className="section">
                <p style={{ textAlign: 'center', color: '#777' }}>No workspace selected</p>
            </div>
        );
    }

    // Calculate stats
    const totalCampaigns = workspace.campaigns.length;
    const totalAdGroups = workspace.adGroups.length;
    const totalKeywords = workspace.keywords.length;
    const totalBudget = workspace.campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    const assignedKeywordsCount = new Set(
        workspace.adGroups.flatMap(ag => (ag.keywords || []).map(k => k.id))
    ).size;

    return (
        <div className="section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>
                    <i className="fa-solid fa-chart-line" style={{ marginRight: '0.5rem' }}></i>
                    AI Plan Report
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!showReport && (
                        <button 
                            onClick={generateReport} 
                            disabled={disabled || isGenerating}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {isGenerating ? (
                                <>
                                    <LoadingSpinner />
                                    <span>Generating Report...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                                    <span>Generate AI Report</span>
                                </>
                            )}
                        </button>
                    )}
                    {showReport && reportInsights && (
                        <>
                            <button 
                                onClick={() => setShowReport(false)}
                                className="btn btn-secondary"
                            >
                                <i className="fa-solid fa-eye-slash"></i> Hide Report
                            </button>
                            <button 
                                onClick={exportReport}
                                className="btn btn-success"
                            >
                                <i className="fa-solid fa-download"></i> Export as HTML
                            </button>
                        </>
                    )}
                </div>
            </div>

            {!showReport && !isGenerating && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#777' }}>
                    <i className="fa-solid fa-file-contract" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#667eea' }}></i>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        Generate a professional AI-powered analysis of your PPC plan
                    </p>
                    <p style={{ fontSize: '0.9rem' }}>
                        Perfect for presenting to brands and stakeholders
                    </p>
                </div>
            )}

            {showReport && reportInsights && (
                <div ref={reportRef}>
                    <div className="report-container">
                        <div className="report-header">
                            <h1>{workspace.brand} PPC Strategy Report</h1>
                            <div className="subtitle">AI-Powered Campaign Analysis & Insights</div>
                            <div className="subtitle" style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
                                Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        <div className="report-content">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="value">{totalCampaigns}</div>
                                    <div className="label">Campaigns</div>
                                </div>
                                <div className="stat-card">
                                    <div className="value">{totalAdGroups}</div>
                                    <div className="label">Ad Groups</div>
                                </div>
                                <div className="stat-card">
                                    <div className="value">{totalKeywords}</div>
                                    <div className="label">Keywords</div>
                                </div>
                                <div className="stat-card">
                                    <div className="value">${totalBudget.toFixed(0)}</div>
                                    <div className="label">Daily Budget</div>
                                </div>
                                <div className="stat-card">
                                    <div className="value">{totalKeywords > 0 ? ((assignedKeywordsCount / totalKeywords) * 100).toFixed(0) : 0}%</div>
                                    <div className="label">Assignment Rate</div>
                                </div>
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-clipboard-list"></i>
                                    Executive Summary
                                </h2>
                                <p>{reportInsights.executiveSummary}</p>
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-star"></i>
                                    Key Strengths
                                </h2>
                                <ul>
                                    {reportInsights.strengths.map((strength, idx) => (
                                        <li key={idx}>{strength}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-lightbulb"></i>
                                    Growth Opportunities
                                </h2>
                                <ul>
                                    {reportInsights.opportunities.map((opportunity, idx) => (
                                        <li key={idx}>{opportunity}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-dollar-sign"></i>
                                    Budget Analysis
                                </h2>
                                <p>{reportInsights.budgetAnalysis}</p>
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-key"></i>
                                    Keyword Strategy
                                </h2>
                                <p>{reportInsights.keywordStrategy}</p>
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-sitemap"></i>
                                    Campaign Structure
                                </h2>
                                <p>{reportInsights.campaignStructure}</p>
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-bullseye"></i>
                                    Recommendations
                                </h2>
                                <ul>
                                    {reportInsights.recommendations.map((recommendation, idx) => (
                                        <li key={idx}>{recommendation}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="report-footer">
                            <p>Report generated by Good-Wit Commerce PPC Planner</p>
                            <p style={{ marginTop: '0.5rem' }}>
                                AI-powered insights for data-driven advertising decisions
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
