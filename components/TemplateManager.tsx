import React, { useState } from 'react';

interface CampaignTemplate {
    id: string;
    name: string;
    description: string;
    playbook: string;
    budget: number;
    tosPlacement: number;
    productPlacement: number;
    category: string;
}

interface AdGroupTemplate {
    id: string;
    name: string;
    description: string;
    matchType: string;
    intent: string;
    defaultBid: number;
    category: string;
}

const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
    {
        id: 'research-auto',
        name: 'Research Discovery',
        description: 'Auto campaign for discovering new keywords and customer search terms',
        playbook: 'SP | Auto | Research',
        budget: 20,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Research'
    },
    {
        id: 'branded-exact',
        name: 'Branded Defense',
        description: 'Exact match branded campaign to protect brand terms',
        playbook: 'SP | Exact | Branded',
        budget: 25,
        tosPlacement: 20,
        productPlacement: 10,
        category: 'Branded'
    },
    {
        id: 'competitor-exact',
        name: 'Competitor Conquest',
        description: 'Target competitor brand terms with exact match',
        playbook: 'SP | Exact | Competitor',
        budget: 40,
        tosPlacement: 15,
        productPlacement: 5,
        category: 'Competitor'
    },
    {
        id: 'generic-broad',
        name: 'Generic Broad Research',
        description: 'Broad match for category research and discovery',
        playbook: 'SP | Broad | Research',
        budget: 50,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Research'
    },
    {
        id: 'performance-exact',
        name: 'Performance Campaigns',
        description: 'Exact match campaigns for proven high-performing keywords',
        playbook: 'SP | Exact | Performance',
        budget: 60,
        tosPlacement: 25,
        productPlacement: 15,
        category: 'Performance'
    },
    {
        id: 'product-targeting',
        name: 'Product Targeting',
        description: 'Target competitor products and similar ASINs',
        playbook: 'SP | Product Targeting | Competitor ASINs',
        budget: 35,
        tosPlacement: 10,
        productPlacement: 20,
        category: 'Product Targeting'
    }
];

const AD_GROUP_TEMPLATES: AdGroupTemplate[] = [
    {
        id: 'exact-branded',
        name: 'Branded Exact',
        description: 'Exact match ad group for branded keywords',
        matchType: 'Exact',
        intent: 'Branded',
        defaultBid: 1.5,
        category: 'Branded'
    },
    {
        id: 'exact-competitor',
        name: 'Competitor Exact',
        description: 'Exact match for competitor brand terms',
        matchType: 'Exact',
        intent: 'Competitor',
        defaultBid: 2.0,
        category: 'Competitor'
    },
    {
        id: 'broad-generic',
        name: 'Generic Broad',
        description: 'Broad match for generic category terms',
        matchType: 'Broad',
        intent: 'Generic',
        defaultBid: 1.0,
        category: 'Generic'
    },
    {
        id: 'phrase-category',
        name: 'Category Phrase',
        description: 'Phrase match for category keywords',
        matchType: 'Phrase',
        intent: 'Category',
        defaultBid: 1.25,
        category: 'Category'
    },
    {
        id: 'exact-performance',
        name: 'High Performance Exact',
        description: 'Exact match for proven high-converting keywords',
        matchType: 'Exact',
        intent: 'Generic',
        defaultBid: 2.5,
        category: 'Performance'
    }
];

interface TemplateManagerProps {
    type: 'campaign' | 'adgroup';
    onApplyTemplate: (template: CampaignTemplate | AdGroupTemplate) => void;
    onClose: () => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({ type, onApplyTemplate, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const templates = type === 'campaign' ? CAMPAIGN_TEMPLATES : AD_GROUP_TEMPLATES;
    const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

    const filteredTemplates = templates.filter(template => {
        const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
        const matchesSearch = searchQuery === '' || 
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content template-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <i className={`fa-solid fa-${type === 'campaign' ? 'bullhorn' : 'layer-group'}`}></i>
                        {type === 'campaign' ? 'Campaign' : 'Ad Group'} Templates
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="template-filters">
                    <div className="search-bar">
                        <i className="fa-solid fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="template-grid">
                    {filteredTemplates.map(template => (
                        <div key={template.id} className="template-card">
                            <div className="template-card-header">
                                <h3>{template.name}</h3>
                                <span className="template-category">{template.category}</span>
                            </div>
                            <p className="template-description">{template.description}</p>
                            <div className="template-details">
                                {type === 'campaign' && (template as CampaignTemplate).playbook && (
                                    <>
                                        <div className="template-detail">
                                            <span className="detail-label">Playbook:</span>
                                            <span className="detail-value">{(template as CampaignTemplate).playbook}</span>
                                        </div>
                                        <div className="template-detail">
                                            <span className="detail-label">Budget:</span>
                                            <span className="detail-value">${(template as CampaignTemplate).budget}</span>
                                        </div>
                                    </>
                                )}
                                {type === 'adgroup' && (template as AdGroupTemplate).matchType && (
                                    <>
                                        <div className="template-detail">
                                            <span className="detail-label">Match Type:</span>
                                            <span className="detail-value">{(template as AdGroupTemplate).matchType}</span>
                                        </div>
                                        <div className="template-detail">
                                            <span className="detail-label">Default Bid:</span>
                                            <span className="detail-value">${(template as AdGroupTemplate).defaultBid}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <button
                                className="btn btn-primary template-apply-btn"
                                onClick={() => {
                                    onApplyTemplate(template);
                                    onClose();
                                }}
                            >
                                <i className="fa-solid fa-check"></i>
                                Use This Template
                            </button>
                        </div>
                    ))}
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="template-empty">
                        <i className="fa-solid fa-inbox"></i>
                        <p>No templates found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export { CAMPAIGN_TEMPLATES, AD_GROUP_TEMPLATES };
export type { CampaignTemplate, AdGroupTemplate };
