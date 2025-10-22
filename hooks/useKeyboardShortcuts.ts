import { useEffect } from 'react';

type KeyCombo = {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
};

type ShortcutHandler = () => void;

export const useKeyboardShortcut = (
    keyCombo: KeyCombo,
    handler: ShortcutHandler,
    disabled: boolean = false
) => {
    useEffect(() => {
        if (disabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            const { key, ctrl = false, shift = false, alt = false, meta = false } = keyCombo;

            const ctrlMatch = ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
            const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
            const altMatch = alt ? event.altKey : !event.altKey;
            const metaMatch = meta ? event.metaKey : !event.metaKey;

            if (
                event.key.toLowerCase() === key.toLowerCase() &&
                ctrlMatch &&
                shiftMatch &&
                altMatch &&
                metaMatch
            ) {
                event.preventDefault();
                handler();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [keyCombo, handler, disabled]);
};

export const shortcuts = {
    // Navigation
    DASHBOARD: { key: 'd', ctrl: true },
    CAMPAIGNS: { key: 'c', ctrl: true },
    AD_GROUPS: { key: 'a', ctrl: true },
    KEYWORDS: { key: 'k', ctrl: true },
    ASSETS: { key: 'p', ctrl: true },
    GOALS: { key: 'g', ctrl: true },
    BIDDING: { key: 'b', ctrl: true },
    REPORTS: { key: 'r', ctrl: true },
    HELP: { key: 'h', ctrl: true },

    // Actions
    SAVE: { key: 's', ctrl: true },
    EXPORT: { key: 'e', ctrl: true },
    SEARCH: { key: 'f', ctrl: true },
    COMMAND_PALETTE: { key: 'k', ctrl: true },
    
    // Editing
    UNDO: { key: 'z', ctrl: true },
    REDO: { key: 'z', ctrl: true, shift: true },
    DELETE: { key: 'Delete' },
    SELECT_ALL: { key: 'a', ctrl: true },

    // Workspace
    NEW_BRAND: { key: 'n', ctrl: true },
    FREEZE_PLAN: { key: 'l', ctrl: true },
    HEALTH_CHECK: { key: 't', ctrl: true },
};

export const getShortcutDisplay = (keyCombo: KeyCombo): string => {
    const parts: string[] = [];
    
    if (keyCombo.ctrl || keyCombo.meta) {
        parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
    }
    if (keyCombo.shift) parts.push('Shift');
    if (keyCombo.alt) parts.push('Alt');
    
    parts.push(keyCombo.key.toUpperCase());
    
    return parts.join('+');
};
