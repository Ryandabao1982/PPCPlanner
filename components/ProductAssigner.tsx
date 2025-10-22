import React, { useState, useEffect, useMemo } from 'react';
import { useSortableTable, SortConfig } from '../hooks/useSortableTable';

// Interfaces for clarity
interface Product {
    id: number;
    sku: string;
    asin: string;
    parentAsin?: string;
}
interface AdGroup {
    id: number;
    name: string;
    campaignId: number;
    products?: Product[];
}
interface Campaign {
    id: number;
    name: string;
}

interface ProductAssignerProps {
    products: Product[];
    adGroups: AdGroup[];
    campaigns: Campaign[];
    onBulkAssign: (productIds: number[], adGroupId: number | null) => void;
    onBulkUnassign: (productIds: number[], adGroupId: number | null) => void;
    disabled: boolean;
}

export const ProductAssigner: React.FC<ProductAssignerProps> = ({ products, adGroups, campaigns, onBulkAssign, onBulkUnassign, disabled }) => {
    const [selectedAdGroupId, setSelectedAdGroupId] = useState<number | string>('');
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedAvailable, setSelectedAvailable] = useState<number[]>([]);
    const [selectedAssigned, setSelectedAssigned] = useState<number[]>([]);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickAddInput, setQuickAddInput] = useState('');

    useEffect(() => {
        if (adGroups.length > 0 && !adGroups.some(ag => ag.id === selectedAdGroupId)) {
            setSelectedAdGroupId(adGroups[0].id);
        } else if (adGroups.length === 0) {
            setSelectedAdGroupId('');
        }
    }, [adGroups, selectedAdGroupId]);

    const productAssignmentMap = useMemo(() => {
        const map = new Map<number, string[]>();
        for (const adGroup of adGroups) {
            for (const product of adGroup.products || []) {
                if (!map.has(product.id)) {
                    map.set(product.id, []);
                }
                map.get(product.id)!.push(adGroup.name);
            }
        }
        return map;
    }, [adGroups]);

    const parentAsins = useMemo(() => {
        const parents = new Set<string>();
        products.forEach(p => {
            if (p.parentAsin) {
                parents.add(p.parentAsin);
            }
        });
        return parents;
    }, [products]);

    const advertisableProducts = useMemo(() => {
        return products.filter(p => !parentAsins.has(p.asin));
    }, [products, parentAsins]);

    const selectedAdGroupProductIds = useMemo(() => {
        const adGroup = adGroups.find(ag => ag.id === selectedAdGroupId);
        return new Set((adGroup?.products || []).map(p => p.id));
    }, [selectedAdGroupId, adGroups]);
    
    const availableProducts = useMemo(() => {
        const unassignedForThisGroup = advertisableProducts.filter(p => !selectedAdGroupProductIds.has(p.id));

        if (!searchFilter) {
            return unassignedForThisGroup;
        }
        
        return unassignedForThisGroup.filter(p => 
            p.sku.toLowerCase().includes(searchFilter.toLowerCase()) || 
            p.asin.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }, [advertisableProducts, selectedAdGroupProductIds, searchFilter]);

    const selectedAdGroupProducts = useMemo(() => {
        const adGroup = adGroups.find(ag => ag.id === selectedAdGroupId);
        if (!adGroup || !adGroup.products) return [];
        return adGroup.products;
    }, [selectedAdGroupId, adGroups]);
    
    const { sortedItems: sortedAvailable, requestSort: requestSortAvailable, sortConfig: sortConfigAvailable } = useSortableTable<Product>(availableProducts, 'sku');
    const { sortedItems: sortedAssigned, requestSort: requestSortAssigned, sortConfig: sortConfigAssigned } = useSortableTable<Product>(selectedAdGroupProducts, 'sku');

    const handleSelectAvailable = (id: number) => {
        setSelectedAvailable(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    
    const handleSelectAssigned = (id: number) => {
        setSelectedAssigned(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleAssignClick = () => {
        if (selectedAvailable.length > 0 && selectedAdGroupId) {
            onBulkAssign(selectedAvailable, Number(selectedAdGroupId));
            setSelectedAvailable([]);
        }
    };
    
    const handleUnassignClick = () => {
        if (selectedAssigned.length > 0 && selectedAdGroupId) {
            onBulkUnassign(selectedAssigned, Number(selectedAdGroupId));
            setSelectedAssigned([]);
        }
    };
    
    const renderSortIndicator = (key: keyof Product, currentSortConfig: SortConfig<Product> | null) => {
        if (currentSortConfig?.key !== key) return <span className="sort-indicator"></span>;
        return <span className="sort-indicator active">{currentSortConfig.direction === 'ascending' ? '▲' : '▼'}</span>;
    };

    const handleQuickAdd = () => {
        const searchTerms = quickAddInput
            .split(/[\n,]+/)
            .map(term => term.trim().toUpperCase())
            .filter(term => term);

        if (searchTerms.length === 0) return;

        // Find products that match any of the search terms (by SKU or ASIN)
        const matchedProducts = advertisableProducts.filter(p => 
            searchTerms.some(term => 
                p.sku.toUpperCase().includes(term) || 
                p.asin.toUpperCase().includes(term)
            ) && !selectedAdGroupProductIds.has(p.id)
        );

        if (matchedProducts.length > 0) {
            onBulkAssign(matchedProducts.map(p => p.id), Number(selectedAdGroupId));
            setQuickAddInput('');
            setShowQuickAdd(false);
        }
    };

    const parseQuickAddTerms = (text: string): { found: number, notFound: string[] } => {
        const searchTerms = text
            .split(/[\n,]+/)
            .map(term => term.trim().toUpperCase())
            .filter(term => term);

        if (searchTerms.length === 0) return { found: 0, notFound: [] };

        const matchedProducts = advertisableProducts.filter(p => 
            searchTerms.some(term => 
                p.sku.toUpperCase().includes(term) || 
                p.asin.toUpperCase().includes(term)
            ) && !selectedAdGroupProductIds.has(p.id)
        );

        const matchedTerms = new Set(
            matchedProducts.flatMap(p => 
                searchTerms.filter(term => 
                    p.sku.toUpperCase().includes(term) || 
                    p.asin.toUpperCase().includes(term)
                )
            )
        );

        const notFound = searchTerms.filter(term => !matchedTerms.has(term));

        return { found: matchedProducts.length, notFound };
    };

    return (
        <div className="section">
            <h2>Product Assigner</h2>
            <div>
                <div className="form-group" style={{maxWidth: '50%'}}>
                    <label>Select Ad Group to Manage</label>
                    <select value={selectedAdGroupId} onChange={e => setSelectedAdGroupId(Number(e.target.value))} disabled={disabled || adGroups.length === 0}>
                        {adGroups.map(ag => (
                            <option key={ag.id} value={ag.id}>
                                {ag.name} ({campaigns.find(c => c.id === ag.campaignId)?.name || 'N/A'})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedAdGroupId && (
                    <div style={{ marginBottom: '1rem' }}>
                        <button 
                            className="button" 
                            onClick={() => setShowQuickAdd(!showQuickAdd)} 
                            disabled={disabled}
                        >
                            <i className="fa-solid fa-bolt"></i> Quick Add Products
                        </button>
                    </div>
                )}

                {selectedAdGroupId && showQuickAdd && (
                    <div style={{ 
                        marginBottom: '1.5rem', 
                        padding: '1.5rem', 
                        background: 'var(--bg-secondary)', 
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px'
                    }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                            <i className="fa-solid fa-bolt"></i> Quick Add by SKU or ASIN
                        </h3>
                        <div className="form-group">
                            <label>Enter SKUs or ASINs (one per line or comma-separated)</label>
                            <textarea 
                                value={quickAddInput}
                                onChange={e => setQuickAddInput(e.target.value)}
                                placeholder="MYSKU-001&#10;B0ABC123DE&#10;MYSKU-002, B0XYZ789GH"
                                disabled={disabled}
                                rows={5}
                                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                            />
                            {quickAddInput && (
                                <small style={{ display: 'block', marginTop: '0.5rem' }}>
                                    {(() => {
                                        const { found, notFound } = parseQuickAddTerms(quickAddInput);
                                        return (
                                            <>
                                                <span style={{ color: 'var(--success-color)' }}>
                                                    {found} product{found !== 1 ? 's' : ''} found
                                                </span>
                                                {notFound.length > 0 && (
                                                    <>
                                                        {' | '}
                                                        <span style={{ color: 'var(--warning-color)' }}>
                                                            {notFound.length} not found: {notFound.slice(0, 3).join(', ')}
                                                            {notFound.length > 3 && '...'}
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        );
                                    })()}
                                </small>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button 
                                className="delete-button"
                                onClick={() => {
                                    setQuickAddInput('');
                                    setShowQuickAdd(false);
                                }}
                                disabled={disabled}
                            >
                                Cancel
                            </button>
                            <button 
                                className="button"
                                onClick={handleQuickAdd}
                                disabled={disabled || parseQuickAddTerms(quickAddInput).found === 0}
                            >
                                Add {parseQuickAddTerms(quickAddInput).found} Product{parseQuickAddTerms(quickAddInput).found !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                )}
                
                <div className="assigner-grid" style={{marginTop: '1.5rem'}}>
                    <div>
                        <div className="assigner-panel-header">
                            <h3>Available Products ({availableProducts.length})</h3>
                             <input type="text" placeholder="Search by SKU or ASIN..." value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="search-input" />
                        </div>
                        <div className="assigner-table-container">
                           {availableProducts.length > 0 ? (
                            <table className="keyword-table">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={(e) => setSelectedAvailable(e.target.checked ? sortedAvailable.map(p => p.id) : [])} checked={sortedAvailable.length > 0 && selectedAvailable.length === sortedAvailable.length}/></th>
                                        <th><button className="sort-btn" onClick={() => requestSortAvailable('sku')}>SKU {renderSortIndicator('sku', sortConfigAvailable)}</button></th>
                                        <th><button className="sort-btn" onClick={() => requestSortAvailable('asin')}>ASIN {renderSortIndicator('asin', sortConfigAvailable)}</button></th>
                                        <th><button className="sort-btn" onClick={() => requestSortAvailable('parentAsin')}>Parent ASIN {renderSortIndicator('parentAsin', sortConfigAvailable)}</button></th>
                                        <th>Assigned To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAvailable.map(p => (
                                        <tr key={p.id}>
                                            <td><input type="checkbox" checked={selectedAvailable.includes(p.id)} onChange={() => handleSelectAvailable(p.id)} /></td>
                                            <td>{p.sku}</td>
                                            <td>{p.asin}</td>
                                            <td>{p.parentAsin || 'N/A'}</td>
                                            <td>
                                                {(productAssignmentMap.get(p.id) || []).map(name =>
                                                    <span key={name} className="assigner-tag">{name}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                           ) : <div className="empty-state">All advertisable products assigned or filter has no results.</div>}
                        </div>
                        <div className="assigner-actions">
                             <button className="button" onClick={handleAssignClick} disabled={disabled || !selectedAdGroupId || selectedAvailable.length === 0}>
                                Assign Selected ({selectedAvailable.length}) &rarr;
                            </button>
                        </div>
                    </div>
                     <div>
                        <div className="assigner-panel-header">
                            <h3>Assigned Products ({selectedAdGroupProducts.length})</h3>
                        </div>
                         <div className="assigner-table-container">
                           {selectedAdGroupProducts.length > 0 ? (
                            <table className="keyword-table">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={(e) => setSelectedAssigned(e.target.checked ? sortedAssigned.map(p => p.id) : [])} checked={sortedAssigned.length > 0 && selectedAssigned.length === sortedAssigned.length}/></th>
                                        <th><button className="sort-btn" onClick={() => requestSortAssigned('sku')}>SKU {renderSortIndicator('sku', sortConfigAssigned)}</button></th>
                                        <th><button className="sort-btn" onClick={() => requestSortAssigned('asin')}>ASIN {renderSortIndicator('asin', sortConfigAssigned)}</button></th>
                                        <th><button className="sort-btn" onClick={() => requestSortAssigned('parentAsin')}>Parent ASIN {renderSortIndicator('parentAsin', sortConfigAssigned)}</button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAssigned.map(p => (
                                        <tr key={p.id}>
                                            <td><input type="checkbox" checked={selectedAssigned.includes(p.id)} onChange={() => handleSelectAssigned(p.id)} /></td>
                                            <td>{p.sku}</td>
                                            <td>{p.asin}</td>
                                            <td>{p.parentAsin || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                           ) : <div className="empty-state">No products assigned.</div>}
                        </div>
                        <div className="assigner-actions">
                            <button className="delete-button" onClick={handleUnassignClick} disabled={disabled || selectedAssigned.length === 0}>
                                &larr; Unassign Selected ({selectedAssigned.length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};