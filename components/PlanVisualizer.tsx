import React, { useState } from 'react';

// Interfaces
interface Keyword {
    id: number;
    text: string;
    matchType?: string;
    overrideBid?: number;
}
interface Product {
    id: number;
    sku: string;
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
    defaultBid?: number;
    keywords?: Keyword[];
    products?: Product[];
    productTargets?: string[];
}
interface PlanVisualizerProps {
    campaigns: Campaign[];
    adGroups: AdGroup[];
}

export const PlanVisualizer: React.FC<PlanVisualizerProps> = ({ campaigns, adGroups }) => {
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

    if (campaigns.length === 0) {
        return (
            <div className="section">
                <h2>Plan Visualization</h2>
                <div className="empty-state" style={{ margin: '1.5rem', marginTop: '0', padding: '1.5rem' }}>
                    <i className="fa-solid fa-sitemap"></i>
                    <p>No campaigns to visualize.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <h2>Plan Visualization</h2>
            <div className="plan-visualizer-container">
                {campaigns.map(campaign => {
                    const isCampaignExpanded = expandedCampaigns.has(campaign.id);
                    const campaignAdGroups = adGroups.filter(ag => ag.campaignId === campaign.id);
                    const totalKeywords = campaignAdGroups.reduce((sum, ag) => sum + (ag.keywords?.length || 0), 0);
                    
                    return (
                        <div key={campaign.id} className="plan-visualizer-item">
                            <div className="plan-visualizer-header" onClick={() => toggleExpandCampaign(campaign.id)}>
                                <i className={`fa-solid fa-chevron-right expand-icon ${isCampaignExpanded ? 'expanded' : ''}`}></i>
                                <span className="plan-visualizer-name">{campaign.name}</span>
                            </div>
                            {isCampaignExpanded && (
                                <div className="plan-visualizer-content">
                                    <div className="plan-visualizer-campaign-summary">
                                        <div className="summary-stat">
                                            <span className="summary-stat-label">Daily Budget</span>
                                            <span className="summary-stat-value">${campaign.budget.toFixed(2)}</span>
                                        </div>
                                        <div className="summary-stat">
                                            <span className="summary-stat-label">Total Keywords</span>
                                            <span className="summary-stat-value">{totalKeywords}</span>
                                        </div>
                                        <div className="summary-stat">
                                            <span className="summary-stat-label">TOS Placement</span>
                                            <span className="summary-stat-value">{campaign.placementTop || 0}%</span>
                                        </div>
                                        <div className="summary-stat">
                                            <span className="summary-stat-label">Product Placement</span>
                                            <span className="summary-stat-value">{campaign.placementProduct || 0}%</span>
                                        </div>
                                    </div>
                                    {campaignAdGroups.length > 0 ? (
                                        campaignAdGroups.map(adGroup => {
                                            const isAdGroupExpanded = expandedAdGroups.has(adGroup.id);
                                            return (
                                                <div key={adGroup.id} className="plan-visualizer-adgroup">
                                                    <div className="plan-visualizer-adgroup-header" onClick={() => toggleExpandAdGroup(adGroup.id)}>
                                                        <i className={`fa-solid fa-chevron-right expand-icon ${isAdGroupExpanded ? 'expanded' : ''}`}></i>
                                                        <span className="plan-visualizer-child-name">{adGroup.name}</span>
                                                        <div className="ad-group-sub-item-stats">
                                                            <span><i className="fa-solid fa-key"></i> {(adGroup.keywords || []).length}</span>
                                                            <span><i className="fa-solid fa-box-archive"></i> {(adGroup.products || []).length}</span>
                                                            {(adGroup.productTargets || []).length > 0 && <span><i className="fa-solid fa-crosshairs"></i> {(adGroup.productTargets || []).length}</span>}
                                                        </div>
                                                    </div>
                                                    {isAdGroupExpanded && (
                                                        <div className="plan-visualizer-adgroup-details">
                                                             <div className="detail-item">
                                                                <strong>Default Bid:</strong> ${(adGroup.defaultBid || 0).toFixed(2)}
                                                            </div>
                                                            {campaign.match === 'PT' ? (
                                                                <div className="detail-item">
                                                                    <strong>Product Targets:</strong>
                                                                    {adGroup.productTargets && adGroup.productTargets.length > 0 ? (
                                                                        <ul className="detail-list">
                                                                            {adGroup.productTargets.map(target => <li key={target}><i className="fa-solid fa-crosshairs"></i> {target}</li>)}
                                                                        </ul>
                                                                    ) : <span className="detail-list-empty">None</span>}
                                                                </div>
                                                            ) : (
                                                                <div className="detail-item">
                                                                    <strong>Keywords:</strong>
                                                                    {adGroup.keywords && adGroup.keywords.length > 0 ? (
                                                                        <ul className="detail-list">
                                                                            {adGroup.keywords.map(kw => (
                                                                                <li key={kw.id}>
                                                                                    <i className="fa-solid fa-key"></i> {kw.text} <span className="detail-tag">{kw.matchType}</span>
                                                                                    {kw.overrideBid != null && <span className="detail-bid-override">${kw.overrideBid.toFixed(2)}</span>}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : <span className="detail-list-empty">None</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="plan-visualizer-child-item empty">No ad groups in this campaign.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};