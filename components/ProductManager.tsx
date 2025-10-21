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
                        <input type="text" value={newAsin} onChange={e => setNewAsin(e.target.value)} placeholder="B0..." disabled={disabled} />
                    </div>
                    <div className="form-group">
                        <label>Parent ASIN (Optional)</label>
                        <input type="text" value={newParentAsin} onChange={e => setNewParentAsin(e.target.value)} placeholder="Parent ASIN" disabled={disabled} />
                    </div>
                </div>
                <button className="button" onClick={handleAdd} disabled={!newSku.trim() || !newAsin.trim() || disabled}>Add Product</button>

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
                                            <input type="text" value={p.asin} onChange={e => onUpdate(p.id, { asin: e.target.value })} disabled={disabled} />
                                        </td>
                                        <td>
                                            <input type="text" value={p.parentAsin || ''} onChange={e => onUpdate(p.id, { parentAsin: e.target.value })} disabled={disabled} />
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