import React from 'react';

interface HistoryEntry {
    id: number;
    timestamp: string;
    fileName: string;
    planData: any;
}

interface PlanApproverProps {
    isFrozen: boolean;
    onFreeze: () => void;
    onUnfreeze: () => void;
    onExport: () => void;
    exportHistory: HistoryEntry[];
    onRedownload: (entry: HistoryEntry) => void;
}

export const PlanApprover: React.FC<PlanApproverProps> = ({ isFrozen, onFreeze, onUnfreeze, onExport, exportHistory, onRedownload }) => {
    return (
        <div className="section">
            <h2>Plan Approval & Export</h2>
            <div className="plan-approval-container">
                <div className={`plan-status ${isFrozen ? 'plan-status-frozen' : 'plan-status-editable'}`}>
                    Plan Status: {isFrozen ? 'FROZEN (Read-only)' : 'EDITABLE'}
                </div>
                <div className="plan-approval-buttons">
                    {!isFrozen ? (
                        <button className="button" onClick={onFreeze}>Freeze & Lock Plan</button>
                    ) : (
                        <button className="delete-button" onClick={onUnfreeze}>Unfreeze & Edit Plan</button>
                    )}
                    <button className="button" onClick={onExport} disabled={!isFrozen}>Export for Bulk Upload (XLSX)</button>
                </div>
                <p style={{textAlign: 'center', marginTop: '1rem', marginBottom: '0.5rem', padding: '0', background: 'none', border: 'none', color: 'var(--text-color-secondary)', fontSize: '0.85rem'}}>
                    Freezing the plan locks all inputs and prepares it for export. This prevents accidental changes.
                </p>
                 <p style={{textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-color-secondary)'}}>
                    <a href="https://advertising.amazon.com/API/docs/en-us/bulksheets/2-0/create-sp-campaign" target="_blank" rel="noopener noreferrer">
                        <i className="fa-solid fa-circle-info" style={{marginRight: '0.5rem'}}></i>
                        Learn more about the Amazon Bulksheets 2.0 format.
                    </a>
                </p>
            </div>
             <div className="export-history-section">
                <h3 className="export-history-title">Export History (Last 10)</h3>
                {exportHistory && exportHistory.length > 0 ? (
                    <ul className="export-history-list">
                        {exportHistory.slice().reverse().map(entry => (
                            <li key={entry.id} className="export-history-item">
                                <div className="export-history-info">
                                    <span className="export-history-filename">{entry.fileName}</span>
                                    <span className="export-history-timestamp">
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <button 
                                    className="button redownload-button" 
                                    onClick={() => onRedownload(entry)}
                                    title={`Re-download this version`}
                                >
                                    <i className="fa-solid fa-download"></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="export-history-empty">
                        No exports have been made yet.
                    </div>
                )}
            </div>
        </div>
    );
};