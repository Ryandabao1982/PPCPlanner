import { getYYYYMM } from './utils/helpers';

const yyyymm = getYYYYMM();

// --- Workspace 1: Kong - Beer Bong ---
const KONG_PRODUCTS = [
    { id: 1, sku: 'KNG-BONG-STD', asin: 'B0ABC123DE' },
];

const KONG_KEYWORDS = [
    // Branded
    { id: 101, text: 'kong beer bong', intent: 'BRANDED', stemmed: 'kong beer bong' },
    { id: 102, text: 'kong bong', intent: 'BRANDED', stemmed: 'kong bong' },
    { id: 103, text: 'kong beer funnel', intent: 'BRANDED', stemmed: 'kong beer funnel' },
    
    // Competitor
    { id: 201, text: 'bongzilla', intent: 'COMPETITOR', stemmed: 'bongzilla' },
    { id: 202, text: 'head rush beer bong', intent: 'COMPETITOR', stemmed: 'head rush beer bong' },
    { id: 203, text: 'chaos beer bong', intent: 'COMPETITOR', stemmed: 'chaos beer bong' },
    { id: 204, text: 'the knockout', intent: 'COMPETITOR', stemmed: 'the knockout' },

    // Generic
    { id: 301, text: 'beer bong', intent: 'GENERIC', stemmed: 'beer bong' },
    { id: 302, text: 'beer funnel', intent: 'GENERIC', stemmed: 'beer funnel' },
    { id: 303, text: 'party funnel', intent: 'GENERIC', stemmed: 'party funnel' },
    { id: 304, text: 'drinking funnel with valve', intent: 'GENERIC', stemmed: 'drinking funnel valve' },
    { id: 305, text: 'tailgate beer bong', intent: 'GENERIC', stemmed: 'tailgate beer bong' },
    { id: 306, text: 'double beer bong', intent: 'GENERIC', stemmed: 'double beer bong' },
    { id: 307, text: 'college party supplies', intent: 'GENERIC', stemmed: 'college party supply' },
    { id: 308, text: 'tailgating accessories', intent: 'GENERIC', stemmed: 'tailgating accessory' },
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
    { id: 10, sku: 'ECO-BAG-LRG-3PK', asin: 'B0XYZ987FG', parentAsin: 'B0XYZPARENT' },
    { id: 11, sku: 'ECO-BAG-SML-5PK', asin: 'B0XYZ987HI', parentAsin: 'B0XYZPARENT' },
    { id: 12, sku: 'ECO-BAG-PARENT', asin: 'B0XYZPARENT' },
];

const ECOFRESH_KEYWORDS = [
    { id: 601, text: 'ecofresh bags', intent: 'BRANDED', stemmed: 'ecofresh bag' },
    { id: 701, text: 'reusable grocery bags', intent: 'GENERIC', stemmed: 'reusable grocery bag' },
    { id: 702, text: 'washable produce bags', intent: 'GENERIC', stemmed: 'washable produce bag' },
    { id: 801, text: 'bumkins snack bags', intent: 'COMPETITOR', stemmed: 'bumkins snack bag' },
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
    }
};