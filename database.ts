import { getYYYYMM } from './utils/helpers';

const yyyymm = getYYYYMM();

// --- Workspace 1: Kong - Beer Bong ---
const KONG_PRODUCTS = [
    { id: 1, sku: 'KNG-BONG-STD', asin: 'B0ABC123DE', category: 'Beer Bongs' },
];

const KONG_KEYWORDS = [
    // Branded
    { id: 101, text: 'kong beer bong', intent: 'BRANDED', stemmed: 'kong beer bong', category: 'Beer Bongs' },
    { id: 102, text: 'kong bong', intent: 'BRANDED', stemmed: 'kong bong', category: 'Beer Bongs' },
    { id: 103, text: 'kong beer funnel', intent: 'BRANDED', stemmed: 'kong beer funnel', category: 'Beer Bongs' },
    
    // Competitor
    { id: 201, text: 'bongzilla', intent: 'COMPETITOR', stemmed: 'bongzilla', category: 'Beer Bongs' },
    { id: 202, text: 'head rush beer bong', intent: 'COMPETITOR', stemmed: 'head rush beer bong', category: 'Beer Bongs' },
    { id: 203, text: 'chaos beer bong', intent: 'COMPETITOR', stemmed: 'chaos beer bong', category: 'Beer Bongs' },
    { id: 204, text: 'the knockout', intent: 'COMPETITOR', stemmed: 'the knockout', category: 'Beer Bongs' },

    // Generic
    { id: 301, text: 'beer bong', intent: 'GENERIC', stemmed: 'beer bong', category: 'Beer Bongs' },
    { id: 302, text: 'beer funnel', intent: 'GENERIC', stemmed: 'beer funnel', category: 'Beer Bongs' },
    { id: 303, text: 'party funnel', intent: 'GENERIC', stemmed: 'party funnel', category: 'Beer Bongs' },
    { id: 304, text: 'drinking funnel with valve', intent: 'GENERIC', stemmed: 'drinking funnel valve', category: 'Beer Bongs' },
    { id: 305, text: 'tailgate beer bong', intent: 'GENERIC', stemmed: 'tailgate beer bong', category: 'Beer Bongs' },
    { id: 306, text: 'double beer bong', intent: 'GENERIC', stemmed: 'double beer bong', category: 'Beer Bongs' },
    { id: 307, text: 'college party supplies', intent: 'GENERIC', stemmed: 'college party supply', category: 'Beer Bongs' },
    { id: 308, text: 'tailgating accessories', intent: 'GENERIC', stemmed: 'tailgating accessory', category: 'Beer Bongs' },
];

const KONG_CAMPAIGNS = [
    { id: 401, name: `Kong_US_KNG-BONG-STD_SP_EXACT_BRANDED_${yyyymm}`, brand: 'Kong', country: 'US', type: 'SP', match: 'EXACT', theme: 'BRANDED', budget: 25, placementTop: 20, placementProduct: 10 },
    { id: 402, name: `Kong_US_KNG-BONG-STD_SP_BROAD_COMP_${yyyymm}`, brand: 'Kong', country: 'US', type: 'SP', match: 'BROAD', theme: 'COMP', budget: 40, placementTop: 0, placementProduct: 15 },
    { id: 403, name: `Kong_US_KNG-BONG-STD_SP_BROAD_RESEARCH_${yyyymm}`, brand: 'Kong', country: 'US', type: 'SP', match: 'BROAD', theme: 'RESEARCH', budget: 75, placementTop: 0, placementProduct: 0 },
    { id: 404, name: `Kong_US_KNG-BONG-STD_SP_PT_COMP_${yyyymm}`, brand: 'Kong', country: 'US', type: 'SP', match: 'PT', theme: 'COMP', budget: 30, placementTop: 0, placementProduct: 25 },
];

const KONG_AD_GROUPS = [
    { 
        id: 501, 
        campaignId: 401, 
        name: 'Kong_US_EXACT_BRANDED_001', 
        matchType: 'EXACT', 
        intent: 'BRANDED', 
        custom: '001', 
        defaultBid: 1.50, 
        biddingStrategy: 'down', 
        keywords: KONG_KEYWORDS.filter(k => k.intent === 'BRANDED').map(k => ({ ...k, matchType: 'EXACT' })), 
        products: KONG_PRODUCTS 
    },
    { 
        id: 502, 
        campaignId: 402, 
        name: 'Kong_US_BROAD_COMPETITOR_001', 
        matchType: 'BROAD', 
        intent: 'COMPETITOR', 
        custom: '001', 
        defaultBid: 1.15, 
        biddingStrategy: 'down', 
        keywords: KONG_KEYWORDS.filter(k => k.intent === 'COMPETITOR').map(k => ({ ...k, matchType: 'BROAD' })), 
        products: KONG_PRODUCTS 
    },
    { 
        id: 503, 
        campaignId: 403, 
        name: 'Kong_US_BROAD_GENERIC_001', 
        matchType: 'BROAD', 
        intent: 'GENERIC', 
        custom: '001', 
        defaultBid: 0.85, 
        biddingStrategy: 'down', 
        keywords: KONG_KEYWORDS.filter(k => k.intent === 'GENERIC').map(k => ({ ...k, matchType: 'BROAD' })), 
        products: KONG_PRODUCTS 
    },
    { 
        id: 504, 
        campaignId: 404, 
        name: 'Kong_US_PT_COMP_001', 
        matchType: 'PT',
        intent: 'COMPETITOR', 
        custom: '001', 
        defaultBid: 1.05, 
        biddingStrategy: 'down', 
        keywords: [],
        products: KONG_PRODUCTS,
        productTargets: ['B0COMPETE01', 'B0COMPETE02', 'B0COMPETE03']
    },
];


// --- Workspace 2: EcoFresh - Reusable Bags ---
const ECOFRESH_PRODUCTS = [
    { id: 10, sku: 'ECO-BAG-LRG-3PK', asin: 'B0XYZ987FG', parentAsin: 'B0XYZPARENT', category: 'Reusable Bags' },
    { id: 11, sku: 'ECO-BAG-SML-5PK', asin: 'B0XYZ987HI', parentAsin: 'B0XYZPARENT', category: 'Reusable Bags' },
    { id: 12, sku: 'ECO-BAG-PARENT', asin: 'B0XYZPARENT', category: 'Reusable Bags' },
];

const ECOFRESH_KEYWORDS = [
    { id: 601, text: 'ecofresh bags', intent: 'BRANDED', stemmed: 'ecofresh bag', category: 'Reusable Bags' },
    { id: 701, text: 'reusable grocery bags', intent: 'GENERIC', stemmed: 'reusable grocery bag', category: 'Reusable Bags' },
    { id: 702, text: 'washable produce bags', intent: 'GENERIC', stemmed: 'washable produce bag', category: 'Reusable Bags' },
    { id: 801, text: 'bumkins snack bags', intent: 'COMPETITOR', stemmed: 'bumkins snack bag', category: 'Reusable Bags' },
];

const ECOFRESH_CAMPAIGNS = [
    { id: 901, name: `EcoFresh_US_ECO-BAG-LRG_SP_EXACT_BRANDED_${yyyymm}`, brand: 'EcoFresh', country: 'US', type: 'SP', match: 'EXACT', theme: 'BRANDED', budget: 15, placementTop: 30, placementProduct: 0 },
    { id: 902, name: `EcoFresh_US_ECO-BAG-LRG_SP_PHRASE_GENERIC_${yyyymm}`, brand: 'EcoFresh', country: 'US', type: 'SP', match: 'PHRASE', theme: 'RESEARCH', budget: 20, placementTop: 0, placementProduct: 0 },
];

const ECOFRESH_AD_GROUPS = [
    {
        id: 1001,
        campaignId: 901,
        name: 'EcoFresh_US_EXACT_BRANDED_001',
        matchType: 'EXACT',
        intent: 'BRANDED',
        custom: '001',
        defaultBid: 1.10,
        biddingStrategy: 'down',
        keywords: ECOFRESH_KEYWORDS.filter(k => k.intent === 'BRANDED').map(k => ({...k, matchType: 'EXACT'})),
        products: [ECOFRESH_PRODUCTS[0]],
    },
    {
        id: 1002,
        campaignId: 902,
        name: 'EcoFresh_US_PHRASE_GENERIC_001',
        matchType: 'PHRASE',
        intent: 'GENERIC',
        custom: '001',
        defaultBid: 0.90,
        biddingStrategy: 'down',
        keywords: ECOFRESH_KEYWORDS.filter(k => k.intent === 'GENERIC').map(k => ({...k, matchType: 'PHRASE'})),
        products: [ECOFRESH_PRODUCTS[0]],
    }
];

// --- Workspace 3: Test Workspace - Large Plan ---
const TEST_PRODUCTS = [
    { id: 2001, sku: 'TEST-PROD-001', asin: 'B0TEST001AA', category: 'Test Category A' },
    { id: 2002, sku: 'TEST-PROD-002', asin: 'B0TEST002BB', category: 'Test Category B' },
];

const TEST_KEYWORDS = [
    // Branded keywords (10) - Category A
    { id: 3001, text: 'test brand product', intent: 'BRANDED', stemmed: 'test brand product', matchType: 'EXACT', category: 'Test Category A' },
    { id: 3002, text: 'test brand item', intent: 'BRANDED', stemmed: 'test brand item', matchType: 'EXACT', category: 'Test Category A' },
    { id: 3003, text: 'official test product', intent: 'BRANDED', stemmed: 'official test product', matchType: 'PHRASE', category: 'Test Category A' },
    { id: 3004, text: 'test brand shop', intent: 'BRANDED', stemmed: 'test brand shop', matchType: 'PHRASE', category: 'Test Category A' },
    { id: 3005, text: 'test brand store', intent: 'BRANDED', stemmed: 'test brand store', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3006, text: 'test brand quality', intent: 'BRANDED', stemmed: 'test brand quality', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3007, text: 'test brand premium', intent: 'BRANDED', stemmed: 'test brand premium', matchType: 'EXACT', category: 'Test Category B' },
    { id: 3008, text: 'test brand original', intent: 'BRANDED', stemmed: 'test brand original', matchType: 'PHRASE', category: 'Test Category B' },
    { id: 3009, text: 'test brand authentic', intent: 'BRANDED', stemmed: 'test brand authentic', matchType: 'EXACT', category: 'Test Category B' },
    { id: 3010, text: 'test brand collection', intent: 'BRANDED', stemmed: 'test brand collection', matchType: 'BROAD', category: 'Test Category B' },
    
    // Generic keywords (25) - Mixed categories
    { id: 3011, text: 'quality product', intent: 'GENERIC', stemmed: 'quality product', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3012, text: 'best product online', intent: 'GENERIC', stemmed: 'best product online', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3013, text: 'top rated product', intent: 'GENERIC', stemmed: 'top rated product', matchType: 'PHRASE', category: 'Test Category A' },
    { id: 3014, text: 'premium product', intent: 'GENERIC', stemmed: 'premium product', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3015, text: 'affordable product', intent: 'GENERIC', stemmed: 'affordable product', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3016, text: 'product for home', intent: 'GENERIC', stemmed: 'product home', matchType: 'PHRASE', category: 'Test Category A' },
    { id: 3017, text: 'product for office', intent: 'GENERIC', stemmed: 'product office', matchType: 'PHRASE', category: 'Test Category A' },
    { id: 3018, text: 'essential product', intent: 'GENERIC', stemmed: 'essential product', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3019, text: 'must have product', intent: 'GENERIC', stemmed: 'must have product', matchType: 'PHRASE', category: 'Test Category A' },
    { id: 3020, text: 'everyday product', intent: 'GENERIC', stemmed: 'everyday product', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3021, text: 'durable product', intent: 'GENERIC', stemmed: 'durable product', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3022, text: 'long lasting product', intent: 'GENERIC', stemmed: 'long lasting product', matchType: 'PHRASE', category: 'Test Category B' },
    { id: 3023, text: 'reliable product', intent: 'GENERIC', stemmed: 'reliable product', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3024, text: 'professional product', intent: 'GENERIC', stemmed: 'professional product', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3025, text: 'commercial product', intent: 'GENERIC', stemmed: 'commercial product', matchType: 'PHRASE', category: 'Test Category B' },
    { id: 3026, text: 'industrial product', intent: 'GENERIC', stemmed: 'industrial product', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3027, text: 'heavy duty product', intent: 'GENERIC', stemmed: 'heavy duty product', matchType: 'PHRASE', category: 'Test Category B' },
    { id: 3028, text: 'lightweight product', intent: 'GENERIC', stemmed: 'lightweight product', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3029, text: 'portable product', intent: 'GENERIC', stemmed: 'portable product', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3030, text: 'compact product', intent: 'GENERIC', stemmed: 'compact product', matchType: 'PHRASE', category: 'Test Category B' },
    { id: 3031, text: 'versatile product', intent: 'GENERIC', stemmed: 'versatproduct', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3032, text: 'multifunctional product', intent: 'GENERIC', stemmed: 'multifunctional product', matchType: 'PHRASE', category: 'Test Category B' },
    { id: 3033, text: 'innovative product', intent: 'GENERIC', stemmed: 'innovative product', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3034, text: 'modern product', intent: 'GENERIC', stemmed: 'modern product', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3035, text: 'advanced product', intent: 'GENERIC', stemmed: 'advanced product', matchType: 'PHRASE', category: 'Test Category B' },
    
    // Competitor keywords (15) - Mixed categories
    { id: 3036, text: 'competitor brand a', intent: 'COMPETITOR', stemmed: 'competitor brand a', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3037, text: 'competitor brand b', intent: 'COMPETITOR', stemmed: 'competitor brand b', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3038, text: 'competitor brand c', intent: 'COMPETITOR', stemmed: 'competitor brand c', matchType: 'PHRASE', category: 'Test Category A' },
    { id: 3039, text: 'rival brand product', intent: 'COMPETITOR', stemmed: 'rival brand product', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3040, text: 'alternative brand', intent: 'COMPETITOR', stemmed: 'alternative brand', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3041, text: 'competitor product x', intent: 'COMPETITOR', stemmed: 'competitor product x', matchType: 'PHRASE', category: 'Test Category A' },
    { id: 3042, text: 'competitor product y', intent: 'COMPETITOR', stemmed: 'competitor product y', matchType: 'BROAD', category: 'Test Category A' },
    { id: 3043, text: 'competitor product z', intent: 'COMPETITOR', stemmed: 'competitor product z', matchType: 'PHRASE', category: 'Test Category A' },
    { id: 3044, text: 'leading competitor', intent: 'COMPETITOR', stemmed: 'leading competitor', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3045, text: 'top competitor brand', intent: 'COMPETITOR', stemmed: 'top competitor brand', matchType: 'PHRASE', category: 'Test Category B' },
    { id: 3046, text: 'popular competitor', intent: 'COMPETITOR', stemmed: 'popular competitor', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3047, text: 'competitor premium line', intent: 'COMPETITOR', stemmed: 'competitor premium line', matchType: 'PHRASE', category: 'Test Category B' },
    { id: 3048, text: 'competitor alternative', intent: 'COMPETITOR', stemmed: 'competitor alternative', matchType: 'BROAD', category: 'Test Category B' },
    { id: 3049, text: 'competitor similar product', intent: 'COMPETITOR', stemmed: 'competitor similar product', matchType: 'PHRASE', category: 'Test Category B' },
    { id: 3050, text: 'competitor equivalent', intent: 'COMPETITOR', stemmed: 'competitor equivalent', matchType: 'BROAD', category: 'Test Category B' },
];

const TEST_CAMPAIGNS = [
    { id: 4001, name: `TestBrand_US_TEST-PROD-001_SP_EXACT_BRANDED_${yyyymm}`, brand: 'TestBrand', country: 'US', type: 'SP', match: 'EXACT', theme: 'BRANDED', budget: 15.00, placementTop: 20, placementProduct: 10 },
    { id: 4002, name: `TestBrand_US_TEST-PROD-001_SP_PHRASE_BRANDED_${yyyymm}`, brand: 'TestBrand', country: 'US', type: 'SP', match: 'PHRASE', theme: 'BRANDED', budget: 12.00, placementTop: 15, placementProduct: 5 },
    { id: 4003, name: `TestBrand_US_TEST-PROD-001_SP_BROAD_GENERIC_${yyyymm}`, brand: 'TestBrand', country: 'US', type: 'SP', match: 'BROAD', theme: 'RESEARCH', budget: 20.00, placementTop: 0, placementProduct: 0 },
    { id: 4004, name: `TestBrand_US_TEST-PROD-001_SP_PHRASE_GENERIC_${yyyymm}`, brand: 'TestBrand', country: 'US', type: 'SP', match: 'PHRASE', theme: 'RESEARCH', budget: 15.00, placementTop: 5, placementProduct: 10 },
    { id: 4005, name: `TestBrand_US_TEST-PROD-001_SP_BROAD_COMP_${yyyymm}`, brand: 'TestBrand', country: 'US', type: 'SP', match: 'BROAD', theme: 'COMP', budget: 10.00, placementTop: 0, placementProduct: 15 },
    { id: 4006, name: `TestBrand_US_TEST-PROD-001_SP_PHRASE_COMP_${yyyymm}`, brand: 'TestBrand', country: 'US', type: 'SP', match: 'PHRASE', theme: 'COMP', budget: 8.00, placementTop: 10, placementProduct: 20 },
    { id: 4007, name: `TestBrand_US_TEST-PROD-001_SB_VIDEO_AWARENESS_${yyyymm}`, brand: 'TestBrand', country: 'US', type: 'SB', match: 'VIDEO', theme: 'AWARENESS', budget: 5.00, placementTop: 0, placementProduct: 0 },
    { id: 4008, name: `TestBrand_US_TEST-PROD-001_SB_STORE_AWARENESS_${yyyymm}`, brand: 'TestBrand', country: 'US', type: 'SB', match: 'STORE', theme: 'AWARENESS', budget: 5.00, placementTop: 0, placementProduct: 0 },
    { id: 4009, name: `TestBrand_US_TEST-PROD-001_SD_ASIN_REMARKETING_${yyyymm}`, brand: 'TestBrand', country: 'US', type: 'SD', match: 'PT', theme: 'REMARKETING', budget: 5.00, placementTop: 0, placementProduct: 0, campaignType: 'SD_REMARKETING_VIEWS' },
    { id: 4010, name: `TestBrand_US_TEST-PROD-001_SP_PT_COMP_${yyyymm}`, brand: 'TestBrand', country: 'US', type: 'SP', match: 'PT', theme: 'COMP', budget: 5.00, placementTop: 0, placementProduct: 25 },
];

const TEST_AD_GROUPS = [
    { 
        id: 5001, 
        campaignId: 4001, 
        name: 'TestBrand_US_EXACT_BRANDED_001', 
        matchType: 'EXACT', 
        intent: 'BRANDED', 
        custom: '001', 
        defaultBid: 1.25, 
        biddingStrategy: 'down', 
        keywords: TEST_KEYWORDS.filter(k => k.intent === 'BRANDED' && k.matchType === 'EXACT'), 
        products: [TEST_PRODUCTS[0]] 
    },
    { 
        id: 5002, 
        campaignId: 4002, 
        name: 'TestBrand_US_PHRASE_BRANDED_001', 
        matchType: 'PHRASE', 
        intent: 'BRANDED', 
        custom: '001', 
        defaultBid: 1.15, 
        biddingStrategy: 'down', 
        keywords: TEST_KEYWORDS.filter(k => k.intent === 'BRANDED' && k.matchType === 'PHRASE'), 
        products: [TEST_PRODUCTS[0]] 
    },
    { 
        id: 5003, 
        campaignId: 4003, 
        name: 'TestBrand_US_BROAD_GENERIC_001', 
        matchType: 'BROAD', 
        intent: 'GENERIC', 
        custom: '001', 
        defaultBid: 0.85, 
        biddingStrategy: 'down', 
        keywords: TEST_KEYWORDS.filter(k => k.intent === 'GENERIC' && k.matchType === 'BROAD'), 
        products: [TEST_PRODUCTS[0]] 
    },
    { 
        id: 5004, 
        campaignId: 4004, 
        name: 'TestBrand_US_PHRASE_GENERIC_001', 
        matchType: 'PHRASE', 
        intent: 'GENERIC', 
        custom: '001', 
        defaultBid: 0.95, 
        biddingStrategy: 'down', 
        keywords: TEST_KEYWORDS.filter(k => k.intent === 'GENERIC' && k.matchType === 'PHRASE'), 
        products: [TEST_PRODUCTS[0]] 
    },
    { 
        id: 5005, 
        campaignId: 4005, 
        name: 'TestBrand_US_BROAD_COMP_001', 
        matchType: 'BROAD', 
        intent: 'COMPETITOR', 
        custom: '001', 
        defaultBid: 1.05, 
        biddingStrategy: 'down', 
        keywords: TEST_KEYWORDS.filter(k => k.intent === 'COMPETITOR' && k.matchType === 'BROAD'), 
        products: [TEST_PRODUCTS[0]] 
    },
    { 
        id: 5006, 
        campaignId: 4006, 
        name: 'TestBrand_US_PHRASE_COMP_001', 
        matchType: 'PHRASE', 
        intent: 'COMPETITOR', 
        custom: '001', 
        defaultBid: 1.10, 
        biddingStrategy: 'down', 
        keywords: TEST_KEYWORDS.filter(k => k.intent === 'COMPETITOR' && k.matchType === 'PHRASE'), 
        products: [TEST_PRODUCTS[0]] 
    },
    { 
        id: 5007, 
        campaignId: 4007, 
        name: 'TestBrand_US_VIDEO_AWARENESS_001', 
        matchType: 'BROAD', 
        intent: 'GENERIC', 
        custom: '001', 
        defaultBid: 0.75, 
        biddingStrategy: 'down', 
        keywords: TEST_KEYWORDS.filter(k => k.intent === 'GENERIC' && k.matchType === 'BROAD').slice(0, 3), 
        products: [TEST_PRODUCTS[0]] 
    },
    { 
        id: 5008, 
        campaignId: 4008, 
        name: 'TestBrand_US_STORE_AWARENESS_001', 
        matchType: 'BROAD', 
        intent: 'BRANDED', 
        custom: '001', 
        defaultBid: 0.85, 
        biddingStrategy: 'down', 
        keywords: TEST_KEYWORDS.filter(k => k.intent === 'BRANDED' && k.matchType === 'BROAD'), 
        products: [TEST_PRODUCTS[0]] 
    },
    { 
        id: 5009, 
        campaignId: 4009, 
        name: 'TestBrand_US_REMARKETING_VIEWS_001', 
        matchType: 'PT',
        intent: 'GENERIC', 
        custom: '001', 
        defaultBid: 0.65, 
        biddingStrategy: 'down', 
        keywords: [],
        products: [TEST_PRODUCTS[0]]
    },
    { 
        id: 5010, 
        campaignId: 4010, 
        name: 'TestBrand_US_PT_COMP_001', 
        matchType: 'PT',
        intent: 'COMPETITOR', 
        custom: '001', 
        defaultBid: 0.95, 
        biddingStrategy: 'down', 
        keywords: [],
        products: [TEST_PRODUCTS[0]],
        productTargets: ['B0COMP001XX', 'B0COMP002YY', 'B0COMP003ZZ']
    },
];

// --- Initial Database Structure ---
export const initialDatabase = {
    '1721234567891': {
        name: 'Kong - Beer Bong',
        brand: 'Kong',
        products: KONG_PRODUCTS,
        keywords: KONG_KEYWORDS,
        campaigns: KONG_CAMPAIGNS,
        adGroups: KONG_AD_GROUPS,
        goals: [{ id: 401, campaignId: 403, type: 'Target ACoS', value: 35 }],
        logs: [
            { id: Date.now() + 1, timestamp: new Date().toISOString(), action: 'Created brand: Kong' },
            { id: Date.now() + 2, timestamp: new Date().toISOString(), action: 'Added Beer Bong product' },
            { id: Date.now() + 3, timestamp: new Date().toISOString(), action: 'Generated 15 keywords' },
            { id: Date.now() + 4, timestamp: new Date().toISOString(), action: 'Created Branded campaign' },
            { id: Date.now() + 5, timestamp: new Date().toISOString(), action: 'Created Competitor campaign' },
            { id: Date.now() + 6, timestamp: new Date().toISOString(), action: 'Created Generic campaign' },
        ].reverse(),
        isFrozen: false,
        searchQueryReports: [],
        exportHistory: [],
        reportHistory: [],
    },
    '1721234567892': {
        name: 'EcoFresh - Reusable Bags',
        brand: 'EcoFresh',
        products: ECOFRESH_PRODUCTS,
        keywords: ECOFRESH_KEYWORDS,
        campaigns: ECOFRESH_CAMPAIGNS,
        adGroups: ECOFRESH_AD_GROUPS,
        goals: [],
        logs: [
            { id: Date.now() + 7, timestamp: new Date().toISOString(), action: 'Created brand: EcoFresh' },
            { id: Date.now() + 8, timestamp: new Date().toISOString(), action: 'Added 3 products with parent/child links' },
        ].reverse(),
        isFrozen: false,
        searchQueryReports: [],
        exportHistory: [],
        reportHistory: [],
    },
    '1721234567893': {
        name: 'TestBrand - Large Plan Test',
        brand: 'TestBrand',
        products: TEST_PRODUCTS,
        keywords: TEST_KEYWORDS,
        campaigns: TEST_CAMPAIGNS,
        adGroups: TEST_AD_GROUPS,
        goals: [
            { id: 4001, campaignId: 4003, type: 'Target ACoS', value: 30 },
            { id: 4002, campaignId: 4005, type: 'Target ROAS', value: 300 }
        ],
        logs: [
            { id: Date.now() + 9, timestamp: new Date().toISOString(), action: 'Created brand: TestBrand' },
            { id: Date.now() + 10, timestamp: new Date().toISOString(), action: 'Added 2 test products' },
            { id: Date.now() + 11, timestamp: new Date().toISOString(), action: 'Generated 50 keywords' },
            { id: Date.now() + 12, timestamp: new Date().toISOString(), action: 'Created 10 campaigns with $100 daily budget' },
        ].reverse(),
        isFrozen: false,
        searchQueryReports: [],
        exportHistory: [],
        reportHistory: [],
    }
};