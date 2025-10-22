import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PlanReportGeneratorProps {
    workspace: any;
    disabled: boolean;
    onReportGenerated: (reportData: any) => void;
}

interface ReportInsights {
    executiveSummary: string;
    strengths: string[];
    opportunities: string[];
    weaknesses: string[];
    budgetAnalysis: string;
    budgetBreakdown: Array<{campaignType: string, amount: number, percentage: number}>;
    keywordStrategy: string;
    keywordMetrics: {
        totalKeywords: number;
        assignedKeywords: number;
        unassignedKeywords: number;
        byIntent: Array<{intent: string, count: number, percentage: number}>;
        byMatchType: Array<{matchType: string, count: number, percentage: number}>;
    };
    campaignStructure: string;
    campaignMetrics: {
        byCampaignType: Array<{type: string, count: number, avgBudget: number}>;
        byTheme: Array<{theme: string, count: number}>;
    };
    goalsAnalysis: string;
    goalsBreakdown: Array<{campaignName: string, goalType: string, targetValue: number}>;
    recommendations: Array<{priority: string, action: string, impact: string, effort: string}>;
    performanceProjections: {
        estimatedImpressions: string;
        estimatedClicks: string;
        estimatedConversions: string;
        assumptions: string[];
    };
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
    const [showHistory, setShowHistory] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    const generateReport = async () => {
        if (!workspace) return;

        setIsGenerating(true);
        
        try {
            // SECURITY NOTE: API key is exposed in client-side code.
            // For production use, move AI API calls to a secure backend service to protect credentials.
            // This client-side implementation is for demonstration purposes only.
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
            
            // Map goals to campaign names for better context
            const goalsWithCampaigns = goals.map(g => {
                const campaign = workspace.campaigns.find(c => c.id === g.campaignId);
                return {
                    campaignName: campaign?.name || 'Unknown Campaign',
                    goalType: g.type,
                    targetValue: g.value
                };
            });

            // Calculate detailed metrics
            const matchTypeBreakdown = workspace.keywords.reduce((acc, k) => {
                const matchType = k.matchType || 'BROAD';
                acc[matchType] = (acc[matchType] || 0) + 1;
                return acc;
            }, {});

            const campaignTypeDetails = workspace.campaigns.reduce((acc, c) => {
                if (!acc[c.type]) {
                    acc[c.type] = { count: 0, totalBudget: 0 };
                }
                acc[c.type].count += 1;
                acc[c.type].totalBudget += c.budget || 0;
                return acc;
            }, {});

            const prompt = `You are an expert Amazon PPC strategist creating a DETAILED, DATA-DRIVEN brand presentation report.

Analyze the following PPC plan for brand "${workspace.brand}":

CAMPAIGN OVERVIEW:
- Total Campaigns: ${totalCampaigns}
- Total Ad Groups: ${totalAdGroups}
- Total Daily Budget: $${totalBudget.toFixed(2)}
- Campaign Types: ${JSON.stringify(campaignTypes)}
- Campaign Themes: ${JSON.stringify(campaignThemes)}
- Campaign Type Budget Breakdown: ${JSON.stringify(campaignTypeDetails)}

KEYWORD STRATEGY:
- Total Keywords: ${totalKeywords}
- Assigned Keywords: ${assignedKeywordsCount}
- Unassigned Keywords: ${totalKeywords - assignedKeywordsCount}
- Assignment Rate: ${totalKeywords > 0 ? ((assignedKeywordsCount / totalKeywords) * 100).toFixed(0) : 0}%
- Intent Breakdown: ${JSON.stringify(intentBreakdown)}
- Match Type Breakdown: ${JSON.stringify(matchTypeBreakdown)}

BIDDING STRATEGY:
- Average Default Bid: $${averageBid.toFixed(2)}
- Total Products: ${totalProducts}

PERFORMANCE GOALS:
${goals.length > 0 ? goalsWithCampaigns.map(g => `- ${g.campaignName}: ${g.goalType} = ${g.targetValue}${g.goalType.includes('ACoS') || g.goalType.includes('CTR') || g.goalType.includes('CVR') ? '%' : g.goalType.includes('CPC') ? ' $' : 'x'}`).join('\n') : '- No goals set'}

Create a COMPREHENSIVE, DETAILED report with:
1. Executive Summary (3-4 sentences) - Strategic overview and expected business outcomes
2. Key Strengths (5-7 bullet points) - Detailed competitive advantages
3. Growth Opportunities (5-7 bullet points) - Specific improvement areas with business impact
4. Weaknesses (3-5 bullet points) - Areas of concern or risk
5. Budget Analysis (3-4 sentences) - Detailed budget effectiveness and allocation concerns
6. Budget Breakdown - Array of objects with: campaignType (string), amount (number), percentage (number)
7. Keyword Strategy (3-4 sentences) - In-depth coverage analysis and gaps
8. Keyword Metrics - Detailed object with:
   - totalKeywords, assignedKeywords, unassignedKeywords (numbers)
   - byIntent: array of {intent, count, percentage}
   - byMatchType: array of {matchType, count, percentage}
9. Campaign Structure (3-4 sentences) - Structural quality and improvement recommendations
10. Campaign Metrics - Detailed object with:
    - byCampaignType: array of {type, count, avgBudget}
    - byTheme: array of {theme, count}
11. Goals Analysis (3-4 sentences) - Evaluate if goals are realistic, alignment with budget/strategy, and identify missing goals
12. Goals Breakdown - Array of objects with: campaignName (string), goalType (string), targetValue (number)
13. Recommendations (6-8 prioritized actions) - Each with: priority (High/Medium/Low), action (string), impact (string), effort (string)
14. Performance Projections - Object with:
    - estimatedImpressions (string with range)
    - estimatedClicks (string with range)
    - estimatedConversions (string with range)
    - assumptions (array of 3-4 key assumptions)

IMPORTANT: Provide detailed, actionable insights with specific numbers and percentages. Focus on data-driven recommendations that demonstrate clear ROI potential.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-001",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            executiveSummary: {
                                type: Type.STRING,
                                description: '3-4 sentence executive summary with strategic overview'
                            },
                            strengths: {
                                type: Type.ARRAY,
                                description: 'List of 5-7 key strengths with detailed competitive advantages',
                                items: { type: Type.STRING }
                            },
                            opportunities: {
                                type: Type.ARRAY,
                                description: 'List of 5-7 growth opportunities with specific business impact',
                                items: { type: Type.STRING }
                            },
                            weaknesses: {
                                type: Type.ARRAY,
                                description: 'List of 3-5 weaknesses or areas of concern',
                                items: { type: Type.STRING }
                            },
                            budgetAnalysis: {
                                type: Type.STRING,
                                description: '3-4 sentence detailed budget effectiveness analysis'
                            },
                            budgetBreakdown: {
                                type: Type.ARRAY,
                                description: 'Budget breakdown by campaign type',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        campaignType: { type: Type.STRING },
                                        amount: { type: Type.NUMBER },
                                        percentage: { type: Type.NUMBER }
                                    }
                                }
                            },
                            keywordStrategy: {
                                type: Type.STRING,
                                description: '3-4 sentence in-depth keyword strategy assessment'
                            },
                            keywordMetrics: {
                                type: Type.OBJECT,
                                properties: {
                                    totalKeywords: { type: Type.NUMBER },
                                    assignedKeywords: { type: Type.NUMBER },
                                    unassignedKeywords: { type: Type.NUMBER },
                                    byIntent: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                intent: { type: Type.STRING },
                                                count: { type: Type.NUMBER },
                                                percentage: { type: Type.NUMBER }
                                            }
                                        }
                                    },
                                    byMatchType: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                matchType: { type: Type.STRING },
                                                count: { type: Type.NUMBER },
                                                percentage: { type: Type.NUMBER }
                                            }
                                        }
                                    }
                                }
                            },
                            campaignStructure: {
                                type: Type.STRING,
                                description: '3-4 sentence structural quality evaluation'
                            },
                            campaignMetrics: {
                                type: Type.OBJECT,
                                properties: {
                                    byCampaignType: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                type: { type: Type.STRING },
                                                count: { type: Type.NUMBER },
                                                avgBudget: { type: Type.NUMBER }
                                            }
                                        }
                                    },
                                    byTheme: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                theme: { type: Type.STRING },
                                                count: { type: Type.NUMBER }
                                            }
                                        }
                                    }
                                }
                            },
                            goalsAnalysis: {
                                type: Type.STRING,
                                description: '3-4 sentence evaluation of goals: realism, alignment with budget/strategy, missing goals'
                            },
                            goalsBreakdown: {
                                type: Type.ARRAY,
                                description: 'Breakdown of goals by campaign',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        campaignName: { type: Type.STRING },
                                        goalType: { type: Type.STRING },
                                        targetValue: { type: Type.NUMBER }
                                    }
                                }
                            },
                            recommendations: {
                                type: Type.ARRAY,
                                description: 'List of 6-8 prioritized recommendations',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        priority: { type: Type.STRING },
                                        action: { type: Type.STRING },
                                        impact: { type: Type.STRING },
                                        effort: { type: Type.STRING }
                                    }
                                }
                            },
                            performanceProjections: {
                                type: Type.OBJECT,
                                properties: {
                                    estimatedImpressions: { type: Type.STRING },
                                    estimatedClicks: { type: Type.STRING },
                                    estimatedConversions: { type: Type.STRING },
                                    assumptions: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    }
                                }
                            }
                        },
                        required: ['executiveSummary', 'strengths', 'opportunities', 'weaknesses', 'budgetAnalysis', 'budgetBreakdown', 'keywordStrategy', 'keywordMetrics', 'campaignStructure', 'campaignMetrics', 'goalsAnalysis', 'goalsBreakdown', 'recommendations', 'performanceProjections']
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

    const exportReportAsPDF = () => {
        if (!reportInsights || !workspace) return;

        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 20;

        // Helper to check if we need a new page
        const checkNewPage = (spaceNeeded: number) => {
            if (yPos + spaceNeeded > pageHeight - 20) {
                doc.addPage();
                yPos = 20;
                return true;
            }
            return false;
        };

        // Title
        doc.setFontSize(24);
        doc.setTextColor(102, 126, 234);
        doc.text(`${workspace.brand} PPC Strategy Report`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text('AI-Powered Campaign Analysis & Insights', pageWidth / 2, yPos, { align: 'center' });
        yPos += 6;

        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;

        // Key Metrics Table
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Key Metrics', 14, yPos);
        yPos += 8;

        const totalCampaigns = workspace.campaigns.length;
        const totalAdGroups = workspace.adGroups.length;
        const totalKeywords = workspace.keywords.length;
        const totalBudget = workspace.campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
        const assignedKeywordsCount = new Set(
            workspace.adGroups.flatMap(ag => (ag.keywords || []).map(k => k.id))
        ).size;

        autoTable(doc, {
            startY: yPos,
            head: [['Metric', 'Value']],
            body: [
                ['Total Campaigns', totalCampaigns.toString()],
                ['Total Ad Groups', totalAdGroups.toString()],
                ['Total Keywords', totalKeywords.toString()],
                ['Daily Budget', `$${totalBudget.toFixed(2)}`],
                ['Keyword Assignment Rate', `${totalKeywords > 0 ? ((assignedKeywordsCount / totalKeywords) * 100).toFixed(0) : 0}%`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [102, 126, 234] },
            margin: { left: 14, right: 14 }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        // Executive Summary
        checkNewPage(30);
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Executive Summary', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const summaryLines = doc.splitTextToSize(reportInsights.executiveSummary, pageWidth - 28);
        doc.text(summaryLines, 14, yPos);
        yPos += summaryLines.length * 5 + 10;

        // Key Strengths
        checkNewPage(30);
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Key Strengths', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        reportInsights.strengths.forEach((strength, idx) => {
            checkNewPage(10);
            const lines = doc.splitTextToSize(`${idx + 1}. ${strength}`, pageWidth - 28);
            doc.text(lines, 14, yPos);
            yPos += lines.length * 5 + 2;
        });
        yPos += 5;

        // Growth Opportunities
        checkNewPage(30);
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Growth Opportunities', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        reportInsights.opportunities.forEach((opportunity, idx) => {
            checkNewPage(10);
            const lines = doc.splitTextToSize(`${idx + 1}. ${opportunity}`, pageWidth - 28);
            doc.text(lines, 14, yPos);
            yPos += lines.length * 5 + 2;
        });
        yPos += 5;

        // Weaknesses
        checkNewPage(30);
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Areas for Improvement', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        reportInsights.weaknesses.forEach((weakness, idx) => {
            checkNewPage(10);
            const lines = doc.splitTextToSize(`${idx + 1}. ${weakness}`, pageWidth - 28);
            doc.text(lines, 14, yPos);
            yPos += lines.length * 5 + 2;
        });
        yPos += 5;

        // Budget Analysis
        checkNewPage(30);
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Budget Analysis', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const budgetLines = doc.splitTextToSize(reportInsights.budgetAnalysis, pageWidth - 28);
        doc.text(budgetLines, 14, yPos);
        yPos += budgetLines.length * 5 + 10;

        // Budget Breakdown Table
        if (reportInsights.budgetBreakdown && reportInsights.budgetBreakdown.length > 0) {
            checkNewPage(40);
            autoTable(doc, {
                startY: yPos,
                head: [['Campaign Type', 'Budget', 'Percentage']],
                body: reportInsights.budgetBreakdown.map(item => [
                    item.campaignType,
                    `$${item.amount.toFixed(2)}`,
                    `${item.percentage.toFixed(1)}%`
                ]),
                theme: 'grid',
                headStyles: { fillColor: [102, 126, 234] },
                margin: { left: 14, right: 14 }
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }

        // Keyword Strategy
        checkNewPage(30);
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Keyword Strategy', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const keywordLines = doc.splitTextToSize(reportInsights.keywordStrategy, pageWidth - 28);
        doc.text(keywordLines, 14, yPos);
        yPos += keywordLines.length * 5 + 10;

        // Keyword Metrics Tables
        if (reportInsights.keywordMetrics) {
            checkNewPage(40);
            doc.setFontSize(12);
            doc.setTextColor(102, 126, 234);
            doc.text('Keyword Distribution by Intent', 14, yPos);
            yPos += 6;

            if (reportInsights.keywordMetrics.byIntent && reportInsights.keywordMetrics.byIntent.length > 0) {
                autoTable(doc, {
                    startY: yPos,
                    head: [['Intent', 'Count', 'Percentage']],
                    body: reportInsights.keywordMetrics.byIntent.map(item => [
                        item.intent,
                        item.count.toString(),
                        `${item.percentage.toFixed(1)}%`
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [102, 126, 234] },
                    margin: { left: 14, right: 14 }
                });
                yPos = (doc as any).lastAutoTable.finalY + 10;
            }

            checkNewPage(40);
            doc.setFontSize(12);
            doc.setTextColor(102, 126, 234);
            doc.text('Keyword Distribution by Match Type', 14, yPos);
            yPos += 6;

            if (reportInsights.keywordMetrics.byMatchType && reportInsights.keywordMetrics.byMatchType.length > 0) {
                autoTable(doc, {
                    startY: yPos,
                    head: [['Match Type', 'Count', 'Percentage']],
                    body: reportInsights.keywordMetrics.byMatchType.map(item => [
                        item.matchType,
                        item.count.toString(),
                        `${item.percentage.toFixed(1)}%`
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [102, 126, 234] },
                    margin: { left: 14, right: 14 }
                });
                yPos = (doc as any).lastAutoTable.finalY + 10;
            }
        }

        // Campaign Structure
        checkNewPage(30);
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Campaign Structure', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const campaignLines = doc.splitTextToSize(reportInsights.campaignStructure, pageWidth - 28);
        doc.text(campaignLines, 14, yPos);
        yPos += campaignLines.length * 5 + 10;

        // Campaign Metrics Tables
        if (reportInsights.campaignMetrics) {
            if (reportInsights.campaignMetrics.byCampaignType && reportInsights.campaignMetrics.byCampaignType.length > 0) {
                checkNewPage(40);
                doc.setFontSize(12);
                doc.setTextColor(102, 126, 234);
                doc.text('Campaign Distribution by Type', 14, yPos);
                yPos += 6;

                autoTable(doc, {
                    startY: yPos,
                    head: [['Campaign Type', 'Count', 'Avg Budget']],
                    body: reportInsights.campaignMetrics.byCampaignType.map(item => [
                        item.type,
                        item.count.toString(),
                        `$${item.avgBudget.toFixed(2)}`
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [102, 126, 234] },
                    margin: { left: 14, right: 14 }
                });
                yPos = (doc as any).lastAutoTable.finalY + 10;
            }

            if (reportInsights.campaignMetrics.byTheme && reportInsights.campaignMetrics.byTheme.length > 0) {
                checkNewPage(40);
                doc.setFontSize(12);
                doc.setTextColor(102, 126, 234);
                doc.text('Campaign Distribution by Theme', 14, yPos);
                yPos += 6;

                autoTable(doc, {
                    startY: yPos,
                    head: [['Theme', 'Count']],
                    body: reportInsights.campaignMetrics.byTheme.map(item => [
                        item.theme,
                        item.count.toString()
                    ]),
                    theme: 'grid',
                    headStyles: { fillColor: [102, 126, 234] },
                    margin: { left: 14, right: 14 }
                });
                yPos = (doc as any).lastAutoTable.finalY + 10;
            }
        }

        // Performance Goals
        checkNewPage(30);
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Performance Goals', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const goalsAnalysisLines = doc.splitTextToSize(reportInsights.goalsAnalysis, pageWidth - 28);
        doc.text(goalsAnalysisLines, 14, yPos);
        yPos += goalsAnalysisLines.length * 5 + 10;

        // Goals Breakdown Table
        if (reportInsights.goalsBreakdown && reportInsights.goalsBreakdown.length > 0) {
            checkNewPage(40);
            autoTable(doc, {
                startY: yPos,
                head: [['Campaign', 'Goal Type', 'Target Value']],
                body: reportInsights.goalsBreakdown.map(item => [
                    item.campaignName,
                    item.goalType,
                    item.targetValue.toString() + (item.goalType.includes('ACoS') || item.goalType.includes('CTR') || item.goalType.includes('CVR') ? '%' : item.goalType.includes('CPC') ? ' $' : 'x')
                ]),
                theme: 'grid',
                headStyles: { fillColor: [102, 126, 234] },
                margin: { left: 14, right: 14 }
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;
        } else {
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('No performance goals have been set for this plan.', 14, yPos);
            yPos += 10;
        }

        // Recommendations
        checkNewPage(30);
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text('Recommendations', 14, yPos);
        yPos += 8;

        if (reportInsights.recommendations && reportInsights.recommendations.length > 0) {
            autoTable(doc, {
                startY: yPos,
                head: [['Priority', 'Action', 'Impact', 'Effort']],
                body: reportInsights.recommendations.map(rec => [
                    rec.priority,
                    rec.action,
                    rec.impact,
                    rec.effort
                ]),
                theme: 'grid',
                headStyles: { fillColor: [102, 126, 234] },
                margin: { left: 14, right: 14 },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 80 },
                    2: { cellWidth: 40 },
                    3: { cellWidth: 30 }
                }
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }

        // Performance Projections
        if (reportInsights.performanceProjections) {
            checkNewPage(30);
            doc.setFontSize(14);
            doc.setTextColor(102, 126, 234);
            doc.text('Performance Projections', 14, yPos);
            yPos += 8;

            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            doc.text(`Estimated Impressions: ${reportInsights.performanceProjections.estimatedImpressions}`, 14, yPos);
            yPos += 6;
            doc.text(`Estimated Clicks: ${reportInsights.performanceProjections.estimatedClicks}`, 14, yPos);
            yPos += 6;
            doc.text(`Estimated Conversions: ${reportInsights.performanceProjections.estimatedConversions}`, 14, yPos);
            yPos += 10;

            if (reportInsights.performanceProjections.assumptions && reportInsights.performanceProjections.assumptions.length > 0) {
                doc.setFontSize(11);
                doc.text('Key Assumptions:', 14, yPos);
                yPos += 6;
                
                doc.setFontSize(10);
                reportInsights.performanceProjections.assumptions.forEach((assumption, idx) => {
                    checkNewPage(8);
                    const lines = doc.splitTextToSize(`• ${assumption}`, pageWidth - 28);
                    doc.text(lines, 14, yPos);
                    yPos += lines.length * 5 + 2;
                });
            }
        }

        // Footer on last page
        const totalPages = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                'Generated by Good-Wit Commerce PPC Planner | AI-powered insights for data-driven decisions',
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
        }

        // Save the PDF
        doc.save(`${workspace.brand.replace(/\s/g, '_')}_PPC_Report_${new Date().toISOString().split('T')[0]}.pdf`);
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
                    {workspace?.reportHistory && workspace.reportHistory.length > 0 && (
                        <button 
                            onClick={() => setShowHistory(!showHistory)}
                            className="btn btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <i className="fa-solid fa-clock-rotate-left"></i>
                            {showHistory ? 'Hide' : 'View'} History ({workspace.reportHistory.length})
                        </button>
                    )}
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
                                onClick={exportReportAsPDF}
                                className="btn btn-success"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <i className="fa-solid fa-file-pdf"></i> Export as PDF
                            </button>
                            <button 
                                onClick={exportReport}
                                className="btn btn-secondary"
                            >
                                <i className="fa-solid fa-download"></i> Export as HTML
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showHistory && workspace?.reportHistory && workspace.reportHistory.length > 0 && (
                <div style={{ 
                    marginBottom: '1.5rem', 
                    padding: '1rem', 
                    background: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '2px solid #667eea'
                }}>
                    <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>
                        <i className="fa-solid fa-history" style={{ marginRight: '0.5rem' }}></i>
                        Report History
                    </h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {workspace.reportHistory.slice().reverse().map((report, index) => (
                            <div 
                                key={index}
                                style={{ 
                                    padding: '0.75rem', 
                                    background: 'white', 
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                        Report Generated {new Date(report.timestamp).toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        {report.planSnapshot?.totalCampaigns} campaigns, {report.planSnapshot?.totalKeywords} keywords, ${report.planSnapshot?.totalBudget?.toFixed(2)} budget
                                    </div>
                                </div>
                                <button 
                                    className="button"
                                    onClick={() => {
                                        setReportInsights(report.insights);
                                        setShowReport(true);
                                        setShowHistory(false);
                                    }}
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    <i className="fa-solid fa-eye" style={{ marginRight: '0.5rem' }}></i>
                                    View
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    Areas for Improvement
                                </h2>
                                <ul>
                                    {reportInsights.weaknesses.map((weakness, idx) => (
                                        <li key={idx}>{weakness}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-dollar-sign"></i>
                                    Budget Analysis
                                </h2>
                                <p>{reportInsights.budgetAnalysis}</p>
                                
                                {reportInsights.budgetBreakdown && reportInsights.budgetBreakdown.length > 0 && (
                                    <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Campaign Type</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>Budget</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>Percentage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportInsights.budgetBreakdown.map((item, idx) => (
                                                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.campaignType}</td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>${item.amount.toFixed(2)}</td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>{item.percentage.toFixed(1)}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-key"></i>
                                    Keyword Strategy
                                </h2>
                                <p>{reportInsights.keywordStrategy}</p>
                                
                                {reportInsights.keywordMetrics && (
                                    <div style={{ marginTop: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#667eea' }}>Keyword Distribution</h3>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                                            {reportInsights.keywordMetrics.byIntent && reportInsights.keywordMetrics.byIntent.length > 0 && (
                                                <div style={{ overflowX: 'auto' }}>
                                                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>By Intent</h4>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                        <thead>
                                                            <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
                                                                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd', fontSize: '0.85rem' }}>Intent</th>
                                                                <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>Count</th>
                                                                <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>%</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reportInsights.keywordMetrics.byIntent.map((item, idx) => (
                                                                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                                                    <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.intent}</td>
                                                                    <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.count}</td>
                                                                    <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.percentage.toFixed(1)}%</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            
                                            {reportInsights.keywordMetrics.byMatchType && reportInsights.keywordMetrics.byMatchType.length > 0 && (
                                                <div style={{ overflowX: 'auto' }}>
                                                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>By Match Type</h4>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                        <thead>
                                                            <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
                                                                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd', fontSize: '0.85rem' }}>Match Type</th>
                                                                <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>Count</th>
                                                                <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>%</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reportInsights.keywordMetrics.byMatchType.map((item, idx) => (
                                                                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                                                    <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.matchType}</td>
                                                                    <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.count}</td>
                                                                    <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.percentage.toFixed(1)}%</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-sitemap"></i>
                                    Campaign Structure
                                </h2>
                                <p>{reportInsights.campaignStructure}</p>
                                
                                {reportInsights.campaignMetrics && (
                                    <div style={{ marginTop: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#667eea' }}>Campaign Distribution</h3>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                                            {reportInsights.campaignMetrics.byCampaignType && reportInsights.campaignMetrics.byCampaignType.length > 0 && (
                                                <div style={{ overflowX: 'auto' }}>
                                                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>By Campaign Type</h4>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                        <thead>
                                                            <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
                                                                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd', fontSize: '0.85rem' }}>Type</th>
                                                                <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>Count</th>
                                                                <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>Avg Budget</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reportInsights.campaignMetrics.byCampaignType.map((item, idx) => (
                                                                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                                                    <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.type}</td>
                                                                    <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.count}</td>
                                                                    <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>${item.avgBudget.toFixed(2)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            
                                            {reportInsights.campaignMetrics.byTheme && reportInsights.campaignMetrics.byTheme.length > 0 && (
                                                <div style={{ overflowX: 'auto' }}>
                                                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>By Theme</h4>
                                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                        <thead>
                                                            <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
                                                                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd', fontSize: '0.85rem' }}>Theme</th>
                                                                <th style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>Count</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {reportInsights.campaignMetrics.byTheme.map((item, idx) => (
                                                                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                                                    <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.theme}</td>
                                                                    <td style={{ padding: '0.5rem', textAlign: 'right', border: '1px solid #ddd', fontSize: '0.85rem' }}>{item.count}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-crosshairs"></i>
                                    Performance Goals
                                </h2>
                                <p>{reportInsights.goalsAnalysis}</p>
                                
                                {reportInsights.goalsBreakdown && reportInsights.goalsBreakdown.length > 0 ? (
                                    <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Campaign</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Goal Type</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>Target Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportInsights.goalsBreakdown.map((item, idx) => (
                                                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.campaignName}</td>
                                                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{item.goalType}</td>
                                                        <td style={{ padding: '0.75rem', textAlign: 'right', border: '1px solid #ddd' }}>
                                                            {item.targetValue}{item.goalType.includes('ACoS') || item.goalType.includes('CTR') || item.goalType.includes('CVR') ? '%' : item.goalType.includes('CPC') ? ' $' : 'x'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
                                        <i className="fa-solid fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                                        No performance goals have been set for this plan.
                                    </div>
                                )}
                            </div>

                            <div className="section">
                                <h2>
                                    <i className="fa-solid fa-bullseye"></i>
                                    Recommendations
                                </h2>
                                {reportInsights.recommendations && reportInsights.recommendations.length > 0 && (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Priority</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Action</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Impact</th>
                                                    <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Effort</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportInsights.recommendations.map((rec, idx) => (
                                                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                                                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                                                            <span style={{ 
                                                                padding: '0.25rem 0.5rem', 
                                                                borderRadius: '4px', 
                                                                fontSize: '0.85rem',
                                                                fontWeight: 'bold',
                                                                backgroundColor: rec.priority === 'High' ? '#ff6b6b' : rec.priority === 'Medium' ? '#ffa500' : '#95e1d3',
                                                                color: 'white'
                                                            }}>
                                                                {rec.priority}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{rec.action}</td>
                                                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{rec.impact}</td>
                                                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{rec.effort}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {reportInsights.performanceProjections && (
                                <div className="section">
                                    <h2>
                                        <i className="fa-solid fa-chart-line"></i>
                                        Performance Projections
                                    </h2>
                                    <div style={{ marginTop: '1rem' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px solid #667eea' }}>
                                                <div style={{ fontSize: '0.85rem', color: '#777', marginBottom: '0.5rem' }}>Estimated Impressions</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                                                    {reportInsights.performanceProjections.estimatedImpressions}
                                                </div>
                                            </div>
                                            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px solid #667eea' }}>
                                                <div style={{ fontSize: '0.85rem', color: '#777', marginBottom: '0.5rem' }}>Estimated Clicks</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                                                    {reportInsights.performanceProjections.estimatedClicks}
                                                </div>
                                            </div>
                                            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px solid #667eea' }}>
                                                <div style={{ fontSize: '0.85rem', color: '#777', marginBottom: '0.5rem' }}>Estimated Conversions</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                                                    {reportInsights.performanceProjections.estimatedConversions}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {reportInsights.performanceProjections.assumptions && reportInsights.performanceProjections.assumptions.length > 0 && (
                                            <div>
                                                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#667eea' }}>Key Assumptions</h4>
                                                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
                                                    {reportInsights.performanceProjections.assumptions.map((assumption, idx) => (
                                                        <li key={idx} style={{ marginBottom: '0.5rem', color: '#555' }}>{assumption}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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
