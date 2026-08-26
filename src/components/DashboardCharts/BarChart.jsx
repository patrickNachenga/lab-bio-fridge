import React from 'react';

export const BarChart = ({ data = [], barColor = 'bg-primary', labelKey = 'category' }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-4">
                <i className="bx bx-bar-chart-alt text-muted display-4"></i>
                <p className="text-muted mt-2">No data available</p>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(item => item.count || item.value || 0));
    
    return (
        <div className="bar-chart">
            {data.map((item, index) => {
                const displayValue = item.count || item.value || 0;
                const percentage = item.approval_percentage !== undefined ? item.approval_percentage : null;
                
                return (
                    <div key={index} className="bar-item mb-3">
                        <div className="d-flex justify-content-between mb-1">
                            <span className="text-sm">{item[labelKey] || item.category || item.label}</span>
                            <div>
                                <span className="fw-bold">{displayValue}</span>
                                {percentage !== null && <span className="text-muted ms-2">({percentage}%)</span>}
                            </div>
                        </div>
                        <div className="progress" style={{ height: '20px' }}>
                            <div 
                                className={`progress-bar ${item.barColor || barColor}`}
                                style={{ 
                                    width: `${(displayValue / maxValue) * 100}%`,
                                    backgroundColor: item.color
                                }}
                            >
                                {displayValue}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
