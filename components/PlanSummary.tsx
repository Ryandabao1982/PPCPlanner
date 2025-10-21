import React, { useMemo } from 'react';

interface PlanSummaryProps {
    workspace: any;
    goals: any[];
}

export const PlanSummary: React.FC<PlanSummaryProps> = ({ workspace, goals }) => {
    const totalBudget = useMemo(() => workspace.campaigns.reduce((sum, c) => sum + (c.budget || 0), 0), [workspace.campaigns]);
    const totalKeywords = workspace.keywords.length;
    const assignedKeywordsCount = useMemo(() => new Set(workspace.adGroups.flatMap(ag => (ag.keywords || []).map(k => k.id))).size, [workspace.adGroups]);
    const assignmentRate = totalKeywords > 0 ? ((assignedKeywordsCount / totalKeywords) * 100).toFixed(0) : 0;
    
    return (
        <div className="section">
            <h2>Plan Overview</h2>
            <div style={{padding: '1.5rem'}}>
                <div className="stat-cards">
                    <div className="stat-card">
                        <div className="stat-card-title">Total Campaigns</div>
                        <div className="stat-card-value">{workspace.campaigns.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-title">Total Ad Groups</div>
                        <div className="stat-card-value">{workspace.adGroups.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-title">Total Keywords</div>
                        <div className="stat-card-value">{totalKeywords}</div>
                    </div>
                     <div className="stat-card">
                        <div className="stat-card-title">Total Daily Budget</div>
                        <div className="stat-card-value">${totalBudget.toFixed(2)}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-title">Performance Goals Set</div>
                        <div className="stat-card-value">{goals.length}</div>
                    </div>
                     <div className="stat-card">
                        <div className="stat-card-title">Keyword Assignment</div>
                        <div className="stat-card-value">{assignmentRate}<small>%</small></div>
                    </div>
                </div>
                {/* Placeholder for future charts */}
            </div>
        </div>
    );
};