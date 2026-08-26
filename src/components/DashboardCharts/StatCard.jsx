import React from 'react';

export const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary', 
    subtitle, 
    percentage,
    trend = 'up' 
}) => {
    return (
        <div className="card h-100">
            <div className="w-90" style={{
                background: "linear-gradient(135deg, #e53935 5%, #1976d2 50%, #ffd700  100%)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                position: "absolute",
                top: "-3px",
                left: "50%",
                right: "50%",
                transform: "translateX(-50%)",
                width: "85%",
                borderRadius: "50%",
                height: "5px",
            }}></div>
            <div className="card-body">
                <span className="fw-bold-block mb-1 text-right" style={{ fontWeight: "800", fontSize: "1rem", paddingBottom: "10px" }}>{title}</span>

                <div className="d-flex align-items-center">
                    <div className="avatar flex-shrink-0">
                        <div className={`bg-${color} rounded p-2`}>
                            <i className={`bx ${icon} text-white`}></i>
                        </div>
                    </div>
                    <div className="ms-3">
                        <h5 className="card-title mb-0">{value}</h5>
                    </div>

                </div>
                <div className="text-center">
                    {percentage !== undefined && (
                        <>
                            <small className={`text-${trend === 'up' ? 'success' : 'danger'} fw-medium`}>
                                {percentage}%
                            </small>
                            <i className="bx bx-right-arrow-alt"></i>
                        </>
                    )}
                    {subtitle && (
                        <small className="text-muted ms-1">{subtitle}</small>
                    )}
                </div>
            </div>
        </div>
    );
};
