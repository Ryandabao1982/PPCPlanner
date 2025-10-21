import React, { useState, useMemo } from 'react';
import { useSortableTable, SortConfig } from '../hooks/useSortableTable';
import { NAMING_COMPONENTS } from '../utils/constants';
import { stem } from '../utils/helpers';

interface SearchQuery {
    id: number;
    searchTerm: string;
    impressions: number;
    clicks: number;
    spend: number;
    orders: number;
    sales: number;
    status: 'unprocessed' | 'added_as_keyword';
}

interface SearchQueryReportProps {
    reports: SearchQuery[];
    onImport: () => void;
    onAddAsKeywords: (queries: SearchQuery[], newKeywords: any[]) => void;
    disabled: boolean;
}

const AddToBankModal = ({ queries, onConfirm, onCancel }) => {
    const [intent, setIntent] = useState(NAMING_COMPONENTS.INTENT[0].value);
    const [matchType, setMatchType] = useState(NAMING_COMPONENTS.MATCH[0].value);

    const handleConfirm = () => {
        const newKeywords = queries.map(q => ({
            id: Date.now() + Math.random(),
            text: q.searchTerm,
            intent,
            matchType,
            stemmed: stem(q.searchTerm)
        }));
        onConfirm(queries, newKeywords);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Add {queries.length} Search Term(s) to Keyword Bank</h3>
                <p>The following settings will be applied to all selected search terms.</p>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className="form-group">
                        <label>Intent</label>
                        <select value={intent} onChange={e => setIntent(e.target.value)}>
                            {NAMING_COMPONENTS.INTENT.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Match Type</label>
                        <select value={matchType} onChange={e => setMatchType(e.target.value)}>
                            {NAMING_COMPONENTS.MATCH.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>
                </div>
                <div className="modal-actions">
                    <button className="delete-button" onClick={onCancel}>Cancel</button>
                    <button className="button" onClick={handleConfirm}>Confirm & Add</button>
                </div>
            </div>
        </div>
    );
};


export const SearchQueryReport: React.FC<SearchQueryReportProps> = ({ reports, onImport, onAddAsKeywords, disabled }) => {
    const [filter, setFilter] = useState<'all' | 'unprocessed' | 'added_as_keyword'>('unprocessed');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredReports = useMemo(() => {
        if (filter === 'all') return reports;
        return reports.filter(r => r.status === filter);
    }, [reports, filter]);

    const { sortedItems, requestSort, sortConfig } = useSortableTable<SearchQuery>(filteredReports, 'clicks');

    const handleSelect = (id: number) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(sortedItems.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };
    
    const handleAddClick = () => {
        if (selectedIds.length > 0) {
            setIsModalOpen(true);
        }
    };

    const handleConfirmModal = (queries, newKeywords) => {
        onAddAsKeywords(queries, newKeywords);
        setIsModalOpen(false);
        setSelectedIds([]);
    };
    
    const renderSortIndicator = (key: keyof SearchQuery, currentSortConfig: SortConfig<SearchQuery> | null) => {
        if (currentSortConfig?.key !== key) return <span className="sort-indicator"></span>;
        return <span className="sort-indicator active">{currentSortConfig.direction === 'ascending' ? '▲' : '▼'}</span>;
    };
    
    const selectedQueries = useMemo(() => reports.filter(r => selectedIds.includes(r.id)), [reports, selectedIds]);

    return (
        <div className="section">
            {isModalOpen && <AddToBankModal queries={selectedQueries} onConfirm={handleConfirmModal} onCancel={() => setIsModalOpen(false)} />}
            <div className="report-toolbar">
                <div className="report-toolbar-group">
                    <label>Filter by status:</label>
                    <select value={filter} onChange={e => setFilter(e.target.value as any)}>
                        <option value="unprocessed">Unprocessed</option>
                        <option value="added_as_keyword">Added as Keyword</option>
                        <option value="all">All</option>
                    </select>
                </div>
                <div className="report-toolbar-group">
                    {selectedIds.length > 0 && <span>{selectedIds.length} selected</span>}
                    <button className="button" onClick={handleAddClick} disabled={disabled || selectedIds.length === 0}>
                       Add to Keyword Bank
                    </button>
                    {reports.length === 0 && (
                        <button className="button" onClick={onImport} disabled={disabled}>Import Sample Data</button>
                    )}
                </div>
            </div>
            {reports.length === 0 ? (
                 <div className="empty-state" style={{margin: '1.5rem', marginTop: 0}}>
                    <i className="fa-solid fa-file-import"></i>
                    <p>No search query data found.</p>
                    <small>Import sample data to get started with optimizing your keywords.</small>
                </div>
            ) : (
                <div className="keyword-table-container">
                    <table className="keyword-table">
                         <thead>
                            <tr>
                                <th><input type="checkbox" onChange={handleSelectAll} checked={sortedItems.length > 0 && selectedIds.length === sortedItems.length} /></th>
                                <th><button className="sort-btn" onClick={() => requestSort('searchTerm')}>Search Term {renderSortIndicator('searchTerm', sortConfig)}</button></th>
                                <th><button className="sort-btn" onClick={() => requestSort('impressions')}>Impr. {renderSortIndicator('impressions', sortConfig)}</button></th>
                                <th><button className="sort-btn" onClick={() => requestSort('clicks')}>Clicks {renderSortIndicator('clicks', sortConfig)}</button></th>
                                <th><button className="sort-btn" onClick={() => requestSort('spend')}>Spend {renderSortIndicator('spend', sortConfig)}</button></th>
                                <th><button className="sort-btn" onClick={() => requestSort('orders')}>Orders {renderSortIndicator('orders', sortConfig)}</button></th>
                                <th><button className="sort-btn" onClick={() => requestSort('sales')}>Sales {renderSortIndicator('sales', sortConfig)}</button></th>
                                <th><button className="sort-btn" onClick={() => requestSort('status')}>Status {renderSortIndicator('status', sortConfig)}</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedItems.map(report => (
                                <tr key={report.id}>
                                    <td><input type="checkbox" checked={selectedIds.includes(report.id)} onChange={() => handleSelect(report.id)} /></td>
                                    <td>{report.searchTerm}</td>
                                    <td>{report.impressions.toLocaleString()}</td>
                                    <td>{report.clicks.toLocaleString()}</td>
                                    <td>${report.spend.toFixed(2)}</td>
                                    <td>{report.orders.toLocaleString()}</td>
                                    <td>${report.sales.toFixed(2)}</td>
                                    <td><span className={`status-badge status-badge-${report.status}`}>{report.status.replace(/_/g, ' ')}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};