import React, { useState } from 'react';

interface Version {
    id: number;
    timestamp: string;
    label: string;
    userName: string;
    snapshot: any;
    changes: string[];
}

interface VersionControlProps {
    versions: Version[];
    currentVersion: number;
    onRestoreVersion: (versionId: number) => void;
    onSaveVersion: (label: string) => void;
    onCompareVersions: (version1: number, version2: number) => void;
}

export const VersionControl: React.FC<VersionControlProps> = ({
    versions,
    currentVersion,
    onRestoreVersion,
    onSaveVersion,
    onCompareVersions
}) => {
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [versionLabel, setVersionLabel] = useState('');
    const [selectedVersions, setSelectedVersions] = useState<number[]>([]);
    const [showCompare, setShowCompare] = useState(false);

    const handleSaveVersion = () => {
        if (versionLabel.trim()) {
            onSaveVersion(versionLabel.trim());
            setVersionLabel('');
            setShowSaveModal(false);
        }
    };

    const handleVersionSelect = (versionId: number) => {
        setSelectedVersions(prev => {
            if (prev.includes(versionId)) {
                return prev.filter(id => id !== versionId);
            } else if (prev.length < 2) {
                return [...prev, versionId];
            } else {
                return [prev[1], versionId];
            }
        });
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const sortedVersions = [...versions].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
        <div className="section">
            <div className="section-header">
                <h2>
                    <i className="fa-solid fa-code-branch"></i>
                    Version History
                </h2>
                <div className="section-actions">
                    <button 
                        className="btn btn-secondary"
                        onClick={() => setShowSaveModal(true)}
                    >
                        <i className="fa-solid fa-save"></i>
                        Save Version
                    </button>
                    {selectedVersions.length === 2 && (
                        <button 
                            className="btn btn-info"
                            onClick={() => {
                                onCompareVersions(selectedVersions[0], selectedVersions[1]);
                                setShowCompare(true);
                            }}
                        >
                            <i className="fa-solid fa-code-compare"></i>
                            Compare Selected
                        </button>
                    )}
                </div>
            </div>

            <div className="version-timeline">
                {sortedVersions.length === 0 ? (
                    <div className="empty-state">
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        <p>No saved versions yet</p>
                        <p className="empty-state-hint">Save a version to create a restore point</p>
                    </div>
                ) : (
                    sortedVersions.map((version, index) => {
                        const isCurrentVersion = version.id === currentVersion;
                        const isSelected = selectedVersions.includes(version.id);
                        
                        return (
                            <div 
                                key={version.id} 
                                className={`version-item ${isCurrentVersion ? 'current-version' : ''} ${isSelected ? 'selected-version' : ''}`}
                            >
                                <div className="version-marker">
                                    <div className="version-dot"></div>
                                    {index < sortedVersions.length - 1 && <div className="version-line"></div>}
                                </div>
                                
                                <div className="version-content">
                                    <div className="version-header">
                                        <div className="version-info">
                                            <h3 className="version-label">
                                                {version.label}
                                                {isCurrentVersion && (
                                                    <span className="version-badge">Current</span>
                                                )}
                                            </h3>
                                            <div className="version-meta">
                                                <span className="version-user">
                                                    <i className="fa-solid fa-user"></i>
                                                    {version.userName}
                                                </span>
                                                <span className="version-time">
                                                    <i className="fa-solid fa-clock"></i>
                                                    {formatDate(version.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="version-actions">
                                            <label className="version-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleVersionSelect(version.id)}
                                                />
                                                <span>Compare</span>
                                            </label>
                                            {!isCurrentVersion && (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => {
                                                        if (confirm(`Restore version "${version.label}"? Current changes will be lost.`)) {
                                                            onRestoreVersion(version.id);
                                                        }
                                                    }}
                                                >
                                                    <i className="fa-solid fa-rotate-left"></i>
                                                    Restore
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {version.changes && version.changes.length > 0 && (
                                        <div className="version-changes">
                                            <h4>Changes:</h4>
                                            <ul>
                                                {version.changes.slice(0, 3).map((change, idx) => (
                                                    <li key={idx}>{change}</li>
                                                ))}
                                                {version.changes.length > 3 && (
                                                    <li className="version-more">
                                                        +{version.changes.length - 3} more changes
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {showSaveModal && (
                <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Save Version</h2>
                            <button className="modal-close" onClick={() => setShowSaveModal(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Version Label</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Before budget changes, Q4 Campaign setup"
                                    value={versionLabel}
                                    onChange={(e) => setVersionLabel(e.target.value)}
                                    autoFocus
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSaveVersion();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn btn-secondary" 
                                onClick={() => setShowSaveModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleSaveVersion}
                                disabled={!versionLabel.trim()}
                            >
                                <i className="fa-solid fa-save"></i>
                                Save Version
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const VersionComparison: React.FC<{
    version1: Version;
    version2: Version;
    onClose: () => void;
}> = ({ version1, version2, onClose }) => {
    const calculateDiff = () => {
        const diff: { field: string; before: any; after: any }[] = [];
        
        if (version1.snapshot && version2.snapshot) {
            // Compare campaigns
            if (version1.snapshot.campaigns?.length !== version2.snapshot.campaigns?.length) {
                diff.push({
                    field: 'Campaigns Count',
                    before: version1.snapshot.campaigns?.length || 0,
                    after: version2.snapshot.campaigns?.length || 0
                });
            }
            
            // Compare keywords
            if (version1.snapshot.keywords?.length !== version2.snapshot.keywords?.length) {
                diff.push({
                    field: 'Keywords Count',
                    before: version1.snapshot.keywords?.length || 0,
                    after: version2.snapshot.keywords?.length || 0
                });
            }
            
            // Compare ad groups
            if (version1.snapshot.adGroups?.length !== version2.snapshot.adGroups?.length) {
                diff.push({
                    field: 'Ad Groups Count',
                    before: version1.snapshot.adGroups?.length || 0,
                    after: version2.snapshot.adGroups?.length || 0
                });
            }
        }
        
        return diff;
    };

    const differences = calculateDiff();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content comparison-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <i className="fa-solid fa-code-compare"></i>
                        Version Comparison
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="comparison-header">
                        <div className="comparison-version">
                            <h3>{version1.label}</h3>
                            <p>{new Date(version1.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="comparison-arrow">
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>
                        <div className="comparison-version">
                            <h3>{version2.label}</h3>
                            <p>{new Date(version2.timestamp).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    {differences.length > 0 ? (
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Field</th>
                                    <th>Before</th>
                                    <th>After</th>
                                    <th>Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {differences.map((diff, idx) => {
                                    const change = diff.after - diff.before;
                                    return (
                                        <tr key={idx}>
                                            <td>{diff.field}</td>
                                            <td>{diff.before}</td>
                                            <td>{diff.after}</td>
                                            <td className={change > 0 ? 'positive-change' : 'negative-change'}>
                                                {change > 0 ? '+' : ''}{change}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="comparison-empty">
                            <p>No significant differences found between these versions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
