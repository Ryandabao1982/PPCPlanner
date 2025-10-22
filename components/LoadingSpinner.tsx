import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'medium', 
    message,
    fullScreen = false 
}) => {
    const sizeClass = `spinner-${size}`;
    
    if (fullScreen) {
        return (
            <div className="loading-overlay">
                <div className="loading-content">
                    <div className={`spinner ${sizeClass}`}></div>
                    {message && <p className="loading-message">{message}</p>}
                </div>
            </div>
        );
    }
    
    return (
        <div className="loading-inline">
            <div className={`spinner ${sizeClass}`}></div>
            {message && <span className="loading-message">{message}</span>}
        </div>
    );
};

export const SkeletonLoader: React.FC<{ count?: number; height?: string }> = ({ 
    count = 1, 
    height = '20px' 
}) => {
    return (
        <div className="skeleton-container">
            {Array.from({ length: count }).map((_, index) => (
                <div 
                    key={index} 
                    className="skeleton-loader" 
                    style={{ height }}
                />
            ))}
        </div>
    );
};

export const ButtonLoader: React.FC = () => {
    return <span className="button-spinner"></span>;
};
