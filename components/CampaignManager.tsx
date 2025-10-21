import React, { useState, useEffect } from 'react';

// Interfaces for props
interface Keyword {
    id: number;
    text: string;
    overrideBid?: number;
    matchType?: string;
}
interface Product {
    id: number;
    sku: string;
    asin: string;
}
interface Campaign {
    id: number;
    name: string;
    budget: number;
    placementTop?: number;
    placementProduct?: number;
    match: string;
}
interface AdGroup {
    id: number;
    campaignId: number;
    name: string;
    keywords?: Keyword[];
    products?: Product[];
    productTargets?: string[];
    defaultBid?: number;
}
interface CampaignHierarchyProps {
    campaigns: Campaign[];
    adGroups: AdGroup[];
    onUpdate: (id: number, updates: Partial<Campaign>) => void;
    onDelete: (id: number) => void;
    disabled: boolean;
    animatedItemId: number | null;
    onUpdateAdGroupItems: (adGroupId: number, items: any[], itemType: 'keywords' | 'products' | 'productTargets') => void;
    onNavigateToAdGroup: (adGroupId: number) => void;
}


const EditableAsinList = ({ adGroup, onUpdate, disabled }) => {
    const [asins, setAsins] = useState((adGroup.productTargets || []).join('\n'));

    useEffect(() => {
        setAsins((adGroup.productTargets || []).join('\n'));
    }, [adGroup.productTargets]);

    const handleBlur = () => {
        const newAsinArray = asins.split('\n').map(a => a.trim()).filter(Boolean);
        const currentAsins = adGroup.productTargets || [];

        // Avoid calling update if nothing changed
        if (JSON.stringify(newAsinArray) !== JSON.stringify(currentAsins)) {
             onUpdate(adGroup.id, newAsinArray, 'productTargets');
        }
    };

    return (
        <div style={{ padding: '0.5rem 0' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Product Targets (ASINs)</h4>
            <textarea 
                value={asins} 
                onChange={e => setAsins(e.target.value)} 
                onBlur={handleBlur} 
                disabled={disabled}
                placeholder="Enter one ASIN per line"
                rows={5}
                style={{ width: '100%' }}
            />
        </div>
    );
}

export const CampaignHierarchy: React.FC<CampaignHierarchyProps> = ({ campaigns, adGroups, onUpdate, onDelete, disabled, animatedItemId, onUpdateAdGroupItems, onNavigateToAdGroup }) => {
    const [expandedCampaigns, setExpandedCampaigns] = useState<Set<number>>(() => {
        if (campaigns.length > 0) return new Set([campaigns[0].id]);
        return new Set();
    });
    const [expandedAdGroups, setExpandedAdGroups] = useState<Set<number>>(new Set());

    const toggleExpandCampaign = (campaignId: number) => {
        setExpandedCampaigns(prev => {
            const newSet = new Set(prev);
            newSet.has(campaignId) ? newSet.delete(campaignId) : newSet.add(campaignId);
            return newSet;
        });
    };

    const toggleExpandAdGroup = (adGroupId: number) => {
        setExpandedAdGroups(prev => {
            const newSet = new Set(prev);
            newSet.has(adGroupId) ? newSet.delete(adGroupId) : newSet.add(adGroupId);
            return newSet;
        });
    };

    const handleKeywordBidChange = (adGroupId: number, keywordId: number, newBid: string) => {
        const adGroup = adGroups.find(ag => ag.id === adGroupId);
        if (!adGroup) return;

        const updatedKeywords = (adGroup.keywords || []).map(kw => {
            if (kw.id === keywordId) {
                if (newBid.trim() === '') {
                    const { overrideBid, ...rest } = kw; // remove overrideBid property
                    return rest;
                }
                const parsedBid = parseFloat(newBid);
                return { ...kw, overrideBid: isNaN(parsedBid) ? 0 : parsedBid };
            }
            return kw;
        });
        onUpdateAdGroupItems(adGroupId, updatedKeywords, 'keywords');
    };

    return (
        <div className="section">
            <h2>Campaign Structure</h2>
            <div style={{padding: 0}}>
                {campaigns.length === 0 ? (
                    <div className="empty-state" style={{margin: '1.5rem'}}>
                        <i className="fa-solid fa-bullhorn"></i>
                        <p>No campaigns have been created yet.</p>
                        <small>Use the Campaign Generator to get started.</small>
                    </div>
                ) : (
                    <div className="campaign-hierarchy-container">
                        {campaigns.map(c => {
                            const isCampaignExpanded = expandedCampaigns.has(c.id);
                            const campaignAdGroups = adGroups.filter(ag => ag.campaignId === c.id);
                            return (
                                <div key={c.id} className={`campaign-hierarchy-item ${c.id === animatedItemId ? 'animated-list-item' : ''}`}>
                                    <div className="campaign-hierarchy-header" onClick={() => toggleExpandCampaign(c.id)}>
                                        <i className={`fa-solid fa-chevron-right expand-icon ${isCampaignExpanded ? 'expanded' : ''}`}></i>
                                        <input
                                            type="text"
                                            value={c.name}
                                            onChange={(e) => onUpdate(c.id, { name: e.target.value })}
                                            onClick={(e) => e.stopPropagation()}
                                            disabled={disabled}
                                            className="editable-name-input campaign-hierarchy-name"
                                        />
                                        <div className="campaign-item-budget" onClick={e => e.stopPropagation()}>
                                            <label htmlFor={`budget-${c.id}`}>$</label>
                                            <input 
                                                id={`budget-${c.id}`} type="number" value={c.budget}
                                                onChange={(e) => onUpdate(c.id, { budget: parseFloat(e.target.value) || 0})}
                                                min="1" disabled={disabled}
                                            />
                                        </div>
                                        <button className="delete-button" onClick={(e) => { e.stopPropagation(); onDelete(c.id); }} disabled={disabled}>Delete</button>
                                    </div>
                                    {isCampaignExpanded && (
                                        <div className="campaign-hierarchy-content">
                                            <div className="campaign-settings-container">
                                                <h4>Campaign Settings</h4>
                                                <div className="placement-modifiers">
                                                    <div className="placement-modifier-group">
                                                        <label htmlFor={`placementTop-${c.id}`}>Top of search</label>
                                                        <input id={`placementTop-${c.id}`} type="number" value={c.placementTop ?? 0} onChange={e => onUpdate(c.id, { placementTop: parseInt(e.target.value) || 0 })} disabled={disabled} />
                                                        <span>%</span>
                                                    </div>
                                                    <div className="placement-modifier-group">
                                                        <label htmlFor={`placementProduct-${c.id}`}>Product pages</label>
                                                        <input id={`placementProduct-${c.id}`} type="number" value={c.placementProduct ?? 0} onChange={e => onUpdate(c.id, { placementProduct: parseInt(e.target.value) || 0 })} disabled={disabled} />
                                                        <span>%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {campaignAdGroups.length > 0 ? (
                                                campaignAdGroups.map(ag => {
                                                    const isAdGroupExpanded = expandedAdGroups.has(ag.id);
                                                    return (
                                                        <div key={ag.id} className="ad-group-item">
                                                            <div className="ad-group-header" onClick={() => toggleExpandAdGroup(ag.id)}>
                                                                <i className={`fa-solid fa-chevron-right expand-icon ${isAdGroupExpanded ? 'expanded' : ''}`}></i>
                                                                <span className="ad-group-header-name" onClick={(e) => { e.stopPropagation(); onNavigateToAdGroup(ag.id); }} title="Edit this Ad Group">
                                                                    {ag.name}
                                                                </span>
                                                                <div className="ad-group-sub-item-stats" onClick={e => e.stopPropagation()}>
                                                                    <span><i className="fa-solid fa-key"></i> {(ag.keywords || []).length}</span>
                                                                    <span><i className="fa-solid fa-box-archive"></i> {(ag.products || []).length}</span>
                                                                    {c.match === 'PT' && <span><i className="fa-solid fa-crosshairs"></i> {(ag.productTargets || []).length}</span>}
                                                                    <span><i className="fa-solid fa-dollar-sign"></i> {(ag.defaultBid || 0).toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                            {isAdGroupExpanded && (
                                                                <div className="ad-group-details-container">
                                                                    {c.match === 'PT' ? (
                                                                        <EditableAsinList adGroup={ag} onUpdate={onUpdateAdGroupItems} disabled={disabled} />
                                                                    ) : (ag.keywords || []).length > 0 ? (
                                                                        <table className="keyword-table">
                                                                            <thead><tr><th>Keyword</th><th>Match Type</th><th>Override Bid</th></tr></thead>
                                                                            <tbody>
                                                                                {(ag.keywords || []).map(kw => (
                                                                                    <tr key={kw.id}>
                                                                                        <td>{kw.text}</td>
                                                                                        <td>{kw.matchType}</td>
                                                                                        <td>
                                                                                            <div className="bid-input-wrapper">
                                                                                                <input type="number" value={kw.overrideBid ?? ''} placeholder={(ag.defaultBid || 0).toFixed(2)}
                                                                                                    onChange={e => handleKeywordBidChange(ag.id, kw.id, e.target.value)} disabled={disabled} min="0.02" step="0.01"
                                                                                                />
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    ) : <div className="ad-group-sub-item-empty" style={{paddingLeft: '1rem'}}>No keywords assigned.</div>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })
                                            ) : ( <div className="ad-group-sub-item-empty">No ad groups created for this campaign yet.</div> )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};