import React, { useEffect, useState } from "react";
import { samples, SAMPLE_TYPES } from "../bioData";
import { getRepositoryState, registerSample, repositoryEventName } from "../bioRepository";
import { PageHeader, Fade, Stat, StatusBadge, formatNum } from "../bioUI";
import GraphqlModal from "../../../components/GraphqlModal";
import { Boxes } from "lucide-react";

export default function Samples() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [detail, setDetail] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [state, setState] = useState(getRepositoryState);
  useEffect(() => { const refresh = () => setState(getRepositoryState()); window.addEventListener(repositoryEventName(), refresh); return () => window.removeEventListener(repositoryEventName(), refresh); }, []);
  const records = state.samples || samples;

  const filtered = records.filter((s) => {
    const t = type === "all" || s.type === type;
    const text = (s.id + " " + s.barcode + " " + s.project + " " + s.type).toLowerCase();
    return t && text.includes(q.toLowerCase());
  });

  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Samples" crumb="Samples" subtitle={`${formatNum(samples.length)} registered biological samples with traceable locations`}
          actions={<button className="btn-bio btn-bio-primary" onClick={() => setShowRegister(true)}><i className="bx bx-plus" /> Register Sample</button>} />

        <div className="bio-grid bio-grid-4">
          <Stat icon="bx bx-test-tube" title="Total" color="info" value={formatNum(records.length)} />
          <Stat icon="bx bx-check-circle" title="Stored" color="ok" value={formatNum(records.filter((s) => s.status === "stored").length)} />
          <Stat icon="bx bx-move-horizontal" title="Moved (30d)" color="warning" value="5" />
          <Stat icon="bx bx-x-circle" title="Damaged" color="danger" value={records.filter((s) => s.condition === "Damaged").length} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="Search ID, barcode, project, type…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: "1 1 260px", padding: "9px 12px", borderRadius: 10, border: "1px solid #dbe3ef", fontSize: 13 }} />
          {["all", ...SAMPLE_TYPES].map((t) => (
            <button key={t} className={`bio-chip ${type === t ? "is-active" : ""}`} onClick={() => setType(t)}>{t === "all" ? "All types" : t}</button>
          ))}
        </div>

        <div className="bio-card">
          <div className="bio-table-wrap">
            <table className="bio-table">
              <thead><tr><th>Sample ID</th><th>Barcode</th><th>Project</th><th>Type</th><th>Source</th><th>Location</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.slice(0, 200).map((s) => (
                  <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => setDetail(s)}>
                    <td className="bio-mono" style={{ fontWeight: 700 }}>{s.id}</td>
                    <td className="bio-mono" style={{ color: "#8a9bb4" }}>{s.barcode}</td>
                    <td>{s.projectCode}</td>
                    <td>{s.type}</td>
                    <td>{s.source}</td>
                    <td className="bio-mono" style={{ fontSize: 11 }}>{s.fridge} / {s.block} / {s.column} / {s.rack} / {s.box} / {s.position}</td>
                    <td><StatusBadge status={s.condition === "Damaged" ? "critical" : "stored"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="empty-wrap">No samples match.</div>}
        </div>
      </div>
      {detail && <SampleModal s={detail} onClose={() => setDetail(null)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSave={(input) => { registerSample(input); setShowRegister(false); }} />}
    </Fade>
  );
}

function RegisterModal({ onClose, onSave }) {
  const [form, setForm] = useState({ id: "", barcode: "", projectCode: "", type: SAMPLE_TYPES[0], source: "Human", volume: "1", unit: "mL" });
  const set = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));
  return <GraphqlModal isOpen title="Register Sample" subtitle="Create the sample record before placing it in storage." icon={<Boxes size={20} />} onClose={onClose} size="md"><>
    <div className="bio-grid bio-grid-2" style={{ gap: 10 }}>
      <Field label="Sample ID" value={form.id} onChange={set("id")} placeholder="Generated if blank" />
      <Field label="Barcode" value={form.barcode} onChange={set("barcode")} placeholder="Generated if blank" />
      <Field label="Project code" value={form.projectCode} onChange={set("projectCode")} />
      <label><small>Sample type</small><select value={form.type} onChange={set("type")} style={inputStyle}>{SAMPLE_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
      <Field label="Source" value={form.source} onChange={set("source")} />
      <Field label="Volume" value={form.volume} onChange={set("volume")} />
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}><button className="btn-bio btn-bio-outline" onClick={onClose}>Cancel</button><button className="btn-bio btn-bio-primary" onClick={() => onSave(form)}>Register sample</button></div>
  </></GraphqlModal>;
}

function Field({ label, value, onChange, placeholder }) { return <label><small>{label}</small><input value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} /></label>; }
const inputStyle = { width: "100%", padding: 9, borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13, background: "#fff" };

function SampleModal({ s, onClose }) {
  return (
    <GraphqlModal isOpen title={s.id} subtitle={`Barcode ${s.barcode}`} icon={<Boxes size={20} />} onClose={onClose} size="md">
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="bio-mono" style={{ fontSize: 13, fontWeight: 800 }}>Sample record</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
          <StatusBadge status="stored" />
          <span className="bio-badge badge-muted">{s.condition}</span>
        </div>
        <div className="bio-card" style={{ background: "#f2f8ff", border: "1px solid #dcebfa" }}>
          <div className="mini-title" style={{ marginTop: 0 }}>Current Location</div>
          <div className="bio-mono" style={{ fontSize: 13, fontWeight: 600, color: "#16304f" }}>{s.fridge} / {s.block} / {s.column} / {s.rack} / {s.box} / {s.position}</div>
          <div className="mini-title">Details</div>
          <div className="bio-grid bio-grid-2" style={{ gap: 8 }}>
            <Row k="Project" v={s.project} />
            <Row k="PI / Owner" v={`${s.project_pi} - ${s.owner}`} />
            <Row k="Type / Source" v={`${s.type} - ${s.source}`} />
            <Row k="Nature" v={s.nature} />
            <Row k="Volume" v={`${s.volume} ${s.unit}`} />
            <Row k="Container" v={s.container} />
            <Row k="Collected" v={String(s.collected).split("T")[0]} />
            <Row k="Stored on" v={String(s.stored_on).split("T")[0]} />
          </div>
        </div>
        <div className="mini-title">Sample History</div>
        <div style={{ fontSize: 13, color: "#3c4f6f" }}>
          <div className="tooltip-row"><span>Stored at {s.fridge}/{s.block}/{s.column}/{s.rack}/{s.box}/{s.position}</span><strong>{String(s.stored_on).split("T")[0]}</strong></div>
          <div className="tooltip-row"><span>Received from {s.source} source</span><strong>{String(s.received || s.stored_on).split("T")[0]}</strong></div>
          <div className="tooltip-row"><span>Registered under project {s.projectCode}</span><strong>-</strong></div>
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn-bio btn-bio-outline">Move</button>
          <button className="btn-bio btn-bio-outline">Checkout</button>
          <button className="btn-bio btn-bio-primary">Print barcode</button>
        </div>
      </>
    </GraphqlModal>
  );
}

function Row({ k, v }) {
  return <div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: .4, color: "#8a9bb4" }}>{k}</div><div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div></div>;
}
