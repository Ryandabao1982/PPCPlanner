import React, { useState, useEffect, useMemo } from 'react';
import { useSortableTable, SortConfig } from '../hooks/useSortableTable';

interface KeywordInBank {
    id: number;
    text: string;
    intent: string;
}
interface KeywordInAdGroup extends KeywordInBank {
    matchType: string;
}
interface AssignedKeywordDisplay extends KeywordInAdGroup {
    assignedToSelected: string[];
}
interface AdGroup {
    id: number;
    name: string;
    campaignId: number;
    keywords?: KeywordInAdGroup[];
}
interface Campaign {
    id: number;
    name: string;
}

interface KeywordAssignerProps {
    keywords: KeywordInBank[];
    adGroups: AdGroup[];
    campaigns: Campaign[];
    onBulkAssign: (keywordIds: number[], adGroupIds: number[]) => void;
    onBulkUnassign: (keywordIds: number[], adGroupIds: number[]) => void;
    disabled: boolean;
}

export const KeywordAssigner: React.FC<KeywordAssignerProps> = ({ keywords, adGroups, campaigns, onBulkAssign, onBulkUnassign, disabled }) => {
    const [selectedAdGroupIds, setSelectedAdGroupIds] = useState<number[]>([]);
    const [searchFilter, setSearchFilter] = useState('');
    const [selectedAvailable, setSelectedAvailable] = useState<number[]>([]);
    const [selectedAssigned, setSelectedAssigned] = useState<number[]>([]);
    
    useEffect(() => {
        if (adGroups.length > 0 && selectedAdGroupIds.length === 0) {
            setSelectedAdGroupIds([adGroups[0].id]);
        } else if (adGroups.length === 0) {
            setSelectedAdGroupIds([]);
        }
    }, [adGroups]);

    const handleAdGroupSelect = (adGroupId: number) => {
        setSelectedAdGroupIds(prev =>
            prev.includes(adGroupId)
                ? prev.filter(id => id !== adGroupId)
                : [...prev, adGroupId]
        );
    };

    const keywordGlobalAssignmentMap = useMemo(() => {
        const map = new Map<number, string[]>();
        adGroups.forEach(ag => {
            (ag.keywords || []).forEach(kw => {
                if (!map.has(kw.id)) map.set(kw.id, []);
                map.get(kw.id)!.push(ag.name);
            });
        });
        return map;
    }, [adGroups]);

    const assignedKeywordIdsInSelectedGroups = useMemo(() => {
        const ids = new Set<number>();
        adGroups.filter(ag => selectedAdGroupIds.includes(ag.id)).forEach(ag => {
            (ag.keywords || []).forEach(k => ids.add(k.id));
        });
        return ids;
    }, [selectedAdGroupIds, adGroups]);

    const availableKeywords = useMemo(() => {
        const unassigned = keywords.filter(k => !assignedKeywordIdsInSelectedGroups.has(k.id));
        return searchFilter ? unassigned.filter(k => k.text.toLowerCase().includes(searchFilter.toLowerCase())) : unassigned;
    }, [keywords, assignedKeywordIdsInSelectedGroups, searchFilter]);
    
    const assignedKeywords = useMemo(() => {
        const keywordMap = new Map<number, AssignedKeywordDisplay & { matchTypes: Set<string> }>();
        
        adGroups.filter(ag => selectedAdGroupIds.includes(ag.id)).forEach(ag => {
            (ag.keywords || []).forEach(kw => {
                if (!keywordMap.has(kw.id)) {
                    keywordMap.set(kw.id, { ...kw, assignedToSelected: [], matchTypes: new Set() });
                }
                const entry = keywordMap.get(kw.id)!;
                entry.assignedToSelected.push(ag.name);
                entry.matchTypes.add(kw.matchType);
            });
        });

        return Array.from(keywordMap.values()).map(kw => {
            const matchTypeDisplay = kw.matchTypes.size > 1 ? 'Varies' : (kw.matchTypes.values().next().value || 'N/A');
            return { ...kw, matchType: matchTypeDisplay };
        });
    }, [selectedAdGroupIds, adGroups]);

    const { sortedItems: sortedAvailable, requestSort: requestSortAvailable, sortConfig: sortConfigAvailable } = useSortableTable<KeywordInBank>(availableKeywords, 'text');
    const { sortedItems: sortedAssigned, requestSort: requestSortAssigned, sortConfig: sortConfigAssigned } = useSortableTable<AssignedKeywordDisplay>(assignedKeywords, 'text');

    const handleSelectAvailable = (id: number) => {
        setSelectedAvailable(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    
    const handleSelectAssigned = (id: number) => {
        setSelectedAssigned(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleAssignClick = () => {
        if (selectedAvailable.length > 0 && selectedAdGroupIds.length > 0) {
            onBulkAssign(selectedAvailable, selectedAdGroupIds);
            setSelectedAvailable([]);
        }
    };
    
    const handleUnassignClick = () => {
        if (selectedAssigned.length > 0 && selectedAdGroupIds.length > 0) {
            onBulkUnassign(selectedAssigned, selectedAdGroupIds);
            setSelectedAssigned([]);
        }
    };

    const renderSortIndicator = (key: keyof KeywordInBank | keyof AssignedKeywordDisplay, currentSortConfig: SortConfig<any> | null) => {
        if (currentSortConfig?.key !== key) return <span className="sort-indicator"></span>;
        return <span className="sort-indicator active">{currentSortConfig.direction === 'ascending' ? '▲' : '▼'}</span>;
    };

    const adGroupsByCampaign = useMemo(() => {
        return campaigns.map(campaign => ({
            ...campaign,
            adGroups: adGroups.filter(ag => ag.campaignId === campaign.id)
        })).filter(c => c.adGroups.length > 0);
    }, [campaigns, adGroups]);

    return (
        <div className="section">
            <h2>Keyword Assignment</h2>
            <div style={{padding: '1.5rem'}}>
                <div className="ad-group-multi-selector">
                    <div className="ad-group-multi-selector-header">Select Target Ad Groups ({selectedAdGroupIds.length})</div>
                    <div className="ad-group-selector-list">
                        {adGroupsByCampaign.map(campaign => (
                            <div key={campaign.id} className="ad-group-selector-group">
                                <h4 className="ad-group-selector-campaign-name">{campaign.name}</h4>
                                {campaign.adGroups.map(ag => (
                                    <div key={ag.id} className="ad-group-selector-item" onClick={() => !disabled && handleAdGroupSelect(ag.id)}>
                                        <input type="checkbox" id={`ag-select-${ag.id}`} checked={selectedAdGroupIds.includes(ag.id)} onChange={() => {}} disabled={disabled} />
                                        <label htmlFor={`ag-select-${ag.id}`}>{ag.name}</label>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="keyword-assigner-grid">
                    <div>
                        <div className="assigner-panel-header">
                            <h3>Available Keywords ({availableKeywords.length})</h3>
                             <input type="text" placeholder="Search available keywords..." value={searchFilter} onChange={e => setSearchFilter(e.target.value)} className="search-input" />
                        </div>
                        <div className="assigner-table-container">
                           {availableKeywords.length > 0 ? (
                            <table className="keyword-table">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={(e) => setSelectedAvailable(e.target.checked ? sortedAvailable.map(k => k.id) : [])} checked={sortedAvailable.length > 0 && selectedAvailable.length === sortedAvailable.length} /></th>
                                        <th><button className="sort-btn" onClick={() => requestSortAvailable('text')}>Keyword {renderSortIndicator('text', sortConfigAvailable)}</button></th>
                                        <th>Globally Assigned To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAvailable.map(kw => (
                                        <tr key={kw.id}>
                                            <td><input type="checkbox" checked={selectedAvailable.includes(kw.id)} onChange={() => handleSelectAvailable(kw.id)} /></td>
                                            <td>{kw.text}</td>
                                            <td>
                                                {(keywordGlobalAssignmentMap.get(kw.id) || []).map(name =>
                                                    <span key={name} className="assigner-tag">{name}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                           ) : <div className="empty-state">All keywords are assigned to at least one selected ad group.</div>}
                        </div>
                        <div className="assigner-actions">
                             <button className="button" onClick={handleAssignClick} disabled={disabled || selectedAdGroupIds.length === 0 || selectedAvailable.length === 0}>
                                Assign to {selectedAdGroupIds.length} Groups ({selectedAvailable.length}) &rarr;
                            </button>
                        </div>
                    </div>
                     <div>
                        <div className="assigner-panel-header">
                            <h3>Assigned Keywords ({assignedKeywords.length})</h3>
                        </div>
                         <div className="assigner-table-container">
                           {assignedKeywords.length > 0 ? (
                            <table className="keyword-table">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" onChange={(e) => setSelectedAssigned(e.target.checked ? sortedAssigned.map(k => k.id) : [])} checked={sortedAssigned.length > 0 && selectedAssigned.length === sortedAssigned.length} /></th>
                                        <th><button className="sort-btn" onClick={() => requestSortAssigned('text')}>Keyword {renderSortIndicator('text', sortConfigAssigned)}</button></th>
                                        <th><button className="sort-btn" onClick={() => requestSortAssigned('matchType')}>Match Type {renderSortIndicator('matchType', sortConfigAssigned)}</button></th>
                                        <th>Assigned to Selected</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAssigned.map(kw => (
                                        <tr key={kw.id}>
                                            <td><input type="checkbox" checked={selectedAssigned.includes(kw.id)} onChange={() => handleSelectAssigned(kw.id)} /></td>
                                            <td>{kw.text}</td>
                                            <td>{kw.matchType}</td>
                                            <td>
                                                {kw.assignedToSelected.map(name =>
                                                    <span key={name} className="assigner-tag">{name}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                           ) : <div className="empty-state">No keywords assigned to selected groups.</div>}
                        </div>
                        <div className="assigner-actions">
                            <button className="delete-button" onClick={handleUnassignClick} disabled={disabled || selectedAdGroupIds.length === 0 || selectedAssigned.length === 0}>
                                &larr; Unassign from {selectedAdGroupIds.length} Groups ({selectedAssigned.length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};