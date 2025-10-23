/**
 * AI Report Generator Utility
 * 
 * This module handles AI-powered report generation for PPC plans.
 * It provides a clean, modular approach to generating insights using Google Gemini AI.
 */

import { GoogleGenAI, Type } from "@google/genai";

export interface WorkspaceData {
    brand: string;
    campaigns: any[];
    adGroups: any[];
    keywords: any[];
    products: any[];
    goals?: any[];
}

export interface ReportInsights {
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

/**
 * Calculate plan metrics from workspace data
 */
export function calculatePlanMetrics(workspace: WorkspaceData) {
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
    }, {} as Record<string, number>);

    const campaignThemes = workspace.campaigns.reduce((acc, c) => {
        acc[c.theme] = (acc[c.theme] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const intentBreakdown = workspace.keywords.reduce((acc, k) => {
        acc[k.intent] = (acc[k.intent] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const matchTypeBreakdown = workspace.keywords.reduce((acc, k) => {
        const matchType = k.matchType || 'BROAD';
        acc[matchType] = (acc[matchType] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const campaignTypeDetails = workspace.campaigns.reduce((acc, c) => {
        if (!acc[c.type]) {
            acc[c.type] = { count: 0, totalBudget: 0 };
        }
        acc[c.type].count += 1;
        acc[c.type].totalBudget += c.budget || 0;
        return acc;
    }, {} as Record<string, {count: number, totalBudget: number}>);

    const averageBid = totalAdGroups > 0 
        ? workspace.adGroups.reduce((sum, ag) => sum + (ag.defaultBid || 0), 0) / totalAdGroups
        : 0;

    const goals = workspace.goals || [];
    const goalsWithCampaigns = goals.map(g => {
        const campaign = workspace.campaigns.find(c => c.id === g.campaignId);
        return {
            campaignName: campaign?.name || 'Unknown Campaign',
            goalType: g.type,
            targetValue: g.value
        };
    });

    return {
        totalCampaigns,
        totalAdGroups,
        totalKeywords,
        totalProducts,
        totalBudget,
        assignedKeywordsCount,
        campaignTypes,
        campaignThemes,
        intentBreakdown,
        matchTypeBreakdown,
        campaignTypeDetails,
        averageBid,
        goals,
        goalsWithCampaigns
    };
}

/**
 * Build the AI prompt for report generation
 */
export function buildPrompt(workspace: WorkspaceData, metrics: ReturnType<typeof calculatePlanMetrics>): string {
    const assignmentRate = metrics.totalKeywords > 0 
        ? ((metrics.assignedKeywordsCount / metrics.totalKeywords) * 100).toFixed(0) 
        : 0;

    return `You are an elite Amazon PPC strategist with 10+ years of experience, specializing in creating comprehensive, data-driven campaign analysis reports for brand stakeholders and executives.

Analyze this PPC plan for brand "${workspace.brand}" and provide strategic, actionable insights:

═══ CAMPAIGN OVERVIEW ═══
• Total Campaigns: ${metrics.totalCampaigns}
• Total Ad Groups: ${metrics.totalAdGroups}
• Daily Budget: $${metrics.totalBudget.toFixed(2)}
• Campaign Types: ${JSON.stringify(metrics.campaignTypes)}
• Campaign Themes: ${JSON.stringify(metrics.campaignThemes)}
• Budget by Type: ${JSON.stringify(metrics.campaignTypeDetails)}

═══ KEYWORD STRATEGY ═══
• Total Keywords: ${metrics.totalKeywords}
• Assigned: ${metrics.assignedKeywordsCount} (${assignmentRate}%)
• Unassigned: ${metrics.totalKeywords - metrics.assignedKeywordsCount}
• Intent Distribution: ${JSON.stringify(metrics.intentBreakdown)}
• Match Type Distribution: ${JSON.stringify(metrics.matchTypeBreakdown)}

═══ BIDDING & PRODUCTS ═══
• Average Default Bid: $${metrics.averageBid.toFixed(2)}
• Total Products: ${metrics.totalProducts}

═══ PERFORMANCE GOALS ═══
${metrics.goals.length > 0 
    ? metrics.goalsWithCampaigns.map(g => `• ${g.campaignName}: ${g.goalType} = ${g.targetValue}${g.goalType.includes('ACoS') || g.goalType.includes('CTR') || g.goalType.includes('CVR') ? '%' : g.goalType.includes('CPC') ? ' $' : 'x'}`).join('\n')
    : '• No performance goals set'}

═══ REQUIRED ANALYSIS ═══

Generate a comprehensive, executive-level report with the following sections:

1. **Executive Summary** (3-4 sentences)
   - Provide strategic overview of the plan's strength and market positioning
   - Highlight expected business outcomes and competitive advantages
   - Set clear expectations for stakeholders

2. **Key Strengths** (5-7 specific points)
   - Identify competitive advantages in the campaign structure
   - Highlight strategic decisions that demonstrate best practices
   - Note any particularly strong areas (budget allocation, keyword coverage, etc.)

3. **Growth Opportunities** (5-7 actionable recommendations)
   - Identify areas where performance could be enhanced
   - Suggest expansion opportunities (new keywords, campaigns, etc.)
   - Recommend optimization tactics with clear business impact

4. **Areas of Concern** (3-5 critical issues)
   - Flag potential risks or weaknesses
   - Identify gaps in strategy or execution
   - Note any red flags that need immediate attention

5. **Budget Analysis** (3-4 sentences)
   - Evaluate budget adequacy for achieving goals
   - Assess allocation efficiency across campaign types
   - Recommend budget rebalancing if needed

6. **Budget Breakdown** (structured data)
   - Break down budget by campaign type with percentages

7. **Keyword Strategy Assessment** (3-4 sentences)
   - Evaluate keyword coverage and relevance
   - Assess match type distribution strategy
   - Identify keyword gaps or opportunities

8. **Keyword Metrics** (detailed breakdown)
   - Provide complete metrics with intent and match type distributions

9. **Campaign Structure Evaluation** (3-4 sentences)
   - Assess organizational quality and scalability
   - Evaluate theme-based segmentation effectiveness
   - Recommend structural improvements

10. **Campaign Metrics** (structured data)
    - Detailed breakdown by type and theme

11. **Goals Analysis** (3-4 sentences)
    - Evaluate if goals are realistic and achievable
    - Assess alignment between goals and budget/strategy
    - Identify missing or inadequate goal-setting

12. **Goals Breakdown** (structured data)
    - List all goals by campaign

13. **Prioritized Recommendations** (6-8 actions)
    - Rank by impact and effort
    - Provide clear, specific action items
    - Include expected outcomes for each

14. **Performance Projections** (data-driven estimates)
    - Project realistic performance ranges
    - Include 3-4 key assumptions backing the projections

═══ OUTPUT REQUIREMENTS ═══
• Be specific with numbers and percentages throughout
• Use professional language suitable for executive presentation
• Focus on ROI and business outcomes
• Provide actionable, not generic, recommendations
• Base all insights on the actual data provided
• Be honest about weaknesses while maintaining a constructive tone`;
}

/**
 * Define the JSON schema for AI response
 */
export function getResponseSchema() {
    return {
        type: Type.OBJECT,
        properties: {
            executiveSummary: {
                type: Type.STRING,
                description: '3-4 sentence executive summary with strategic overview'
            },
            strengths: {
                type: Type.ARRAY,
                description: 'List of 5-7 key strengths with specific competitive advantages',
                items: { type: Type.STRING }
            },
            opportunities: {
                type: Type.ARRAY,
                description: 'List of 5-7 growth opportunities with specific business impact',
                items: { type: Type.STRING }
            },
            weaknesses: {
                type: Type.ARRAY,
                description: 'List of 3-5 areas of concern or risk',
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
                description: '3-4 sentence evaluation of goals: realism, alignment, gaps'
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
        required: [
            'executiveSummary',
            'strengths',
            'opportunities',
            'weaknesses',
            'budgetAnalysis',
            'budgetBreakdown',
            'keywordStrategy',
            'keywordMetrics',
            'campaignStructure',
            'campaignMetrics',
            'goalsAnalysis',
            'goalsBreakdown',
            'recommendations',
            'performanceProjections'
        ]
    };
}

/**
 * Validate the AI response to ensure all required fields are present
 */
export function validateReportInsights(data: any): data is ReportInsights {
    if (!data || typeof data !== 'object') return false;

    const requiredFields = [
        'executiveSummary',
        'strengths',
        'opportunities',
        'weaknesses',
        'budgetAnalysis',
        'budgetBreakdown',
        'keywordStrategy',
        'keywordMetrics',
        'campaignStructure',
        'campaignMetrics',
        'goalsAnalysis',
        'goalsBreakdown',
        'recommendations',
        'performanceProjections'
    ];

    for (const field of requiredFields) {
        if (!(field in data)) {
            console.error(`Missing required field: ${field}`);
            return false;
        }
    }

    // Validate array fields
    if (!Array.isArray(data.strengths) || data.strengths.length === 0) {
        console.error('strengths must be a non-empty array');
        return false;
    }

    if (!Array.isArray(data.opportunities) || data.opportunities.length === 0) {
        console.error('opportunities must be a non-empty array');
        return false;
    }

    if (!Array.isArray(data.weaknesses) || data.weaknesses.length === 0) {
        console.error('weaknesses must be a non-empty array');
        return false;
    }

    if (!Array.isArray(data.recommendations) || data.recommendations.length === 0) {
        console.error('recommendations must be a non-empty array');
        return false;
    }

    return true;
}

/**
 * Generate AI-powered report insights
 */
export async function generateReportInsights(
    workspace: WorkspaceData,
    apiKey: string
): Promise<ReportInsights> {
    // Validate API key
    if (!apiKey || apiKey === 'undefined') {
        throw new Error('API key is not configured. Please set the API_KEY environment variable.');
    }

    // Calculate metrics
    const metrics = calculatePlanMetrics(workspace);

    // Build prompt
    const prompt = buildPrompt(workspace, metrics);

    // Initialize AI client
    const ai = new GoogleGenAI({ apiKey });

    // Call AI API
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-001",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: getResponseSchema()
        }
    });

    // Parse and validate response
    const responseText = response.text?.trim();
    if (!responseText) {
        throw new Error('Empty response from AI service');
    }

    let insights: any;
    try {
        insights = JSON.parse(responseText);
    } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error(
            `Failed to parse AI response: ${
                parseError instanceof Error ? parseError.message : 'Invalid JSON format'
            }`
        );
    }

    // Validate the parsed insights
    if (!validateReportInsights(insights)) {
        throw new Error('AI response does not meet required schema');
    }

    return insights as ReportInsights;
}

/**
 * Generate report with retry logic
 */
export async function generateReportWithRetry(
    workspace: WorkspaceData,
    apiKey: string,
    maxRetries: number = 2
): Promise<ReportInsights> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await generateReportInsights(workspace, apiKey);
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.warn(`Report generation attempt ${attempt + 1} failed:`, lastError.message);
            
            // Don't retry on API key errors
            if (lastError.message.includes('API key')) {
                throw lastError;
            }

            // Wait before retrying (exponential backoff)
            if (attempt < maxRetries) {
                const waitTime = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }

    throw new Error(
        `Failed to generate report after ${maxRetries + 1} attempts. Last error: ${lastError?.message}`
    );
}
