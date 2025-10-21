import React, { useState, useEffect, useMemo } from 'react';
import { MIN_BID, MAX_BID } from '../utils/constants';

// Interfaces
interface Keyword {
    id: number;
    text: string;
    overrideBid?: number;
}
interface Product {
    id: number;
    sku: string;
    asin: string;
    overrideBid?: number;
}
interface AdGroup {
    id: number;
    name: string;
    campaignId: number;
    keywords?: Keyword[];
    products?: Product[];
    defaultBid: number;
    biddingStrategy: string;
}
interface Campaign {
    id: number;
    name: string;
}

interface BidManagerProps {
    adGroups: AdGroup[];
    campaigns: Campaign[];
    onUpdateAdGroupItems: (adGroupId: number, items: any[], itemType: 'keywords' | 'products') => void;
    disabled: boolean;
}

export const BidManager: React.FC<BidManagerProps> = ({ adGroups, campaigns, onUpdateAdGroupItems, disabled }) => {
    const [selectedAdGroupId, setSelectedAdGroupId] = useState<number | string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (adGroups.length > 0 && !adGroups.some(ag => ag.id === selectedAdGroupId)) {
            setSelectedAdGroupId(adGroups[0].id);
        } else if (adGroups.length === 0) {
            setSelectedAdGroupId('');
        }
    }, [adGroups, selectedAdGroupId]);

    const selectedAdGroup = useMemo(() => {
        return adGroups.find(ag => ag.id === selectedAdGroupId);
    }, [adGroups, selectedAdGroupId]);

    const validateBid = (value: number): string | null => {
        if (isNaN(value)) return "Bid must be a valid number.";
        if (value < MIN_BID) return `Bid must be at least $${MIN_BID.toFixed(2)}.`;
        if (value > MAX_BID) return `Bid must be no more than $${MAX_BID.toFixed(2)}.`;
        return null;
    };

    const handleOverrideBidChange = (itemType: 'keywords' | 'products', itemId: number, value: string) => {
        if (!selectedAdGroup) return;

        const isClearing = value.trim() === '';
        const numValue = parseFloat(value);
        const errorKey = `override_${itemType}_${itemId}`;

        const updatedItems = (selectedAdGroup[itemType] || []).map(item => {
            if (item.id === itemId) {
                if (isClearing) {
                    const { overrideBid, ...rest } = item;
                    return rest;
                }
                return { ...item, overrideBid: isNaN(numValue) ? 0 : numValue };
            }
            return item;
        });
        
        onUpdateAdGroupItems(selectedAdGroup.id, updatedItems, itemType);

        const error = isClearing ? null : validateBid(numValue);
        setErrors(prev => {
            const newErrors = { ...prev };
            if (error) {
                newErrors[errorKey] = error;
            } else {
                delete newErrors[errorKey];
            }
            return newErrors;
        });
    };

    return (
        <div className="section">
            <h2>Keyword & Product Bid Overrides</h2>
            <div style={{padding: '1.5rem'}}>
                <div className="form-group" style={{maxWidth: '50%', marginBottom: '2rem'}}>
                    <label>Select Ad Group to Manage Overrides</label>
                    <select value={selectedAdGroupId} onChange={e => setSelectedAdGroupId(Number(e.target.value))} disabled={disabled || adGroups.length === 0}>
                        {adGroups.map(ag => (
                            <option key={ag.id} value={ag.id}>
                                {ag.name} ({campaigns.find(c => c.id === ag.campaignId)?.name || 'N/A'})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedAdGroup ? (
                    <div className="bid-overrides-grid">
                        <div>
                            <h3>Keyword Overrides</h3>
                            <div className="keyword-table-container">
                                 <table className="keyword-table">
                                    <thead>
                                        <tr>
                                            <th>Keyword</th>
                                            <th>Override Bid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(selectedAdGroup.keywords || []).map(kw => (
                                            <tr key={kw.id}>
                                                <td>{kw.text}</td>
                                                <td>
                                                    <div>
                                                        <div className="bid-input-wrapper">
                                                            <input
                                                                type="number"
                                                                value={kw.overrideBid ?? ''}
                                                                placeholder={(selectedAdGroup.defaultBid || 0).toFixed(2)}
                                                                onChange={(e) => handleOverrideBidChange('keywords', kw.id, e.target.value)}
                                                                disabled={disabled}
                                                                min={MIN_BID}
                                                                step="0.01"
                                                                className={errors[`override_keywords_${kw.id}`] ? 'input-error' : ''}
                                                            />
                                                        </div>
                                                        {errors[`override_keywords_${kw.id}`] && <div className="error-message">{errors[`override_keywords_${kw.id}`]}</div>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <h3>Product Overrides</h3>
                            <div className="keyword-table-container">
                                 <table className="keyword-table">
                                    <thead>
                                        <tr>
                                            <th>Product (SKU)</th>
                                            <th>Override Bid</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(selectedAdGroup.products || []).map(p => (
                                            <tr key={p.id}>
                                                <td>{p.sku}</td>
                                                <td>
                                                    <div>
                                                        <div className="bid-input-wrapper">
                                                            <input
                                                                type="number"
                                                                value={p.overrideBid ?? ''}
                                                                placeholder={(selectedAdGroup.defaultBid || 0).toFixed(2)}
                                                                onChange={(e) => handleOverrideBidChange('products', p.id, e.target.value)}
                                                                disabled={disabled}
                                                                min={MIN_BID}
                                                                step="0.01"
                                                                className={errors[`override_products_${p.id}`] ? 'input-error' : ''}
                                                            />
                                                        </div>
                                                        {errors[`override_products_${p.id}`] && <div className="error-message">{errors[`override_products_${p.id}`]}</div>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">Select an ad group to manage bid overrides.</div>
                )}
            </div>
        </div>
    );
};