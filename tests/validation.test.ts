// @vitest-environment jsdom

/**
 * Tests for Campaign Template Validation
 * 
 * This file validates that campaign templates follow Amazon Ads best practices
 * and adhere to the validation rules specified in the campaign taxonomy.
 */
import { describe, it, expect } from 'vitest';
import { campaignValidators, CampaignValidationContext } from '../utils/validation';

describe('Campaign Template Validation', () => {
    
    describe('SP_AUTO_RESEARCH Validation', () => {
        it('should require AUTO targeting type', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_AUTO_RESEARCH',
                type: 'SP',
                match: 'BROAD', // Wrong - should be AUTO
                theme: 'RESEARCH',
            };
            const result = campaignValidators.validateSpAutoResearch(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Auto targeting');
        });

        it('should not allow manual keywords', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_AUTO_RESEARCH',
                type: 'SP',
                match: 'AUTO',
                theme: 'RESEARCH',
                keywords: [{ text: 'test keyword', matchType: 'BROAD' }],
            };
            const result = campaignValidators.validateSpAutoResearch(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('cannot have manual keywords');
        });

        it('should not allow product targets', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_AUTO_RESEARCH',
                type: 'SP',
                match: 'AUTO',
                theme: 'RESEARCH',
                productTargets: ['B0ABC123DE'],
            };
            const result = campaignValidators.validateSpAutoResearch(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('cannot have product targets');
        });

        it('should enforce bid ≤ 70% of suggested bid', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_AUTO_RESEARCH',
                type: 'SP',
                match: 'AUTO',
                theme: 'RESEARCH',
                defaultBid: 1.00,
                suggestedBid: 1.00, // 100% of suggested, should be ≤ 70%
            };
            const result = campaignValidators.validateSpAutoResearch(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('70%');
        });

        it('should pass validation with correct settings', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_AUTO_RESEARCH',
                type: 'SP',
                match: 'AUTO',
                theme: 'RESEARCH',
                defaultBid: 0.70,
                suggestedBid: 1.00,
            };
            const result = campaignValidators.validateSpAutoResearch(context);
            expect(result.isValid).toBe(true);
        });
    });

    describe('SP_BROAD_RESEARCH Validation', () => {
        it('should require BROAD match type', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_BROAD_RESEARCH',
                type: 'SP',
                match: 'EXACT',
                theme: 'RESEARCH',
            };
            const result = campaignValidators.validateSpBroadResearch(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Broad match');
        });

        it('should only allow BROAD match keywords', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_BROAD_RESEARCH',
                type: 'SP',
                match: 'BROAD',
                theme: 'RESEARCH',
                keywords: [
                    { text: 'keyword 1', matchType: 'BROAD' },
                    { text: 'keyword 2', matchType: 'EXACT' }, // Wrong match type
                ],
            };
            const result = campaignValidators.validateSpBroadResearch(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('only contain Broad match');
        });

        it('should enforce max 50 keywords per ad group', () => {
            const keywords = Array.from({ length: 51 }, (_, i) => ({
                text: `keyword ${i}`,
                matchType: 'BROAD'
            }));
            const context: CampaignValidationContext = {
                campaignType: 'SP_BROAD_RESEARCH',
                type: 'SP',
                match: 'BROAD',
                theme: 'RESEARCH',
                keywords,
            };
            const result = campaignValidators.validateSpBroadResearch(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('max 50 keywords');
        });

        it('should enforce bid ≤ 80% of suggested bid', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_BROAD_RESEARCH',
                type: 'SP',
                match: 'BROAD',
                theme: 'RESEARCH',
                defaultBid: 1.00,
                suggestedBid: 1.00,
            };
            const result = campaignValidators.validateSpBroadResearch(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('80%');
        });
    });

    describe('SP_EXACT_PERFORMANCE Validation', () => {
        it('should require EXACT match type', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_EXACT_PERFORMANCE',
                type: 'SP',
                match: 'BROAD',
                theme: 'PERFORMANCE',
            };
            const result = campaignValidators.validateSpExactPerformance(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Exact match');
        });

        it('should only allow EXACT match keywords', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_EXACT_PERFORMANCE',
                type: 'SP',
                match: 'EXACT',
                theme: 'PERFORMANCE',
                keywords: [
                    { text: 'keyword 1', matchType: 'EXACT' },
                    { text: 'keyword 2', matchType: 'BROAD' },
                ],
            };
            const result = campaignValidators.validateSpExactPerformance(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('only contain Exact match');
        });

        it('should enforce max 15 keywords per ad group', () => {
            const keywords = Array.from({ length: 16 }, (_, i) => ({
                text: `keyword ${i}`,
                matchType: 'EXACT'
            }));
            const context: CampaignValidationContext = {
                campaignType: 'SP_EXACT_PERFORMANCE',
                type: 'SP',
                match: 'EXACT',
                theme: 'PERFORMANCE',
                keywords,
                bidStrategy: 'up_down',
                tosModifier: 20,
            };
            const result = campaignValidators.validateSpExactPerformance(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('max 15 keywords');
        });

        it('should require up_down bid strategy', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_EXACT_PERFORMANCE',
                type: 'SP',
                match: 'EXACT',
                theme: 'PERFORMANCE',
                bidStrategy: 'down',
                tosModifier: 20,
            };
            const result = campaignValidators.validateSpExactPerformance(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('up and down');
        });

        it('should enforce TOS modifier ≥ 20%', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_EXACT_PERFORMANCE',
                type: 'SP',
                match: 'EXACT',
                theme: 'PERFORMANCE',
                bidStrategy: 'up_down',
                tosModifier: 15,
            };
            const result = campaignValidators.validateSpExactPerformance(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('≥ 20%');
        });
    });

    describe('SP_EXACT_SKAG Validation', () => {
        it('should require exactly 1 keyword per ad group', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_EXACT_SKAG',
                type: 'SP',
                match: 'EXACT',
                theme: 'SKAG',
                keywords: [
                    { text: 'keyword 1', matchType: 'EXACT' },
                    { text: 'keyword 2', matchType: 'EXACT' },
                ],
            };
            const result = campaignValidators.validateSpExactSkag(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('exactly 1 keyword');
        });

        it('should require EXACT match type', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_EXACT_SKAG',
                type: 'SP',
                match: 'BROAD',
                theme: 'SKAG',
            };
            const result = campaignValidators.validateSpExactSkag(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Exact match');
        });

        it('should enforce TOS modifier ≥ 30%', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_EXACT_SKAG',
                type: 'SP',
                match: 'EXACT',
                theme: 'SKAG',
                tosModifier: 20,
                keywords: [{ text: 'keyword', matchType: 'EXACT' }],
            };
            const result = campaignValidators.validateSpExactSkag(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('≥ 30%');
        });
    });

    describe('SP_BRANDED Validation', () => {
        it('should require keywords to contain brand name', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_BRANDED_UMBRELLA',
                type: 'SP',
                match: 'EXACT',
                theme: 'BRANDED',
                keywords: [
                    { text: 'mybrand product', matchType: 'EXACT' },
                    { text: 'generic term', matchType: 'EXACT' }, // Missing brand name
                ],
            };
            const result = campaignValidators.validateSpBranded(context, 'mybrand');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('brand name');
        });

        it('should only allow EXACT and PHRASE match types', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_BRANDED_UMBRELLA',
                type: 'SP',
                match: 'EXACT',
                theme: 'BRANDED',
                keywords: [
                    { text: 'mybrand product', matchType: 'BROAD' },
                ],
            };
            const result = campaignValidators.validateSpBranded(context, 'mybrand');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Exact and Phrase');
        });

        it('should enforce budget ≤ 10%', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_BRANDED_UMBRELLA',
                type: 'SP',
                match: 'EXACT',
                theme: 'BRANDED',
                budgetAllocation: 15,
            };
            const result = campaignValidators.validateSpBranded(context, 'mybrand');
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('≤ 10%');
        });
    });

    describe('SP Product Targeting Validation', () => {
        it('should require PT targeting type', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_PT_COMP_ASIN',
                type: 'SP',
                match: 'EXACT',
                theme: 'COMP',
            };
            const result = campaignValidators.validateSpProductTargeting(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('PT targeting');
        });

        it('should not allow keywords', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_PT_COMP_ASIN',
                type: 'SP',
                match: 'PT',
                theme: 'COMP',
                keywords: [{ text: 'keyword', matchType: 'EXACT' }],
                productTargets: ['B0ABC123DE'],
            };
            const result = campaignValidators.validateSpProductTargeting(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('cannot have keywords');
        });

        it('should require product targets', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_PT_COMP_ASIN',
                type: 'SP',
                match: 'PT',
                theme: 'COMP',
                productTargets: [],
            };
            const result = campaignValidators.validateSpProductTargeting(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('must have product targets');
        });

        it('should pass with valid PT campaign', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_PT_COMP_ASIN',
                type: 'SP',
                match: 'PT',
                theme: 'COMP',
                productTargets: ['B0ABC123DE', 'B0XYZ789FG'],
            };
            const result = campaignValidators.validateSpProductTargeting(context);
            expect(result.isValid).toBe(true);
        });
    });

    describe('SB Campaign Validation', () => {
        it('should validate SB EXACT campaigns', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SB_EXACT_BRANDED',
                type: 'SB',
                match: 'EXACT',
                theme: 'BRANDED',
            };
            const result = campaignValidators.validateSbExact(context);
            expect(result.isValid).toBe(true);
        });

        it('should require EXACT match for SB_EXACT campaigns', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SB_EXACT_BRANDED',
                type: 'SB',
                match: 'BROAD',
                theme: 'BRANDED',
            };
            const result = campaignValidators.validateSbExact(context);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('Exact match');
        });

        it('should validate SB BROAD campaigns', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SB_BROAD_RESEARCH',
                type: 'SB',
                match: 'BROAD',
                theme: 'RESEARCH',
            };
            const result = campaignValidators.validateSbBroad(context);
            expect(result.isValid).toBe(true);
        });

        it('should validate SB VIDEO campaigns', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SB_VIDEO_AWARENESS',
                type: 'SB',
                match: 'VIDEO',
                theme: 'AWARENESS',
            };
            const result = campaignValidators.validateSbVideo(context);
            expect(result.isValid).toBe(true);
        });
    });

    describe('SD Campaign Validation', () => {
        it('should validate SD REMARKETING campaigns', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SD_REMARKETING_VIEWS',
                type: 'SD',
                match: 'PT',
                theme: 'REMARKETING',
            };
            const result = campaignValidators.validateSdRemarketing(context);
            expect(result.isValid).toBe(true);
        });

        it('should require SD type for remarketing', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SD_REMARKETING_VIEWS',
                type: 'SP',
                match: 'PT',
                theme: 'REMARKETING',
            };
            const result = campaignValidators.validateSdRemarketing(context);
            expect(result.isValid).toBe(false);
        });

        it('should validate SD AUDIENCE campaigns', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SD_AUDIENCE_INMARKET',
                type: 'SD',
                match: 'PT',
                theme: 'AUDIENCE',
            };
            const result = campaignValidators.validateSdAudience(context);
            expect(result.isValid).toBe(true);
        });

        it('should validate SD Product Targeting campaigns', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SD_PT_COMP',
                type: 'SD',
                match: 'PT',
                theme: 'COMP',
                productTargets: ['B0ABC123DE'],
            };
            const result = campaignValidators.validateSdProductTargeting(context);
            expect(result.isValid).toBe(true);
        });
    });

    describe('Master Validator', () => {
        it('should route to correct validator for SP_AUTO_RESEARCH', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_AUTO_RESEARCH',
                type: 'SP',
                match: 'AUTO',
                theme: 'RESEARCH',
            };
            const result = campaignValidators.validateCampaignTemplate(context);
            expect(result.isValid).toBe(true);
        });

        it('should route to correct validator for SP_EXACT_PERFORMANCE', () => {
            const context: CampaignValidationContext = {
                campaignType: 'SP_EXACT_PERFORMANCE',
                type: 'SP',
                match: 'EXACT',
                theme: 'PERFORMANCE',
                bidStrategy: 'up_down',
                tosModifier: 30,
            };
            const result = campaignValidators.validateCampaignTemplate(context);
            expect(result.isValid).toBe(true);
        });

        it('should handle unknown campaign types gracefully', () => {
            const context: CampaignValidationContext = {
                campaignType: 'UNKNOWN_TYPE',
                type: 'SP',
                match: 'EXACT',
                theme: 'CUSTOM',
            };
            const result = campaignValidators.validateCampaignTemplate(context);
            expect(result.isValid).toBe(true); // Unknown types pass by default
        });
    });

    describe('General Guardrails', () => {
        it('should validate bid cap', () => {
            const result = campaignValidators.validateBidCap(2.50, 2.00);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('max CPC ceiling');
        });

        it('should validate budget allocation', () => {
            let result = campaignValidators.validateBudgetAllocation(150, 1000);
            expect(result.isValid).toBe(false);
            
            result = campaignValidators.validateBudgetAllocation(50, 1000);
            expect(result.isValid).toBe(true);
        });
    });
});
