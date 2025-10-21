export type NamingComponentOption = {
  value: string;
  label: string;
};

export const NAMING_COMPONENTS = {
  COUNTRY: [
    { value: 'US', label: 'US' },
    { value: 'UK', label: 'UK' },
    { value: 'DE', label: 'DE' },
    { value: 'CA', label: 'CA' },
    { value: 'FR', label: 'FR' },
  ],
  TYPE: [
    { value: 'SP', label: 'Sponsored Products' },
    { value: 'SB', label: 'Sponsored Brands' },
    { value: 'SD', label: 'Sponsored Display' },
  ],
  MATCH: [
    { value: 'BROAD', label: 'Broad' },
    { value: 'PHRASE', label: 'Phrase' },
    { value: 'EXACT', label: 'Exact' },
  ],
  CAMPAIGN_MATCH: [
    { value: 'AUTO', label: 'Auto' },
    { value: 'BROAD', label: 'Broad' },
    { value: 'PHRASE', label: 'Phrase' },
    { value: 'EXACT', label: 'Exact' },
    { value: 'PT', label: 'Product Targeting' },
    { value: 'VIDEO', label: 'Video' },
  ],
  INTENT: [
    { value: 'BRANDED', label: 'Branded' },
    { value: 'COMPETITOR', label: 'Competitor' },
    { value: 'GENERIC', label: 'Generic' },
    { value: 'CATEGORY', label: 'Category' },
  ],
  THEME: [
    { value: 'RESEARCH', label: 'Research' },
    { value: 'PERFORMANCE', label: 'Performance' },
    { value: 'BRANDED', label: 'Branded' },
    { value: 'COMP', label: 'Competitor' },
    { value: 'CATEGORY', label: 'Category' },
    { value: 'CROSSSELL', label: 'Cross-Sell' },
    { value: 'AWARENESS', label: 'Awareness' },
    { value: 'CONSIDERATION', label: 'Consideration' },
    { value: 'REMARKETING', label: 'Remarketing' },
    { value: 'SKAG', label: 'SKAG' },
    { value: 'STORE_TRAFFIC', label: 'Store Traffic' },
    { value: 'PROMO', label: 'Promo' },
    { value: 'LAUNCH', label: 'Launch' },
    { value: 'AUDIENCE', label: 'Audience' },
  ],
};

export const AUTO_TARGETING: NamingComponentOption[] = [
  { value: 'CLOSE', label: 'Close Match' },
  { value: 'LOOSE', label: 'Loose Match' },
  { value: 'SUB', label: 'Substitutes' },
  { value: 'COMP', label: 'Complements' },
];

export const BIDDING_STRATEGIES = [
    { value: 'fixed', label: 'Fixed bids' },
    { value: 'down', label: 'Dynamic bids - down only' },
    { value: 'up_down', label: 'Dynamic bids - up and down' },
];

export const CAMPAIGN_PLAYBOOK = [
  // == SP ==
  {
    id: 'SP_AUTO_RESEARCH', label: 'SP | Auto | Research', campaignType: 'SP_AUTO_RESEARCH',
    type: 'SP', match: 'AUTO', theme: 'RESEARCH', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 0.75, placementStrategy: 'Balanced', tosModifier: 0, primaryKPI: 'Clicks, ACOS',
    description: 'Use auto-targeting to discover new, relevant customer search terms. Good for initial research.',
  },
  {
    id: 'SP_BROAD_RESEARCH', label: 'SP | Broad | Research', campaignType: 'SP_BROAD_RESEARCH',
    type: 'SP', match: 'BROAD', theme: 'RESEARCH', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 10, defaultBid: 0.85, placementStrategy: 'Balanced', tosModifier: 0, primaryKPI: 'ACOS',
    description: 'Capture a wide range of traffic for keyword discovery using broad match. Higher reach, lower precision.',
  },
  {
    id: 'SP_PHRASE_RESEARCH', label: 'SP | Phrase | Research', campaignType: 'SP_PHRASE_RESEARCH',
    type: 'SP', match: 'PHRASE', theme: 'RESEARCH', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 10, defaultBid: 0.95, placementStrategy: 'Balanced', tosModifier: 0, primaryKPI: 'ACOS',
    description: 'More targeted than Broad. Discovers keywords while maintaining relevance to the seed term.',
  },
  {
    id: 'SP_EXACT_PERFORMANCE', label: 'SP | Exact | Performance', campaignType: 'SP_EXACT_PERFORMANCE',
    type: 'SP', match: 'EXACT', theme: 'PERFORMANCE', funnelStage: 'CONVERSION', country: 'US', bidStrategy: 'up_down',
    budgetAllocation: 20, defaultBid: 1.25, placementStrategy: 'Top of Search', tosModifier: 30, primaryKPI: 'ROAS',
    description: 'Target highly specific search terms for maximum relevance and conversion. The primary performance driver.',
  },
  {
    id: 'SP_EXACT_SKAG', label: 'SP | Exact | SKAG (Single Keyword Ad Group)', campaignType: 'SP_EXACT_SKAG',
    type: 'SP', match: 'EXACT', theme: 'SKAG', funnelStage: 'CONVERSION', country: 'US', bidStrategy: 'up_down',
    budgetAllocation: 5, defaultBid: 1.35, placementStrategy: 'Top of Search', tosModifier: 40, primaryKPI: 'ROAS',
    description: 'Isolates a single high-value exact match keyword for maximum control over bids and ad copy relevance.',
  },
  {
    id: 'SP_BRANDED_UMBRELLA', label: 'SP | Branded | Umbrella (Exact+Phrase)', campaignType: 'SP_BRANDED_UMBRELLA',
    type: 'SP', match: 'EXACT', theme: 'BRANDED', funnelStage: 'CONVERSION', country: 'US', bidStrategy: 'up_down',
    budgetAllocation: 10, defaultBid: 1.50, placementStrategy: 'Top of Search', tosModifier: 50, primaryKPI: 'Impression Share',
    description: 'Protect your brand terms from competitors and capture all brand-related traffic with high precision.',
  },
  {
    id: 'SP_EXACT_COMP', label: 'SP | Exact | Competitor', campaignType: 'SP_EXACT_COMP',
    type: 'SP', match: 'EXACT', theme: 'COMP', funnelStage: 'CONSIDERATION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 1.15, placementStrategy: 'Product Pages', tosModifier: 15, primaryKPI: 'CTR',
    description: 'Target competitor brand names to capture their traffic and consideration.',
  },
  {
    id: 'SP_PT_BRANDED', label: 'SP | Product Targeting | Branded', campaignType: 'SP_PT_BRANDED',
    type: 'SP', match: 'PT', theme: 'BRANDED', funnelStage: 'CONVERSION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 1.00, placementStrategy: 'Product Pages', tosModifier: 0, primaryKPI: 'CTR',
    description: 'Defend your own product detail pages by showing your ads on your other product pages.',
  },
  {
    id: 'SP_PT_COMP_ASIN', label: 'SP | Product Targeting | Competitor ASINs', campaignType: 'SP_PT_COMP_ASIN',
    type: 'SP', match: 'PT', theme: 'COMP', funnelStage: 'CONSIDERATION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 1.10, placementStrategy: 'Product Pages', tosModifier: 0, primaryKPI: 'CTR',
    description: 'Target specific competitor product detail pages to steal traffic and sales.',
  },
  {
    id: 'SP_PT_CATEGORY', label: 'SP | Product Targeting | Category', campaignType: 'SP_PT_CATEGORY',
    type: 'SP', match: 'PT', theme: 'CATEGORY', funnelStage: 'CONSIDERATION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 0.90, placementStrategy: 'Product Pages', tosModifier: 0, primaryKPI: 'CTR',
    description: 'Target entire categories of products to reach a broad but relevant audience.',
  },
  {
    id: 'SP_PT_CROSSELL', label: 'SP | Product Targeting | Cross-Sell', campaignType: 'SP_PT_CROSSELL',
    type: 'SP', match: 'PT', theme: 'CROSSSELL', funnelStage: 'CONSIDERATION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 0.80, placementStrategy: 'Product Pages', tosModifier: 0, primaryKPI: 'ROAS',
    description: 'Target complementary products to encourage bundle purchases (e.g., show ads for filters on a coffee machine page).',
  },
  // == SB ==
  {
    id: 'SB_EXACT_BRANDED', label: 'SB | Exact | Branded', campaignType: 'SB_EXACT_BRANDED',
    type: 'SB', match: 'EXACT', theme: 'BRANDED', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 1.75, placementStrategy: 'Balanced', tosModifier: 15, primaryKPI: 'New-to-Brand', creativeNotes: 'Requires brand logo, headline, and 3+ products.',
    description: 'Dominate the top of search for your brand terms with a Sponsored Brands ad.',
  },
  {
    id: 'SB_EXACT_COMP', label: 'SB | Exact | Competitor', campaignType: 'SB_EXACT_COMP',
    type: 'SB', match: 'EXACT', theme: 'COMP', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 1.65, placementStrategy: 'Balanced', tosModifier: 10, primaryKPI: 'New-to-Brand', creativeNotes: 'Requires brand logo, headline, and 3+ products.',
    description: 'Showcase your brand and product line when customers search for competitors.',
  },
  {
    id: 'SB_BROAD_RESEARCH', label: 'SB | Broad | Research', campaignType: 'SB_BROAD_RESEARCH',
    type: 'SB', match: 'BROAD', theme: 'RESEARCH', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 1.20, placementStrategy: 'Balanced', tosModifier: 0, primaryKPI: 'Clicks', creativeNotes: 'Requires brand logo, headline, and 3+ products.',
    description: 'Use Sponsored Brands for broad-term keyword discovery and brand awareness.',
  },
  {
    id: 'SB_BROAD_CATEGORY', label: 'SB | Broad | Category', campaignType: 'SB_BROAD_CATEGORY',
    type: 'SB', match: 'BROAD', theme: 'CATEGORY', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 1.30, placementStrategy: 'Balanced', tosModifier: 0, primaryKPI: 'Clicks', creativeNotes: 'Requires brand logo, headline, and 3+ products.',
    description: 'Target general category terms to introduce your brand to new customers.',
  },
  {
    id: 'SB_VIDEO_AWARENESS', label: 'SB | Video | Awareness', campaignType: 'SB_VIDEO_AWARENESS',
    type: 'SB', match: 'VIDEO', theme: 'AWARENESS', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 0.70, placementStrategy: 'Balanced', tosModifier: 0, primaryKPI: 'VCPM, Video Views', creativeNotes: 'Requires video creative.',
    description: 'Use video to capture attention for broad keywords, focusing on brand awareness and reach.',
  },
  {
    id: 'SB_VIDEO_CONSIDERATION', label: 'SB | Video | Consideration', campaignType: 'SB_VIDEO_CONSIDERATION',
    type: 'SB', match: 'VIDEO', theme: 'CONSIDERATION', funnelStage: 'CONSIDERATION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 0.90, placementStrategy: 'Balanced', tosModifier: 0, primaryKPI: 'CTR, Detail Page Views', creativeNotes: 'Requires video creative.',
    description: 'Target more specific keywords with video to drive clicks and detail page views.',
  },
  {
    id: 'SB_STORE_TRAFFIC', label: 'SB | Store | Traffic', campaignType: 'SB_STORE_TRAFFIC',
    type: 'SB', match: 'BROAD', theme: 'STORE_TRAFFIC', funnelStage: 'CONSIDERATION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 1.10, placementStrategy: 'Balanced', tosModifier: 0, primaryKPI: 'Store Visits', creativeNotes: 'Requires linking to a Brand Store.',
    description: 'Drive traffic directly to your Amazon Brand Store to showcase your full product line.',
  },
  {
    id: 'SB_BUNDLE_PROMO', label: 'SB | Bundle | Promo', campaignType: 'SB_BUNDLE_PROMO',
    type: 'SB', match: 'EXACT', theme: 'PROMO', funnelStage: 'CONVERSION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 2, defaultBid: 1.40, placementStrategy: 'Balanced', tosModifier: 0, primaryKPI: 'ROAS', creativeNotes: 'Promote specific bundles or promotions.',
    description: 'Highlight special offers, bundles, or promotions with a dedicated SB campaign.',
  },
  {
    id: 'SB_EVENT_LAUNCH', label: 'SB | Event | Launch', campaignType: 'SB_EVENT_LAUNCH',
    type: 'SB', match: 'BROAD', theme: 'LAUNCH', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 2, defaultBid: 1.50, placementStrategy: 'Balanced', tosModifier: 0, primaryKPI: 'Impressions, Clicks', creativeNotes: 'For time-sensitive events or product launches.',
    description: 'Create buzz for a new product launch or seasonal event.',
  },
  // == SD ==
  {
    id: 'SD_REMARKETING_VIEWS', label: 'SD | Remarketing | Product Views', campaignType: 'SD_REMARKETING_VIEWS',
    type: 'SD', match: 'PT', theme: 'REMARKETING', funnelStage: 'CONSIDERATION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 0.65, placementStrategy: 'Display Placements', tosModifier: 0, primaryKPI: 'ROAS', creativeNotes: 'Retargets users who viewed products.',
    description: 'Retarget shoppers who viewed your products but did not purchase.',
  },
  {
    id: 'SD_REMARKETING_CART', label: 'SD | Remarketing | Cart Abandoners', campaignType: 'SD_REMARKETING_CART',
    type: 'SD', match: 'PT', theme: 'REMARKETING', funnelStage: 'CONVERSION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 0.85, placementStrategy: 'Display Placements', tosModifier: 0, primaryKPI: 'ROAS', creativeNotes: 'Retargets users who added to cart.',
    description: 'Target high-intent shoppers who added your products to their cart but did not purchase.',
  },
  {
    id: 'SD_REMARKETING_BUYERS', label: 'SD | Remarketing | Past Buyers', campaignType: 'SD_REMARKETING_BUYERS',
    type: 'SD', match: 'PT', theme: 'REMARKETING', funnelStage: 'CONVERSION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 5, defaultBid: 0.75, placementStrategy: 'Display Placements', tosModifier: 0, primaryKPI: 'ROAS', creativeNotes: 'Upsell or cross-sell to past purchasers.',
    description: 'Encourage repeat purchases or cross-sell new products to your existing customer base.',
  },
  {
    id: 'SD_AUDIENCE_INMARKET', label: 'SD | Audience | In-Market', campaignType: 'SD_AUDIENCE_INMARKET',
    type: 'SD', match: 'PT', theme: 'AUDIENCE', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 2, defaultBid: 0.55, placementStrategy: 'Display Placements', tosModifier: 0, primaryKPI: 'CTR', creativeNotes: 'Targets audiences in-market for your category.',
    description: 'Reach shoppers who are actively browsing and showing interest in your product category.',
  },
  {
    id: 'SD_AUDIENCE_LIFESTYLE', label: 'SD | Audience | Lifestyle', campaignType: 'SD_AUDIENCE_LIFESTYLE',
    type: 'SD', match: 'PT', theme: 'AUDIENCE', funnelStage: 'AWARENESS', country: 'US', bidStrategy: 'down',
    budgetAllocation: 2, defaultBid: 0.50, placementStrategy: 'Display Placements', tosModifier: 0, primaryKPI: 'CTR', creativeNotes: 'Targets audiences based on lifestyle.',
    description: "Target audiences based on their lifestyle interests (e.g., 'Fitness Enthusiasts').",
  },
  {
    id: 'SD_PT_BRANDED', label: 'SD | Product Targeting | Branded', campaignType: 'SD_PT_BRANDED',
    type: 'SD', match: 'PT', theme: 'BRANDED', funnelStage: 'CONVERSION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 2, defaultBid: 0.60, placementStrategy: 'Display Placements', tosModifier: 0, primaryKPI: 'ROAS', creativeNotes: 'Defend your own product pages.',
    description: 'Defensively target your own product detail pages to prevent competitors from showing up.',
  },
  {
    id: 'SD_PT_COMP', label: 'SD | Product Targeting | Competitor', campaignType: 'SD_PT_COMP',
    type: 'SD', match: 'PT', theme: 'COMP', funnelStage: 'CONSIDERATION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 2, defaultBid: 0.70, placementStrategy: 'Display Placements', tosModifier: 0, primaryKPI: 'ROAS', creativeNotes: 'Target competitor product pages.',
    description: "Offensively target competitor product detail pages to capture their customers' attention.",
  },
  {
    id: 'SD_PT_CATEGORY', label: 'SD | Product Targeting | Category', campaignType: 'SD_PT_CATEGORY',
    type: 'SD', match: 'PT', theme: 'CATEGORY', funnelStage: 'CONSIDERATION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 2, defaultBid: 0.65, placementStrategy: 'Display Placements', tosModifier: 0, primaryKPI: 'ROAS', creativeNotes: 'Target entire categories or sub-categories.',
    description: 'Target all products within a specific category for broad reach.',
  },
  {
    id: 'SD_PT_CROSSELL', label: 'SD | Product Targeting | Cross-Sell', campaignType: 'SD_PT_CROSSELL',
    type: 'SD', match: 'PT', theme: 'CROSSSELL', funnelStage: 'CONSIDERATION', country: 'US', bidStrategy: 'down',
    budgetAllocation: 2, defaultBid: 0.60, placementStrategy: 'Display Placements', tosModifier: 0, primaryKPI: 'ROAS', creativeNotes: 'Target complementary product pages.',
    description: 'Target products that are complementary to yours (e.g., show ads for phone cases on phone detail pages).',
  },
];


export const MIN_BID = 0.02;
export const MAX_BID = 1000.00;

export const SAMPLE_SEARCH_QUERY_DATA = [
  { id: 1, searchTerm: 'eco friendly water bottle', impressions: 1200, clicks: 80, spend: 65.50, orders: 15, sales: 450.00, status: 'unprocessed' },
  { id: 2, searchTerm: 'reusable coffee cup', impressions: 2500, clicks: 120, spend: 95.00, orders: 25, sales: 625.00, status: 'unprocessed' },
  { id: 3, searchTerm: 'my brand name bottle', impressions: 500, clicks: 50, spend: 20.00, orders: 10, sales: 300.00, status: 'unprocessed' },
  { id: 4, searchTerm: 'competitor brand x bottle', impressions: 800, clicks: 30, spend: 45.00, orders: 2, sales: 60.00, status: 'unprocessed' },
  { id: 5, searchTerm: 'insulated water jug', impressions: 1800, clicks: 90, spend: 88.00, orders: 18, sales: 540.00, status: 'unprocessed' },
  { id: 6, searchTerm: 'stainless steel tumbler', impressions: 3200, clicks: 150, spend: 130.00, orders: 35, sales: 980.00, status: 'unprocessed' },
  { id: 7, searchTerm: 'glass water bottle with sleeve', impressions: 950, clicks: 45, spend: 40.50, orders: 8, sales: 200.00, status: 'unprocessed' },
  { id: 8, searchTerm: 'water bottle for gym', impressions: 2100, clicks: 110, spend: 105.00, orders: 22, sales: 660.00, status: 'unprocessed' },
  { id: 9, searchTerm: 'kids water bottle', impressions: 4000, clicks: 200, spend: 180.00, orders: 50, sales: 1250.00, status: 'unprocessed' },
  { id: 10, searchTerm: 'another brand name', impressions: 300, clicks: 10, spend: 15.00, orders: 1, sales: 25.00, status: 'unprocessed' },
];