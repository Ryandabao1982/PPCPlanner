import React, { useState } from 'react';

interface Product {
    id: number;
    sku: string;
    asin: string;
    parentAsin?: string;
}

interface ProductManagerProps {
    products: Product[];
    onAdd: (product: any) => void;
    onUpdate: (id: number, updates: { sku?: string; asin?: string; parentAsin?: string }) => void;
    onDelete: (id: number) => void;
    disabled: boolean;
    animatedItemId: number | null;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ products, onAdd, onUpdate, onDelete, disabled, animatedItemId }) => {
    const [newSku, setNewSku] = useState('');
    const [newAsin, setNewAsin] = useState('');
    const [newParentAsin, setNewParentAsin] = useState('');
    const [showBulkImport, setShowBulkImport] = useState(false);
    const [bulkProductInput, setBulkProductInput] = useState('');

    const handleAdd = () => {
        if (newSku.trim() && newAsin.trim()) {
            onAdd({ 
                id: Date.now(), 
                sku: newSku.trim(), 
                asin: newAsin.trim(),
                parentAsin: newParentAsin.trim() || undefined,
            });
            setNewSku('');
            setNewAsin('');
            setNewParentAsin('');
        }
    };

    const parseBulkProducts = (text: string): { valid: Product[], errors: string[] } => {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        const valid: Product[] = [];
        const errors: string[] = [];

        lines.forEach((line, index) => {
            // Support both comma and tab separation
            const parts = line.includes('\t') 
                ? line.split('\t').map(p => p.trim())
                : line.split(',').map(p => p.trim());

            if (parts.length < 2) {
                errors.push(`Line ${index + 1}: Need at least SKU and ASIN (got ${parts.length} field${parts.length !== 1 ? 's' : ''})`);
                return;
            }

            const [sku, asin, parentAsin] = parts;

            if (!sku) {
                errors.push(`Line ${index + 1}: SKU is required`);
                return;
            }

            if (!asin) {
                errors.push(`Line ${index + 1}: ASIN is required`);
                return;
            }

            // Validate ASIN format (basic check for B0 prefix and 10 characters)
            if (!/^B0[A-Z0-9]{8}$/i.test(asin)) {
                errors.push(`Line ${index + 1}: Invalid ASIN format "${asin}"`);
                return;
            }

            // Validate parent ASIN if provided
            if (parentAsin && !/^B0[A-Z0-9]{8}$/i.test(parentAsin)) {
                errors.push(`Line ${index + 1}: Invalid parent ASIN format "${parentAsin}"`);
                return;
            }

            valid.push({
                id: Date.now() + Math.random(),
                sku: sku.trim(),
                asin: asin.trim().toUpperCase(),
                parentAsin: parentAsin ? parentAsin.trim().toUpperCase() : undefined
            });
        });

        return { valid, errors };
    };

    const handleBulkImport = () => {
        const { valid, errors } = parseBulkProducts(bulkProductInput);
        
        if (valid.length > 0) {
            onAdd(valid);
        }

        if (errors.length > 0) {
            // Errors will be shown in the UI
            console.warn('Bulk import errors:', errors);
        }

        if (valid.length > 0 && errors.length === 0) {
            setBulkProductInput('');
            setShowBulkImport(false);
        }
    };

    const handleExportCSV = () => {
        if (products.length === 0) return;

        const csvContent = [
            ['SKU', 'ASIN', 'Parent ASIN'].join(','),
            ...products.map(p => [
                p.sku,
                p.asin,
                p.parentAsin || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `products_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <div className="section">
            <h2>Product Manager</h2>
            <div>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div className="form-group">
                        <label>New SKU</label>
                        <input type="text" value={newSku} onChange={e => setNewSku(e.target.value)} placeholder="Parent SKU" disabled={disabled} />
                    </div>
                    <div className="form-group">
                        <label>New ASIN</label>
                        <input type="text" value={newAsin} onChange={e => setNewAsin(e.target.value.toUpperCase())} placeholder="B0..." disabled={disabled} />
                    </div>
                    <div className="form-group">
                        <label>Parent ASIN (Optional)</label>
                        <input type="text" value={newParentAsin} onChange={e => setNewParentAsin(e.target.value.toUpperCase())} placeholder="Parent ASIN" disabled={disabled} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button className="button" onClick={handleAdd} disabled={!newSku.trim() || !newAsin.trim() || disabled}>
                        <i className="fa-solid fa-plus"></i> Add Product
                    </button>
                    <button className="button" onClick={() => setShowBulkImport(!showBulkImport)} disabled={disabled}>
                        <i className="fa-solid fa-layer-group"></i> Bulk Import
                    </button>
                    {products.length > 0 && (
                        <button className="button" onClick={handleExportCSV} disabled={disabled}>
                            <i className="fa-solid fa-download"></i> Export CSV
                        </button>
                    )}
                </div>

                {showBulkImport && (
                    <div style={{ 
                        marginBottom: '1.5rem', 
                        padding: '1.5rem', 
                        background: 'var(--bg-secondary)', 
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px'
                    }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                            <i className="fa-solid fa-layer-group"></i> Bulk Import Products
                        </h3>
                        <div className="form-group">
                            <label>Paste Products (CSV or TSV format)</label>
                            <textarea 
                                value={bulkProductInput}
                                onChange={e => setBulkProductInput(e.target.value)}
                                placeholder="SKU,ASIN,Parent ASIN (optional)&#10;MYSKU-001,B0ABC123DE,B0PARENT01&#10;MYSKU-002,B0XYZ789GH&#10;&#10;Or tab-separated:&#10;MYSKU-001&#9;B0ABC123DE&#9;B0PARENT01"
                                disabled={disabled}
                                rows={8}
                                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                            />
                            {bulkProductInput && (
                                <small style={{ display: 'block', marginTop: '0.5rem' }}>
                                    {(() => {
                                        const { valid, errors } = parseBulkProducts(bulkProductInput);
                                        return (
                                            <>
                                                <span style={{ color: 'var(--success-color)' }}>
                                                    {valid.length} valid product{valid.length !== 1 ? 's' : ''}
                                                </span>
                                                {errors.length > 0 && (
                                                    <>
                                                        {' | '}
                                                        <span style={{ color: 'var(--error-color)' }}>
                                                            {errors.length} error{errors.length !== 1 ? 's' : ''}
                                                        </span>
                                                        <div style={{ marginTop: '0.5rem', maxHeight: '100px', overflow: 'auto' }}>
                                                            {errors.map((err, i) => (
                                                                <div key={i} style={{ color: 'var(--error-color)', fontSize: '0.85rem' }}>
                                                                    • {err}
                                                                </div>
                                                            ))}
                                                        </div>
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
                                    setBulkProductInput('');
                                    setShowBulkImport(false);
                                }}
                                disabled={disabled}
                            >
                                Cancel
                            </button>
                            <button 
                                className="button"
                                onClick={handleBulkImport}
                                disabled={disabled || parseBulkProducts(bulkProductInput).valid.length === 0}
                            >
                                Import {parseBulkProducts(bulkProductInput).valid.length} Product{parseBulkProducts(bulkProductInput).valid.length !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                )}

                {products.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-box-archive"></i>
                        <p>No products have been added.</p>
                        <small>Add your SKUs and ASINs to manage assets.</small>
                    </div>
                ) : (
                    <div className="keyword-table-container" style={{marginTop: '1.5rem'}}>
                        <table className="keyword-table">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>ASIN</th>
                                    <th>Parent ASIN</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className={p.id === animatedItemId ? 'animated-list-item' : ''}>
                                        <td>
                                            <input type="text" value={p.sku} onChange={e => onUpdate(p.id, { sku: e.target.value })} disabled={disabled} />
                                        </td>
                                        <td>
                                            <input type="text" value={p.asin} onChange={e => onUpdate(p.id, { asin: e.target.value.toUpperCase() })} disabled={disabled} />
                                        </td>
                                        <td>
                                            <input type="text" value={p.parentAsin || ''} onChange={e => onUpdate(p.id, { parentAsin: e.target.value.toUpperCase() })} disabled={disabled} />
                                        </td>
                                        <td>
                                            <button className="delete-button" onClick={() => onDelete(p.id)} disabled={disabled}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};