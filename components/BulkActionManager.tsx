import React, { useState, useEffect } from 'react';
import { NAMING_COMPONENTS } from '../utils/constants';

interface Keyword {
    id: number;
    text: string;
    intent: string;
}

interface BulkActionManagerProps {
    keywords: Keyword[];
    onBulkUpdate: (ids: number[], updates: any) => void;
    onBulkDelete: (ids: number[]) => void;
    disabled: boolean;
}

export const BulkActionManager: React.FC<BulkActionManagerProps> = ({ keywords, onBulkUpdate, onBulkDelete, disabled }) => {
    const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
    const [action, setAction] = useState('update_intent');
    const [updateValue, setUpdateValue] = useState(NAMING_COMPONENTS.INTENT[0].value);

    useEffect(() => {
        if (action === 'update_intent') {
            setUpdateValue(NAMING_COMPONENTS.INTENT[0].value);
        }
    }, [action]);


    const handleSelect = (kwId: number) => {
        setSelectedKeywords(prev => 
            prev.includes(kwId) ? prev.filter(id => id !== kwId) : [...prev, kwId]
        );
    };

    const handleSelectAll = () => {
        if (selectedKeywords.length === keywords.length) {
            setSelectedKeywords([]);
        } else {
            setSelectedKeywords(keywords.map(kw => kw.id));
        }
    };
    
    const handleApply = () => {
        if (selectedKeywords.length === 0) return;

        if (action === 'delete') {
            onBulkDelete(selectedKeywords);
        } else if (action === 'update_intent') {
            onBulkUpdate(selectedKeywords, { intent: updateValue });
        }
        setSelectedKeywords([]);
    };
    
    return (
        <div className="section">
            <h2>Bulk Actions (Keyword Bank)</h2>
            <div>
                <div className="bulk-actions-toolbar">
                    <span>With {selectedKeywords.length} selected:</span>
                    <select value={action} onChange={e => setAction(e.target.value)}>
                        <option value="update_intent">Change Intent to...</option>
                        <option value="delete">Delete</option>
                    </select>
                    {action === 'update_intent' && (
                        <select value={updateValue} onChange={e => setUpdateValue(e.target.value)}>
                            {NAMING_COMPONENTS.INTENT.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                        </select>
                    )}
                    <button className="button" style={{width: 'auto', marginTop: 0}} onClick={handleApply} disabled={disabled || selectedKeywords.length === 0}>
                        Apply
                    </button>
                    <button className="delete-button" onClick={() => onBulkDelete(selectedKeywords)} disabled={disabled || selectedKeywords.length === 0}>
                        Delete Selected
                    </button>
                </div>
                 <div className="keyword-table-container">
                    <table className="keyword-table">
                        <thead>
                            <tr>
                                <th>
                                    <input 
                                        type="checkbox"
                                        checked={keywords.length > 0 && selectedKeywords.length === keywords.length}
                                        onChange={handleSelectAll} 
                                    />
                                </th>
                                <th>Keyword</th>
                                <th>Intent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keywords.map(kw => {
                                return (
                                    <tr key={kw.id}>
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedKeywords.includes(kw.id)}
                                                onChange={() => handleSelect(kw.id)}
                                            />
                                        </td>
                                        <td>{kw.text}</td>
                                        <td>{kw.intent}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};