import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStorage, summarize, positionLabel, collectBoxes } from "../bioStorage";
import { samples } from "../bioData";
import { PageHeader, Fade, Legend, StatusBadge, formatNum } from "../bioUI";
import GraphqlModal from "../../../components/GraphqlModal";
import { Boxes } from "lucide-react";

export default function FridgeDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { fridges } = getStorage();
  const fridge = fridges.find((f) => f.id === id || f.code === id) || fridges[0];

  const [selBox, setSelBox] = useState(null);
  const [selCell, setSelCell] = useState(null);

  const allBoxes = useMemo(() => collectBoxes(fridge, []), [fridge]);
  const box = selBox && allBoxes.some((item) => item.id === selBox.id) ? selBox : allBoxes[0] || null;

  const stats = useMemo(() => summarize(fridge), [fridge]);

  return (
    <Fade>
      <div className="bio-page">
        <PageHeader crumb="Fridges" title={fridge.code}
          subtitle={`${fridge.name} · ${fridge.location}`}
          actions={
            <>
              <StatusBadge status={fridge.status === "maintenance" ? "maintenance" : fridge.alert === "warning" ? "warning" : "active"} />
              <button className="btn-bio btn-bio-outline" onClick={() => nav("/fridges")}>All fridges</button>
              <button className="btn-bio btn-bio-primary" onClick={() => nav("/sample-movements")}>Move sample</button>
            </>
          }
        />

        <div className="bio-card" style={{ background: "linear-gradient(120deg,#0f4c81,#1b83c8 70%,#2bb3a0)" }}>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", color: "#fff" }}>
            <InfoCell label="Type" value={fridge.type} />
            <InfoCell label="Set point" value={`${fridge.temp}°C`} />
            <InfoCell label="Range" value={`${fridge.min} .. ${fridge.max}°C`} />
            <InfoCell label="Room" value={fridge.room} />
            <InfoCell label="Model" value={fridge.model} />
            <InfoCell label="Occupancy" value={`${stats.pct}%`} />
          </div>
        </div>

        <div className="bio-grid bio-grid-4">
          <MiniStat label="Total positions" value={formatNum(stats.total)} />
          <MiniStat label="Occupied" value={formatNum(stats.occupied)} />
          <MiniStat label="Reserved / Available" value={`${formatNum(stats.pending)} / ${formatNum(stats.available)}`} />
          <MiniStat label="Maintenance" value={formatNum(stats.maintenance)} />
        </div>

        <div className="bio-grid" style={{ gridTemplateColumns: "minmax(360px,1.1fr) minmax(0,1.4fr)" }}>
          <MapNav fridge={fridge} onBox={setSelBox} selectedBox={box} />
          <BoxPanel box={box} onCell={setSelCell} />
        </div>
      </div>
      {selCell && <CellModal box={box} cell={selCell} onClose={() => setSelCell(null)} />}
    </Fade>
  );
}

function InfoCell({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, opacity: 0.75 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 15 }}>{value}</div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bio-card">
      <div style={{ fontSize: 12, color: "#8a9bb4" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#16304f" }}>{value}</div>
    </div>
  );
}

function MapNav({ fridge, onBox, selectedBox }) {
  return (
    <div className="bio-card">
      <div className="bio-card-title"><i className="bx bx-map" /> Live Storage Map <span className="bio-card-sub">{fridge.code} · configurable hierarchy</span></div>
      <div className="storage-tree">{fridge.children.map((node) => <NodeBranch key={node.id} node={node} onBox={onBox} selectedBox={selectedBox} />)}</div>

      <div style={{ fontSize: 11, color: "#8a9bb4", marginTop: 12 }}>
        Click a <strong>box</strong> to inspect the position grid, then a cell for sample details &amp; history.
      </div>
    </div>
  );
}

function NodeBranch({ node, onBox, selectedBox }) {
  if (node.level === "box") return <button className="bio-chip" style={{ borderColor: selectedBox?.id === node.id ? "#1976d2" : undefined, color: boxColor(node), margin: 3 }} onClick={() => onBox(node)}>{node.label} · {summarize(node).pct}%</button>;
  return <div style={{ margin: "8px 0 8px 10px", paddingLeft: 10, borderLeft: "2px solid #e4ebf5" }}><div className="mini-title" style={{ marginTop: 0 }}>{node.nodeType || node.level} <span className="bio-card-sub">{node.label}</span></div>{node.children.map((child) => <NodeBranch key={child.id} node={child} onBox={onBox} selectedBox={selectedBox} />)}</div>;
}

function boxColor(b) {
  const s = summarize(b);
  return s.pct > 60 ? "#d32f2f" : s.pct > 40 ? "#c77700" : "#1976d2";
}

function BoxPanel({ box, onCell }) {
  if (!box) return <div className="bio-card empty-wrap">Choose a box</div>;
  return (
    <div className="bio-card">
      <div className="bio-card-title">
        <i className="bx bx-cube" /> Box {box.label}
        <span className="bio-card-sub">{box.id.split("/").slice(0, 4).join(" / ")}</span>
      </div>
      <div className="bio-grid bio-grid-4" style={{ marginBottom: 14 }}>
        <MiniStat label="Capacity" value={box.capacity} />
        <MiniStat label="Occupied" value={box.stats.occupied} />
        <MiniStat label="Reserved" value={box.stats.pending} />
        <MiniStat label="Available" value={box.stats.available} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <Legend />
        <span style={{ fontSize: 11, color: "#8a9bb4" }}>Click a cell for details</span>
      </div>
      <div className="box-grid" style={{ ["--cols"]: box.cols }}>
        <div className="corner" />
        {box.map[0].map((_, ci) => <div key={ci} className="ghead">{ci + 1}</div>)}
        {box.map.map((row, ri) => (
          <React.Fragment key={ri}>
            <div className="grow">{'ABCDEFGHIJKLMN'.charAt(ri) || ri + 1}</div>
            {row.map((cell, ci) => (
              <div key={ci} className={cellClass(cell.st)} title={`${'ABCDEFGHIJKLMN'.charAt(ri)}${ci + 1}`} onClick={() => onCell({ row: ri, col: ci, st: cell.st })}>
                {cell.st === "occupied" || cell.st === "pending" ? positionLabel(ri, ci) : ""}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function cellClass(st) {
  const base = "bio-cell ";
  if (st === "occupied") return base + "st-occupied";
  if (st === "pending") return base + "st-pending";
  if (st === "maintenance") return base + "st-maintenance";
  if (st === "disabled") return base + "st-disabled";
  return base + "st-available";
}
function CellModal({ box, cell, onClose }) {
  const label = positionLabel(cell.row, cell.col);
  const sample = samples.find((s) => s.box === box.id.split("/")[4] && s.position === label);
  const st = cell.st;
  return (
    <GraphqlModal isOpen title={`Position ${label}`} subtitle={`${box.id.split("/").join(" / ")} / ${label}`} icon={<Boxes size={20} />} onClose={onClose} size="md">
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="bio-mono" style={{ fontWeight: 700 }}>Position details</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, margin: "14px 0 6px" }}>
          <StatusBadge status={stBadge(cell.st)} />
          <span className="bio-badge badge-muted">{cell.st}</span>
        </div>

        {sample ? (
          <SampleDetail sample={sample} box={box} />
        ) : (
          <div className="empty-wrap" style={{ padding: 20 }}>
            <i className="bx bx-box" style={{ fontSize: 32, color: "#b9c6d8" }} />
            <div style={{ marginTop: 6 }}>{cell.st === "available" ? "This position is available." : cell.st === "disabled" ? "Position disabled." : "Reserved for an incoming project."}</div>
          </div>
        )}

        <div className="mini-title">Historical occupancy</div>
        <HistoryTimeline sample={sample} st={cell.st} />

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn-bio btn-bio-outline" onClick={onClose}>Close</button>
          {sample && <button className="btn-bio btn-bio-primary">Move sample</button>}
        </div>
      </>
    </GraphqlModal>
  );
}

function SampleDetail({ sample, box }) {
  return (
    <div className="bio-card" style={{ background: "#f2f8ff", border: "1px solid #dcebfa", marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="bio-mono" style={{ fontWeight: 800, fontSize: 15, color: "#16304f" }}>{sample.id}</div>
          <div style={{ fontSize: 12, color: "#5c6e88" }}>Barcode {sample.barcode}</div>
        </div>
        <StatusBadge status="stored" />
      </div>
      <div className="bio-grid bio-grid-2" style={{ marginTop: 12, gap: 8 }}>
        <Tile k="Project" v={sample.project} />
        <Tile k="PI / Owner" v={`${sample.project_pi} · ${sample.owner}`} />
        <Tile k="Type / Source" v={`${sample.type} · ${sample.source}`} />
        <Tile k="Nature / Condition" v={`${sample.nature} · ${sample.condition}`} />
        <Tile k="Volume" v={`${sample.volume} ${sample.unit}`} />
        <Tile k="Stored" v={sample.stored_on} />
      </div>
    </div>
  );
}

function Tile({ k, v }) {
  return (
    <div>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: .4, color: "#8a9bb4" }}>{k}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#24344f" }}>{v}</div>
    </div>
  );
}

function HistoryTimeline({ sample, st }) {
  return (
    <div style={{ fontSize: 13, color: "#3c4f6f" }}>
      <div className="tooltip-row"><span>2026 · {st === "occupied" && sample ? "Sample " + sample.id : "Available"}</span><strong>{st === "occupied" && sample ? "Stored" : "Free"}</strong></div>
      <div className="tooltip-row"><span>2025 · Project X — Sample X-019</span><strong>Removed</strong></div>
      <div className="tooltip-row"><span>2024 · Project Y — Sample Y-041</span><strong>Removed</strong></div>
      <div className="tooltip-row"><span>2023 · —</span><strong>Empty</strong></div>
    </div>
  );
}

function stBadge(st) {
  if (st === "occupied") return "ok";
  if (st === "pending") return "info";
  if (st === "maintenance") return "warning";
  if (st === "disabled") return "muted";
  return "active";
}
