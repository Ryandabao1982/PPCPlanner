# Architecture Documentation

Technical architecture and design decisions for the GoodWit PPC Planner.

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture Patterns](#architecture-patterns)
- [Component Structure](#component-structure)
- [Data Flow](#data-flow)
- [State Management](#state-management)
- [Styling Architecture](#styling-architecture)
- [Build System](#build-system)
- [Performance Considerations](#performance-considerations)
- [Security](#security)

---

## Overview

GoodWit PPC Planner is a single-page application (SPA) built with React and TypeScript, focusing on client-side data management and offline-first capabilities. The architecture emphasizes modularity, type safety, and developer experience.

### Design Principles

1. **Modularity**: Components are self-contained and reusable
2. **Type Safety**: TypeScript strict mode for compile-time error detection
3. **Performance**: Optimized re-renders with React hooks and memoization
4. **Offline-First**: localStorage persistence for data reliability
5. **Developer Experience**: Fast feedback loops with HMR and strong typing
6. **Accessibility**: WCAG 2.1 compliance with keyboard navigation and ARIA

---

## Technology Stack

### Core Technologies

#### React 19.2.0
- **Purpose**: UI framework
- **Why React**: 
  - Component-based architecture
  - Virtual DOM for performance
  - Large ecosystem and community
  - Excellent TypeScript support
- **Key Features Used**:
  - Functional components with hooks
  - Context API (minimal usage)
  - Memo and callback optimization
  - Concurrent features (future-ready)

#### TypeScript 5.8.2
- **Purpose**: Type safety and developer tooling
- **Why TypeScript**:
  - Catch errors at compile time
  - Better IDE support (autocomplete, refactoring)
  - Self-documenting code with types
  - Easier maintenance and refactoring
- **Configuration**: Strict mode enabled
  - `strict: true`
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`

#### Vite 6.2.0
- **Purpose**: Build tool and dev server
- **Why Vite**:
  - Extremely fast HMR (<100ms)
  - Native ES modules in development
  - Optimized production builds
  - Simple configuration
  - Great TypeScript support
- **Features**:
  - Lightning-fast cold start
  - Instant module reloads
  - Optimized dependency pre-bundling
  - Built-in CSS processing

### Additional Libraries

#### Google Gemini AI 1.25.0
- **Purpose**: AI-powered plan analysis and report generation
- **Integration**: Client-side API calls (demo) or server-side (production)
- **Features**: Natural language analysis of PPC plans

#### jsPDF 3.0.3 + jsPDF-AutoTable 5.0.2
- **Purpose**: PDF generation (planned feature)
- **Use Case**: Export reports and bulk upload templates

#### Vitest 3.2.4
- **Purpose**: Testing framework
- **Why Vitest**: 
  - Native Vite integration
  - Jest-compatible API
  - Fast parallel execution
  - TypeScript support out of the box

---

## Architecture Patterns

### Component Architecture

```
Application Layer
├── Entry Point (index.tsx)
├── Main App Component
└── Navigation Layer (SidebarNav)

Feature Layer
├── Dashboard Views (PlanSummary, PlanHealthCheck, etc.)
├── Management Views (Campaigns, AdGroups, Keywords, etc.)
├── Utility Views (Reports, Workspace, Help)
└── Modal/Dialog Components

Component Layer
├── Business Components (CampaignCreator, KeywordBank, etc.)
├── UI Components (Tooltip, SearchAndFilter, etc.)
├── Layout Components (Sidebar, Header, etc.)
└── Data Components (Charts, Visualizer, etc.)

Infrastructure Layer
├── Hooks (useLocalStorage, useKeyboardShortcuts, etc.)
├── Utils (helpers, validation, constants, etc.)
├── Styles (Global CSS-in-JS)
└── Database (Sample data, initial state)
```

### Data Architecture

```
Client Storage Layer
├── localStorage
│   ├── Workspace Data
│   ├── User Preferences
│   └── Activity Log
└── Session Storage (future)

Application State Layer
├── React State (useState)
├── Derived State (useMemo)
└── Local State (component-specific)

Data Models
├── Campaign
├── AdGroup
├── Keyword
├── Product
├── Goal
└── Workspace
```

### File Structure

```
/components           # React components
  /[ComponentName].tsx  # Component file
/hooks                # Custom React hooks
  /[hookName].ts        # Hook file
/utils                # Utility functions
  /helpers.ts           # General helpers
  /validation.ts        # Validation functions
  /constants.ts         # App constants
  /userLogger.ts        # User tracking
  /exclusions.ts        # Keyword exclusions
/docs                 # Documentation
/tests                # Test files
/dist                 # Build output (generated)
/node_modules         # Dependencies (generated)
database.ts           # Initial data and samples
index.tsx             # Application entry point
index.html            # HTML template
styles.ts             # Global styles
vite.config.ts        # Vite configuration
tsconfig.json         # TypeScript configuration
package.json          # Dependencies and scripts
```

---

## Component Structure

### Component Types

#### 1. Feature Components
**Purpose**: Implement core business logic and features

**Example**: `CampaignCreator.tsx`
```typescript
export const CampaignCreator = ({ 
  onCreateCampaign,
  existingCampaigns,
  products 
}) => {
  // State management
  const [formData, setFormData] = useState<CampaignFormData>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  // Business logic
  const handleSubmit = () => {
    const validationResult = validateCampaign(formData);
    if (validationResult.isValid) {
      onCreateCampaign(formData);
    }
  };
  
  // Render
  return (/* JSX */);
};
```

**Characteristics**:
- Manage own state
- Handle business logic
- Interact with parent via props/callbacks
- May use multiple utility components

#### 2. UI Components
**Purpose**: Reusable interface elements

**Example**: `Tooltip.tsx`
```typescript
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
}) => {
  // Simple state
  const [isVisible, setIsVisible] = useState(false);
  
  // Render
  return (/* JSX */);
};
```

**Characteristics**:
- No business logic
- Highly reusable
- Props-driven
- Minimal state (UI state only)

#### 3. Container Components
**Purpose**: Orchestrate multiple components

**Example**: `App` component in `index.tsx`
```typescript
const App = () => {
  // Global state
  const [activeView, setActiveView] = useState<View>('DASHBOARD');
  const [database, setDatabase] = useLocalStorage('ppc-data', initialDatabase);
  
  // Computed state
  const currentWorkspace = useMemo(() => 
    database.workspaces.find(w => w.id === database.currentWorkspaceId),
    [database]
  );
  
  // Render appropriate view
  return (
    <div className="app-container">
      <SidebarNav activeView={activeView} onSelectView={setActiveView} />
      <main>
        {renderView(activeView)}
      </main>
    </div>
  );
};
```

**Characteristics**:
- Manage global/shared state
- Coordinate multiple features
- Handle routing/navigation
- Pass data down to children

### Component Communication

#### Props Flow (Parent → Child)
```typescript
// Parent
<CampaignManager 
  campaigns={campaigns}
  onUpdateCampaign={handleUpdate}
/>

// Child
interface CampaignManagerProps {
  campaigns: Campaign[];
  onUpdateCampaign: (id: number, data: Partial<Campaign>) => void;
}
```

#### Callback Flow (Child → Parent)
```typescript
// Child
const handleSave = () => {
  onUpdateCampaign(campaignId, changes);
};

// Parent
const handleUpdate = (id: number, data: Partial<Campaign>) => {
  setDatabase(prev => ({
    ...prev,
    campaigns: prev.campaigns.map(c => 
      c.id === id ? { ...c, ...data } : c
    )
  }));
};
```

#### Event Flow (Sibling ↔ Sibling via Parent)
```typescript
// Parent manages state
const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

// Child A: Sets selection
<CampaignList onSelect={setSelectedCampaign} />

// Child B: Receives selection
<CampaignDetails campaign={selectedCampaign} />
```

---

## Data Flow

### Data Flow Diagram

```
User Action
    ↓
Event Handler
    ↓
State Update (useState/setDatabase)
    ↓
React Re-render
    ↓
useMemo/useCallback (optimization)
    ↓
Component Re-render
    ↓
localStorage Sync (useLocalStorage)
    ↓
Activity Log Update
    ↓
UI Update
```

### Data Persistence Flow

```
Component State Change
    ↓
useLocalStorage Hook
    ↓
Debounced Write (500ms)
    ↓
localStorage.setItem()
    ↓
JSON Serialization
    ↓
Browser Storage
```

### Data Loading Flow

```
App Initialization
    ↓
useLocalStorage Hook
    ↓
localStorage.getItem()
    ↓
JSON Deserialization
    ↓
Validation (optional)
    ↓
State Initialization
    ↓
Component Render
```

---

## State Management

### State Strategy

The application uses **local state** with **localStorage persistence**, avoiding complex state management libraries for simplicity and performance.

#### Why Local State?

1. **Simplicity**: No additional libraries or complexity
2. **Performance**: Direct state updates, no middleware overhead
3. **Type Safety**: Full TypeScript support
4. **Debugging**: Simple, predictable state updates
5. **Learning Curve**: Standard React APIs

### State Organization

#### Global State (App Level)
Located in `index.tsx`:
```typescript
const [database, setDatabase] = useLocalStorage('ppc-planner-data', initialDatabase);
const [activeView, setActiveView] = useState<View>('DASHBOARD');
const [user, setUser] = useState<User | null>(getCurrentUser());
```

#### Feature State (Component Level)
Located in individual components:
```typescript
// CampaignCreator.tsx
const [formData, setFormData] = useState<CampaignFormData>({});
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);
```

#### Derived State (Computed)
Using useMemo for expensive computations:
```typescript
const filteredCampaigns = useMemo(() => 
  campaigns.filter(c => c.brand === selectedBrand),
  [campaigns, selectedBrand]
);

const totalBudget = useMemo(() =>
  campaigns.reduce((sum, c) => sum + c.budget, 0),
  [campaigns]
);
```

### State Updates

#### Immutable Updates
```typescript
// Update campaign
setDatabase(prev => ({
  ...prev,
  campaigns: prev.campaigns.map(c =>
    c.id === campaignId
      ? { ...c, budget: newBudget }
      : c
  )
}));

// Add campaign
setDatabase(prev => ({
  ...prev,
  campaigns: [...prev.campaigns, newCampaign]
}));

// Delete campaign
setDatabase(prev => ({
  ...prev,
  campaigns: prev.campaigns.filter(c => c.id !== campaignId)
}));
```

#### Batch Updates
```typescript
// Multiple updates in one setState call
setDatabase(prev => {
  const updatedCampaigns = prev.campaigns.map(/* ... */);
  const updatedAdGroups = prev.adGroups.map(/* ... */);
  
  return {
    ...prev,
    campaigns: updatedCampaigns,
    adGroups: updatedAdGroups,
    lastModified: Date.now()
  };
});
```

---

## Styling Architecture

### CSS-in-JS Approach

All styles are defined in `styles.ts` as a string literal:

```typescript
export const styles = `
  /* Global styles */
  * { box-sizing: border-box; }
  
  /* Component styles */
  .campaign-card { ... }
  
  /* Utility classes */
  .hidden { display: none; }
`;
```

**Why CSS-in-JS**:
- **Colocation**: Styles with logic
- **No Build Step**: Direct string injection
- **Type Safety**: Can export constants
- **Scoping**: Manual but controlled

### Style Organization

```typescript
// styles.ts structure
export const styles = `
  /* 1. CSS Reset & Base */
  /* 2. Typography */
  /* 3. Layout */
  /* 4. Navigation */
  /* 5. Components */
  /* 6. Utilities */
  /* 7. Animations */
  /* 8. Responsive */
`;
```

### Design System

#### Colors
```typescript
// Primary colors
--color-primary: #F8B500 (Gold)
--color-primary-dark: #D69A00
--color-primary-light: #FFD966

// Surface colors
--color-surface: #112958 (Navy)
--color-surface-light: #1A3A6B
--color-surface-dark: #0A1D3F

// Semantic colors
--color-error: #E57373 (Red)
--color-success: #81C784 (Green)
--color-warning: #FFB74D (Orange)
--color-info: #64B5F6 (Blue)
```

#### Typography
```typescript
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-size-xs: 0.75rem
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
--font-size-2xl: 1.5rem
```

#### Spacing
```typescript
--spacing-xs: 0.25rem (4px)
--spacing-sm: 0.5rem (8px)
--spacing-md: 1rem (16px)
--spacing-lg: 1.5rem (24px)
--spacing-xl: 2rem (32px)
```

---

## Build System

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Future: split vendor chunks
        }
      }
    }
  }
});
```

### Build Process

#### Development Build
1. Vite starts dev server
2. Serves ES modules natively
3. Hot Module Replacement on changes
4. TypeScript compilation in IDE

#### Production Build
1. `npm run build` executes `vite build`
2. TypeScript compilation
3. Tree shaking (remove unused code)
4. Code minification (Terser)
5. Asset optimization
6. Generate source maps
7. Output to `dist/`

### Build Optimization

**Current**:
- Tree shaking
- Minification
- Gzip compression
- Asset hashing

**Planned**:
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

---

## Performance Considerations

### Optimization Techniques

#### 1. Memoization
```typescript
// Expensive computation
const filteredResults = useMemo(() => 
  data.filter(item => matchesFilters(item, filters)),
  [data, filters]
);

// Callback stability
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

#### 2. Lazy Loading (Planned)
```typescript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

#### 3. Debouncing
```typescript
// In useLocalStorage hook
const debouncedSave = useMemo(
  () => debounce((value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, 500),
  [key]
);
```

#### 4. Virtual Scrolling (Planned)
For large lists (1000+ items)

### Performance Monitoring

**Recommended Tools**:
- React DevTools Profiler
- Chrome DevTools Performance
- Lighthouse
- Web Vitals

**Key Metrics**:
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3s
- Cumulative Layout Shift (CLS): < 0.1

---

## Security

### Client-Side Security

#### 1. XSS Prevention
- React auto-escapes content
- DOMPurify for HTML sanitization
- Avoid dangerouslySetInnerHTML

#### 2. API Key Protection
⚠️ **Current**: Client-side (demo only)
✅ **Production**: Server-side proxy

```typescript
// Current (demo)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Production (recommended)
const response = await fetch('/api/generate-report', {
  method: 'POST',
  body: JSON.stringify(planData)
});
```

#### 3. Data Validation
```typescript
import { validators } from './utils/validation';

const result = validators.budget(value);
if (!result.isValid) {
  throw new Error(result.error);
}
```

#### 4. localStorage Security
- No sensitive data stored
- User data only (non-PII)
- Can be cleared by user

### Production Security Checklist

- [ ] Move API keys to backend
- [ ] Implement CSP headers
- [ ] Enable HTTPS only
- [ ] Add rate limiting
- [ ] Implement error boundaries
- [ ] Add logging/monitoring
- [ ] Regular dependency audits
- [ ] Input validation on all forms

---

## Future Architecture Plans

### Planned Improvements

1. **State Management**:
   - IndexedDB for large datasets
   - Zustand or Jotai for complex state

2. **Backend Integration**:
   - REST API for data sync
   - WebSocket for real-time updates
   - Authentication system

3. **Performance**:
   - Code splitting by route
   - Virtual scrolling
   - Web Workers for heavy computation

4. **Testing**:
   - Increase coverage to 80%+
   - E2E tests with Playwright
   - Visual regression tests

5. **Deployment**:
   - CI/CD pipeline
   - Automated testing
   - Blue-green deployments

---

*Last Updated: October 22, 2024*
*Version: 0.0.0*
