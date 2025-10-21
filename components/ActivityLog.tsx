import React from 'react';

interface Log {
    id: number;
    timestamp: string;
    action: string;
}

interface ActivityLogProps {
    logs: Log[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
    return (
        <div className="section">
            <h2>Activity Log</h2>
            <div className="activity-log-container">
                {logs.length === 0 ? (
                    <div className="empty-state" style={{ marginTop: 0, padding: '2rem 1rem' }}>
                        <i className="fa-solid fa-history"></i>
                        <p>No recent activity.</p>
                    </div>
                ) : (
                    <ul className="activity-log-list">
                        {logs.map(log => (
                            <li key={log.id} className="activity-log-item">
                                <span className="activity-log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                <span className="activity-log-action">{log.action}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
};