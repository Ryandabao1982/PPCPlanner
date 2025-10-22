import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
    content, 
    children, 
    position = 'top',
    delay = 200 
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const timeoutRef = useRef<number | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
        timeoutRef.current = window.setTimeout(() => {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                
                let x = 0;
                let y = 0;
                
                switch (position) {
                    case 'top':
                        x = rect.left + rect.width / 2 + scrollX;
                        y = rect.top + scrollY;
                        break;
                    case 'bottom':
                        x = rect.left + rect.width / 2 + scrollX;
                        y = rect.bottom + scrollY;
                        break;
                    case 'left':
                        x = rect.left + scrollX;
                        y = rect.top + rect.height / 2 + scrollY;
                        break;
                    case 'right':
                        x = rect.right + scrollX;
                        y = rect.top + rect.height / 2 + scrollY;
                        break;
                }
                
                setCoords({ x, y });
                setIsVisible(true);
            }
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!content) return <>{children}</>;

    return (
        <>
            <div
                ref={triggerRef}
                className="tooltip-trigger"
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>
            {isVisible && (
                <div 
                    className={`tooltip tooltip-${position}`}
                    style={{
                        position: 'fixed',
                        left: `${coords.x}px`,
                        top: `${coords.y}px`,
                    }}
                >
                    {content}
                </div>
            )}
        </>
    );
};

export const HelpIcon: React.FC<{ tooltip: string }> = ({ tooltip }) => {
    return (
        <Tooltip content={tooltip}>
            <span className="help-icon">
                <i className="fa-solid fa-circle-question"></i>
            </span>
        </Tooltip>
    );
};
