import { BIDDING_STRATEGIES, NAMING_COMPONENTS, AUTO_TARGETING } from './constants';

declare const XLSX: any; // Allow using XLSX from the script tag in index.html

export const getYYYYMM = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${year}${month}`;
};

const IRREGULAR_PLURALS: { [key: string]: string } = {
    men: 'man', women: 'woman', children: 'child', teeth: 'tooth',
    feet: 'foot', mice: 'mouse', geese: 'goose', people: 'person',
    leaves: 'leaf', lives: 'life', knives: 'knife', wives: 'wife',
    shelves: 'shelf', calves: 'calf', elves: 'elf', loaves: 'loaf',
    potatoes: 'potato', tomatoes: 'tomato', heroes: 'hero',
    cacti: 'cactus', foci: 'focus', fungi: 'fungus', nuclei: 'nucleus',
    analyses: 'analysis', diagnoses: 'diagnosis', oases: 'oasis',
    theses: 'thesis', crises: 'crisis', phenomena: 'phenomenon',
    criteria: 'criterion', data: 'datum'
};

const stemWord = (word: string): string => {
    if (word.length <= 2) return word;
    if (IRREGULAR_PLURALS[word]) return IRREGULAR_PLURALS[word];
    if (word.endsWith("'s")) return word.slice(0, -2);
    if (word.endsWith("s'")) return word.slice(0, -1);
    if (word.endsWith('ies') && word.length > 3) return word.slice(0, -3) + 'y';
    if (word.endsWith('es')) {
        if (['ch', 'sh', 'ss', 'x', 'z'].some(ending => word.endsWith(ending + 'es'))) return word.slice(0, -2);
        if (word.endsWith('oes') && word.length > 3) return word.slice(0, -2);
    }
    if (word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('us') && !word.endsWith('is')) return word.slice(0, -1);
    return word;
};

export const stem = (keyword: string): string => {
    if (!keyword || typeof keyword !== 'string') return '';
    const words = keyword.trim().toLowerCase().split(/\s+/);
    const stemmedWords = words.map(word => stemWord(word));
    return stemmedWords.join(' ');
};

// --- HEADER DEFINITIONS ---
const SP_HEADERS = [
    'Product', 'Entity', 'Operation', 'Campaign ID', 'Ad Group ID', 'Portfolio ID', 'Ad ID (Read only)', 'Keyword ID (Read only)', 
    'Product Targeting ID (Read only)', 'Campaign Name', 'Ad Group Name', 'Start Date', 'End Date', 'Targeting Type', 'State', 
    'Daily Budget', 'SKU', 'ASIN', 'Ad Group Default Bid', 'Bid', 'Keyword Text', 'Match Type', 'Bidding Strategy', 'Placement', 
    'Percentage', 'Product Targeting Expression'
];

const SB_HEADERS = [
    'Product', 'Entity', 'Operation', 'Campaign ID', 'Keyword ID (Read only)', 'Product Targeting ID (Read only)', 'Campaign Name', 'Start Date', 
    'End Date', 'State', 'Daily Budget', 'Lifetime Budget', 'Bidding Strategy', 'Creative Type', 'Landing Page ASINs', 'Brand Name', 
    'Brand Entity ID', 'Headline', 'Logo Asset ID', 'Video Media ID', 'Store Page ID', 'Bid', 'Keyword Text', 'Match Type', 
    'Product Targeting Expression'
];

const SD_HEADERS = [
    'Product', 'Entity', 'Operation', 'Campaign ID', 'Ad Group ID', 'Product Ad ID (Read only)', 'Targeting Clause ID (Read only)',
    'Campaign Name', 'Start Date', 'End Date', 'State', 'Daily Budget', 'Lifetime Budget', 'Cost Type', 'Tactic', 
    'Ad Group Name', 'Ad Group Default Bid', 'Product Targeting Expression', 'Audience Targeting Expression', 'SKU', 'ASIN'
];

// --- HELPERS ---
const createRowData = (data: Record<string, any>, headers: string[]): (string | number | null)[] => {
    return headers.map(header => data[header] ?? null);
};

const getBiddingStrategyLabel = (strategyValue: string) => {
    const strategy = BIDDING_STRATEGIES.find(bs => bs.value === strategyValue);
    return strategy ? strategy.label : 'Dynamic bids - down only';
};

const getAutoTargetingExpression = (targetingValue: string) => {
    switch (targetingValue) {
        case 'CLOSE': return 'close-match';
        case 'LOOSE': return 'loose-match';
        case 'SUB': return 'substitutes';
        case 'COMP': return 'complements';
        default: return null;
    }
};

// --- SHEET GENERATORS ---
const generateSpSheetData = (campaigns: any[], adGroups: any[], startDate: string) => {
    const dataForSheet: (string | number | null)[][] = [SP_HEADERS];
    const productName = 'Sponsored Products';

    campaigns.forEach(campaign => {
        const campaignAdGroups = adGroups.filter(ag => ag.campaignId === campaign.id);
        
        // --- 1. Campaign Row ---
        dataForSheet.push(createRowData({
            'Product': productName,
            'Entity': 'Campaign',
            'Operation': 'Create',
            'Campaign Name': campaign.name,
            'Start Date': startDate,
            'Targeting Type': campaign.match === 'AUTO' ? 'Auto' : 'Manual',
            'State': 'enabled',
            'Daily Budget': campaign.budget,
            'Bidding Strategy': getBiddingStrategyLabel(campaignAdGroups[0]?.biddingStrategy || 'down'),
        }, SP_HEADERS));

        // --- 2. Bidding Placement Rows ---
        if (campaign.placementTop > 0) {
            dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Bidding Placement', 'Operation': 'Create', 'Campaign Name': campaign.name, 'State': 'enabled', 'Placement': 'Top of search (first page)', 'Percentage': campaign.placementTop }, SP_HEADERS));
        }
        if (campaign.placementProduct > 0) {
            dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Bidding Placement', 'Operation': 'Create', 'Campaign Name': campaign.name, 'State': 'enabled', 'Placement': 'Product pages', 'Percentage': campaign.placementProduct }, SP_HEADERS));
        }

        campaignAdGroups.forEach(adGroup => {
            // --- 3. Ad Group Row ---
            dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Ad Group', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Ad Group Name': adGroup.name, 'State': 'enabled', 'Ad Group Default Bid': adGroup.defaultBid }, SP_HEADERS));

            // --- 4. Keyword / Product Targeting Rows (Mutually Exclusive) ---
            if (campaign.match === 'AUTO') {
                const targetingExpression = getAutoTargetingExpression(adGroup.matchType);
                if (targetingExpression) {
                    dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Product Targeting', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Ad Group Name': adGroup.name, 'State': 'enabled', 'Product Targeting Expression': targetingExpression }, SP_HEADERS));
                }
            } else if (campaign.match === 'PT') {
                (adGroup.productTargets || []).forEach((targetAsin: string) => {
                    if (targetAsin && targetAsin.trim()) {
                        dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Product Targeting', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Ad Group Name': adGroup.name, 'State': 'enabled', 'Bid': adGroup.defaultBid, 'Product Targeting Expression': `asin="${targetAsin.trim()}"` }, SP_HEADERS));
                    }
                });
            } else { // Manual Keyword campaigns
                (adGroup.keywords || []).forEach(keyword => {
                    const matchTypeLabel = NAMING_COMPONENTS.MATCH.find(m => m.value === keyword.matchType)?.label.toLowerCase() || 'broad';
                    dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Keyword', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Ad Group Name': adGroup.name, 'State': 'enabled', 'Bid': keyword.overrideBid ?? adGroup.defaultBid, 'Keyword Text': keyword.text, 'Match Type': matchTypeLabel }, SP_HEADERS));
                });
            }

            // --- 5. Product Ad Rows ---
            (adGroup.products || []).forEach(product => {
                dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Product Ad', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Ad Group Name': adGroup.name, 'State': 'enabled', 'SKU': product.sku, 'ASIN': product.asin }, SP_HEADERS));
            });
        });
    });
    return dataForSheet;
};

const generateSbSheetData = (campaigns: any[], adGroups: any[], brandName: string, startDate: string) => {
    const dataForSheet: (string | number | null)[][] = [SB_HEADERS];
    const productName = 'Sponsored Brands';

    campaigns.forEach(campaign => {
        const campaignAdGroups = adGroups.filter(ag => ag.campaignId === campaign.id);
        const allProducts = [...new Set(campaignAdGroups.flatMap(ag => ag.products || []))];
        const allKeywords = campaignAdGroups.flatMap(ag => ag.keywords || []);

        dataForSheet.push(createRowData({
            'Product': productName, 'Entity': 'Campaign', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Start Date': startDate,
            'State': 'enabled', 'Daily Budget': campaign.budget, 'Bidding Strategy': 'Maximize impressions',
            'Creative Type': campaign.match === 'VIDEO' ? 'Video' : 'Product Collection',
            'Landing Page ASINs': allProducts.map(p => p.asin).join(','), 'Brand Name': brandName,
            'Headline': `Shop ${brandName} best sellers now!`,
        }, SB_HEADERS));

        allKeywords.forEach(keyword => {
            const matchTypeLabel = NAMING_COMPONENTS.MATCH.find(m => m.value === keyword.matchType)?.label.toLowerCase() || 'broad';
            dataForSheet.push(createRowData({
                'Product': productName, 'Entity': 'Keyword', 'Operation': 'Create', 'Campaign Name': campaign.name, 'State': 'enabled',
                'Bid': keyword.overrideBid ?? campaignAdGroups[0]?.defaultBid ?? 1.00, 'Keyword Text': keyword.text, 'Match Type': matchTypeLabel,
            }, SB_HEADERS));
        });
    });
    return dataForSheet;
};

const generateSdSheetData = (campaigns: any[], adGroups: any[], startDate: string) => {
    const dataForSheet: (string | number | null)[][] = [SD_HEADERS];
    const productName = 'Sponsored Display';

    const getTactic = (theme: string) => theme === 'REMARKETING' ? 'T00020' : 'T00030';
    const getAudienceExpression = (campaignType: string) => {
        if (campaignType.includes('VIEWS')) return JSON.stringify({ "type": "VIEWS_REMARKETING", "days": 30 });
        if (campaignType.includes('CART')) return JSON.stringify({ "type": "ADDTOCART_REMARKETING", "days": 30 });
        if (campaignType.includes('BUYERS')) return JSON.stringify({ "type": "PURCHASES_REMARKETING", "days": 30 });
        return null;
    };

    campaigns.forEach(campaign => {
        const campaignTactic = getTactic(campaign.theme);
        dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Campaign', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Start Date': startDate, 'State': 'enabled', 'Daily Budget': campaign.budget, 'Cost Type': 'cpc', 'Tactic': campaignTactic }, SD_HEADERS));

        adGroups.filter(ag => ag.campaignId === campaign.id).forEach(adGroup => {
            dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Ad Group', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Ad Group Name': adGroup.name, 'State': 'enabled', 'Ad Group Default Bid': adGroup.defaultBid }, SD_HEADERS));
            
            if (campaignTactic === 'T00020') { // Remarketing
                const audienceExpression = getAudienceExpression(campaign.campaignType);
                if (audienceExpression) dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Audience Targeting', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Ad Group Name': adGroup.name, 'State': 'enabled', 'Audience Targeting Expression': audienceExpression }, SD_HEADERS));
            } else { // Contextual
                (adGroup.products || []).forEach(product => dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Product Targeting', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Ad Group Name': adGroup.name, 'State': 'enabled', 'Product Targeting Expression': `asin="${product.asin}"` }, SD_HEADERS)));
            }
            
            (adGroup.products || []).forEach(product => dataForSheet.push(createRowData({ 'Product': productName, 'Entity': 'Product Ad', 'Operation': 'Create', 'Campaign Name': campaign.name, 'Ad Group Name': adGroup.name, 'State': 'enabled', 'SKU': product.sku, 'ASIN': product.asin }, SD_HEADERS)));
        });
    });
    return dataForSheet;
};

// --- MAIN EXPORT FUNCTION ---
export const generateBulkUploadXlsx = (workspace: any, fileName: string): void => {
    if (!workspace) return;

    const { campaigns, adGroups, brand } = workspace;
    const wb = XLSX.utils.book_new();
    const startDate = new Date().toISOString().split('T')[0].replace(/-/g, '');

    const campaignTypes = {
        SP: campaigns.filter(c => c.type === 'SP'),
        SB: campaigns.filter(c => c.type === 'SB'),
        SD: campaigns.filter(c => c.type === 'SD'),
    };

    if (campaignTypes.SP.length > 0) {
        const sheetData = generateSpSheetData(campaignTypes.SP, adGroups, startDate);
        if (sheetData.length > 1) {
            const ws = XLSX.utils.aoa_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(wb, ws, 'Sponsored Products');
        }
    }
    
    if (campaignTypes.SB.length > 0) {
        const sheetData = generateSbSheetData(campaignTypes.SB, adGroups, brand, startDate);
        if (sheetData.length > 1) {
            const ws = XLSX.utils.aoa_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(wb, ws, 'Sponsored Brands');
        }
    }

    if (campaignTypes.SD.length > 0) {
        const sheetData = generateSdSheetData(campaignTypes.SD, adGroups, startDate);
        if (sheetData.length > 1) {
            const ws = XLSX.utils.aoa_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(wb, ws, 'Sponsored Display');
        }
    }

    if (wb.SheetNames.length > 0) {
        XLSX.writeFile(wb, fileName);
    }
};

// --- DATA EXPORT/IMPORT FUNCTIONS ---
export const exportWorkspaceData = (workspaces: any, fileName?: string): void => {
    const dataStr = JSON.stringify(workspaces, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `PPCPlanner_Data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const importWorkspaceData = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                resolve(data);
            } catch (error) {
                reject(new Error('Invalid JSON file. Please select a valid PPC Planner data file.'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsText(file);
    });
};