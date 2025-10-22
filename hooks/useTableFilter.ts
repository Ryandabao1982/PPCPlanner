import { useState, useMemo } from 'react';

export interface FilterConfig {
    field: string;
    value: any;
    operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'inRange';
}

export interface SortConfig {
    field: string;
    direction: 'asc' | 'desc';
}

export const useTableFilter = <T extends Record<string, any>>(
    data: T[],
    initialFilters: FilterConfig[] = [],
    initialSort: SortConfig | null = null
) => {
    const [filters, setFilters] = useState<FilterConfig[]>(initialFilters);
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialSort);
    const [searchQuery, setSearchQuery] = useState('');

    const applyFilter = (item: T, filter: FilterConfig): boolean => {
        const value = item[filter.field];
        const filterValue = filter.value;
        const operator = filter.operator || 'equals';

        if (value === undefined || value === null) return false;

        switch (operator) {
            case 'equals':
                return value === filterValue;
            case 'contains':
                return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
            case 'startsWith':
                return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
            case 'endsWith':
                return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
            case 'greaterThan':
                return Number(value) > Number(filterValue);
            case 'lessThan':
                return Number(value) < Number(filterValue);
            case 'inRange':
                if (Array.isArray(filterValue) && filterValue.length === 2) {
                    const numValue = Number(value);
                    return numValue >= filterValue[0] && numValue <= filterValue[1];
                }
                return false;
            default:
                return true;
        }
    };

    const applySearch = (item: T): boolean => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        return Object.values(item).some(value => {
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(query);
        });
    };

    const filteredAndSortedData = useMemo(() => {
        let result = [...data];

        // Apply search
        if (searchQuery) {
            result = result.filter(applySearch);
        }

        // Apply filters
        result = result.filter(item =>
            filters.every(filter => applyFilter(item, filter))
        );

        // Apply sort
        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.field];
                const bValue = b[sortConfig.field];

                if (aValue === bValue) return 0;

                let comparison = 0;
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    comparison = aValue - bValue;
                } else {
                    comparison = String(aValue).localeCompare(String(bValue));
                }

                return sortConfig.direction === 'asc' ? comparison : -comparison;
            });
        }

        return result;
    }, [data, filters, sortConfig, searchQuery]);

    const addFilter = (filter: FilterConfig) => {
        setFilters(prev => [...prev.filter(f => f.field !== filter.field), filter]);
    };

    const removeFilter = (field: string) => {
        setFilters(prev => prev.filter(f => f.field !== field));
    };

    const clearFilters = () => {
        setFilters([]);
        setSearchQuery('');
    };

    const toggleSort = (field: string) => {
        setSortConfig(prev => {
            if (!prev || prev.field !== field) {
                return { field, direction: 'asc' };
            }
            if (prev.direction === 'asc') {
                return { field, direction: 'desc' };
            }
            return null;
        });
    };

    const hasActiveFilters = filters.length > 0 || searchQuery.length > 0;

    return {
        filteredData: filteredAndSortedData,
        filters,
        sortConfig,
        searchQuery,
        setSearchQuery,
        addFilter,
        removeFilter,
        clearFilters,
        toggleSort,
        hasActiveFilters,
        resultCount: filteredAndSortedData.length,
        totalCount: data.length
    };
};
