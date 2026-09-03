import React, { useState } from "react";
import { addStorageUnit, buildFridgeTree } from "../bioStorage";
import { FRIDGE_TYPES } from "../bioData";
import { formatNum } from "../bioUI";
import GraphqlModal from "../../../components/GraphqlModal";
import { Boxes } from "lucide-react";

const TEMPLATES = {
  "Standard -80°C": { temp: -80, levels: [{ type: "BLOCK", count: 4 }, { type: "PARTITION", count: 2 }, { type: "DRAWER", count: 3 }, { type: "BOX", count: 8, rows: 9, cols: 9 }] },
  "Rack freezer": { temp: -80, levels: [{ type: "BLOCK", count: 3 }, { type: "RACK", count: 5 }, { type: "BOX", count: 8, rows: 10, cols: 10 }] },
  "Refrigerator 2-8": { temp: 4, levels: [{ type: "BLOCK", count: 2 }, { type: "SHELF", count: 4 }, { type: "BOX", count: 6, rows: 8, cols: 6 }] },
};

export function BuilderModal({ onClose, onCreated }) {
  const [cfg, setCfg] = useState({
    code: "FRZ-004", name: "New Ultra-Low Freezer", type: "Ultra-Low Freezer", temp: -80, location: "Laboratory A",
    levels: TEMPLATES["Standard -80°C"].levels,
  });
  const set = (k) => (e) => setCfg((c) => ({ ...c, [k]: e.target.value }));
  const cap = cfg.levels.reduce((total, level) => total * Number(level.count || 1), 1) * Number(cfg.levels.at(-1)?.rows || 1) * Number(cfg.levels.at(-1)?.cols || 1);

  return (
    <GraphqlModal isOpen title="Fridge Structure Builder" subtitle="Configure the physical hierarchy and calculate capacity before adding a unit." icon={<Boxes size={20} />} onClose={onClose} size="lg">
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="bio-badge badge-info">Dynamic structure</span>
        </div>
        <p style={{ fontSize: 13, color: "#5c6e88", margin: "6px 0 16px" }}>
          Define the physical levels for this unit. The repository stores them as a parent-child structure, so another unit can use a different arrangement.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {Object.keys(TEMPLATES).map((nm) => (
          <button className="bio-chip" key={nm} onClick={() => setCfg((c) => ({ ...c, ...TEMPLATES[nm] }))}><i className="bx bx-layer" /> {nm}</button>
          ))}
        </div>

        <div className="bio-grid bio-grid-3" style={{ marginBottom: 12 }}>
          <Field label="Code" value={cfg.code} onChange={set("code")} />
          <Field label="Name" value={cfg.name} onChange={set("name")} />
          <Field label="Type" type="select" value={cfg.type} onChange={set("type")} opts={FRIDGE_TYPES} />
        </div>
        <div className="bio-grid bio-grid-4" style={{ marginBottom: 12 }}>
          <Field label="Temperature (°C)" type="number" value={cfg.temp} onChange={set("temp")} />
          <Field label="Location" value={cfg.location} onChange={set("location")} />
        </div>

        <div className="mini-title">Storage hierarchy</div>
        {cfg.levels.map((level, index) => <div key={`${level.type}-${index}`} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px auto", gap: 8, alignItems: "end", marginBottom: 8 }}>
          <Field label={index === 0 ? "Node type" : "Child node type"} type="text" value={level.type} onChange={(e) => setCfg((c) => ({ ...c, levels: c.levels.map((x, i) => i === index ? { ...x, type: e.target.value.toUpperCase() } : x) }))} />
          <Field label="Count" type="number" value={level.count} onChange={(e) => setCfg((c) => ({ ...c, levels: c.levels.map((x, i) => i === index ? { ...x, count: Number(e.target.value) } : x) }))} />
          {index === cfg.levels.length - 1 && <><Field label="Rows" type="number" value={level.rows || 1} onChange={(e) => setCfg((c) => ({ ...c, levels: c.levels.map((x, i) => i === index ? { ...x, rows: Number(e.target.value) } : x) }))} /><Field label="Columns" type="number" value={level.cols || 1} onChange={(e) => setCfg((c) => ({ ...c, levels: c.levels.map((x, i) => i === index ? { ...x, cols: Number(e.target.value) } : x) }))} /></>}
          {index > 0 && <button className="btn-bio btn-bio-outline" onClick={() => setCfg((c) => ({ ...c, levels: c.levels.filter((_, i) => i !== index) }))}>Remove</button>}
        </div>)}
        <button className="btn-bio btn-bio-outline" onClick={() => setCfg((c) => ({ ...c, levels: [...c.levels.slice(0, -1), { type: "NODE", count: 1 }, c.levels.at(-1)] }))}><i className="bx bx-plus" /> Add level</button>

        <div style={{ background: "#f2f8ff", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#5c6e88" }}>Calculated capacity</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#16304f" }}>{formatNum(cap)} <span style={{ fontSize: 14, fontWeight: 500, color: "#5c6e88" }}>sample positions</span></div>
          <div style={{ fontSize: 12, color: "#5c6e88", marginTop: 4 }}>
            {cfg.levels.map((level) => `${level.count} ${level.type.toLowerCase()}`).join(" × ")} × {cfg.levels.at(-1)?.rows || 1} × {cfg.levels.at(-1)?.cols || 1} positions = {formatNum(cap)}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="btn-bio btn-bio-outline" onClick={onClose}>Cancel</button>
          <button className="btn-bio btn-bio-primary" onClick={() => { const unit = makeFridge(cfg); addStorageUnit(unit); onCreated(buildFridgeTree(unit)); }}>Generate Structure</button>
        </div>
      </>
    </GraphqlModal>
  );
}

function makeFridge(cfg) {
  const c = {
    id: "new-" + cfg.code,
    code: cfg.code, name: cfg.name, type: cfg.type, temp: Number(cfg.temp),
    min: Number(cfg.temp) - 10, max: Number(cfg.temp) + 10,
    location: cfg.location, room: "—", facility: "MNH BioBank",
    status: "active", alert: "ok", model: "Custom",
    structure: [{ levels: cfg.levels.map((level) => ({ ...level, count: Number(level.count) || 1, rows: Number(level.rows) || undefined, cols: Number(level.cols) || undefined })) }],
  };
  return c;
}

function Field({ label, value, onChange, type = "text", opts }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#5c6e88", marginBottom: 4 }}>{label}</div>
      {type === "select" ? (
        <select value={value} onChange={onChange} style={{ width: "100%", padding: "8px 10px", borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13, background: "#fff" }}>
          {(opts || []).map((t) => <option key={t}>{t}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={onChange} style={{ width: "100%", padding: "8px 10px", borderRadius: 9, border: "1px solid #dbe6f0", fontSize: 13 }} />
      )}
    </label>
  );
}
