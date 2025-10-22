import React, { useMemo } from 'react';
import { PieChart, BarChart, MetricCard } from './Charts';

interface PlanSummaryProps {
    workspace: any;
    goals: any[];
    onNavigate?: (view: string) => void;
}

export const PlanSummary: React.FC<PlanSummaryProps> = ({ workspace, goals, onNavigate }) => {
    const totalBudget = useMemo(() => workspace.campaigns.reduce((sum, c) => sum + (c.budget || 0), 0), [workspace.campaigns]);
    const totalKeywords = workspace.keywords.length;
    const assignedKeywordsCount = useMemo(() => new Set(workspace.adGroups.flatMap(ag => (ag.keywords || []).map(k => k.id))).size, [workspace.adGroups]);
    const assignmentRate = totalKeywords > 0 ? ((assignedKeywordsCount / totalKeywords) * 100).toFixed(0) : 0;
    
    // Calculate budget distribution by campaign type
    const budgetByPlaybook = useMemo(() => {
        const distribution: { [key: string]: number } = {};
        workspace.campaigns.forEach((campaign: any) => {
            // Create a descriptive campaign type label
            let campaignType = 'Other';
            if (campaign.type && campaign.match && campaign.theme) {
                campaignType = `${campaign.type} ${campaign.match} ${campaign.theme}`;
            } else if (campaign.type && campaign.theme) {
                campaignType = `${campaign.type} ${campaign.theme}`;
            } else if (campaign.type) {
                campaignType = campaign.type;
            }
            distribution[campaignType] = (distribution[campaignType] || 0) + (campaign.budget || 0);
        });
        
        const colors = ['#fbbf24', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
        return Object.entries(distribution).map(([label, value], index) => ({
            label,
            value,
            color: colors[index % colors.length]
        }));
    }, [workspace.campaigns]);

    // Calculate keyword match type distribution
    const keywordMatchTypeData = useMemo(() => {
        const matchTypeCount: { [key: string]: number } = {};
        workspace.keywords.forEach((keyword: any) => {
            const matchType = keyword.matchType || 'BROAD';
            matchTypeCount[matchType] = (matchTypeCount[matchType] || 0) + 1;
        });
        
        const matchTypeColors: { [key: string]: string } = {
            'EXACT': '#10b981',
            'PHRASE': '#3b82f6',
            'BROAD': '#fbbf24',
            'TARGETING': '#8b5cf6'
        };
        
        return Object.entries(matchTypeCount).map(([label, value]) => ({
            label,
            value,
            color: matchTypeColors[label] || '#6b7280'
        }));
    }, [workspace.keywords]);

    // Calculate campaign metrics
    const campaignMetrics = useMemo(() => {
        return workspace.campaigns.map((campaign: any) => ({
            label: campaign.name?.split('_').slice(-2).join(' ') || campaign.name || 'Unnamed',
            value: campaign.budget || 0,
            color: '#fbbf24'
        })).sort((a: any, b: any) => b.value - a.value);
    }, [workspace.campaigns]);

    return (
        <div className="section">
            <h2>Plan Overview</h2>
            <div style={{padding: '1.5rem'}}>
                {onNavigate && (
                    <div className="quick-actions">
                        <button 
                            className="quick-action-btn"
                            onClick={() => onNavigate('CAMPAIGNS')}
                        >
                            <i className="fa-solid fa-plus"></i>
                            Add Campaign
                        </button>
                        <button 
                            className="quick-action-btn"
                            onClick={() => onNavigate('KEYWORDS')}
                        >
                            <i className="fa-solid fa-key"></i>
                            Add Keywords
                        </button>
                        <button 
                            className="quick-action-btn"
                            onClick={() => onNavigate('AD_GROUPS')}
                        >
                            <i className="fa-solid fa-layer-group"></i>
                            Manage Ad Groups
                        </button>
                        <button 
                            className="quick-action-btn"
                            onClick={() => onNavigate('GOALS')}
                        >
                            <i className="fa-solid fa-crosshairs"></i>
                            Set Goals
                        </button>
                    </div>
                )}
                <div className="stat-cards">
                    <MetricCard
                        title="Total Campaigns"
                        value={workspace.campaigns.length}
                        icon="fa-solid fa-bullhorn"
                        onClick={onNavigate ? () => onNavigate('CAMPAIGNS') : undefined}
                    />
                    <MetricCard
                        title="Total Ad Groups"
                        value={workspace.adGroups.length}
                        icon="fa-solid fa-layer-group"
                        onClick={onNavigate ? () => onNavigate('AD_GROUPS') : undefined}
                    />
                    <MetricCard
                        title="Total Keywords"
                        value={totalKeywords}
                        icon="fa-solid fa-key"
                        onClick={onNavigate ? () => onNavigate('KEYWORDS') : undefined}
                    />
                    <MetricCard
                        title="Total Daily Budget"
                        value={`$${totalBudget.toFixed(2)}`}
                        icon="fa-solid fa-dollar-sign"
                    />
                    <MetricCard
                        title="Performance Goals Set"
                        value={goals.length}
                        icon="fa-solid fa-crosshairs"
                        onClick={onNavigate ? () => onNavigate('GOALS') : undefined}
                    />
                    <MetricCard
                        title="Keyword Assignment"
                        value={`${assignmentRate}%`}
                        icon="fa-solid fa-check-circle"
                    />
                </div>
                
                <div className="dashboard-charts">
                    {budgetByPlaybook.length > 0 && (
                        <PieChart
                            title="Budget Distribution by Campaign Type"
                            data={budgetByPlaybook}
                        />
                    )}
                    
                    {keywordMatchTypeData.length > 0 && (
                        <PieChart
                            title="Keyword Distribution by Match Type"
                            data={keywordMatchTypeData}
                        />
                    )}
                </div>
                
                {campaignMetrics.length > 0 && (
                    <BarChart
                        title="Daily Budget by Campaign"
                        data={campaignMetrics}
                        valueFormatter={(v) => `$${v.toFixed(2)}`}
                    />
                )}
            </div>
        </div>
    );
};