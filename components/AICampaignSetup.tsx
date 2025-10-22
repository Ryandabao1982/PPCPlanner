import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { getYYYYMM } from '../utils/helpers';
import { CAMPAIGN_PLAYBOOK } from '../utils/constants';

interface Product {
    id: number;
    sku: string;
    asin: string;
    parentAsin?: string;
}

interface Keyword {
    id: number;
    text: string;
    intent: string;
    stemmed: string;
}

interface Campaign {
    id: number;
    name: string;
    brand: string;
    country: string;
    type: string;
    match: string;
    theme: string;
    budget: number;
    placementTop: number;
    placementProduct: number;
}

interface AdGroup {
    id: number;
    campaignId: number;
    name: string;
    matchType: string;
    intent: string;
    custom: string;
    defaultBid: number;
    biddingStrategy: string;
    keywords: any[];
    products: any[];
    productTargets?: string[];
}

interface AIPlanCampaign {
    playbookId: string;
    productSku: string;
    budget: number;
    adGroups: AIPlanAdGroup[];
    reasoning?: string;
}

interface AIPlanAdGroup {
    name: string;
    keywordTexts: string[];
    defaultBid: number;
}

interface AICampaignPlan {
    campaigns: AIPlanCampaign[];
    summary: string;
}

interface AICampaignSetupProps {
    products: Product[];
    keywords: Keyword[];
    campaigns: Campaign[];
    onApplyPlan: (campaigns: Campaign[], adGroups: AdGroup[]) => void;
    disabled: boolean;
    workspaceBrand: string;
}

const LoadingSpinner = () => <div className="spinner"></div>;

export const AICampaignSetup: React.FC<AICampaignSetupProps> = ({ 
    products, 
    keywords, 
    campaigns,
    onApplyPlan, 
    disabled,
    workspaceBrand 
}) => {
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [totalBudget, setTotalBudget] = useState(100);
    const [campaignGoal, setCampaignGoal] = useState('balanced');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiPlan, setAiPlan] = useState<AICampaignPlan | null>(null);
    const [editedPlan, setEditedPlan] = useState<AICampaignPlan | null>(null);
    const [error, setError] = useState<string | null>(null);

    const availableProducts = useMemo(() => {
        const parentAsins = new Set<string>();
        products.forEach(p => {
            if (p.parentAsin) parentAsins.add(p.parentAsin);
        });
        return products.filter(p => !parentAsins.has(p.asin));
    }, [products]);

    const handleProductToggle = (productId: number) => {
        setSelectedProductIds(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleGeneratePlan = async () => {
        if (selectedProductIds.length === 0) {
            setError("Please select at least one product.");
            return;
        }

        if (keywords.length === 0) {
            setError("Please add keywords to your keyword bank first.");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setAiPlan(null);
        setEditedPlan(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const selectedProducts = availableProducts.filter(p => selectedProductIds.includes(p.id));
            const productList = selectedProducts.map(p => `${p.sku} (${p.asin})`).join(', ');
            const keywordsByIntent = {
                BRANDED: keywords.filter(k => k.intent === 'BRANDED').map(k => k.text),
                COMPETITOR: keywords.filter(k => k.intent === 'COMPETITOR').map(k => k.text),
                GENERIC: keywords.filter(k => k.intent === 'GENERIC').map(k => k.text),
                CATEGORY: keywords.filter(k => k.intent === 'CATEGORY').map(k => k.text),
            };

            const playbookOptions = CAMPAIGN_PLAYBOOK.map(p => ({
                id: p.id,
                label: p.label,
                description: p.description,
                budgetAllocation: p.budgetAllocation,
                defaultBid: p.defaultBid,
            }));

            const existingCampaignNames = campaigns.map(c => c.name);

            const prompt = `You are an expert Amazon PPC campaign strategist. Create a comprehensive campaign setup plan.

CONTEXT:
- Brand: ${workspaceBrand}
- Products: ${productList}
- Total Budget: $${totalBudget}/day
- Campaign Goal: ${campaignGoal}
- Available Keywords by Intent:
  * Branded (${keywordsByIntent.BRANDED.length}): ${keywordsByIntent.BRANDED.slice(0, 10).join(', ')}${keywordsByIntent.BRANDED.length > 10 ? '...' : ''}
  * Competitor (${keywordsByIntent.COMPETITOR.length}): ${keywordsByIntent.COMPETITOR.slice(0, 10).join(', ')}${keywordsByIntent.COMPETITOR.length > 10 ? '...' : ''}
  * Generic (${keywordsByIntent.GENERIC.length}): ${keywordsByIntent.GENERIC.slice(0, 10).join(', ')}${keywordsByIntent.GENERIC.length > 10 ? '...' : ''}
  * Category (${keywordsByIntent.CATEGORY.length}): ${keywordsByIntent.CATEGORY.slice(0, 10).join(', ')}${keywordsByIntent.CATEGORY.length > 10 ? '...' : ''}

AVAILABLE PLAYBOOK TYPES:
${playbookOptions.map(p => `- ${p.id}: ${p.label} (Suggested Budget: ${p.budgetAllocation}%, Default Bid: $${p.defaultBid})`).join('\n')}

EXISTING CAMPAIGNS (avoid duplicates):
${existingCampaignNames.length > 0 ? existingCampaignNames.join(', ') : 'None'}

TASK:
Create a strategic campaign plan that:
1. Selects appropriate playbook types based on the goal and available keywords
2. Distributes the total budget across campaigns based on priority and playbook recommendations
3. Assigns keywords to ad groups based on their intent and the campaign match type
4. Suggests appropriate bid amounts based on the playbook defaults
5. Ensures campaign names don't conflict with existing ones

RULES:
- Each product should get at least one campaign (you can create multiple campaigns per product)
- Budget distribution should sum to approximately the total budget
- Only assign keywords that match the intent/theme of the campaign
- For ${campaignGoal} goal: ${campaignGoal === 'aggressive' ? 'Focus on performance campaigns (EXACT, SKAG) with higher budgets' : campaignGoal === 'defensive' ? 'Focus on branded campaigns to protect brand' : 'Balance across research, branded, and performance campaigns'}
- Each ad group should have 5-20 keywords assigned
- Return a summary explaining the strategy

OUTPUT FORMAT:
Provide a structured campaign plan with reasoning.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            summary: {
                                type: Type.STRING,
                                description: 'A brief explanation of the overall campaign strategy'
                            },
                            campaigns: {
                                type: Type.ARRAY,
                                description: 'List of campaigns to create',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        playbookId: {
                                            type: Type.STRING,
                                            description: 'ID of the playbook type to use (e.g., SP_EXACT_PERFORMANCE)'
                                        },
                                        productSku: {
                                            type: Type.STRING,
                                            description: 'SKU of the product for this campaign'
                                        },
                                        budget: {
                                            type: Type.NUMBER,
                                            description: 'Daily budget for this campaign in dollars'
                                        },
                                        reasoning: {
                                            type: Type.STRING,
                                            description: 'Brief explanation for why this campaign was chosen'
                                        },
                                        adGroups: {
                                            type: Type.ARRAY,
                                            description: 'Ad groups within this campaign',
                                            items: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    name: {
                                                        type: Type.STRING,
                                                        description: 'Suggested ad group name'
                                                    },
                                                    keywordTexts: {
                                                        type: Type.ARRAY,
                                                        description: 'List of keyword texts to assign (must match available keywords)',
                                                        items: { type: Type.STRING }
                                                    },
                                                    defaultBid: {
                                                        type: Type.NUMBER,
                                                        description: 'Default bid for keywords in this ad group'
                                                    }
                                                },
                                                required: ['name', 'keywordTexts', 'defaultBid']
                                            }
                                        }
                                    },
                                    required: ['playbookId', 'productSku', 'budget', 'adGroups']
                                }
                            }
                        },
                        required: ['summary', 'campaigns']
                    }
                }
            });

            const jsonStr = response.text.trim();
            const parsedPlan: AICampaignPlan = JSON.parse(jsonStr);

            setAiPlan(parsedPlan);
            setEditedPlan(JSON.parse(JSON.stringify(parsedPlan))); // Deep copy for editing

        } catch (err) {
            console.error("Error generating AI plan:", err);
            setError("Failed to generate campaign plan. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEditBudget = (campaignIndex: number, newBudget: number) => {
        if (!editedPlan) return;
        const updated = { ...editedPlan };
        updated.campaigns[campaignIndex].budget = newBudget;
        setEditedPlan(updated);
    };

    const handleEditBid = (campaignIndex: number, adGroupIndex: number, newBid: number) => {
        if (!editedPlan) return;
        const updated = { ...editedPlan };
        updated.campaigns[campaignIndex].adGroups[adGroupIndex].defaultBid = newBid;
        setEditedPlan(updated);
    };

    const handleRemoveCampaign = (campaignIndex: number) => {
        if (!editedPlan) return;
        const updated = { ...editedPlan };
        updated.campaigns = updated.campaigns.filter((_, i) => i !== campaignIndex);
        setEditedPlan(updated);
    };

    const handleRemoveKeyword = (campaignIndex: number, adGroupIndex: number, keywordText: string) => {
        if (!editedPlan) return;
        const updated = { ...editedPlan };
        updated.campaigns[campaignIndex].adGroups[adGroupIndex].keywordTexts = 
            updated.campaigns[campaignIndex].adGroups[adGroupIndex].keywordTexts.filter(k => k !== keywordText);
        setEditedPlan(updated);
    };

    const handleApprovePlan = () => {
        if (!editedPlan) return;

        const yyyymm = getYYYYMM();
        const newCampaigns: Campaign[] = [];
        const newAdGroups: AdGroup[] = [];
        let baseId = Date.now();

        editedPlan.campaigns.forEach((planCampaign, idx) => {
            const playbook = CAMPAIGN_PLAYBOOK.find(p => p.id === planCampaign.playbookId);
            const product = availableProducts.find(p => p.sku === planCampaign.productSku);
            
            if (!playbook || !product) return;

            const campaignId = baseId + idx * 1000;
            const campaignName = `${workspaceBrand}_${playbook.country}_${product.sku}_${playbook.campaignType}_${yyyymm}`;

            const newCampaign: Campaign = {
                id: campaignId,
                name: campaignName,
                brand: workspaceBrand,
                country: playbook.country,
                type: playbook.type,
                match: playbook.match,
                theme: playbook.theme,
                budget: planCampaign.budget,
                placementTop: playbook.tosModifier || 0,
                placementProduct: 0,
            };
            newCampaigns.push(newCampaign);

            planCampaign.adGroups.forEach((planAdGroup, agIdx) => {
                const adGroupId = campaignId + agIdx + 1;
                
                // Find matching keywords from the keyword bank
                const assignedKeywords = keywords
                    .filter(k => planAdGroup.keywordTexts.includes(k.text))
                    .map(k => ({ ...k, matchType: playbook.match }));

                const newAdGroup: AdGroup = {
                    id: adGroupId,
                    campaignId: campaignId,
                    name: planAdGroup.name || `${workspaceBrand}_${playbook.country}_${playbook.match}_${playbook.theme}_${String(agIdx + 1).padStart(3, '0')}`,
                    matchType: playbook.match,
                    intent: playbook.theme,
                    custom: String(agIdx + 1).padStart(3, '0'),
                    defaultBid: planAdGroup.defaultBid,
                    biddingStrategy: playbook.bidStrategy,
                    keywords: assignedKeywords,
                    products: [product],
                };
                newAdGroups.push(newAdGroup);
            });
        });

        onApplyPlan(newCampaigns, newAdGroups);
        setAiPlan(null);
        setEditedPlan(null);
        setSelectedProductIds([]);
    };

    const totalPlannedBudget = editedPlan?.campaigns.reduce((sum, c) => sum + c.budget, 0) || 0;

    return (
        <div className="section">
            <h2><i className="fa-solid fa-wand-magic-sparkles"></i> AI-Powered Campaign Setup</h2>
            <p className="section-description">
                Let AI analyze your products and keywords to create an optimized campaign structure with automatic keyword assignments.
            </p>

            {!aiPlan && (
                <div className="ai-setup-form">
                    <div className="form-group">
                        <label>Select Products to Advertise</label>
                        <div className="product-selector">
                            {availableProducts.length === 0 ? (
                                <p className="empty-state">No products available. Please add products first.</p>
                            ) : (
                                <div className="product-grid">
                                    {availableProducts.map(product => (
                                        <label key={product.id} className="product-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedProductIds.includes(product.id)}
                                                onChange={() => handleProductToggle(product.id)}
                                                disabled={disabled}
                                            />
                                            <span>{product.sku}</span>
                                            <span className="product-asin">{product.asin}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Total Daily Budget ($)</label>
                            <input
                                type="number"
                                min="10"
                                value={totalBudget}
                                onChange={(e) => setTotalBudget(Number(e.target.value))}
                                disabled={disabled}
                            />
                        </div>
                        <div className="form-group">
                            <label>Campaign Strategy</label>
                            <select
                                value={campaignGoal}
                                onChange={(e) => setCampaignGoal(e.target.value)}
                                disabled={disabled}
                            >
                                <option value="balanced">Balanced (Research + Performance)</option>
                                <option value="aggressive">Aggressive (Performance Focus)</option>
                                <option value="defensive">Defensive (Brand Protection)</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="error-message"><i className="fa-solid fa-circle-exclamation"></i> {error}</div>}

                    <button
                        className="button button-primary"
                        onClick={handleGeneratePlan}
                        disabled={disabled || isGenerating || selectedProductIds.length === 0 || keywords.length === 0}
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {isGenerating ? (
                            <>
                                <LoadingSpinner /> Generating AI Campaign Plan...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-wand-magic-sparkles"></i> Generate AI Campaign Plan
                            </>
                        )}
                    </button>
                </div>
            )}

            {editedPlan && (
                <div className="ai-plan-preview">
                    <div className="plan-header">
                        <h3><i className="fa-solid fa-clipboard-check"></i> AI-Generated Campaign Plan</h3>
                        <div className="plan-actions">
                            <button
                                className="button button-secondary"
                                onClick={() => {
                                    setAiPlan(null);
                                    setEditedPlan(null);
                                }}
                            >
                                <i className="fa-solid fa-times"></i> Cancel
                            </button>
                            <button
                                className="button button-success"
                                onClick={handleApprovePlan}
                                disabled={disabled || editedPlan.campaigns.length === 0}
                            >
                                <i className="fa-solid fa-check"></i> Approve & Create Campaigns
                            </button>
                        </div>
                    </div>

                    <div className="plan-summary">
                        <p>{editedPlan.summary}</p>
                        <div className="budget-summary">
                            <span>Total Planned Budget: <strong>${totalPlannedBudget.toFixed(2)}/day</strong></span>
                            <span className={totalPlannedBudget > totalBudget ? 'budget-warning' : ''}>
                                {totalPlannedBudget > totalBudget && '⚠️ Exceeds target budget'}
                            </span>
                        </div>
                    </div>

                    <div className="campaigns-list">
                        {editedPlan.campaigns.map((campaign, cIdx) => {
                            const playbook = CAMPAIGN_PLAYBOOK.find(p => p.id === campaign.playbookId);
                            return (
                                <div key={cIdx} className="campaign-card">
                                    <div className="campaign-header">
                                        <div>
                                            <h4>{playbook?.label || campaign.playbookId}</h4>
                                            <p className="campaign-product">Product: {campaign.productSku}</p>
                                            {campaign.reasoning && <p className="campaign-reasoning"><i className="fa-solid fa-lightbulb"></i> {campaign.reasoning}</p>}
                                        </div>
                                        <button
                                            className="button-icon button-danger"
                                            onClick={() => handleRemoveCampaign(cIdx)}
                                            title="Remove campaign"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                    
                                    <div className="campaign-budget">
                                        <label>Budget:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            step="0.5"
                                            value={campaign.budget}
                                            onChange={(e) => handleEditBudget(cIdx, Number(e.target.value))}
                                        />
                                        <span>/day</span>
                                    </div>

                                    <div className="ad-groups-list">
                                        {campaign.adGroups.map((adGroup, agIdx) => (
                                            <div key={agIdx} className="ad-group-card">
                                                <div className="ad-group-header">
                                                    <h5>{adGroup.name}</h5>
                                                    <div className="bid-editor">
                                                        <label>Default Bid: $</label>
                                                        <input
                                                            type="number"
                                                            min="0.1"
                                                            step="0.05"
                                                            value={adGroup.defaultBid}
                                                            onChange={(e) => handleEditBid(cIdx, agIdx, Number(e.target.value))}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="keywords-assigned">
                                                    <span className="keywords-count">{adGroup.keywordTexts.length} keywords assigned:</span>
                                                    <div className="keyword-tags">
                                                        {adGroup.keywordTexts.map((kwText, kwIdx) => (
                                                            <span key={kwIdx} className="keyword-tag">
                                                                {kwText}
                                                                <button
                                                                    className="remove-keyword"
                                                                    onClick={() => handleRemoveKeyword(cIdx, agIdx, kwText)}
                                                                    title="Remove keyword"
                                                                >
                                                                    <i className="fa-solid fa-times"></i>
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
