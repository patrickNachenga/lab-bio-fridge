import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getStorage, summarize } from "./bioStorage";
import { samples, projects, reservations, movements, alerts, auditLog, temperatureReadings, totalSamples } from "./bioData";
import { Fade, StatusBadge, SparkBars, formatNum, formatDate } from "./bioUI";
import { DoughnutChart, StatCard } from "../../components/DashboardCharts";

const palette = ["#1976d2", "#31b577", "#ff9d2e", "#6a3fd8", "#f34848", "#0288d1"];
const levelColor = (l) => (l === "critical" ? "#d32f2f" : l === "warning" ? "#c77700" : "#0288d1");

export default function BioDashboard() {
  const user = useSelector((state) => state.userReducer?.data);
  const nav = useNavigate();
  const { fridges } = getStorage();

  const agg = useMemo(() => {
    let T = 0, O = 0, R = 0, A = 0, M = 0;
    fridges.forEach((f) => {
      const s = summarize(f);
      T += s.total; O += s.occupied; R += s.pending; A += s.available; M += s.maintenance;
    });
    const typeCount = {};
    samples.forEach((sm) => { typeCount[sm.type] = (typeCount[sm.type] || 0) + 1; });
    return {
      T, O, R, A, M,
      occ: T ? Math.round((O / T) * 100) : 0,
      res: T ? Math.round((R / T) * 100) : 0,
      active: fridges.filter((x) => x.status === "active").length,
      maint: fridges.filter((x) => x.status === "maintenance").length,
      typeCount,
      critical: alerts.filter((a) => a.level === "critical").length,
    };
  }, [fridges]);

  const activeProjects = projects.filter((p) => p.status === "active").length;

  return (
    <Fade>
      <div className="bio-page">
        <Hero name={user?.first_name || "Administrator"} onMap={() => nav("/mapping")} onRequest={() => nav("/projects")} />
        <Kpis fridges={fridges} agg={agg} activeProjects={activeProjects} />
        <FridgeCapacity agg={agg} fridges={fridges} onOpen={(id) => nav(`/fridges/${id}`)} />
        <Charts agg={agg} />
        <Feeds onNav={nav} />
      </div>
    </Fade>
  );
}

function Hero({ name, onMap, onRequest }) {
  return (
    <div className="bio-card" style={{ background: "linear-gradient(120deg,#0f4c81 0%,#1b83c8 55%,#2bb3a0 100%)", border: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap", color: "#fff" }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: 1, opacity: 0.85 }}>BIO FREEZER &amp; COLD STORAGE</div>
          <h1 style={{ margin: "6px 0 4px", fontSize: 26, fontWeight: 800 }}>Welcome back, {name}</h1>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Real-time biological sample storage overview · {formatDate(new Date().toISOString())}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-bio" style={{ background: "rgba(255,255,255,.18)", color: "#fff", border: "1px solid rgba(255,255,255,.35)" }} onClick={onMap}>Open Live Map</button>
          <button className="btn-bio" style={{ background: "#fff", color: "#0f4c81" }} onClick={onRequest}>Storage Request</button>
        </div>
      </div>
    </div>
  );
}

function Kpis({ fridges, agg, activeProjects }) {
  return (
    <div className="row g-3">
      <div className="col-xl-3 col-md-6"><StatCard title="Total Fridges" value={fridges.length} icon="bx-fridge" color="primary" subtitle={`${agg.active} active`} /></div>
      <div className="col-xl-3 col-md-6"><StatCard title="Stored Samples" value={formatNum(totalSamples)} icon="bx-test-tube" color="success" subtitle="Across all units" /></div>
      <div className="col-xl-3 col-md-6"><StatCard title="Active Projects" value={activeProjects} icon="bx-folder-open" color="info" subtitle={`${projects.length} total projects`} /></div>
      <div className="col-xl-3 col-md-6"><StatCard title="Active Alerts" value={alerts.length} icon="bx-bell" color="danger" subtitle={`${agg.critical} critical`} /></div>
      <div className="col-xl-3 col-md-6"><StatCard title="Total Capacity" value={formatNum(agg.T)} icon="bx-expand-vertical" color="primary" subtitle="Sample positions" /></div>
      <div className="col-xl-3 col-md-6"><StatCard title="Occupied" value={`${agg.occ}%`} icon="bx-check-shield" color="warning" subtitle={`${formatNum(agg.O)} positions`} /></div>
      <div className="col-xl-3 col-md-6"><StatCard title="Available" value={formatNum(agg.A)} icon="bx-box" color="success" subtitle={`${formatNum(agg.R)} reserved`} /></div>
      <div className="col-xl-3 col-md-6"><StatCard title="Maintenance" value={agg.maint} icon="bx-wrench" color="danger" subtitle={`${formatNum(agg.M)} positions held`} /></div>
    </div>
  );
}

export function LegendRow({ color, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
      <span style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: "#5c6e88" }}>{label}</span>
      <span style={{ marginLeft: "auto", fontWeight: 700, color: "#16304f" }}>{formatNum(value)}</span>
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

function FridgeCapacity({ agg, fridges, onOpen }) {
  return (
    <div className="bio-grid bio-grid-3">
      <div className="bio-card">
        <div className="bio-card-title"><i className="bx bx-pie-chart-alt-2" /> Storage Utilization</div>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 150, height: 150, borderRadius: "50%", background: `conic-gradient(#f34848 0 ${agg.occ}%, #ffc107 ${agg.occ}% ${agg.occ + agg.res}%, #31b577 ${agg.occ + agg.res}% 100%)`, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", textAlign: "center" }}>
              <div><div style={{ fontSize: 20, fontWeight: 800, color: "#16304f" }}>{agg.occ}%</div><div style={{ fontSize: 10, color: "#8a9bb4" }}>Occupied</div></div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <LegendRow color="#f34848" label="Occupied" value={agg.O} />
            <LegendRow color="#ffc107" label="Reserved" value={agg.R} />
            <LegendRow color="#31b577" label="Available" value={agg.A} />
            <LegendRow color="#ff9d2e" label="Maintenance" value={agg.M} />
          </div>
        </div>
      </div>

      <div className="bio-card" style={{ gridColumn: "span 2" }}>
        <div className="bio-card-title"><i className="bx bx-expand-vertical" /> Fridge Capacity</div>
        <div className="bio-table-wrap">
          <table className="bio-table">
            <thead><tr><th>Fridge</th><th>Type</th><th>Temp</th><th className="num">Occupancy</th><th style={{ width: "30%" }}>Bar</th><th>Status</th></tr></thead>
            <tbody>
              {fridges.map((f) => {
                const s = summarize(f);
                const color = s.pct > 85 ? "#f34848" : s.pct > 65 ? "#ff9d2e" : "#31b577";
                return (
                  <tr key={f.id} style={{ cursor: "pointer" }} onClick={() => onOpen(f.id)}>
                    <td><strong>{f.code}</strong></td><td>{f.type}</td><td className="num">{f.temp}°C</td>
                    <td className="num" style={{ fontWeight: 700 }}>{formatNum(s.occupied)} / {formatNum(s.total)}</td>
                    <td><div className="bio-bar"><span style={{ width: `${s.pct}%`, background: color }} /></div></td>
                    <td><StatusBadge status={f.status === "maintenance" ? "maintenance" : f.alert === "warning" ? "warning" : "active"} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function Charts({ agg }) {
  const maxType = Math.max(...Object.values(agg.typeCount), 1);
  return (
    <div className="bio-grid bio-grid-3">
      <div className="bio-card">
        <div className="bio-card-title"><i className="bx bx-pie-chart-alt-2" /> Capacity Status</div>
        <DoughnutChart data={[
          { label: "Occupied", value: agg.O, color: "#f34848" },
          { label: "Reserved", value: agg.R, color: "#ffc107" },
          { label: "Available", value: agg.A, color: "#31b577" },
        ]} centerLabel="Positions" compact layout="stacked" />
      </div>
      <div className="bio-card">
        <div className="bio-card-title"><i className="bx bx-category" /> Samples by Type</div>
        {Object.entries(agg.typeCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v], i) => (
          <BarRow key={k} label={k} value={v} max={maxType} color={palette[i % palette.length]} />
        ))}
      </div>
      <div className="bio-card">
        <div className="bio-card-title"><i className="bx bx-briefcase" /> Samples by Project</div>
        {projectRows().map(([k, v], i) => (
          <BarRow key={k} label={k} value={v} max={Math.max(...projectValues(), 1)} color={palette[(i + 2) % palette.length]} />
        ))}
      </div>
      <div className="bio-card">
        <div className="bio-card-title"><i className="bx bx-thermometer" /> Temperature Trends <span className="bio-card-sub">last 24h</span></div>
        {temperatureReadings.map((tr) => (
          <div key={tr.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 56 }}><strong>{tr.fridge}</strong><div style={{ fontSize: 11, color: "#8a9bb4" }}>{tr.temp}°C</div></div>
            <div style={{ flex: 1 }}><SparkBars values={tr.series.map((p) => p.value)} height={34} color={tr.series.some((p) => !p.ok) ? "#f34848" : "#31b577"} /></div>
            <StatusBadge status={tr.series.some((p) => !p.ok) ? "warning" : "ok"} />
          </div>
        ))}
      </div>
    </div>
  );
}

function projectRows() {
  const m = {};
  samples.forEach((sm) => { m[sm.projectCode || sm.project || "Other"] = (m[sm.projectCode || sm.project || "Other"] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}
function projectValues() { return projectRows().map((r) => r[1]); }

function Feeds({ onNav }) {
  return (
    <div className="bio-grid bio-grid-3">
      <div className="bio-card">
        <div className="bio-card-title"><i className="bx bx-transfer" /> Recent Movements</div>
        {movements.slice(0, 5).map((m) => (
          <div key={m.id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f2f5fa", fontSize: 12, alignItems: "center" }}>
            <span className="bio-mono" style={{ color: "#1976d2", fontWeight: 700 }}>{m.sample}</span>
            <span style={{ color: "#8a9bb4", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.from.split(" / ").slice(0, 4).join("/")} → {m.to.split(" / ")[0]}</span>
            <span style={{ color: "#8a9bb4", whiteSpace: "nowrap" }}>{m.date.split(" ")[0]}</span>
          </div>
        ))}
        <button className="btn-bio btn-bio-outline" style={{ width: "100%", marginTop: 10 }} onClick={() => onNav("/sample-movements")}>View all</button>
      </div>
      <div className="bio-card">
        <div className="bio-card-title"><i className="bx bx-bell-ring" /> Alerts</div>
        {alerts.slice(0, 5).map((a) => (
          <div key={a.id} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #f2f5fa", alignItems: "flex-start" }}>
            <i className="bx bx-bell" style={{ color: levelColor(a.level), fontSize: 16, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 12 }}>{a.type} <span style={{ color: "#8a9bb4" }}>· {a.fridge}</span></div>
              <div style={{ fontSize: 11, color: "#5c6e88" }}>{a.message}</div>
            </div>
            <StatusBadge status={a.level} />
          </div>
        ))}
        <button className="btn-bio btn-bio-outline" style={{ width: "100%", marginTop: 10 }} onClick={() => onNav("/alerts")}>Manage alerts</button>
      </div>
      <div className="bio-card">
        <div className="bio-card-title"><i className="bx bx-file-find" /> Recent Activity</div>
        {auditLog.slice(0, 5).map((a) => (
          <div key={a.id} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #f2f5fa", fontSize: 12 }}>
            <span className="bio-mono" style={{ color: "#5c6e88" }}>{a.user}</span>
            <span>{a.action}</span>
            <span className="bio-mono" style={{ marginLeft: "auto", color: "#8a9bb4" }}>{a.target}</span>
          </div>
        ))}
        <button className="btn-bio btn-bio-outline" style={{ width: "100%", marginTop: 10 }} onClick={() => onNav("/audit-trail")}>Audit trail</button>
      </div>
    </div>
  );
}