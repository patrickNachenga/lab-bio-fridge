import React, { useEffect, useState } from "react";
import { movements as seedMovements } from "../bioData";
import { getRepositoryState, moveSample, parseLocation, repositoryEventName } from "../bioRepository";
import { PageHeader, Fade, Stat, StatusBadge } from "../bioUI";
import GraphqlModal from "../../../components/GraphqlModal";
import { ArrowRightLeft } from "lucide-react";

export default function Movements() {
  const [show, setShow] = useState(false);
  const [state, setState] = useState(getRepositoryState);
  useEffect(() => { const refresh = () => setState(getRepositoryState()); window.addEventListener(repositoryEventName(), refresh); return () => window.removeEventListener(repositoryEventName(), refresh); }, []);
  const movements = state.movements || seedMovements;
  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Sample Movements" crumb="Sample Movements" subtitle="Traceable movement, checkout and return history"
          actions={<button className="btn-bio btn-bio-primary" onClick={() => setShow(true)}><i className="bx bx-move-horizontal" /> Perform Movement</button>} />
        <div className="bio-grid bio-grid-4">
          <Stat icon="bx bx-transfer" title="Total Movements" color="info" value={movements.length} />
          <Stat icon="bx bx-check-circle" title="Completed" color="ok" value={movements.filter((m) => m.status === "completed").length} />
          <Stat icon="bx bx-time" title="Pending" color="warning" value={movements.filter((m) => m.status === "pending").length} />
          <Stat icon="bx bx-log-out" title="To disposal" color="danger" value={movements.filter((m) => m.removal).length} />
        </div>
        <div className="bio-card">
          <div className="bio-table-wrap">
            <table className="bio-table">
              <thead><tr><th>Sample</th><th>From</th><th>To</th><th>By</th><th>Date</th><th>Reason</th><th>Status</th></tr></thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td className="bio-mono" style={{ fontWeight: 700 }}>{m.sample}</td>
                    <td className="bio-mono" style={{ fontSize: 10 }}>{m.from}</td>
                    <td className="bio-mono" style={{ fontSize: 10 }}>{m.to}</td>
                    <td>{m.by}</td><td>{m.date}</td><td style={{ fontSize: 12 }}>{m.reason}</td>
                    <td><StatusBadge status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {show && <MoveModal samples={state.samples || []} onClose={() => setShow(false)} onSave={(sampleId, input) => { moveSample(sampleId, input); setShow(false); }} />}
    </Fade>
  );
}

function MoveModal({ onClose, samples, onSave }) {
  const [sampleId, setSampleId] = useState(samples[0]?.id || "");
  const [to, setTo] = useState("FRZ-002 / B03 / C01 / R02 / BX10 / C4");
  const [reason, setReason] = useState("Relocation");
  const [condition, setCondition] = useState("Good");
  return (
    <GraphqlModal isOpen title="Move Sample" subtitle="Release the old position and record the new location." icon={<ArrowRightLeft size={20} />} onClose={onClose} size="md">
      <>
        <div className="mini-title">Sample</div>
        <select value={sampleId} onChange={(e) => setSampleId(e.target.value)} style={{ width: "100%", padding: 9, borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13, marginBottom: 10 }}>{samples.map((sample) => <option key={sample.id}>{sample.id}</option>)}</select>
        <div className="mini-title">From</div>
        <div className="bio-mono" style={{ fontSize: 12, padding: "8px 10px", background: "#f2f5fa", borderRadius: 8 }}>FRZ-001 / B01 / C02 / R03 / BX05 / A1</div>
        <div className="mini-title">To</div>
        <input className="in" value={to} onChange={(e) => setTo(e.target.value)} style={{ width: "100%", padding: 9, borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 12, margin: "0 0 10px" }} />
        <div style={{ display: "flex", gap: 10 }}>
          <label style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#5c6e88", marginBottom: 4 }}>Reason</div><input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Freezer maintenance" style={{ width: "100%", padding: 8, borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13 }} /></label>
          <label style={{ flex: 1 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#5c6e88", marginBottom: 4 }}>Condition</div>
            <select value={condition} onChange={(e) => setCondition(e.target.value)} style={{ width: "100%", padding: 8, borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13, background: "#fff" }}><option>Good</option><option>Inside</option><option>Thawing</option></select>
          </label>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <button className="btn-bio btn-bio-outline" onClick={onClose}>Cancel</button>
          <button className="btn-bio btn-bio-primary" disabled={!sampleId || !parseLocation(to).fridge} onClick={() => onSave(sampleId, { ...parseLocation(to), reason, condition })}>Confirm Move</button>
        </div>
      </>
    </GraphqlModal>
  );
}
