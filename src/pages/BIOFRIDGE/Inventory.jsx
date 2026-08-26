import React, { useState } from "react";
import { samples, SAMPLE_TYPES } from "./bioData";
import { PageHeader, Fade, Stat, StatusBadge, formatNum } from "./bioUI";

export default function Inventory() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const f = samples.filter((s) => {
    const t = type === "all" || s.type === type;
    const st = status === "all" || (status === "damaged" ? s.condition === "Damaged" : true);
    const match = (s.id + s.barcode + s.project + s.fridge + s.box).toLowerCase().includes(q.toLowerCase());
    return t && st && match;
  });
  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Sample Inventory" crumb="Sample Inventory" subtitle="Complete view of stored samples"
          actions={<button className="btn-bio btn-bio-primary"><i className="bx bx-export" /> Export Excel</button>} />
        <div className="bio-grid bio-grid-4">
          <Stat icon="bx bx-package" title="Total Items" color="info" value={formatNum(samples.length)} />
          <Stat icon="bx bx-cube" title="Boxes in use" color="purple" value={formatNum(uniqueBoxes())} />
          <Stat icon="bx bx-fridge" title="Fridges active" color="ok" value="5" />
          <Stat icon="bx bx-error-circle" title="Low stock alerts" color="warning" value="2" />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="Search sample, barcode, project, location…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: "1 1 280px", padding: "9px 12px", borderRadius: 10, border: "1px solid #dbe3ef", fontSize: 13 }} />
          <select value={type} onChange={(e) => setType(e.target.value)} style={sel}>
            <option value="all">All types</option>{SAMPLE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={sel}>
            <option value="all">All status</option><option value="stored">Good</option><option value="damaged">Damaged</option>
          </select>
        </div>
        <div className="bio-card">
          <div className="bio-table-wrap">
            <table className="bio-table">
              <thead><tr><th>Sample ID</th><th>Project</th><th>Type</th><th>Volume</th><th>Fridge</th><th>Box</th><th>Position</th><th>Condition</th></tr></thead>
              <tbody>
                {f.slice(0, 240).map((s) => (
                  <tr key={s.id}>
                    <td className="bio-mono" style={{ fontWeight: 700 }}>{s.id}</td>
                    <td>{s.projectCode}</td>
                    <td>{s.type}</td>
                    <td className="num">{s.volume} {s.unit}</td>
                    <td>{s.fridge}</td>
                    <td>{s.box}</td>
                    <td className="bio-mono" style={{ fontSize: 11 }}>{s.position}</td>
                    <td><StatusBadge status={s.condition === "Damaged" ? "critical" : "ok"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {f.length === 0 && <div className="empty-wrap">No samples match.</div>}
        </div>
      </div>
    </Fade>
  );
}
const sel = { padding: "8px 10px", borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13, background: "#fff" };
function uniqueBoxes() { return new Set(samples.map((s) => s.fridge + s.box)).size; }