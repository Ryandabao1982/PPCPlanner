# Campaign Template Validation Rules

This document describes the validation rules for Amazon Ads campaign templates based on best practices and the Campaign Taxonomy Full Playbook.

## Overview

Campaign templates enforce specific rules to ensure campaigns adhere to Amazon Ads best practices. Each campaign type has specific requirements for targeting, match types, bid strategies, and budget allocation.

## Sponsored Products (SP) Templates

### SP_AUTO_RESEARCH

**Purpose**: Discover new keywords through auto-targeting

**Validation Rules**:
- ✅ Must use Auto targeting (no manual keywords or product targets)
- ✅ Bid must be ≤ 70% of Amazon Suggested Bid
- ✅ Budget allocation: 5-10% of total
- ✅ Bid strategy: Dynamic bids - down only

**Example**:
```javascript
{
  campaignType: 'SP_AUTO_RESEARCH',
  type: 'SP',
  match: 'AUTO',
  defaultBid: 0.70, // 70% of $1.00 suggested bid
  budgetAllocation: 5,
  bidStrategy: 'down'
}
```

---

### SP_BROAD_RESEARCH

**Purpose**: Discover keywords using broad match

**Validation Rules**:
- ✅ Match type must be Broad only
- ✅ Max 50 keywords per ad group
- ✅ Bid must be ≤ 80% of Amazon Suggested Bid
- ✅ Budget allocation: 10-15% of total
- ✅ Bid strategy: Dynamic bids - down only

---

### SP_PHRASE_RESEARCH

**Purpose**: Discover keywords using phrase match

**Validation Rules**:
- ✅ Match type must be Phrase only
- ✅ Max 50 keywords per ad group
- ✅ Bid must be ≤ 90% of Amazon Suggested Bid
- ✅ Bid strategy: Dynamic bids - down only

---

### SP_EXACT_PERFORMANCE

**Purpose**: Drive conversions with high-performing exact match keywords

**Validation Rules**:
- ✅ Match type must be Exact only
- ✅ Max 15 keywords per ad group
- ✅ Bid = Amazon Suggested Bid × 1.0
- ✅ Top of Search modifier must be ≥ 20%
- ✅ Bid strategy: **Required** - Dynamic bids - up and down

**Example**:
```javascript
{
  campaignType: 'SP_EXACT_PERFORMANCE',
  type: 'SP',
  match: 'EXACT',
  keywords: [
    { text: 'premium water bottle', matchType: 'EXACT' },
    { text: 'insulated water bottle', matchType: 'EXACT' }
  ], // Max 15 keywords
  bidStrategy: 'up_down', // Required!
  tosModifier: 20 // At least 20%
}
```

---

### SP_EXACT_SKAG

**Purpose**: Single Keyword Ad Groups for ultimate control

**Validation Rules**:
- ✅ Match type must be Exact
- ✅ **Exactly 1 keyword per ad group** (SKAG principle)
- ✅ Bid = Amazon Suggested Bid × 1.2
- ✅ Top of Search modifier must be ≥ 30%
- ✅ Bid strategy: Dynamic bids - up and down

---

### SP_BRANDED_UMBRELLA

**Purpose**: Protect brand terms from competitors

**Validation Rules**:
- ✅ All keywords must contain the brand name
- ✅ Only Exact and Phrase match types allowed (no Broad)
- ✅ Bid must be ≤ 80% of Amazon Suggested Bid
- ✅ Budget must be ≤ 10% of total

**Example**:
```javascript
{
  campaignType: 'SP_BRANDED_UMBRELLA',
  keywords: [
    { text: 'mybrand water bottle', matchType: 'EXACT' },   // ✅ Contains brand
    { text: 'mybrand insulated', matchType: 'PHRASE' },     // ✅ Contains brand
    { text: 'generic water bottle', matchType: 'EXACT' }    // ❌ Missing brand name!
  ]
}
```

---

### SP_EXACT_COMP

**Purpose**: Target competitor brand terms

**Validation Rules**:
- ✅ Match type must be Exact
- ✅ Keywords should be competitor brand terms
- ✅ Bid = Amazon Suggested Bid × 1.0

---

### SP Product Targeting (PT_BRANDED, PT_COMP_ASIN, PT_CATEGORY, PT_CROSSSELL)

**Purpose**: Target specific ASINs or categories

**Validation Rules**:
- ✅ Must use PT (Product Targeting) type
- ✅ **Cannot have keywords** (product targeting only)
- ✅ Must have at least one product target (ASIN or category)
- ✅ Bid must be ≤ 90% of Amazon Suggested Bid
- ✅ Placement: Product Pages recommended

**Example**:
```javascript
{
  campaignType: 'SP_PT_COMP_ASIN',
  type: 'SP',
  match: 'PT',
  keywords: [], // Must be empty!
  productTargets: ['B0ABC123DE', 'B0XYZ789FG'], // Required
  placementStrategy: 'Product Pages'
}
```

---

## Sponsored Brands (SB) Templates

### SB_EXACT_BRANDED / SB_EXACT_COMP

**Purpose**: Branded campaigns for top of search visibility

**Validation Rules**:
- ✅ Match type must be Exact
- ✅ Must include brand or competitor term in keywords
- ✅ Creative asset required (brand logo, headline, 3+ products)
- ✅ Bid = Amazon Suggested Bid × 1.0

---

### SB_BROAD_RESEARCH / SB_BROAD_CATEGORY

**Purpose**: Broad keyword discovery and brand awareness

**Validation Rules**:
- ✅ Match type must be Broad
- ✅ Keywords must align with product category
- ✅ Creative required

---

### SB_VIDEO_AWARENESS / SB_VIDEO_CONSIDERATION

**Purpose**: Video campaigns for awareness and consideration

**Validation Rules**:
- ✅ Must use VIDEO creative type
- ✅ Video creative required
- ✅ Campaign objective: Video Views or Consideration
- ✅ Bid = Amazon Suggested Bid × 1.0

---

### SB_STORE_TRAFFIC

**Purpose**: Drive traffic to Brand Store

**Validation Rules**:
- ✅ Destination must be Brand Store
- ✅ Headline must include brand or product
- ✅ Creative required

---

### SB_BUNDLE_PROMO

**Purpose**: Promote bundles or special offers

**Validation Rules**:
- ✅ Must reference bundle in headline/creative
- ✅ Can target bundle-related keywords or ASINs

---

### SB_EVENT_LAUNCH

**Purpose**: Event-driven campaigns (e.g., Prime Day)

**Validation Rules**:
- ✅ Campaign dates must align with event
- ✅ Use event-themed creative

---

## Sponsored Display (SD) Templates

### SD_REMARKETING_VIEWS / SD_REMARKETING_CART / SD_REMARKETING_BUYERS

**Purpose**: Retarget based on customer behavior

**Validation Rules**:
- ✅ Must be Sponsored Display type
- ✅ Theme must be REMARKETING
- ✅ Audience = Remarketing (Views / Cart / Buyers)
- ✅ Creative must be retargeting-optimized
- ✅ Bid = Amazon Suggested Bid × 1.0

---

### SD_AUDIENCE_INMARKET / SD_AUDIENCE_LIFESTYLE

**Purpose**: Target Amazon-defined audience segments

**Validation Rules**:
- ✅ Must be Sponsored Display type
- ✅ Theme must be AUDIENCE
- ✅ Audience = Amazon-defined segments (in-market / lifestyle)
- ✅ Relevance to product category required

---

### SD Product Targeting (PT_BRANDED, PT_COMP, PT_CATEGORY, PT_CROSSSELL)

**Purpose**: Display ads on specific product pages

**Validation Rules**:
- ✅ Must be Sponsored Display type
- ✅ Must use PT targeting
- ✅ Must have product targets (ASINs or categories)
- ✅ No audience overlap with remarketing
- ✅ Creative must align with context

---

## General Template-Level Guardrails

These apply across all templates:

### 1. Bid Caps
```javascript
// Enforce max CPC ceiling (e.g., $2.00 or category benchmark)
validateBidCap(bid: 2.50, maxBid: 2.00) // ❌ Fails
validateBidCap(bid: 1.50, maxBid: 2.00) // ✅ Passes
```

### 2. Budget Guardrails
```javascript
// Budget allocation must be 0-100%
validateBudgetAllocation(allocation: 150, totalBudget: 1000) // ❌ Fails
validateBudgetAllocation(allocation: 50, totalBudget: 1000)  // ✅ Passes
```

### 3. Naming Convention
Format: `{Brand}_{CampaignType}_{FunnelStage}_{Date}`

Example: `MyBrand_SP_EXACT_PERFORMANCE_CONVERSION_202410`

### 4. Negative Keyword Sync
- Auto-apply negatives from research campaigns to performance campaigns weekly

### 5. Lifecycle Flag
Tag campaigns with: `Launch` / `Optimize` / `Scale` / `Maintain`

### 6. KPI Tracking
Each template has a primary KPI:
- **SP_EXACT_PERFORMANCE**: ACOS
- **SP_BRANDED**: Impression Share
- **SB_VIDEO**: CTR
- **SD_REMARKETING**: ROAS

---

## Usage in Code

### Validating a Campaign Template

```javascript
import { campaignValidators, CampaignValidationContext } from './utils/validation';

// Create validation context
const context: CampaignValidationContext = {
  campaignType: 'SP_EXACT_PERFORMANCE',
  type: 'SP',
  match: 'EXACT',
  theme: 'PERFORMANCE',
  keywords: [
    { text: 'water bottle', matchType: 'EXACT' }
  ],
  defaultBid: 1.25,
  bidStrategy: 'up_down',
  tosModifier: 30,
  budgetAllocation: 20
};

// Validate using master validator
const result = campaignValidators.validateCampaignTemplate(context, 'MyBrand');

if (!result.isValid) {
  console.error('Validation failed:', result.error);
} else {
  console.log('Campaign template is valid!');
}
```

### Validating Individual Campaign Types

```javascript
// Validate specific campaign type
const spAutoResult = campaignValidators.validateSpAutoResearch(context);
const spBrandedResult = campaignValidators.validateSpBranded(context, 'MyBrand');
const ptResult = campaignValidators.validateSpProductTargeting(context);
```

---

## Common Validation Errors

### ❌ "SP_AUTO_RESEARCH must use Auto targeting"
**Solution**: Set `match: 'AUTO'` and remove any manual keywords or product targets

### ❌ "SP_EXACT_PERFORMANCE should use 'Dynamic bids - up and down' strategy"
**Solution**: Set `bidStrategy: 'up_down'`

### ❌ "SP_EXACT_SKAG must have exactly 1 keyword per ad group"
**Solution**: Ensure each ad group contains only 1 keyword for SKAG campaigns

### ❌ "SP_BRANDED keywords must contain the brand name"
**Solution**: Ensure all keywords include the brand name (e.g., "mybrand water bottle")

### ❌ "SP Product Targeting campaigns cannot have keywords"
**Solution**: Remove all keywords from PT campaigns - they use product targets only

### ❌ "SP_EXACT_PERFORMANCE should have max 15 keywords per ad group"
**Solution**: Reduce the number of keywords to 15 or fewer

### ❌ "Bid exceeds max CPC ceiling"
**Solution**: Reduce bid to stay within the maximum allowed bid cap

---

## Testing Validation Rules

Run the test suite to verify validation rules:

```bash
npm install jsdom -D
npx vitest run tests/validation.test.ts
```

All 37 validation tests should pass. ✅

---

## References

- Campaign Taxonomy Full Playbook
- Amazon Ads Best Practices
- Sponsored Products Guidelines
- Sponsored Brands Guidelines
- Sponsored Display Guidelines
