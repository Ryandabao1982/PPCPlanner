import React, { useState, useMemo } from 'react';

interface Campaign {
    id: number;
    name: string;
    type: string;
    match: string;
    theme: string;
}

interface AdGroup {
    id: number;
    campaignId: number;
    name: string;
    productTargets?: string[];
}

interface TargetAsinManagerProps {
    campaigns: Campaign[];
    adGroups: AdGroup[];
    onUpdateAdGroupTargets: (adGroupId: number, targets: string[]) => void;
    disabled: boolean;
}

export const TargetAsinManager: React.FC<TargetAsinManagerProps> = ({ 
    campaigns, 
    adGroups, 
    onUpdateAdGroupTargets, 
    disabled 
}) => {
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
    const [asinInput, setAsinInput] = useState('');
    const [bulkAsinInput, setBulkAsinInput] = useState('');
    const [showBulkInput, setShowBulkInput] = useState(false);
    const [copiedAsins, setCopiedAsins] = useState<string[]>([]);

    // Filter to only PT (Product Targeting) campaigns
    const ptCampaigns = useMemo(() => 
        campaigns.filter(c => c.match === 'PT'),
        [campaigns]
    );

    // Get ad groups for selected campaign
    const selectedCampaignAdGroups = useMemo(() => {
        if (!selectedCampaignId) return [];
        return adGroups.filter(ag => ag.campaignId === selectedCampaignId);
    }, [selectedCampaignId, adGroups]);

    // Get all unique ASINs across all PT ad groups
    const allTargetAsins = useMemo(() => {
        const asinSet = new Set<string>();
        adGroups
            .filter(ag => {
                const campaign = campaigns.find(c => c.id === ag.campaignId);
                return campaign?.match === 'PT';
            })
            .forEach(ag => {
                (ag.productTargets || []).forEach(asin => asinSet.add(asin));
            });
        return Array.from(asinSet).sort();
    }, [adGroups, campaigns]);

    const handleAddAsin = (adGroupId: number, asin: string) => {
        const adGroup = adGroups.find(ag => ag.id === adGroupId);
        if (!adGroup) return;

        const currentTargets = adGroup.productTargets || [];
        if (!currentTargets.includes(asin)) {
            onUpdateAdGroupTargets(adGroupId, [...currentTargets, asin]);
        }
    };

    const handleRemoveAsin = (adGroupId: number, asin: string) => {
        const adGroup = adGroups.find(ag => ag.id === adGroupId);
        if (!adGroup) return;

        const currentTargets = adGroup.productTargets || [];
        onUpdateAdGroupTargets(adGroupId, currentTargets.filter(t => t !== asin));
    };

    const handleBulkAddAsin = (asin: string) => {
        selectedCampaignAdGroups.forEach(ag => {
            handleAddAsin(ag.id, asin);
        });
        setAsinInput('');
    };

    const handleBulkAddMultipleAsins = () => {
        const asins = bulkAsinInput
            .split(/[\n,\s]+/)
            .map(a => a.trim().toUpperCase())
            .filter(a => a && validateAsin(a));
        
        if (asins.length === 0) return;

        const uniqueAsins = Array.from(new Set(asins));
        
        selectedCampaignAdGroups.forEach(ag => {
            uniqueAsins.forEach(asin => {
                handleAddAsin(ag.id, asin);
            });
        });
        
        setBulkAsinInput('');
        setShowBulkInput(false);
    };

    const validateAsin = (asin: string): boolean => {
        return /^B0[A-Z0-9]{8}$/.test(asin.trim());
    };

    const parseBulkAsins = (text: string): { valid: string[], invalid: string[] } => {
        const asins = text
            .split(/[\n,\s]+/)
            .map(a => a.trim().toUpperCase())
            .filter(a => a);
        
        const valid: string[] = [];
        const invalid: string[] = [];
        
        asins.forEach(asin => {
            if (validateAsin(asin)) {
                valid.push(asin);
            } else if (asin) {
                invalid.push(asin);
            }
        });
        
        return { valid: Array.from(new Set(valid)), invalid };
    };

    const handleCopyAsins = (adGroupId: number) => {
        const adGroup = adGroups.find(ag => ag.id === adGroupId);
        if (!adGroup || !adGroup.productTargets) return;
        setCopiedAsins(adGroup.productTargets);
    };

    const handlePasteAsins = (adGroupId: number) => {
        if (copiedAsins.length === 0) return;
        const adGroup = adGroups.find(ag => ag.id === adGroupId);
        if (!adGroup) return;

        const currentTargets = adGroup.productTargets || [];
        const newTargets = [...currentTargets];
        
        copiedAsins.forEach(asin => {
            if (!newTargets.includes(asin)) {
                newTargets.push(asin);
            }
        });
        
        if (newTargets.length !== currentTargets.length) {
            onUpdateAdGroupTargets(adGroupId, newTargets);
        }
    };

    if (ptCampaigns.length === 0) {
        return (
            <div className="section">
                <h2>Target ASIN Manager</h2>
                <div className="empty-state">
                    <i className="fa-solid fa-crosshairs"></i>
                    <p>No Product Targeting campaigns found.</p>
                    <small>Create a Product Targeting campaign (SP_PT_*, SD_PT_*) to manage target ASINs.</small>
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <h2>Target ASIN Manager</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                Manage competitor, category, and cross-sell ASINs for Product Targeting campaigns. 
                These are the products your ads will appear alongside.
            </p>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '2rem' }}>
                <div className="form-group">
                    <label>Select PT Campaign</label>
                    <select 
                        value={selectedCampaignId || ''} 
                        onChange={e => setSelectedCampaignId(Number(e.target.value))}
                        disabled={disabled}
                    >
                        <option value="">Select a campaign...</option>
                        {ptCampaigns.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name} ({c.theme})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCampaignId && (
                    <div className="form-group">
                        <label>Add ASIN to All Ad Groups</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="text" 
                                value={asinInput}
                                onChange={e => setAsinInput(e.target.value.toUpperCase())}
                                placeholder="B0ABC123DE"
                                disabled={disabled}
                                maxLength={10}
                            />
                            <button 
                                className="button"
                                onClick={() => {
                                    if (validateAsin(asinInput)) {
                                        handleBulkAddAsin(asinInput.trim());
                                    }
                                }}
                                disabled={disabled || !validateAsin(asinInput)}
                            >
                                Add
                            </button>
                            <button 
                                className="button"
                                onClick={() => setShowBulkInput(!showBulkInput)}
                                disabled={disabled}
                                title="Bulk add multiple ASINs"
                            >
                                <i className="fa-solid fa-layer-group"></i> Bulk
                            </button>
                        </div>
                        {asinInput && !validateAsin(asinInput) && (
                            <small style={{ color: 'var(--error-color)' }}>
                                Invalid ASIN format (must be B0 followed by 8 alphanumeric characters)
                            </small>
                        )}
                    </div>
                )}
            </div>

            {selectedCampaignId && showBulkInput && (
                <div style={{ 
                    marginBottom: '2rem', 
                    padding: '1.5rem', 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px'
                }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                        <i className="fa-solid fa-layer-group"></i> Bulk Add ASINs to All Ad Groups
                    </h3>
                    <div className="form-group">
                        <label>Paste ASINs (one per line, comma, or space-separated)</label>
                        <textarea 
                            value={bulkAsinInput}
                            onChange={e => setBulkAsinInput(e.target.value)}
                            placeholder="B0ABC123DE&#10;B0XYZ789GH&#10;B0MNOP456QR"
                            disabled={disabled}
                            rows={6}
                            style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                        />
                        {bulkAsinInput && (
                            <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                                {(() => {
                                    const { valid, invalid } = parseBulkAsins(bulkAsinInput);
                                    return (
                                        <>
                                            <span style={{ color: 'var(--success-color)' }}>
                                                {valid.length} valid ASIN{valid.length !== 1 ? 's' : ''}
                                            </span>
                                            {invalid.length > 0 && (
                                                <>
                                                    {' | '}
                                                    <span style={{ color: 'var(--error-color)' }}>
                                                        {invalid.length} invalid: {invalid.slice(0, 3).join(', ')}
                                                        {invalid.length > 3 && '...'}
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
                                setBulkAsinInput('');
                                setShowBulkInput(false);
                            }}
                            disabled={disabled}
                        >
                            Cancel
                        </button>
                        <button 
                            className="button"
                            onClick={handleBulkAddMultipleAsins}
                            disabled={disabled || parseBulkAsins(bulkAsinInput).valid.length === 0}
                        >
                            Add {parseBulkAsins(bulkAsinInput).valid.length} ASIN{parseBulkAsins(bulkAsinInput).valid.length !== 1 ? 's' : ''} to All Groups
                        </button>
                    </div>
                </div>
            )}

            {selectedCampaignId && selectedCampaignAdGroups.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                        Ad Groups in Campaign
                        {copiedAsins.length > 0 && (
                            <span style={{ 
                                marginLeft: '1rem', 
                                fontSize: '0.85rem', 
                                color: 'var(--primary-color)',
                                background: 'var(--bg-secondary)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '3px'
                            }}>
                                <i className="fa-solid fa-clipboard"></i> {copiedAsins.length} ASIN{copiedAsins.length !== 1 ? 's' : ''} copied
                            </span>
                        )}
                    </h3>
                    {selectedCampaignAdGroups.map(ag => (
                        <div key={ag.id} className="target-asin-ad-group" style={{ 
                            marginBottom: '1rem', 
                            padding: '1rem', 
                            border: '1px solid var(--border-color)', 
                            borderRadius: '4px',
                            background: 'var(--bg-secondary)'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                marginBottom: '0.75rem'
                            }}>
                                <h4 style={{ margin: 0, fontSize: '0.9rem' }}>
                                    {ag.name}
                                </h4>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ 
                                        fontSize: '0.85rem', 
                                        color: 'var(--text-secondary)',
                                        background: 'var(--bg-primary)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '3px'
                                    }}>
                                        {(ag.productTargets || []).length} target{(ag.productTargets || []).length !== 1 ? 's' : ''}
                                    </span>
                                    {(ag.productTargets || []).length > 0 && (
                                        <button
                                            onClick={() => handleCopyAsins(ag.id)}
                                            disabled={disabled}
                                            style={{
                                                background: 'var(--bg-primary)',
                                                border: '1px solid var(--border-color)',
                                                color: 'var(--text-primary)',
                                                cursor: disabled ? 'not-allowed' : 'pointer',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '3px',
                                                fontSize: '0.85rem'
                                            }}
                                            title="Copy ASINs from this ad group"
                                        >
                                            <i className="fa-solid fa-copy"></i> Copy
                                        </button>
                                    )}
                                    {copiedAsins.length > 0 && (
                                        <button
                                            onClick={() => handlePasteAsins(ag.id)}
                                            disabled={disabled}
                                            style={{
                                                background: 'var(--primary-color)',
                                                border: 'none',
                                                color: 'white',
                                                cursor: disabled ? 'not-allowed' : 'pointer',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '3px',
                                                fontSize: '0.85rem'
                                            }}
                                            title="Paste copied ASINs to this ad group"
                                        >
                                            <i className="fa-solid fa-paste"></i> Paste
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {(ag.productTargets || []).length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {(ag.productTargets || []).map((asin, idx) => (
                                        <div 
                                            key={idx}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.4rem 0.75rem',
                                                background: 'var(--bg-primary)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '4px',
                                                fontSize: '0.85rem',
                                                fontFamily: 'monospace'
                                            }}
                                        >
                                            <i className="fa-solid fa-crosshairs" style={{ color: 'var(--primary-color)' }}></i>
                                            <span>{asin}</span>
                                            <button
                                                onClick={() => handleRemoveAsin(ag.id, asin)}
                                                disabled={disabled}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--error-color)',
                                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                                    padding: '0',
                                                    marginLeft: '0.25rem'
                                                }}
                                                title="Remove ASIN"
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ 
                                    padding: '1rem', 
                                    textAlign: 'center', 
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.85rem',
                                    background: 'var(--bg-primary)',
                                    borderRadius: '4px'
                                }}>
                                    No target ASINs assigned yet
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {allTargetAsins.length > 0 && (
                <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                        All Target ASINs Used ({allTargetAsins.length})
                    </h3>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '0.5rem'
                    }}>
                        {allTargetAsins.map((asin, idx) => (
                            <div 
                                key={idx}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                    fontSize: '0.85rem',
                                    fontFamily: 'monospace',
                                    textAlign: 'center'
                                }}
                            >
                                {asin}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
