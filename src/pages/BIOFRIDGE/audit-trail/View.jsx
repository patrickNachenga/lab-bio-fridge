import React, { useEffect, useState } from "react";
import { auditLog as seedAudit } from "../bioData";
import { getRepositoryState, repositoryEventName } from "../bioRepository";
import { PageHeader, Fade, Stat, StatusBadge } from "../bioUI";

export default function AuditTrail() {
  const [filter, setFilter] = useState("all");
  const [state, setState] = useState(getRepositoryState);
  useEffect(() => { const refresh = () => setState(getRepositoryState()); window.addEventListener(repositoryEventName(), refresh); return () => window.removeEventListener(repositoryEventName(), refresh); }, []);
  const auditLog = state.auditLog || seedAudit;
  const list = auditLog.filter((a) => filter === "all" || a.action === filter);
  const actions = ["all", ...new Set(auditLog.map((a) => a.action))];
  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Audit Trail" crumb="Audit Trail" subtitle="Immutable record of every important operation" />
        <div className="bio-grid bio-grid-4">
          <Stat icon="bx bx-history" title="Total Events" color="info" value={auditLog.length} />
          <Stat icon="bx bx-user" title="Active Users" color="ok" value="3" />
          <Stat icon="bx bx-move-horizontal" title="Movements" color="warning" value={auditLog.filter((a) => a.action.toLowerCase().includes("move")).length} />
          <Stat icon="bx bx-check-shield" title="Exportable" color="purple" value="Yes" />
        </div>
        <div className="bio-pill-row">
          {actions.map((a) => <button key={a} className={`bio-chip ${filter === a ? "is-active" : ""}`} onClick={() => setFilter(a)}>{a}</button>)}
        </div>
        <div className="bio-card">
          <div className="bio-table-wrap">
            <table className="bio-table">
              <thead><tr><th>User</th><th>Role</th><th>Action</th><th>Target</th><th>Detail</th><th>Date</th></tr></thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id}>
                    <td><strong>{a.user}</strong></td><td>{a.role}</td><td><StatusBadge status="info" /> {a.action}</td>
                    <td className="bio-mono">{a.target}</td><td style={{ fontSize: 12 }}>{a.detail}</td><td>{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fade>
  );
}
