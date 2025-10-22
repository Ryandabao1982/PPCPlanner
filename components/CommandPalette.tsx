import React, { useState, useEffect, useRef } from 'react';
import { getShortcutDisplay } from '../hooks/useKeyboardShortcuts';

interface Command {
    id: string;
    label: string;
    shortcut?: string;
    category: string;
    action: () => void;
    keywords?: string[];
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: Command[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setSearch('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    const filteredCommands = commands.filter(cmd => {
        const searchLower = search.toLowerCase();
        return (
            cmd.label.toLowerCase().includes(searchLower) ||
            cmd.category.toLowerCase().includes(searchLower) ||
            cmd.keywords?.some(kw => kw.toLowerCase().includes(searchLower))
        );
    });

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
            e.preventDefault();
            filteredCommands[selectedIndex].action();
            onClose();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    const handleCommandClick = (cmd: Command) => {
        cmd.action();
        onClose();
    };

    if (!isOpen) return null;

    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, Command[]>);

    return (
        <>
            <div className="command-palette-overlay" onClick={onClose}></div>
            <div className="command-palette">
                <div className="command-palette-header">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command or search..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        className="command-palette-input"
                    />
                    <button onClick={onClose} className="command-palette-close">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="command-palette-results">
                    {Object.keys(groupedCommands).length === 0 ? (
                        <div className="command-palette-empty">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <p>No commands found</p>
                        </div>
                    ) : (
                        Object.entries(groupedCommands).map(([category, cmds]) => (
                            <div key={category} className="command-group">
                                <div className="command-group-label">{category}</div>
                                {cmds.map((cmd, index) => {
                                    const globalIndex = filteredCommands.indexOf(cmd);
                                    return (
                                        <button
                                            key={cmd.id}
                                            className={`command-item ${globalIndex === selectedIndex ? 'selected' : ''}`}
                                            onClick={() => handleCommandClick(cmd)}
                                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                                        >
                                            <span className="command-label">{cmd.label}</span>
                                            {cmd.shortcut && (
                                                <span className="command-shortcut">{cmd.shortcut}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
                <div className="command-palette-footer">
                    <div className="command-palette-hint">
                        <kbd>↑↓</kbd> to navigate
                        <kbd>↵</kbd> to select
                        <kbd>esc</kbd> to close
                    </div>
                </div>
            </div>
        </>
    );
};
