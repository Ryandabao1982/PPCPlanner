import React, { useState } from 'react';
import { Tooltip } from './Tooltip';

interface BulkToolbarProps {
    selectedCount: number;
    totalCount: number;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    actions: BulkAction[];
    disabled?: boolean;
}

export interface BulkAction {
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    tooltip?: string;
    requiresSelection?: boolean;
}

export const BulkToolbar: React.FC<BulkToolbarProps> = ({
    selectedCount,
    totalCount,
    onSelectAll,
    onDeselectAll,
    actions,
    disabled = false
}) => {
    const hasSelection = selectedCount > 0;
    const allSelected = selectedCount === totalCount && totalCount > 0;

    const renderAction = (action: BulkAction) => {
        const isDisabled = disabled || (action.requiresSelection !== false && !hasSelection);
        const variantClass = action.variant || 'secondary';

        const button = (
            <button
                key={action.id}
                className={`bulk-action-btn bulk-action-${variantClass}`}
                onClick={action.onClick}
                disabled={isDisabled}
            >
                <i className={action.icon}></i>
                <span>{action.label}</span>
            </button>
        );

        if (action.tooltip) {
            return <Tooltip key={action.id} content={action.tooltip}>{button}</Tooltip>;
        }

        return button;
    };

    return (
        <div className={`bulk-toolbar ${hasSelection ? 'has-selection' : ''}`}>
            <div className="bulk-toolbar-left">
                <label className="bulk-checkbox-container">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={allSelected ? onDeselectAll : onSelectAll}
                        disabled={disabled || totalCount === 0}
                    />
                    <span className="bulk-checkbox-label">
                        {selectedCount > 0 ? `${selectedCount} selected` : `Select all (${totalCount})`}
                    </span>
                </label>
                {hasSelection && (
                    <button
                        className="bulk-clear-btn"
                        onClick={onDeselectAll}
                        disabled={disabled}
                    >
                        <i className="fa-solid fa-xmark"></i>
                        Clear selection
                    </button>
                )}
            </div>
            {hasSelection && (
                <div className="bulk-toolbar-right">
                    {actions.map(renderAction)}
                </div>
            )}
        </div>
    );
};

export const BulkConfirmDialog: React.FC<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'info'
}) => {
    if (!isOpen) return null;

    const icons = {
        danger: 'fa-solid fa-triangle-exclamation',
        warning: 'fa-solid fa-exclamation-circle',
        info: 'fa-solid fa-info-circle'
    };

    return (
        <>
            <div className="bulk-dialog-overlay" onClick={onCancel}></div>
            <div className={`bulk-dialog bulk-dialog-${variant}`}>
                <div className="bulk-dialog-header">
                    <i className={icons[variant]}></i>
                    <h3>{title}</h3>
                </div>
                <div className="bulk-dialog-body">
                    <p>{message}</p>
                </div>
                <div className="bulk-dialog-footer">
                    <button
                        className="bulk-dialog-btn bulk-dialog-btn-secondary"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={`bulk-dialog-btn bulk-dialog-btn-${variant}`}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </>
    );
};
