import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function formatNum(n) {
  return (n || 0).toLocaleString();
}

export function formatDate(iso) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return iso; }
}

export function StatusBadge({ status }) {
  const map = {
    active: ["badge-active", "Active"],
    completed: ["badge-ok", "Completed"],
    open: ["badge-danger", "Open"],
    resolved: ["badge-ok", "Resolved"],
    ok: ["badge-ok", "Normal"],
    warning: ["badge-warning", "Warning"],
    maintenance: ["badge-warning", "Maintenance"],
    pending: ["badge-info", "Pending"],
    approval: ["badge-purple", "Approval"],
    allocated: ["badge-info", "Allocated"],
    expired: ["badge-muted", "Expired"],
    stored: ["badge-ok", "Stored"],
    critical: ["badge-danger", "Critical"],
    info: ["badge-info", "Info"],
  };
  const [cls, label] = map[status] || ["badge-muted", status || "—"];
  return <span className={`bio-badge ${cls}`}>{label}</span>;
}

export const cellStyle = {
  occupied: "#f34848", reserved: "#ffc107", pending: "#ffc107", available: "#31b577", maintenance: "#ff9d2e", disabled: "#dce1ea",
};
export function cellClass(st) {
  return `bio-cell st-${st === "reserved" ? "pending" : st}`;
}

export function Legend() {
  return (
    <div className="legend">
      <span><i style={{ background: cellStyle.occupied }} />Occupied</span>
      <span><i style={{ background: cellStyle.available }} />Available</span>
      <span><i style={{ background: cellStyle.reserved }} />Reserved</span>
      <span><i style={{ background: cellStyle.maintenance }} />Maintenance</span>
      <span><i style={{ background: cellStyle.disabled }} />Disabled</span>
    </div>
  );
}

export function CapacityBar({ pct, color }) {
  return (
    <div className="bio-bar">
      <span style={{ width: `${Math.min(100, Math.max(0, pct || 0))}%`, background: color || pct > 85 ? "#f34848" : pct > 65 ? "#ff9d2e" : "#31b577" }} />
    </div>
  );
}

export function Stat({ title, value, icon, color, foot, top }) {
  const bg = { primary: "#e7f0ff", warning: "#fff4e0", danger: "#ffe7e7", ok: "#e8f7ef", info: "#e8f4fb", purple: "#efeaff" };
  const fg = { primary: "#1976d2", warning: "#c77700", danger: "#d32f2f", ok: "#1e8e5a", info: "#0288d1", purple: "#6a3fd8" };
  return (
    <div className={top ? "bio-stat top" : "bio-stat"}>
      <div className="s-ic" style={top ? undefined : { background: bg[color], color: fg[color] }}>
        <i className={icon} />
      </div>
      <div className="s-val">{value}</div>
      <div className="s-lab">{title}</div>
      {foot && <div className="s-foot">{foot}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, crumb, actions }) {
  return (
    <div className="bio-page-header bio-page-banner">
      <div>
        {crumb && (
          <div className="bio-crumbs">
            <Link to="/">Dashboard</Link><span>/</span><span>{crumb}</span>
          </div>
        )}
        <h1 className="bio-page-title"><i className="bx bx-fridge" /> {title}</h1>
        {subtitle && <div className="bio-page-subtitle">{subtitle}</div>}
      </div>
      {actions && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

export function SparkBars({ values, height = 46, color }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const hgt = (v) => 6 + ((v - min) / span) * (height - 6);
  return (
    <div className="spark-wrap" style={{ height }}>
      {values.map((v, i) => (
        <span key={i} className="spark-bar" style={{ height: hgt(v), background: color || "#31b577" }} />
      ))}
    </div>
  );
}

export function BarRow({ label, value, max = 1, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
      <span style={{ width: 96, fontSize: 12, color: "#3c4f6f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <div className="bio-bar" style={{ flex: 1 }}><span style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} /></div>
      <span className="num" style={{ fontSize: 12, fontWeight: 700, color: "#16304f" }}>{value}</span>
    </div>
  );
}

export function Fade({ children }) {
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>{children}</motion.div>;
}

export function SampleChip({ id }) {
  return <span className="tex bio-mono">{id}</span>;
}

// Row of status pills used by most filterable pages
export function FilterChip({ label, isActive, onClick }) {
  return (
    <button className={`bio-chip ${isActive ? "is-active" : ""}`} type="button" onClick={onClick}>{label}</button>
  );
}

export function NavLinkBtn({ to, children }) {
  const nav = useNavigate();
  return (
    <button className="btn-bio btn-bio-outline" onClick={() => nav(to)}>{children}</button>
  );
}