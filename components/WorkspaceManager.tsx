import React, { useState, useMemo } from 'react';

interface WorkspaceManagerProps {
    workspaces: any;
    activeWorkspaceId: string | null;
    onSelect: (id: string) => void;
    onCreate: (brandName: string) => void;
    onDelete: (id: string | null) => void;
}

export const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ workspaces, activeWorkspaceId, onSelect, onCreate, onDelete }) => {
    const [newBrandName, setNewBrandName] = useState('');
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
    
    return (
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            {workspaceCount > 0 && (
                 <select value={activeWorkspaceId || ''} onChange={e => onSelect(e.target.value)} style={{minWidth: '150px'}}>
                    {Object.entries(workspaces).map(([id, ws]) => (
                        <option key={id} value={id}>{(ws as any).name}</option>
                    ))}
                </select>
            )}
            <input 
                type="text"
                value={newBrandName}
                onChange={e => setNewBrandName(e.target.value)}
                placeholder="Create new brand..."
                style={{width: '200px'}}
            />
            <button className="button" onClick={handleCreate} disabled={!newBrandName.trim() || isDuplicate} style={{margin: 0, width: 'auto'}}>
                Create
            </button>
            {workspaceCount > 0 && (
                 <button 
                    className="delete-button" 
                    onClick={() => onDelete(activeWorkspaceId)} 
                    disabled={!activeWorkspaceId}
                    title="Delete current brand"
                    style={{margin: 0, width: 'auto', padding: '0.65rem'}}
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            )}
        </div>
    );
};