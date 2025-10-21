export const styles = `
  :root {
    --bg-color: #0A1F44;
    --surface-color: #112958;
    --surface-color-2: #1A3D7C;
    --primary-color: #F8B500;
    --primary-variant-color: #FFC72B;
    --text-color: #FFFFFF;
    --text-color-secondary: #B0C4DE;
    --border-color: #2A4B8A;
    --error-color: #E57373;
    --success-color: #81C784;
    --warning-color: #FFB74D;
    --info-color: #64B5F6;
    --accent-color: #F8B500;
    --border-radius: 8px;
    --font-family: 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
    width: 240px;
    background-color: var(--bg-color);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1rem;
    box-sizing: border-box;
    flex-shrink: 0;
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
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
    background-color: var(--bg-color);
    flex-wrap: wrap;
    gap: 1rem;
  }

  .main-header h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
  }

  .content-area {
    padding: 2rem;
    overflow-y: auto;
    flex-grow: 1;
    background-color: var(--surface-color);
  }
  .content-area::-webkit-scrollbar { width: 8px; }
  .content-area::-webkit-scrollbar-track { background: transparent; }
  .content-area::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
  .content-area::-webkit-scrollbar-thumb:hover { background: #555; }


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

  .nav-list { list-style: none; padding: 0; margin: 0; }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 400;
    color: var(--text-color-secondary);
    transition: background-color 0.2s, color 0.2s;
  }
  .nav-item:hover { background-color: rgba(255, 255, 255, 0.05); color: var(--text-color); }
  .nav-item.active {
    background-color: var(--primary-color);
    color: #0A1F44;
    font-weight: 700;
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
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    margin-bottom: 2rem;
    overflow: hidden;
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
    font-size: 1.1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    margin: 0;
  }
  h3 {
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 1rem;
  }
  .section > *:not(h2):not(.list-container):not(.keyword-table-container):not(.section-header-with-action):not(.export-history-section) {
    padding: 1.5rem;
  }
  
  /* Forms */
  .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
  .form-group { display: flex; flex-direction: column; }
  label { font-size: 0.875rem; margin-bottom: 0.5rem; color: var(--text-color-secondary); font-weight: 400; }
  select, input, textarea {
    padding: 0.65rem 0.85rem;
    background-color: var(--bg-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 0.9rem;
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
    margin-top: 1rem; padding: 0.65rem 1.25rem; color: white; border: 1px solid var(--border-color); border-radius: var(--border-radius); cursor: pointer; font-size: 0.9rem; font-weight: 700; transition: all 0.2s; text-align: center;
  }
  .button:hover:not(:disabled), .delete-button:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.1); }
  .button:active:not(:disabled), .delete-button:active:not(:disabled) { transform: translateY(0); filter: brightness(1); }
  .button { background-color: var(--primary-color); border-color: var(--primary-variant-color); color: #0A1F44; }
  .button:hover:not(:disabled) { background-color: var(--primary-variant-color); }
  .button:disabled { background-color: #555; cursor: not-allowed; opacity: 0.6; }
  .delete-button { background-color: #9A2424; border-color: #B71C1C; }
  .delete-button:hover:not(:disabled) { background-color: #B71C1C; }
  .delete-button:disabled { background-color: #555; cursor: not-allowed; opacity: 0.6; }

  /* Tables & Lists */
  .list-container { list-style: none; padding: 0; margin: 0; }
  .list-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1.5rem; border-bottom: 1px solid var(--border-color); gap: 1rem; transition: background-color 0.2s, border-left-color 0.2s; }
  .list-item.animated-list-item { animation: fadeInUp 0.5s ease-out forwards; }
  .list-item:last-child { border-bottom: none; }
  .list-item:hover { background-color: rgba(255, 255, 255, 0.03); }
  .list-item-highlighted {
    background-color: rgba(248, 181, 0, 0.1) !important;
    border-left: 3px solid var(--primary-color) !important;
    box-shadow: inset 4px 0 8px -4px rgba(248, 181, 0, 0.2);
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
  .keyword-table-container { overflow-x: auto; }
  .keyword-table { width: 100%; border-collapse: collapse; }
  .keyword-table th, .keyword-table td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
  .keyword-table th { 
    font-size: 0.8rem;
    color: var(--text-color-secondary);
    text-transform: uppercase;
    user-select: none;
    background-color: var(--surface-color);
    position: sticky;
    top: 0;
    white-space: nowrap;
    font-weight: 700;
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
  .tab-container { margin-bottom: 2rem; }
  .tab-nav { display: flex; border-bottom: 2px solid var(--border-color); }
  .tab-item { background: none; border: none; color: var(--text-color-secondary); padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: 700; cursor: pointer; transition: color 0.2s, border-bottom 0.2s; border-bottom: 2px solid transparent; margin-bottom: -2px; }
  .tab-item:hover { color: var(--text-color); }
  .tab-item.active { color: var(--accent-color); border-bottom-color: var(--accent-color); }

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
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    animation: fadeIn 0.3s;
  }
  .modal-content {
    background-color: var(--surface-color);
    padding: 2rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 500px;
    animation: fadeInUp 0.4s;
  }
  .modal-content h3 {
    margin-top: 0;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
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
  .campaign-hierarchy-item { border-bottom: 1px solid var(--border-color); }
  .campaign-hierarchy-item.animated-list-item { animation: fadeInUp 0.5s ease-out forwards; }
  .campaign-hierarchy-item:last-child { border-bottom: none; }
  .campaign-hierarchy-header { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.5rem; cursor: pointer; transition: background-color 0.2s; }
  .campaign-hierarchy-header:hover { background-color: rgba(255, 255, 255, 0.03); }
  .expand-icon { transition: transform 0.2s ease-in-out; color: var(--text-color-secondary); width: 12px; text-align: center; }
  .expand-icon.expanded { transform: rotate(90deg); }
  .campaign-hierarchy-name { font-family: 'SF Mono', 'Courier New', monospace; word-break: break-all; flex-grow: 1; font-size: 0.9rem; font-weight: 400; }
  .campaign-hierarchy-header .campaign-item-budget, .campaign-hierarchy-header .delete-button { flex-shrink: 0; }
  .campaign-hierarchy-content { padding: 0.75rem 1.5rem 0.75rem 2.5rem; background-color: var(--surface-color); border-top: 1px solid var(--border-color); }
  
  .campaign-settings-container { background-color: var(--bg-color); padding: 1rem 1.5rem; margin-bottom: 1rem; border-radius: var(--border-radius); border: 1px solid var(--border-color); }
  .campaign-settings-container h4 { margin: 0 0 1rem 0; font-size: 0.9rem; font-weight: 700; }
  .placement-modifiers { display: flex; gap: 2rem; align-items: center; }
  .placement-modifier-group { display: flex; align-items: center; gap: 0.5rem; }
  .placement-modifier-group label { margin-bottom: 0; font-size: 0.85rem; }
  .placement-modifier-group input { width: 70px; }
  .placement-modifier-group span { color: var(--text-color-secondary); }

  .ad-group-item:not(:first-child) { border-top: 1px solid var(--border-color); }
  .ad-group-header { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; cursor: pointer; }
  .ad-group-header:hover { background-color: rgba(255, 255, 255, 0.03); margin: 0 -1rem; padding: 0.75rem 1rem; border-radius: var(--border-radius); }
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
  
  .ad-group-details-container { padding: 0.5rem 0 1rem 2.2rem; animation: fadeInUp 0.3s ease-out; }
  .ad-group-details-container .keyword-table { background: var(--surface-color-2); border: 1px solid var(--border-color); border-radius: var(--border-radius); }
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
`;