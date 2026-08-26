import React, { useState } from "react";
import { buildFridgeTree } from "./bioStorage";
import { FRIDGE_TYPES } from "./bioData";
import { formatNum } from "./bioUI";
import GraphqlModal from "../../components/GraphqlModal";
import { Boxes } from "lucide-react";

const TEMPLATES = {
  "Standard -80°C": { temp: -80, blocks: 4, columns: 3, racks: 5, boxes: 8, grid: 81 },
  "Plasma -20°C": { temp: -25, blocks: 2, columns: 4, racks: 6, boxes: 10, grid: 50 },
  "Refrigerator 2-8": { temp: 4, blocks: 2, columns: 2, racks: 4, boxes: 6, grid: 48 },
};

export function BuilderModal({ onClose, onCreated }) {
  const [cfg, setCfg] = useState({
    code: "FRZ-004", name: "New Ultra-Low Freezer", type: "Ultra-Low Freezer", temp: -80, location: "Laboratory A",
    blocks: 4, columns: 3, racks: 5, boxes: 8, grid: 81,
  });
  const set = (k) => (e) => setCfg((c) => ({ ...c, [k]: e.target.value }));
  const cap = Number(cfg.blocks) * Number(cfg.columns) * Number(cfg.racks) * Number(cfg.boxes) * Number(cfg.grid);

  return (
    <GraphqlModal isOpen title="Fridge Structure Builder" subtitle="Configure the physical hierarchy and calculate capacity before adding a unit." icon={<Boxes size={20} />} onClose={onClose} size="lg">
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="bio-badge badge-info">Dynamic structure</span>
        </div>
        <p style={{ fontSize: 13, color: "#5c6e88", margin: "6px 0 16px" }}>
          Nothing is hard-coded — define blocks, columns, racks, boxes and the box grid. Capacity is computed automatically for this fridge.
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
          <Field label="Blocks" type="number" value={cfg.blocks} onChange={set("blocks")} />
          <Field label="Columns / block" type="number" value={cfg.columns} onChange={set("columns")} />
          <Field label="Racks / column" type="number" value={cfg.racks} onChange={set("racks")} />
          <Field label="Boxes / rack" type="number" value={cfg.boxes} onChange={set("boxes")} />
          <Field label="Box grid (A²)" type="number" value={cfg.grid} onChange={set("grid")} />
        </div>

        <div style={{ background: "#f2f8ff", borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#5c6e88" }}>Calculated capacity</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#16304f" }}>{formatNum(cap)} <span style={{ fontSize: 14, fontWeight: 500, color: "#5c6e88" }}>sample positions</span></div>
          <div style={{ fontSize: 12, color: "#5c6e88", marginTop: 4 }}>
            {cfg.blocks} blocks × {cfg.columns} cols × {cfg.racks} racks × {cfg.boxes} boxes × {cfg.grid} positions = {formatNum(cap)}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button className="btn-bio btn-bio-outline" onClick={onClose}>Cancel</button>
          <button className="btn-bio btn-bio-primary" onClick={() => onCreated(makeFridge(cfg))}>Generate Structure</button>
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
    structure: Array.from({ length: Number(cfg.blocks) }, () => ({
      columns: Number(cfg.columns), racksPerColumn: Number(cfg.racks),
      boxesPerRack: Number(cfg.boxes),
      grid: { rows: 9, cols: Math.max(1, Math.round(Math.sqrt(Number(cfg.grid)))) },
    })),
  };
  return buildFridgeTree(c);
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