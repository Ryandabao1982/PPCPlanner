import React from 'react';

interface HealthIssues {
    errors: string[];
    warnings: string[];
}

interface PlanHealthCheckProps {
    issues: HealthIssues;
    onRerun: () => void;
}

export const PlanHealthCheck: React.FC<PlanHealthCheckProps> = ({ issues, onRerun }) => {
    const { errors, warnings } = issues;

    return (
        <div className="section">
            <div className="health-check-header" style={{padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)'}}>
                <h2 style={{padding: 0, border: 'none', fontSize: '1.1rem'}}>Plan Health Check</h2>
                <button className="button health-check-rerun-btn" onClick={onRerun}>Re-run</button>
            </div>
            <div style={{padding: '1.5rem'}}>
                {errors.length > 0 && (
                    <>
                        <h3 style={{marginTop: 0, fontSize: '0.9rem', color: 'var(--error-color)'}}>Errors ({errors.length})</h3>
                        <ul className="health-check-list">
                            {errors.map((error, index) => (
                                <li key={`err-${index}`} className="health-issue health-issue-error">
                                    <span className="health-issue-icon">
                                        <i className="fa-solid fa-circle-exclamation"></i>
                                    </span>
                                    <span className="health-issue-message" dangerouslySetInnerHTML={{ __html: error }}></span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {warnings.length > 0 && (
                     <>
                        <h3 style={{marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--warning-color)'}}>Warnings ({warnings.length})</h3>
                        <ul className="health-check-list">
                            {warnings.map((warning, index) => (
                                <li key={`warn-${index}`} className="health-issue health-issue-warning">
                                    <span className="health-issue-icon">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                    </span>
                                    <span className="health-issue-message" dangerouslySetInnerHTML={{ __html: warning }}></span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                 {errors.length === 0 && warnings.length === 0 && (
                    <div className="empty-state" style={{padding: '1rem', background: 'rgba(35, 134, 54, 0.1)', borderColor: 'rgba(35, 134, 54, 0.3)', color: '#3fb950'}}>
                        <i className="fa-solid fa-check-circle" style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}></i>
                        <p style={{margin:0}}>No issues detected!</p>
                    </div>
                 )}
            </div>
        </div>
    );
};