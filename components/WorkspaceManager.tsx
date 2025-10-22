import React, { useState, useMemo, useRef } from 'react';

interface WorkspaceManagerProps {
    workspaces: any;
    activeWorkspaceId: string | null;
    onSelect: (id: string) => void;
    onCreate: (brandName: string) => void;
    onDelete: (id: string | null) => void;
    onExportData: () => void;
    onImportData: (file: File) => void;
}

export const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ workspaces, activeWorkspaceId, onSelect, onCreate, onDelete, onExportData, onImportData }) => {
    const [newBrandName, setNewBrandName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const workspaceCount = Object.keys(workspaces).length;

    const existingBrands = useMemo(() => {
        return Object.values(workspaces).map((ws: any) => ws.brand);
    }, [workspaces]);
    
    const isDuplicate = useMemo(() => {
        return existingBrands.includes(newBrandName.trim());
    }, [existingBrands, newBrandName]);

    const handleCreate = () => {
        if (newBrandName.trim() && !isDuplicate) {
            onCreate(newBrandName.trim());
            setNewBrandName('');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImportData(file);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    
    return (
        <div className="workspace-toolbar">
            <div className="workspace-actions">
                {workspaceCount > 0 && (
                    <select className="workspace-selector" value={activeWorkspaceId || ''} onChange={e => onSelect(e.target.value)}>
                        {Object.entries(workspaces).map(([id, ws]) => (
                            <option key={id} value={id}>{(ws as any).name}</option>
                        ))}
                    </select>
                )}
                <div className="brand-input-group">
                    <input 
                        type="text"
                        value={newBrandName}
                        onChange={e => setNewBrandName(e.target.value)}
                        placeholder="Create new brand..."
                        className="brand-input"
                    />
                    <button className="button" onClick={handleCreate} disabled={!newBrandName.trim() || isDuplicate}>
                        Create
                    </button>
                </div>
                {workspaceCount > 0 && (
                    <button 
                        className="delete-button" 
                        onClick={() => onDelete(activeWorkspaceId)} 
                        disabled={!activeWorkspaceId}
                        title="Delete current brand"
                        aria-label="Delete current brand"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                )}
            </div>
            <div className="workspace-utilities">
                <button 
                    className="button" 
                    onClick={onExportData}
                    disabled={workspaceCount === 0}
                    title="Export all workspace data"
                >
                    <i className="fa-solid fa-file-export"></i> Export Data
                </button>
                <button 
                    className="button" 
                    onClick={handleImportClick}
                    title="Import workspace data"
                >
                    <i className="fa-solid fa-file-import"></i> Import Data
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    style={{display: 'none'}}
                />
            </div>
        </div>
    );
};