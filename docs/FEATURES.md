# GoodWit PPC Planner - Features Guide

## Table of Contents

- [Dashboard](#dashboard)
- [Campaign Management](#campaign-management)
- [Ad Group Management](#ad-group-management)
- [Keyword Management](#keyword-management)
- [Asset Management](#asset-management)
- [Goals & Targeting](#goals--targeting)
- [Bidding & Budget](#bidding--budget)
- [Reports & Analytics](#reports--analytics)
- [Workspace Management](#workspace-management)
- [Advanced Features](#advanced-features)

---

## Dashboard

The Dashboard provides a comprehensive overview of your PPC plan with quick access to key metrics and actions.

### Plan Overview
- **Workspace Information**: View current workspace name, brand, and country
- **Quick Stats**: See totals for campaigns, ad groups, keywords, and products at a glance
- **Budget Summary**: Total allocated budget across all campaigns
- **Plan Status**: Frozen/Unfrozen state indicator

### Plan Summary
- **Campaign Breakdown**: List all campaigns with budget, ad groups, keywords
- **Match Type Distribution**: View keyword distribution by match type (Exact, Phrase, Broad)
- **Intent Analysis**: See keywords categorized by intent (Branded, Generic, Competitor, Research)
- **Health Metrics**: Plan completion percentage and recommendations

### AI Plan Report Generator
- **One-Click Analysis**: Generate comprehensive AI-powered plan analysis
- **Executive Summary**: 2-3 sentence business impact overview
- **Key Strengths**: Highlight competitive advantages
- **Growth Opportunities**: Identify improvement areas with business value
- **Budget & Keyword Analysis**: Strategic resource allocation review
- **Actionable Recommendations**: Prioritized next steps
- **HTML Export**: Download professional reports for presentations

### Quick Actions
- **Freeze/Unfreeze Plan**: Lock plan to prevent accidental changes
- **Export Bulk Upload**: Generate Amazon Ads-compatible XLSX file
- **Import/Export Workspace**: Save or load complete workspace data
- **Change Workspace**: Switch between different brand workspaces

---

## Campaign Management

Comprehensive tools for creating and managing Amazon Sponsored Product campaigns.

### Campaign Creator
- **Guided Workflow**: Step-by-step campaign creation process
- **Naming Convention**: Auto-generated campaign names following best practices
  - Format: `Brand_Country_SKU_Type_MatchType_Theme_YYYYMM`
- **Campaign Types**: Support for Sponsored Products (SP) with planned SB/SD support
- **Match Types**: Exact, Phrase, Broad, and Product Targeting
- **Theme Selection**: Branded, Generic, Competitor, Research strategies
- **Budget Settings**: Daily budget allocation with validation
- **Placement Modifiers**: Top of Search and Product Page bid adjustments

### Campaign Manager (Hierarchy View)
- **Tree Structure**: Visual hierarchy of campaigns → ad groups → keywords/products
- **Expand/Collapse**: Navigate complex campaign structures efficiently
- **Quick Edit**: Inline editing of campaign properties
- **Campaign Duplication**: Clone campaigns with all settings
- **Bulk Operations**: Select and modify multiple campaigns
- **Status Management**: Enable/pause/delete campaigns

### Campaign Features
- **Auto-Naming**: Intelligent campaign name generation
- **Budget Tracking**: Monitor spend allocation
- **Placement Strategies**: Configure Top of Search (0-900%) and Product Page (0-900%) modifiers
- **Country Targeting**: US, UK, CA, DE, FR, IT, ES, JP support
- **Date Stamping**: YYYYMM suffix for easy tracking

---

## Ad Group Management

Organize keywords and products into targeted ad groups for optimal campaign performance.

### Ad Group Creator
- **Smart Naming**: Auto-generated names based on campaign and intent
  - Format: `Brand_Country_MatchType_Intent_Custom`
- **Intent-Based Organization**: Group keywords by Branded, Generic, Competitor, Research
- **Match Type Alignment**: Ensure ad group match type matches keyword match type
- **Default Bid**: Set starting bids for all keywords in the ad group
- **Bidding Strategy**: Up-Only or Down-Only bid adjustment preferences

### Ad Group Manager
- **View by Campaign**: Filter ad groups by parent campaign
- **Keyword Assignment**: Assign keywords from keyword bank
- **Product Assignment**: Link products to ad groups
- **Batch Creation**: Create multiple ad groups at once
- **Edit Properties**: Modify bids, strategy, and settings
- **Performance Preview**: See keyword and product counts

### Ad Group Features
- **Flexible Naming**: Support for custom suffixes (001, 002, etc.)
- **Bid Management**: Group-level default bids
- **Validation**: Ensure match type consistency
- **Keyword Limits**: Track keyword count per ad group
- **Product Targeting**: Support for multiple products per ad group

---

## Keyword Management

Powerful keyword management system with smart categorization and bulk operations.

### Keyword Bank
The central repository for all keywords across all campaigns and ad groups.

#### Features
- **Mass Import**: Paste or upload keyword lists
- **Intent Classification**: Automatic categorization
  - **Branded**: Brand name keywords
  - **Generic**: Category/product keywords
  - **Competitor**: Competitor brand keywords
  - **Research**: Discovery/broad keywords
- **Stemming**: Automatic keyword normalization
- **Deduplication**: Prevent duplicate keywords
- **Bulk Edit**: Modify intent, match type for multiple keywords
- **Advanced Search**: Filter by text, intent, match type
- **Export**: Download keyword lists

#### Keyword Properties
- Text
- Intent (Branded/Generic/Competitor/Research)
- Match Type (Exact/Phrase/Broad)
- Stemmed form (for deduplication)
- Assignment status

### Keyword Assigner
Assign keywords from the bank to ad groups with smart filtering.

#### Features
- **Campaign Filter**: View ad groups by campaign
- **Intent Filter**: Show only keywords matching ad group intent
- **Match Type Validation**: Ensure compatibility
- **Bulk Assignment**: Assign multiple keywords at once
- **Unassignment**: Remove keywords from ad groups
- **Visual Feedback**: See assigned/unassigned status
- **Keyword Count**: Track assignments per ad group

#### Assignment Rules
- Match type must align (Exact ad group → Exact keywords)
- Intent should match ad group intent (recommended)
- No duplicate assignments within same ad group
- Visual warnings for mismatches

### Keyword Bulk Actions
Efficient tools for managing large keyword sets.

#### Operations
- **Bulk Delete**: Remove multiple keywords
- **Intent Update**: Change categorization in bulk
- **Match Type Change**: Convert Phrase → Broad, etc.
- **Move to Ad Group**: Reassign multiple keywords
- **Export Selected**: Download subset of keywords

#### Features
- **Select All/None**: Quick selection tools
- **Filter & Select**: Select filtered results
- **Confirmation Dialogs**: Prevent accidental deletions
- **Undo Support**: Track changes in activity log
- **Progress Feedback**: Loading states for bulk operations

---

## Asset Management

Manage products and other assets for your PPC campaigns.

### Product Manager
Track and organize products (ASINs) for advertising.

#### Features
- **Add Products**: Import SKU and ASIN pairs
- **Edit Properties**: Update product information
- **Delete Products**: Remove from catalog
- **Product Assignment**: Link products to campaigns/ad groups
- **Search & Filter**: Find products quickly
- **Bulk Import**: Upload product lists

#### Product Properties
- SKU (Stock Keeping Unit)
- ASIN (Amazon Standard Identification Number)
- Assignment status
- Campaigns assigned to
- Ad groups assigned to

### Product Assigner
Assign products to ad groups for Product Targeting campaigns.

#### Features
- **Campaign Filter**: View ad groups by campaign
- **Product Selection**: Choose from product catalog
- **Bulk Assignment**: Assign multiple products
- **Unassignment**: Remove product assignments
- **Visual Tracking**: See product counts per ad group

---

## Goals & Targeting

Define performance targets and optimization strategies.

### Goal Manager
Set and track campaign performance goals.

#### Goal Types
- **ACoS Target** (Advertising Cost of Sale)
  - Target percentage (e.g., 25%)
  - Campaign-level or ad group-level
- **ROAS Target** (Return on Ad Spend)
  - Target ratio (e.g., 4:1)
- **Conversion Target**
  - Target conversion rate
- **Impression Share**
  - Target visibility percentage

#### Features
- **Goal Templates**: Save and reuse common goals
- **Goal Assignment**: Apply to campaigns/ad groups
- **Goal Tracking**: Monitor against targets
- **Performance Indicators**: Visual progress bars
- **Alert Thresholds**: Set warning levels

---

## Bidding & Budget

Advanced bidding and budget management tools.

### Bid Manager
Set and optimize bids across campaigns, ad groups, and keywords.

#### Bid Levels
1. **Campaign-Level**: Default bid for new ad groups
2. **Ad Group-Level**: Default bid for keywords in ad group
3. **Keyword-Level**: Individual keyword bids
4. **Product-Level**: Individual product target bids

#### Bid Strategies
- **Up-Only**: Only increase bids during optimization
- **Down-Only**: Only decrease bids during optimization
- **Up-and-Down**: Full bid flexibility (Amazon default)

#### Features
- **Bulk Bid Updates**: Change multiple bids at once
- **Bid Suggestions**: AI-powered bid recommendations
- **Bid Rules**: Set min/max bid ranges
- **Placement Modifiers**: Top of Search and Product Page adjustments
- **Bid History**: Track bid changes over time

### Budget Management
Allocate and track campaign budgets.

#### Features
- **Campaign Budgets**: Daily budget allocation
- **Total Budget View**: Sum across all campaigns
- **Budget Alerts**: Warnings for low/high budgets
- **Budget Distribution**: Visualize allocation
- **Budget Templates**: Save common budget structures

#### Budget Validation
- Minimum budget: $1.00
- Maximum budget: $999,999
- Budget change tracking
- Total budget calculation

---

## Reports & Analytics

Comprehensive reporting and analysis tools.

### AI Plan Report Generator
Generate professional analysis reports using Google Gemini AI.

#### Report Sections
1. **Executive Summary**
   - 2-3 sentence strategy overview
   - Expected business impact
   - Key performance indicators

2. **Key Strengths**
   - 3-4 competitive advantages
   - Strategic positioning
   - Best-in-class elements

3. **Growth Opportunities**
   - 3-4 improvement areas
   - Clear business value
   - Actionable recommendations

4. **Budget Analysis**
   - Allocation effectiveness
   - Spend distribution
   - Optimization opportunities

5. **Keyword Strategy**
   - Coverage assessment
   - Competitive positioning
   - Gap analysis

6. **Campaign Structure**
   - Organization quality
   - Naming conventions
   - Hierarchy effectiveness

7. **Recommendations**
   - 3-4 prioritized next steps
   - Clear benefits
   - Implementation guidance

#### Features
- **AI-Powered Analysis**: Uses Google Gemini AI
- **Brand-Focused**: Optimized for executive presentations
- **Visual Design**: Professional infographic format
- **HTML Export**: Self-contained shareable files
- **Report History**: Track generated reports
- **One-Click Generation**: 5-10 second analysis

### Search Query Report
Simulate search term performance and discovery.

#### Features
- **Query Simulation**: Test how keywords match search terms
- **Match Type Testing**: See Exact vs. Phrase vs. Broad results
- **Sample Data**: Pre-loaded test queries
- **Performance Metrics**: Estimated impressions, clicks, conversions
- **Export Results**: Download query analysis

### Plan Health Check
Validate plan completeness and quality.

#### Checks
- ✓ All campaigns have ad groups
- ✓ All ad groups have keywords or products
- ✓ Budgets are set and valid
- ✓ No empty campaigns
- ✓ Match type consistency
- ✓ Intent categorization
- ✓ Naming conventions followed

#### Health Score
- **0-60%**: Needs Attention (Red)
- **60-80%**: Good (Yellow)
- **80-100%**: Excellent (Green)

#### Recommendations
- Specific issues identified
- Actionable fix suggestions
- Priority ranking
- Impact assessment

---

## Workspace Management

Organize multiple brands and products in separate workspaces.

### Workspace Manager
Create and switch between workspaces.

#### Features
- **Multiple Workspaces**: Unlimited workspace support
- **Workspace Properties**:
  - Name
  - Brand
  - Country
  - Created date
  - Last modified
  - User
- **Import/Export**: Save workspace as JSON
- **Clone Workspace**: Duplicate entire workspace
- **Delete Workspace**: Remove with confirmation
- **Auto-Save**: Changes saved to localStorage

### Workspace Switching
- **Quick Switch**: Dropdown selector
- **Recent Workspaces**: Access history
- **Auto-Load**: Load last used workspace
- **State Preservation**: Maintain workspace state

### Template System
Save and reuse campaign structures.

#### Template Types
- **Campaign Templates**: Save campaign settings
- **Ad Group Templates**: Reuse ad group structures
- **Keyword Sets**: Save keyword collections
- **Budget Templates**: Reuse budget allocations

#### Features
- **Template Library**: Browse saved templates
- **Apply Template**: One-click application
- **Template Editing**: Modify before applying
- **Template Sharing**: Export/import templates

---

## Advanced Features

### Command Palette
Quick access to all features via keyboard.

#### Access
- **Keyboard**: Press `Ctrl/Cmd+K`
- **Search**: Type to filter commands
- **Navigate**: Use ↑↓ arrow keys
- **Execute**: Press Enter

#### Command Categories
- **Navigation**: Switch views
- **Creation**: New campaigns, ad groups, keywords
- **Actions**: Export, import, save, delete
- **Reports**: Generate reports, health check
- **Workspace**: Switch workspace, manage templates

### Keyboard Shortcuts
Navigate and execute actions without mouse.

#### Navigation Shortcuts
- `Ctrl/Cmd+D`: Dashboard
- `Ctrl/Cmd+C`: Campaigns
- `Ctrl/Cmd+A`: Ad Groups
- `Ctrl/Cmd+K`: Keywords
- `Ctrl/Cmd+P`: Assets (Products)
- `Ctrl/Cmd+G`: Goals
- `Ctrl/Cmd+B`: Bidding
- `Ctrl/Cmd+R`: Reports
- `Ctrl/Cmd+H`: Help & Docs

#### Action Shortcuts
- `Ctrl/Cmd+S`: Freeze/Save Plan
- `Ctrl/Cmd+E`: Export Plan
- `Ctrl/Cmd+F`: Search/Filter
- `Ctrl/Cmd+K`: Command Palette

### Bulk Operations
Efficient tools for managing large datasets.

#### Features
- **Select All/None**: Quick selection
- **Filtered Selection**: Select search results
- **Bulk Actions**: Delete, edit, move, export
- **Confirmation Dialogs**: Prevent accidents
- **Progress Indicators**: Track bulk operations
- **Undo Support**: Reverse bulk changes

### Search & Filter
Find data quickly with advanced filtering.

#### Search Features
- **Global Search**: Search across all fields
- **Live Results**: Instant filtering
- **Result Count**: Shows matches/total
- **Clear Button**: Reset search

#### Filter Features
- **Multi-Field Filters**: Filter by multiple criteria
- **Filter Types**: Text, select, number, date
- **Filter Operators**: Equals, contains, greater than, less than
- **Active Filters**: Visual chips showing applied filters
- **Filter Removal**: Click to remove individual filters
- **Clear All**: Reset all filters

#### Available Filters
- Campaign name, type, match type, theme
- Ad group name, intent, match type
- Keyword text, intent, match type
- Product SKU, ASIN
- Budget range
- Bid range

### Activity Log
Track all changes with full audit trail.

#### Logged Events
- Campaign creation/editing/deletion
- Ad group modifications
- Keyword assignments/changes
- Product assignments
- Budget updates
- Bid changes
- Plan freeze/unfreeze
- Workspace switches
- Report generation
- Import/export operations

#### Log Properties
- **Timestamp**: When action occurred
- **User**: Who performed action
- **Action Type**: What was done
- **Details**: Specific changes
- **Previous Value**: Before state
- **New Value**: After state

#### Features
- **Searchable**: Find specific events
- **Filterable**: Filter by type, user, date
- **Exportable**: Download log as CSV
- **Detailed View**: Expandable entries

### Plan Visualizer
Visual representation of campaign hierarchy.

#### Visualization Types
- **Tree View**: Hierarchical structure
- **Sankey Diagram**: Budget flow visualization (planned)
- **Chord Diagram**: Keyword relationships (planned)

#### Features
- **Interactive**: Click to expand/collapse
- **Color-Coded**: By match type, intent, status
- **Zoom & Pan**: Navigate large plans
- **Export**: Download as image
- **Full Screen**: Maximize view

### Version Control
Track plan changes over time.

#### Features
- **Auto-Snapshots**: Save plan state periodically
- **Manual Snapshots**: Create named versions
- **Version Compare**: See differences between versions
- **Rollback**: Restore previous version
- **Version History**: Browse all snapshots
- **Change Summary**: See what changed

### User Management
Track and manage users working on plans.

#### Features
- **User Login**: Identify who's working
- **User Profiles**: Avatar, name, role
- **Last Visit**: Track activity
- **User Attribution**: Associate changes with users
- **Multi-User**: Support multiple users (planned)

### Data Export/Import
Comprehensive data portability.

#### Export Formats
- **Bulk Upload XLSX**: Amazon Ads-compatible format
  - Campaign sheet
  - Ad Group sheet
  - Keyword sheet
  - Product Targeting sheet
- **Workspace JSON**: Complete workspace data
- **CSV Exports**: Individual data tables
- **HTML Reports**: AI-generated reports

#### Import Formats
- **Workspace JSON**: Restore full workspace
- **Keyword Lists**: Text files with keywords
- **Product Lists**: CSV with SKU/ASIN

---

## Tips & Best Practices

### Campaign Organization
- Use consistent naming conventions
- Separate campaigns by product/SKU
- Use themes to organize strategies
- Set appropriate budgets per campaign

### Keyword Strategy
- Start with branded keywords
- Expand to generic high-volume terms
- Monitor competitor keywords
- Use research campaigns for discovery

### Bid Management
- Start conservative, optimize up
- Use placement modifiers strategically
- Monitor performance regularly
- Test different bid strategies

### Budget Allocation
- Prioritize branded campaigns (lower ACoS)
- Allocate research budgets for discovery
- Balance across match types
- Review and adjust regularly

### Plan Maintenance
- Use Health Check regularly
- Review Activity Log for changes
- Keep keyword bank organized
- Clean up unused keywords/products

---

## Support & Resources

- **In-App Help**: Press `Ctrl/Cmd+H` or click Help & Docs
- **Command Palette**: Press `Ctrl/Cmd+K` for quick access
- **Tooltips**: Hover over ⓘ icons for contextual help
- **Documentation**: Browse `/docs` directory
- **GitHub Issues**: Report bugs or request features

---

*Last Updated: October 2024*
