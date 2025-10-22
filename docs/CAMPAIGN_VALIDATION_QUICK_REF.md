# Campaign Template Quick Reference

A quick reference guide for all campaign templates and their validation rules.

## Sponsored Products (SP)

| Campaign Type | Match Type | Max Keywords | Bid Strategy | TOS Modifier | Budget % | Notes |
|---------------|------------|--------------|--------------|--------------|----------|-------|
| **SP_AUTO_RESEARCH** | AUTO | 0 (auto only) | down | 0% | 5-10% | Bid ≤ 70% suggested |
| **SP_BROAD_RESEARCH** | BROAD | 50 | down | 0% | 10-15% | Bid ≤ 80% suggested |
| **SP_PHRASE_RESEARCH** | PHRASE | 50 | down | 0% | 10% | Bid ≤ 90% suggested |
| **SP_EXACT_PERFORMANCE** | EXACT | 15 | up_down ⚠️ | ≥ 20% | 20% | Bid = 100% suggested |
| **SP_EXACT_SKAG** | EXACT | 1 ⚠️ | up_down | ≥ 30% | 5% | One keyword per ad group |
| **SP_BRANDED_UMBRELLA** | EXACT/PHRASE | - | up_down | ≥ 50% | ≤ 10% | Must contain brand name |
| **SP_EXACT_COMP** | EXACT | - | down | 15% | 5% | Competitor terms |
| **SP_PT_BRANDED** | PT | 0 ⚠️ | down | 0% | 5% | Product targeting only |
| **SP_PT_COMP_ASIN** | PT | 0 ⚠️ | down | 0% | 5% | Product targeting only |
| **SP_PT_CATEGORY** | PT | 0 ⚠️ | down | 0% | 5% | Product targeting only |
| **SP_PT_CROSSSELL** | PT | 0 ⚠️ | down | 0% | 5% | Product targeting only |

⚠️ = Critical requirement

---

## Sponsored Brands (SB)

| Campaign Type | Match Type | Creative Required | Bid Strategy | Budget % | Primary KPI |
|---------------|------------|-------------------|--------------|----------|-------------|
| **SB_EXACT_BRANDED** | EXACT | Yes (logo + headline) | down | 5% | New-to-Brand |
| **SB_EXACT_COMP** | EXACT | Yes (logo + headline) | down | 5% | New-to-Brand |
| **SB_BROAD_RESEARCH** | BROAD | Yes (logo + headline) | down | 5% | Clicks |
| **SB_BROAD_CATEGORY** | BROAD | Yes (logo + headline) | down | 5% | Clicks |
| **SB_VIDEO_AWARENESS** | VIDEO | Yes (video ⚠️) | down | 5% | VCPM, Video Views |
| **SB_VIDEO_CONSIDERATION** | VIDEO | Yes (video ⚠️) | down | 5% | CTR, Detail Page Views |
| **SB_STORE_TRAFFIC** | BROAD | Yes (Brand Store link) | down | 5% | Store Visits |
| **SB_BUNDLE_PROMO** | EXACT | Yes (bundle creative) | down | 2% | ROAS |
| **SB_EVENT_LAUNCH** | BROAD | Yes (event-themed) | down | 2% | Impressions, Clicks |

⚠️ = Creative type requirement

---

## Sponsored Display (SD)

| Campaign Type | Targeting | Tactic | Creative | Budget % | Primary KPI |
|---------------|-----------|--------|----------|----------|-------------|
| **SD_REMARKETING_VIEWS** | Audience | T00020 | Retargeting | 5% | ROAS |
| **SD_REMARKETING_CART** | Audience | T00020 | Retargeting | 5% | ROAS |
| **SD_REMARKETING_BUYERS** | Audience | T00020 | Retargeting | 5% | ROAS |
| **SD_AUDIENCE_INMARKET** | Audience | T00030 | Category-aligned | 2% | CTR |
| **SD_AUDIENCE_LIFESTYLE** | Audience | T00030 | Lifestyle-aligned | 2% | CTR |
| **SD_PT_BRANDED** | Product | T00020 | Defensive | 2% | ROAS |
| **SD_PT_COMP** | Product | T00020 | Offensive | 2% | ROAS |
| **SD_PT_CATEGORY** | Product | T00020 | Category | 2% | ROAS |
| **SD_PT_CROSSSELL** | Product | T00020 | Cross-sell | 2% | ROAS |

---

## Validation Checklist

### Before Creating a Campaign

- [ ] Campaign type matches targeting method (e.g., PT campaigns must use product targeting)
- [ ] Keywords match the allowed match types for the campaign
- [ ] Keyword count doesn't exceed maximum for campaign type
- [ ] Bid is within suggested bid guidelines
- [ ] Bid strategy is correct (especially for Performance campaigns)
- [ ] Top of Search modifier meets minimum requirements
- [ ] Budget allocation is within recommended range
- [ ] Creative assets are prepared (for SB/SD campaigns)

### Product Targeting Campaigns

- [ ] No keywords present (PT campaigns use product targets only)
- [ ] At least one product target (ASIN or category) specified
- [ ] Product targets are valid ASINs (format: B0XXXXXXXX)

### SKAG Campaigns

- [ ] Exactly 1 keyword per ad group
- [ ] Match type is EXACT
- [ ] Top of Search modifier ≥ 30%

### Branded Campaigns

- [ ] All keywords contain brand name
- [ ] Only EXACT and PHRASE match types used
- [ ] Budget ≤ 10% of total

---

## Quick Validation Examples

### ✅ Valid SP_AUTO_RESEARCH
```javascript
{
  campaignType: 'SP_AUTO_RESEARCH',
  match: 'AUTO',
  keywords: [],           // Empty!
  productTargets: [],     // Empty!
  defaultBid: 0.70,      // 70% of suggested
  bidStrategy: 'down'
}
```

### ✅ Valid SP_EXACT_PERFORMANCE
```javascript
{
  campaignType: 'SP_EXACT_PERFORMANCE',
  match: 'EXACT',
  keywords: [
    { text: 'keyword 1', matchType: 'EXACT' },
    { text: 'keyword 2', matchType: 'EXACT' }
    // ... up to 15 total
  ],
  bidStrategy: 'up_down',  // Required!
  tosModifier: 20          // At least 20%
}
```

### ✅ Valid SP_PT_COMP_ASIN
```javascript
{
  campaignType: 'SP_PT_COMP_ASIN',
  match: 'PT',
  keywords: [],                    // Must be empty!
  productTargets: [
    'B0ABC123DE',
    'B0XYZ789FG'
  ]
}
```

### ❌ Invalid SP_AUTO_RESEARCH (has keywords)
```javascript
{
  campaignType: 'SP_AUTO_RESEARCH',
  match: 'AUTO',
  keywords: [{ text: 'water bottle', matchType: 'BROAD' }],  // ❌ Not allowed!
}
```

### ❌ Invalid SP_EXACT_SKAG (too many keywords)
```javascript
{
  campaignType: 'SP_EXACT_SKAG',
  keywords: [
    { text: 'keyword 1', matchType: 'EXACT' },
    { text: 'keyword 2', matchType: 'EXACT' }  // ❌ SKAG = 1 keyword only!
  ]
}
```

---

## Bid Strategy Reference

| Strategy Code | Amazon Label | Use Cases |
|---------------|--------------|-----------|
| `fixed` | Fixed bids | Legacy campaigns, manual control |
| `down` | Dynamic bids - down only | Research, Discovery, Branded |
| `up_down` | Dynamic bids - up and down | **Performance, SKAG** (required) |

---

## Common Error Messages

| Error | Campaign Type | Solution |
|-------|---------------|----------|
| "must use Auto targeting" | SP_AUTO_RESEARCH | Set match: 'AUTO', remove keywords |
| "must use up and down strategy" | SP_EXACT_PERFORMANCE, SP_EXACT_SKAG | Set bidStrategy: 'up_down' |
| "exactly 1 keyword per ad group" | SP_EXACT_SKAG | Use only 1 keyword |
| "only contain Exact match" | SP_EXACT_* | All keywords must be matchType: 'EXACT' |
| "must contain brand name" | SP_BRANDED | Include brand in all keywords |
| "cannot have keywords" | SP_PT_*, SD_PT_* | Remove keywords, use productTargets |
| "must have product targets" | PT campaigns | Add at least 1 ASIN or category |
| "max 15 keywords" | SP_EXACT_PERFORMANCE | Reduce keyword count |
| "max 50 keywords" | SP_BROAD_RESEARCH, SP_PHRASE_RESEARCH | Reduce keyword count |
| "≥ 20%" | SP_EXACT_PERFORMANCE | Increase tosModifier to 20+ |
| "≥ 30%" | SP_EXACT_SKAG | Increase tosModifier to 30+ |

---

## Testing Commands

```bash
# Run all validation tests
npx vitest run tests/validation.test.ts

# Run all tests
npx vitest run

# Watch mode for development
npx vitest watch tests/validation.test.ts
```

---

## Further Reading

- [Full Campaign Validation Documentation](./CAMPAIGN_VALIDATION.md)
- [Campaign Playbook Constants](../utils/constants.ts)
- [Validation Utilities](../utils/validation.ts)
- [Campaign Creator Component](../components/CampaignCreator.tsx)
