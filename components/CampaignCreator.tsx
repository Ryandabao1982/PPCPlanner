import React, { useMemo, useReducer, useEffect } from 'react';
import { CAMPAIGN_PLAYBOOK } from '../utils/constants';
import { getYYYYMM } from '../utils/helpers';

interface Campaign {
    name: string;
}

interface Product {
    id: number;
    sku: string;
    asin: string;
}

interface CampaignCreatorProps {
    onAddCampaignFromPlaybook: (data: { campaign: any, adGroup: any }) => void;
    campaigns: Campaign[];
    products: Product[];
    disabled: boolean;
    workspaceBrand: string;
}

const initialFormState = {
  selectedProductId: '' as number | string,
  playbookId: CAMPAIGN_PLAYBOOK[0].id,
  budget: 10,
  competitorAsins: '',
};

function formReducer(state: typeof initialFormState, action: { type: string; payload: any }) {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.payload.name]: action.payload.value };
        case 'RESET_PRODUCT':
             return { ...state, selectedProductId: action.payload };
        default:
            return state;
    }
}

export const CampaignCreator: React.FC<CampaignCreatorProps> = ({ onAddCampaignFromPlaybook, campaigns, products, disabled, workspaceBrand }) => {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  useEffect(() => {
      if (products.length > 0 && !products.some(p => p.id === formState.selectedProductId)) {
          dispatch({ type: 'RESET_PRODUCT', payload: products[0].id });
      } else if (products.length === 0) {
          dispatch({ type: 'RESET_PRODUCT', payload: '' });
      }
  }, [products, formState.selectedProductId]);
  
  const selectedPlaybook = useMemo(() => {
      return CAMPAIGN_PLAYBOOK.find(p => p.id === formState.playbookId);
  }, [formState.playbookId]);

  const { campaignName, isValid, validationError } = useMemo(() => {
    const { selectedProductId, playbookId } = formState;
    const selectedProduct = products.find(p => p.id === Number(selectedProductId));
    const playbookEntry = CAMPAIGN_PLAYBOOK.find(p => p.id === playbookId);

    if (!selectedProduct || !playbookEntry) {
        return { campaignName: 'Select a product and playbook type to generate a campaign.', isValid: false, validationError: null };
    }
    
    const asinName = selectedProduct.sku;
    const yyyymm = getYYYYMM();
    
    const newCampaignName = `${workspaceBrand}_${playbookEntry.country}_${asinName}_${playbookEntry.campaignType}_${playbookEntry.funnelStage}_${yyyymm}`;

    const isUnique = !campaigns.some(c => c.name === newCampaignName);
    
    let error = null;
    if (!isUnique) {
      error = 'A campaign with this exact name already exists.';
    } else if (playbookEntry.match === 'PT') {
        const asins = formState.competitorAsins.split('\n').map(a => a.trim()).filter(Boolean);
        if (asins.length === 0) {
            error = 'At least one competitor ASIN is required for Product Targeting campaigns.';
        } else {
            const invalidAsin = asins.find(asin => !/^[B][0][A-Z0-9]{8}$/.test(asin));
            if (invalidAsin) {
                error = `Invalid ASIN format: "${invalidAsin}". Must be B0 followed by 8 alphanumeric characters.`;
            }
        }
    }
    
    const newIsValid = !!(workspaceBrand && selectedProductId && playbookId && formState.budget > 0 && isUnique && !error);

    return { campaignName: newCampaignName, isValid: newIsValid, validationError: error };
  }, [formState, workspaceBrand, products, campaigns]);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_FIELD', payload: { name, value } });
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'UPDATE_FIELD', payload: { name: 'budget', value: parseFloat(e.target.value) || 1 } });
  };

  const handleAdd = () => {
    if (isValid) {
      const selectedProduct = products.find(p => p.id === Number(formState.selectedProductId));
      const playbookEntry = CAMPAIGN_PLAYBOOK.find(p => p.id === formState.playbookId);

      const productTargets = playbookEntry.match === 'PT' 
        ? formState.competitorAsins.split('\n').map(asin => asin.trim()).filter(Boolean)
        : [];

      const newCampaign = {
        id: Date.now(),
        name: campaignName,
        brand: workspaceBrand,
        country: playbookEntry.country,
        type: playbookEntry.type,
        match: playbookEntry.match,
        theme: playbookEntry.theme,
        budget: formState.budget,
        placementTop: playbookEntry.tosModifier || 0,
        placementProduct: 0, 
      };

      const newAdGroup = {
        id: Date.now() + 1,
        campaignId: newCampaign.id,
        name: `${workspaceBrand}_${playbookEntry.country}_${playbookEntry.match}_${playbookEntry.theme}_001`,
        matchType: playbookEntry.match,
        intent: playbookEntry.theme,
        custom: '001',
        defaultBid: playbookEntry.defaultBid,
        biddingStrategy: playbookEntry.bidStrategy,
        keywords: [],
        products: [selectedProduct],
        productTargets: productTargets,
      };
      
      onAddCampaignFromPlaybook({ campaign: newCampaign, adGroup: newAdGroup });
    }
  };

  return (
    <div className="section">
      <h2>Campaign Generator</h2>
      <div>
        <div className="form-grid" style={{gridTemplateColumns: '1fr'}}>
          <div className="form-group">
            <label>Playbook Campaign Type</label>
            <select name="playbookId" value={formState.playbookId} onChange={handleChange} disabled={disabled}>
              {CAMPAIGN_PLAYBOOK.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            {selectedPlaybook?.description && (
                <div className="playbook-description" style={{ marginTop: '0.5rem' }}>
                    <i className="fa-solid fa-circle-info"></i>
                    <span>{selectedPlaybook.description}</span>
                </div>
            )}
          </div>
          <div className="form-group">
            <label>Product (SKU)</label>
            <select name="selectedProductId" value={formState.selectedProductId} onChange={handleChange} disabled={disabled || products.length === 0}>
              <option value="" disabled>
                {products.length === 0 ? 'No products in bank' : 'Select a Product'}
              </option>
              {products.map(p => <option key={p.id} value={p.id}>{p.sku}</option>)}
            </select>
          </div>
          {selectedPlaybook?.match === 'PT' && (
             <div className="form-group">
                <label>Competitor ASINs (one per line)</label>
                <textarea 
                  name="competitorAsins" 
                  value={formState.competitorAsins} 
                  onChange={handleChange} 
                  disabled={disabled}
                  placeholder="B0..."
                  rows={4}
                />
            </div>
          )}
          <div className="form-group">
            <label>Daily Budget</label>
            <input type="number" min="1" value={formState.budget} onChange={handleBudgetChange} disabled={disabled} />
          </div>
        </div>
        <div className="preview-container">
          <div className="preview-header">
            <div className="preview-title">Campaign Name Preview</div>
            <div className={`status-badge ${isValid ? 'status-valid' : 'status-invalid'}`}>{isValid ? 'Valid' : 'Invalid'}</div>
          </div>
          <div className="preview-name">{campaignName}</div>
        </div>
        {validationError && <div className="validation-error">{validationError}</div>}
        <button className="button" onClick={handleAdd} disabled={!isValid || disabled} style={{width: '100%'}}>Add Campaign from Playbook</button>
      </div>
    </div>
  );
};