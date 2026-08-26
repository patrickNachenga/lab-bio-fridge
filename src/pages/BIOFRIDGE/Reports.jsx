import React, { useState } from "react";
import { getStorage, summarize } from "./bioStorage";
import { samples, projectUsage, movements, excursions, maintenance } from "./bioData";
import { PageHeader, Fade, StatusBadge, formatNum } from "./bioUI";

const TABS = ["Inventory", "Fridge Capacity", "Project Storage", "Sample Movements", "Temperature", "Maintenance", "Historical Location"];

export default function Reports() {
  const [tab, setTab] = useState(TABS[0]);
  const [hist, setHist] = useState("");
  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Reports" crumb="Reports" subtitle="Exportable operational reports"
          actions={<button className="btn-bio btn-bio-primary"><i className="bx bx-export" /> Export</button>} />
        <div className="bio-pill-row">
          {TABS.map((t) => <button key={t} className={`bio-chip ${tab === t ? "is-active" : ""}`} onClick={() => setTab(t)}>{t}</button>)}
        </div>
        {tab === "Inventory" && <InventoryReport />}
        {tab === "Fridge Capacity" && <FridgeReport />}
        {tab === "Project Storage" && <ProjectReport />}
        {tab === "Sample Movements" && <MovementReport />}
        {tab === "Temperature" && <TempReport />}
        {tab === "Maintenance" && <MaintReport />}
        {tab === "Historical Location" && <HistoryReport hist={hist} setHist={setHist} />}
      </div>
    </Fade>
  );
}

function InventoryReport() {
  return (
    <div className="bio-card">
      <div className="bio-card-title"><i className="bx bx-package" /> Inventory Report</div>
      <div className="bio-table-wrap">
        <table className="bio-table">
          <thead><tr><th>Sample ID</th><th>Project</th><th>Type</th><th>Location</th><th>Status</th><th>Date Stored</th></tr></thead>
          <tbody>
            {samples.slice(0, 100).map((s) => (
              <tr key={s.id}><td className="bio-mono">{s.id}</td><td>{s.projectCode}</td><td>{s.type}</td><td className="bio-mono" style={{ fontSize: 11 }}>{s.fridge}/{s.box}/{s.position}</td><td><StatusBadge status="stored" /></td><td>{String(s.stored_on).split("T")[0]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FridgeReport() {
  const { fridges } = getStorage();
  return (
    <div className="bio-card">
      <div className="bio-card-title"><i className="bx bx-fridge" /> Fridge Capacity Report</div>
      <div className="bio-table-wrap">
        <table className="bio-table">
          <thead><tr><th>Fridge</th><th>Temp</th><th>Capacity</th><th>Occupied</th><th>Reserved</th><th>Available</th><th>Utilization</th></tr></thead>
          <tbody>
            {fridges.map((f) => {
              const s = summarize(f); return (
                <tr key={f.id}><td><strong>{f.code}</strong> {f.name}</td><td>{f.temp}°C</td><td className="num">{formatNum(s.total)}</td><td className="num">{formatNum(s.occupied)}</td><td className="num">{formatNum(s.pending)}</td><td className="num">{formatNum(s.available)}</td><td className="num" style={{ fontWeight: 700 }}>{s.pct}%</td></tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProjectReport() {
  return (
    <div className="bio-card">
      <div className="bio-card-title"><i className="bx bx-briefcase" /> Project Storage Report</div>
      <div className="bio-table-wrap">
        <table className="bio-table">
          <thead><tr><th>Project</th><th>Allocated</th><th>Used</th><th>Available</th><th>Utilization</th></tr></thead>
          <tbody>
            {projectUsage.map((p) => (
              <tr key={p.id}><td><strong>{p.name}</strong></td><td className="num">{formatNum(p.allocated)}</td><td className="num">{formatNum(p.used)}</td><td className="num">{formatNum(Math.max(0, p.allocated - p.used))}</td><td className="num" style={{ fontWeight: 700 }}>{p.allocated ? Math.round((p.used / p.allocated) * 100) : 0}%</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MovementReport() {
  return (
    <div className="bio-card">
      <div className="bio-card-title"><i className="bx bx-transfer" /> Sample Movement Report</div>
      <div className="bio-table-wrap">
        <table className="bio-table">
          <thead><tr><th>Sample</th><th>From</th><th>To</th><th>User</th><th>Date</th><th>Reason</th></tr></thead>
          <tbody>
            {movements.map((m) => <tr key={m.id}><td className="bio-mono">{m.sample}</td><td className="bio-mono" style={{ fontSize: 11 }}>{m.from}</td><td className="bio-mono" style={{ fontSize: 11 }}>{m.to}</td><td>{m.by}</td><td>{m.date}</td><td>{m.reason}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TempReport() {
  return (
    <div className="bio-card">
      <div className="bio-card-title"><i className="bx bx-thermometer" /> Temperature Report</div>
      <div className="bio-table-wrap">
        <table className="bio-table">
          <thead><tr><th>Fridge</th><th>Records</th><th>Excursions</th><th>Status</th></tr></thead>
          <tbody>
            {excursions.map((e) => <tr key={e.id}><td><strong>{e.fridge}</strong></td><td>24h</td><td>{e.duration} · {e.maxT}° max</td><td><StatusBadge status={e.status === "open" ? "critical" : "resolved"} /></td></tr>)}
            <tr><td><strong>FRZ-001</strong></td><td>24h</td><td>0</td><td><StatusBadge status="ok" /></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MaintReport() {
  return (
    <div className="bio-card">
      <div className="bio-card-title"><i className="bx bx-wrench" /> Maintenance Report</div>
      <div className="bio-table-wrap">
        <table className="bio-table">
          <thead><tr><th>Fridge</th><th>Type</th><th>Technician</th><th>Date</th><th>Status</th><th>Next</th></tr></thead>
          <tbody>
            {maintenance.map((m) => <tr key={m.id}><td><strong>{m.fridge}</strong></td><td>{m.type}</td><td>{m.technician}</td><td>{m.date}</td><td><StatusBadge status={m.status} /></td><td>{m.next}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HistoryReport({ hist, setHist }) {
  return (
    <div className="bio-card">
      <div className="bio-card-title"><i className="bx bx-history" /> Historical Location Report</div>
      <p style={{ fontSize: 13, color: "#5c6e88" }}>Answer "what was stored at this location over time?" — history is never overwritten.</p>
      <input placeholder="Location e.g. FRZ-002 / B03 / C02 / R04 / BX07 / C5" value={hist} onChange={(e) => setHist(e.target.value)} style={{ width: "100%", padding: 9, borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13, margin: "10px 0" }} />
      <div className="bio-card" style={{ background: "#f2f8ff" }}>
        <div className="bio-mono" style={{ fontWeight: 700 }}>{hist || "FRZ-002 / B03 / C01 / R02 / BX10 / C4"}</div>
        <div className="mini-title">Occupancy history</div>
        <div className="tooltip-row"><span>2026 · Sample BIO-2026-00412 (Project B)</span><strong>Stored</strong></div>
        <div className="tooltip-row"><span>2025 · Project A — Sample A-009</span><strong>Removed</strong></div>
        <div className="tooltip-row"><span>2024 · Project Y — Sample Y-041</span><strong>Removed</strong></div>
        <div className="tooltip-row"><span>2023 · —</span><strong>Empty</strong></div>
      </div>
    </div>
  );
}