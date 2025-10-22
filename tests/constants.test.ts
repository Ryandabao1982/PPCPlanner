// @vitest-environment jsdom

/**
 * Tests for Constants Utility
 * 
 * This file tests the constant configurations including:
 * - NAMING_COMPONENTS: Campaign naming options
 * - AUTO_TARGETING: Auto targeting types
 * - BIDDING_STRATEGIES: Available bid strategies
 * - CAMPAIGN_PLAYBOOK: Campaign templates and configurations
 */
import { describe, it, expect } from 'vitest';
import { 
    NAMING_COMPONENTS, 
    AUTO_TARGETING, 
    BIDDING_STRATEGIES,
    CAMPAIGN_PLAYBOOK
} from '../utils/constants';

describe('Constants Utility', () => {
    describe('NAMING_COMPONENTS', () => {
        it('should have country options', () => {
            expect(NAMING_COMPONENTS.COUNTRY).toBeDefined();
            expect(NAMING_COMPONENTS.COUNTRY.length).toBeGreaterThan(0);
            expect(NAMING_COMPONENTS.COUNTRY).toContainEqual({ value: 'US', label: 'US' });
            expect(NAMING_COMPONENTS.COUNTRY).toContainEqual({ value: 'UK', label: 'UK' });
        });

        it('should have campaign type options', () => {
            expect(NAMING_COMPONENTS.TYPE).toBeDefined();
            expect(NAMING_COMPONENTS.TYPE).toContainEqual({ value: 'SP', label: 'Sponsored Products' });
            expect(NAMING_COMPONENTS.TYPE).toContainEqual({ value: 'SB', label: 'Sponsored Brands' });
            expect(NAMING_COMPONENTS.TYPE).toContainEqual({ value: 'SD', label: 'Sponsored Display' });
        });

        it('should have match type options', () => {
            expect(NAMING_COMPONENTS.MATCH).toBeDefined();
            expect(NAMING_COMPONENTS.MATCH).toContainEqual({ value: 'BROAD', label: 'Broad' });
            expect(NAMING_COMPONENTS.MATCH).toContainEqual({ value: 'PHRASE', label: 'Phrase' });
            expect(NAMING_COMPONENTS.MATCH).toContainEqual({ value: 'EXACT', label: 'Exact' });
        });

        it('should have campaign match type options including AUTO and PT', () => {
            expect(NAMING_COMPONENTS.CAMPAIGN_MATCH).toBeDefined();
            expect(NAMING_COMPONENTS.CAMPAIGN_MATCH).toContainEqual({ value: 'AUTO', label: 'Auto' });
            expect(NAMING_COMPONENTS.CAMPAIGN_MATCH).toContainEqual({ value: 'PT', label: 'Product Targeting' });
            expect(NAMING_COMPONENTS.CAMPAIGN_MATCH).toContainEqual({ value: 'VIDEO', label: 'Video' });
        });

        it('should have intent options', () => {
            expect(NAMING_COMPONENTS.INTENT).toBeDefined();
            expect(NAMING_COMPONENTS.INTENT).toContainEqual({ value: 'BRANDED', label: 'Branded' });
            expect(NAMING_COMPONENTS.INTENT).toContainEqual({ value: 'COMPETITOR', label: 'Competitor' });
            expect(NAMING_COMPONENTS.INTENT).toContainEqual({ value: 'GENERIC', label: 'Generic' });
            expect(NAMING_COMPONENTS.INTENT).toContainEqual({ value: 'CATEGORY', label: 'Category' });
        });

        it('should have theme options', () => {
            expect(NAMING_COMPONENTS.THEME).toBeDefined();
            expect(NAMING_COMPONENTS.THEME.length).toBeGreaterThan(5);
            expect(NAMING_COMPONENTS.THEME).toContainEqual({ value: 'RESEARCH', label: 'Research' });
            expect(NAMING_COMPONENTS.THEME).toContainEqual({ value: 'PERFORMANCE', label: 'Performance' });
            expect(NAMING_COMPONENTS.THEME).toContainEqual({ value: 'BRANDED', label: 'Branded' });
        });
    });

    describe('AUTO_TARGETING', () => {
        it('should have all auto targeting types', () => {
            expect(AUTO_TARGETING).toBeDefined();
            expect(AUTO_TARGETING.length).toBe(4);
            expect(AUTO_TARGETING).toContainEqual({ value: 'CLOSE', label: 'Close Match' });
            expect(AUTO_TARGETING).toContainEqual({ value: 'LOOSE', label: 'Loose Match' });
            expect(AUTO_TARGETING).toContainEqual({ value: 'SUB', label: 'Substitutes' });
            expect(AUTO_TARGETING).toContainEqual({ value: 'COMP', label: 'Complements' });
        });
    });

    describe('BIDDING_STRATEGIES', () => {
        it('should have all bidding strategy options', () => {
            expect(BIDDING_STRATEGIES).toBeDefined();
            expect(BIDDING_STRATEGIES.length).toBe(3);
            expect(BIDDING_STRATEGIES).toContainEqual({ value: 'fixed', label: 'Fixed bids' });
            expect(BIDDING_STRATEGIES).toContainEqual({ value: 'down', label: 'Dynamic bids - down only' });
            expect(BIDDING_STRATEGIES).toContainEqual({ value: 'up_down', label: 'Dynamic bids - up and down' });
        });

        it('should have unique values', () => {
            const values = BIDDING_STRATEGIES.map(bs => bs.value);
            const uniqueValues = new Set(values);
            expect(uniqueValues.size).toBe(values.length);
        });
    });

    describe('CAMPAIGN_PLAYBOOK', () => {
        it('should have campaign templates', () => {
            expect(CAMPAIGN_PLAYBOOK).toBeDefined();
            expect(CAMPAIGN_PLAYBOOK.length).toBeGreaterThan(10);
        });

        it('should have SP Auto Research template', () => {
            const template = CAMPAIGN_PLAYBOOK.find(p => p.id === 'SP_AUTO_RESEARCH');
            expect(template).toBeDefined();
            expect(template?.type).toBe('SP');
            expect(template?.match).toBe('AUTO');
            expect(template?.theme).toBe('RESEARCH');
            expect(template?.bidStrategy).toBe('down');
        });

        it('should have SP Exact Performance template', () => {
            const template = CAMPAIGN_PLAYBOOK.find(p => p.id === 'SP_EXACT_PERFORMANCE');
            expect(template).toBeDefined();
            expect(template?.type).toBe('SP');
            expect(template?.match).toBe('EXACT');
            expect(template?.theme).toBe('PERFORMANCE');
            expect(template?.bidStrategy).toBe('up_down');
            expect(template?.tosModifier).toBeGreaterThanOrEqual(20);
        });

        it('should have SP Branded template', () => {
            const template = CAMPAIGN_PLAYBOOK.find(p => p.id === 'SP_BRANDED_UMBRELLA');
            expect(template).toBeDefined();
            expect(template?.type).toBe('SP');
            expect(template?.theme).toBe('BRANDED');
        });

        it('should have Product Targeting templates', () => {
            const ptTemplates = CAMPAIGN_PLAYBOOK.filter(p => p.match === 'PT');
            expect(ptTemplates.length).toBeGreaterThan(0);
            
            const compAsinTemplate = ptTemplates.find(t => t.id === 'SP_PT_COMP_ASIN');
            expect(compAsinTemplate).toBeDefined();
            expect(compAsinTemplate?.theme).toBe('COMP');
        });

        it('should have SB templates', () => {
            const sbTemplates = CAMPAIGN_PLAYBOOK.filter(p => p.type === 'SB');
            expect(sbTemplates.length).toBeGreaterThan(0);
            
            const sbBranded = sbTemplates.find(t => t.id === 'SB_EXACT_BRANDED');
            expect(sbBranded).toBeDefined();
            expect(sbBranded?.match).toBe('EXACT');
        });

        it('should have SD templates', () => {
            const sdTemplates = CAMPAIGN_PLAYBOOK.filter(p => p.type === 'SD');
            expect(sdTemplates.length).toBeGreaterThan(0);
            
            const sdRemarketing = sdTemplates.find(t => t.id?.includes('REMARKETING'));
            expect(sdRemarketing).toBeDefined();
        });

        it('should have unique campaign IDs', () => {
            const ids = CAMPAIGN_PLAYBOOK.map(p => p.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        it('should have required fields for each template', () => {
            CAMPAIGN_PLAYBOOK.forEach(template => {
                expect(template.id).toBeDefined();
                expect(template.type).toBeDefined();
                expect(template.match).toBeDefined();
                expect(template.theme).toBeDefined();
                expect(template.country).toBeDefined();
                expect(template.budgetAllocation).toBeGreaterThan(0);
                expect(template.description).toBeDefined();
            });
        });

        it('should have valid budget allocations', () => {
            CAMPAIGN_PLAYBOOK.forEach(template => {
                expect(template.budgetAllocation).toBeGreaterThanOrEqual(0);
                expect(template.budgetAllocation).toBeLessThanOrEqual(100);
            });
        });

        it('should categorize campaigns by funnel stage', () => {
            const awarenessCampaigns = CAMPAIGN_PLAYBOOK.filter(p => p.funnelStage === 'AWARENESS');
            const considerationCampaigns = CAMPAIGN_PLAYBOOK.filter(p => p.funnelStage === 'CONSIDERATION');
            const conversionCampaigns = CAMPAIGN_PLAYBOOK.filter(p => p.funnelStage === 'CONVERSION');

            expect(awarenessCampaigns.length).toBeGreaterThan(0);
            expect(considerationCampaigns.length).toBeGreaterThan(0);
            expect(conversionCampaigns.length).toBeGreaterThan(0);
        });

        it('should have placement modifiers within valid range', () => {
            CAMPAIGN_PLAYBOOK.forEach(template => {
                if (template.tosModifier !== undefined) {
                    expect(template.tosModifier).toBeGreaterThanOrEqual(0);
                    expect(template.tosModifier).toBeLessThanOrEqual(900);
                }
            });
        });
    });

    describe('Campaign Type Distribution', () => {
        it('should have a balanced distribution of campaign types', () => {
            const spCount = CAMPAIGN_PLAYBOOK.filter(p => p.type === 'SP').length;
            const sbCount = CAMPAIGN_PLAYBOOK.filter(p => p.type === 'SB').length;
            const sdCount = CAMPAIGN_PLAYBOOK.filter(p => p.type === 'SD').length;

            // SP should have the most templates as it's the most common type
            expect(spCount).toBeGreaterThan(sbCount);
            expect(spCount).toBeGreaterThan(sdCount);
            
            // But SB and SD should also have templates
            expect(sbCount).toBeGreaterThan(0);
            expect(sdCount).toBeGreaterThan(0);
        });

        it('should have research, performance, and branded campaigns', () => {
            const researchCampaigns = CAMPAIGN_PLAYBOOK.filter(p => p.theme === 'RESEARCH');
            const performanceCampaigns = CAMPAIGN_PLAYBOOK.filter(p => p.theme === 'PERFORMANCE');
            const brandedCampaigns = CAMPAIGN_PLAYBOOK.filter(p => p.theme === 'BRANDED');

            expect(researchCampaigns.length).toBeGreaterThan(0);
            expect(performanceCampaigns.length).toBeGreaterThan(0);
            expect(brandedCampaigns.length).toBeGreaterThan(0);
        });
    });
});
