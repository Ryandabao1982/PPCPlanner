export const styles = `
  :root {
    --bg-color: #f8f9fa;
    --surface-color: #ffffff;
    --surface-color-2: #e9ecef;
    --primary-color: #007bff;
    --primary-variant-color: #0056b3;
    --text-color: #212529;
    --text-color-secondary: #6c757d;
    --border-color: #dee2e6;
    --error-color: #dc3545;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --accent-color: #007bff;
    --border-radius: 8px;
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes toastIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  * {
    box-sizing: border-box;
  }

  body {
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: var(--font-family);
    font-weight: 400;
  }

  #root {
    width: 100%;
    height: 100vh;
  }

  /* Main Layout */
  .app-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .sidebar-nav {
    width: 250px;
    background-color: var(--surface-color);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    box-sizing: border-box;
    flex-shrink: 0;
    box-shadow: 2px 0 5px rgba(0,0,0,0.05);
  }

  .main-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2.5rem;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
    background-color: var(--surface-color);
    flex-wrap: wrap;
    gap: 1rem;
  }

  .main-header h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
  }

  .content-area {
    padding: 2.5rem;
    overflow-y: auto;
    flex-grow: 1;
    background-color: var(--bg-color);
    animation: fadeIn 0.5s ease-in-out;
  }
  .content-area::-webkit-scrollbar { width: 8px; }
  .content-area::-webkit-scrollbar-track { background: var(--surface-color-2); }
  .content-area::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
  .content-area::-webkit-scrollbar-thumb:hover { background: var(--text-color-secondary); }


  /* Sidebar Navigation */
  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
    padding: 0 0.5rem 1.5rem 0.5rem;
  }

  .sidebar-logo {
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--text-color);
  }
  .sidebar-logo span {
    color: var(--primary-color);
  }

  .nav-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.25rem; }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 500;
    color: var(--text-color-secondary);
    transition: background-color 0.2s, color 0.2s;
    border: 1px solid transparent;
  }
  .nav-item:hover { background-color: var(--surface-color-2); color: var(--text-color); }
  .nav-item.active {
    background-color: var(--primary-color);
    color: var(--surface-color);
    font-weight: 600;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
  }
  .nav-item i { width: 20px; text-align: center; }
  .sidebar-footer { margin-top: auto; }
  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 0.5rem;
    border-top: 1px solid var(--border-color);
  }
  .user-profile img { width: 40px; height: 40px; border-radius: 50%; }
  .user-info { display: flex; flex-direction: column; }
  .user-name { font-weight: 700; color: var(--text-color); }
  .user-title { font-size: 0.8rem; color: var(--text-color-secondary); }


  /* General Components */
  .section {
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    margin-bottom: 2.5rem;
    overflow: hidden;
    transition: box-shadow 0.2s;
    animation: fadeInUp 0.5s ease-out;
  }
  .section:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
  .section:last-child { margin-bottom: 0; }

  .section-header-with-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }
  .section-header-with-action h2 {
    padding: 0;
    border-bottom: none;
    margin: 0;
    font-size: 1.1rem;
  }
  .section-header-with-action .button {
    margin: 0;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    background: var(--surface-color-2);
    color: var(--text-color);
    border-color: var(--border-color);
  }
  .section-header-with-action .button:hover:not(:disabled) {
    background: var(--surface-color);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }

  a {
    color: var(--accent-color);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  h1,h2,h3,h4,h5,h6 {
    font-weight: 700;
  }

  h2 {
    font-size: 1.25rem;
    padding: 1.25rem 1.75rem;
    border-bottom: 1px solid var(--border-color);
    margin: 0;
    background-color: var(--surface-color);
    font-weight: 600;
  }
  h3 {
    font-size: 1.1rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }
  .section > *:not(h2):not(.list-container):not(.keyword-table-container):not(.section-header-with-action):not(.export-history-section) {
    padding: 1.75rem;
  }
  
  /* Forms */
  .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
  .form-group { display: flex; flex-direction: column; }
  label { font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--text-color); font-weight: 500; }
  select, input, textarea {
    padding: 0.75rem 1rem;
    background-color: var(--surface-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 0.95rem;
    font-family: var(--font-family);
    box-sizing: border-box;
    transition: all 0.2s ease-in-out;
  }
  select:disabled, input:disabled, textarea:disabled { background-color: var(--surface-color-2); cursor: not-allowed; opacity: 0.7; }
  textarea { min-height: 120px; resize: vertical; }
  select:focus, input:focus, textarea:focus { outline: none; border-color: var(--accent-color); box-shadow: 0 0 0 3px rgba(248, 181, 0, 0.2); }
  .preview-container { margin-top: 1rem; padding: 1rem; background-color: #0A1F44; border: 1px solid var(--border-color); border-radius: var(--border-radius); }
  .preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  .preview-title { font-size: 0.9rem; font-weight: 700; color: var(--text-color); }
  .status-badge { padding: 0.25rem 0.75rem; border-radius: 99px; font-weight: 700; font-size: 0.75rem; }
  .status-valid { background-color: rgba(129, 199, 132, 0.2); color: var(--success-color); }
  .status-invalid { background-color: rgba(229, 115, 115, 0.2); color: var(--error-color); }
  .preview-name { font-family: 'SF Mono', 'Courier New', monospace; background-color: #071733; padding: 0.75rem; border-radius: var(--border-radius); word-break: break-all; min-height: 20px; color: var(--text-color); font-size: 0.9rem; }
  .validation-error { color: var(--error-color); font-size: 0.85rem; text-align: center; font-weight: 400; margin-top: -0.25rem; margin-bottom: 1rem; }
  .playbook-description {
    background-color: var(--surface-color-2);
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius);
    font-size: 0.85rem;
    color: var(--text-color-secondary);
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    border-left: 3px solid var(--info-color);
  }
  .playbook-description i {
    margin-top: 3px;
    color: var(--info-color);
  }

  /* Buttons */
  .button, .delete-button {
    padding: 0.75rem 1.5rem;
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    transition: all 0.2s;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .button:hover:not(:disabled), .delete-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  .button:active:not(:disabled), .delete-button:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .button {
    background-color: var(--primary-color);
    color: #fff;
  }
  .button:hover:not(:disabled) {
    background-color: var(--primary-variant-color);
  }
  .button:disabled {
    background-color: var(--surface-color-2);
    color: var(--text-color-secondary);
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none;
  }
  .delete-button {
    background-color: var(--error-color);
    color: var(--surface-color);
  }
  .delete-button:hover:not(:disabled) {
    background-color: #c82333;
  }
  .delete-button:disabled {
    background-color: var(--surface-color-2);
    color: var(--text-color-secondary);
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  /* Tables & Lists */
  .list-container { list-style: none; padding: 0; margin: 0; }
  .list-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.75rem; border-bottom: 1px solid var(--border-color); gap: 1rem; transition: background-color 0.2s; }
  .list-item.animated-list-item { animation: fadeInUp 0.5s ease-out forwards; }
  .list-item:last-child { border-bottom: none; }
  .list-item:hover { background-color: var(--surface-color-2); }
  .list-item-highlighted {
    background-color: rgba(0, 123, 255, 0.05) !important;
    box-shadow: inset 3px 0 0 0 var(--primary-color);
  }

  .list-item-name { font-family: 'SF Mono', 'Courier New', monospace; word-break: break-all; flex-grow: 1; font-size: 0.9rem; }
  .list-item-name-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;
    gap: 4px;
  }
  .campaign-item-budget { display: flex; align-items: center; gap: 0.5rem; }
  .campaign-item-budget input { width: 80px; text-align: right; }
  .keyword-table-container { overflow-x: auto; border: 1px solid var(--border-color); border-radius: var(--border-radius); }
  .keyword-table { width: 100%; border-collapse: collapse; }
  .keyword-table th, .keyword-table td { padding: 1rem 1.25rem; text-align: left; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
  .keyword-table th { 
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    text-transform: uppercase;
    user-select: none;
    background-color: var(--surface-color-2);
    position: sticky;
    top: 0;
    white-space: nowrap;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .keyword-table th .sort-btn { background: none; border: none; color: inherit; font: inherit; cursor: pointer; padding: 0; text-align: left; display: inline-flex; align-items: center; gap: 0.5em; transition: color 0.2s; }
  .keyword-table th .sort-btn:hover { color: var(--text-color); }
  .sort-indicator { width: 1em; opacity: 0.5; } .sort-indicator.active { opacity: 1; }
  .keyword-table td { font-size: 0.9rem; word-break: break-word; white-space: normal; }
  .keyword-table td select, .keyword-table td input { padding: 0.5rem; font-size: 0.9rem; width: 100%; }
  .keyword-table tbody tr:nth-child(odd) { background-color: rgba(255, 255, 255, 0.02); }
  .keyword-table tbody tr:hover { background-color: rgba(248, 181, 0, 0.08); }
  .keyword-table tr:last-child td { border-bottom: none; }
  .bid-input-wrapper { position: relative; }
  .bid-input-wrapper::before { content: '$'; position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-color-secondary); }
  .bid-input-wrapper input { padding-left: 1.75rem; }
  .input-error { border-color: var(--error-color) !important; }
  .input-error:focus { box-shadow: 0 0 0 3px rgba(229, 115, 115, 0.2) !important; }
  .error-message { color: var(--error-color); font-size: 0.8rem; padding-top: 4px; }
  .editable-name-input {
    background: transparent;
    border: 1px solid transparent;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    width: 100%;
    padding: 0.2rem 0.4rem;
    margin: -0.2rem -0.4rem;
    border-radius: 4px;
    transition: all 0.2s ease-in-out;
  }
  .editable-name-input:not(:disabled):hover {
    background-color: var(--surface-color-2);
    border-color: var(--border-color);
  }
  .editable-name-input:not(:disabled):focus {
    background-color: var(--surface-color-2);
    outline: none;
    border-color: var(--accent-color);
  }


  /* Dashboard */
  .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: flex-start; }
  .dashboard-main { display: flex; flex-direction: column; gap: 2rem; }
  .dashboard-sidebar { display: flex; flex-direction: column; gap: 2rem; position: sticky; top: 2rem; }
  .stat-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .stat-card { background-color: var(--bg-color); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 1.5rem; transition: transform 0.2s, box-shadow 0.2s; }
  .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
  .stat-card-title { font-size: 0.9rem; color: var(--text-color-secondary); margin-bottom: 0.5rem; }
  .stat-card-value { font-size: 2rem; font-weight: 700; color: var(--text-color); }
  .stat-card-value small { font-size: 1rem; font-weight: 400; color: var(--text-color-secondary); margin-left: 0.25rem; }

  /* Plan Health Check */
  .health-check-header { display: flex; justify-content: space-between; align-items: center; }
  .health-check-rerun-btn { padding: 0.25rem 0.75rem; font-size: 0.8rem; margin: 0; background: var(--surface-color-2); border-color: var(--border-color); color: var(--text-color) }
  .health-check-list { list-style: none; padding: 0; margin: 1rem 0 0 0; }
  .health-issue { padding: 0.75rem 1rem; border-radius: var(--border-radius); margin-bottom: 0.5rem; font-size: 0.9rem; display: flex; align-items: flex-start; gap: 0.75rem; border: 1px solid transparent; }
  .health-issue-error { background-color: rgba(229, 115, 115, 0.1); border-color: rgba(229, 115, 115, 0.3); }
  .health-issue-warning { background-color: rgba(255, 183, 77, 0.1); border-color: rgba(255, 183, 77, 0.3); }
  .health-issue-icon { margin-top: 2px; }
  .health-issue-message code { background-color: rgba(255, 255, 255, 0.1); padding: 0.1rem 0.3rem; border-radius: 3px; font-family: 'SF Mono', 'Courier New', monospace; }
  
  /* Keyword Assigner */
  .ad-group-multi-selector {
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--bg-color);
  }
  .ad-group-multi-selector-header {
    font-size: 1rem;
    font-weight: 700;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }
  .ad-group-selector-list {
    max-height: 200px;
    overflow-y: auto;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .ad-group-selector-group {
    padding: 0.5rem;
  }
  .ad-group-selector-campaign-name {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-color-secondary);
    margin: 0 0 0.5rem 0.5rem;
    text-transform: uppercase;
  }
  .ad-group-selector-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.8rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .ad-group-selector-item:hover {
    background-color: var(--surface-color);
  }
  .ad-group-selector-item label {
    margin-bottom: 0;
    font-size: 0.85rem;
    cursor: pointer;
    flex-grow: 1;
    font-family: 'SF Mono', 'Courier New', monospace;
  }

  .keyword-assigner-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 1.5rem; 
    align-items: flex-start;
  }
  .assigner-panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .assigner-panel-header h3 { font-size: 1rem; margin: 0; font-weight: 700; }
  .assigner-panel-header .search-input { width: 60%; }
  .assigner-table-container { height: 400px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: var(--border-radius); }
  .assigner-actions { display: flex; justify-content: flex-end; margin-top: 1rem; }
  .assigner-actions .button { width: auto; margin: 0 0 0 1rem; }
  .assigner-actions .delete-button { width: auto; margin: 0 0 0 1rem; }
  .assigner-tag { 
    display: inline-block; 
    background-color: var(--surface-color-2); 
    color: var(--text-color-secondary); 
    padding: 0.2rem 0.5rem; 
    border-radius: 4px; 
    font-size: 0.75rem; 
    margin-right: 0.25rem; 
    margin-bottom: 0.25rem; 
    white-space: nowrap; 
    font-family: 'SF Mono', 'Courier New', monospace;
  }
  
  /* Bid Manager */
  .bid-overrides-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: flex-start; }

  /* New Layouts */
  .campaign-view-grid { display: grid; grid-template-columns: 450px 1fr; gap: 2rem; align-items: flex-start; }
  .importer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: flex-start; }
  .ad-group-form-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 1rem; }

  /* Tabs */
  .tab-container { 
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--bg-color);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }
  .tab-nav { 
    display: flex; 
    border-bottom: 2px solid var(--border-color);
    background: linear-gradient(to bottom, var(--surface-color) 0%, var(--bg-color) 100%);
  }
  .tab-item { 
    background: none; 
    border: none; 
    color: var(--text-color-secondary); 
    padding: 0.75rem 1.5rem; 
    font-size: 1rem; 
    font-weight: 700; 
    cursor: pointer; 
    transition: all 0.2s; 
    border-bottom: 3px solid transparent; 
    margin-bottom: -2px;
    position: relative;
  }
  .tab-item:hover { 
    color: var(--text-color); 
    background-color: rgba(255, 255, 255, 0.03);
  }
  .tab-item.active { 
    color: var(--accent-color); 
    border-bottom-color: var(--accent-color);
    background-color: rgba(248, 181, 0, 0.05);
  }

  /* Toast Notifications */
  .toast-container { position: fixed; top: 1.5rem; right: 1.5rem; z-index: 1000; display: flex; flex-direction: column; gap: 0.75rem; }
  .toast { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; border-radius: var(--border-radius); color: white; font-weight: 400; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); animation: toastIn 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
  .toast-success { background-color: var(--success-color); color: #000; }
  .toast-error { background-color: var(--error-color); color: #000; }
  .toast-info { background-color: var(--info-color); color: #000; }
  .toast-warning { background-color: var(--warning-color); color: #000; }
  .toast-close-btn { background: none; border: none; color: inherit; opacity: 0.7; cursor: pointer; font-size: 1.25rem; padding: 0 0.5rem; margin-left: auto; }
  .toast-close-btn:hover { opacity: 1; }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 2.5rem 2rem;
    color: var(--text-color-secondary);
    border: 2px dashed var(--border-color);
    border-radius: var(--border-radius);
    background-color: transparent;
    margin-top: 1.5rem;
  }
  .empty-state:first-child {
    margin-top: 0;
  }
  .empty-state i {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 1rem;
    opacity: 0.7;
    color: var(--primary-color);
  }
  .empty-state p {
    margin: 0;
    font-size: 1rem;
    font-weight: 400;
    color: var(--text-color);
  }
   .empty-state small {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.85rem;
  }

  /* Welcome Screen */
  .welcome-screen {
    text-align: center;
    max-width: 800px;
    margin: 4rem auto;
    padding: 3rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--bg-color);
  }
  .welcome-screen h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 1.5rem 0 0.5rem;
  }
  .welcome-screen .welcome-icon {
    font-size: 4rem;
    color: var(--primary-color);
  }
  .welcome-screen .welcome-subtitle {
    font-size: 1.1rem;
    color: var(--text-color-secondary);
    margin-bottom: 3rem;
  }
  .welcome-guide {
    text-align: left;
    margin-bottom: 2rem;
  }
  .welcome-guide h3 {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }
  .welcome-steps {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  .welcome-steps li {
    padding: 1.5rem;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .welcome-steps li:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
  .welcome-steps li strong {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }
  .welcome-steps li p {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
    line-height: 1.5;
    margin: 0;
  }
  .welcome-cta {
    font-size: 1.1rem;
    color: var(--text-color);
    margin-top: 2rem;
    padding: 1rem;
    background: var(--surface-color-2);
    border-radius: var(--border-radius);
  }
  
  .activity-log-container { max-height: 250px; overflow-y: auto; }
  .activity-log-list { list-style: none; padding: 0; margin: 0; }
  .activity-log-item { display: flex; gap: 1rem; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color); font-size: 0.85rem; }
  .activity-log-item:last-child { border-bottom: none; }
  .activity-log-time { color: var(--text-color-secondary); }
  .activity-log-user { color: var(--primary-color); font-weight: 500; font-size: 0.8rem; }

  /* Report View */
  .report-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
  }
  .report-toolbar-group {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .status-badge-added { background-color: rgba(129, 199, 132, 0.2); color: var(--success-color); }
  .status-badge-unprocessed { background-color: rgba(176, 196, 222, 0.2); color: var(--text-color-secondary); }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    animation: fadeIn 0.2s;
    backdrop-filter: blur(3px);
  }
  .modal-content {
    background-color: var(--surface-color);
    padding: 1.75rem 2rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 550px;
    animation: fadeInUp 0.3s;
  }
  .modal-content h3 {
    margin: -1.75rem -2rem 1.5rem -2rem;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border-color);
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin: 1.75rem -2rem -1.75rem -2rem;
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--border-color);
    background-color: var(--surface-color-2);
  }
  .modal-actions .button, .modal-actions .delete-button {
    margin-top: 0;
  }
  .modal-actions .delete-button { background-color: var(--surface-color-2); border-color: var(--border-color); color: var(--text-color) }

  /* AI Suggestions */
  .loading-container { display: flex; justify-content: center; padding: 2rem; }
  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid var(--primary-color);
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: spin 1s linear infinite;
  }
  .suggestion-container {
    margin-top: 1.5rem;
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: #0A1F44;
  }
  .suggestion-container h3 {
    margin-top: 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  .suggestions-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  .suggestion-list-container h4 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
  }
  .suggestion-list-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
    min-height: 22px;
  }
  .suggestion-list {
    list-style: none;
    padding: 0;
    margin: 0;
    height: 250px;
    overflow-y: auto;
  }
  .suggestion-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
  }
  .suggestion-list li:not(.negative-candidate-item):hover {
    background-color: var(--surface-color);
  }
  .suggestion-text {
    flex-grow: 1;
    word-break: break-word;
  }
  .suggestion-type-tag {
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-weight: 700;
    text-transform: uppercase;
  }
  .type-variation {
      background-color: rgba(100, 181, 246, 0.2);
      color: var(--info-color);
  }
  .type-related {
      background-color: rgba(129, 199, 132, 0.2);
      color: var(--success-color);
  }

  .negative-list li {
      flex-direction: column;
      align-items: flex-start;
      background-color: rgba(229, 115, 115, 0.05);
      border: 1px solid rgba(229, 115, 115, 0.1);
      margin-bottom: 0.5rem;
  }
  .negative-candidate-reason {
      font-size: 0.8rem;
      color: var(--error-color);
      opacity: 0.9;
  }
  .suggestion-list .no-suggestions {
    color: var(--text-color-secondary);
    padding: 1rem 0.5rem;
  }
  .suggestion-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color);
  }
  .suggestion-actions .button, .suggestion-actions .delete-button {
    margin-top: 0;
  }
  .suggestion-actions .delete-button { background-color: var(--surface-color-2); border-color: var(--border-color); color: var(--text-color); }

  /* Campaign Hierarchy View */
  .campaign-hierarchy-container { padding: 0; }
  .campaign-hierarchy-item { 
    border: 1px solid var(--border-color); 
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    background-color: var(--bg-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  .campaign-hierarchy-item.animated-list-item { animation: fadeInUp 0.5s ease-out forwards; }
  .campaign-hierarchy-item:last-child { margin-bottom: 0; }
  .campaign-hierarchy-header { 
    display: flex; 
    align-items: center; 
    gap: 1rem; 
    padding: 0.75rem 1.5rem; 
    cursor: pointer; 
    transition: background-color 0.2s;
    background: linear-gradient(135deg, var(--bg-color) 0%, var(--surface-color) 100%);
  }
  .campaign-hierarchy-header:hover { background-color: rgba(255, 255, 255, 0.05); }
  .expand-icon { transition: transform 0.2s ease-in-out; color: var(--text-color-secondary); width: 12px; text-align: center; }
  .expand-icon.expanded { transform: rotate(90deg); }
  .campaign-hierarchy-name { font-family: 'SF Mono', 'Courier New', monospace; word-break: break-all; flex-grow: 1; font-size: 0.9rem; font-weight: 400; }
  .campaign-hierarchy-header .campaign-item-budget, .campaign-hierarchy-header .delete-button { flex-shrink: 0; }
  .campaign-hierarchy-content { 
    padding: 1rem 1.5rem 1rem 1.5rem; 
    background-color: var(--surface-color); 
    border-top: 2px solid var(--border-color);
  }
  
  .campaign-settings-container { 
    background-color: var(--bg-color); 
    padding: 1rem 1.5rem; 
    margin-bottom: 1.5rem; 
    border-radius: var(--border-radius); 
    border: 1px solid var(--border-color);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  }
  .campaign-settings-container h4 { margin: 0 0 1rem 0; font-size: 0.9rem; font-weight: 700; }
  .placement-modifiers { display: flex; gap: 2rem; align-items: center; }
  .placement-modifier-group { display: flex; align-items: center; gap: 0.5rem; }
  .placement-modifier-group label { margin-bottom: 0; font-size: 0.85rem; }
  .placement-modifier-group input { width: 70px; }
  .placement-modifier-group span { color: var(--text-color-secondary); }

  .ad-group-item { 
    border: 1px solid var(--border-color); 
    border-radius: var(--border-radius);
    margin-bottom: 0.75rem;
    padding: 0.75rem 1rem;
    background-color: var(--bg-color);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  }
  .ad-group-item:last-child { margin-bottom: 0; }
  .ad-group-header { display: flex; align-items: center; gap: 1rem; padding: 0; cursor: pointer; }
  .ad-group-header:hover { background-color: rgba(255, 255, 255, 0.03); margin: 0 -0.5rem; padding: 0.5rem; border-radius: var(--border-radius); }
  .ad-group-header-name { 
    flex-grow: 1;
    font-size: 0.85rem;
    font-family: 'SF Mono', 'Courier New', monospace;
    word-break: break-all;
    transition: color 0.2s, text-decoration-color 0.2s;
    text-decoration: underline;
    text-decoration-color: transparent;
    cursor: pointer;
  }
  .ad-group-header-name:hover {
    color: var(--accent-color);
    text-decoration-color: var(--accent-color);
  }
  .ad-group-sub-item-stats { display: flex; align-items: center; gap: 1rem; font-size: 0.8rem; color: var(--text-color-secondary); white-space: nowrap; flex-shrink: 0; }
  .ad-group-sub-item-stats i { margin-right: 0.3rem; opacity: 0.8; width: 12px; text-align: center; }
  
  .ad-group-details-container { 
    padding: 1rem 0 0 1.5rem; 
    animation: fadeInUp 0.3s ease-out;
    margin-top: 0.75rem;
    border-top: 1px solid var(--border-color);
  }
  .ad-group-details-container .keyword-table { 
    background: var(--surface-color-2); 
    border: 1px solid var(--border-color); 
    border-radius: var(--border-radius);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  .ad-group-details-container .keyword-table th, .ad-group-details-container .keyword-table td { padding: 0.5rem 0.75rem; }
  .ad-group-details-container .keyword-table input { width: 100px; }

  .ad-group-sub-item-empty { padding: 1rem; text-align: center; color: var(--text-color-secondary); font-style: italic; font-size: 0.9rem; }

  /* Plan Visualizer */
  .plan-visualizer-container { padding: 0.5rem 0; }
  .plan-visualizer-item { border-bottom: 1px solid var(--border-color); }
  .plan-visualizer-item:last-child { border-bottom: none; }
  .plan-visualizer-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .plan-visualizer-header:hover { background-color: var(--surface-color); }
  .plan-visualizer-name {
    font-family: 'SF Mono', 'Courier New', monospace;
    font-size: 0.8rem;
    word-break: break-all;
    flex-grow: 1;
    color: var(--text-color);
    font-weight: 700;
  }
  .plan-visualizer-content {
    padding: 1rem 1.5rem 1rem 2rem;
    background-color: var(--surface-color);
    border-top: 1px solid var(--border-color);
    animation: fadeInUp 0.3s ease-out;
  }
  .plan-visualizer-campaign-summary {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    background-color: var(--bg-color);
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
  }
  .summary-stat {
    display: flex;
    flex-direction: column;
  }
  .summary-stat-label {
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }
  .summary-stat-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-color);
  }
  .plan-visualizer-adgroup {
    margin-left: 1.25rem;
    border-left: 2px solid var(--border-color);
    padding-left: 1rem;
  }
  .plan-visualizer-adgroup:last-child {
      padding-bottom: 0;
  }
  .plan-visualizer-adgroup-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.5rem;
    cursor: pointer;
    border-radius: var(--border-radius);
    transition: background-color 0.2s;
  }
  .plan-visualizer-adgroup-header:hover {
    background-color: var(--surface-color-2);
  }
  .plan-visualizer-child-name {
    font-family: 'SF Mono', 'Courier New', monospace;
    font-size: 0.8rem;
    flex-grow: 1;
    color: var(--text-color-secondary);
  }
  .plan-visualizer-adgroup-details {
    padding: 0.75rem 0.5rem 0.75rem 2rem;
    animation: fadeInUp 0.3s ease-out;
    font-size: 0.85rem;
    color: var(--text-color-secondary);
  }
  .detail-item {
    margin-bottom: 1rem;
  }
  .detail-item:last-child {
      margin-bottom: 0;
  }
  .detail-item strong {
    color: var(--text-color);
    display: block;
    margin-bottom: 0.5rem;
  }
  .detail-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .detail-list-empty {
    font-style: italic;
  }
  .detail-list li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0;
    white-space: nowrap;
  }
  .detail-list li i {
    color: var(--text-color-secondary);
    width: 14px;
    text-align: center;
  }
  .detail-tag {
    background-color: var(--surface-color-2);
    color: var(--text-color-secondary);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
  }
  .detail-bid-override {
    color: var(--primary-color);
    font-weight: 700;
    margin-left: auto;
    background: rgba(248, 181, 0, 0.1);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
  }
  .plan-visualizer-child-item.empty { 
    font-style: italic; 
    padding: 0.5rem 0;
    font-size: 0.8rem;
  }

  /* Documentation Viewer */
  .docs-container {
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    overflow: hidden;
  }
  .docs-content {
    padding: 2.5rem 3rem;
    line-height: 1.7;
    max-width: 900px;
    margin: 0 auto;
    color: var(--text-color-secondary);
  }
  .docs-content h1, .docs-content h2, .docs-content h3 {
    font-weight: 700;
    color: var(--text-color);
    margin-top: 2.5em;
    margin-bottom: 1em;
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--border-color);
  }
  .docs-content h1:first-child, .docs-content h2:first-child {
    margin-top: 0;
  }
  .docs-content h1 { font-size: 2.2em; }
  .docs-content h2 { font-size: 1.6em; }
  .docs-content h3 { font-size: 1.3em; }
  .docs-content p {
    margin-bottom: 1.25em;
  }
  .docs-content code {
    font-family: 'SF Mono', 'Courier New', monospace;
    background-color: var(--surface-color-2);
    padding: 0.2em 0.4em;
    border-radius: 6px;
    font-size: 85%;
    color: var(--primary-variant-color);
  }
  .docs-content ul, .docs-content ol:not(.sop-list) {
    margin-bottom: 1em;
    padding-left: 2em;
  }
  .docs-content li {
    margin-bottom: 0.75em;
  }
  .docs-content strong {
    font-weight: 700;
    color: var(--text-color);
  }
  .docs-content .info-box {
    background-color: var(--surface-color-2);
    border-left: 4px solid var(--info-color);
    padding: 1rem 1.5rem;
    margin: 1.5rem 0;
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }
  .docs-content .info-box i {
    color: var(--info-color);
    font-size: 1.2rem;
    margin-top: 0.2rem;
  }
  .docs-content .info-box p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
  }
  .docs-content .sop-list {
    list-style: none;
    padding-left: 0;
    counter-reset: sop-counter;
    margin-top: 1.5rem;
  }
  .docs-content .sop-list li {
    counter-increment: sop-counter;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
  .docs-content .sop-list li::before {
    content: counter(sop-counter);
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--bg-color);
    background-color: var(--primary-color);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  .docs-content .sop-list li div {
    display: flex;
    flex-direction: column;
  }
  .docs-content .sop-list li strong {
    display: block;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  .docs-content .workflow-steps {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .docs-content .workflow-step {
    background-color: var(--surface-color);
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    text-align: center;
  }
  .docs-content .workflow-step i {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  .docs-content .workflow-step h3 {
    font-size: 1.1rem;
    border: none;
    padding: 0;
    margin: 0 0 0.5rem 0;
  }

  /* Plan Approver - Export History */
  .export-history-section {
    padding: 1rem 1.5rem 1.5rem;
    border-top: 1px solid var(--border-color);
  }
  .export-history-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-color);
      margin-top: 0;
      margin-bottom: 1rem;
  }
  .export-history-list {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 250px;
      overflow-y: auto;
  }
  .export-history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-color);
  }
  .export-history-item:last-child {
      border-bottom: none;
  }
  .export-history-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
  }
  .export-history-filename {
      font-family: 'SF Mono', 'Courier New', monospace;
      font-size: 0.85rem;
      color: var(--text-color);
      font-weight: 400;
  }
  .export-history-timestamp {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
  }
  .redownload-button {
      margin: 0;
      padding: 0.4rem 0.6rem;
      font-size: 0.8rem;
      background: var(--surface-color-2);
      color: var(--text-color);
      border-color: var(--border-color);
      width: auto;
  }
  .redownload-button:hover:not(:disabled) {
      background: var(--surface-color);
      border-color: var(--accent-color);
      color: var(--accent-color);
  }
  .export-history-empty {
      font-size: 0.9rem;
      color: var(--text-color-secondary);
      text-align: center;
      padding: 1.5rem;
      border: 2px dashed var(--border-color);
      border-radius: var(--border-radius);
      margin-top: 1rem;
  }

/* Media Queries for Responsiveness */
@media (max-width: 1400px) {
    .campaign-view-grid {
        grid-template-columns: 380px 1fr;
    }
}

@media (max-width: 1200px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    .dashboard-sidebar {
        position: static;
    }
    .stat-cards {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
    .ad-group-form-grid {
        grid-template-columns: 1fr 1fr;
    }
    .suggestions-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 992px) {
    .content-area {
        padding: 1.5rem;
    }
    .campaign-view-grid,
    .keyword-assigner-grid,
    .bid-overrides-grid,
    .importer-grid {
        grid-template-columns: 1fr;
    }
    .welcome-steps {
        grid-template-columns: 1fr;
    }
    .docs-content .workflow-steps {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .main-header {
        flex-direction: column;
        align-items: flex-start;
    }
    .main-header h1 {
        font-size: 1.1rem;
    }
    .ad-group-form-grid {
        grid-template-columns: 1fr;
    }
    .content-area {
        padding: 1rem;
    }
    .docs-content {
        padding: 1.5rem;
    }
}

/* User Login Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(10, 31, 68, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(5px);
}

.modal-content {
    background-color: var(--surface-color);
    border-radius: var(--border-radius);
    padding: 2.5rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--border-color);
    animation: fadeInUp 0.3s ease-out;
}

.user-login-modal .modal-header {
    text-align: center;
    margin-bottom: 2rem;
}

.user-login-modal .modal-icon {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.user-login-modal h2 {
    font-size: 1.75rem;
    margin: 0 0 0.5rem 0;
    color: var(--text-color);
}

.user-login-modal .modal-subtitle {
    font-size: 0.95rem;
    color: var(--text-color-secondary);
    margin: 0;
}

.user-login-form .form-group {
    margin-bottom: 1.5rem;
}

.user-login-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-color);
    font-size: 0.9rem;
}

.user-login-form input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--bg-color);
    color: var(--text-color);
    font-size: 1rem;
    font-family: var(--font-family);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.user-login-form input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(248, 181, 0, 0.1);
}

.user-login-form input.input-error {
    border-color: var(--error-color);
}

.user-login-form .error-message {
    display: block;
    color: var(--error-color);
    font-size: 0.85rem;
    margin-top: 0.5rem;
}

.user-login-form .btn {
    width: 100%;
    padding: 0.875rem 1.5rem;
    border: none;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: var(--font-family);
}

.user-login-form .btn-primary {
    background-color: var(--primary-color);
    color: var(--bg-color);
}

.user-login-form .btn-primary:hover {
    background-color: var(--primary-variant-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(248, 181, 0, 0.3);
}

.modal-note {
    text-align: center;
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.modal-note i {
    color: var(--info-color);
}

.user-profile-menu {
    position: relative;
}

.user-profile-menu .user-menu-button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0;
}

.user-profile-menu .user-menu-dropdown {
    position: absolute;
    bottom: 100%;
    left: 0;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    min-width: 200px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: fadeInUp 0.2s ease-out;
}

.user-profile-menu .user-menu-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
}

.user-profile-menu .user-menu-item:hover {
    background-color: var(--surface-color-2);
}

.user-profile-menu .user-menu-item i {
    width: 1rem;
    text-align: center;
}

/* Tooltip Styles */
.tooltip-trigger {
    display: inline-block;
    position: relative;
}

.tooltip {
    position: absolute;
    background-color: rgba(10, 31, 68, 0.95);
    color: var(--text-color);
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    line-height: 1.4;
    max-width: 300px;
    z-index: 10000;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-color);
    animation: fadeInUp 0.2s ease-out;
}

.tooltip-top {
    transform: translate(-50%, calc(-100% - 8px));
}

.tooltip-bottom {
    transform: translate(-50%, 8px);
}

.tooltip-left {
    transform: translate(calc(-100% - 8px), -50%);
}

.tooltip-right {
    transform: translate(8px, -50%);
}

.help-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-secondary);
    cursor: help;
    font-size: 0.9rem;
    margin-left: 0.25rem;
    transition: color 0.2s;
}

.help-icon:hover {
    color: var(--primary-color);
}

/* Loading Spinner Styles */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(10, 31, 68, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.loading-message {
    color: var(--text-color);
    font-size: 1rem;
    margin: 0;
}

.loading-inline {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: center;
    padding: 1rem;
}

.spinner {
    border: 3px solid rgba(248, 181, 0, 0.1);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.spinner-small {
    width: 16px;
    height: 16px;
    border-width: 2px;
}

.spinner-medium {
    width: 32px;
    height: 32px;
}

.spinner-large {
    width: 48px;
    height: 48px;
    border-width: 4px;
}

.button-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 0.5rem;
}

/* Skeleton Loader */
.skeleton-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
}

.skeleton-loader {
    background: linear-gradient(
        90deg,
        var(--surface-color) 0%,
        var(--surface-color-2) 50%,
        var(--surface-color) 100%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: 4px;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* Command Palette Styles */
.command-palette-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.command-palette {
    position: fixed;
    top: 20vh;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 640px;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
    z-index: 10001;
    display: flex;
    flex-direction: column;
    max-height: 60vh;
    animation: fadeInUp 0.2s ease-out;
}

.command-palette-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-color);
}

.command-palette-header i {
    color: var(--text-color-secondary);
    font-size: 1.1rem;
}

.command-palette-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-color);
    font-size: 1rem;
    outline: none;
    font-family: var(--font-family);
}

.command-palette-input::placeholder {
    color: var(--text-color-secondary);
}

.command-palette-close {
    background: none;
    border: none;
    color: var(--text-color-secondary);
    cursor: pointer;
    padding: 0.25rem;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
}

.command-palette-close:hover {
    color: var(--text-color);
}

.command-palette-results {
    overflow-y: auto;
    max-height: 400px;
    padding: 0.5rem;
}

.command-palette-results::-webkit-scrollbar {
    width: 8px;
}

.command-palette-results::-webkit-scrollbar-track {
    background: transparent;
}

.command-palette-results::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}

.command-palette-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    color: var(--text-color-secondary);
    gap: 0.75rem;
}

.command-palette-empty i {
    font-size: 2rem;
    opacity: 0.5;
}

.command-group {
    margin-bottom: 0.5rem;
}

.command-group-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--text-color-secondary);
    padding: 0.5rem 0.75rem 0.25rem;
    letter-spacing: 0.5px;
}

.command-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.15s;
    text-align: left;
    font-size: 0.9rem;
}

.command-item:hover,
.command-item.selected {
    background-color: var(--surface-color-2);
}

.command-label {
    flex: 1;
}

.command-shortcut {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--text-color-secondary);
    font-family: monospace;
    background-color: var(--surface-color);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--border-color);
}

.command-palette-footer {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--border-color);
    background-color: rgba(0, 0, 0, 0.2);
}

.command-palette-hint {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.75rem;
    color: var(--text-color-secondary);
}

.command-palette-hint kbd {
    background-color: var(--surface-color);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    border: 1px solid var(--border-color);
    font-family: monospace;
    font-size: 0.7rem;
    margin-right: 0.25rem;
}

/* Validation & Error Styles */
.input-error {
    border-color: var(--error-color) !important;
}

.error-message {
    color: var(--error-color);
    font-size: 0.85rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.error-message i {
    font-size: 0.9rem;
}

.field-required::after {
    content: " *";
    color: var(--error-color);
}

.validation-hint {
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    margin-top: 0.25rem;
}

/* Success States */
.input-success {
    border-color: var(--success-color) !important;
}

.success-message {
    color: var(--success-color);
    font-size: 0.85rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

/* Warning States */
.input-warning {
    border-color: var(--warning-color) !important;
}

.warning-message {
    color: var(--warning-color);
    font-size: 0.85rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

/* Bulk Toolbar Styles */
.bulk-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    gap: 1rem;
    transition: all 0.2s;
}

.bulk-toolbar.has-selection {
    background-color: rgba(248, 181, 0, 0.1);
    border-color: var(--primary-color);
}

.bulk-toolbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.bulk-toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.bulk-checkbox-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
}

.bulk-checkbox-container input[type="checkbox"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
}

.bulk-checkbox-label {
    font-size: 0.9rem;
    color: var(--text-color);
    font-weight: 500;
}

.bulk-clear-btn {
    background: transparent;
    border: none;
    color: var(--text-color-secondary);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    border-radius: 4px;
    transition: all 0.2s;
}

.bulk-clear-btn:hover {
    background-color: var(--surface-color-2);
    color: var(--text-color);
}

.bulk-action-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
    white-space: nowrap;
}

.bulk-action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.bulk-action-primary {
    background-color: var(--primary-color);
    color: #0A1F44;
}

.bulk-action-primary:hover:not(:disabled) {
    background-color: var(--primary-variant-color);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(248, 181, 0, 0.3);
}

.bulk-action-secondary {
    background-color: var(--surface-color-2);
    color: var(--text-color);
    border: 1px solid var(--border-color);
}

.bulk-action-secondary:hover:not(:disabled) {
    background-color: var(--surface-color);
}

.bulk-action-danger {
    background-color: var(--error-color);
    color: white;
}

.bulk-action-danger:hover:not(:disabled) {
    background-color: #d32f2f;
}

/* Bulk Dialog */
.bulk-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9998;
    backdrop-filter: blur(2px);
}

.bulk-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
    z-index: 9999;
    min-width: 400px;
    max-width: 500px;
    animation: fadeInUp 0.2s ease-out;
}

.bulk-dialog-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.bulk-dialog-header i {
    font-size: 1.5rem;
}

.bulk-dialog-danger .bulk-dialog-header i {
    color: var(--error-color);
}

.bulk-dialog-warning .bulk-dialog-header i {
    color: var(--warning-color);
}

.bulk-dialog-info .bulk-dialog-header i {
    color: var(--info-color);
}

.bulk-dialog-header h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-color);
}

.bulk-dialog-body {
    padding: 1.5rem;
}

.bulk-dialog-body p {
    margin: 0;
    color: var(--text-color-secondary);
    line-height: 1.6;
}

.bulk-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--border-color);
    background-color: rgba(0, 0, 0, 0.2);
}

.bulk-dialog-btn {
    padding: 0.6rem 1.25rem;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.bulk-dialog-btn-secondary {
    background-color: var(--surface-color-2);
    color: var(--text-color);
    border: 1px solid var(--border-color);
}

.bulk-dialog-btn-secondary:hover {
    background-color: var(--surface-color);
}

.bulk-dialog-btn-danger {
    background-color: var(--error-color);
    color: white;
}

.bulk-dialog-btn-danger:hover {
    background-color: #d32f2f;
}

.bulk-dialog-btn-warning {
    background-color: var(--warning-color);
    color: #0A1F44;
}

.bulk-dialog-btn-warning:hover {
    background-color: #ffa726;
}

.bulk-dialog-btn-info {
    background-color: var(--info-color);
    color: white;
}

.bulk-dialog-btn-info:hover {
    background-color: #42a5f5;
}

/* Search and Filter Styles */
.search-filter-container {
    margin-bottom: 1.5rem;
}

.search-filter-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.search-input-wrapper {
    flex: 1;
    min-width: 250px;
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 1rem;
    color: var(--text-color-secondary);
    pointer-events: none;
}

.search-input {
    width: 100%;
    padding: 0.75rem 2.75rem 0.75rem 2.75rem;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-color);
    font-size: 0.95rem;
    transition: all 0.2s;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(248, 181, 0, 0.1);
}

.search-clear-btn {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    color: var(--text-color-secondary);
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
}

.search-clear-btn:hover {
    background-color: var(--surface-color-2);
    color: var(--text-color);
}

.filter-toggle-btn {
    padding: 0.75rem 1rem;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
    position: relative;
}

.filter-toggle-btn:hover,
.filter-toggle-btn.active {
    background-color: var(--surface-color-2);
    border-color: var(--primary-color);
}

.filter-badge {
    background-color: var(--primary-color);
    color: #0A1F44;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.15rem 0.5rem;
    border-radius: 12px;
    min-width: 18px;
    text-align: center;
}

.clear-all-btn {
    padding: 0.75rem 1rem;
    background-color: transparent;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-color-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.clear-all-btn:hover {
    background-color: var(--error-color);
    border-color: var(--error-color);
    color: white;
}

.search-results-count {
    padding: 0.75rem 1rem;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 0.9rem;
    color: var(--text-color-secondary);
    white-space: nowrap;
}

.result-count {
    color: var(--primary-color);
    font-weight: 700;
}

/* Filter Panel */
.filter-panel {
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-top: 1rem;
    animation: fadeInUp 0.2s ease-out;
}

.filter-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.filter-panel-title {
    font-weight: 600;
    color: var(--text-color);
}

.filter-panel-close {
    background: none;
    border: none;
    color: var(--text-color-secondary);
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    transition: color 0.2s;
}

.filter-panel-close:hover {
    color: var(--text-color);
}

.filter-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
}

.filter-option {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-option.active .filter-option-label {
    color: var(--primary-color);
    font-weight: 600;
}

.filter-option-label {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-color);
}

.filter-input {
    padding: 0.6rem;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-color);
    font-size: 0.9rem;
    transition: all 0.2s;
}

.filter-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(248, 181, 0, 0.1);
}

/* Active Filters */
.active-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
}

.filter-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--surface-color-2);
    border: 1px solid var(--primary-color);
    border-radius: 20px;
    font-size: 0.85rem;
    color: var(--text-color);
}

.filter-chip-label {
    font-weight: 600;
    color: var(--primary-color);
}

.filter-chip-value {
    color: var(--text-color);
}

.filter-chip-remove {
    background: none;
    border: none;
    color: var(--text-color-secondary);
    cursor: pointer;
    padding: 0.15rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
    font-size: 0.8rem;
}

.filter-chip-remove:hover {
    background-color: var(--error-color);
    color: white;
}

/* Charts */
.chart-container {
    background-color: var(--surface-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.chart-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--text-color);
}

.chart-empty {
    text-align: center;
    padding: 2rem;
    color: var(--text-color-secondary);
    font-style: italic;
}

.pie-chart-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
}

.pie-chart {
    flex-shrink: 0;
}

.chart-legend {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 200px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.legend-color {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    flex-shrink: 0;
}

.legend-label {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.legend-text {
    font-size: 0.9rem;
    color: var(--text-color);
    font-weight: 500;
}

.legend-value {
    font-size: 0.8rem;
    color: var(--text-color-secondary);
}

.bar-chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.bar-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.bar-label {
    font-size: 0.9rem;
    color: var(--text-color);
    font-weight: 500;
}

.bar-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    height: 32px;
    position: relative;
}

.bar-fill {
    height: 100%;
    background-color: var(--primary-color);
    border-radius: 4px;
    transition: width 0.5s ease;
    min-width: 2px;
}

.bar-value {
    font-size: 0.85rem;
    color: var(--text-color);
    font-weight: 600;
    white-space: nowrap;
}

.progress-ring-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.progress-ring-label {
    font-size: 0.9rem;
    color: var(--text-color);
    font-weight: 500;
    text-align: center;
}

/* Enhanced Stat Cards */
.stat-card-clickable {
    transition: all 0.2s;
}

.stat-card-clickable:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(248, 181, 0, 0.2);
    border-color: var(--primary-color);
}

.stat-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
}

.stat-card-icon {
    font-size: 1.2rem;
    color: var(--primary-color);
    opacity: 0.7;
}

.stat-card-trend {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8rem;
    margin-top: 0.5rem;
    font-weight: 600;
}

.stat-card-trend.up {
    color: var(--success-color);
}

.stat-card-trend.down {
    color: var(--error-color);
}

/* Dashboard Charts Section */
.dashboard-charts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
}

@media (max-width: 768px) {
    .dashboard-charts {
        grid-template-columns: 1fr;
    }
    
    .pie-chart-wrapper {
        flex-direction: column;
    }
}

/* Template Manager */
.template-modal {
    max-width: 900px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
}

.template-filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 0 1.5rem;
}

.category-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.filter-button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    background-color: var(--surface-color);
    color: var(--text-color);
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
}

.filter-button:hover {
    border-color: var(--primary-color);
    background-color: var(--surface-color-2);
}

.filter-button.active {
    background-color: var(--primary-color);
    color: var(--bg-color);
    border-color: var(--primary-color);
    font-weight: 600;
}

.template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 0 1.5rem 1.5rem;
    overflow-y: auto;
}

.template-card {
    background-color: var(--surface-color-2);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: all 0.2s;
}

.template-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(248, 181, 0, 0.15);
}

.template-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
}

.template-card-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
    flex: 1;
}

.template-category {
    background-color: var(--primary-color);
    color: var(--bg-color);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
}

.template-description {
    color: var(--text-color-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    flex: 1;
}

.template-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
}

.template-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
}

.detail-label {
    color: var(--text-color-secondary);
    font-weight: 500;
}

.detail-value {
    color: var(--text-color);
    font-weight: 600;
}

.template-apply-btn {
    margin-top: 0.5rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.template-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: var(--text-color-secondary);
    text-align: center;
}

.template-empty i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.template-empty p {
    font-size: 1rem;
    margin: 0;
}

/* Quick Action Buttons */
.quick-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
}

.quick-action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background-color: var(--surface-color-2);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s;
}

.quick-action-btn:hover {
    border-color: var(--primary-color);
    background-color: var(--primary-color);
    color: var(--bg-color);
    transform: translateY(-1px);
}

.quick-action-btn i {
    font-size: 1.1rem;
}

/* Version Control */
.version-timeline {
    padding: 1.5rem;
}

.version-item {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
    position: relative;
}

.version-item.current-version .version-content {
    border-color: var(--primary-color);
    background-color: var(--surface-color-2);
}

.version-item.selected-version .version-content {
    border-color: var(--info-color);
}

.version-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.version-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: var(--primary-color);
    border: 3px solid var(--surface-color);
    z-index: 1;
}

.version-item.current-version .version-dot {
    width: 20px;
    height: 20px;
    box-shadow: 0 0 0 4px rgba(248, 181, 0, 0.2);
}

.version-line {
    width: 2px;
    flex: 1;
    background-color: var(--border-color);
    margin-top: 0.5rem;
    min-height: 40px;
}

.version-content {
    flex: 1;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 1.25rem;
    transition: all 0.2s;
}

.version-content:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.version-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.version-info {
    flex: 1;
}

.version-label {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.version-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    background-color: var(--primary-color);
    color: var(--bg-color);
    border-radius: 12px;
}

.version-meta {
    display: flex;
    gap: 1.5rem;
    font-size: 0.85rem;
    color: var(--text-color-secondary);
}

.version-meta span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.version-meta i {
    font-size: 0.9rem;
}

.version-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.version-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.85rem;
    color: var(--text-color);
}

.version-checkbox input[type="checkbox"] {
    cursor: pointer;
}

.version-changes {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
}

.version-changes h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 0.5rem 0;
}

.version-changes ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.version-changes li {
    font-size: 0.85rem;
    color: var(--text-color-secondary);
    padding: 0.25rem 0;
    padding-left: 1.25rem;
    position: relative;
}

.version-changes li::before {
    content: "•";
    position: absolute;
    left: 0.5rem;
    color: var(--primary-color);
}

.version-changes li.version-more {
    font-style: italic;
    color: var(--text-color-secondary);
}

/* Version Comparison */
.comparison-modal {
    max-width: 800px;
}

.comparison-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.comparison-version {
    flex: 1;
    text-align: center;
}

.comparison-version h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 0.5rem 0;
}

.comparison-version p {
    font-size: 0.85rem;
    color: var(--text-color-secondary);
    margin: 0;
}

.comparison-arrow {
    font-size: 1.5rem;
    color: var(--primary-color);
}

.comparison-table {
    width: 100%;
    border-collapse: collapse;
}

.comparison-table th,
.comparison-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

.comparison-table th {
    background-color: var(--surface-color-2);
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-color);
}

.comparison-table td {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
}

.comparison-table .positive-change {
    color: var(--success-color);
    font-weight: 600;
}

.comparison-table .negative-change {
    color: var(--error-color);
    font-weight: 600;
}

.comparison-empty {
    text-align: center;
    padding: 3rem;
    color: var(--text-color-secondary);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 0 1.5rem;
}

.section-header h2 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
}

.section-actions {
    display: flex;
    gap: 0.75rem;
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
}

.btn-info {
    background-color: var(--info-color);
    color: white;
}

.btn-info:hover {
    background-color: #5a9fd4;
}

/* Enhanced Activity Log */
.activity-count {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-color-secondary);
    margin-left: 0.5rem;
}

.activity-filters {
    padding: 1rem 1.5rem;
    background-color: var(--surface-color-2);
    border-radius: var(--border-radius);
    margin: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.filter-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-group label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-color);
}

.category-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.category-filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
}

.category-filter-btn:hover {
    background-color: var(--surface-color-2);
    transform: translateY(-1px);
}

.category-filter-btn.active {
    background-color: var(--primary-color);
    color: var(--bg-color);
    border-color: var(--primary-color);
    font-weight: 600;
}

.category-count {
    font-size: 0.75rem;
    opacity: 0.8;
}

.user-filter-select {
    padding: 0.5rem;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 0.9rem;
}

.search-clear {
    background: none;
    border: none;
    color: var(--text-color-secondary);
    cursor: pointer;
    padding: 0.25rem;
    transition: color 0.2s;
}

.search-clear:hover {
    color: var(--error-color);
}

.activity-log-timeline {
    padding: 1.5rem;
}

.activity-date-group {
    margin-bottom: 2rem;
}

.activity-date-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background-color: var(--surface-color-2);
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--text-color);
}

.activity-date-header i {
    color: var(--primary-color);
}

.activity-log-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: 0.75rem;
    transition: all 0.2s;
}

.activity-log-item:hover {
    background-color: var(--surface-color-2);
    border-color: var(--primary-color);
    transform: translateX(4px);
}

.activity-category-indicator {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: white;
    font-size: 1rem;
}

.activity-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.activity-log-action {
    color: var(--text-color);
    font-size: 0.95rem;
    line-height: 1.4;
}

.activity-log-meta {
    display: flex;
    gap: 1.5rem;
    font-size: 0.8rem;
    color: var(--text-color-secondary);
}

.activity-log-meta span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.activity-log-meta i {
    font-size: 0.85rem;
}
`;