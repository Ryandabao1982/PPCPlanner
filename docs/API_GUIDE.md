# API Integration Guide

Guide for integrating external APIs and services with the GoodWit PPC Planner.

---

## Table of Contents

- [Google Gemini AI](#google-gemini-ai)
- [Data Import/Export APIs](#data-importexport-apis)
- [Future API Integrations](#future-api-integrations)
- [Security Best Practices](#security-best-practices)

---

## Google Gemini AI

The AI Plan Report Generator uses Google's Gemini AI API to analyze PPC plans and generate insights.

### Setup

#### 1. Get API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Navigate to "Get API Key"
4. Create a new API key
5. Copy the key

#### 2. Configure Environment

Create `.env.local` file in project root:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Important**: Never commit this file to version control!

#### 3. Access in Code

```typescript
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

**Note**: Vite requires the `VITE_` prefix for client-side environment variables.

### Usage

#### Basic Example

```typescript
import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const result = await model.generateContent(prompt);
const response = await result.response;
const text = response.text();
```

#### Current Implementation

Located in `components/PlanReportGenerator.tsx`:

```typescript
const generateReport = async () => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Build prompt from plan data
  const prompt = buildPrompt(workspace);
  
  // Generate analysis
  const result = await model.generateContent(prompt);
  const analysis = await result.response.text();
  
  // Parse and display
  parseAndDisplayReport(analysis);
};
```

### Prompt Engineering

The application uses carefully crafted prompts to generate brand-focused insights.

#### Prompt Structure

```typescript
const prompt = `
Analyze this Amazon PPC advertising plan and provide a concise, 
brand-focused executive analysis optimized for stakeholder presentations.

PLAN DATA:
${JSON.stringify(planData, null, 2)}

ANALYSIS REQUIREMENTS:
1. Executive Summary (2-3 sentences)
2. Key Strengths (3-4 bullet points)
3. Growth Opportunities (3-4 bullet points)
4. Budget Analysis (brief assessment)
5. Keyword Strategy (quick evaluation)
6. Campaign Structure (short review)
7. Recommendations (3-4 specific, prioritized actions)

GUIDELINES:
- Focus on business impact, not technical details
- Use concise language (2-3 sentence summaries)
- Highlight competitive advantages
- Include clear business value for each recommendation
- Optimize for brand executive understanding
`;
```

### Rate Limits

**Free Tier**:
- 60 requests per minute
- 1,500 requests per day

**Handling Rate Limits**:

```typescript
try {
  const result = await model.generateContent(prompt);
  // Process result
} catch (error) {
  if (error.status === 429) {
    showToast('Rate limit exceeded. Please try again in a moment.', 'warning');
  } else {
    showToast('Failed to generate report. Please try again.', 'error');
  }
}
```

### Error Handling

```typescript
const generateReport = async () => {
  try {
    // Validate API key
    if (!apiKey) {
      throw new Error('API key not configured');
    }
    
    // Validate plan data
    if (!workspace || !workspace.campaigns.length) {
      throw new Error('No plan data to analyze');
    }
    
    // Generate report
    const result = await model.generateContent(prompt);
    
    // Validate response
    if (!result.response) {
      throw new Error('Empty response from API');
    }
    
    return result.response.text();
    
  } catch (error) {
    console.error('Report generation failed:', error);
    throw error;
  }
};
```

### Production Considerations

⚠️ **Current Implementation**: Client-side (demo only)

For production, implement a backend proxy:

#### Backend Proxy Example (Node.js/Express)

```javascript
// server.js
import express from 'express';
import { GoogleGenerativeAI } from '@google/genai';

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate-report', async (req, res) => {
  try {
    const { planData } = req.body;
    
    // Validate input
    if (!planData) {
      return res.status(400).json({ error: 'Missing plan data' });
    }
    
    // Generate report
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = buildPrompt(planData);
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    
    res.json({ report: text });
    
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.listen(3000);
```

#### Frontend Update

```typescript
// Replace direct API call with backend request
const generateReport = async (planData) => {
  const response = await fetch('/api/generate-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planData })
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate report');
  }
  
  const { report } = await response.json();
  return report;
};
```

### Cost Estimation

**Gemini Pro Pricing** (as of October 2024):
- Free tier: 1,500 requests/day
- Paid: ~$0.00025 per 1K characters (input)
- Paid: ~$0.0005 per 1K characters (output)

**Average Report**:
- Input: ~2,000 characters (plan data)
- Output: ~1,500 characters (analysis)
- Cost: ~$0.001 per report

**Monthly estimate** (100 reports/day):
- Free tier: $0 (under daily limit)
- Paid: ~$3/month

---

## Data Import/Export APIs

### Export to XLSX (Bulk Upload)

Uses custom implementation to generate Amazon Ads-compatible XLSX files.

#### Implementation

Located in `utils/helpers.ts`:

```typescript
export const generateBulkUploadXlsx = (workspace: Workspace) => {
  // Create workbook
  const workbook = createWorkbook();
  
  // Add campaigns sheet
  const campaignSheet = createSheet('Campaigns', [
    ['Campaign Name', 'Budget', 'Status', 'Type', 'Bidding Strategy'],
    ...workspace.campaigns.map(c => [
      c.name,
      c.budget,
      'Enabled',
      c.type,
      c.biddingStrategy
    ])
  ]);
  
  // Add ad groups sheet
  const adGroupSheet = createSheet('Ad Groups', [
    ['Campaign Name', 'Ad Group Name', 'Default Bid', 'Status'],
    ...workspace.adGroups.map(ag => [
      getCampaignName(ag.campaignId),
      ag.name,
      ag.defaultBid,
      'Enabled'
    ])
  ]);
  
  // Add keywords sheet
  // Add product targeting sheet
  
  // Generate and download file
  downloadWorkbook(workbook, `${workspace.name}_bulk_upload.xlsx`);
};
```

#### Format Specification

**Campaign Sheet**:
```
Campaign Name | Budget | Status | Type | Bidding Strategy
Brand_US_...  | 50.00  | Enabled| SP   | down
```

**Ad Group Sheet**:
```
Campaign Name | Ad Group Name | Default Bid | Status
Brand_US_...  | Brand_US_...  | 1.50       | Enabled
```

**Keyword Sheet**:
```
Campaign | Ad Group | Keyword | Match Type | Bid
Brand_US | Brand_US | keyword | exact      | 1.50
```

### Import Workspace Data

JSON-based format for importing/exporting complete workspaces.

#### Format

```json
{
  "version": "1.0",
  "workspace": {
    "id": 1,
    "name": "Kong Beer Bong",
    "brand": "Kong",
    "country": "US",
    "createdAt": "2024-10-01T00:00:00Z",
    "lastModified": "2024-10-15T00:00:00Z",
    "campaigns": [...],
    "adGroups": [...],
    "keywords": [...],
    "products": [...],
    "goals": [...]
  }
}
```

#### Export

```typescript
export const exportWorkspaceData = (workspace: Workspace) => {
  const data = {
    version: '1.0',
    workspace: workspace,
    exportedAt: new Date().toISOString()
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${workspace.name}_export_${Date.now()}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
};
```

#### Import

```typescript
export const importWorkspaceData = (file: File): Promise<Workspace> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result as string);
        
        // Validate format
        if (!data.workspace || !data.version) {
          throw new Error('Invalid workspace file format');
        }
        
        // Validate workspace structure
        validateWorkspace(data.workspace);
        
        resolve(data.workspace);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
```

---

## Future API Integrations

### Amazon Advertising API (Planned)

Integration with Amazon Ads API for:
- Campaign performance data
- Keyword performance metrics
- Bid recommendations
- Automated campaign creation

#### Planned Implementation

```typescript
// Future: Amazon Ads API integration
interface AmazonAdsClient {
  getCampaigns(): Promise<Campaign[]>;
  getCampaignMetrics(campaignId: string): Promise<Metrics>;
  updateCampaignBudget(campaignId: string, budget: number): Promise<void>;
  createCampaign(campaign: CampaignData): Promise<Campaign>;
}

const client = new AmazonAdsClient({
  clientId: process.env.AMAZON_ADS_CLIENT_ID,
  clientSecret: process.env.AMAZON_ADS_CLIENT_SECRET,
  refreshToken: process.env.AMAZON_ADS_REFRESH_TOKEN
});
```

### Google Sheets Integration (Planned)

Import/export data directly to Google Sheets.

```typescript
// Future: Google Sheets integration
import { GoogleSpreadsheet } from 'google-spreadsheet';

const exportToSheets = async (workspace: Workspace) => {
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth(credentials);
  await doc.loadInfo();
  
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRows(workspace.campaigns.map(formatCampaign));
};
```

### Slack Integration (Planned)

Notifications and report sharing via Slack.

```typescript
// Future: Slack integration
const sendReportToSlack = async (report: Report, webhookUrl: string) => {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'New PPC Plan Report Generated',
      attachments: [{
        title: report.title,
        text: report.summary,
        color: '#F8B500'
      }]
    })
  });
};
```

---

## Security Best Practices

### API Key Management

#### ✅ Do
- Store keys in environment variables
- Use `.env.local` for local development
- Add `.env.local` to `.gitignore`
- Rotate keys regularly
- Use different keys for dev/staging/production
- Implement server-side proxy for production

#### ❌ Don't
- Commit keys to version control
- Hardcode keys in source code
- Share keys in public channels
- Use production keys in development
- Expose keys in client-side code (production)

### API Security Checklist

- [ ] API keys stored in environment variables
- [ ] `.env.local` in `.gitignore`
- [ ] Server-side proxy for production
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error handling without exposing internals
- [ ] HTTPS only in production
- [ ] CORS properly configured
- [ ] Authentication for sensitive operations
- [ ] Logging and monitoring in place

### Error Handling

#### ✅ Good

```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API call failed:', error.message);
  showUserFriendlyError('Unable to complete request. Please try again.');
  logToMonitoring(error); // Internal logging
  throw new Error('API_CALL_FAILED'); // Generic error
}
```

#### ❌ Bad

```typescript
try {
  const result = await apiCall();
  return result;
} catch (error) {
  // Exposes internals to user
  alert(`API Error: ${error.message}, Key: ${apiKey}`);
  throw error; // Exposes stack trace
}
```

### Input Validation

Always validate user input before sending to APIs:

```typescript
const validatePlanData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.campaigns)) return false;
  if (data.campaigns.length === 0) return false;
  // ... more validation
  return true;
};

const callAPI = async (planData: any) => {
  if (!validatePlanData(planData)) {
    throw new Error('Invalid plan data');
  }
  
  // Safe to proceed
  return await api.generate(planData);
};
```

---

## Troubleshooting

### Common API Issues

#### Issue: "API key not configured"

**Cause**: Environment variable not set

**Solution**:
1. Create `.env.local` file
2. Add `GEMINI_API_KEY=your_key_here`
3. Restart dev server

#### Issue: "Rate limit exceeded"

**Cause**: Too many API calls

**Solution**:
- Wait before retrying
- Implement exponential backoff
- Use caching for repeated requests

#### Issue: "CORS error"

**Cause**: Cross-origin request blocked

**Solution**:
- Use server-side proxy
- Configure CORS headers on backend
- Ensure API allows your origin

#### Issue: "Invalid API key"

**Cause**: Wrong or expired key

**Solution**:
- Verify key is correct
- Check for extra spaces
- Generate new key if needed

---

## Testing APIs

### Manual Testing

```typescript
// Test API connection
const testConnection = async () => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Hello');
    console.log('✅ API connection successful');
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
};
```

### Automated Testing

```typescript
// tests/api.test.ts
import { describe, it, expect } from 'vitest';

describe('API Integration', () => {
  it('should connect to Gemini API', async () => {
    const result = await testConnection();
    expect(result).toBe(true);
  });
  
  it('should generate report', async () => {
    const report = await generateReport(samplePlanData);
    expect(report).toBeDefined();
    expect(report.summary).toContain('campaign');
  });
});
```

---

*Last Updated: October 22, 2024*
*Version: 0.0.0*
