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
