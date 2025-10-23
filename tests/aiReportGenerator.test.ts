/**
 * Unit tests for AI Report Generator utility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    calculatePlanMetrics,
    buildPrompt,
    validateReportInsights,
    generateReportInsights,
    generateReportWithRetry,
    type WorkspaceData,
    type ReportInsights
} from '../utils/aiReportGenerator';

// Mock workspace data for testing
const mockWorkspace: WorkspaceData = {
    brand: 'TestBrand',
    campaigns: [
        {
            id: 'c1',
            name: 'Test Campaign 1',
            type: 'Sponsored Products',
            theme: 'Brand',
            budget: 100
        },
        {
            id: 'c2',
            name: 'Test Campaign 2',
            type: 'Sponsored Brands',
            theme: 'Generic',
            budget: 150
        }
    ],
    adGroups: [
        {
            id: 'ag1',
            campaignId: 'c1',
            name: 'Ad Group 1',
            defaultBid: 1.50,
            keywords: [{ id: 'k1' }, { id: 'k2' }]
        },
        {
            id: 'ag2',
            campaignId: 'c2',
            name: 'Ad Group 2',
            defaultBid: 2.00,
            keywords: [{ id: 'k3' }]
        }
    ],
    keywords: [
        {
            id: 'k1',
            text: 'keyword one',
            intent: 'Branded',
            matchType: 'EXACT'
        },
        {
            id: 'k2',
            text: 'keyword two',
            intent: 'Generic',
            matchType: 'BROAD'
        },
        {
            id: 'k3',
            text: 'keyword three',
            intent: 'Competitor',
            matchType: 'PHRASE'
        },
        {
            id: 'k4',
            text: 'keyword four',
            intent: 'Generic',
            matchType: 'BROAD'
        }
    ],
    products: [
        { id: 'p1', sku: 'SKU1', asin: 'ASIN1' },
        { id: 'p2', sku: 'SKU2', asin: 'ASIN2' }
    ],
    goals: [
        {
            id: 'g1',
            campaignId: 'c1',
            type: 'Target ACoS',
            value: 25
        },
        {
            id: 'g2',
            campaignId: 'c2',
            type: 'Target ROAS',
            value: 3.5
        }
    ]
};

const mockValidReportInsights: ReportInsights = {
    executiveSummary: 'This is a test executive summary providing strategic overview.',
    strengths: [
        'Strong budget allocation',
        'Diverse campaign types',
        'Good keyword coverage'
    ],
    opportunities: [
        'Expand to new keywords',
        'Increase budget for top performers',
        'Test new ad formats'
    ],
    weaknesses: [
        'Low keyword assignment rate',
        'Limited product coverage'
    ],
    budgetAnalysis: 'Budget is adequately allocated across campaign types.',
    budgetBreakdown: [
        { campaignType: 'Sponsored Products', amount: 100, percentage: 40 },
        { campaignType: 'Sponsored Brands', amount: 150, percentage: 60 }
    ],
    keywordStrategy: 'The keyword strategy shows good intent distribution.',
    keywordMetrics: {
        totalKeywords: 4,
        assignedKeywords: 3,
        unassignedKeywords: 1,
        byIntent: [
            { intent: 'Branded', count: 1, percentage: 25 },
            { intent: 'Generic', count: 2, percentage: 50 },
            { intent: 'Competitor', count: 1, percentage: 25 }
        ],
        byMatchType: [
            { matchType: 'EXACT', count: 1, percentage: 25 },
            { matchType: 'BROAD', count: 2, percentage: 50 },
            { matchType: 'PHRASE', count: 1, percentage: 25 }
        ]
    },
    campaignStructure: 'Campaign structure is well-organized with clear themes.',
    campaignMetrics: {
        byCampaignType: [
            { type: 'Sponsored Products', count: 1, avgBudget: 100 },
            { type: 'Sponsored Brands', count: 1, avgBudget: 150 }
        ],
        byTheme: [
            { theme: 'Brand', count: 1 },
            { theme: 'Generic', count: 1 }
        ]
    },
    goalsAnalysis: 'Goals are realistic and aligned with budget allocation.',
    goalsBreakdown: [
        { campaignName: 'Test Campaign 1', goalType: 'Target ACoS', targetValue: 25 },
        { campaignName: 'Test Campaign 2', goalType: 'Target ROAS', targetValue: 3.5 }
    ],
    recommendations: [
        {
            priority: 'High',
            action: 'Assign remaining keywords to ad groups',
            impact: 'Increase impression share',
            effort: 'Low'
        },
        {
            priority: 'Medium',
            action: 'Add more products to campaigns',
            impact: 'Expand product coverage',
            effort: 'Medium'
        }
    ],
    performanceProjections: {
        estimatedImpressions: '10,000 - 15,000',
        estimatedClicks: '500 - 750',
        estimatedConversions: '25 - 40',
        assumptions: [
            'Average CTR of 5%',
            'Conversion rate of 5%',
            'Consistent budget throughout month'
        ]
    }
};

describe('AI Report Generator Utility', () => {
    describe('calculatePlanMetrics', () => {
        it('should calculate correct total campaigns', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.totalCampaigns).toBe(2);
        });

        it('should calculate correct total ad groups', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.totalAdGroups).toBe(2);
        });

        it('should calculate correct total keywords', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.totalKeywords).toBe(4);
        });

        it('should calculate correct total products', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.totalProducts).toBe(2);
        });

        it('should calculate correct total budget', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.totalBudget).toBe(250);
        });

        it('should calculate correct assigned keywords count', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.assignedKeywordsCount).toBe(3);
        });

        it('should calculate correct campaign types breakdown', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.campaignTypes).toEqual({
                'Sponsored Products': 1,
                'Sponsored Brands': 1
            });
        });

        it('should calculate correct campaign themes breakdown', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.campaignThemes).toEqual({
                'Brand': 1,
                'Generic': 1
            });
        });

        it('should calculate correct intent breakdown', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.intentBreakdown).toEqual({
                'Branded': 1,
                'Generic': 2,
                'Competitor': 1
            });
        });

        it('should calculate correct match type breakdown', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.matchTypeBreakdown).toEqual({
                'EXACT': 1,
                'BROAD': 2,
                'PHRASE': 1
            });
        });

        it('should calculate correct average bid', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.averageBid).toBe(1.75);
        });

        it('should map goals to campaign names correctly', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            expect(metrics.goalsWithCampaigns).toHaveLength(2);
            expect(metrics.goalsWithCampaigns[0].campaignName).toBe('Test Campaign 1');
            expect(metrics.goalsWithCampaigns[1].campaignName).toBe('Test Campaign 2');
        });

        it('should handle workspace with no goals', () => {
            const workspaceNoGoals = { ...mockWorkspace, goals: [] };
            const metrics = calculatePlanMetrics(workspaceNoGoals);
            expect(metrics.goals).toEqual([]);
            expect(metrics.goalsWithCampaigns).toEqual([]);
        });

        it('should handle empty workspace', () => {
            const emptyWorkspace: WorkspaceData = {
                brand: 'Empty',
                campaigns: [],
                adGroups: [],
                keywords: [],
                products: [],
                goals: []
            };
            const metrics = calculatePlanMetrics(emptyWorkspace);
            expect(metrics.totalCampaigns).toBe(0);
            expect(metrics.totalBudget).toBe(0);
            expect(metrics.averageBid).toBe(0);
        });
    });

    describe('buildPrompt', () => {
        it('should generate a valid prompt string', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            const prompt = buildPrompt(mockWorkspace, metrics);
            
            expect(prompt).toContain('TestBrand');
            expect(prompt).toContain('Total Campaigns: 2');
            expect(prompt).toContain('Total Keywords: 4');
        });

        it('should include all major sections', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            const prompt = buildPrompt(mockWorkspace, metrics);
            
            expect(prompt).toContain('CAMPAIGN OVERVIEW');
            expect(prompt).toContain('KEYWORD STRATEGY');
            expect(prompt).toContain('BIDDING & PRODUCTS');
            expect(prompt).toContain('PERFORMANCE GOALS');
            expect(prompt).toContain('REQUIRED ANALYSIS');
        });

        it('should format budget correctly', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            const prompt = buildPrompt(mockWorkspace, metrics);
            
            expect(prompt).toContain('Daily Budget: $250.00');
        });

        it('should calculate assignment rate correctly', () => {
            const metrics = calculatePlanMetrics(mockWorkspace);
            const prompt = buildPrompt(mockWorkspace, metrics);
            
            // 3 assigned out of 4 total = 75%
            expect(prompt).toContain('Assigned: 3 (75%)');
        });

        it('should handle workspace with no goals', () => {
            const workspaceNoGoals = { ...mockWorkspace, goals: [] };
            const metrics = calculatePlanMetrics(workspaceNoGoals);
            const prompt = buildPrompt(workspaceNoGoals, metrics);
            
            expect(prompt).toContain('No performance goals set');
        });
    });

    describe('validateReportInsights', () => {
        it('should validate a complete and valid report', () => {
            expect(validateReportInsights(mockValidReportInsights)).toBe(true);
        });

        it('should reject null or undefined input', () => {
            expect(validateReportInsights(null)).toBe(false);
            expect(validateReportInsights(undefined)).toBe(false);
        });

        it('should reject non-object input', () => {
            expect(validateReportInsights('string')).toBe(false);
            expect(validateReportInsights(123)).toBe(false);
            expect(validateReportInsights([])).toBe(false);
        });

        it('should reject report missing executiveSummary', () => {
            const invalid = { ...mockValidReportInsights };
            delete (invalid as any).executiveSummary;
            expect(validateReportInsights(invalid)).toBe(false);
        });

        it('should reject report missing strengths', () => {
            const invalid = { ...mockValidReportInsights };
            delete (invalid as any).strengths;
            expect(validateReportInsights(invalid)).toBe(false);
        });

        it('should reject report with empty strengths array', () => {
            const invalid = { ...mockValidReportInsights, strengths: [] };
            expect(validateReportInsights(invalid)).toBe(false);
        });

        it('should reject report with empty opportunities array', () => {
            const invalid = { ...mockValidReportInsights, opportunities: [] };
            expect(validateReportInsights(invalid)).toBe(false);
        });

        it('should reject report with empty weaknesses array', () => {
            const invalid = { ...mockValidReportInsights, weaknesses: [] };
            expect(validateReportInsights(invalid)).toBe(false);
        });

        it('should reject report with empty recommendations array', () => {
            const invalid = { ...mockValidReportInsights, recommendations: [] };
            expect(validateReportInsights(invalid)).toBe(false);
        });

        it('should reject report missing budgetBreakdown', () => {
            const invalid = { ...mockValidReportInsights };
            delete (invalid as any).budgetBreakdown;
            expect(validateReportInsights(invalid)).toBe(false);
        });

        it('should reject report missing performanceProjections', () => {
            const invalid = { ...mockValidReportInsights };
            delete (invalid as any).performanceProjections;
            expect(validateReportInsights(invalid)).toBe(false);
        });
    });

    describe('generateReportInsights', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should throw error when API key is missing', async () => {
            await expect(
                generateReportInsights(mockWorkspace, '')
            ).rejects.toThrow('API key is not configured');
        });

        it('should throw error when API key is "undefined"', async () => {
            await expect(
                generateReportInsights(mockWorkspace, 'undefined')
            ).rejects.toThrow('API key is not configured');
        });

        // Note: Testing the actual AI API call requires mocking the GoogleGenAI module
        // which is complex. The key logic (metrics, prompt, validation) is tested above.
    });

    describe('generateReportWithRetry', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should throw error when API key is missing', async () => {
            await expect(
                generateReportWithRetry(mockWorkspace, '', 0)
            ).rejects.toThrow('API key is not configured');
        });

        it('should not retry on API key errors', async () => {
            const startTime = Date.now();
            await expect(
                generateReportWithRetry(mockWorkspace, '', 2)
            ).rejects.toThrow('API key is not configured');
            const duration = Date.now() - startTime;
            
            // Should fail immediately without retry delays
            expect(duration).toBeLessThan(100);
        });
    });
});
