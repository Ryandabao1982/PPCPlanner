import React, { useState } from 'react';

const DOC_TABS = [
    { id: 'start', label: 'Getting Started', icon: 'fa-solid fa-rocket' },
    { id: 'manual', label: 'User Manual', icon: 'fa-solid fa-book' },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: 'fa-solid fa-keyboard' },
    { id: 'faq', label: 'FAQ', icon: 'fa-solid fa-circle-question' },
    { id: 'glossary', label: 'PPC Glossary', icon: 'fa-solid fa-spell-check' },
    { id: 'arch', label: 'Architecture', icon: 'fa-solid fa-diagram-project' },
];

const DocsTabNav = ({ activeTab, onTabClick }) => (
    <nav className="tab-nav" style={{ padding: '0 1.5rem' }}>
        {DOC_TABS.map(tab => (
            <button 
                key={tab.id} 
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`} 
                onClick={() => onTabClick(tab.id)}
            >
                <i className={tab.icon} style={{ marginRight: '0.5rem' }}></i>
                {tab.label}
            </button>
        ))}
    </nav>
);

const GettingStartedContent = () => (
    <>
        <h1>Welcome to the Good-Wit PPC Planner</h1>
        <p>This application is a comprehensive tool designed to help Amazon advertisers plan, structure, and export their PPC campaigns according to established best practices. It streamlines the workflow from strategic planning to a ready-to-upload bulksheet file.</p>
        
        <h2>Core Workflow at a Glance</h2>
        <p>Follow these five key stages to build a complete campaign plan from scratch.</p>

        <div className="workflow-steps">
            <div className="workflow-step">
                <i className="fa-solid fa-boxes-stacked"></i>
                <h3>1. Setup</h3>
                <p>Create a brand workspace and populate your product bank with the SKUs and ASINs you will be advertising.</p>
            </div>
            <div className="workflow-step">
                <i className="fa-solid fa-lightbulb"></i>
                <h3>2. Discover</h3>
                <p>Use the AI-powered Keyword Bank to discover keyword variations and related terms from a few seed ideas.</p>
            </div>
            <div className="workflow-step">
                <i className="fa-solid fa-sitemap"></i>
                <h3>3. Build</h3>
                <p>Generate consistently named campaigns and ad groups from the pre-defined playbook.</p>
            </div>
            <div className="workflow-step">
                <i className="fa-solid fa-link"></i>
                <h3>4. Assign</h3>
                <p>Use the Assigner tools to link your keywords and products to the correct ad groups.</p>
            </div>
            <div className="workflow-step">
                <i className="fa-solid fa-circle-check"></i>
                <h3>5. Finalize</h3>
                <p>Run the Health Check to catch issues, freeze the plan to prevent changes, and export your bulksheet.</p>
            </div>
        </div>

        <h2>Navigating the Docs</h2>
        <p>Use the tabs at the top of this page to explore different sections of the documentation:</p>
        <ul>
            <li><strong>User Manual:</strong> Mini Standard Operating Procedures (SOPs) for each tool.</li>
            <li><strong>Architecture:</strong> A technical overview of the application's structure and data flow.</li>
            <li><strong>UI/UX Guide:</strong> Details on the design principles and component philosophy.</li>
            <li><strong>Function Reference:</strong> In-depth explanations of key logic like the exporter.</li>
        </ul>
    </>
);

const UserManualContent = () => (
    <>
        <h1>User Manual & Mini SOPs</h1>
        <p>This guide provides Standard Operating Procedures (SOPs) for each key tool in the planner.</p>

        <h2>SOP: Workspace & Asset Setup</h2>
        <ol className="sop-list">
            <li>
                <div>
                    <strong>Create a Brand Workspace</strong>
                    Use the input field in the main header to create a new brand. Each brand is a separate workspace.
                </div>
            </li>
            <li>
                <div>
                    <strong>Add Products to the Bank</strong>
                    Navigate to <code>Assets &gt; Product Bank</code>. Add the SKUs and ASINs you intend to advertise. This is crucial for linking ads to the correct listings.
                </div>
            </li>
        </ol>

        <div className="info-box">
            <i className="fa-solid fa-circle-info"></i>
            <p><strong>Best Practice:</strong> Add both parent and child ASINs to the product bank. The Product Assigner tool will automatically filter out parent ASINs (which cannot be advertised) to prevent errors.</p>
        </div>

        <h2>SOP: Keyword Discovery & Management</h2>
        <ol className="sop-list">
            <li>
                <div>
                    <strong>Generate AI Suggestions</strong>
                    Go to <code>Keywords &gt; Keyword Bank</code>. Enter a few "seed" keywords, select a default intent, and click <strong>Analyze & Suggest Keywords</strong>.
                </div>
            </li>
            <li>
                <div>
                    <strong>Review and Add to Bank</strong>
                    The AI will provide suggestions and flag potential negative keywords. Select the keywords you want from the staging area and click <strong>Add Selected to Bank</strong>.
                </div>
            </li>
            <li>
                <div>
                    <strong>Perform Bulk Actions</strong>
                    Switch to the <code>Bulk Actions</code> tab to quickly change the intent for multiple keywords or delete them from the bank.
                </div>
            </li>
        </ol>

        <h2>SOP: Campaign & Ad Group Creation</h2>
        <ol className="sop-list">
            <li>
                <div>
                    <strong>Generate from Playbook</strong>
                    Navigate to the <code>Campaigns</code> view. Use the Campaign Generator to select a playbook strategy, link a primary product, and set a budget. A campaign and a default ad group will be created instantly.
                </div>
            </li>
            <li>
                <div>
                    <strong>Create Additional Ad Groups</strong>
                    Navigate to the <code>Ad Groups</code> view. Select the parent campaign and fill out the naming convention components (Match Type, Intent, etc.) to create more ad groups.
                </div>
            </li>
            <li>
                <div>
                    <strong>Adjust Settings in the Hierarchy</strong>
                    Return to the <code>Campaigns</code> view. In the "Campaign Structure" list, you can directly edit campaign names, budgets, and placement modifiers.
                </div>
            </li>
        </ol>
        
        <h2>SOP: Assignment & Bidding</h2>
        <ol className="sop-list">
            <li>
                <div>
                    <strong>Assign Keywords</strong>
                    Go to <code>Keywords &gt; Keyword Assigner</code>. Select one or more target ad groups, then select available keywords from the bank and click the arrow button to assign them.
                </div>
            </li>
            <li>
                <div>
                    <strong>Assign Products</strong>
                    Go to <code>Assets &gt; Product Assigner</code>. Select an ad group and assign the relevant product(s). This is especially important for multi-product SB creatives.
                </div>
            </li>
            <li>
                <div>
                    <strong>Set Bid Overrides</strong>
                    Go to the <code>Bidding</code> view. Select an ad group to see its keywords. You can enter a specific bid for any keyword to override the ad group's default bid.
                </div>
            </li>
        </ol>

        <h2>SOP: Finalization & Export</h2>
        <ol className="sop-list">
            <li>
                <div>
                    <strong>Run Health Check</strong>
                    Go to the <code>Dashboard</code>. Review the Health Check widget for critical errors (red) or warnings (yellow). Fix any issues before proceeding.
                </div>
            </li>
            <li>
                <div>
                    <strong>Freeze the Plan</strong>
                    In the "Plan Approval" widget on the Dashboard, click <strong>Freeze & Lock Plan</strong>. This prevents accidental edits and prepares the plan for export.
                </div>
            </li>
            <li>
                <div>
                    <strong>Export the Bulksheet</strong>
                    Once frozen, the export button becomes active. Click <strong>Export for Bulk Upload (XLSX)</strong> to download the file, which can be uploaded directly to the Amazon Advertising console.
                </div>
            </li>
        </ol>
    </>
);

const ArchitectureContent = () => (
    <>
        <h1>Application Architecture</h1>
        <p>This document provides a technical overview of the PPC Planner's architecture.</p>

        <h2>Core Stack</h2>
        <ul>
            <li><strong>Framework:</strong> React 19</li>
            <li><strong>Rendering:</strong> <code>react-dom/client</code> (Concurrent Mode)</li>
            <li><strong>Language:</strong> TypeScript</li>
            <li><strong>Styling:</strong> CSS-in-JS (via a <code>styles.ts</code> file)</li>
            <li><strong>Bundling:</strong> Vite 6.2.0 for fast development and optimized builds</li>
        </ul>

        <h2>State Management</h2>
        <p>The application employs a centralized, "vanilla React" state management approach.</p>
        <ul>
            <li><strong>Single Source of Truth:</strong> The entire application state, including all workspaces, campaigns, products, etc., is managed within the top-level <code>&lt;App /&gt;</code> component using the <code>useState</code> hook.</li>
            <li><strong>Data Persistence:</strong> The <code>useLocalStorage</code> custom hook is used to persist the main state objects (<code>workspaces</code>, <code>activeWorkspaceId</code>) to the browser's local storage. This ensures that the user's work is saved between sessions.</li>
            <li><strong>Unidirectional Data Flow:</strong> State is held in the <code>&lt;App /&gt;</code> component and passed down to child components as props. Child components call handler functions passed from <code>&lt;App /&gt;</code> to update the state, triggering a re-render.</li>
        </ul>

        <h2>Component Structure</h2>
        <p>The application is broken down into functional components, each with a specific responsibility, located in the <code>/components</code>, <code>/hooks</code>, and <code>/utils</code> directories.</p>
        
        <h2>Key Features</h2>
        <ul>
            <li><strong>Workspace Management:</strong> Multi-brand support with isolated state per workspace</li>
            <li><strong>AI Integration:</strong> Google Gemini API for keyword generation and report analysis</li>
            <li><strong>Export System:</strong> Amazon Ads Bulksheet 2.0 compatible XLSX generation</li>
            <li><strong>Activity Logging:</strong> Complete audit trail of all user actions</li>
            <li><strong>Health Checking:</strong> Validation system to ensure campaign completeness</li>
        </ul>

        <h2>Key Logic and Modules</h2>
        <ul>
            <li><strong>Bulksheet Generation (<code>utils/helpers.ts</code>):</strong> The <code>generateBulkUploadXlsx</code> function is the core of the export feature. It takes the entire workspace state and uses the <code>sheetjs-xlsx</code> library to construct a multi-sheet <code>.xlsx</code> file that strictly adheres to the Amazon Bulksheets 2.0 format.</li>
            <li><strong>AI Integration (<code>components/KeywordBank.tsx</code>):</strong> The Keyword Bank component integrates with the Gemini API. It constructs a detailed prompt and specifies a JSON schema for the response, ensuring the data returned from the API is structured and easy to parse.</li>
            <li><strong>Report Generation (<code>components/PlanReportGenerator.tsx</code>):</strong> AI-powered analysis engine that generates comprehensive brand presentation reports with insights, recommendations, and projections.</li>
        </ul>

        <div className="info-box" style={{ marginTop: '1.5rem' }}>
            <i className="fa-solid fa-info-circle"></i>
            <p><strong>Note:</strong> The application is fully client-side with no backend server. All processing happens in the browser, ensuring privacy and fast performance.</p>
        </div>
    </>
);

const FunctionReferenceContent = () => (
    <>
        <h1>Function Reference</h1>
        <p>This document provides a detailed explanation of key functions and complex logic within the application.</p>
        
        <h2><code>generateBulkUploadXlsx(workspace, fileName)</code></h2>
        <p><strong>Location:</strong> <code>utils/helpers.ts</code></p>
        <p><strong>Purpose:</strong> This is the main function responsible for converting the application's state into a downloadable, Amazon-compliant <code>.xlsx</code> file.</p>
        <p><strong>Process:</strong> It filters campaigns by type (SP, SB, SD), calls a dedicated generator function for each type to create the data rows, converts the data to a worksheet, and appends it to a workbook which is then downloaded.</p>

        <div className="info-box">
          <i className="fa-solid fa-code"></i>
          <p>This function handles all the complex formatting requirements for each entity, such as mapping internal bidding strategy values (e.g., <code>up_down</code>) to the required Amazon string (e.g., <code>Dynamic bids - up and down</code>).</p>
        </div>

        <h2>AI Keyword Generation Logic</h2>
        <p><strong>Location:</strong> <code>components/KeywordBank.tsx</code></p>
        <p><strong>Purpose:</strong> To use the Gemini API to generate keyword ideas and identify potential negative keywords from a user-provided seed list.</p>
        <p><strong>Process:</strong> It constructs a detailed prompt for the AI model and defines a <code>responseSchema</code> in the API call. This tells Gemini to structure its output as a specific JSON object, which removes the need for fragile string parsing and ensures a reliable data structure.</p>
    </>
);

const KeyboardShortcutsContent = () => (
    <>
        <h1>Keyboard Shortcuts</h1>
        <p>Master these keyboard shortcuts to navigate the PPC Planner efficiently.</p>

        <h2>Global Shortcuts</h2>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Shortcut</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}><kbd>Ctrl/Cmd + K</kbd></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Open Command Palette</td>
                    </tr>
                    <tr style={{ backgroundColor: 'white' }}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}><kbd>Ctrl/Cmd + H</kbd></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Open Help & Documentation</td>
                    </tr>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}><kbd>Ctrl/Cmd + S</kbd></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Save workspace (auto-saves to localStorage)</td>
                    </tr>
                    <tr style={{ backgroundColor: 'white' }}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}><kbd>Esc</kbd></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Close modals and dialogs</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h2>Navigation Shortcuts</h2>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#667eea', color: 'white' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Shortcut</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #ddd' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}><kbd>1-9</kbd></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Quick navigate to sidebar sections (when focused)</td>
                    </tr>
                    <tr style={{ backgroundColor: 'white' }}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}><kbd>Tab</kbd></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Move between form fields</td>
                    </tr>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}><kbd>Enter</kbd></td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Submit forms or activate buttons</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div className="info-box" style={{ marginTop: '1.5rem' }}>
            <i className="fa-solid fa-lightbulb"></i>
            <p><strong>Pro Tip:</strong> Most actions in the planner can be accessed via the Command Palette (Ctrl/Cmd + K), which also shows available keyboard shortcuts.</p>
        </div>
    </>
);

const FAQContent = () => (
    <>
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about using the PPC Planner.</p>

        <h2>General Questions</h2>
        <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                <i className="fa-solid fa-question-circle" style={{ marginRight: '0.5rem' }}></i>
                What is the PPC Planner?
            </h3>
            <p>The PPC Planner is a comprehensive tool for planning and structuring Amazon PPC campaigns. It helps you organize campaigns, keywords, and products before uploading to Amazon Ads.</p>
        </div>

        <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                <i className="fa-solid fa-question-circle" style={{ marginRight: '0.5rem' }}></i>
                How do I export my campaign plan?
            </h3>
            <p>First, run a Health Check to ensure your plan is complete. Then, freeze your plan in the Dashboard using the "Freeze & Lock Plan" button. Once frozen, you can export it as an Amazon Ads-compatible XLSX file.</p>
        </div>

        <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                <i className="fa-solid fa-question-circle" style={{ marginRight: '0.5rem' }}></i>
                Where is my data stored?
            </h3>
            <p>All your data is stored locally in your browser's localStorage. No data is sent to external servers except when using AI features (keyword generation and report generation).</p>
        </div>

        <h2>Workflow Questions</h2>
        <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                <i className="fa-solid fa-question-circle" style={{ marginRight: '0.5rem' }}></i>
                What's the recommended workflow?
            </h3>
            <p>Follow these steps: 1) Create a workspace and add products, 2) Generate keywords using AI, 3) Create campaigns from playbooks, 4) Create ad groups, 5) Assign keywords and products, 6) Set goals and bids, 7) Run health check, 8) Freeze and export.</p>
        </div>

        <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                <i className="fa-solid fa-question-circle" style={{ marginRight: '0.5rem' }}></i>
                Can I undo changes?
            </h3>
            <p>Currently, there's no undo feature. However, you can unfreeze a plan to make edits, and all changes are logged in the Activity Log for reference.</p>
        </div>

        <h2>Technical Questions</h2>
        <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                <i className="fa-solid fa-question-circle" style={{ marginRight: '0.5rem' }}></i>
                Do I need an API key?
            </h3>
            <p>An API key is only required for AI features (keyword generation and report generation). All other features work without an API key.</p>
        </div>

        <div className="faq-item" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                <i className="fa-solid fa-question-circle" style={{ marginRight: '0.5rem' }}></i>
                What browsers are supported?
            </h3>
            <p>The PPC Planner works best on modern browsers: Chrome, Firefox, Safari, and Edge (latest versions). Internet Explorer is not supported.</p>
        </div>
    </>
);

const GlossaryContent = () => (
    <>
        <h1>PPC Glossary</h1>
        <p>Essential Amazon PPC terms and definitions to help you understand campaign planning.</p>

        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
            <div className="glossary-term" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>ACoS (Advertising Cost of Sales)</h3>
                <p style={{ marginBottom: '0.5rem' }}>The percentage of attributed sales spent on advertising. Calculated as: (Ad Spend ÷ Sales) × 100</p>
                <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>Example: $50 in ad spend generating $200 in sales = 25% ACoS</p>
            </div>

            <div className="glossary-term" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>ROAS (Return on Ad Spend)</h3>
                <p style={{ marginBottom: '0.5rem' }}>The revenue generated for every dollar spent on advertising. Calculated as: Sales ÷ Ad Spend</p>
                <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>Example: $200 in sales from $50 ad spend = 4x ROAS</p>
            </div>

            <div className="glossary-term" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>CPC (Cost Per Click)</h3>
                <p style={{ marginBottom: '0.5rem' }}>The amount you pay each time someone clicks on your ad. Calculated as: Ad Spend ÷ Clicks</p>
                <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>Example: $100 spent on 200 clicks = $0.50 CPC</p>
            </div>

            <div className="glossary-term" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>CTR (Click-Through Rate)</h3>
                <p style={{ marginBottom: '0.5rem' }}>The percentage of impressions that resulted in clicks. Calculated as: (Clicks ÷ Impressions) × 100</p>
                <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>Example: 100 clicks from 10,000 impressions = 1% CTR</p>
            </div>

            <div className="glossary-term" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>CVR (Conversion Rate)</h3>
                <p style={{ marginBottom: '0.5rem' }}>The percentage of clicks that resulted in a sale. Calculated as: (Orders ÷ Clicks) × 100</p>
                <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>Example: 20 orders from 100 clicks = 20% CVR</p>
            </div>

            <div className="glossary-term" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Match Types</h3>
                <p style={{ marginBottom: '0.5rem' }}>Determines how closely a customer's search must match your keyword:</p>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li><strong>Exact:</strong> Matches exact keyword or close variants</li>
                    <li><strong>Phrase:</strong> Matches keyword phrase in any order with additional words</li>
                    <li><strong>Broad:</strong> Matches related searches and synonyms</li>
                </ul>
            </div>

            <div className="glossary-term" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Keyword Intent</h3>
                <p style={{ marginBottom: '0.5rem' }}>The purpose behind a search query:</p>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li><strong>Branded:</strong> Searches including your brand name</li>
                    <li><strong>Generic:</strong> General product category searches</li>
                    <li><strong>Competitor:</strong> Searches for competitor brands</li>
                    <li><strong>Research:</strong> Informational or comparison searches</li>
                </ul>
            </div>

            <div className="glossary-term" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Sponsored Product (SP)</h3>
                <p style={{ marginBottom: '0.5rem' }}>Keyword-targeted ads that appear in search results and product detail pages.</p>
            </div>

            <div className="glossary-term" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Sponsored Brand (SB)</h3>
                <p style={{ marginBottom: '0.5rem' }}>Ads featuring your brand logo, custom headline, and multiple products in search results.</p>
            </div>

            <div className="glossary-term" style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
                <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Placement Modifiers</h3>
                <p style={{ marginBottom: '0.5rem' }}>Bid adjustments for specific ad placements:</p>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li><strong>Top of Search:</strong> First page of search results</li>
                    <li><strong>Product Pages:</strong> On competitor or related product pages</li>
                </ul>
            </div>
        </div>
    </>
);

export const DocumentationViewer = () => {
    const [activeTab, setActiveTab] = useState('start');
    const [searchTerm, setSearchTerm] = useState('');

    const renderDocContent = () => {
        switch (activeTab) {
            case 'start': return <GettingStartedContent />;
            case 'manual': return <UserManualContent />;
            case 'shortcuts': return <KeyboardShortcutsContent />;
            case 'faq': return <FAQContent />;
            case 'glossary': return <GlossaryContent />;
            case 'arch': return <ArchitectureContent />;
            default: return null;
        }
    };

    return (
        <div className="docs-container">
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #ddd', background: '#f8f9fa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <i className="fa-solid fa-search" style={{ color: '#667eea' }}></i>
                    <input
                        type="text"
                        placeholder="Search documentation... (coming soon)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem 1rem',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '0.95rem'
                        }}
                        disabled
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a 
                            href="https://github.com/Ryandabao1982/PPCPlanner" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                                padding: '0.5rem 1rem', 
                                background: '#667eea', 
                                color: 'white', 
                                borderRadius: '6px',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <i className="fa-brands fa-github"></i>
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
            <DocsTabNav activeTab={activeTab} onTabClick={setActiveTab} />
            <div className="docs-content">
                {renderDocContent()}
            </div>
        </div>
    );
};
