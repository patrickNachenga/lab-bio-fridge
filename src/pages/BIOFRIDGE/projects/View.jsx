import React, { useState } from "react";
import { projectUsage, reservations, projects } from "../bioData";
import { PageHeader, Fade, Stat, StatusBadge, formatNum, formatDate } from "../bioUI";
import GraphqlModal from "../../../components/GraphqlModal";
import { FolderPlus } from "lucide-react";

export default function Projects() {
  const [req, setReq] = useState(false);

  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Projects" crumb="Projects" subtitle="Project-based storage requests, allocations and live usage"
          actions={<button className="btn-bio btn-bio-primary" onClick={() => setReq(true)}><i className="bx bx-plus" /> Storage Request</button>} />

        <div className="bio-grid bio-grid-4">
          <Stat icon="bx bx-folder-open" title="Total Projects" color="info" value={projects.length} />
          <Stat icon="bx bx-check-circle" title="Active" color="ok" value={projects.filter((p) => p.status === "active").length} />
          <Stat icon="bx bx-time" title="Awaiting Approval" color="warning" value={projects.filter((p) => p.status === "approval").length} />
          <Stat icon="bx bx-stopwatch" title="Expired" color="danger" value={projects.filter((p) => p.status === "expired").length} />
        </div>

        <div className="bio-grid bio-grid-2">
          {projectUsage.map((p) => {
            const util = p.allocated ? Math.min(100, Math.round((p.used / p.allocated) * 100)) : 0;
            return (
              <div className="bio-card" key={p.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#8a9bb4" }}>{p.code} · {p.pi} · {p.owner}</div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div style={{ display: "flex", gap: 8, margin: "10px 0" }}>
                  <span className="bio-badge badge-info">{p.temp}°C</span>
                  <span className="bio-badge badge-muted">Expected {formatNum(p.samplesExpected)}</span>
                </div>
                <div className="bio-grid bio-grid-3" style={{ gap: 8, textAlign: "center" }}>
                  <div><div style={{ fontSize: 18, fontWeight: 800 }}>{formatNum(p.allocated)}</div><div style={{ fontSize: 10, color: "#8a9bb4" }}>Allocated</div></div>
                  <div><div style={{ fontSize: 18, fontWeight: 800, color: "#d32f2f" }}>{formatNum(p.used)}</div><div style={{ fontSize: 10, color: "#8a9bb4" }}>Used</div></div>
                  <div><div style={{ fontSize: 18, fontWeight: 800, color: "#31b577" }}>{formatNum(Math.max(0, p.allocated - p.used))}</div><div style={{ fontSize: 10, color: "#8a9bb4" }}>Available</div></div>
                </div>
                <div className="mini-title">Utilization {util}%</div>
                <div className="bio-bar"><span style={{ width: `${util}%`, background: util > 85 ? "#f34848" : util > 60 ? "#ff9d2e" : "#31b577" }} /></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#5c6e88", marginTop: 10 }}>
                  <span>From {formatDate(p.from)}</span><span>To {formatDate(p.to)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bio-grid bio-grid-2">
          <div className="bio-card">
            <div className="bio-card-title"><i className="bx bx-calendar-check" /> Reservations</div>
            <div className="bio-table-wrap">
              <table className="bio-table">
                <thead><tr><th>Project</th><th>Unit</th><th>Located</th><th>Status</th></tr></thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td>{r.project}</td><td>{r.unit}</td><td className="bio-mono" style={{ fontSize: 11 }}>{r.detail}</td>
                      <td><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bio-card">
            <div className="bio-card-title"><i className="bx bx-toggle-right" /> Project Lifecycle</div>
            {["Project created", "Storage request", "Availability check", "Smart recommendation", "Admin approval", "Space allocation", "Samples registered & stored", "Live mapping", "Movement / checkout", "Removal & space release", "Historical record retained"].map((s, i) => (
              <div key={s} style={{ display: "flex", gap: 10, alignItems: "center", padding: "5px 0" }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: i < 6 ? "#31b577" : "#e7f0ff", color: i < 6 ? "#fff" : "#1976d2", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: "#24344f" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {req && <RequestModal onClose={() => setReq(false)} />}
    </Fade>
  );
  function RequestModal({ onClose }) {
    const [unit, setUnit] = useState("Boxes");
    const [qty, setQty] = useState(2);
    const est = qty * (unit === "Positions" ? 1 : unit === "Boxes" ? 81 : unit === "Rack" ? 648 : unit === "Column" ? 3240 : unit === "Block" ? 9720 : 38880);
    return (
      <GraphqlModal isOpen title="New Storage Request" subtitle="Reserve space before samples arrive." icon={<FolderPlus size={20} />} onClose={onClose} size="md">
        <>
          <div className="mini-title">Project</div>
          <input className="in" defaultValue="HIV Research Study 2026" style={{ width: "100%", padding: 9, borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13, marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <label style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#5c6e88", marginBottom: 4 }}>Unit</div>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13, background: "#fff" }}>
                {["Positions", "Boxes", "Rack", "Column", "Block", "Whole Fridge"].map((u) => <option key={u}>{u}</option>)}
              </select>
            </label>
            <label style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#5c6e88", marginBottom: 4 }}>Qty</div>
              <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: "100%", padding: 8, borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13 }} />
            </label>
          </div>
          <div style={{ background: "#f2f8ff", borderRadius: 12, padding: 14, margin: "14px 0" }}>
            <div style={{ fontSize: 12, color: "#5c6e88" }}>Estimated positions</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#16304f" }}>{formatNum(est)}</div>
            <div style={{ fontSize: 12, color: "#5c6e88" }}>Temperature requirement −80°C</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button className="btn-bio btn-bio-outline" onClick={onClose}>Cancel</button>
            <button className="btn-bio btn-bio-primary" onClick={onClose}>Submit for approval</button>
          </div>
        </>
      </GraphqlModal>
    );
  }
}