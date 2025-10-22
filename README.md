<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# GoodWit PPC Planner

### Professional Amazon PPC Campaign Planning Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF.svg)](https://vitejs.dev/)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**GoodWit PPC Planner** is a comprehensive, browser-based tool for planning and managing Amazon PPC (Pay-Per-Click) advertising campaigns. Built with modern web technologies, it provides a professional interface for creating, organizing, and optimizing Sponsored Product campaigns with support for multiple workspaces, AI-powered reporting, and advanced campaign management features.

### What is PPC Planning?

Pay-Per-Click (PPC) advertising on Amazon requires careful planning of:
- **Campaign Structure**: Organizing campaigns by product, match type, and strategy
- **Keyword Strategy**: Selecting and categorizing keywords by intent (Branded, Generic, Competitor)
- **Budget Allocation**: Distributing budgets across campaigns and ad groups
- **Bid Management**: Setting competitive bids for keywords and products
- **Performance Goals**: Defining target ACoS, ROAS, and conversion metrics

This tool streamlines the entire planning process from initial campaign creation to export-ready bulk upload files.

---

## ✨ Key Features

### 🏗️ Campaign Management
- **Multi-Workspace Support**: Manage multiple brands or products in separate workspaces
- **Campaign Creator**: Build campaigns with guided workflows and validation
- **Ad Group Manager**: Organize keywords and products into targeted ad groups
- **Template System**: Save and reuse campaign structures
- **Version Control**: Track plan changes with full history and rollback

### 🔑 Keyword Management
- **Keyword Bank**: Centralized repository for all keywords with intent classification
- **Smart Assignment**: Assign keywords to ad groups with match type validation
- **Bulk Operations**: Edit, move, or delete keywords in bulk
- **Intent Categorization**: Automatic classification (Branded, Generic, Competitor, Research)
- **Stemming & Deduplication**: Intelligent keyword processing

### 📦 Product & Asset Management
- **Product Manager**: Track products with SKU and ASIN information
- **Product Assignment**: Link products to campaigns and ad groups
- **Asset Organization**: Manage product catalog efficiently

### 🎯 Goals & Bidding
- **Goal Setting**: Define ACoS, ROAS, and conversion targets
- **Bid Manager**: Set and optimize bids at keyword and product level
- **Placement Modifiers**: Configure Top of Search and Product Page placements
- **Budget Tracking**: Monitor budget allocation across campaigns

### 📊 Reporting & Analytics
- **AI-Powered Reports**: Generate executive summaries using Google Gemini AI
- **Search Query Analysis**: Simulate search term performance
- **Plan Health Check**: Validate campaign structure and completeness
- **Activity Log**: Track all changes with user attribution
- **Plan Visualizer**: Visual representation of campaign hierarchy

### 🛠️ Advanced UX Features
- **Command Palette** (Ctrl/Cmd+K): Quick access to all features
- **Keyboard Shortcuts**: Navigate and execute actions without mouse
- **Advanced Filtering**: Multi-field search and filter capabilities
- **Bulk Toolbars**: Select and modify multiple items simultaneously
- **Tooltips & Help**: Contextual guidance throughout the interface
- **Loading States**: Professional feedback for all operations

### 📤 Export & Integration
- **Bulk Upload Export**: Generate XLSX files for Amazon Ads bulk upload
- **Workspace Import/Export**: Save and share complete plan data
- **HTML Reports**: Export AI-generated reports for presentations
- **Data Persistence**: Auto-save with localStorage

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ryandabao1982/PPCPlanner.git
   cd PPCPlanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional - for AI features)
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Google Gemini API key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   Navigate to http://localhost:5173
   ```

### Building for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

The production build will be in the `dist/` directory.

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[FEATURES.md](docs/FEATURES.md)** - Detailed feature breakdown and usage guide
- **[INSTALLATION.md](docs/INSTALLATION.md)** - Complete installation and setup instructions
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Technical architecture and design decisions
- **[API_GUIDE.md](docs/API_GUIDE.md)** - API integration and configuration guide
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and release notes
- **[BUILD_LOG.md](BUILD_LOG.md)** - Build history and deployment logs
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

### Quick Reference Guides

- **[AI Report Feature](docs/AI_REPORT_FEATURE.md)** - Using the AI-powered report generator
- **[UX/UI Quick Reference](docs/QUICK_REFERENCE.md)** - Component and utility usage
- **[UX/UI Review](docs/UX_UI_REVIEW.md)** - Comprehensive UX analysis
- **[Implementation Plan](docs/IMPLEMENTATION_PLAN.md)** - Development roadmap
- **[Improvements Summary](docs/IMPROVEMENTS_SUMMARY.md)** - Recent enhancements

### In-App Help

Access the built-in documentation viewer by:
- Clicking **"Help & Docs"** in the navigation sidebar
- Pressing **Ctrl/Cmd+H**
- Opening the Command Palette (Ctrl/Cmd+K) and searching for "help"

---

## 🔧 Technology Stack

### Frontend
- **React 19.2.0** - UI framework
- **TypeScript 5.8.2** - Type safety and developer experience
- **Vite 6.2.0** - Build tool and dev server

### AI & Reporting
- **Google Gemini AI** - AI-powered plan analysis and reporting
- **jsPDF 3.0.3** - PDF generation (planned)
- **jsPDF-AutoTable 5.0.2** - Table formatting for PDFs

### Testing
- **Vitest 3.2.4** - Unit and integration testing

### Development Tools
- **@vitejs/plugin-react** - React support for Vite
- **@types/node** - Node.js type definitions

---

## 📁 Project Structure

```
PPCPlanner/
├── components/           # React components
│   ├── ActivityLog.tsx
│   ├── AdGroupManager.tsx
│   ├── BidManager.tsx
│   ├── BulkActionManager.tsx
│   ├── CampaignCreator.tsx
│   ├── CampaignManager.tsx
│   ├── CommandPalette.tsx
│   ├── Documentation.tsx
│   ├── GoalManager.tsx
│   ├── KeywordAssigner.tsx
│   ├── KeywordBank.tsx
│   ├── PlanApprover.tsx
│   ├── PlanHealthCheck.tsx
│   ├── PlanReportGenerator.tsx
│   ├── PlanSummary.tsx
│   ├── PlanVisualizer.tsx
│   ├── ProductAssigner.tsx
│   ├── ProductManager.tsx
│   ├── SearchAndFilter.tsx
│   ├── SearchQueryReport.tsx
│   ├── TemplateManager.tsx
│   ├── Tooltip.tsx
│   ├── UserLoginModal.tsx
│   ├── VersionControl.tsx
│   └── WorkspaceManager.tsx
├── hooks/                # Custom React hooks
│   ├── useKeyboardShortcuts.ts
│   ├── useLocalStorage.ts
│   └── useTableFilter.ts
├── utils/                # Utility functions
│   ├── constants.ts
│   ├── exclusions.ts
│   ├── helpers.ts
│   ├── userLogger.ts
│   └── validation.ts
├── docs/                 # Documentation
│   ├── AI_REPORT_FEATURE.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── IMPROVEMENTS_SUMMARY.md
│   ├── PHASE_3_4_IMPLEMENTATION.md
│   ├── QUICK_REFERENCE.md
│   └── UX_UI_REVIEW.md
├── tests/                # Test files
│   └── audit.test.ts
├── database.ts           # Sample data and initial state
├── index.tsx             # Application entry point
├── index.html            # HTML template
├── styles.ts             # Global styles and CSS-in-JS
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with React and TypeScript
- AI features powered by Google Gemini
- Icons from Font Awesome
- UI inspired by modern SaaS applications

---

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on [GitHub Issues](https://github.com/Ryandabao1982/PPCPlanner/issues)
- Check existing documentation in the `/docs` directory
- Use the in-app Help & Docs section

---

<div align="center">

**Made with ❤️ for PPC Professionals**

[Report Bug](https://github.com/Ryandabao1982/PPCPlanner/issues) · [Request Feature](https://github.com/Ryandabao1982/PPCPlanner/issues) · [Documentation](docs/)

</div>
