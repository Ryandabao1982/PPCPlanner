# Changelog

All notable changes to the GoodWit PPC Planner project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive CHANGELOG.md for tracking project changes
- Improved build configuration with proper jsPDF support
- Enhanced README.md with complete documentation

### Fixed
- Build process now properly handles jsPDF dependencies
- Vite configuration optimized for production builds

## [0.1.0] - 2025-10-23

### Added
- AI Plan Report Generator feature with Google Gemini integration
- Professional report generation for PPC campaigns
- Executive summary and strategic insights
- Budget and keyword analysis
- HTML export functionality for reports
- Comprehensive documentation in docs/AI_REPORT_FEATURE.md

### Fixed
- Google Generative Model error resolution (#7)

## [0.0.0] - Initial Release

### Added
- Core PPC Planner application
- Campaign Creator with playbook support
- Ad Group Manager
- Keyword Bank with AI-powered discovery
- Product Manager for asset management
- Goal Manager for performance tracking
- Bulk Action Manager for efficient operations
- Plan Health Check and validation
- Workspace Management with localStorage persistence
- Bid Manager for CPC optimization
- Search Query Report analysis
- Plan Visualizer with interactive charts
- Activity Log for audit trail
- User Login and authentication system
- Documentation viewer
- React 19.2.0 with TypeScript
- Vite build system
- Vitest for testing

### Features
- **Campaign Management**
  - Support for Sponsored Products (SP), Sponsored Brands (SB), and Sponsored Display (SD)
  - Campaign playbook templates
  - Budget allocation and tracking
  
- **Keyword Management**
  - Keyword bank with intent classification
  - Match type support (Exact, Phrase, Broad)
  - AI-powered keyword suggestions via Google Gemini
  - Negative keyword management
  
- **Ad Group Organization**
  - Hierarchical campaign structure
  - Product and keyword assignment
  - Default bid management
  
- **Reporting & Analytics**
  - Plan summary dashboard
  - Performance visualizations
  - Search query analysis
  - Bulk export to Excel/XLSX format
  
- **Workspace Features**
  - Multiple workspace support
  - Import/Export functionality
  - Activity logging
  - User tracking
  
- **Testing**
  - Comprehensive unit tests with Vitest
  - Mocked API integrations
  - Component testing coverage

---

## How to Use This Changelog

### For Contributors
When making changes to the project:

1. Add your changes to the `[Unreleased]` section at the top
2. Categorize changes under appropriate headers:
   - `Added` for new features
   - `Changed` for changes in existing functionality
   - `Deprecated` for soon-to-be removed features
   - `Removed` for now removed features
   - `Fixed` for any bug fixes
   - `Security` for vulnerability fixes

### For Releases
When creating a new release:

1. Create a new version section below `[Unreleased]`
2. Move items from `[Unreleased]` to the new version section
3. Add the release date in YYYY-MM-DD format
4. Update the version numbers according to semantic versioning

### Version Number Guidelines
- **MAJOR** (X.0.0): Incompatible API changes
- **MINOR** (0.X.0): New functionality in a backward-compatible manner
- **PATCH** (0.0.X): Backward-compatible bug fixes

---

[Unreleased]: https://github.com/Ryandabao1982/PPCPlanner/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Ryandabao1982/PPCPlanner/releases/tag/v0.1.0
[0.0.0]: https://github.com/Ryandabao1982/PPCPlanner/releases/tag/v0.0.0
