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

const GOAL_TYPES = [
    { value: 'Target ACoS', label: 'Target ACoS (%)', min: 1, max: 100, step: 1, suffix: '%', description: 'Advertising Cost of Sales - target percentage of sales spent on ads' },
    { value: 'Target ROAS', label: 'Target ROAS', min: 1, max: 20, step: 0.1, suffix: 'x', description: 'Return on Ad Spend - target revenue per dollar spent' },
    { value: 'Target CPC', label: 'Target CPC ($)', min: 0.1, max: 10, step: 0.1, suffix: '$', description: 'Cost Per Click - maximum you want to pay per click' },
    { value: 'Target CTR', label: 'Target CTR (%)', min: 0.1, max: 10, step: 0.1, suffix: '%', description: 'Click-Through Rate - target percentage of impressions that result in clicks' },
    { value: 'Target CVR', label: 'Target CVR (%)', min: 0.1, max: 50, step: 0.1, suffix: '%', description: 'Conversion Rate - target percentage of clicks that result in sales' },
];

const GOAL_TEMPLATES = [
    { name: 'Aggressive Growth', goals: [{ type: 'Target ACoS', value: 40 }, { type: 'Target ROAS', value: 2.5 }] },
    { name: 'Balanced Performance', goals: [{ type: 'Target ACoS', value: 25 }, { type: 'Target ROAS', value: 4 }] },
    { name: 'Profitable Scale', goals: [{ type: 'Target ACoS', value: 15 }, { type: 'Target ROAS', value: 6.5 }] },
    { name: 'Brand Awareness', goals: [{ type: 'Target CTR', value: 0.5 }, { type: 'Target CPC', value: 1.5 }] },
];

export const GoalManager: React.FC<GoalManagerProps> = ({ goals, campaigns, onAdd, onUpdate, onDelete, disabled, animatedItemId }) => {
    const [selectedCampaignId, setSelectedCampaignId] = useState<number | string>('');
    const [selectedGoalType, setSelectedGoalType] = useState('Target ACoS');
    const [goalValue, setGoalValue] = useState(30);
    const [showTemplates, setShowTemplates] = useState(false);

    useEffect(() => {
        if (campaigns.length > 0 && !campaigns.some(c => c.id === selectedCampaignId)) {
            setSelectedCampaignId(campaigns[0].id);
        } else if (campaigns.length === 0) {
            setSelectedCampaignId('');
        }
    }, [campaigns, selectedCampaignId]);

    const getCurrentGoalConfig = () => {
        return GOAL_TYPES.find(g => g.value === selectedGoalType) || GOAL_TYPES[0];
    };

    const handleAddGoal = () => {
        if (selectedCampaignId && goalValue > 0) {
            onAdd({
                id: Date.now(),
                campaignId: Number(selectedCampaignId),
                type: selectedGoalType,
                value: goalValue,
            });
        }
    };

    const handleApplyTemplate = (template: typeof GOAL_TEMPLATES[0]) => {
        if (!selectedCampaignId) return;
        
        template.goals.forEach((goal, index) => {
            setTimeout(() => {
                onAdd({
                    id: Date.now() + index,
                    campaignId: Number(selectedCampaignId),
                    type: goal.type,
                    value: goal.value,
                });
            }, index * 100);
        });
        setShowTemplates(false);
    };

    const handleBulkSetGoal = () => {
        if (!selectedGoalType || goalValue <= 0) return;
        
        const confirm = window.confirm(`Set ${selectedGoalType} of ${goalValue} for all ${campaigns.length} campaigns?`);
        if (!confirm) return;

        campaigns.forEach((campaign, index) => {
            setTimeout(() => {
                onAdd({
                    id: Date.now() + index,
                    campaignId: campaign.id,
                    type: selectedGoalType,
                    value: goalValue,
                });
            }, index * 100);
        });
    };

    const goalConfig = getCurrentGoalConfig();

    return (
        <div className="section">
            <h2>Performance Goals</h2>
            
            {/* Goal Templates Section */}
            <div style={{ marginBottom: '1rem' }}>
                <button 
                    className="button" 
                    onClick={() => setShowTemplates(!showTemplates)}
                    disabled={disabled || campaigns.length === 0}
                    style={{ marginRight: '0.5rem' }}
                >
                    <i className="fa-solid fa-file-contract" style={{ marginRight: '0.5rem' }}></i>
                    {showTemplates ? 'Hide Templates' : 'Show Goal Templates'}
                </button>
                
                {showTemplates && (
                    <div style={{ 
                        marginTop: '1rem', 
                        padding: '1rem', 
                        background: '#f5f5f5', 
                        borderRadius: '8px',
                        border: '2px solid #667eea'
                    }}>
                        <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: '#667eea' }}>
                            <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '0.5rem' }}></i>
                            Quick Start Templates
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                            {GOAL_TEMPLATES.map(template => (
                                <div 
                                    key={template.name}
                                    style={{ 
                                        padding: '0.75rem', 
                                        background: 'white', 
                                        borderRadius: '6px',
                                        border: '1px solid #ddd',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleApplyTemplate(template)}
                                >
                                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#333' }}>
                                        {template.name}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                        {template.goals.map(g => `${g.type}: ${g.value}`).join(', ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                            Click a template to apply these goals to the selected campaign
                        </p>
                    </div>
                )}
            </div>

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
                        <label>
                            Goal Type
                            {goalConfig.description && (
                                <i 
                                    className="fa-solid fa-circle-info" 
                                    style={{ marginLeft: '0.5rem', cursor: 'help', color: '#667eea' }}
                                    title={goalConfig.description}
                                ></i>
                            )}
                        </label>
                        <select 
                            value={selectedGoalType} 
                            onChange={e => {
                                setSelectedGoalType(e.target.value);
                                const newConfig = GOAL_TYPES.find(g => g.value === e.target.value);
                                if (newConfig) {
                                    setGoalValue(newConfig.value === 'Target ACoS' ? 30 : 
                                                 newConfig.value === 'Target ROAS' ? 4 :
                                                 newConfig.value === 'Target CPC' ? 1 :
                                                 newConfig.value === 'Target CTR' ? 0.5 : 5);
                                }
                            }}
                            disabled={disabled}
                        >
                            {GOAL_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>{goalConfig.label}</label>
                        <input 
                            type="number"
                            value={goalValue}
                            onChange={e => setGoalValue(parseFloat(e.target.value) || 0)}
                            min={goalConfig.min}
                            max={goalConfig.max}
                            step={goalConfig.step}
                            disabled={disabled}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button className="button" onClick={handleAddGoal} disabled={!selectedCampaignId || disabled}>
                        <i className="fa-solid fa-plus" style={{ marginRight: '0.5rem' }}></i>
                        Add Goal
                    </button>
                    <button 
                        className="button" 
                        onClick={handleBulkSetGoal} 
                        disabled={campaigns.length === 0 || disabled}
                        style={{ background: '#764ba2' }}
                    >
                        <i className="fa-solid fa-layer-group" style={{ marginRight: '0.5rem' }}></i>
                        Set for All Campaigns
                    </button>
                </div>

                {goals.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-crosshairs"></i>
                        <p>No performance goals have been set.</p>
                        <small>Set goals to track campaign performance and optimize towards your targets.</small>
                        <div style={{ marginTop: '1rem' }}>
                            <button 
                                className="button" 
                                onClick={() => setShowTemplates(true)}
                                disabled={disabled || campaigns.length === 0}
                            >
                                <i className="fa-solid fa-magic" style={{ marginRight: '0.5rem' }}></i>
                                Browse Goal Templates
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="keyword-table-container" style={{ marginTop: '1.5rem' }}>
                        <table className="keyword-table">
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Type</th>
                                    <th>Target Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {goals.map(goal => {
                                    const config = GOAL_TYPES.find(g => g.value === goal.type) || GOAL_TYPES[0];
                                    return (
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
                                            <td>
                                                <select
                                                    value={goal.type}
                                                    onChange={(e) => onUpdate(goal.id, { type: e.target.value })}
                                                    disabled={disabled}
                                                >
                                                    {GOAL_TYPES.map(type => (
                                                        <option key={type.value} value={type.value}>{type.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {config.suffix === '$' && <span style={{ marginRight: '0.25rem' }}>$</span>}
                                                    <input
                                                        type="number"
                                                        value={goal.value}
                                                        onChange={(e) => onUpdate(goal.id, { value: parseFloat(e.target.value) || 0 })}
                                                        min={config.min}
                                                        max={config.max}
                                                        step={config.step}
                                                        disabled={disabled}
                                                        style={{ width: '100px', textAlign: 'right' }}
                                                    />
                                                    {config.suffix !== '$' && <span style={{ marginLeft: '0.5rem' }}>{config.suffix}</span>}
                                                </div>
                                            </td>
                                            <td>
                                                <button className="delete-button" onClick={() => onDelete(goal.id)} disabled={disabled}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};