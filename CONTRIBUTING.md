# Contributing to GoodWit PPC Planner

Thank you for your interest in contributing to GoodWit PPC Planner! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or experience level.

### Expected Behavior

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Trolling, insulting comments, or personal attacks
- Publishing others' private information without permission
- Any conduct that would be inappropriate in a professional setting

### Enforcement

Violations of the code of conduct may result in a warning or ban from the project, at the discretion of the maintainers.

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18+ installed
- **npm** 9+ installed
- **Git** installed and configured
- A **GitHub account**
- Basic knowledge of **React**, **TypeScript**, and **Git**

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/PPCPlanner.git
   cd PPCPlanner
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Ryandabao1982/PPCPlanner.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

### Development Environment Setup

#### Recommended Tools

- **Visual Studio Code** with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript
  - React snippets

- **Browser DevTools**:
  - React Developer Tools
  - Chrome/Firefox DevTools

#### Configuration

Create `.env.local` for local development:
```env
GEMINI_API_KEY=your_dev_api_key_here
```

---

## How to Contribute

### Ways to Contribute

1. **Report Bugs**: Open an issue with detailed reproduction steps
2. **Suggest Features**: Propose new features or improvements
3. **Write Documentation**: Improve docs, add examples, fix typos
4. **Fix Bugs**: Submit pull requests for open issues
5. **Add Features**: Implement new functionality
6. **Review Code**: Review pull requests from other contributors
7. **Improve Tests**: Add or improve test coverage

### Finding Work

- Browse [open issues](https://github.com/Ryandabao1982/PPCPlanner/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Check the [roadmap](CHANGELOG.md#roadmap) for planned features
- Propose your own improvements

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Conventions

- Features: `feature/add-keyword-import`
- Bug fixes: `fix/campaign-budget-validation`
- Documentation: `docs/update-installation-guide`
- Refactoring: `refactor/simplify-state-management`
- Tests: `test/add-campaign-tests`

### 2. Make Changes

- Write clean, readable code
- Follow existing code style and patterns
- Add comments for complex logic
- Update documentation as needed
- Write or update tests

### 3. Test Your Changes

```bash
# Run existing tests
npm test

# Build to ensure no errors
npm run build

# Start dev server and manually test
npm run dev
```

### 4. Commit Your Changes

Follow the [commit guidelines](#commit-guidelines):

```bash
git add .
git commit -m "feat: add keyword import from CSV"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the pull request

---

## Coding Standards

### TypeScript Guidelines

#### Use Explicit Types

```typescript
// ✅ Good
interface CampaignProps {
  campaign: Campaign;
  onUpdate: (id: number, data: Partial<Campaign>) => void;
}

// ❌ Bad
const props: any = {...};
```

#### Avoid `any` Type

```typescript
// ✅ Good
const processCampaign = (campaign: Campaign): void => {
  // ...
};

// ❌ Bad
const processCampaign = (campaign: any): any => {
  // ...
};
```

#### Use Strict Null Checks

```typescript
// ✅ Good
const getCampaign = (id: number): Campaign | null => {
  return campaigns.find(c => c.id === id) || null;
};

// ❌ Bad
const getCampaign = (id: number): Campaign => {
  return campaigns.find(c => c.id === id); // May be undefined
};
```

### React Guidelines

#### Use Functional Components

```typescript
// ✅ Good
export const CampaignCard: React.FC<CampaignProps> = ({ campaign }) => {
  return <div>{campaign.name}</div>;
};

// ❌ Bad (avoid class components)
export class CampaignCard extends React.Component {
  render() {
    return <div>{this.props.campaign.name}</div>;
  }
}
```

#### Use Hooks Properly

```typescript
// ✅ Good
const [campaigns, setCampaigns] = useState<Campaign[]>([]);

const filteredCampaigns = useMemo(
  () => campaigns.filter(c => c.brand === brand),
  [campaigns, brand]
);

const handleUpdate = useCallback(
  (id: number, data: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  },
  []
);

// ❌ Bad
let filteredCampaigns = campaigns.filter(c => c.brand === brand); // Recalculates every render
```

#### Props Destructuring

```typescript
// ✅ Good
export const CampaignCard = ({ campaign, onUpdate, onDelete }: Props) => {
  // ...
};

// ❌ Bad
export const CampaignCard = (props: Props) => {
  return <div>{props.campaign.name}</div>;
};
```

### Styling Guidelines

#### Use Existing Classes

```typescript
// ✅ Good - Use existing utility classes
<button className="btn btn-primary">Save</button>

// ❌ Bad - Inline styles
<button style={{ backgroundColor: '#F8B500', padding: '10px' }}>Save</button>
```

#### Follow Naming Conventions

```typescript
// ✅ Good - BEM-style naming
.campaign-card { }
.campaign-card__header { }
.campaign-card__title { }
.campaign-card--active { }

// ❌ Bad
.card { }
.header { }
.title { }
```

### Code Organization

#### File Structure

```
Component.tsx
├── Imports
├── Type Definitions (interfaces, types)
├── Component Definition
│   ├── State declarations
│   ├── Computed values (useMemo)
│   ├── Event handlers (useCallback)
│   ├── Effects (useEffect)
│   └── Render
└── Export
```

#### Example

```typescript
// Imports
import React, { useState, useMemo, useCallback } from 'react';
import { Campaign } from '../types';

// Type Definitions
interface CampaignManagerProps {
  campaigns: Campaign[];
  onUpdate: (id: number, data: Partial<Campaign>) => void;
}

// Component
export const CampaignManager: React.FC<CampaignManagerProps> = ({
  campaigns,
  onUpdate
}) => {
  // State
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Computed
  const selectedCampaign = useMemo(
    () => campaigns.find(c => c.id === selectedId),
    [campaigns, selectedId]
  );
  
  // Handlers
  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
  }, []);
  
  // Render
  return (
    <div className="campaign-manager">
      {/* JSX */}
    </div>
  );
};
```

---

## Commit Guidelines

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feature change)
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
# Feature
git commit -m "feat(campaigns): add bulk import from CSV"

# Bug fix
git commit -m "fix(validation): correct budget validation range"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(state): simplify campaign state management"

# Test
git commit -m "test(keywords): add unit tests for keyword validation"
```

### Commit Best Practices

- ✅ Use present tense ("add feature" not "added feature")
- ✅ Use imperative mood ("move cursor" not "moves cursor")
- ✅ Keep subject line under 72 characters
- ✅ Capitalize first letter of subject
- ✅ No period at end of subject
- ✅ Separate subject from body with blank line
- ✅ Wrap body at 72 characters
- ✅ Use body to explain what and why, not how

---

## Pull Request Process

### Before Submitting

1. **Update from upstream**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests**:
   ```bash
   npm test
   ```

3. **Build successfully**:
   ```bash
   npm run build
   ```

4. **Update documentation** if needed

5. **Self-review your code**

### PR Title

Follow commit message format:
```
feat(campaigns): add bulk import from CSV
fix(validation): correct budget validation range
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Added new tests
- [ ] All tests passing
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. **Automated checks** run (if configured)
2. **Maintainer review** - may request changes
3. **Address feedback** - push updates to your branch
4. **Approval** - maintainer approves PR
5. **Merge** - maintainer merges into main

### After Merge

1. **Delete your branch**:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your fork**:
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

---

## Testing Guidelines

### Writing Tests

```typescript
// tests/campaign.test.ts
import { describe, it, expect } from 'vitest';
import { validateCampaign } from '../utils/validation';

describe('Campaign Validation', () => {
  it('should validate correct campaign data', () => {
    const campaign = {
      name: 'Brand_US_SKU_SP_EXACT_BRANDED_202410',
      budget: 50,
      type: 'SP'
    };
    
    const result = validateCampaign(campaign);
    expect(result.isValid).toBe(true);
  });
  
  it('should reject invalid budget', () => {
    const campaign = {
      name: 'Test Campaign',
      budget: -10,
      type: 'SP'
    };
    
    const result = validateCampaign(campaign);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('budget');
  });
});
```

### Test Coverage

- Aim for 80%+ coverage for new features
- Test edge cases and error conditions
- Test user interactions
- Test data validation

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test campaign.test.ts

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

---

## Documentation

### When to Update Documentation

Update documentation when:
- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Adding or changing APIs
- Updating dependencies

### Documentation Locations

- **README.md**: Project overview and quick start
- **docs/FEATURES.md**: Detailed feature documentation
- **docs/INSTALLATION.md**: Setup and installation
- **docs/ARCHITECTURE.md**: Technical architecture
- **docs/API_GUIDE.md**: API integration guide
- **CHANGELOG.md**: Version history
- **Code comments**: Inline documentation for complex logic

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up to date with code
- Use proper Markdown formatting

---

## Questions?

- Check existing [documentation](docs/)
- Search [open issues](https://github.com/Ryandabao1982/PPCPlanner/issues)
- Ask in [discussions](https://github.com/Ryandabao1982/PPCPlanner/discussions)
- Open a new issue

---

## Thank You!

Thank you for contributing to GoodWit PPC Planner! Your contributions make this project better for everyone.

---

*Last Updated: October 22, 2024*
