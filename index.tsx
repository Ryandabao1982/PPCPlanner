import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

import { styles } from './styles';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SAMPLE_SEARCH_QUERY_DATA } from './utils/constants';
import { generateBulkUploadXlsx } from './utils/helpers';
import { initialDatabase } from './database';
import { getCurrentUser, saveUser, updateLastVisit, clearUser, isUserLoggedIn, User } from './utils/userLogger';

import { CampaignCreator } from './components/CampaignCreator';
import { CampaignHierarchy } from './components/CampaignManager';
import { ProductManager } from './components/ProductManager';
import { KeywordBank } from './components/KeywordBank';
import { GoalManager } from './components/GoalManager';
import { AdGroupManager } from './components/AdGroupManager';
import { KeywordAssigner } from './components/KeywordAssigner';
import { ProductAssigner } from './components/ProductAssigner';
import { BulkActionManager } from './components/BulkActionManager';
import { PlanApprover } from './components/PlanApprover';
import { PlanHealthCheck } from './components/PlanHealthCheck';
import { PlanSummary } from './components/PlanSummary';
import { ActivityLog } from './components/ActivityLog';
import { WorkspaceManager } from './components/WorkspaceManager';
import { BidManager } from './components/BidManager';
import { SearchQueryReport } from './components/SearchQueryReport';
import { DocumentationViewer } from './components/Documentation';
import { PlanVisualizer } from './components/PlanVisualizer';
import { UserLoginModal } from './components/UserLoginModal';
import { PlanReportGenerator } from './components/PlanReportGenerator';

type View = 'DASHBOARD' | 'CAMPAIGNS' | 'AD_GROUPS' | 'KEYWORDS' | 'ASSETS' | 'GOALS' | 'BIDDING' | 'REPORTS' | 'HELP';
type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
    id: number;
    message: string;
    type: ToastType;
}
type AnimatedItem = { key: string; id: number | null };

const NAV_ITEMS: { id: View, name: string, icon: string }[] = [
    { id: 'DASHBOARD', name: 'Dashboard', icon: 'fa-solid fa-chart-pie' },
    { id: 'CAMPAIGNS', name: 'Campaigns', icon: 'fa-solid fa-bullhorn' },
    { id: 'AD_GROUPS', name: 'Ad Groups', icon: 'fa-solid fa-layer-group' },
    { id: 'KEYWORDS', name: 'Keywords', icon: 'fa-solid fa-key' },
    { id: 'ASSETS', name: 'Assets', icon: 'fa-solid fa-box-archive' },
    { id: 'GOALS', name: 'Goals', icon: 'fa-solid fa-crosshairs' },
    { id: 'BIDDING', name: 'Bidding', icon: 'fa-solid fa-gavel' },
    { id: 'REPORTS', name: 'Reports', icon: 'fa-solid fa-magnifying-glass-chart' },
    { id: 'HELP', name: 'Help & Docs', icon: 'fa-solid fa-circle-question' },
];

const SidebarNav = ({ activeView, onSelectView, user, onChangeUser }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    return (
        <nav className="sidebar-nav">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    GOOD<span>-</span>WIT
                </div>
            </div>
            <ul className="nav-list">
                {NAV_ITEMS.map(item => (
                    <li key={item.id} className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={() => onSelectView(item.id)}>
                        <i className={item.icon}></i>
                        <span>{item.name}</span>
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">
                <div className="user-profile-menu">
                    {showUserMenu && (
                        <div className="user-menu-dropdown">
                            <div className="user-menu-item" onClick={() => {
                                onChangeUser();
                                setShowUserMenu(false);
                            }}>
                                <i className="fa-solid fa-user-pen"></i>
                                <span>Change User</span>
                            </div>
                        </div>
                    )}
                    <button 
                        className="user-menu-button"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className="user-profile">
                            <img src={`https://i.pravatar.cc/40?u=${user?.username || 'User'}`} alt="User Avatar" />
                            <div className="user-info">
                                <span className="user-name">{user?.username || 'User'}</span>
                                <span className="user-title">Advertiser</span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    );
};

const Toast = ({ message, type, onClose }) => {
    const icons = {
        success: 'fa-solid fa-check-circle',
        error: 'fa-solid fa-times-circle',
        info: 'fa-solid fa-info-circle',
        warning: 'fa-solid fa-triangle-exclamation',
    };
    return (
        <div className={`toast toast-${type}`}>
            <i className={icons[type]}></i>
            <span>{message}</span>
            <button onClick={onClose} className="toast-close-btn">&times;</button>
        </div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => (
    <div className="toast-container">
        {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
    </div>
);

const Tabs = ({ tabs, activeTab, onTabClick }) => (
    <div className="tab-container">
        <nav className="tab-nav">
            {tabs.map(tab => (
                 <button key={tab.id} className={`tab-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => onTabClick(tab.id)}>
                    {tab.label}
                </button>
            ))}
        </nav>
    </div>
);

const App = () => {
  const [workspaces, setWorkspaces] = useLocalStorage('ppc-workspaces', initialDatabase);
  const [activeWorkspaceId, setActiveWorkspaceId] = useLocalStorage('ppc-activeWorkspaceId', '1721234567891');
  const [activeView, setActiveView] = useState<View>('DASHBOARD');
  const [healthIssues, setHealthIssues] = useState({ errors: [], warnings: [] });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [animatedItem, setAnimatedItem] = useState<AnimatedItem>({ key: '', id: null });
  const [activeKeywordTab, setActiveKeywordTab] = useState('bank');
  const [activeAssetTab, setActiveAssetTab] = useState('bank');
  const [targetedAdGroupId, setTargetedAdGroupId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const activeWorkspace = useMemo(() => {
    return workspaces[activeWorkspaceId] || null;
  }, [workspaces, activeWorkspaceId]);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 5000);
  }, []);

  const runHealthCheck = useCallback(() => {
      if (!activeWorkspace) {
          setHealthIssues({ errors: [], warnings: [] });
          return;
      }
      const errors: string[] = [];
      const warnings: string[] = [];
      const { campaigns, adGroups, keywords } = activeWorkspace;
      const assignedKeywordIds = new Set(adGroups.flatMap(ag => ag.keywords.map(k => k.id)));
      const unassignedKeywordsCount = keywords.filter(kw => !assignedKeywordIds.has(kw.id)).length;
      if (unassignedKeywordsCount > 0) warnings.push(`${unassignedKeywordsCount} keyword(s) in the bank are not assigned to any ad group.`);
      campaigns.forEach(campaign => {
          if (campaign.budget <= 1) warnings.push(`Campaign <code>${campaign.name}</code> has a very low daily budget ($${campaign.budget.toFixed(2)}).`);
          const campaignAdGroups = adGroups.filter(ag => ag.campaignId === campaign.id);
          if (campaignAdGroups.length === 0) {
              errors.push(`Campaign <code>${campaign.name}</code> has no ad groups.`);
          } else {
              campaignAdGroups.forEach(adGroup => {
                  if (!adGroup.keywords || adGroup.keywords.length === 0) errors.push(`Ad Group <code>${adGroup.name}</code> in campaign <code>${campaign.name}</code> has no keywords.`);
                  if (adGroup.keywords && adGroup.keywords.length > 0) {
                      const adGroupMatchType = adGroup.matchType;
                      if (adGroupMatchType) {
                          adGroup.keywords.forEach(keyword => {
                              if (keyword.matchType !== adGroupMatchType) warnings.push(`Keyword <code>${keyword.text}</code> has a mismatched type in Ad Group <code>${adGroup.name}</code>.`);
                          });
                      }
                  }
              });
          }
      });
      setHealthIssues({ errors, warnings });
  }, [activeWorkspace]);
  
  const handleRerunHealthCheck = () => {
    runHealthCheck();
    showToast("Health check complete.", "info");
    if (!activeWorkspaceId) return;
    const username = currentUser?.username || 'Unknown User';
    const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: "Plan health check re-run.", user: username };
    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);
        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                logs: newLogs,
            }
        };
    });
  };

  const handleNavigateToAdGroup = useCallback((adGroupId: number) => {
    setActiveView('AD_GROUPS');
    setTargetedAdGroupId(adGroupId);
  }, []);

  const handleSelectView = (view: View) => {
      setActiveView(view);
      setTargetedAdGroupId(null);
  };

  // User tracking initialization
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      updateLastVisit();
    } else {
      setShowLoginModal(true);
    }
  }, []);

  const handleUserLogin = (username: string) => {
    const user = saveUser(username);
    setCurrentUser(user);
    setShowLoginModal(false);
    showToast(`Welcome, ${username}!`, 'success');
  };

  const handleChangeUser = () => {
    setShowLoginModal(true);
  };

  useEffect(() => {
      if (!activeWorkspaceId && Object.keys(workspaces).length > 0) setActiveWorkspaceId(Object.keys(workspaces)[0]);
      if (Object.keys(workspaces).length === 0) setActiveWorkspaceId(null);
  }, [workspaces, activeWorkspaceId, setActiveWorkspaceId]);
  
  useEffect(() => {
      if (activeWorkspace) runHealthCheck();
  }, [activeWorkspace, runHealthCheck]);

  const setPlanFrozen = (isFrozen: boolean) => {
    if (!activeWorkspaceId) return;
    const logAction = isFrozen ? 'Plan FROZEN.' : 'Plan set to EDITABLE.';
    const username = currentUser?.username || 'Unknown User';
    const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };

    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);
        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                isFrozen,
                logs: newLogs,
            }
        };
    });
    showToast(isFrozen ? "Plan has been frozen and is ready for export." : "Plan is now editable.", "info");
};
  
  const handleCreateBrand = (brandName: string) => {
    const trimmedBrandName = brandName.trim();
    if (!trimmedBrandName) return;
    if (Object.values(workspaces).some((ws: any) => ws.brand === trimmedBrandName)) {
        showToast(`Brand "${trimmedBrandName}" already exists.`, "error");
        return;
    }
    const newId = Date.now().toString();
    const username = currentUser?.username || 'Unknown User';
    const newWorkspace = { name: trimmedBrandName, brand: trimmedBrandName, campaigns: [], products: [], keywords: [], adGroups: [], goals: [], logs: [{ id: Date.now(), timestamp: new Date().toISOString(), action: `Created brand: ${trimmedBrandName}`, user: username }], isFrozen: false, searchQueryReports: [], exportHistory: [] };
    setWorkspaces(prev => ({ ...prev, [newId]: newWorkspace }));
    setActiveWorkspaceId(newId);
    showToast(`Brand "${trimmedBrandName}" created successfully!`);
  };
  
  const handleDeleteWorkspace = (idToDelete) => {
      const brandName = workspaces[idToDelete]?.name;
      const keys = Object.keys(workspaces);
      if (keys.length <= 1) {
          setWorkspaces({});
          setActiveWorkspaceId(null);
      } else {
        const newWorkspaces = { ...workspaces };
        delete newWorkspaces[idToDelete];
        setWorkspaces(newWorkspaces);
        if (activeWorkspaceId === idToDelete) {
          setActiveWorkspaceId(Object.keys(newWorkspaces)[0]);
        }
      }
      showToast(`Brand "${brandName}" deleted.`, 'info');
  };

  const createHandler = (key: string, logMessage: string, item: any) => {
    if (!activeWorkspaceId) return;

    const itemName = Array.isArray(item) ? `${item.length} items` : (item.name || item.text || item.sku);
    const username = currentUser?.username || 'Unknown User';
    const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: `${logMessage}: ${itemName}`, user: username };

    if (!Array.isArray(item)) {
        setAnimatedItem({ key, id: item.id });
        setTimeout(() => setAnimatedItem({ key: '', id: null }), 600);
    }
    showToast(`${logMessage.replace('Created', '').replace('Added', '').trim()} added successfully!`);

    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;

        const currentItems = currentWorkspace[key] || [];
        const newItems = Array.isArray(item) ? [...currentItems, ...item] : [...currentItems, item];
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);

        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                [key]: newItems,
                logs: newLogs,
            }
        };
    });
  };
  
  const handleCreateCampaignFromPlaybook = ({ campaign, adGroup }) => {
    if (!activeWorkspaceId) return;

    const logAction = `Created campaign from playbook: ${campaign.name}`;
    const username = currentUser?.username || 'Unknown User';
    const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };

    showToast(`Campaign "${campaign.name}" created.`);
    setAnimatedItem({ key: 'campaigns', id: campaign.id });
    setTimeout(() => setAnimatedItem({ key: '', id: null }), 600);

    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;

        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                campaigns: [...currentWorkspace.campaigns, campaign],
                adGroups: [...currentWorkspace.adGroups, adGroup],
                logs: [newLog, ...(currentWorkspace.logs || [])].slice(0, 50),
            }
        };
    });
};

  const updateHandler = (key: string, logMessage: string, id: number, updates: any) => {
      if (!activeWorkspaceId) return;
      const username = currentUser?.username || 'Unknown User';
      const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: `${logMessage}: ID ${id}`, user: username };
      
      setWorkspaces(prev => {
          const currentWorkspace = prev[activeWorkspaceId];
          if (!currentWorkspace) return prev;

          const currentItems = currentWorkspace[key] || [];
          const newItems = currentItems.map(item => item.id === id ? { ...item, ...updates } : item);
          const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);

          return {
              ...prev,
              [activeWorkspaceId]: {
                  ...currentWorkspace,
                  [key]: newItems,
                  logs: newLogs,
              }
          };
      });
  };

  const deleteHandler = (key: string, logMessage: string, id: number) => {
    if (!activeWorkspaceId) return;

    let deletedItemName = '';
    const username = currentUser?.username || 'Unknown User';
    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;
        
        const currentItems = currentWorkspace[key] || [];
        const itemToDelete = currentItems.find(item => item.id === id);
        if (!itemToDelete) return prev;
        deletedItemName = itemToDelete.name || itemToDelete.text || itemToDelete.sku || 'Item';

        const newItems = currentItems.filter(item => item.id !== id);
        
        const logAction = `${logMessage}: ${deletedItemName}`;
        const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);

        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                [key]: newItems,
                logs: newLogs,
            }
        };
    });
    showToast(`${deletedItemName} deleted.`, 'info');
  };
  
  const handleBulkAssignKeywords = (keywordIds: number[], adGroupIds: number[]) => {
    if (adGroupIds.length === 0 || !activeWorkspaceId) return;

    const username = currentUser?.username || 'Unknown User';
    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;
        
        const keywordsToAssign = currentWorkspace.keywords.filter(k => keywordIds.includes(k.id));
        if (keywordsToAssign.length === 0) return prev;

        const targetAdGroups = currentWorkspace.adGroups.filter(ag => adGroupIds.includes(ag.id));
        if (targetAdGroups.length === 0) return prev;

        const newAdGroups = currentWorkspace.adGroups.map(ag => {
            if (adGroupIds.includes(ag.id)) {
                const adGroupMatchType = ag.matchType;
                
                const existingKwIds = new Set((ag.keywords || []).map(k => k.id));
                const newKeywordsForGroup = keywordsToAssign
                    .filter(k => !existingKwIds.has(k.id))
                    .map(keyword => ({ ...keyword, matchType: adGroupMatchType }));
                return { ...ag, keywords: [...(ag.keywords || []), ...newKeywordsForGroup] };
            }
            return ag;
        });

        const adGroupNames = targetAdGroups.map(ag => ag.name).slice(0, 2).join(', ');
        const adGroupNamesDisplay = targetAdGroups.length > 2 ? `${adGroupNames}...` : adGroupNames;
        const logAction = `Bulk assigned ${keywordIds.length} keywords to ${adGroupIds.length} ad group(s): "${adGroupNamesDisplay}"`;
        const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);

        showToast(`${keywordIds.length} keywords assigned to ${adGroupIds.length} ad group(s).`);
        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                adGroups: newAdGroups,
                logs: newLogs
            }
        };
    });
  };

  const handleBulkUnassignKeywords = (keywordIds: number[], adGroupIds: number[]) => {
      if (adGroupIds.length === 0 || !activeWorkspaceId) return;

      const username = currentUser?.username || 'Unknown User';
      setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;

        const targetAdGroups = currentWorkspace.adGroups.filter(ag => adGroupIds.includes(ag.id));
        const adGroupNames = targetAdGroups.map(ag => ag.name).slice(0, 2).join(', ');
        const adGroupNamesDisplay = targetAdGroups.length > 2 ? `${adGroupNames}...` : adGroupNames;

        const newAdGroups = currentWorkspace.adGroups.map(ag => {
            if (adGroupIds.includes(ag.id)) {
                const filteredKeywords = (ag.keywords || []).filter(k => !keywordIds.includes(k.id));
                return { ...ag, keywords: filteredKeywords };
            }
            return ag;
        });
        
        const logAction = `Bulk unassigned ${keywordIds.length} keywords from ${adGroupIds.length} ad group(s): "${adGroupNamesDisplay}"`;
        const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);

        showToast(`${keywordIds.length} keywords unassigned from ${adGroupIds.length} ad group(s).`, 'info');
        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                adGroups: newAdGroups,
                logs: newLogs
            }
        };
      });
  };
  
  const handleBulkAssignProducts = (productIds: number[], adGroupId: number | null) => {
    if (!adGroupId || !activeWorkspaceId) return;

    const username = currentUser?.username || 'Unknown User';
    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;

        const productsToAssign = currentWorkspace.products.filter(p => productIds.includes(p.id));
        if (productsToAssign.length === 0) return prev;

        const newAdGroups = currentWorkspace.adGroups.map(ag => {
            if (ag.id === adGroupId) {
                const existingProductIds = new Set((ag.products || []).map(p => p.id));
                const newProductsForGroup = productsToAssign.filter(p => !existingProductIds.has(p.id));
                return { ...ag, products: [...(ag.products || []), ...newProductsForGroup] };
            }
            return ag;
        });

        const adGroupName = newAdGroups.find(ag => ag.id === adGroupId)?.name;
        const logAction = `Assigned ${productIds.length} products to Ad Group "${adGroupName}"`;
        const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);

        showToast(`${productIds.length} products assigned to ${adGroupName}.`);
        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                adGroups: newAdGroups,
                logs: newLogs
            }
        };
    });
  };

  const handleBulkUnassignProducts = (productIds: number[], adGroupId: number | null) => {
      if (!adGroupId || !activeWorkspaceId) return;

      const username = currentUser?.username || 'Unknown User';
      setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;

        const adGroupName = currentWorkspace.adGroups.find(ag => ag.id === adGroupId)?.name;
        const newAdGroups = currentWorkspace.adGroups.map(ag => {
            if (ag.id === adGroupId) {
                const filteredProducts = (ag.products || []).filter(p => !productIds.includes(p.id));
                return { ...ag, products: filteredProducts };
            }
            return ag;
        });
        
        const logAction = `Unassigned ${productIds.length} products from Ad Group "${adGroupName}"`;
        const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);

        showToast(`${productIds.length} products unassigned from ${adGroupName}.`, 'info');
        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                adGroups: newAdGroups,
                logs: newLogs
            }
        };
      });
  };
  
  const handleBulkUpdateKeywords = (ids: number[], updates: any) => {
    if (!activeWorkspaceId) return;
    const logAction = `Bulk updated ${ids.length} keywords.`;
    const username = currentUser?.username || 'Unknown User';
    const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };

    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;

        const newKeywords = currentWorkspace.keywords.map(kw => ids.includes(kw.id) ? { ...kw, ...updates } : kw);
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);
        showToast(`Bulk updated ${ids.length} keywords.`);
        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                keywords: newKeywords,
                logs: newLogs
            }
        };
    });
  };

  const handleBulkDeleteKeywords = (ids: number[]) => {
      if (!activeWorkspaceId) return;
      const logAction = `Bulk deleted ${ids.length} keywords.`;
      const username = currentUser?.username || 'Unknown User';
      const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };

      setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;

        const newKeywords = currentWorkspace.keywords.filter(kw => !ids.includes(kw.id));
        const newAdGroups = currentWorkspace.adGroups.map(ag => ({ ...ag, keywords: (ag.keywords || []).filter(kw => !ids.includes(kw.id)) }));
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);
        showToast(`Bulk deleted ${ids.length} keywords.`, 'info');
        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                keywords: newKeywords,
                adGroups: newAdGroups,
                logs: newLogs
            }
        };
    });
  };

  const handleDeleteCampaign = (id: number) => {
      if (!activeWorkspaceId) return;
      let deletedCampaignName = '';
      const username = currentUser?.username || 'Unknown User';
      setWorkspaces(prev => {
          const currentWorkspace = prev[activeWorkspaceId];
          if (!currentWorkspace) return prev;

          const campaignToDelete = currentWorkspace.campaigns.find(c => c.id === id);
          if (!campaignToDelete) return prev;
          deletedCampaignName = campaignToDelete.name || 'Campaign';
          const newCampaigns = currentWorkspace.campaigns.filter(c => c.id !== id);
          const newAdGroups = currentWorkspace.adGroups.filter(ag => ag.campaignId !== id);
          const newGoals = currentWorkspace.goals.filter(g => g.campaignId !== id);

          const logAction = `Deleted campaign: ${deletedCampaignName}`;
          const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };
          const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);
          
          return {
              ...prev,
              [activeWorkspaceId]: {
                  ...currentWorkspace,
                  campaigns: newCampaigns,
                  adGroups: newAdGroups,
                  goals: newGoals,
                  logs: newLogs,
              }
          };
      });
      showToast(`${deletedCampaignName} and all its contents deleted.`, 'info');
  };
  
  const handleExport = () => {
    if (!activeWorkspace || !activeWorkspace.isFrozen) {
        showToast("Please freeze the plan before exporting.", "error");
        return;
    }
    
    try {
        const exportFileDefaultName = `${activeWorkspace.name.replace(/\s/g, '_')}_Bulk_Upload.xlsx`;
        generateBulkUploadXlsx(activeWorkspace, exportFileDefaultName);
        
        const newHistoryEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            fileName: exportFileDefaultName,
            planData: JSON.parse(JSON.stringify(activeWorkspace))
        };

        const username = currentUser?.username || 'Unknown User';
        const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: 'Exported plan for bulk upload.', user: username };
        setWorkspaces(prev => {
            const currentWorkspace = prev[activeWorkspaceId];
            if (!currentWorkspace) return prev;
            const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);
            const newHistory = [...(currentWorkspace.exportHistory || []), newHistoryEntry].slice(-10);

            showToast('Plan data exported as a Bulksheets 2.0 file!');
            return {
                ...prev,
                [activeWorkspaceId]: {
                    ...currentWorkspace,
                    logs: newLogs,
                    exportHistory: newHistory
                }
            };
        });
    } catch (error) {
        console.error("Export failed:", error);
        showToast("An error occurred during export. See console for details.", "error");
    }
  };
  
  const handleRedownload = (historyEntry) => {
    if (!historyEntry || !historyEntry.planData || !historyEntry.fileName) {
        showToast("Could not redownload. History data is corrupted.", "error");
        return;
    }
    try {
        generateBulkUploadXlsx(historyEntry.planData, historyEntry.fileName);
        showToast(`Successfully re-downloaded "${historyEntry.fileName}"!`, "success");
    } catch (error) {
        console.error("Redownload failed:", error);
        showToast("An error occurred during redownload.", "error");
    }
  };

  const handleImportSearchQueries = () => {
    if (!activeWorkspaceId) return;
    const logAction = `Imported ${SAMPLE_SEARCH_QUERY_DATA.length} sample search queries.`;
    const username = currentUser?.username || 'Unknown User';
    const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };
    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;
        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                searchQueryReports: SAMPLE_SEARCH_QUERY_DATA,
                logs: [newLog, ...(currentWorkspace.logs || [])].slice(0, 50)
            }
        };
    });
    showToast(`Imported ${SAMPLE_SEARCH_QUERY_DATA.length} sample search queries.`, 'info');
  };

  const handleAddSearchQueriesAsKeywords = (queries, newKeywords) => {
    if (!activeWorkspaceId) return;
    const logAction = `Converted ${newKeywords.length} search queries to keywords.`;
    const username = currentUser?.username || 'Unknown User';
    const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };

    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;

        const updatedReports = currentWorkspace.searchQueryReports.map(reportItem => {
            const wasQueryConverted = queries.some(q => q.id === reportItem.id);
            return wasQueryConverted ? { ...reportItem, status: 'added_as_keyword' } : reportItem;
        });

        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                keywords: [...currentWorkspace.keywords, ...newKeywords],
                searchQueryReports: updatedReports,
                logs: [newLog, ...(currentWorkspace.logs || [])].slice(0, 50)
            }
        };
    });
    showToast(`Added ${newKeywords.length} new keywords to the bank.`);
  };

  const handleReportGenerated = (reportData: any) => {
    if (!activeWorkspaceId) return;
    const username = currentUser?.username || 'Unknown User';
    const logAction = `Generated AI plan report for brand presentation`;
    const newLog = { id: Date.now(), timestamp: new Date().toISOString(), action: logAction, user: username };

    setWorkspaces(prev => {
        const currentWorkspace = prev[activeWorkspaceId];
        if (!currentWorkspace) return prev;
        
        const newLogs = [newLog, ...(currentWorkspace.logs || [])].slice(0, 50);
        // Only retain the 10 most recent reports for performance and UI clarity.
        // This prevents excessive memory usage and keeps the report history manageable for users.
        const reportHistory = [...(currentWorkspace.reportHistory || []), reportData].slice(-10);

        return {
            ...prev,
            [activeWorkspaceId]: {
                ...currentWorkspace,
                logs: newLogs,
                reportHistory
            }
        };
    });
    showToast('AI report generated successfully!', 'success');
  };

  const isFrozen = activeWorkspace?.isFrozen || false;
  const currentViewTitle = NAV_ITEMS.find(item => item.id === activeView)?.name || 'Dashboard';

  const renderContent = () => {
    if (!activeWorkspace && activeView !== 'HELP') {
        return (
            <div className="welcome-screen">
                <i className="fa-solid fa-rocket welcome-icon"></i>
                <h1>Welcome to the Good-Wit Commerce PPC Planner!</h1>
                <p className="welcome-subtitle">Streamline your campaign creation from strategy to export.</p>
                
                <div className="welcome-guide">
                    <h3>Getting Started Guide:</h3>
                    <ol className="welcome-steps">
                        <li>
                            <strong>1. Create a Brand Workspace</strong>
                            <p>Use the input in the header to define a brand. Each brand is a separate workspace for your plans.</p>
                        </li>
                        <li>
                            <strong>2. Build Your Campaigns</strong>
                            <p>Use the naming convention generators to create structured campaigns and ad groups.</p>
                        </li>
                        <li>
                            <strong>3. Manage Keywords & Assets</strong>
                            <p>Populate your keyword bank, add product ASINs, and assign them to the correct ad groups.</p>
                        </li>
                        <li>
                            <strong>4. Review and Export</strong>
                            <p>Run the health check, freeze the plan to prevent changes, and export your data.</p>
                        </li>
                    </ol>
                </div>

                <p className="welcome-cta"><strong>Ready?</strong> Create your first brand in the header to begin!</p>
            </div>
        );
    }
      
    switch (activeView) {
        case 'DASHBOARD':
            return (
                <div className="dashboard-grid">
                    <div className="dashboard-main">
                        <PlanSummary workspace={activeWorkspace} goals={activeWorkspace.goals} />
                        <PlanReportGenerator 
                            workspace={activeWorkspace} 
                            disabled={isFrozen}
                            onReportGenerated={handleReportGenerated}
                        />
                    </div>
                    <div className="dashboard-sidebar">
                        <PlanApprover 
                            isFrozen={isFrozen} 
                            onFreeze={() => setPlanFrozen(true)} 
                            onUnfreeze={() => setPlanFrozen(false)} 
                            onExport={handleExport}
                            exportHistory={activeWorkspace.exportHistory || []}
                            onRedownload={handleRedownload}
                        />
                        <PlanVisualizer campaigns={activeWorkspace.campaigns} adGroups={activeWorkspace.adGroups} />
                        <PlanHealthCheck issues={healthIssues} onRerun={handleRerunHealthCheck} />
                        <ActivityLog logs={activeWorkspace.logs}/>
                    </div>
                </div>
            );
        case 'CAMPAIGNS':
            return (
                <div className="campaign-view-grid">
                    <CampaignCreator 
                        onAddCampaignFromPlaybook={handleCreateCampaignFromPlaybook}
                        campaigns={activeWorkspace.campaigns} 
                        products={activeWorkspace.products}
                        disabled={isFrozen} 
                        workspaceBrand={activeWorkspace.brand} 
                    />
                    <CampaignHierarchy 
                        campaigns={activeWorkspace.campaigns} 
                        adGroups={activeWorkspace.adGroups}
                        onUpdate={(id, u) => updateHandler('campaigns', 'Updated campaign', id, u)} 
                        onDelete={handleDeleteCampaign} 
                        disabled={isFrozen} 
                        animatedItemId={animatedItem.key === 'campaigns' ? animatedItem.id : null}
                        onUpdateAdGroupItems={(id, items, type) => updateHandler('adGroups', 'Updated ad group items', id, { [type]: items })}
                        onNavigateToAdGroup={handleNavigateToAdGroup}
                    />
                </div>
            );
        case 'AD_GROUPS':
             return <AdGroupManager 
                adGroups={activeWorkspace.adGroups} 
                campaigns={activeWorkspace.campaigns} 
                onAdd={(ag) => createHandler('adGroups', 'Created ad group', ag)} 
                onUpdate={(id, u) => updateHandler('adGroups', 'Updated ad group', id, u)} 
                onDelete={(id) => deleteHandler('adGroups', 'Deleted ad group', id)} 
                disabled={isFrozen} 
                animatedItemId={animatedItem.key === 'adGroups' ? animatedItem.id : null} 
                targetedAdGroupId={targetedAdGroupId}
                onClearTargetedAdGroup={() => setTargetedAdGroupId(null)}
            />;
        case 'KEYWORDS':
            const keywordTabs = [
                {id: 'bank', label: 'Keyword Bank'},
                {id: 'assigner', label: 'Keyword Assigner'},
                {id: 'bulk', label: 'Bulk Actions'},
            ];
            return (
                <>
                    <Tabs tabs={keywordTabs} activeTab={activeKeywordTab} onTabClick={setActiveKeywordTab} />
                    {activeKeywordTab === 'bank' && <KeywordBank keywords={activeWorkspace.keywords} onAdd={(kws) => createHandler('keywords', 'Added keywords', kws)} onUpdate={(id, u) => updateHandler('keywords', 'Updated keyword', id, u)} onDelete={(id) => deleteHandler('keywords', 'Deleted keyword', id)} disabled={isFrozen} showToast={showToast} />}
                    {activeKeywordTab === 'assigner' && <KeywordAssigner keywords={activeWorkspace.keywords} adGroups={activeWorkspace.adGroups} campaigns={activeWorkspace.campaigns} onBulkAssign={handleBulkAssignKeywords} onBulkUnassign={handleBulkUnassignKeywords} disabled={isFrozen} />}
                    {activeKeywordTab === 'bulk' && <BulkActionManager keywords={activeWorkspace.keywords} onBulkUpdate={handleBulkUpdateKeywords} onBulkDelete={handleBulkDeleteKeywords} disabled={isFrozen} />}
                </>
            );
        case 'ASSETS':
            const assetTabs = [
                { id: 'bank', label: 'Product Bank' },
                { id: 'assigner', label: 'Product Assigner' },
            ];
            return (
                <>
                    <Tabs tabs={assetTabs} activeTab={activeAssetTab} onTabClick={setActiveAssetTab} />
                    {activeAssetTab === 'bank' && <ProductManager products={activeWorkspace.products} onAdd={(p) => createHandler('products', 'Added product', p)} onUpdate={(id, u) => updateHandler('products', 'Updated product', id, u)} onDelete={(id) => deleteHandler('products', 'Deleted product', id)} disabled={isFrozen} animatedItemId={animatedItem.key === 'products' ? animatedItem.id : null} />}
                    {activeAssetTab === 'assigner' && <ProductAssigner products={activeWorkspace.products} adGroups={activeWorkspace.adGroups} campaigns={activeWorkspace.campaigns} onBulkAssign={handleBulkAssignProducts} onBulkUnassign={handleBulkUnassignProducts} disabled={isFrozen} />}
                </>
            );
        case 'GOALS':
             return <GoalManager goals={activeWorkspace.goals} campaigns={activeWorkspace.campaigns} onAdd={(g) => createHandler('goals', 'Added goal', g)} onUpdate={(id, u) => updateHandler('goals', 'Updated goal', id, u)} onDelete={(id) => deleteHandler('goals', 'Deleted goal', id)} disabled={isFrozen} animatedItemId={animatedItem.key === 'goals' ? animatedItem.id : null}/>;
        case 'BIDDING':
            return <BidManager adGroups={activeWorkspace.adGroups} campaigns={activeWorkspace.campaigns} onUpdateAdGroupItems={(id, items, type) => updateHandler('adGroups', 'Updated ad group items', id, { [type]: items })} disabled={isFrozen} />;
        case 'REPORTS':
            return <SearchQueryReport reports={activeWorkspace.searchQueryReports || []} onImport={handleImportSearchQueries} onAddAsKeywords={handleAddSearchQueriesAsKeywords} disabled={isFrozen} />;
        case 'HELP':
            return <DocumentationViewer />;
        default: return null;
    }
  }
  
  const headerTitle = activeView === 'HELP' ? 'Help & Documentation' : `${activeWorkspace?.name || 'No Brand Selected'}: ${currentViewTitle}`;

  return (
    <>
      <style>{styles}</style>
      {showLoginModal && <UserLoginModal onLogin={handleUserLogin} />}
      <div className="app-container">
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <SidebarNav activeView={activeView} onSelectView={handleSelectView} user={currentUser} onChangeUser={handleChangeUser} />
        <main className="main-content">
            <header className="main-header">
                <h1>{headerTitle}</h1>
                {activeView !== 'HELP' && <WorkspaceManager workspaces={workspaces} activeWorkspaceId={activeWorkspaceId} onSelect={setActiveWorkspaceId} onCreate={handleCreateBrand} onDelete={handleDeleteWorkspace} />}
            </header>
            <div className="content-area">
              {renderContent()}
            </div>
        </main>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);