/**
 * Validation utilities for form inputs and data
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validators = {
    /**
     * Validate required field
     */
    required: (value: any, fieldName: string = 'This field'): ValidationResult => {
        if (value === null || value === undefined || value === '') {
            return {
                isValid: false,
                error: `${fieldName} is required`
            };
        }
        return { isValid: true };
    },

    /**
     * Validate minimum length
     */
    minLength: (value: string, min: number, fieldName: string = 'This field'): ValidationResult => {
        if (value && value.length < min) {
            return {
                isValid: false,
                error: `${fieldName} must be at least ${min} characters`
            };
        }
        return { isValid: true };
    },

    /**
     * Validate maximum length
     */
    maxLength: (value: string, max: number, fieldName: string = 'This field'): ValidationResult => {
        if (value && value.length > max) {
            return {
                isValid: false,
                error: `${fieldName} must be no more than ${max} characters`
            };
        }
        return { isValid: true };
    },

    /**
     * Validate number range
     */
    numberRange: (value: number, min: number, max: number, fieldName: string = 'Value'): ValidationResult => {
        if (isNaN(value)) {
            return {
                isValid: false,
                error: `${fieldName} must be a number`
            };
        }
        if (value < min || value > max) {
            return {
                isValid: false,
                error: `${fieldName} must be between ${min} and ${max}`
            };
        }
        return { isValid: true };
    },

    /**
     * Validate positive number
     */
    positiveNumber: (value: number, fieldName: string = 'Value'): ValidationResult => {
        if (isNaN(value) || value <= 0) {
            return {
                isValid: false,
                error: `${fieldName} must be a positive number`
            };
        }
        return { isValid: true };
    },

    /**
     * Validate ASIN format
     */
    asin: (value: string): ValidationResult => {
        const asinRegex = /^B[0-9A-Z]{9}$/;
        if (!asinRegex.test(value)) {
            return {
                isValid: false,
                error: 'ASIN must start with B followed by 9 alphanumeric characters (e.g., B0ABC123DE)'
            };
        }
        return { isValid: true };
    },

    /**
     * Validate SKU format (basic)
     */
    sku: (value: string): ValidationResult => {
        if (!value || value.trim().length === 0) {
            return {
                isValid: false,
                error: 'SKU is required'
            };
        }
        if (value.length < 3 || value.length > 40) {
            return {
                isValid: false,
                error: 'SKU must be between 3 and 40 characters'
            };
        }
        return { isValid: true };
    },

    /**
     * Validate campaign name format
     */
    campaignName: (value: string): ValidationResult => {
        if (!value || value.trim().length === 0) {
            return {
                isValid: false,
                error: 'Campaign name is required'
            };
        }
        if (value.length > 128) {
            return {
                isValid: false,
                error: 'Campaign name must be 128 characters or less'
            };
        }
        return { isValid: true };
    },

    /**
     * Validate budget value
     */
    budget: (value: number): ValidationResult => {
        if (isNaN(value) || value < 1) {
            return {
                isValid: false,
                error: 'Budget must be at least $1.00'
            };
        }
        if (value > 1000000) {
            return {
                isValid: false,
                error: 'Budget cannot exceed $1,000,000'
            };
        }
        return { isValid: true };
    },

    /**
     * Validate bid value
     */
    bid: (value: number): ValidationResult => {
        if (isNaN(value) || value < 0.02) {
            return {
                isValid: false,
                error: 'Bid must be at least $0.02'
            };
        }
        if (value > 1000) {
            return {
                isValid: false,
                error: 'Bid cannot exceed $1,000'
            };
        }
        return { isValid: true };
    },

    /**
     * Validate percentage value
     */
    percentage: (value: number, fieldName: string = 'Value'): ValidationResult => {
        if (isNaN(value) || value < 0 || value > 100) {
            return {
                isValid: false,
                error: `${fieldName} must be between 0 and 100`
            };
        }
        return { isValid: true };
    },

    /**
     * Validate ACoS target
     */
    acos: (value: number): ValidationResult => {
        if (isNaN(value) || value < 1 || value > 100) {
            return {
                isValid: false,
                error: 'Target ACoS must be between 1% and 100%'
            };
        }
        return { isValid: true };
    },

    /**
     * Validate keyword text
     */
    keyword: (value: string): ValidationResult => {
        if (!value || value.trim().length === 0) {
            return {
                isValid: false,
                error: 'Keyword text is required'
            };
        }
        if (value.length > 80) {
            return {
                isValid: false,
                error: 'Keyword must be 80 characters or less'
            };
        }
        return { isValid: true };
    },

    /**
     * Validate brand name
     */
    brandName: (value: string): ValidationResult => {
        if (!value || value.trim().length === 0) {
            return {
                isValid: false,
                error: 'Brand name is required'
            };
        }
        if (value.length < 2 || value.length > 50) {
            return {
                isValid: false,
                error: 'Brand name must be between 2 and 50 characters'
            };
        }
        return { isValid: true };
    },
};

/**
 * Combine multiple validation results
 */
export const combineValidations = (...results: ValidationResult[]): ValidationResult => {
    for (const result of results) {
        if (!result.isValid) {
            return result;
        }
    }
    return { isValid: true };
};

/**
 * Create a validated input wrapper
 */
export const createValidator = (rules: ((value: any) => ValidationResult)[]) => {
    return (value: any): ValidationResult => {
        for (const rule of rules) {
            const result = rule(value);
            if (!result.isValid) {
                return result;
            }
        }
        return { isValid: true };
    };
};

/**
 * Campaign template validation rules based on campaign type
 */

export interface CampaignValidationContext {
    campaignType: string;
    type: string;
    match: string;
    theme: string;
    targetingType?: string;
    keywords?: Array<{ text: string; matchType: string }>;
    productTargets?: string[];
    defaultBid?: number;
    suggestedBid?: number;
    budgetAllocation?: number;
    tosModifier?: number;
    bidStrategy?: string;
    maxKeywordsPerAdGroup?: number;
}

export const campaignValidators = {
    /**
     * Validate SP Auto Research campaigns
     */
    validateSpAutoResearch: (context: CampaignValidationContext): ValidationResult => {
        if (context.match !== 'AUTO') {
            return {
                isValid: false,
                error: 'SP_AUTO_RESEARCH must use Auto targeting'
            };
        }
        
        if (context.keywords && context.keywords.length > 0) {
            return {
                isValid: false,
                error: 'SP_AUTO_RESEARCH cannot have manual keywords'
            };
        }

        if (context.productTargets && context.productTargets.length > 0) {
            return {
                isValid: false,
                error: 'SP_AUTO_RESEARCH cannot have product targets'
            };
        }

        if (context.suggestedBid && context.defaultBid && context.defaultBid > context.suggestedBid * 0.7) {
            return {
                isValid: false,
                error: 'SP_AUTO_RESEARCH bid should be ≤ 70% of Amazon Suggested Bid'
            };
        }

        return { isValid: true };
    },

    /**
     * Validate SP Broad Research campaigns
     */
    validateSpBroadResearch: (context: CampaignValidationContext): ValidationResult => {
        if (context.match !== 'BROAD') {
            return {
                isValid: false,
                error: 'SP_BROAD_RESEARCH must use Broad match type'
            };
        }

        if (context.keywords) {
            const nonBroadKeywords = context.keywords.filter(k => k.matchType !== 'BROAD');
            if (nonBroadKeywords.length > 0) {
                return {
                    isValid: false,
                    error: 'SP_BROAD_RESEARCH must only contain Broad match keywords'
                };
            }

            if (context.keywords.length > (context.maxKeywordsPerAdGroup || 50)) {
                return {
                    isValid: false,
                    error: `SP_BROAD_RESEARCH should have max ${context.maxKeywordsPerAdGroup || 50} keywords per ad group`
                };
            }
        }

        if (context.suggestedBid && context.defaultBid && context.defaultBid > context.suggestedBid * 0.8) {
            return {
                isValid: false,
                error: 'SP_BROAD_RESEARCH bid should be ≤ 80% of Amazon Suggested Bid'
            };
        }

        return { isValid: true };
    },

    /**
     * Validate SP Phrase Research campaigns
     */
    validateSpPhraseResearch: (context: CampaignValidationContext): ValidationResult => {
        if (context.match !== 'PHRASE') {
            return {
                isValid: false,
                error: 'SP_PHRASE_RESEARCH must use Phrase match type'
            };
        }

        if (context.keywords) {
            const nonPhraseKeywords = context.keywords.filter(k => k.matchType !== 'PHRASE');
            if (nonPhraseKeywords.length > 0) {
                return {
                    isValid: false,
                    error: 'SP_PHRASE_RESEARCH must only contain Phrase match keywords'
                };
            }

            if (context.keywords.length > (context.maxKeywordsPerAdGroup || 50)) {
                return {
                    isValid: false,
                    error: `SP_PHRASE_RESEARCH should have max ${context.maxKeywordsPerAdGroup || 50} keywords per ad group`
                };
            }
        }

        if (context.suggestedBid && context.defaultBid && context.defaultBid > context.suggestedBid * 0.9) {
            return {
                isValid: false,
                error: 'SP_PHRASE_RESEARCH bid should be ≤ 90% of Amazon Suggested Bid'
            };
        }

        return { isValid: true };
    },

    /**
     * Validate SP Exact Performance campaigns
     */
    validateSpExactPerformance: (context: CampaignValidationContext): ValidationResult => {
        if (context.match !== 'EXACT') {
            return {
                isValid: false,
                error: 'SP_EXACT_PERFORMANCE must use Exact match type'
            };
        }

        if (context.keywords) {
            const nonExactKeywords = context.keywords.filter(k => k.matchType !== 'EXACT');
            if (nonExactKeywords.length > 0) {
                return {
                    isValid: false,
                    error: 'SP_EXACT_PERFORMANCE must only contain Exact match keywords'
                };
            }

            if (context.keywords.length > (context.maxKeywordsPerAdGroup || 15)) {
                return {
                    isValid: false,
                    error: `SP_EXACT_PERFORMANCE should have max ${context.maxKeywordsPerAdGroup || 15} keywords per ad group`
                };
            }
        }

        if (context.bidStrategy !== 'up_down') {
            return {
                isValid: false,
                error: 'SP_EXACT_PERFORMANCE should use "Dynamic bids - up and down" strategy'
            };
        }

        if (context.tosModifier && context.tosModifier < 20) {
            return {
                isValid: false,
                error: 'SP_EXACT_PERFORMANCE should have Top of Search modifier ≥ 20%'
            };
        }

        return { isValid: true };
    },

    /**
     * Validate SP Exact SKAG campaigns
     */
    validateSpExactSkag: (context: CampaignValidationContext): ValidationResult => {
        if (context.match !== 'EXACT') {
            return {
                isValid: false,
                error: 'SP_EXACT_SKAG must use Exact match type'
            };
        }

        if (context.keywords && context.keywords.length > 1) {
            return {
                isValid: false,
                error: 'SP_EXACT_SKAG must have exactly 1 keyword per ad group'
            };
        }

        if (context.keywords) {
            const nonExactKeywords = context.keywords.filter(k => k.matchType !== 'EXACT');
            if (nonExactKeywords.length > 0) {
                return {
                    isValid: false,
                    error: 'SP_EXACT_SKAG must only contain Exact match keywords'
                };
            }
        }

        if (context.tosModifier && context.tosModifier < 30) {
            return {
                isValid: false,
                error: 'SP_EXACT_SKAG should have Top of Search modifier ≥ 30%'
            };
        }

        return { isValid: true };
    },

    /**
     * Validate SP Branded campaigns
     */
    validateSpBranded: (context: CampaignValidationContext, brandName?: string): ValidationResult => {
        if (context.keywords && brandName) {
            const nonBrandedKeywords = context.keywords.filter(
                k => !k.text.toLowerCase().includes(brandName.toLowerCase())
            );
            if (nonBrandedKeywords.length > 0) {
                return {
                    isValid: false,
                    error: 'SP_BRANDED keywords must contain the brand name'
                };
            }

            const allowedMatches = ['EXACT', 'PHRASE'];
            const invalidMatches = context.keywords.filter(k => !allowedMatches.includes(k.matchType));
            if (invalidMatches.length > 0) {
                return {
                    isValid: false,
                    error: 'SP_BRANDED allows only Exact and Phrase match types'
                };
            }
        }

        if (context.suggestedBid && context.defaultBid && context.defaultBid > context.suggestedBid * 0.8) {
            return {
                isValid: false,
                error: 'SP_BRANDED bid should be ≤ 80% of Amazon Suggested Bid'
            };
        }

        if (context.budgetAllocation && context.budgetAllocation > 10) {
            return {
                isValid: false,
                error: 'SP_BRANDED budget should be ≤ 10% of total'
            };
        }

        return { isValid: true };
    },

    /**
     * Validate SP Competitor campaigns
     */
    validateSpCompetitor: (context: CampaignValidationContext): ValidationResult => {
        if (context.match !== 'EXACT') {
            return {
                isValid: false,
                error: 'SP_EXACT_COMP must use Exact match type'
            };
        }

        if (context.keywords) {
            const nonExactKeywords = context.keywords.filter(k => k.matchType !== 'EXACT');
            if (nonExactKeywords.length > 0) {
                return {
                    isValid: false,
                    error: 'SP_EXACT_COMP must only contain Exact match keywords'
                };
            }
        }

        return { isValid: true };
    },

    /**
     * Validate SP Product Targeting campaigns
     */
    validateSpProductTargeting: (context: CampaignValidationContext): ValidationResult => {
        if (context.match !== 'PT') {
            return {
                isValid: false,
                error: 'SP Product Targeting campaigns must use PT targeting type'
            };
        }

        if (context.keywords && context.keywords.length > 0) {
            return {
                isValid: false,
                error: 'SP Product Targeting campaigns cannot have keywords'
            };
        }

        if (!context.productTargets || context.productTargets.length === 0) {
            return {
                isValid: false,
                error: 'SP Product Targeting campaigns must have product targets (ASINs or categories)'
            };
        }

        if (context.suggestedBid && context.defaultBid && context.defaultBid > context.suggestedBid * 0.9) {
            return {
                isValid: false,
                error: 'SP Product Targeting bid should be ≤ 90% of Amazon Suggested Bid'
            };
        }

        return { isValid: true };
    },

    /**
     * Validate SB Exact Branded/Competitor campaigns
     */
    validateSbExact: (context: CampaignValidationContext, requireBrandTerm?: boolean): ValidationResult => {
        if (context.match !== 'EXACT') {
            return {
                isValid: false,
                error: 'SB_EXACT campaigns must use Exact match type'
            };
        }

        if (context.keywords) {
            const nonExactKeywords = context.keywords.filter(k => k.matchType !== 'EXACT');
            if (nonExactKeywords.length > 0) {
                return {
                    isValid: false,
                    error: 'SB_EXACT campaigns must only contain Exact match keywords'
                };
            }
        }

        return { isValid: true };
    },

    /**
     * Validate SB Broad Research/Category campaigns
     */
    validateSbBroad: (context: CampaignValidationContext): ValidationResult => {
        if (context.match !== 'BROAD') {
            return {
                isValid: false,
                error: 'SB_BROAD campaigns must use Broad match type'
            };
        }

        if (context.keywords) {
            const nonBroadKeywords = context.keywords.filter(k => k.matchType !== 'BROAD');
            if (nonBroadKeywords.length > 0) {
                return {
                    isValid: false,
                    error: 'SB_BROAD campaigns must only contain Broad match keywords'
                };
            }
        }

        return { isValid: true };
    },

    /**
     * Validate SB Video campaigns
     */
    validateSbVideo: (context: CampaignValidationContext): ValidationResult => {
        if (context.match !== 'VIDEO') {
            return {
                isValid: false,
                error: 'SB_VIDEO campaigns must use Video creative type'
            };
        }

        return { isValid: true };
    },

    /**
     * Validate SD Remarketing campaigns
     */
    validateSdRemarketing: (context: CampaignValidationContext): ValidationResult => {
        if (context.type !== 'SD') {
            return {
                isValid: false,
                error: 'SD_REMARKETING must be Sponsored Display type'
            };
        }

        if (context.theme !== 'REMARKETING') {
            return {
                isValid: false,
                error: 'SD_REMARKETING must have REMARKETING theme'
            };
        }

        return { isValid: true };
    },

    /**
     * Validate SD Audience campaigns
     */
    validateSdAudience: (context: CampaignValidationContext): ValidationResult => {
        if (context.type !== 'SD') {
            return {
                isValid: false,
                error: 'SD_AUDIENCE must be Sponsored Display type'
            };
        }

        if (context.theme !== 'AUDIENCE') {
            return {
                isValid: false,
                error: 'SD_AUDIENCE must have AUDIENCE theme'
            };
        }

        return { isValid: true };
    },

    /**
     * Validate SD Product Targeting campaigns
     */
    validateSdProductTargeting: (context: CampaignValidationContext): ValidationResult => {
        if (context.type !== 'SD') {
            return {
                isValid: false,
                error: 'SD Product Targeting must be Sponsored Display type'
            };
        }

        if (context.match !== 'PT') {
            return {
                isValid: false,
                error: 'SD Product Targeting must use PT targeting'
            };
        }

        if (!context.productTargets || context.productTargets.length === 0) {
            return {
                isValid: false,
                error: 'SD Product Targeting must have product targets (ASINs or categories)'
            };
        }

        return { isValid: true };
    },

    /**
     * General template-level guardrails
     */
    validateBidCap: (bid: number, maxBid: number = 2.00): ValidationResult => {
        if (bid > maxBid) {
            return {
                isValid: false,
                error: `Bid exceeds max CPC ceiling of $${maxBid.toFixed(2)}`
            };
        }
        return { isValid: true };
    },

    validateBudgetAllocation: (allocation: number, totalBudget: number): ValidationResult => {
        if (allocation < 0 || allocation > 100) {
            return {
                isValid: false,
                error: 'Budget allocation must be between 0% and 100%'
            };
        }
        return { isValid: true };
    },

    /**
     * Master validator that routes to the appropriate campaign-specific validator
     */
    validateCampaignTemplate: (
        context: CampaignValidationContext,
        brandName?: string
    ): ValidationResult => {
        const { campaignType } = context;

        switch (campaignType) {
            case 'SP_AUTO_RESEARCH':
                return campaignValidators.validateSpAutoResearch(context);
            
            case 'SP_BROAD_RESEARCH':
                return campaignValidators.validateSpBroadResearch(context);
            
            case 'SP_PHRASE_RESEARCH':
                return campaignValidators.validateSpPhraseResearch(context);
            
            case 'SP_EXACT_PERFORMANCE':
                return campaignValidators.validateSpExactPerformance(context);
            
            case 'SP_EXACT_SKAG':
                return campaignValidators.validateSpExactSkag(context);
            
            case 'SP_BRANDED_UMBRELLA':
                return campaignValidators.validateSpBranded(context, brandName);
            
            case 'SP_EXACT_COMP':
                return campaignValidators.validateSpCompetitor(context);
            
            case 'SP_PT_BRANDED':
            case 'SP_PT_COMP_ASIN':
            case 'SP_PT_CATEGORY':
            case 'SP_PT_CROSSELL':
                return campaignValidators.validateSpProductTargeting(context);
            
            case 'SB_EXACT_BRANDED':
            case 'SB_EXACT_COMP':
                return campaignValidators.validateSbExact(context);
            
            case 'SB_BROAD_RESEARCH':
            case 'SB_BROAD_CATEGORY':
                return campaignValidators.validateSbBroad(context);
            
            case 'SB_VIDEO_AWARENESS':
            case 'SB_VIDEO_CONSIDERATION':
                return campaignValidators.validateSbVideo(context);
            
            case 'SD_REMARKETING_VIEWS':
            case 'SD_REMARKETING_CART':
            case 'SD_REMARKETING_BUYERS':
                return campaignValidators.validateSdRemarketing(context);
            
            case 'SD_AUDIENCE_INMARKET':
            case 'SD_AUDIENCE_LIFESTYLE':
                return campaignValidators.validateSdAudience(context);
            
            case 'SD_PT_BRANDED':
            case 'SD_PT_COMP':
            case 'SD_PT_CATEGORY':
            case 'SD_PT_CROSSELL':
                return campaignValidators.validateSdProductTargeting(context);
            
            default:
                return { isValid: true };
        }
    }
};
