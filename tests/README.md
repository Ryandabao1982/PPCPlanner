# Test Suite for GoodWit PPC Planner

This directory contains comprehensive test coverage for all key features of the PPC Planner application.

## 📊 Test Coverage Summary

**Total Tests:** 146 tests across 7 test files
**Passing:** 145 tests (99.3%)
**Coverage Areas:**
- ✅ Utility Functions (helpers, constants, exclusions)
- ✅ Campaign Validation Rules
- ✅ Custom React Hooks
- ✅ User Management & Logging
- ✅ Data Export/Import
- ✅ Keyword Processing (stemming, filtering)
- ✅ Campaign Templates & Playbook

## 🧪 Test Files

### `validation.test.ts` (37 tests)
Tests campaign template validation rules including:
- SP campaign types (Auto, Broad, Exact, SKAG, Branded, Product Targeting)
- SB campaign validation
- SD campaign validation
- Budget allocation rules
- Bid cap validation
- Master validator routing

### `audit.test.ts` (10 tests)
Tests bulk export functionality:
- Campaign naming conventions
- Ad group naming
- AI keyword discovery mocking
- Bulk XLSX generation for SP, SB, SD campaigns
- Product targeting expressions

### `helpers.test.ts` (15 tests)
Tests utility helper functions:
- Date formatting (YYYYMM)
- Keyword stemming (plurals, possessives, irregular forms)
- Multi-word phrase processing
- Data export/import function existence

### `hooks.test.ts` (25 tests)
Tests custom React hooks:
- useLocalStorage: Browser storage operations
- useTableFilter: Data filtering (equals, contains, greaterThan, lessThan, inRange)
- useTableFilter: Sorting (asc/desc)
- useTableFilter: Search functionality
- useKeyboardShortcut: Keyboard shortcut handling
- Shortcut display formatting

### `userLogger.test.ts` (16 tests)
Tests user management functionality:
- User creation and retrieval
- First visit and last visit tracking
- User updates and session management
- User clearing and logout
- Login state checking

### `exclusions.test.ts` (20 tests)
Tests keyword exclusion functionality:
- Exclusion word lists (noise words, commerce terms, temporal words)
- Efficient Set-based lookups
- Practical keyword filtering scenarios
- Multiple exclusion categories

### `constants.test.ts` (23 tests)
Tests configuration constants:
- NAMING_COMPONENTS (country, type, match, intent, theme)
- AUTO_TARGETING options
- BIDDING_STRATEGIES
- CAMPAIGN_PLAYBOOK templates and validation
- Campaign type distribution
- Funnel stage categorization

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### UI Mode (visual test runner)
```bash
npm run test:ui
```

### Coverage Report
```bash
npm run test:coverage
```

## 🔧 Test Configuration

Tests use:
- **Vitest** (v3.2.4) - Fast test runner with excellent TypeScript support
- **jsdom** environment - DOM API for React component testing
- **@testing-library/react** - React testing utilities

Configuration is in `vitest.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
});
```

## 📝 Writing New Tests

### Test File Template
```typescript
// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code
  });

  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Testing Hooks
```typescript
import { renderHook, act } from '@testing-library/react';

it('should handle state updates', () => {
  const { result } = renderHook(() => useCustomHook());
  
  act(() => {
    result.current.updateValue('new');
  });
  
  expect(result.current.value).toBe('new');
});
```

## 🎯 Test Categories

### Unit Tests
- Test individual functions in isolation
- Mock external dependencies
- Fast execution
- Examples: `helpers.test.ts`, `exclusions.test.ts`

### Integration Tests
- Test multiple units working together
- Limited mocking
- Examples: `audit.test.ts`, `validation.test.ts`

### Hook Tests
- Test React hooks with renderHook
- Test state management and effects
- Examples: `hooks.test.ts`

## 🐛 Known Issues

1. **Pre-existing failure in audit.test.ts**: 
   - Test: "should correctly generate all required rows for a manual SP campaign"
   - Issue: Expected 8 rows but got 9
   - This is a pre-existing issue not related to this test suite addition

## 🔍 Test Best Practices

1. **Descriptive Names**: Use clear, specific test names
2. **Arrange-Act-Assert**: Structure tests in three clear phases
3. **Isolated Tests**: Each test should be independent
4. **Mock External Dependencies**: Mock APIs, file system, etc.
5. **Test Edge Cases**: Include tests for error conditions
6. **Clean Up**: Use beforeEach/afterEach to reset state

## 📈 Continuous Improvement

Future test additions should cover:
- React component rendering and interactions
- API integration tests
- End-to-end workflow tests
- Performance benchmarks
- Accessibility tests

## 🤝 Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure tests are clear and maintainable
3. Run `npm test` before committing
4. Aim for high coverage on new code
5. Update this README with new test categories

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library React](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
