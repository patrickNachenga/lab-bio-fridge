import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage, summarize } from "../bioStorage";
import { PageHeader, Fade, Stat, StatusBadge, formatNum } from "../bioUI";
import { BuilderModal } from "./Modal";

export default function Fridges() {
  const nav = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [showBuilder, setShowBuilder] = useState(false);
  const [created, setCreated] = useState([]);

  const { fridges } = getStorage();
  const list = [...fridges, ...created];
  const filtered = list.filter((f) => {
    const q = search.toLowerCase();
    const sOk = status === "all" || f.status === status;
    return sOk && (!q || f.code.toLowerCase().includes(q) || f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q));
  });

  return (
    <Fade>
      <div className="bio-page">
        <PageHeader
          title="Fridges & Freezers"
          subtitle="Every fridge has a different physical structure — configured dynamically, never assumed."
          crumb="Fridges"
          actions={
            <>
              <button className="btn-bio btn-bio-outline" onClick={() => nav("/temperature-monitoring")}>Temperature</button>
              <button className="btn-bio btn-bio-primary" onClick={() => setShowBuilder(true)}><i className="bx bx-plus" /> New Fridge</button>
            </>
          }
        />

        <div className="bio-grid bio-grid-4">
          <Stat icon="bx bx-fridge" title="Total Units" color="info" value={list.length} />
          <Stat icon="bx bx-check-circle" title="Active" color="ok" value={list.filter((f) => f.status === "active").length} />
          <Stat icon="bx bx-wrench" title="Maintenance" color="warning" value={list.filter((f) => f.status === "maintenance").length} />
          <Stat icon="bx bx-alarm-exclamation" title="Temp Warnings" color="danger" value={list.filter((f) => f.alert === "warning").length} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="Search code, name, type…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: "1 1 240px", padding: "9px 12px", borderRadius: 10, border: "1px solid #dbe3ef", fontSize: 13 }} />
          {["all", "active", "maintenance"].map((s) => (
            <button key={s} className={`bio-chip ${status === s ? "is-active" : ""}`} onClick={() => setStatus(s)}>{s === "all" ? "All" : s}</button>
          ))}
        </div>

        <div className="bio-card">
          <div className="bio-card-title"><i className="bx bx-table" /> Registered Storage Units <span className="bio-card-sub">{filtered.length} shown</span></div>
          <div className="bio-table-wrap">
            <table className="bio-table">
              <thead><tr><th>Unit</th><th>Type</th><th>Temperature</th><th>Capacity</th><th>Occupancy</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
              <tbody>
                {filtered.map((f) => {
                  const summary = summarize(f);
                  const color = summary.pct > 85 ? "#f34848" : summary.pct > 65 ? "#ff9d2e" : "#31b577";
                  return (
                    <tr key={f.id} data-clickable="true" onClick={() => nav(`/fridges/${f.id}`)}>
                      <td><strong>{f.code}</strong><div className="text-muted small">{f.name}</div></td>
                      <td><span className="bio-badge badge-muted">{f.type}</span></td>
                      <td className="num">{f.temp}°C<div className="text-muted small">Range {f.min} to {f.max}°C</div></td>
                      <td className="num">{formatNum(summary.total)}<div className="text-muted small">{formatNum(summary.boxes)} boxes</div></td>
                      <td style={{ minWidth: 150 }}><div className="d-flex justify-content-between small mb-1"><span>{formatNum(summary.occupied)} used</span><strong style={{ color }}>{summary.pct}%</strong></div><div className="bio-bar"><span style={{ width: `${summary.pct}%`, background: color }} /></div></td>
                      <td><StatusBadge status={f.status === "maintenance" ? "maintenance" : f.alert === "warning" ? "warning" : "active"} /></td>
                      <td className="text-end"><button className="btn btn-sm btn-outline-primary" type="button" onClick={(event) => { event.stopPropagation(); nav(`/fridges/${f.id}`); }}><i className="bx bx-chevron-right" /> View</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filtered.length === 0 && <div className="empty-wrap">No fridges match your filters.</div>}

        {showBuilder && <BuilderModal onClose={() => setShowBuilder(false)} onCreated={(f) => { setCreated((p) => [...p, f]); setShowBuilder(false); }} />}
      </div>
    </Fade>
  );
}