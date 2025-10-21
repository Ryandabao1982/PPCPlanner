import React, { useState, useEffect, useReducer, useMemo, useRef } from 'react';
import { NAMING_COMPONENTS, BIDDING_STRATEGIES, AUTO_TARGETING } from '../utils/constants';

interface AdGroup {
    id: number;
    campaignId: number;
    name: string;
    keywords?: any[];
    products?: any[];
    productTargets?: string[];
    defaultBid?: number;
    biddingStrategy?: string;
    matchType?: string;
    intent?: string;
    custom?: string;
}

interface Campaign {
    id: number;
    name: string;
    brand: string;
    country: string;
    match: string;
}

interface AdGroupManagerProps {
    adGroups: AdGroup[];
    campaigns: Campaign[];
    onAdd: (adGroup: any) => void;
    onUpdate: (id: number, updates: any) => void;
    onDelete: (id: number) => void;
    disabled: boolean;
    animatedItemId: number | null;
    targetedAdGroupId: number | null;
    onClearTargetedAdGroup: () => void;
}

const initialFormState = {
    selectedCampaignId: '' as number | string,
    matchType: NAMING_COMPONENTS.MATCH[0].value,
    intent: NAMING_COMPONENTS.INTENT[0].value,
    custom: '001',
    productTargets: '',
};

function formReducer(state: typeof initialFormState, action: { type: string; payload: any }) {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.payload.name]: action.payload.value };
        case 'SET_DEFAULT_CAMPAIGN':
            return { ...state, selectedCampaignId: action.payload };
        default:
            return state;
    }
}

export const AdGroupManager: React.FC<AdGroupManagerProps> = ({ adGroups, campaigns, onAdd, onUpdate, onDelete, disabled, animatedItemId, targetedAdGroupId, onClearTargetedAdGroup }) => {
    const [formState, dispatch] = useReducer(formReducer, initialFormState);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (campaigns.length > 0 && !campaigns.some(c => c.id === formState.selectedCampaignId)) {
            dispatch({ type: 'SET_DEFAULT_CAMPAIGN', payload: campaigns[0].id });
        } else if (campaigns.length === 0) {
            dispatch({ type: 'SET_DEFAULT_CAMPAIGN', payload: '' });
        }
    }, [campaigns, formState.selectedCampaignId]);
    
    useEffect(() => {
        if (targetedAdGroupId) {
            const targetAdGroup = adGroups.find(ag => ag.id === targetedAdGroupId);
            if (targetAdGroup) {
                dispatch({ type: 'UPDATE_FIELD', payload: { name: 'selectedCampaignId', value: targetAdGroup.campaignId } });
                dispatch({ type: 'UPDATE_FIELD', payload: { name: 'matchType', value: targetAdGroup.matchType || NAMING_COMPONENTS.MATCH[0].value } });
                dispatch({ type: 'UPDATE_FIELD', payload: { name: 'intent', value: targetAdGroup.intent || NAMING_COMPONENTS.INTENT[0].value } });
                dispatch({ type: 'UPDATE_FIELD', payload: { name: 'custom', value: targetAdGroup.custom || '001' } });
                dispatch({ type: 'UPDATE_FIELD', payload: { name: 'productTargets', value: (targetAdGroup.productTargets || []).join('\n') } });
            }
        }
    }, [targetedAdGroupId, adGroups]);

    useEffect(() => {
        if (targetedAdGroupId) {
            const timer = setTimeout(() => {
                const element = listRef.current?.querySelector(`[data-adgroup-id="${targetedAdGroupId}"]`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [targetedAdGroupId]);

    const handleClearSelection = () => {
        const defaultCampaignId = campaigns.length > 0 ? campaigns[0].id : '';
        dispatch({ type: 'SET_DEFAULT_CAMPAIGN', payload: defaultCampaignId });

        const selectedCampaign = campaigns.find(c => c.id === defaultCampaignId);
        const isAuto = selectedCampaign?.match === 'AUTO';

        dispatch({ type: 'UPDATE_FIELD', payload: { name: 'matchType', value: isAuto ? AUTO_TARGETING[0].value : NAMING_COMPONENTS.MATCH[0].value } });
        dispatch({ type: 'UPDATE_FIELD', payload: { name: 'intent', value: NAMING_COMPONENTS.INTENT[0].value } });
        dispatch({ type: 'UPDATE_FIELD', payload: { name: 'custom', value: '001' } });
        dispatch({ type: 'UPDATE_FIELD', payload: { name: 'productTargets', value: '' } });
        onClearTargetedAdGroup();
    };

    const selectedCampaign = useMemo(() => {
        return campaigns.find(c => c.id === Number(formState.selectedCampaignId));
    }, [campaigns, formState.selectedCampaignId]);

    const isAutoCampaign = useMemo(() => selectedCampaign?.match === 'AUTO', [selectedCampaign]);
    const isPtCampaign = useMemo(() => selectedCampaign?.match === 'PT', [selectedCampaign]);

    useEffect(() => {
        if (selectedCampaign && !targetedAdGroupId) {
            const defaultTargetingValue = isAutoCampaign
                ? AUTO_TARGETING[0].value
                : NAMING_COMPONENTS.MATCH[0].value;
            
            dispatch({ type: 'UPDATE_FIELD', payload: { name: 'matchType', value: defaultTargetingValue } });
        }
    }, [selectedCampaign, isAutoCampaign, targetedAdGroupId]);

    const { adGroupName, isValid, validationError } = useMemo(() => {
        if (selectedCampaign) {
            const { matchType, intent, custom, productTargets } = formState;
            const effectiveMatchType = isPtCampaign ? 'PT' : matchType;
            const newName = `${selectedCampaign.brand}_${selectedCampaign.country}_${effectiveMatchType}_${intent}_${custom}`;

            let error = null;
            const isDuplicate = adGroups.some(ag => ag.name === newName && ag.campaignId === Number(formState.selectedCampaignId));
            if (isDuplicate) {
                error = 'An ad group with this exact name already exists in this campaign.';
            }

            if (isPtCampaign && !error) {
                const asins = productTargets.split('\n').map(a => a.trim()).filter(Boolean);
                if (asins.length === 0) {
                    error = 'At least one competitor ASIN is required for Product Targeting ad groups.';
                } else {
                    const invalidAsin = asins.find(asin => !/^[B][0][A-Z0-9]{8}$/.test(asin));
                    if (invalidAsin) {
                        error = `Invalid ASIN format: "${invalidAsin}". Must be B0 followed by 8 alphanumeric characters.`;
                    }
                }
            }
            
            const newIsValid = !!(selectedCampaign && !error);
            return { adGroupName: newName, isValid: newIsValid, validationError: error };
        }
        return { adGroupName: '', isValid: false, validationError: null };
    }, [formState, selectedCampaign, adGroups, isPtCampaign]);


    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        dispatch({ type: 'UPDATE_FIELD', payload: { name, value } });
    };

    const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onClearTargetedAdGroup(); // Changing campaign resets any targeted ad group
        dispatch({ type: 'UPDATE_FIELD', payload: { name: 'selectedCampaignId', value: Number(e.target.value) } });
    }
    
    const handleAdd = () => {
        if (isValid && formState.selectedCampaignId) {
            const { selectedCampaignId, productTargets, ...adGroupNameParts } = formState;
            const targets = isPtCampaign ? productTargets.split('\n').map(asin => asin.trim()).filter(Boolean) : [];
            onAdd({
                id: Date.now(),
                campaignId: selectedCampaignId,
                name: adGroupName,
                keywords: [],
                products: [],
                productTargets: targets,
                defaultBid: 0.75,
                biddingStrategy: BIDDING_STRATEGIES[1].value, // Default to 'down'
                ...adGroupNameParts
            });
        }
    };
    
    const targetingOptions = isAutoCampaign ? AUTO_TARGETING : NAMING_COMPONENTS.MATCH;

    return (
        <div className="section">
             <div className="section-header-with-action">
                <h2>Ad Group Generator</h2>
                {targetedAdGroupId && <button className="button" onClick={handleClearSelection}>Clear Selection & New</button>}
            </div>
            <div>
                <div className="ad-group-form-grid">
                    <div className="form-group" style={{ gridColumn: 'span 4'}}>
                        <label>Parent Campaign</label>
                        <select value={formState.selectedCampaignId} onChange={handleCampaignChange} disabled={disabled || campaigns.length === 0}>
                            {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    { !isPtCampaign && (
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>{isAutoCampaign ? 'Targeting Group' : 'Match Type'}</label>
                            <select name="matchType" value={formState.matchType} onChange={handleChange} disabled={disabled}>
                                {targetingOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                        </div>
                    )}
                     <div className="form-group">
                        <label>Intent</label>
                        <select name="intent" value={formState.intent} onChange={handleChange} disabled={disabled}>
                             {NAMING_COMPONENTS.INTENT.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Custom ID</label>
                        <input name="custom" type="text" value={formState.custom} onChange={handleChange} disabled={disabled} />
                    </div>
                </div>
                 { isPtCampaign && (
                    <div className="form-group" style={{marginTop: '1rem'}}>
                        <label>Product Targets (ASINs, one per line)</label>
                        <textarea name="productTargets" value={formState.productTargets} onChange={handleChange} disabled={disabled} placeholder="B0..." rows={5}/>
                    </div>
                )}
                 <div className="preview-container">
                    <div className="preview-header">
                        <div className="preview-title">Ad Group Name Preview</div>
                        <div className={`status-badge ${isValid ? 'status-valid' : 'status-invalid'}`}>{isValid ? 'Valid' : 'Invalid'}</div>
                    </div>
                    <div className="preview-name">{adGroupName}</div>
                </div>
                {validationError && <div className="validation-error">{validationError}</div>}
                <button className="button" onClick={handleAdd} disabled={!isValid || disabled} style={{width: '100%'}}>Add Ad Group</button>
                
                {adGroups.length === 0 ? (
                    <div className="empty-state" style={{ marginTop: '2rem' }}>
                        <i className="fa-solid fa-layer-group"></i>
                        <p>No ad groups have been created.</p>
                        <small>Create one for the selected campaign above.</small>
                    </div>
                ) : (
                     <ul ref={listRef} className="list-container" style={{marginTop: '2rem'}}>
                        {adGroups.map(ag => (
                            <li key={ag.id} className={`list-item ${ag.id === animatedItemId ? 'animated-list-item' : ''} ${ag.id === targetedAdGroupId ? 'list-item-highlighted' : ''}`} data-adgroup-id={ag.id}>
                                <div className="list-item-name-wrapper">
                                    <input
                                        type="text"
                                        value={ag.name}
                                        onChange={(e) => onUpdate(ag.id, { name: e.target.value })}
                                        disabled={disabled}
                                        className="editable-name-input"
                                        style={{ fontFamily: "'SF Mono', 'Courier New', monospace", fontSize: '0.9rem' }}
                                    />
                                    <small style={{color: '#8b949e', display: 'block' }}>
                                        <em>Campaign: {campaigns.find(c => c.id === ag.campaignId)?.name || 'N/A'}</em>
                                    </small>
                               </div>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                                    <div className="campaign-item-budget">
                                        <label htmlFor={`bid-${ag.id}`}>$</label>
                                        <input 
                                            id={`bid-${ag.id}`}
                                            type="number"
                                            value={ag.defaultBid ?? 0.75}
                                            onChange={(e) => onUpdate(ag.id, { defaultBid: parseFloat(e.target.value) || 0})}
                                            min="0.02"
                                            step="0.01"
                                            disabled={disabled}
                                            style={{ width: '90px' }}
                                        />
                                    </div>
                                    <select 
                                        value={ag.biddingStrategy ?? 'down'} 
                                        onChange={(e) => onUpdate(ag.id, { biddingStrategy: e.target.value })}
                                        disabled={disabled}
                                    >
                                        {BIDDING_STRATEGIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                    </select>
                                    <button className="delete-button" onClick={() => onDelete(ag.id)} disabled={disabled} style={{padding: '0.4rem 0.8rem'}}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};