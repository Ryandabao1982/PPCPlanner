import React, { useState, useMemo } from 'react';

interface Log {
    id: number;
    timestamp: string;
    action: string;
    user?: string;
}

interface ActivityLogProps {
    logs: Log[];
}

type ActivityCategory = 'All' | 'Campaign' | 'Keyword' | 'Ad Group' | 'Product' | 'Goal' | 'Export' | 'Other';

const categorizeActivity = (action: string): ActivityCategory => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('campaign')) return 'Campaign';
    if (lowerAction.includes('keyword')) return 'Keyword';
    if (lowerAction.includes('ad group')) return 'Ad Group';
    if (lowerAction.includes('product')) return 'Product';
    if (lowerAction.includes('goal')) return 'Goal';
    if (lowerAction.includes('export')) return 'Export';
    return 'Other';
};

const getCategoryIcon = (category: ActivityCategory): string => {
    const icons: Record<ActivityCategory, string> = {
        'All': 'fa-list',
        'Campaign': 'fa-bullhorn',
        'Keyword': 'fa-key',
        'Ad Group': 'fa-layer-group',
        'Product': 'fa-box',
        'Goal': 'fa-crosshairs',
        'Export': 'fa-download',
        'Other': 'fa-circle-info'
    };
    return icons[category];
};

const getCategoryColor = (category: ActivityCategory): string => {
    const colors: Record<ActivityCategory, string> = {
        'All': '#64B5F6',
        'Campaign': '#fbbf24',
        'Keyword': '#10b981',
        'Ad Group': '#3b82f6',
        'Product': '#ec4899',
        'Goal': '#ef4444',
        'Export': '#8b5cf6',
        'Other': '#6b7280'
    };
    return colors[category];
};

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('All');
    const [selectedUser, setSelectedUser] = useState<string>('All');
    const [showFilters, setShowFilters] = useState(false);

    // Get unique users
    const uniqueUsers = useMemo(() => {
        const users = new Set(logs.map(log => log.user).filter(Boolean));
        return ['All', ...Array.from(users)];
    }, [logs]);

    // Get activity categories with counts
    const categoryCounts = useMemo(() => {
        const counts: Record<ActivityCategory, number> = {
            'All': logs.length,
            'Campaign': 0,
            'Keyword': 0,
            'Ad Group': 0,
            'Product': 0,
            'Goal': 0,
            'Export': 0,
            'Other': 0
        };
        
        logs.forEach(log => {
            const category = categorizeActivity(log.action);
            counts[category]++;
        });
        
        return counts;
    }, [logs]);

    // Filter logs
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            // Search filter
            const matchesSearch = searchQuery === '' || 
                log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase()));
            
            // Category filter
            const category = categorizeActivity(log.action);
            const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
            
            // User filter
            const matchesUser = selectedUser === 'All' || log.user === selectedUser;
            
            return matchesSearch && matchesCategory && matchesUser;
        });
    }, [logs, searchQuery, selectedCategory, selectedUser]);

    // Group logs by date
    const groupedLogs = useMemo(() => {
        const groups: Record<string, Log[]> = {};
        
        filteredLogs.forEach(log => {
            const date = new Date(log.timestamp).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
            
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(log);
        });
        
        return groups;
    }, [filteredLogs]);

    const categories: ActivityCategory[] = ['All', 'Campaign', 'Keyword', 'Ad Group', 'Product', 'Goal', 'Export', 'Other'];

    return (
        <div className="section">
            <div className="section-header">
                <h2>
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    Activity Log
                    <span className="activity-count">({filteredLogs.length})</span>
                </h2>
                <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <i className={`fa-solid fa-filter`}></i>
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            {showFilters && (
                <div className="activity-filters">
                    <div className="search-bar">
                        <i className="fa-solid fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                className="search-clear"
                                onClick={() => setSearchQuery('')}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        )}
                    </div>

                    <div className="filter-row">
                        <div className="filter-group">
                            <label>Category:</label>
                            <div className="category-filters">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category)}
                                        style={{
                                            borderColor: selectedCategory === category ? getCategoryColor(category) : undefined
                                        }}
                                    >
                                        <i className={`fa-solid ${getCategoryIcon(category)}`}></i>
                                        {category}
                                        <span className="category-count">({categoryCounts[category]})</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {uniqueUsers.length > 1 && (
                            <div className="filter-group">
                                <label>User:</label>
                                <select 
                                    value={selectedUser} 
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="user-filter-select"
                                >
                                    {uniqueUsers.map(user => (
                                        <option key={user} value={user}>{user}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="activity-log-container">
                {filteredLogs.length === 0 ? (
                    <div className="empty-state" style={{ marginTop: 0, padding: '2rem 1rem' }}>
                        <i className="fa-solid fa-inbox"></i>
                        <p>No activities found</p>
                        {(searchQuery || selectedCategory !== 'All' || selectedUser !== 'All') && (
                            <button 
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('All');
                                    setSelectedUser('All');
                                }}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="activity-log-timeline">
                        {Object.entries(groupedLogs).map(([date, dateLogs]) => (
                            <div key={date} className="activity-date-group">
                                <div className="activity-date-header">
                                    <i className="fa-solid fa-calendar-day"></i>
                                    {date}
                                </div>
                                <ul className="activity-log-list">
                                    {dateLogs.map(log => {
                                        const category = categorizeActivity(log.action);
                                        const categoryColor = getCategoryColor(category);
                                        
                                        return (
                                            <li key={log.id} className="activity-log-item">
                                                <div 
                                                    className="activity-category-indicator"
                                                    style={{ backgroundColor: categoryColor }}
                                                    title={category}
                                                >
                                                    <i className={`fa-solid ${getCategoryIcon(category)}`}></i>
                                                </div>
                                                <div className="activity-content">
                                                    <div className="activity-log-action">{log.action}</div>
                                                    <div className="activity-log-meta">
                                                        <span className="activity-log-time">
                                                            <i className="fa-solid fa-clock"></i>
                                                            {new Date(log.timestamp).toLocaleTimeString()}
                                                        </span>
                                                        {log.user && (
                                                            <span className="activity-log-user">
                                                                <i className="fa-solid fa-user"></i>
                                                                {log.user}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};