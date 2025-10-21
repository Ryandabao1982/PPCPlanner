
const GENERIC_NOISE_WORDS = [
  'the', 'and', 'or', 'for', 'to', 'from', 'of', 'in', 'with', 'a', 'an', 'on', 'by', 'your', 'you', 'my', 'our', 'at', 'it', 'this', 'that', 'these', 'those', 'all', 'any', 'each'
];

const QUANTITY_VARIATION_TERMS = [
  'pack', 'bundle', 'lot', 'box', 'piece', 'set', 'size', 'large', 'small', 'medium', 'xlarge', 'xl', '2xl', '3xl', '4xl', 'ounce', 'oz', 'lb', 'liter', 'ml', 'gram', 'g'
];

const SUBJECTIVE_MODIFIERS = [
  'best', 'cheap', 'top', 'popular', 'nice', 'awesome', 'cool', 'amazing', 'great', 'trendy', 'affordable', 'quality', 'new', 'latest'
];

const COMMERCE_STOPWORDS = [
  'buy', 'sale', 'discount', 'offer', 'coupon', 'price', 'free', 'shipping', 'amazon', 'prime'
];

const NON_PRODUCT_TERMS = [
  'how', 'where', 'when', 'why', 'near', 'store', 'shop', 'website', 'app', 'login', 'support', 'review', 'return', 'warranty'
];

// In a real app, this might be dynamic. For this example, some common ones are added.
const BRAND_POLICY_SENSITIVE: string[] = [
  // Example of competitor names, restricted terms etc. would be added here.
];

const REDUNDANT_UNITS_SYMBOLS = [
  'cm', 'mm', 'inch', '"', "'", '%', '$', '#', '+', '-', '/'
];

const TEMPORAL_WORDS = [
  'today', 'now', '2023', '2024', 'update', 'version'
];

// Combine all lists into one
export const EXCLUSION_WORD_LIST = [
  ...GENERIC_NOISE_WORDS,
  ...QUANTITY_VARIATION_TERMS,
  ...SUBJECTIVE_MODIFIERS,
  ...COMMERCE_STOPWORDS,
  ...NON_PRODUCT_TERMS,
  ...BRAND_POLICY_SENSITIVE,
  ...REDUNDANT_UNITS_SYMBOLS,
  ...TEMPORAL_WORDS
];

// Create a Set for efficient O(1) lookups during filtering
export const EXCLUSION_WORD_SET = new Set(EXCLUSION_WORD_LIST);
