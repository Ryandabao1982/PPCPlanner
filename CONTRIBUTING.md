# Contributing to GoodWit PPC Planner

Thank you for your interest in contributing to GoodWit PPC Planner! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

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
5. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY to .env.local
   ```
6. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Locally

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building

```bash
npm run build
```

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define interfaces for all component props
- Avoid `any` types when possible

### React Components

- Use functional components with hooks
- Follow the existing component structure
- Keep components focused and single-purpose
- Use meaningful component and variable names

### Code Style

- Use consistent indentation (2 spaces)
- Follow existing code formatting
- Use clear and descriptive variable names
- Add comments for complex logic

### File Organization

- Place React components in `components/`
- Place utility functions in `utils/`
- Place custom hooks in `hooks/`
- Place tests in `tests/`

## Commit Guidelines

### Commit Message Format

Use clear, descriptive commit messages:

```
<type>: <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```
feat: Add keyword intent filter to keyword bank

Add a dropdown filter to allow users to filter keywords by intent
(Branded, Generic, Competitor) in the keyword bank view.

Closes #123
```

```
fix: Resolve build error with jspdf import

Update vite config to properly handle jspdf dependencies
in production builds.
```

## Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Run the test suite**: `npm test`
3. **Build the project**: `npm run build`
4. **Update documentation** if needed
5. **Update CHANGELOG.md** under the `[Unreleased]` section

### Submitting

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what and why
   - Reference to related issues (if any)
   - Screenshots for UI changes

3. **PR Description Template**:
   ```markdown
   ## Description
   Brief description of the changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   Describe how you tested your changes

   ## Checklist
   - [ ] Tests pass locally
   - [ ] Build succeeds
   - [ ] CHANGELOG.md updated
   - [ ] Documentation updated (if needed)
   - [ ] No breaking changes (or documented)
   ```

### Review Process

- Maintainers will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged

## Testing Guidelines

### Writing Tests

- Place tests in the `tests/` directory
- Use Vitest for testing
- Follow the existing test patterns
- Test both success and error cases

### Test Coverage

Aim for good test coverage of:
- Component functionality
- Business logic
- Edge cases
- Error handling

### Example Test

```typescript
describe('Component Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = someFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Documentation

### Updating Documentation

When making changes that affect usage:

1. **Update README.md** if it affects setup or usage
2. **Update relevant docs** in `docs/` directory
3. **Add JSDoc comments** to functions and components
4. **Update CHANGELOG.md** under `[Unreleased]`

### Documentation Style

- Use clear, concise language
- Include code examples where helpful
- Add screenshots for UI features
- Keep documentation up-to-date with code

## Reporting Bugs

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Test on the latest version**
3. **Gather information** about the bug

### Creating a Bug Report

Include:
- **Clear title** describing the issue
- **Steps to reproduce** the bug
- **Expected behavior**
- **Actual behavior**
- **Environment details**:
  - Node.js version
  - npm version
  - Browser (if applicable)
  - Operating system
- **Screenshots or error messages**

### Bug Report Template

```markdown
**Description**
A clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Node.js: v18.0.0
- npm: 9.0.0
- Browser: Chrome 120
- OS: macOS 14

**Screenshots**
If applicable

**Additional Context**
Any other relevant information
```

## Suggesting Enhancements

### Before Suggesting

1. **Check if the feature already exists**
2. **Search existing feature requests**
3. **Consider if it fits the project scope**

### Creating an Enhancement Request

Include:
- **Clear title** describing the enhancement
- **Problem statement**: What problem does it solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches
- **Use cases**: When would this be used?
- **Mockups or examples**: Visual representation if applicable

## Questions?

If you have questions about contributing:
- Open a [Discussion](https://github.com/Ryandabao1982/PPCPlanner/discussions)
- Check existing documentation
- Ask in your pull request

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort! 🎉
