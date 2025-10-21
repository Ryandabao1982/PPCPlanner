import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { NAMING_COMPONENTS } from '../utils/constants';
import { stem } from '../utils/helpers';
import { useSortableTable } from '../hooks/useSortableTable';
import { EXCLUSION_WORD_LIST, EXCLUSION_WORD_SET } from '../utils/exclusions';

interface Keyword {
    id: number;
    text: string;
    intent: string;
    stemmed: string;
}

interface StagedKeyword {
    text: string;
    intent: string;
    type?: 'variation' | 'related';
}

interface NegativeCandidate {
    text: string;
    reason: string;
}


interface KeywordBankProps {
    keywords: Keyword[];
    onAdd: (keywords: any[]) => void;
    onUpdate: (id: number, updates: any) => void;
    onDelete: (id: number) => void;
    disabled: boolean;
    showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const LoadingSpinner = () => <div className="spinner"></div>;

export const KeywordBank: React.FC<KeywordBankProps> = ({ keywords, onAdd, onUpdate, onDelete, disabled, showToast }) => {
    const [newKeywords, setNewKeywords] = useState('');
    const [newIntent, setNewIntent] = useState(NAMING_COMPONENTS.INTENT[0].value);
    const { sortedItems, requestSort, sortConfig } = useSortableTable<Keyword>(keywords, 'text');
    
    const [isLoading, setIsLoading] = useState(false);
    const [stagedKeywords, setStagedKeywords] = useState<StagedKeyword[]>([]);
    const [suggestedKeywords, setSuggestedKeywords] = useState<StagedKeyword[]>([]);
    const [negativeCandidates, setNegativeCandidates] = useState<NegativeCandidate[]>([]);
    const [selectedStaged, setSelectedStaged] = useState<Set<string>>(new Set());
    const [selectedSuggested, setSelectedSuggested] = useState<Set<string>>(new Set());

    const clearStagingArea = () => {
        setStagedKeywords([]);
        setSuggestedKeywords([]);
        setNegativeCandidates([]);
        setSelectedStaged(new Set());
        setSelectedSuggested(new Set());
        setNewKeywords('');
    };

    const handleGetSuggestions = async () => {
        const keywordsToProcess = newKeywords.split('\n').map(k => k.trim()).filter(k => k);
        if (keywordsToProcess.length === 0) {
            showToast("Please enter at least one keyword.", "info");
            return;
        }

        setIsLoading(true);
        showToast("Getting AI suggestions...", "info");

        const initialStaged = keywordsToProcess.map(k => ({ text: k, intent: newIntent }));
        setStagedKeywords(initialStaged);
        setSelectedStaged(new Set(initialStaged.map(k => k.text)));
        setSuggestedKeywords([]); // Clear previous suggestions
        setNegativeCandidates([]); // Clear previous candidates
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const exclusionListString = EXCLUSION_WORD_LIST.join(', ');

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `You are an expert Amazon PPC campaign manager. Analyze the following seed keywords: ${keywordsToProcess.join(', ')}. Also, consider this list of exclusion words to identify negative keywords: ${exclusionListString}.

Your task is:
1. Generate keyword variations (plurals, synonyms, rephrasing) for the seed keywords.
2. Generate new, semantically related keywords that are commercially relevant.
3. From the original seed keywords, identify any that contain words from the exclusion list.

RULES:
- Combine variations and related keywords into a single list.
- Generate a maximum of 25 suggestions in total for variations and related keywords combined.
- Do NOT include any keywords in the variations or related lists that contain words from the exclusion list.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            suggestedKeywords: {
                                type: Type.ARRAY,
                                description: 'A combined list of keyword variations and related keywords.',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        text: { type: Type.STRING, description: 'The suggested keyword phrase.' },
                                        type: { type: Type.STRING, description: 'Either "variation" or "related".' }
                                    },
                                    required: ['text', 'type']
                                }
                            },
                            negativeCandidates: {
                                type: Type.ARRAY,
                                description: 'Seed keywords identified as containing exclusion words.',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        text: { type: Type.STRING, description: 'The original seed keyword that is a negative candidate.' },
                                        reason: { type: Type.STRING, description: 'The reason why it is a candidate (e.g., "Contains excluded word \'cheap\'").' }
                                    },
                                    required: ['text', 'reason']
                                }
                            }
                        }
                    }
                }
            });
            
            const jsonStr = response.text.trim();
            const parsedResponse = JSON.parse(jsonStr);

            if (parsedResponse.suggestedKeywords && Array.isArray(parsedResponse.suggestedKeywords)) {
                const newSuggestions = parsedResponse.suggestedKeywords.map((k: any) => ({ 
                    text: k.text, 
                    intent: newIntent,
                    type: k.type 
                }));
                setSuggestedKeywords(newSuggestions);
                setSelectedSuggested(new Set(newSuggestions.map(k => k.text)));
            }
             if (parsedResponse.negativeCandidates && Array.isArray(parsedResponse.negativeCandidates)) {
                setNegativeCandidates(parsedResponse.negativeCandidates);
            }

        } catch (error) {
            console.error("Error fetching suggestions:", error);
            showToast("Failed to get AI suggestions. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddSelectedToBank = () => {
        const finalKeywords = [
            ...stagedKeywords.filter(k => selectedStaged.has(k.text)),
            ...suggestedKeywords.filter(k => selectedSuggested.has(k.text))
        ];

        if (finalKeywords.length > 0) {
            const newKeywordObjects = finalKeywords.map(k => ({
                id: Date.now() + Math.random(),
                text: k.text,
                intent: k.intent,
                stemmed: stem(k.text)
            }));
            onAdd(newKeywordObjects);
        }
        clearStagingArea();
    };
    
    const handleSelect = (key: string, setText: (val: Set<string>) => void, currentSet: Set<string>) => {
        const newSet = new Set(currentSet);
        if (newSet.has(key)) {
            newSet.delete(key);
        } else {
            newSet.add(key);
        }
        setText(newSet);
    };
    
    const handleSelectAll = (type: 'staged' | 'suggested') => {
        if (type === 'staged') {
            if (selectedStaged.size === stagedKeywords.length) {
                setSelectedStaged(new Set());
            } else {
                setSelectedStaged(new Set(stagedKeywords.map(k => k.text)));
            }
        } else {
            if (selectedSuggested.size === suggestedKeywords.length) {
                setSelectedSuggested(new Set());
            } else {
                setSelectedSuggested(new Set(suggestedKeywords.map(k => k.text)));
            }
        }
    };

    const renderSortIndicator = (key: keyof Keyword) => {
        if (sortConfig?.key !== key) return <span className="sort-indicator"></span>;
        return <span className="sort-indicator active">{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>;
    };
    
    const hasStagedContent = stagedKeywords.length > 0;
    const totalSelected = selectedStaged.size + selectedSuggested.size;

    return (
        <div className="section">
            <h2>Keyword Bank & AI Discovery</h2>
            <div>
                 <div className="importer-grid">
                    <div className="form-group">
                        <label>Seed Keywords (one per line)</label>
                        <textarea 
                            value={newKeywords}
                            onChange={e => setNewKeywords(e.target.value)}
                            placeholder="Enter keywords to get AI suggestions..."
                            disabled={disabled || isLoading}
                        />
                    </div>
                    <div>
                        <div className="form-group">
                            <label>Default Intent</label>
                            <select value={newIntent} onChange={e => setNewIntent(e.target.value)} disabled={disabled || isLoading}>
                                {NAMING_COMPONENTS.INTENT.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                            </select>
                        </div>
                         <button className="button" onClick={handleGetSuggestions} disabled={!newKeywords.trim() || disabled || isLoading} style={{width: '100%'}}>
                            {isLoading ? 'Thinking...' : 'Analyze & Suggest Keywords'}
                         </button>
                    </div>
                </div>

                {isLoading && !hasStagedContent && <div className="loading-container"><LoadingSpinner /></div>}
                
                {hasStagedContent && (
                    <div className="suggestion-container">
                        <h3>Staging Area</h3>
                        <div className="suggestions-grid">
                            <div className="suggestion-list-container">
                                <div className="suggestion-list-header">
                                    <input type="checkbox" checked={stagedKeywords.length > 0 && selectedStaged.size === stagedKeywords.length} onChange={() => handleSelectAll('staged')} />
                                    <h4>Your Keywords ({stagedKeywords.length})</h4>
                                </div>
                                <ul className="suggestion-list">
                                    {stagedKeywords.map((kw, i) => (
                                        <li key={`staged-${i}`}>
                                            <input type="checkbox" checked={selectedStaged.has(kw.text)} onChange={() => handleSelect(kw.text, setSelectedStaged, selectedStaged)} />
                                            <span>{kw.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="suggestion-list-container">
                                <div className="suggestion-list-header">
                                    <input type="checkbox" checked={suggestedKeywords.length > 0 && selectedSuggested.size === suggestedKeywords.length} onChange={() => handleSelectAll('suggested')} />
                                    <h4>AI Suggestions ({suggestedKeywords.length})</h4>
                                </div>
                                <ul className="suggestion-list">
                                    {isLoading && suggestedKeywords.length === 0 ? <LoadingSpinner/> :
                                        (suggestedKeywords.map((kw, i) => (
                                            <li key={`suggested-${i}`}>
                                                <input type="checkbox" checked={selectedSuggested.has(kw.text)} onChange={() => handleSelect(kw.text, setSelectedSuggested, selectedSuggested)} />
                                                <span className="suggestion-text">{kw.text}</span>
                                                <span className={`suggestion-type-tag type-${kw.type}`}>{kw.type}</span>
                                            </li>
                                        )))
                                    }
                                    {!isLoading && suggestedKeywords.length === 0 && <li className="no-suggestions">No suggestions found.</li>}
                                </ul>
                            </div>
                            <div className="suggestion-list-container">
                                <div className="suggestion-list-header">
                                    <h4>Negative Candidates ({negativeCandidates.length})</h4>
                                </div>
                                <ul className="suggestion-list negative-list">
                                     {isLoading && negativeCandidates.length === 0 ? <LoadingSpinner/> :
                                        (negativeCandidates.map((kw, i) => (
                                            <li key={`negative-${i}`} className="negative-candidate-item">
                                                <span className="suggestion-text">{kw.text}</span>
                                                <span className="negative-candidate-reason">{kw.reason}</span>
                                            </li>
                                        )))
                                    }
                                    {!isLoading && negativeCandidates.length === 0 && <li className="no-suggestions">No negative candidates found.</li>}
                                </ul>
                            </div>
                        </div>
                        <div className="suggestion-actions">
                            <button className="delete-button" onClick={clearStagingArea}>Clear</button>
                            <button className="button" onClick={handleAddSelectedToBank} disabled={totalSelected === 0 || disabled}>
                                Add Selected to Bank ({totalSelected})
                            </button>
                        </div>
                    </div>
                )}
                
                {keywords.length > 0 && (
                    <div className="keyword-table-container" style={{marginTop: '1.5rem'}}>
                        <table className="keyword-table">
                            <thead>
                                <tr>
                                    <th><button className="sort-btn" onClick={() => requestSort('text')}>Keyword {renderSortIndicator('text')}</button></th>
                                    <th><button className="sort-btn" onClick={() => requestSort('intent')}>Intent {renderSortIndicator('intent')}</button></th>
                                    <th><button className="sort-btn" onClick={() => requestSort('stemmed')}>Stemmed {renderSortIndicator('stemmed')}</button></th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedItems.map(kw => (
                                    <tr key={kw.id}>
                                        <td>
                                            <input type="text" value={kw.text} onChange={e => onUpdate(kw.id, { text: e.target.value, stemmed: stem(e.target.value) })} disabled={disabled} />
                                        </td>
                                        <td>
                                             <select value={kw.intent} onChange={e => onUpdate(kw.id, { intent: e.target.value })} disabled={disabled}>
                                                {NAMING_COMPONENTS.INTENT.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                                            </select>
                                        </td>
                                        <td>{kw.stemmed}</td>
                                        <td>
                                            <button className="delete-button" onClick={() => onDelete(kw.id)} disabled={disabled}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};