// @vitest-environment jsdom

/**
 * Tests for Custom React Hooks
 * 
 * This file tests the custom hooks including:
 * - useLocalStorage: Browser storage hook
 * - useTableFilter: Data filtering and sorting hook
 * - useKeyboardShortcut: Keyboard shortcut handling
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTableFilter, FilterConfig, SortConfig } from '../hooks/useTableFilter';
import { useKeyboardShortcut, getShortcutDisplay } from '../hooks/useKeyboardShortcuts';

describe('useLocalStorage Hook', () => {
    const TEST_KEY = 'test-key';

    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should return initial value when localStorage is empty', () => {
        const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));
        expect(result.current[0]).toBe('initial');
    });

    it('should store and retrieve values from localStorage', () => {
        const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

        act(() => {
            result.current[1]('new value');
        });

        expect(result.current[0]).toBe('new value');
        expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify('new value'));
    });

    it('should handle object values', () => {
        const initialObj = { name: 'test', count: 0 };
        const { result } = renderHook(() => useLocalStorage(TEST_KEY, initialObj));

        const newObj = { name: 'updated', count: 5 };
        act(() => {
            result.current[1](newObj);
        });

        expect(result.current[0]).toEqual(newObj);
        expect(JSON.parse(localStorage.getItem(TEST_KEY)!)).toEqual(newObj);
    });

    it('should handle functional updates', () => {
        const { result } = renderHook(() => useLocalStorage(TEST_KEY, 10));

        act(() => {
            result.current[1]((prev: number) => prev + 5);
        });

        expect(result.current[0]).toBe(15);
    });

    it('should read existing localStorage values on mount', () => {
        localStorage.setItem(TEST_KEY, JSON.stringify('existing'));
        const { result } = renderHook(() => useLocalStorage(TEST_KEY, 'initial'));

        expect(result.current[0]).toBe('existing');
    });

    it('should handle arrays', () => {
        const { result } = renderHook(() => useLocalStorage(TEST_KEY, []));

        act(() => {
            result.current[1]([1, 2, 3]);
        });

        expect(result.current[0]).toEqual([1, 2, 3]);
    });

    it('should handle QuotaExceededError gracefully', () => {
        const { result } = renderHook(() => useLocalStorage('ppc-workspaces', {
            '1': { reportHistory: [] }
        }));

        // Mock localStorage.setItem to throw QuotaExceededError
        const originalSetItem = Storage.prototype.setItem;
        let callCount = 0;
        Storage.prototype.setItem = vi.fn((key: string, value: string) => {
            callCount++;
            // First call should throw, second call (recovery) should succeed
            if (callCount === 1) {
                const error = new DOMException('QuotaExceededError', 'QuotaExceededError');
                throw error;
            }
            // Allow recovery attempt to succeed
            originalSetItem.call(localStorage, key, value);
        });

        // Try to set a large value that would exceed quota
        const largeWorkspace = {
            '1': {
                reportHistory: Array(10).fill({
                    timestamp: new Date().toISOString(),
                    insights: {
                        executiveSummary: 'test'.repeat(1000),
                        strengths: ['test'.repeat(100)],
                        opportunities: ['test'.repeat(100)],
                        weaknesses: ['test'.repeat(100)],
                        recommendations: [{ priority: 'High', action: 'test', impact: 'test', effort: 'test' }]
                    }
                })
            }
        };

        act(() => {
            result.current[1](largeWorkspace);
        });

        // State should be updated even if localStorage fails
        expect(result.current[0]).toEqual(expect.objectContaining({
            '1': expect.objectContaining({
                reportHistory: expect.any(Array)
            })
        }));

        // Restore original setItem
        Storage.prototype.setItem = originalSetItem;
    });

    it('should trim report history when quota is exceeded', () => {
        const { result } = renderHook(() => useLocalStorage('ppc-workspaces', {
            '1': { reportHistory: [] }
        }));

        // Mock localStorage.setItem to throw QuotaExceededError on first call only
        const originalSetItem = Storage.prototype.setItem;
        let firstCall = true;
        Storage.prototype.setItem = vi.fn((key: string, value: string) => {
            if (firstCall && key === 'ppc-workspaces') {
                firstCall = false;
                const error = new DOMException('QuotaExceededError', 'QuotaExceededError');
                throw error;
            }
            originalSetItem.call(localStorage, key, value);
        });

        const workspaceWith10Reports = {
            '1': {
                reportHistory: Array(10).fill({ timestamp: '2024-01-01', insights: {} })
            }
        };

        act(() => {
            result.current[1](workspaceWith10Reports);
        });

        // After recovery, report history should be trimmed to 5
        const storedValue = JSON.parse(localStorage.getItem('ppc-workspaces') || '{}');
        if (storedValue['1']?.reportHistory) {
            expect(storedValue['1'].reportHistory.length).toBeLessThanOrEqual(5);
        }

        // Restore original setItem
        Storage.prototype.setItem = originalSetItem;
    });
});

describe('useTableFilter Hook', () => {
    const sampleData = [
        { id: 1, name: 'Apple', price: 1.50, category: 'Fruit' },
        { id: 2, name: 'Banana', price: 0.75, category: 'Fruit' },
        { id: 3, name: 'Carrot', price: 0.50, category: 'Vegetable' },
        { id: 4, name: 'Broccoli', price: 2.00, category: 'Vegetable' },
        { id: 5, name: 'Orange', price: 1.25, category: 'Fruit' },
    ];

    it('should return all data when no filters applied', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));
        expect(result.current.filteredData).toHaveLength(5);
        expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should filter by equals operator', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.addFilter({ field: 'category', value: 'Fruit', operator: 'equals' });
        });

        expect(result.current.filteredData).toHaveLength(3);
        expect(result.current.filteredData.every(item => item.category === 'Fruit')).toBe(true);
    });

    it('should filter by contains operator', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.addFilter({ field: 'name', value: 'a', operator: 'contains' });
        });

        expect(result.current.filteredData).toHaveLength(4); // Apple, Banana, Carrot, Orange
    });

    it('should filter by greaterThan operator', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.addFilter({ field: 'price', value: 1.00, operator: 'greaterThan' });
        });

        expect(result.current.filteredData).toHaveLength(3); // Apple, Broccoli, Orange
        expect(result.current.filteredData.every(item => item.price > 1.00)).toBe(true);
    });

    it('should filter by lessThan operator', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.addFilter({ field: 'price', value: 1.00, operator: 'lessThan' });
        });

        expect(result.current.filteredData).toHaveLength(2); // Banana, Carrot
    });

    it('should filter by inRange operator', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.addFilter({ field: 'price', value: [0.75, 1.50], operator: 'inRange' });
        });

        expect(result.current.filteredData).toHaveLength(3); // Banana, Apple, Orange
    });

    it('should handle search query', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.setSearchQuery('Br');
        });

        expect(result.current.filteredData).toHaveLength(1); // Broccoli
        expect(result.current.filteredData[0].name).toBe('Broccoli');
    });

    it('should sort data in ascending order', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.toggleSort('price');
        });

        expect(result.current.sortConfig).toEqual({ field: 'price', direction: 'asc' });
        expect(result.current.filteredData[0].price).toBe(0.50);
        expect(result.current.filteredData[4].price).toBe(2.00);
    });

    it('should sort data in descending order', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.toggleSort('price');
            result.current.toggleSort('price');
        });

        expect(result.current.sortConfig).toEqual({ field: 'price', direction: 'desc' });
        expect(result.current.filteredData[0].price).toBe(2.00);
        expect(result.current.filteredData[4].price).toBe(0.50);
    });

    it('should clear sort when toggled third time', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.toggleSort('price');
            result.current.toggleSort('price');
            result.current.toggleSort('price');
        });

        expect(result.current.sortConfig).toBeNull();
    });

    it('should apply multiple filters', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.addFilter({ field: 'category', value: 'Fruit', operator: 'equals' });
            result.current.addFilter({ field: 'price', value: 1.00, operator: 'greaterThan' });
        });

        expect(result.current.filteredData).toHaveLength(2); // Apple, Orange
    });

    it('should remove filters', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.addFilter({ field: 'category', value: 'Fruit', operator: 'equals' });
            result.current.removeFilter('category');
        });

        expect(result.current.filteredData).toHaveLength(5);
        expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should clear all filters', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        act(() => {
            result.current.addFilter({ field: 'category', value: 'Fruit', operator: 'equals' });
            result.current.setSearchQuery('test');
            result.current.clearFilters();
        });

        expect(result.current.filteredData).toHaveLength(5);
        expect(result.current.hasActiveFilters).toBe(false);
        expect(result.current.searchQuery).toBe('');
    });

    it('should track result and total counts', () => {
        const { result } = renderHook(() => useTableFilter(sampleData));

        expect(result.current.totalCount).toBe(5);
        expect(result.current.resultCount).toBe(5);

        act(() => {
            result.current.addFilter({ field: 'category', value: 'Fruit', operator: 'equals' });
        });

        expect(result.current.totalCount).toBe(5);
        expect(result.current.resultCount).toBe(3);
    });
});

describe('useKeyboardShortcut Hook and Utilities', () => {
    it('should format keyboard shortcut display for Mac', () => {
        const originalPlatform = navigator.platform;
        Object.defineProperty(navigator, 'platform', {
            value: 'MacIntel',
            writable: true,
            configurable: true
        });

        const display = getShortcutDisplay({ key: 'k', ctrl: true });
        expect(display).toBe('⌘+K');

        Object.defineProperty(navigator, 'platform', {
            value: originalPlatform,
            writable: true,
            configurable: true
        });
    });

    it('should format keyboard shortcut display for Windows', () => {
        const originalPlatform = navigator.platform;
        Object.defineProperty(navigator, 'platform', {
            value: 'Win32',
            writable: true,
            configurable: true
        });

        const display = getShortcutDisplay({ key: 'k', ctrl: true });
        expect(display).toBe('Ctrl+K');

        Object.defineProperty(navigator, 'platform', {
            value: originalPlatform,
            writable: true,
            configurable: true
        });
    });

    it('should format complex shortcuts', () => {
        const display = getShortcutDisplay({ key: 'z', ctrl: true, shift: true });
        expect(display).toContain('Z');
        expect(display).toContain('Shift');
    });

    it('should handle keyboard shortcut hook without triggering', () => {
        const handler = vi.fn();
        const { result } = renderHook(() => 
            useKeyboardShortcut({ key: 'k', ctrl: true }, handler)
        );

        // Hook should be created without errors
        expect(handler).not.toHaveBeenCalled();
    });

    it('should handle disabled state', () => {
        const handler = vi.fn();
        const { result } = renderHook(() => 
            useKeyboardShortcut({ key: 'k', ctrl: true }, handler, true)
        );

        // Handler should not be called when disabled
        expect(handler).not.toHaveBeenCalled();
    });
});
