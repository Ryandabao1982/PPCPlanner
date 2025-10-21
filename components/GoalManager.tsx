import React, { useState, useEffect } from 'react';

interface Goal {
    id: number;
    campaignId: number;
    type: string;
    value: number;
}
interface Campaign {
    id: number;
    name: string;
}

interface GoalManagerProps {
    goals: Goal[];
    campaigns: Campaign[];
    onAdd: (goal: any) => void;
    onUpdate: (id: number, updates: any) => void;
    onDelete: (id: number) => void;
    disabled: boolean;
    animatedItemId: number | null;
}

export const GoalManager: React.FC<GoalManagerProps> = ({ goals, campaigns, onAdd, onUpdate, onDelete, disabled, animatedItemId }) => {
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | string>('');
    const [targetAcos, setTargetAcos] = useState(30);

    useEffect(() => {
        if (campaigns.length > 0 && !campaigns.some(c => c.id === selectedCampaignId)) {
            setSelectedCampaignId(campaigns[0].id);
        } else if (campaigns.length === 0) {
            setSelectedCampaignId('');
        }
    }, [campaigns, selectedCampaignId]);

    const handleAddGoal = () => {
        if (selectedCampaignId && targetAcos > 0) {
            onAdd({
                id: Date.now(),
                campaignId: Number(selectedCampaignId),
                type: 'Target ACoS',
                value: targetAcos,
            });
        }
    };

    return (
        <div className="section">
            <h2>Performance Goals</h2>
            <div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Campaign</label>
                        <select 
                            value={selectedCampaignId} 
                            onChange={e => setSelectedCampaignId(Number(e.target.value))}
                            disabled={disabled || campaigns.length === 0}
                        >
                            {campaigns.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Target ACoS (%)</label>
                        <input 
                            type="number"
                            value={targetAcos}
                            onChange={e => setTargetAcos(parseFloat(e.target.value) || 0)}
                            min="1"
                            disabled={disabled}
                        />
                    </div>
                </div>
                <button className="button" onClick={handleAddGoal} disabled={!selectedCampaignId || disabled}>Add Goal</button>

                {goals.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-crosshairs"></i>
                        <p>No performance goals have been set.</p>
                        <small>Set a Target ACoS for your key campaigns.</small>
                    </div>
                ) : (
                    <div className="keyword-table-container" style={{ marginTop: '1.5rem' }}>
                        <table className="keyword-table">
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Type</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {goals.map(goal => (
                                    <tr key={goal.id} className={goal.id === animatedItemId ? 'animated-list-item' : ''}>
                                        <td>
                                            <select
                                                value={goal.campaignId}
                                                onChange={(e) => onUpdate(goal.id, { campaignId: Number(e.target.value) })}
                                                disabled={disabled}
                                            >
                                                {campaigns.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>{goal.type}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="number"
                                                    value={goal.value}
                                                    onChange={(e) => onUpdate(goal.id, { value: parseFloat(e.target.value) || 0 })}
                                                    min="1"
                                                    disabled={disabled}
                                                    style={{ width: '80px', textAlign: 'right' }}
                                                />
                                                <span style={{ marginLeft: '0.5rem' }}>%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <button className="delete-button" onClick={() => onDelete(goal.id)} disabled={disabled}>Delete</button>
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