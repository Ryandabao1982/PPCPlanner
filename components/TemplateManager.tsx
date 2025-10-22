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
        id: 'sp-auto-research',
        name: 'SP | Auto | Research',
        description: 'Auto campaign for discovering new keywords and customer search terms. Budget: 5-10% of total.',
        playbook: 'SP_AUTO_RESEARCH',
        budget: 20,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Research'
    },
    {
        id: 'sp-broad-research',
        name: 'SP | Broad | Research',
        description: 'Broad match for keyword discovery. Max 50 keywords per ad group. Budget: 10-15%.',
        playbook: 'SP_BROAD_RESEARCH',
        budget: 30,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Research'
    },
    {
        id: 'sp-phrase-research',
        name: 'SP | Phrase | Research',
        description: 'Phrase match for discovery while maintaining relevance. Max 50 keywords per ad group.',
        playbook: 'SP_PHRASE_RESEARCH',
        budget: 30,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Research'
    },
    {
        id: 'sp-exact-performance',
        name: 'SP | Exact | Performance',
        description: 'Exact match campaigns for proven high-performing keywords. Max 15 keywords per ad group. TOS modifier: +20%.',
        playbook: 'SP_EXACT_PERFORMANCE',
        budget: 60,
        tosPlacement: 20,
        productPlacement: 0,
        category: 'Performance'
    },
    {
        id: 'sp-exact-skag',
        name: 'SP | Exact | SKAG',
        description: 'Single Keyword Ad Groups for maximum control. 1 keyword per ad group. TOS modifier: +30%.',
        playbook: 'SP_EXACT_SKAG',
        budget: 25,
        tosPlacement: 30,
        productPlacement: 0,
        category: 'Performance'
    },
    {
        id: 'sp-branded',
        name: 'SP | Branded | Defense',
        description: 'Protect brand terms with Exact + Phrase match. Budget ≤ 10%.',
        playbook: 'SP_BRANDED_UMBRELLA',
        budget: 25,
        tosPlacement: 50,
        productPlacement: 0,
        category: 'Branded'
    },
    {
        id: 'sp-competitor-exact',
        name: 'SP | Exact | Competitor',
        description: 'Target competitor brand terms with exact match.',
        playbook: 'SP_EXACT_COMP',
        budget: 40,
        tosPlacement: 15,
        productPlacement: 0,
        category: 'Competitor'
    },
    {
        id: 'sp-pt-branded',
        name: 'SP | Product Targeting | Branded',
        description: 'Defend your own product detail pages by showing ads on your product pages.',
        playbook: 'SP_PT_BRANDED',
        budget: 20,
        tosPlacement: 0,
        productPlacement: 20,
        category: 'Product Targeting'
    },
    {
        id: 'sp-pt-competitor',
        name: 'SP | Product Targeting | Competitor',
        description: 'Target competitor product detail pages to capture their traffic.',
        playbook: 'SP_PT_COMP_ASIN',
        budget: 35,
        tosPlacement: 0,
        productPlacement: 25,
        category: 'Product Targeting'
    },
    {
        id: 'sp-pt-category',
        name: 'SP | Product Targeting | Category',
        description: 'Target entire categories to reach broad but relevant audiences.',
        playbook: 'SP_PT_CATEGORY',
        budget: 25,
        tosPlacement: 0,
        productPlacement: 15,
        category: 'Product Targeting'
    },
    {
        id: 'sp-pt-crosssell',
        name: 'SP | Product Targeting | Cross-Sell',
        description: 'Target complementary products to encourage bundle purchases.',
        playbook: 'SP_PT_CROSSELL',
        budget: 25,
        tosPlacement: 0,
        productPlacement: 15,
        category: 'Product Targeting'
    },
    {
        id: 'sb-exact-branded',
        name: 'SB | Exact | Branded',
        description: 'Dominate top of search for brand terms. Requires creative asset.',
        playbook: 'SB_EXACT_BRANDED',
        budget: 30,
        tosPlacement: 15,
        productPlacement: 0,
        category: 'Sponsored Brands'
    },
    {
        id: 'sb-exact-comp',
        name: 'SB | Exact | Competitor',
        description: 'Showcase your brand when customers search for competitors. Requires creative.',
        playbook: 'SB_EXACT_COMP',
        budget: 30,
        tosPlacement: 10,
        productPlacement: 0,
        category: 'Sponsored Brands'
    },
    {
        id: 'sb-broad-research',
        name: 'SB | Broad | Research',
        description: 'Broad-term keyword discovery for brand awareness. Requires creative.',
        playbook: 'SB_BROAD_RESEARCH',
        budget: 25,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Sponsored Brands'
    },
    {
        id: 'sb-video-awareness',
        name: 'SB | Video | Awareness',
        description: 'Video campaigns for brand awareness. Must use video creative.',
        playbook: 'SB_VIDEO_AWARENESS',
        budget: 30,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Sponsored Brands'
    },
    {
        id: 'sb-store-traffic',
        name: 'SB | Store | Traffic',
        description: 'Drive traffic to Amazon Brand Store. Requires Brand Store link.',
        playbook: 'SB_STORE_TRAFFIC',
        budget: 25,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Sponsored Brands'
    },
    {
        id: 'sd-remarketing-views',
        name: 'SD | Remarketing | Product Views',
        description: 'Retarget shoppers who viewed products but did not purchase.',
        playbook: 'SD_REMARKETING_VIEWS',
        budget: 20,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Sponsored Display'
    },
    {
        id: 'sd-remarketing-cart',
        name: 'SD | Remarketing | Cart',
        description: 'Target high-intent shoppers who added to cart but did not purchase.',
        playbook: 'SD_REMARKETING_CART',
        budget: 25,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Sponsored Display'
    },
    {
        id: 'sd-audience-inmarket',
        name: 'SD | Audience | In-Market',
        description: 'Reach shoppers actively browsing your product category.',
        playbook: 'SD_AUDIENCE_INMARKET',
        budget: 15,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Sponsored Display'
    },
    {
        id: 'sd-pt-competitor',
        name: 'SD | Product Targeting | Competitor',
        description: 'Target competitor product detail pages with display ads.',
        playbook: 'SD_PT_COMP',
        budget: 20,
        tosPlacement: 0,
        productPlacement: 0,
        category: 'Sponsored Display'
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
