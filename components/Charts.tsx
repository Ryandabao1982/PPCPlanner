import React from 'react';

interface PieChartProps {
    data: { label: string; value: number; color: string }[];
    title: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    if (total === 0) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">{title}</h3>
                <div className="chart-empty">No data available</div>
            </div>
        );
    }

    let currentAngle = 0;
    const segments = data.map((item) => {
        const percentage = (item.value / total) * 100;
        const angle = (item.value / total) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;
        
        return {
            ...item,
            percentage,
            startAngle,
            endAngle: currentAngle
        };
    });

    return (
        <div className="chart-container">
            <h3 className="chart-title">{title}</h3>
            <div className="pie-chart-wrapper">
                <div className="pie-chart">
                    <svg viewBox="0 0 200 200" width="200" height="200">
                        {segments.map((segment, index) => {
                            const startRad = (segment.startAngle - 90) * (Math.PI / 180);
                            const endRad = (segment.endAngle - 90) * (Math.PI / 180);
                            
                            const x1 = 100 + 90 * Math.cos(startRad);
                            const y1 = 100 + 90 * Math.sin(startRad);
                            const x2 = 100 + 90 * Math.cos(endRad);
                            const y2 = 100 + 90 * Math.sin(endRad);
                            
                            const largeArc = segment.percentage > 50 ? 1 : 0;
                            
                            const pathData = [
                                `M 100 100`,
                                `L ${x1} ${y1}`,
                                `A 90 90 0 ${largeArc} 1 ${x2} ${y2}`,
                                `Z`
                            ].join(' ');
                            
                            return (
                                <path
                                    key={index}
                                    d={pathData}
                                    fill={segment.color}
                                    stroke="#1a2942"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>
                </div>
                <div className="chart-legend">
                    {segments.map((segment, index) => (
                        <div key={index} className="legend-item">
                            <div 
                                className="legend-color" 
                                style={{ backgroundColor: segment.color }}
                            />
                            <div className="legend-label">
                                <span className="legend-text">{segment.label}</span>
                                <span className="legend-value">
                                    {segment.value} ({segment.percentage.toFixed(1)}%)
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface BarChartProps {
    data: { label: string; value: number; color?: string }[];
    title: string;
    valueFormatter?: (value: number) => string;
}

export const BarChart: React.FC<BarChartProps> = ({ 
    data, 
    title, 
    valueFormatter = (v) => v.toString() 
}) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    
    if (data.length === 0) {
        return (
            <div className="chart-container">
                <h3 className="chart-title">{title}</h3>
                <div className="chart-empty">No data available</div>
            </div>
        );
    }

    return (
        <div className="chart-container">
            <h3 className="chart-title">{title}</h3>
            <div className="bar-chart">
                {data.map((item, index) => {
                    const percentage = (item.value / maxValue) * 100;
                    const color = item.color || '#fbbf24';
                    
                    return (
                        <div key={index} className="bar-item">
                            <div className="bar-label">{item.label}</div>
                            <div className="bar-wrapper">
                                <div 
                                    className="bar-fill"
                                    style={{ 
                                        width: `${percentage}%`,
                                        backgroundColor: color
                                    }}
                                />
                                <span className="bar-value">{valueFormatter(item.value)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface ProgressRingProps {
    percentage: number;
    label: string;
    size?: number;
    strokeWidth?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
    percentage, 
    label, 
    size = 120,
    strokeWidth = 12
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    const getColor = (pct: number) => {
        if (pct >= 80) return '#10b981';
        if (pct >= 50) return '#fbbf24';
        return '#ef4444';
    };

    return (
        <div className="progress-ring-container">
            <svg width={size} height={size}>
                <circle
                    className="progress-ring-bg"
                    stroke="#2d3b54"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="progress-ring-fill"
                    stroke={getColor(percentage)}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        transition: 'stroke-dashoffset 0.5s ease',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%'
                    }}
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    className="progress-ring-text"
                    fill="#e5e7eb"
                    fontSize="24"
                    fontWeight="bold"
                >
                    {percentage}%
                </text>
            </svg>
            <div className="progress-ring-label">{label}</div>
        </div>
    );
};

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: string;
    trend?: { value: number; direction: 'up' | 'down' };
    onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
    title, 
    value, 
    icon, 
    trend,
    onClick 
}) => {
    const isClickable = !!onClick;
    
    return (
        <div 
            className={`stat-card ${isClickable ? 'stat-card-clickable' : ''}`}
            onClick={onClick}
            style={{ cursor: isClickable ? 'pointer' : 'default' }}
        >
            <div className="stat-card-header">
                <div className="stat-card-title">{title}</div>
                <i className={`${icon} stat-card-icon`}></i>
            </div>
            <div className="stat-card-value">{value}</div>
            {trend && (
                <div className={`stat-card-trend ${trend.direction}`}>
                    <i className={`fa-solid fa-arrow-${trend.direction === 'up' ? 'up' : 'down'}`}></i>
                    <span>{Math.abs(trend.value)}%</span>
                </div>
            )}
        </div>
    );
};
