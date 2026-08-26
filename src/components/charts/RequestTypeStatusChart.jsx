import React from "react";

const statusColors = {
  new: "#03c3ec",
  pending: "#ffab00",
  approved: "#71dd37",
  rejected: "#ff3e1d",
};

const statusLabels = {
  new: "New",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const RequestTypeStatusChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="text-muted text-center py-4">No data available</div>;
  }

  const maxTotal = Math.max(1, ...data.map((d) => d.total || 0));

  return (
    <div>
      <div className="d-flex flex-wrap gap-3 small text-muted mb-3">
        {Object.keys(statusColors).map((key) => (
          <div key={key} className="d-flex align-items-center gap-2">
            <span
              style={{
                width: "10px",
                height: "10px",
                background: statusColors[key],
                display: "inline-block",
                borderRadius: "2px",
              }}
            ></span>
            {statusLabels[key]}
          </div>
        ))}
      </div>

      <div className="d-flex flex-column gap-3">
        {data.map((item) => {
          const total = item.total || 0;
          const newCount = item.new || 0;
          const pending = item.pending || 0;
          const approved = item.approved || 0;
          const rejected = item.rejected || 0;
          const totalForBar = Math.max(1, total);

          const segment = (value) => `${(value / totalForBar) * 100}%`;

          return (
            <div key={item.type}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="fw-semibold text-truncate" style={{ maxWidth: "65%" }}>
                  {String(item.type || "").replaceAll("_", " ")}
                </div>
                <div className="text-muted small">Total: {total}</div>
              </div>

              <div
                className="d-flex overflow-hidden rounded"
                style={{ height: "18px", background: "#eef0f3" }}
                title={`New: ${newCount} | Pending: ${pending} | Approved: ${approved} | Rejected: ${rejected}`}
              >
                <div style={{ width: segment(newCount), background: statusColors.new }}></div>
                <div style={{ width: segment(pending), background: statusColors.pending }}></div>
                <div style={{ width: segment(approved), background: statusColors.approved }}></div>
                <div style={{ width: segment(rejected), background: statusColors.rejected }}></div>
              </div>

              <div className="d-flex flex-wrap gap-2 small text-muted mt-1">
                <span>New: {newCount}</span>
                <span>Pending: {pending}</span>
                <span>Approved: {approved}</span>
                <span>Rejected: {rejected}</span>
              </div>

              <div
                className="mt-1"
                style={{ height: "4px", background: "rgba(105,108,255,0.12)", borderRadius: "4px" }}
              >
                <div
                  style={{
                    height: "4px",
                    width: `${(total / maxTotal) * 100}%`,
                    background: "#696cff",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestTypeStatusChart;
