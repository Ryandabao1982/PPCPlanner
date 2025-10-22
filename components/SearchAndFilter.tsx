import React, { useState } from 'react';
import { FilterConfig } from '../hooks/useTableFilter';
import { Tooltip } from './Tooltip';

interface SearchAndFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filters: FilterConfig[];
    onAddFilter?: (filter: FilterConfig) => void;
    onRemoveFilter?: (field: string) => void;
    onClearFilters: () => void;
    availableFilters?: FilterOption[];
    placeholder?: string;
    resultCount?: number;
    totalCount?: number;
}

interface FilterOption {
    field: string;
    label: string;
    type: 'text' | 'select' | 'number' | 'range';
    options?: { value: any; label: string }[];
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    searchQuery,
    onSearchChange,
    filters,
    onAddFilter,
    onRemoveFilter,
    onClearFilters,
    availableFilters = [],
    placeholder = 'Search...',
    resultCount,
    totalCount
}) => {
    const [showFilters, setShowFilters] = useState(false);
    const hasFilters = filters.length > 0 || searchQuery.length > 0;

    const activeFilterFields = new Set(filters.map(f => f.field));

    return (
        <div className="search-filter-container">
            <div className="search-filter-bar">
                <div className="search-input-wrapper">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input
                        type="text"
                        className="search-input"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="search-clear-btn"
                            onClick={() => onSearchChange('')}
                            aria-label="Clear search"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>

                {availableFilters.length > 0 && (
                    <Tooltip content="Add filters to narrow results">
                        <button
                            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <i className="fa-solid fa-filter"></i>
                            Filters
                            {filters.length > 0 && (
                                <span className="filter-badge">{filters.length}</span>
                            )}
                        </button>
                    </Tooltip>
                )}

                {hasFilters && (
                    <button
                        className="clear-all-btn"
                        onClick={onClearFilters}
                    >
                        <i className="fa-solid fa-xmark"></i>
                        Clear all
                    </button>
                )}

                {resultCount !== undefined && totalCount !== undefined && (
                    <div className="search-results-count">
                        <span className="result-count">{resultCount}</span>
                        {resultCount !== totalCount && (
                            <span className="total-count"> of {totalCount}</span>
                        )}
                        {resultCount === 1 ? ' result' : ' results'}
                    </div>
                )}
            </div>

            {showFilters && availableFilters.length > 0 && (
                <div className="filter-panel">
                    <div className="filter-panel-header">
                        <span className="filter-panel-title">Advanced Filters</span>
                        <button
                            className="filter-panel-close"
                            onClick={() => setShowFilters(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className="filter-options">
                        {availableFilters.map(filterOption => {
                            const isActive = activeFilterFields.has(filterOption.field);
                            return (
                                <div
                                    key={filterOption.field}
                                    className={`filter-option ${isActive ? 'active' : ''}`}
                                >
                                    <label className="filter-option-label">
                                        {filterOption.label}
                                    </label>
                                    {renderFilterInput(filterOption, filters, onAddFilter, onRemoveFilter)}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {filters.length > 0 && (
                <div className="active-filters">
                    {filters.map(filter => {
                        const filterDef = availableFilters.find(f => f.field === filter.field);
                        return (
                            <div key={filter.field} className="filter-chip">
                                <span className="filter-chip-label">
                                    {filterDef?.label || filter.field}:
                                </span>
                                <span className="filter-chip-value">
                                    {formatFilterValue(filter.value, filterDef)}
                                </span>
                                <button
                                    className="filter-chip-remove"
                                    onClick={() => onRemoveFilter?.(filter.field)}
                                    aria-label={`Remove ${filterDef?.label || filter.field} filter`}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const renderFilterInput = (
    option: FilterOption,
    filters: FilterConfig[],
    onAddFilter?: (filter: FilterConfig) => void,
    onRemoveFilter?: (field: string) => void
) => {
    const currentFilter = filters.find(f => f.field === option.field);
    const currentValue = currentFilter?.value || '';

    const handleChange = (value: any) => {
        if (value === '' || value === null) {
            onRemoveFilter?.(option.field);
        } else {
            onAddFilter?.({
                field: option.field,
                value,
                operator: option.type === 'text' ? 'contains' : 'equals'
            });
        }
    };

    switch (option.type) {
        case 'select':
            return (
                <select
                    className="filter-input"
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value || null)}
                >
                    <option value="">All</option>
                    {option.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );

        case 'number':
            return (
                <input
                    type="number"
                    className="filter-input"
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : null)}
                    placeholder={`Filter by ${option.label.toLowerCase()}`}
                />
            );

        case 'text':
        default:
            return (
                <input
                    type="text"
                    className="filter-input"
                    value={currentValue}
                    onChange={(e) => handleChange(e.target.value || null)}
                    placeholder={`Filter by ${option.label.toLowerCase()}`}
                />
            );
    }
};

const formatFilterValue = (value: any, filterDef?: FilterOption): string => {
    if (Array.isArray(value)) {
        return value.join(' - ');
    }
    if (filterDef?.type === 'select' && filterDef.options) {
        const option = filterDef.options.find(opt => opt.value === value);
        return option?.label || String(value);
    }
    return String(value);
};
