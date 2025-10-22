<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# GoodWit PPC Planner

**AI-Powered Campaign Planning for Amazon Advertising**

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/Ryandabao1982/PPCPlanner)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

[Features](#features) • [Getting Started](#getting-started) • [Usage](#usage) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## 🎯 Overview

**GoodWit PPC Planner** is a comprehensive, AI-powered web application designed to streamline the planning, management, and optimization of Amazon Advertising campaigns. Built with React 19 and TypeScript, it provides advertisers with intelligent tools to create and manage Sponsored Products (SP), Sponsored Brands (SB), and Sponsored Display (SD) campaigns efficiently.

The application leverages **Google Gemini AI** to provide intelligent keyword discovery, campaign analysis, and professional report generation, making it easier for advertisers to optimize their PPC strategies and communicate results to stakeholders.

**View in AI Studio**: [https://ai.studio/apps/drive/1TuB3tHg6AxeRD0GFIXhBvKd_7PTegZlQ](https://ai.studio/apps/drive/1TuB3tHg6AxeRD0GFIXhBvKd_7PTegZlQ)

---

## ✨ Features

### 🚀 Campaign Management
- **Multi-Format Support**: Create and manage SP, SB, and SD campaigns
- **Campaign Playbook**: Pre-configured templates for common campaign types
- **Budget Allocation**: Track and optimize budget distribution across campaigns
- **Campaign Hierarchy**: Organize campaigns, ad groups, keywords, and products

### 🔑 Intelligent Keyword Management
- **AI-Powered Discovery**: Leverage Google Gemini for intelligent keyword suggestions
- **Keyword Bank**: Centralized repository for all keywords
- **Intent Classification**: Categorize keywords by search intent (Branded, Generic, Competitor)
- **Match Type Support**: Full support for Exact, Phrase, and Broad match types
- **Negative Keywords**: Manage exclusions to improve targeting

### 🤖 AI Plan Report Generator
Generate professional, AI-powered analysis reports of your PPC plans:
- **AI-Powered Insights**: Gemini AI analyzes campaign structure, budget allocation, and keyword strategy
- **Executive Summaries**: Clear overviews optimized for brand executives
- **Strategic Analysis**: Key strengths, opportunities, and actionable recommendations
- **Budget & Keyword Analysis**: Assessment of resource allocation and competitive positioning
- **Beautiful Reports**: Download professional HTML reports for client presentations
- **Business Impact Focus**: Insights focused on ROI and business value

### 📊 Analytics & Reporting
- **Plan Dashboard**: Real-time overview of campaign performance
- **Plan Visualizer**: Interactive charts and graphs
- **Search Query Analysis**: Analyze search term performance
- **Plan Health Check**: Automated validation of campaign setup
- **Activity Log**: Complete audit trail of all actions

### 🛠️ Productivity Tools
- **Bulk Actions**: Efficient management of multiple items
- **Bulk Export**: Generate Excel files for Amazon Ads platform import
- **Import/Export**: Save and share entire workspaces
- **Multi-Workspace**: Manage multiple plans simultaneously
- **Bid Manager**: Optimize CPC bids across campaigns

### 👤 User Management
- **User Tracking**: Log who made changes and when
- **Multiple Users**: Support for team collaboration
- **Activity Logging**: Complete history of user actions

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Google Gemini API Key** (free tier available at [Google AI Studio](https://ai.google.dev/))

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

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   To get a Gemini API key:
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Sign in with your Google account
   - Click "Get API Key"
   - Copy your API key to the `.env.local` file

### Configuration

The application uses Vite for build configuration. Key settings are in `vite.config.ts`:

- **Server Port**: Default is 3000
- **API Key**: Loaded from environment variables
- **Build Settings**: Optimized for production with code splitting

---

## 💻 Usage

### Running Locally

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Basic Workflow

1. **Create a Workspace**: Start by creating a new workspace for your PPC plan
2. **Add Campaigns**: Use the Campaign Creator to build campaigns from templates
3. **Add Keywords**: Build your keyword bank with AI-powered suggestions
4. **Create Ad Groups**: Organize your campaigns with targeted ad groups
5. **Assign Keywords**: Assign keywords to ad groups with appropriate match types
6. **Add Products**: Link products to your ad groups
7. **Set Bids**: Configure default bids and placement multipliers
8. **Review Plan**: Use the Dashboard to review your complete plan
9. **Generate Report**: Create AI-powered reports for stakeholders
10. **Export**: Download bulk upload files for Amazon Ads platform

---

## 📚 Documentation

### Additional Documentation

- **[AI Report Feature Guide](docs/AI_REPORT_FEATURE.md)**: Comprehensive guide to the AI Plan Report Generator
- **[CHANGELOG.md](CHANGELOG.md)**: Version history and change log

### Key Components

- **Campaign Creator**: Build campaigns using playbook templates
- **Campaign Manager**: View and edit campaign hierarchy
- **Keyword Bank**: Centralized keyword management with AI suggestions
- **Ad Group Manager**: Create and configure ad groups
- **Product Manager**: Manage product assets
- **Bid Manager**: Optimize bidding strategies
- **Plan Report Generator**: AI-powered report generation
- **Workspace Manager**: Import/export and manage workspaces

### Keyboard Shortcuts

- `Ctrl/Cmd + S`: Quick save (in supported views)
- `Esc`: Close modals and dialogs

---

## 🗂️ Project Structure

```
PPCPlanner/
├── components/          # React components
│   ├── ActivityLog.tsx
│   ├── AdGroupManager.tsx
│   ├── BidManager.tsx
│   ├── CampaignCreator.tsx
│   ├── KeywordBank.tsx
│   ├── PlanReportGenerator.tsx
│   └── ...
├── utils/              # Utility functions
│   ├── constants.ts    # Application constants
│   ├── helpers.ts      # Helper functions
│   └── userLogger.ts   # User tracking utilities
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── tests/              # Test files
│   └── audit.test.ts
├── docs/               # Documentation
│   └── AI_REPORT_FEATURE.md
├── database.ts         # Initial database schema
├── index.tsx           # Application entry point
├── styles.ts           # Styled components
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and scripts
├── CHANGELOG.md        # Version history
└── README.md           # This file
```

---

## 🔧 Development

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Formatting**: Consistent code style throughout

### Adding New Features

1. Create component files in `components/` directory
2. Add utility functions to `utils/helpers.ts`
3. Update constants in `utils/constants.ts`
4. Add tests in `tests/` directory
5. Update documentation in `docs/`
6. Update CHANGELOG.md with your changes

### Development Best Practices

- Use TypeScript for type safety
- Write tests for new features
- Follow existing component patterns
- Keep components focused and modular
- Document complex logic with comments
- Update CHANGELOG.md for all changes

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The project uses Vitest for testing with the following coverage:
- Campaign creation and naming logic
- Ad group management
- Keyword processing
- Bulk export functionality
- AI API integrations (mocked)

---

## 📦 Build & Deployment

### Production Build

```bash
npm run build
```

### Build Output

The build process creates optimized bundles in the `dist/` directory:
- Minified JavaScript
- Optimized CSS
- Static assets
- HTML entry point

### Deployment Options

The application can be deployed to:
- **Vercel**: Optimal for Vite projects
- **Netlify**: Simple static hosting
- **AWS S3 + CloudFront**: Scalable static hosting
- **GitHub Pages**: Free hosting for public repos

### Environment Variables for Production

Ensure the following environment variables are set in your deployment platform:
- `GEMINI_API_KEY`: Your Google Gemini API key

**Security Note**: For production use, consider implementing a backend service to secure API credentials instead of exposing them in client-side code.

---

## 📝 Changelog

All notable changes are documented in [CHANGELOG.md](CHANGELOG.md).

For information about recent updates, see the [Unreleased] section in the changelog.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Update CHANGELOG.md** with your changes under the `[Unreleased]` section
5. **Write or update tests** as needed
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Keep changes focused and atomic
- Always update CHANGELOG.md

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/Ryandabao1982/PPCPlanner/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Ryandabao1982/PPCPlanner/discussions)
- **Documentation**: Check the [docs/](docs/) directory

### Troubleshooting

**Build Errors**
- Ensure Node.js >= 18.0.0 is installed
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

**API Key Issues**
- Verify your Gemini API key in `.env.local`
- Ensure the key is valid at [Google AI Studio](https://ai.google.dev/)
- Check browser console for specific error messages

**Import/Export Problems**
- Check browser download settings
- Ensure pop-ups are not blocked
- Verify JSON format for imports

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Build tool: [Vite](https://vitejs.dev/)
- Testing: [Vitest](https://vitest.dev/)

---

<div align="center">

**Made with ❤️ for PPC Advertisers**

[⬆ Back to Top](#goodwit-ppc-planner)

</div>
