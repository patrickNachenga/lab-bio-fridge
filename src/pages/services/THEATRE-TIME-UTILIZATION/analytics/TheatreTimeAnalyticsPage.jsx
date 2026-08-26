import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import BreadCumb from "../../../../layouts/BreadCumb";
import { StatCard } from "../../../../components/DashboardCharts";

// Recharts components
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
} from "recharts";

// GraphQL hooks
import {
  useGetAnalyticsStatsQuery,
  useGetProceduresOverTimeQuery,
  useGetPatientTypeDistributionQuery,
  useGetPatientOutcomesQuery,
  useGetTheatreUtilizationQuery,
  useGetEstimatedVsActualDurationQuery,
  useGetDelayDistributionQuery,
  useGetDelaysOverTimeQuery,
  useGetDurationDistributionQuery,
  useGetProceduresByRegionQuery,
  useGetTeamPerformanceQuery,
  useGetProceduresHeatmapQuery,
  useGetTheatreUnitsQuery,
  useGetProceduresQuery,
} from "../../../../features/theatre/theatreGraphqlApi";

// ============================================================
// Constants
// ============================================================
const COLORS = {
  primary: "#2563eb", secondary: "#64748b", success: "#16a34a",
  warning: "#f59e0b", danger: "#dc2626", info: "#0891b2",
  teal: "#0d9488", amber: "#d97706", blue: "#2563eb",
  green: "#16a34a", red: "#dc2626", purple: "#7c3aed",
  pink: "#db2777", indigo: "#4338ca", slate: "#64748b",
};

const CHART_COLORS = [
  "#2563eb", "#16a34a", "#0d9488", "#f59e0b",
  "#dc2626", "#7c3aed", "#0891b2", "#db2777",
  "#4338ca", "#84cc16", "#06b6d4", "#f97316",
];

const EMPTY_ARRAY = [];

const DATE_RANGE_OPTIONS = [
  "Today", "This Week", "This Month", "This Quarter", "This Year",
  "Last 7 Days", "Last 30 Days", "Last 90 Days", "Custom",
];

// ============================================================
// LazyLoadSection – triggers fetch when scrolled into view
// ============================================================
const LazyLoadSection = ({ children, placeholder = null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{isVisible ? children : (placeholder || <div style={{ minHeight: 80 }} />)}</div>;
};

// ============================================================
// Skeletons
// ============================================================
const CardSkeleton = ({ height = 120 }) => (
  <div className="card h-100" style={{ minHeight: height }}>
    <div className="card-body d-flex align-items-center justify-content-center">
      <div className="w-100">
        <div className="d-flex align-items-center mb-3">
          <div className="rounded placeholder-glow" style={{ width: 40, height: 40 }}>
            <span className="placeholder col-12 rounded"></span>
          </div>
          <div className="ms-3 flex-grow-1">
            <span className="placeholder col-6 d-block mb-1"></span>
            <span className="placeholder col-4 d-block"></span>
          </div>
        </div>
        <div className="placeholder-glow">
          <span className="placeholder col-8 d-block"></span>
        </div>
      </div>
    </div>
  </div>
);

const ChartSkeleton = () => (
  <div className="card h-100">
    <div className="card-header"><span className="placeholder col-4"></span></div>
    <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
      <div className="placeholder-glow w-100 text-center">
        <i className="bx bx-line-chart text-muted display-4 placeholder"></i>
        <p className="text-muted mt-2"><span className="placeholder col-5"></span></p>
      </div>
    </div>
  </div>
);

// ============================================================
// CustomTooltip
// ============================================================
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-3 shadow-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0" }}>
        <p className="fw-bold mb-2" style={{ fontSize: "0.85rem" }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: "0.8rem" }} className="mb-1">
            <span className="d-inline-block me-2 rounded-circle" style={{ width: 8, height: 8, backgroundColor: entry.color }}></span>
            {entry.name}: <span className="fw-bold">{entry.value}{entry.name === "Percentage" ? "%" : ""}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================================
// EmptyState
// ============================================================
const EmptyState = ({ icon = "bx-bar-chart-alt", message = "No data available" }) => (
  <div className="text-center py-4">
    <i className={`bx ${icon} text-muted display-5`}></i>
    <p className="text-muted mt-2 mb-0">{message}</p>
  </div>
);

// ============================================================
// DashboardCard
// ============================================================
const DashboardCard = ({ title, icon, iconColor = "primary", subtitle, badge, badgeColor = "primary", children }) => (
  <div className="card h-100 dashboard-card">
    <div className="card-header d-flex align-items-center gap-2 py-3">
      <i className={`bx ${icon} fs-5 text-${iconColor}`}></i>
      <h6 className="mb-0 fw-semibold">{title}</h6>
      {badge && <span className={`badge bg-label-${badgeColor} ms-auto`}>{badge}</span>}
      {subtitle && <small className="text-muted ms-auto">{subtitle}</small>}
    </div>
    <div className="card-body">{children}</div>
  </div>
);

// ============================================================
// HeatmapChart
// ============================================================
const HeatmapChart = ({ data = [] }) => {
  if (!data || data.length === 0) return <EmptyState icon="bx-grid-alt" message="No heatmap data" />;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hours = ["08:00–10:00", "10:00–12:00", "12:00–14:00", "14:00–16:00", "16:00–18:00"];

  const getIntensity = (count) => {
    if (count <= 0) return "#f1f5f9";
    if (count <= 2) return "#bfdbfe";
    if (count <= 4) return "#93c5fd";
    if (count <= 6) return "#60a5fa";
    if (count <= 8) return "#3b82f6";
    if (count <= 10) return "#2563eb";
    if (count <= 12) return "#1d4ed8";
    if (count <= 14) return "#1e40af";
    return "#1e3a8a";
  };

  const getCount = (day, hour) => {
    const item = data.find((d) => d.day === day && d.hour === hour);
    return item ? item.count : 0;
  };

  return (
    <div className="table-responsive">
      <table className="table table-borderless mb-0 text-center" style={{ fontSize: "0.8rem" }}>
        <thead>
          <tr>
            <th className="text-start" style={{ width: 110, fontSize: "0.7rem" }}>Time / Day</th>
            {days.map((day) => (
              <th key={day} className="text-center" style={{ fontSize: "0.7rem", minWidth: 50 }}>{day.slice(0, 3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="text-start text-muted fw-medium" style={{ fontSize: "0.7rem" }}>{hour}</td>
              {days.map((day) => {
                const count = getCount(day, hour);
                return (
                  <td key={`${day}-${hour}`} className="p-1">
                    <div
                      className="rounded-2 d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        backgroundColor: getIntensity(count), width: "100%", height: 36,
                        color: count > 6 ? "#fff" : "#1e293b", fontSize: "0.75rem", transition: "all 0.2s ease",
                      }}
                      title={`${day} ${hour}: ${count} procedures`}
                    >{count}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
        <small className="text-muted" style={{ fontSize: "0.65rem" }}>Low</small>
        {[0, 2, 4, 6, 8, 10, 12, 14].map((v) => (
          <div key={v} className="rounded-1" style={{ width: 16, height: 16, backgroundColor: getIntensity(v) }} />
        ))}
        <small className="text-muted" style={{ fontSize: "0.65rem" }}>High</small>
      </div>
    </div>
  );
};

// ============================================================
// ROW 2 – Procedures Over Time + Emergency vs Elective + Patient Outcomes
// ============================================================
const Row2Charts = React.memo(({ queryParams }) => {
  const { data: proceduresOverTimeResponse } = useGetProceduresOverTimeQuery(queryParams);
  const { data: patientTypeDistResponse } = useGetPatientTypeDistributionQuery(queryParams);
  const { data: patientOutcomesResponse } = useGetPatientOutcomesQuery(queryParams);

  const proceduresOverTimeData = useMemo(() => proceduresOverTimeResponse?.data?.items || EMPTY_ARRAY, [proceduresOverTimeResponse]);
  const patientTypeDist = useMemo(() => patientTypeDistResponse?.data?.items || EMPTY_ARRAY, [patientTypeDistResponse]);
  const patientOutcomes = useMemo(() => patientOutcomesResponse?.data?.items || EMPTY_ARRAY, [patientOutcomesResponse]);

  const patientTypeTotal = useMemo(() => patientTypeDist.reduce((s, d) => s + (d.value || 0), 0), [patientTypeDist]);
  const outcomesTotal = useMemo(() => patientOutcomes.reduce((s, d) => s + (d.value || 0), 0), [patientOutcomes]);

  return (
    <div className="row g-4 mb-4">
      <div className="col-lg-6">
        <DashboardCard title="Procedures Over Time" icon="bx-line-chart" iconColor="primary">
          {proceduresOverTimeData.length === 0 ? <EmptyState icon="bx-line-chart" message="No timeline data" /> : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={proceduresOverTimeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="procedures" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, r: 5 }} activeDot={{ r: 7 }} name="Procedures" />
                <Area type="monotone" dataKey="procedures" fill={COLORS.primary} fillOpacity={0.08} stroke="none" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </DashboardCard>
      </div>
      <div className="col-lg-3">
        <DashboardCard title="Emergency vs Elective" icon="bx-doughnut-chart" iconColor="danger" subtitle={patientTypeTotal > 0 ? `${patientTypeTotal} total` : ""}>
          {patientTypeDist.length === 0 ? <EmptyState icon="bx-doughnut-chart" message="No patient type data" /> : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={patientTypeDist} dataKey="value" cx="50%" cy="50%" label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}
                    innerRadius={59} outerRadius={100} paddingAngle={2} cornerRadius={8} startAngle={90} endAngle={-270}>
                    {patientTypeDist.map((entry, index) => (
                      <Cell key={index} fill={entry.color || (index === 0 ? COLORS.red : COLORS.blue)} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="d-flex justify-content-center gap-4 mt-2">
                {patientTypeDist.map((item) => (
                  <div key={item.name} className="d-flex align-items-center gap-1">
                    <span className="d-inline-block rounded-circle" style={{ width: 10, height: 10, backgroundColor: item.color || COLORS.primary }}></span>
                    <span style={{ fontSize: "0.8rem" }}>{item.name}: <strong>{item.value}</strong></span>
                  </div>
                ))}
              </div>
            </>
          )}
        </DashboardCard>
      </div>
      <div className="col-lg-3">
        <DashboardCard title="Patient Outcomes" icon="bx-health" iconColor="success" subtitle={outcomesTotal > 0 ? `${outcomesTotal} total` : ""}>
          {patientOutcomes.length === 0 ? <EmptyState icon="bx-health" message="No outcome data" /> : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={patientOutcomes} cx="50%" cy="50%" dataKey="value" label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}
                    innerRadius={50} outerRadius={100} paddingAngle={2} cornerRadius={8} startAngle={90} endAngle={-270}>
                    {patientOutcomes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || (index === 0 ? COLORS.green : COLORS.red)} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="d-flex justify-content-center gap-4 mt-2">
                {patientOutcomes.map((item) => (
                  <div key={item.name} className="d-flex align-items-center gap-1">
                    <span className="d-inline-block rounded-circle" style={{ width: 10, height: 10, backgroundColor: item.color || COLORS.success }}></span>
                    <span style={{ fontSize: "0.8rem" }}>{item.name}: <strong>{item.value}</strong></span>
                  </div>
                ))}
              </div>
            </>
          )}
        </DashboardCard>
      </div>
    </div>
  );
});

// ============================================================
// ROW 3 – Theatre Utilization + Delay Reasons + Actual vs Estimated
// ============================================================
const Row3Charts = React.memo(({ queryParams }) => {
  const { data: theatreUtilResponse } = useGetTheatreUtilizationQuery(queryParams);
  const { data: delayDistResponse } = useGetDelayDistributionQuery();
  const { data: estimatedVsActualResponse } = useGetEstimatedVsActualDurationQuery(queryParams);

  const theatreUtilData = useMemo(() => theatreUtilResponse?.data?.items || EMPTY_ARRAY, [theatreUtilResponse]);
  const delayDistData = useMemo(() => delayDistResponse?.data?.items || EMPTY_ARRAY, [delayDistResponse]);
  const estimatedVsActual = useMemo(() => estimatedVsActualResponse?.data?.items || EMPTY_ARRAY, [estimatedVsActualResponse]);

  const theatreUtil = useMemo(() => theatreUtilData.map((item) => ({ name: item.name, utilization: item.utilization || 0 })), [theatreUtilData]);
  const delayChartData = useMemo(() => delayDistData.map((d, i) => ({
    name: d.label || d.name, value: d.count || d.value || 0, color: d.color || CHART_COLORS[i % CHART_COLORS.length],
  })), [delayDistData]);

  return (
    <div className="row g-4 mb-4">
      <div className="col-lg-4">
        <DashboardCard title="Theatre Utilization" icon="bx-building" iconColor="teal" subtitle="% utilization by theatre">
          {theatreUtil.length === 0 ? <EmptyState icon="bx-buildings" message="No utilization data" /> : (
            <div style={{ minHeight: 280 }}>
              {theatreUtil.map((item) => (
                <div key={item.name || "unknown"} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span style={{ fontSize: "0.8rem" }} className="fw-medium">{item.name}</span>
                    <span className="fw-bold" style={{ fontSize: "0.85rem" }}>{item.utilization}%</span>
                  </div>
                  <div className="progress" style={{ height: 16, borderRadius: 8 }}>
                    <div className="progress-bar" style={{
                      width: `${item.utilization}%`,
                      backgroundColor: item.utilization >= 80 ? "#16a34a" : item.utilization >= 60 ? "#2563eb" : "#f59e0b",
                      borderRadius: 8, transition: "width 0.8s ease",
                    }}>
                      {item.utilization >= 25 && <span style={{ fontSize: "0.65rem" }}>{item.utilization}%</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
      <div className="col-lg-4">
        <DashboardCard title="Delay Reasons" icon="bx-error" iconColor="warning" subtitle="Ranked by frequency">
          {delayChartData.length === 0 ? <EmptyState icon="bx-error" message="No delay data" /> : (
            <ResponsiveContainer width="100%" height={320}>
              <ReBarChart data={[...delayChartData].sort((a, b) => b.value - a.value)} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Count" radius={[0, 6, 6, 0]}>
                  {delayChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          )}
        </DashboardCard>
      </div>
      <div className="col-lg-4">
        <DashboardCard title="Actual vs Estimated Duration" icon="bx-compare" iconColor="info" subtitle="Minutes per procedure">
          {estimatedVsActual.length === 0 ? <EmptyState icon="bx-compare" message="No comparison data" /> : (
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={estimatedVsActual} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="procedure" tick={{ fontSize: 10, fill: "#64748b" }} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                <Bar dataKey="actual" name="Actual" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="estimated" name="Estimated" stroke={COLORS.success} strokeWidth={2} dot={{ fill: COLORS.success, r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </DashboardCard>
      </div>
    </div>
  );
});

// ============================================================
// ROW 4 – Delays Over Time + Duration Distribution + Procedures by Region
// ============================================================
const Row4Charts = React.memo(({ queryParams }) => {
  const { data: delaysOverTimeResponse } = useGetDelaysOverTimeQuery(queryParams);
  const { data: durationDistResponse } = useGetDurationDistributionQuery(queryParams);
  const { data: proceduresByRegionResponse } = useGetProceduresByRegionQuery(queryParams);

  const delaysOverTimeData = useMemo(() => delaysOverTimeResponse?.data?.items || EMPTY_ARRAY, [delaysOverTimeResponse]);
  const durationDistData = useMemo(() => durationDistResponse?.data?.items || EMPTY_ARRAY, [durationDistResponse]);
  const proceduresByRegionData = useMemo(() => proceduresByRegionResponse?.data?.items || EMPTY_ARRAY, [proceduresByRegionResponse]);

  return (
    <div className="row g-4 mb-4">
      <div className="col-lg-4">
        <DashboardCard title="Procedures With Delays" icon="bx-bar-chart-alt-2" iconColor="warning" subtitle="On-time vs Delayed">
          {delaysOverTimeData.length === 0 ? <EmptyState icon="bx-bar-chart-alt-2" message="No delay timeline data" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <ReBarChart data={delaysOverTimeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barSize={24} stackOffset="sign">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                <Bar dataKey="onTime" name="On Time" stackId="a" fill={COLORS.success} radius={[2, 2, 0, 0]} />
                <Bar dataKey="delayed" name="Delayed" stackId="a" fill={COLORS.danger} radius={[2, 2, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          )}
        </DashboardCard>
      </div>
      <div className="col-lg-4">
        <DashboardCard title="Duration Distribution" icon="bx-pie-chart-alt" iconColor="purple" subtitle="Minute ranges">
          {durationDistData.length === 0 ? <EmptyState icon="bx-pie-chart-alt" message="No duration data" /> : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={durationDistData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {durationDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="row g-1 mt-2">
                {durationDistData.map((item) => (
                  <div key={item.name} className="col-6 d-flex align-items-center gap-1 mb-1">
                    <span className="d-inline-block rounded" style={{ width: 8, height: 8, backgroundColor: item.color || CHART_COLORS[0] }}></span>
                    <span style={{ fontSize: "0.7rem" }}>{item.name}: <strong>{item.value}</strong></span>
                  </div>
                ))}
              </div>
            </>
          )}
        </DashboardCard>
      </div>
      <div className="col-lg-4">
        <DashboardCard title="Procedures by Region" icon="bx-map" iconColor="indigo" subtitle="Ranked by count">
          {proceduresByRegionData.length === 0 ? <EmptyState icon="bx-map" message="No region data" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <ReBarChart data={[...proceduresByRegionData].sort((a, b) => b.count - a.count)} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Procedures" radius={[0, 6, 6, 0]}>
                  {proceduresByRegionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          )}
        </DashboardCard>
      </div>
    </div>
  );
});

// ============================================================
// ROW 5 – Team Performance Table + Heatmap
// ============================================================
const Row5Charts = React.memo(({ queryParams }) => {
  const { data: teamPerformanceResponse } = useGetTeamPerformanceQuery(queryParams);
  const { data: heatmapResponse } = useGetProceduresHeatmapQuery(queryParams);

  const teamPerformanceData = useMemo(() => teamPerformanceResponse?.data?.items || EMPTY_ARRAY, [teamPerformanceResponse]);
  const heatmapData = useMemo(() => heatmapResponse?.data?.items || EMPTY_ARRAY, [heatmapResponse]);

  return (
    <div className="row g-4 mb-4">
      <div className="col-lg-5">
        <DashboardCard title="Team Performance" icon="bx-group" iconColor="primary" badge={`${teamPerformanceData.length} teams`}>
          {teamPerformanceData.length === 0 ? <EmptyState icon="bx-group" message="No team data" /> : (
            <div className="table-responsive team-table">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Team</th>
                    <th className="text-center">Procedures</th>
                    <th className="text-center">Avg Duration</th>
                    <th className="text-center">Delay Rate</th>
                    <th className="text-center">On-Time %</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformanceData.map((row) => (
                    <tr key={row.team}>
                      <td className="fw-medium">{row.team}</td>
                      <td className="text-center">{row.procedures}</td>
                      <td className="text-center">{row.avgDuration} min</td>
                      <td className="text-center">
                        <span className={`badge bg-label-${row.delayRate > 15 ? "danger" : row.delayRate > 10 ? "warning" : "success"}`}>{row.delayRate}%</span>
                      </td>
                      <td className="text-center">
                        <span className={`badge bg-label-${row.onTimePct >= 90 ? "success" : row.onTimePct >= 80 ? "warning" : "danger"}`}>{row.onTimePct}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light fw-bold">
                  <tr>
                    <td>Total / Average</td>
                    <td className="text-center">{teamPerformanceData.reduce((s, r) => s + (r.procedures || 0), 0)}</td>
                    <td className="text-center">{teamPerformanceData.length > 0 ? `${Math.round(teamPerformanceData.reduce((s, r) => s + (r.avgDuration || 0), 0) / teamPerformanceData.length)} min` : "-"}</td>
                    <td className="text-center">{teamPerformanceData.length > 0 ? `${(teamPerformanceData.reduce((s, r) => s + (r.delayRate || 0), 0) / teamPerformanceData.length).toFixed(1)}%` : "-"}</td>
                    <td className="text-center">{teamPerformanceData.length > 0 ? `${(teamPerformanceData.reduce((s, r) => s + (r.onTimePct || 0), 0) / teamPerformanceData.length).toFixed(1)}%` : "-"}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </DashboardCard>
      </div>
      <div className="col-lg-7">
        <DashboardCard title="Procedures by Day & Hour" icon="bx-grid" iconColor="secondary" subtitle="Heatmap">
          {heatmapData.length === 0 ? <EmptyState icon="bx-grid" message="No heatmap data" /> : <HeatmapChart data={heatmapData} />}
        </DashboardCard>
      </div>
    </div>
  );
});

// ============================================================
// MAIN COMPONENT
// ============================================================
const TheatreTimeAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("");
  const [theatreUnitUid, setTheatreUnitUid] = useState("");
  const [procedureUid, setProcedureUid] = useState("");

  // Fetch lookup data for dynamic filter dropdowns
  const { data: theatreUnitsResponse } = useGetTheatreUnitsQuery({ limit: 200 });
  const { data: proceduresResponse } = useGetProceduresQuery({ limit: 200 });

  const theatreUnitOptions = useMemo(() => {
    const units = theatreUnitsResponse?.data?.items || [];
    return [{ uid: "", name: "All Units" }, ...units.map((u) => ({ uid: u.uid, name: u.name }))];
  }, [theatreUnitsResponse]);

  const procedureOptions = useMemo(() => {
    const procs = proceduresResponse?.data?.items || [];
    return [{ uid: "", name: "All Procedures" }, ...procs.map((p) => ({ uid: p.uid, name: p.name }))];
  }, [proceduresResponse]);

  // Query params sent to backend
  // Default empty strings tells backend to return all data (no filter)
  const queryParams = useMemo(() => ({
    dateRange: dateRange || "",
    theatreUnitUid: theatreUnitUid || "",
    procedureUid: procedureUid || "",
  }), [dateRange, theatreUnitUid, procedureUid]);

  // ALWAYS LOADED: KPI cards (critical path)
  const { data: analyticsStatsResponse, isLoading: statsLoading } = useGetAnalyticsStatsQuery(queryParams);
  const analyticsStats = useMemo(() => analyticsStatsResponse?.data || {}, [analyticsStatsResponse]);
  const kpis = useMemo(() => ({
    totalProcedures: analyticsStats.totalProcedures ?? 0,
    totalHours: analyticsStats.totalTheatreHours ? Number(analyticsStats.totalTheatreHours).toFixed(1) : "0.0",
    avgProcedureMinutes: analyticsStats.avgProcedureMinutes ?? 0,
    delayRate: analyticsStats.delayRate ?? 0,
    onTimePct: analyticsStats.onTimePercentage ?? 0,
    mortalityRate: analyticsStats.mortalityRate ?? 0,
    missedEstimateRate: analyticsStats.missedEstimateRate ?? 0,
  }), [analyticsStats]);

  const handleRefresh = useCallback(() => window.location.reload(), []);
  const lastUpdated = useMemo(() => new Date().toLocaleString("en-TZ", { timeZone: "Africa/Dar_es_Salaam", hour12: false }), []);

  return (
    <>
      <BreadCumb pageList={["Theatre Performance Monitor", "Analytics"]} />
      <style>{`
        .dashboard-card { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); border: 1px solid rgba(0,0,0,0.05); }
        .dashboard-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
        .dashboard-card .card-header { background: transparent; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .analytics-header {
          background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #0d9488 100%);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          position: relative; overflow: hidden; color: #fff; border-radius: 16px;
        }
        .analytics-header::before {
          content: ''; position: absolute; top: -50%; right: -10%;
          width: 350px; height: 350px; background: rgba(255,255,255,0.04); border-radius: 50%;
        }
        .analytics-header::after {
          content: ''; position: absolute; bottom: -40%; left: -5%;
          width: 250px; height: 250px; background: rgba(255,255,255,0.03); border-radius: 50%;
        }
        .filter-bar .form-select, .filter-bar .form-control { min-width: 140px; font-size: 0.8rem; border-radius: 8px; }
        .team-table th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
        .team-table td { font-size: 0.85rem; vertical-align: middle; }
        @media (prefers-color-scheme: dark) {
          .dashboard-card { background: #1e293b; border-color: rgba(255,255,255,0.08); }
          .dashboard-card .card-header { border-bottom-color: rgba(255,255,255,0.08); }
          .dashboard-card:hover { box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
          .team-table { color: #e2e8f0; }
          .team-table tbody tr:hover { background: rgba(255,255,255,0.05); }
          .recharts-text { fill: #94a3b8 !important; }
          .recharts-cartesian-grid-horizontal line,
          .recharts-cartesian-grid-vertical line { stroke: rgba(255,255,255,0.1) !important; }
        }
        @media (max-width: 768px) {
          .filter-bar .d-flex { flex-wrap: wrap; }
          .filter-bar .form-select, .filter-bar .form-control { min-width: 100%; margin-bottom: 0.5rem; }
        }
      `}</style>

      {/* HEADER */}
      <div className="card mb-4 analytics-header shadow-sm">
        <div className="card-body position-relative" style={{ zIndex: 1 }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="mb-1 fw-bold text-white d-flex align-items-center gap-2">
                <i className="bx bx-bar-chart-alt-2"></i> Theatre Performance Dashboard
              </h3>
              <p className="text-white-50 mb-0" style={{ fontSize: "0.85rem" }}>
                <i className="bx bx-info-circle me-1"></i> Real-time Overview of Theatre Utilization and Efficiency
              </p>
            </div>
            <Link className="btn btn-sm btn-light text-dark fw-semibold" to="/theatre-time-utilization/procedure-records" style={{ borderRadius: 8 }}>
              <i className="bx bx-plus me-1"></i>New Record
            </Link>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="card mb-4 shadow-sm filter-bar">
        <div className="card-body py-3">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <i className="bx bx-calendar text-muted"></i>
              <select className="form-select form-select-sm" value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ minWidth: 150 }}>
                <option value="">All Dates</option>
                {DATE_RANGE_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bx bx-building-house text-muted"></i>
              <select className="form-select form-select-sm" value={theatreUnitUid} onChange={(e) => setTheatreUnitUid(e.target.value)} style={{ minWidth: 150 }}>
                {theatreUnitOptions.map((opt) => (<option key={opt.uid} value={opt.uid}>{opt.name}</option>))}
              </select>
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="bx bx-task text-muted"></i>
              <select className="form-select form-select-sm" value={procedureUid} onChange={(e) => setProcedureUid(e.target.value)} style={{ minWidth: 180 }}>
                {procedureOptions.map((opt) => (<option key={opt.uid} value={opt.uid}>{opt.name}</option>))}
              </select>
            </div>
            <button className="btn btn-sm btn-outline-primary ms-auto btn-refresh d-flex align-items-center gap-1" onClick={handleRefresh}>
              <i className="bx bx-refresh"></i><span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* ROW 1 – KPI CARDS (always loaded) */}
      <div className="row g-3 mb-4">
        {[
          { title: "Total Procedures", value: kpis.totalProcedures, icon: "bx-clipboard", color: "primary" },
          { title: "Total Theatre Hours", value: `${kpis.totalHours}h`, icon: "bx-time-five", color: "info" },
          { title: "Average Duration", value: `${kpis.avgProcedureMinutes} min`, icon: "bx-timer", color: "secondary" },
          { title: "Delay Rate", value: `${kpis.delayRate}%`, icon: "bx-error-circle", color: "warning" },
          { title: "Completed On-Time", value: `${kpis.onTimePct}%`, icon: "bx-check-circle", color: "success" },
          { title: "Mortality Rate", value: `${kpis.mortalityRate}%`, icon: "bx-heart", color: "danger" },
        ].map((card) => (
          <div key={card.title} className="col-xl col-lg-4 col-md-6 col-sm-6">
            {statsLoading ? <CardSkeleton /> : <StatCard title={card.title} value={card.value} icon={card.icon} color={card.color} />}
          </div>
        ))}
      </div>

      {/* ROW 2 – line + 2 donuts (lazy) */}
      <LazyLoadSection placeholder={<div className="row g-4 mb-4"><div className="col-lg-6"><ChartSkeleton /></div><div className="col-lg-3"><ChartSkeleton /></div><div className="col-lg-3"><ChartSkeleton /></div></div>}>
        <Row2Charts queryParams={queryParams} />
      </LazyLoadSection>

      {/* ROW 3 – progress bars + delay bar + composed (lazy) */}
      <LazyLoadSection placeholder={<div className="row g-4 mb-4"><div className="col-lg-4"><ChartSkeleton /></div><div className="col-lg-4"><ChartSkeleton /></div><div className="col-lg-4"><ChartSkeleton /></div></div>}>
        <Row3Charts queryParams={queryParams} />
      </LazyLoadSection>

      {/* ROW 4 – stacked bar + donut + region bar (lazy) */}
      <LazyLoadSection placeholder={<div className="row g-4 mb-4"><div className="col-lg-4"><ChartSkeleton /></div><div className="col-lg-4"><ChartSkeleton /></div><div className="col-lg-4"><ChartSkeleton /></div></div>}>
        <Row4Charts queryParams={queryParams} />
      </LazyLoadSection>

      {/* ROW 5 – team table + heatmap (lazy) */}
      <LazyLoadSection placeholder={<div className="row g-4 mb-4"><div className="col-lg-5"><ChartSkeleton /></div><div className="col-lg-7"><ChartSkeleton /></div></div>}>
        <Row5Charts queryParams={queryParams} />
      </LazyLoadSection>

      {/* FOOTER */}
      <div className="card shadow-sm">
        <div className="card-body py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-1">
                <i className="bx bx-time text-muted" style={{ fontSize: "0.85rem" }}></i>
                <small className="text-muted">Last updated: <span className="fw-medium">{lastUpdated}</span></small>
              </div>
              <div className="d-flex align-items-center gap-1">
                <i className="bx bx-filter text-muted" style={{ fontSize: "0.85rem" }}></i>
                <small className="text-muted">
                  Filters: <span className="fw-medium">{dateRange || "All Dates"}</span> | <span className="fw-medium">{theatreUnitUid || "All Units"}</span> | <span className="fw-medium">{procedureUid || "All Procedures"}</span>
                </small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-1">
              <i className="bx bx-data text-muted" style={{ fontSize: "0.85rem" }}></i>
              <small className="text-muted">Data source: <span className="fw-medium">Theatre Time Utilization Database</span></small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TheatreTimeAnalyticsPage;