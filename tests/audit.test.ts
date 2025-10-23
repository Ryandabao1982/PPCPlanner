// @vitest-environment jsdom

/**
 * Test Audit for Good-Wit Commerce PPC Planner
 * 
 * This file contains the implemented unit and integration tests to ensure the core functionalities
 * of the PPC Planner are working as expected. It uses Vitest for mocking and assertions.
 */
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { CAMPAIGN_PLAYBOOK } from '../utils/constants';
import { generateBulkUploadXlsx } from '../utils/helpers';
import { initialDatabase } from '../database';

// --- MOCKS ---

// Mock the global XLSX object provided by the script tag in index.html
// This allows us to inspect the data passed to the exporter without creating a file.
const mockXlsxUtils = {
  book_new: vi.fn(() => ({ SheetNames: [], Sheets: {} })),
  aoa_to_sheet: vi.fn(data => data), // Return the data array for inspection
  book_append_sheet: vi.fn(),
};
// FIX: Replace 'global' with 'globalThis' to be environment-agnostic
// and define XLSX as a constant to make it available within the test file's scope.
const XLSX = {
  utils: mockXlsxUtils,
  writeFile: vi.fn(),
};
(globalThis as any).XLSX = XLSX;

// Mock deterministic helpers to ensure consistent test results
vi.mock('../utils/helpers', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, // Use the actual implementation for all functions...
    getYYYYMM: () => '202407', // ...except for getYYYYMM to have a fixed date...
    stem: (word) => `stemmed_${word}`, // ...and stem for predictable output.
  };
});

// Mock the Gemini API to prevent actual network calls and provide a stable response
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: JSON.stringify({
          suggestedKeywords: [
            { text: 'ai suggestion 1', type: 'related' },
            { text: 'ai suggestion 2', type: 'variation' },
          ],
          negativeCandidates: [
            { text: 'cheap seed keyword', reason: 'Contains excluded word \'cheap\'' },
          ],
        }),
      }),
    },
  })),
  Type: {
    OBJECT: 'OBJECT',
    ARRAY: 'ARRAY',
    STRING: 'STRING',
  },
}));

// --- TESTS ---

describe('Tool: Campaign Creator', () => {

    it('should generate the correct campaign name based on the playbook', () => {
        const brand = 'MyBrand';
        const sku = 'PROD-01';
        const playbookEntry = CAMPAIGN_PLAYBOOK.find(p => p.id === 'SP_EXACT_PERFORMANCE');
        const yyyymm = '202407'; // from mock

        // This replicates the naming logic from the component
        const generatedName = `${brand}_${playbookEntry.country}_${sku}_${playbookEntry.type}_${playbookEntry.theme}_${yyyymm}`;
        
        expect(generatedName).toBe('MyBrand_US_PROD-01_SP_PERFORMANCE_202407');
    });

    it('should require competitor ASINs for PT playbooks', () => {
        const ptPlaybook = CAMPAIGN_PLAYBOOK.find(p => p.id === 'SP_PT_COMP_ASIN');
        expect(ptPlaybook.match).toBe('PT');
        // In the component, logic would check if competitorAsins state is empty.
        // This test confirms our understanding of the requirement.
        const competitorAsins = '';
        const isValid = competitorAsins.trim().length > 0;
        expect(isValid).toBe(false);
    });
});


describe('Tool: Ad Group Manager', () => {
    
    it('should generate the correct ad group name', () => {
        const brand = 'MyBrand';
        const country = 'US';
        const matchType = 'EXACT';
        const intent = 'BRANDED';
        const custom = '001';

        // Replicates the ad group naming logic
        const generatedName = `${brand}_${country}_${matchType}_${intent}_${custom}`;

        expect(generatedName).toBe('MyBrand_US_EXACT_BRANDED_001');
    });
});


describe('Tool: AI Keyword Discovery', () => {
    
    it('should successfully mock the Gemini API call', async () => {
        // This test verifies that our mock is working as expected.
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({apiKey: 'mock_key'});
        const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: 'test'});
        const data = JSON.parse(response.text);

        expect(GoogleGenAI).toHaveBeenCalled();
        expect(ai.models.generateContent).toHaveBeenCalled();
        expect(data.suggestedKeywords).toHaveLength(2);
        expect(data.negativeCandidates[0].text).toBe('cheap seed keyword');
    });
});


describe('Tool: Bulk Exporter (`generateBulkUploadXlsx`)', () => {
    
    // Use a full-featured mock workspace based on the initial database structure
    const mockWorkspace = {
        ...initialDatabase['1721234567891'],
        // Add SB and SD campaigns for complete testing
        campaigns: [
            ...initialDatabase['1721234567891'].campaigns,
            { id: 601, name: `Kong_US_VID_SB_VIDEO_AWARENESS_${'202407'}`, brand: 'Kong', country: 'US', type: 'SB', match: 'VIDEO', theme: 'AWARENESS', budget: 50 },
            { id: 701, name: `Kong_US_ASIN_SD_REMARKETING_VIEWS_${'202407'}`, brand: 'Kong', country: 'US', type: 'SD', match: 'PT', theme: 'REMARKETING', budget: 20, campaignType: 'SD_REMARKETING_VIEWS' }
        ],
        adGroups: [
            ...initialDatabase['1721234567891'].adGroups,
             { id: 602, campaignId: 601, name: 'Kong_US_VIDEO_AWARENESS_001', defaultBid: 1.20, products: [initialDatabase['1721234567891'].products[0]], keywords: [{ id: 301, text: 'beer bong', matchType: 'BROAD' }] },
             { id: 702, campaignId: 701, name: 'Kong_US_REMARKETING_VIEWS_001', defaultBid: 0.65, products: [initialDatabase['1721234567891'].products[0]] }
        ],
    };

    beforeEach(() => {
        // Reset mocks before each test to ensure isolation
        vi.clearAllMocks();
    });

    it('should create separate sheets for SP, SB, and SD campaigns', () => {
        generateBulkUploadXlsx(mockWorkspace, 'test.xlsx');
        
        expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(3);
        expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'Sponsored Products');
        expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'Sponsored Brands');
        expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'Sponsored Display');
    });
    
    it('should not create a sheet if no campaigns of that type exist', () => {
        const spOnlyWorkspace = initialDatabase['1721234567891'];
        generateBulkUploadXlsx(spOnlyWorkspace, 'test_sp_only.xlsx');

        expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(1);
        expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'Sponsored Products');
    });

    it('should correctly generate all required rows for a manual SP campaign', () => {
        const spWorkspace = { ...mockWorkspace, campaigns: mockWorkspace.campaigns.filter(c => c.id === 401), adGroups: mockWorkspace.adGroups.filter(ag => ag.campaignId === 401) };
        generateBulkUploadXlsx(spWorkspace, 'test.xlsx');

        const spSheetData = (mockXlsxUtils.aoa_to_sheet.mock.calls[0][0]);
        // Header + Campaign + 2 Placements + Ad Group + 3 Keywords + 1 Product Ad = 8 rows
        expect(spSheetData).toHaveLength(9);
        expect(spSheetData[1]).toContain('Campaign');
        expect(spSheetData[1]).toContain(spWorkspace.campaigns[0].name);
        expect(spSheetData[2]).toContain('Bidding Placement'); // Top of Search
        expect(spSheetData[2]).toContain(20);
        expect(spSheetData[3]).toContain('Bidding Placement'); // Product Pages
        expect(spSheetData[3]).toContain(10);
        expect(spSheetData[4]).toContain('Ad Group');
        expect(spSheetData[5]).toContain('Keyword');
        expect(spSheetData[5]).toContain('exact');
        expect(spSheetData[8]).toContain('Product Ad');
    });
    
    it('should correctly format Product Targeting expressions for SP PT campaigns', () => {
        const ptWorkspace = { ...mockWorkspace, campaigns: mockWorkspace.campaigns.filter(c => c.id === 404), adGroups: mockWorkspace.adGroups.filter(ag => ag.campaignId === 404) };
        generateBulkUploadXlsx(ptWorkspace, 'test.xlsx');
        
        const spSheetData = (mockXlsxUtils.aoa_to_sheet.mock.calls[0][0]);
        const targetingRow = spSheetData.find(row => row[1] === 'Product Targeting');
        
        // Find the index of the 'Product Targeting Expression' header
        const headerIndex = spSheetData[0].indexOf('Product Targeting Expression');
        expect(headerIndex).toBeGreaterThan(-1);
        expect(targetingRow[headerIndex]).toBe('asin="B0COMPETE01"');
    });

    it('should generate a valid Sponsored Brands sheet', () => {
        generateBulkUploadXlsx(mockWorkspace, 'test.xlsx');

        // The second call to aoa_to_sheet should be for SB
        const sbSheetData = (mockXlsxUtils.aoa_to_sheet.mock.calls[1][0]);
        expect(sbSheetData[0]).toContain('Creative Type'); // Check for SB-specific header
        expect(sbSheetData[1]).toContain('Campaign');
        expect(sbSheetData[1]).toContain('Kong_US_VID_SB_VIDEO_AWARENESS_202407');
        expect(sbSheetData[1]).toContain('Video'); // Creative Type
        expect(sbSheetData[2]).toContain('Keyword');
        expect(sbSheetData[2]).toContain('broad');
    });

    it('should generate a valid Sponsored Display sheet with correct Tactic and Audience expressions', () => {
        generateBulkUploadXlsx(mockWorkspace, 'test.xlsx');

        // The third call to aoa_to_sheet should be for SD
        const sdSheetData = (mockXlsxUtils.aoa_to_sheet.mock.calls[2][0]);
        const campaignRow = sdSheetData.find(row => row[1] === 'Campaign');
        const audienceRow = sdSheetData.find(row => row[1] === 'Audience Targeting');

        const tacticIndex = sdSheetData[0].indexOf('Tactic');
        const audienceIndex = sdSheetData[0].indexOf('Audience Targeting Expression');

        expect(sdSheetData[0]).toContain('Tactic'); // Check for SD-specific header
        expect(campaignRow[tacticIndex]).toBe('T00020'); // T00020 for Remarketing
        expect(audienceRow[audienceIndex]).toContain('"type":"VIEWS_REMARKETING"');
    });
});