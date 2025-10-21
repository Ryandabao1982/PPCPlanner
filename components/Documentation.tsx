import React, { useState } from 'react';

const DOC_TABS = [
    { id: 'start', label: 'Getting Started' },
    { id: 'manual', label: 'User Manual' },
    { id: 'arch', label: 'Architecture' },
    { id: 'ui', label: 'UI/UX Guide' },
    { id: 'ref', label: 'Function Reference' },
];

const DocsTabNav = ({ activeTab, onTabClick }) => (
    <nav className="tab-nav" style={{ padding: '0 1.5rem' }}>
        {DOC_TABS.map(tab => (
            <button key={tab.id} className={`tab-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => onTabClick(tab.id)}>
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
            <li><strong>Bundling/Imports:</strong> Handled by esbuild via AI Studio's environment using import maps.</li>
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
        
        <h2>Key Logic and Modules</h2>
        <ul>
            <li><strong>Bulksheet Generation (<code>utils/helpers.ts</code>):</strong> The <code>generateBulkUploadXlsx</code> function is the core of the export feature. It takes the entire workspace state and uses the <code>sheetjs-xlsx</code> library to construct a multi-sheet <code>.xlsx</code> file that strictly adheres to the Amazon Bulksheets 2.0 format.</li>
            <li><strong>AI Integration (<code>components/KeywordBank.tsx</code>):</strong> The Keyword Bank component integrates with the Gemini API. It constructs a detailed prompt and specifies a JSON schema for the response, ensuring the data returned from the API is structured and easy to parse.</li>
        </ul>
    </>
);

const UiUxGuideContent = () => (
    <>
        <h1>UI/UX Guide</h1>
        <p>This document outlines the design philosophy, style guide, and user experience principles for the PPC Planner.</p>
        
        <h2>Design Philosophy</h2>
        <p>The UI is designed to be:</p>
        <ul>
            <li><strong>Efficient:</strong> The layout is structured to minimize clicks and context switching.</li>
            <li><strong>Clear:</strong> Information is presented in a structured and predictable way with immediate feedback.</li>
            <li><strong>Professional:</strong> The dark theme creates a focused, data-centric environment.</li>
            <li><strong>Safe:</strong> Critical actions like exporting are gated behind a "Freeze" state to prevent errors.</li>
        </ul>

        <h2>Component Library & Patterns</h2>
        <ul>
            <li><strong>Sections:</strong> The primary content container for consistency.</li>
            <li><strong>Tabs:</strong> Organize related functionality within a single view to reduce clutter.</li>
            <li><strong>Forms & Previews:</strong> Generators provide real-time previews for immediate feedback.</li>
            <li><strong>Empty States:</strong> Guide the user on what to do next when a view has no data.</li>
            <li><strong>Toasts:</strong> Non-blocking notifications confirm user actions.</li>
        </ul>
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

export const DocumentationViewer = () => {
    const [activeTab, setActiveTab] = useState('start');

    const renderDocContent = () => {
        switch (activeTab) {
            case 'start': return <GettingStartedContent />;
            case 'manual': return <UserManualContent />;
            case 'arch': return <ArchitectureContent />;
            case 'ui': return <UiUxGuideContent />;
            case 'ref': return <FunctionReferenceContent />;
            default: return null;
        }
    };

    return (
        <div className="docs-container">
            <DocsTabNav activeTab={activeTab} onTabClick={setActiveTab} />
            <div className="docs-content">
                {renderDocContent()}
            </div>
        </div>
    );
};
