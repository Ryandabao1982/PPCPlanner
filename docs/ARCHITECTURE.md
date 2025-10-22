# Architecture Documentation

This document describes the technical architecture and design decisions of the GoodWit PPC Planner application.

## Overview

GoodWit PPC Planner is a single-page application (SPA) built with React 19, TypeScript, and Vite. It uses localStorage for data persistence and integrates with Google Gemini AI for intelligent features.

## Technology Stack

### Core Technologies
- **React 19.2.0**: UI framework with latest concurrent features
- **TypeScript 5.8.2**: Type-safe development
- **Vite 6.2.0**: Fast build tool and dev server
- **Vitest 3.2.4**: Unit testing framework

### Key Libraries
- **@google/genai 1.25.0**: Google Gemini AI integration
- **jspdf 3.0.3**: PDF generation for reports
- **jspdf-autotable 5.0.2**: Table formatting in PDFs

## Application Architecture

### Component Architecture

```
App (index.tsx)
├── SidebarNav
├── View Components
│   ├── Dashboard
│   │   ├── PlanSummary
│   │   ├── PlanVisualizer
│   │   └── PlanReportGenerator
│   ├── CampaignCreator
│   ├── CampaignHierarchy (CampaignManager)
│   ├── AdGroupManager
│   ├── KeywordBank
│   ├── ProductManager
│   ├── GoalManager
│   ├── BidManager
│   └── SearchQueryReport
├── WorkspaceManager
├── ActivityLog
└── UserLoginModal
```

### Data Flow

1. **User Actions** → Component handlers
2. **State Updates** → React state management
3. **Data Persistence** → localStorage via custom hooks
4. **Activity Logging** → User tracking system
5. **AI Integration** → Google Gemini API calls

### State Management

#### Local State
- Component-level state using React hooks (`useState`, `useEffect`)
- Custom `useLocalStorage` hook for persistent state

#### Global State
- Workspace data stored in localStorage
- User information in localStorage
- Activity log in localStorage

#### Data Structure

```typescript
Workspace {
  id: string
  name: string
  brand: string
  campaigns: Campaign[]
  adGroups: AdGroup[]
  keywords: Keyword[]
  products: Product[]
  goals: Goal[]
  searchQueries: SearchQuery[]
  activityLog: ActivityLogEntry[]
  reportHistory: Report[]
}

Campaign {
  id: number
  name: string
  brand: string
  country: string
  type: 'SP' | 'SB' | 'SD'
  match: string
  theme: string
  budget: number
  startDate?: string
  endDate?: string
  campaignType?: string
}

AdGroup {
  id: number
  campaignId: number
  name: string
  defaultBid: number
  products: Product[]
  keywords: Keyword[]
  targets?: any[]
}

Keyword {
  id: number
  text: string
  matchType: 'EXACT' | 'PHRASE' | 'BROAD'
  intent?: 'BRANDED' | 'GENERIC' | 'COMPETITOR'
  bid?: number
}
```

## Module Organization

### Components (`/components`)
React components for UI features. Each component is self-contained with its own logic.

**Key Components:**
- `CampaignCreator.tsx`: Campaign creation wizard
- `KeywordBank.tsx`: Keyword management with AI discovery
- `PlanReportGenerator.tsx`: AI-powered report generation
- `WorkspaceManager.tsx`: Workspace CRUD operations

### Utils (`/utils`)
Utility functions and constants.

**Files:**
- `constants.ts`: Application-wide constants and playbooks
- `helpers.ts`: Helper functions for data transformation
- `userLogger.ts`: User tracking utilities
- `exclusions.ts`: Negative keyword patterns

### Hooks (`/hooks`)
Custom React hooks for reusable logic.

**Files:**
- `useLocalStorage.ts`: localStorage integration hook

### Tests (`/tests`)
Unit and integration tests using Vitest.

**Files:**
- `audit.test.ts`: Comprehensive test suite

### Docs (`/docs`)
Documentation files.

## Data Persistence

### localStorage Strategy

The application uses localStorage for client-side persistence:

```javascript
Key Structure:
- "workspaces": JSON array of all workspaces
- "activeWorkspaceId": Currently selected workspace ID
- "currentUser": User information
- "lastVisit": Timestamp of last visit
```

### Benefits
- No backend required
- Fast read/write operations
- Works offline
- Simple implementation

### Limitations
- Limited storage (5-10MB)
- Per-domain storage
- No cross-device sync
- Vulnerable to clearing browser data

## AI Integration

### Google Gemini API

The application uses Google Gemini for:
1. **Keyword Discovery**: Generate keyword suggestions
2. **Plan Analysis**: Analyze campaign structure
3. **Report Generation**: Create professional reports

### API Usage Pattern

```typescript
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const model = genAI.models.get({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
  }
});

const result = await model.generateContent(prompt);
```

### Security Considerations

**Current Implementation** (Development):
- API key stored in client-side environment variables
- Exposed in browser for demonstration purposes

**Recommended for Production**:
- Backend proxy service for API calls
- Server-side API key management
- Rate limiting and usage monitoring

## Build System

### Vite Configuration

```typescript
// vite.config.ts
{
  server: { port: 3000, host: '0.0.0.0' },
  plugins: [react()],
  define: { 'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  build: {
    rollupOptions: { external: [] },
    commonjsOptions: { include: [/jspdf/, /node_modules/] }
  },
  optimizeDeps: { include: ['jspdf', 'jspdf-autotable'] }
}
```

### Build Process

1. **TypeScript Compilation**: TSC checks types
2. **Module Bundling**: Rollup bundles code
3. **Optimization**: Minification and tree-shaking
4. **Output**: Static files in `dist/`

### Build Artifacts

```
dist/
├── index.html              # Entry point
├── assets/
│   ├── index-[hash].js    # Main bundle
│   ├── vendor-[hash].js   # Dependencies
│   └── *.css              # Styles
```

## Testing Strategy

### Unit Tests
- Component logic testing
- Helper function testing
- Mock external dependencies (Gemini API)

### Integration Tests
- Campaign creation workflow
- Keyword bank operations
- Bulk export functionality

### Test Coverage Goals
- Critical business logic: 80%+
- UI components: 60%+
- Utility functions: 90%+

## Performance Considerations

### Optimization Techniques
1. **Code Splitting**: Vite automatic code splitting
2. **Lazy Loading**: Components loaded on demand
3. **Memoization**: React.memo for expensive renders
4. **Debouncing**: Input handlers debounced
5. **Virtual Scrolling**: For large lists (if needed)

### Performance Metrics
- Initial load: < 3s
- Time to interactive: < 1s
- Build size: ~1.5MB (with chunking)

## Security Considerations

### Current Security Measures
- TypeScript for type safety
- Input validation on forms
- XSS protection via React
- localStorage for sensitive data isolation

### Known Limitations
- Client-side API key exposure
- No authentication system (single-user)
- No encryption for stored data

### Production Recommendations
1. Implement backend API proxy
2. Add user authentication
3. Encrypt sensitive data
4. Rate limiting on AI calls
5. Content Security Policy (CSP)

## Deployment Architecture

### Recommended Deployment

```
                    ┌─────────────┐
                    │   CDN/Host  │
                    │  (Vercel)   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Static App │
                    │  (React SPA)│
                    └──────┬──────┘
                           │
                    ┌──────▼──────────┐
                    │ Google Gemini   │
                    │     API         │
                    └─────────────────┘
```

### Deployment Platforms
- **Vercel**: Optimal for Vite projects (recommended)
- **Netlify**: Easy static hosting
- **AWS S3 + CloudFront**: Scalable solution
- **GitHub Pages**: Free for public repos

## Future Architecture Considerations

### Backend Service
For production use, consider adding:
- REST API for data persistence
- API key management
- User authentication
- Database (PostgreSQL/MongoDB)
- Caching layer (Redis)

### Real-time Features
- WebSocket for collaboration
- Real-time sync across devices
- Shared workspaces

### Advanced Features
- Campaign performance data import
- Integration with Amazon Ads API
- Scheduled report generation
- Email notifications

## Browser Support

### Supported Browsers
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

### Required Features
- ES6+ JavaScript
- localStorage API
- Fetch API
- CSS Grid/Flexbox

## Development Workflow

```
Developer
    │
    ├─ Code Changes
    │     │
    │     ├─ TypeScript compilation
    │     ├─ Hot Module Reload (Vite)
    │     └─ Browser update
    │
    ├─ Testing
    │     └─ Vitest (unit tests)
    │
    ├─ Building
    │     ├─ npm run build
    │     └─ dist/ output
    │
    └─ Deployment
          └─ Push to hosting platform
```

## Troubleshooting

### Common Issues

**Build Errors**
- Clear node_modules and reinstall
- Check Node.js version (>=18.0.0)

**API Issues**
- Verify GEMINI_API_KEY in .env.local
- Check API quota limits

**Performance Issues**
- Clear localStorage
- Disable browser extensions
- Check network tab for slow requests

## References

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Google Gemini API Docs](https://ai.google.dev/docs)

---

**Last Updated**: October 2025
