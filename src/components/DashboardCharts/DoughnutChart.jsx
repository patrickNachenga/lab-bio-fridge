import React, { useMemo, useState } from "react";

/** Donut arc in viewBox 0..100; angles in degrees, 0° = top, clockwise. */
function donutSlicePath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  if (endAngle - startAngle >= 359.99) {
    endAngle = startAngle + 359.99;
  }
  const rad = (deg) => ((deg - 90) * Math.PI) / 180;
  const xo1 = cx + rOuter * Math.cos(rad(startAngle));
  const yo1 = cy + rOuter * Math.sin(rad(startAngle));
  const xo2 = cx + rOuter * Math.cos(rad(endAngle));
  const yo2 = cy + rOuter * Math.sin(rad(endAngle));
  const xi1 = cx + rInner * Math.cos(rad(endAngle));
  const yi1 = cy + rInner * Math.sin(rad(endAngle));
  const xi2 = cx + rInner * Math.cos(rad(startAngle));
  const yi2 = cy + rInner * Math.sin(rad(startAngle));
  const delta = endAngle - startAngle;
  const largeArc = delta > 180 ? 1 : 0;
  return `M ${xo1} ${yo1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${xo2} ${yo2} L ${xi1} ${yi1} A ${rInner} ${rInner} 0 ${largeArc} 0 ${xi2} ${yi2} Z`;
}

/**
 * @param {"split" | "stacked"} layout - stacked: donut on top, legend list full width below (ED dashboard).
 */
export const DoughnutChart = ({
  data = [],
  onItemClick,
  centerLabel = "Total",
  centerSubLabel,
  compact = false,
  layout = "split",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const normalizedData = useMemo(
    () =>
      (data || []).map((item, index) => {
        const chartLabel =
          item.status ||
          item.label ||
          item.category ||
          item.type ||
          item.campus ||
          item.name ||
          `Item ${index + 1}`;
        return {
          ...item,
          amount: Number(item.count ?? item.value ?? 0),
          chartLabel,
          chartColor: item.color || getStatusColor(chartLabel, index),
        };
      }),
    [data]
  );

  const total = useMemo(
    () => normalizedData.reduce((sum, item) => sum + item.amount, 0),
    [normalizedData]
  );

  const chartSize = compact ? 170 : 220;
  const innerSize = compact ? 92 : 122;
  const cx = 50;
  const cy = 50;
  const rOuter = 42;
  const rInner = 24;

  const svgSegments = useMemo(() => {
    const n = normalizedData.length;
    if (n === 0) return [];
    if (total <= 0) {
      return normalizedData.map((item, index) => ({
        item,
        index,
        path: donutSlicePath(cx, cy, rOuter, rInner, (index / n) * 360, ((index + 1) / n) * 360),
        pct: 0,
      }));
    }
    let angle = 0;
    return normalizedData
      .map((item, index) => {
        const sliceAngle = (item.amount / total) * 360;
        const startAngle = angle;
        const endAngle = angle + sliceAngle;
        angle = endAngle;
        const pct = Number.isFinite(item.percentage)
          ? item.percentage
          : Math.round((item.amount / total) * 100);
        if (sliceAngle < 0.05) {
          return null;
        }
        return {
          item,
          index,
          path: donutSlicePath(cx, cy, rOuter, rInner, startAngle, endAngle),
          pct,
        };
      })
      .filter(Boolean);
  }, [normalizedData, total, cx, cy, rOuter, rInner]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bx bx-pie-chart-alt text-muted display-4"></i>
        <p className="text-muted mt-2">No data available</p>
      </div>
    );
  }

  const donutInner = (
    <>
      <small className="text-muted text-uppercase fw-semibold">{centerLabel}</small>
      <div className={`${compact ? "fs-2" : "fs-3"} fw-bold text-dark`}>{total}</div>
      {centerSubLabel !== undefined && centerSubLabel !== null && centerSubLabel !== "" ? (
        <small className="text-muted px-1 text-center" style={{ fontSize: "0.7rem", lineHeight: 1.2 }}>
          {centerSubLabel}
        </small>
      ) : centerSubLabel === undefined ? (
        <small className="text-muted">records</small>
      ) : null}
    </>
  );

  const legendBlock = (
    <div
      className={layout === "stacked" ? "col-12" : compact ? "col-12" : "col-lg-7"}
      style={layout === "stacked" ? { maxHeight: compact ? 280 : 360, overflowY: "auto" } : undefined}
    >
      {normalizedData.map((item, index) => {
        const percentage =
          total > 0
            ? Number.isFinite(item.percentage)
              ? item.percentage
              : Math.round((item.amount / total) * 100)
            : 0;
        const tier = item.tierLabel;
        const pctOfYearLabel = item.shareOfYearLabel ?? `${percentage}% of selected year`;
        return (
          <button
            key={item.rowKey ?? `legend-${index}`}
            type="button"
            className={`chart-item ${compact ? "mb-2 p-2" : "mb-3 p-3"} rounded-3 border bg-white w-100 text-start`}
            onClick={() => onItemClick && onItemClick(item)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              cursor: onItemClick && !item.disableClick ? "pointer" : "default",
              transition: "all 0.2s ease",
              boxShadow: compact ? "0 4px 12px rgba(67, 89, 113, 0.08)" : undefined,
              outline: hoveredIndex === index ? "2px solid var(--bs-primary)" : undefined,
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center min-w-0">
                <div
                  className="me-3 shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: item.chartColor,
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                  }}
                />
                <div className="min-w-0">
                  <div className={`fw-semibold text-dark text-break ${compact ? "small" : ""}`}>{item.chartLabel}</div>
                  {tier ? (
                    <div
                      className="text-muted text-uppercase fw-medium"
                      style={{ fontSize: "0.65rem", letterSpacing: "0.04em" }}
                    >
                      {tier}
                    </div>
                  ) : null}
                  <small className="text-muted">{pctOfYearLabel}</small>
                </div>
              </div>
              <div className="text-end flex-shrink-0 ps-2">
                <div className={`fw-bold ${compact ? "fs-6" : "fs-5"}`}>{item.amount}</div>
                {onItemClick && !item.disableClick && (
                  <small className="text-primary">{compact ? "View" : "Click to view"}</small>
                )}
              </div>
            </div>
            <div className={`progress ${compact ? "mt-2" : "mt-3"}`} style={{ height: compact ? "6px" : "8px" }}>
              <div
                className="progress-bar"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.chartColor,
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );

  const donutBlock = (
    <div className={layout === "stacked" ? "col-12" : compact ? "col-12" : "col-lg-5"}>
      <div className="d-flex justify-content-center">
        <div
          className="position-relative rounded-circle shadow-sm"
          style={{
            width: `${chartSize}px`,
            height: `${chartSize}px`,
            flexShrink: 0,
          }}
        >
          <svg
            width={chartSize}
            height={chartSize}
            viewBox="0 0 100 100"
            className="d-block rounded-circle"
            role="img"
            aria-label="Distribution chart"
            style={{ overflow: "visible" }}
          >
            {svgSegments.map((seg) => {
              const { item, index, path, pct } = seg;
              const isHovered = hoveredIndex === index;
              const dimOthers = hoveredIndex !== null && !isHovered;
              const titleText = [
                item.chartLabel,
                item.tierLabel ? `(${item.tierLabel})` : "",
                `${item.amount} reports`,
                total > 0 ? `${pct}% of chart` : "",
              ]
                .filter(Boolean)
                .join(" — ");
              return (
                <path
                  key={item.rowKey ?? `slice-${index}`}
                  d={path}
                  fill={item.chartColor}
                  stroke="#fff"
                  strokeWidth={0.6}
                  vectorEffect="non-scaling-stroke"
                  style={{
                    cursor: onItemClick && !item.disableClick ? "pointer" : "default",
                    opacity: dimOthers ? 0.45 : isHovered ? 1 : 1,
                    filter: isHovered ? "brightness(1.08)" : undefined,
                    transition: "opacity 0.15s ease, filter 0.15s ease",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onItemClick && !item.disableClick) onItemClick(item);
                  }}
                >
                  <title>{titleText}</title>
                </path>
              );
            })}
          </svg>
          <div
            className="position-absolute top-50 start-50 translate-middle rounded-circle bg-white d-flex flex-column align-items-center justify-content-center shadow-sm px-1 pointer-events-none"
            style={{
              width: `${innerSize}px`,
              height: `${innerSize}px`,
              zIndex: 1,
            }}
          >
            {donutInner}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="doughnut-chart">
      <div className={`row ${compact ? "g-3" : "g-4"} align-items-start`}>
        {donutBlock}
        {legendBlock}
      </div>
    </div>
  );
};

const PIE_PALETTE = [
  "#2563eb",
  "#0d9488",
  "#7c3aed",
  "#ea580c",
  "#16a34a",
  "#0369a1",
  "#dc2626",
  "#ca8a04",
  "#64748b",
  "#db2777",
];

const getStatusColor = (status, index = 0) => {
  const colors = {
    Operational: "#28a745",
    "In Repair": "#ffc107",
    Retired: "#6c757d",
    Lost: "#dc3545",
    Disposed: "#343a40",
    Active: "#28a745",
    Inactive: "#6c757d",
    Pending: "#ffc107",
    Completed: "#28a745",
    Cancelled: "#dc3545",
    Failed: "#dc3545",
    Approved: "#16a34a",
    Rejected: "#dc3545",
  };
  return colors[status] || PIE_PALETTE[index % PIE_PALETTE.length];
};
