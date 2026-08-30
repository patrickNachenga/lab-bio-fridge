import React from "react";
import { getStorage } from "../bioStorage";
import { samples, projectUsage } from "../bioData";
import { PageHeader, Fade, BarRow, formatNum } from "../bioUI";

const palette = ["#1976c8", "#31b577", "#ff9d2e", "#6a3fd8", "#f34848", "#0288d1"];

export default function Analytics() {
  const { fridges } = getStorage();
  const byType = {};
  const byProject = {};
  samples.forEach((s) => {
    byType[s.type] = (byType[s.type] || 0) + 1;
    byProject[s.projectCode || s.project] = (byProject[s.projectCode || s.project] || 0) + 1;
  });
  const maxType = Math.max(...Object.values(byType), 1);
  const maxProj = Math.max(...Object.values(byProject), 1);
  const fridgePct = fridges.map((f) => ({ code: f.code, pct: summarizePct(f) })).sort((a, b) => b.pct - a.pct);
  const nearLimit = projectUsage.filter((p) => p.allocated && p.used / p.allocated > 0.8);

  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Analytics" crumb="Analytics" subtitle="Storage intelligence — capacity, projects, temperature and risk" />
        <div className="bio-grid bio-grid-3">
          <div className="bio-card">
            <div className="bio-card-title"><i className="bx bx-thermometer" /> Fridges closest to full</div>
            {fridgePct.map((f, i) => <BarRow key={f.code} label={f.code} value={f.pct} max={100} color={i === 0 ? "#f34848" : palette[(i + 1) % palette.length]} />)}
          </div>
          <div className="bio-card">
            <div className="bio-card-title"><i className="bx bx-category" /> Storage by Type</div>
            {Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([k, v], i) => <BarRow key={k} label={k} value={v} max={maxType} color={palette[i % palette.length]} />)}
          </div>
          <div className="bio-card">
            <div className="bio-card-title"><i className="bx bx-briefcase" /> Storage by Project</div>
            {Object.entries(byProject).sort((a, b) => b[1] - a[1]).map(([k, v], i) => <BarRow key={k} label={k} value={v} max={maxProj} color={palette[(i + 2) % palette.length]} />)}
          </div>
        </div>
        <div className="bio-grid bio-grid-2">
          <div className="bio-card">
            <div className="bio-card-title"><i className="bx bx-line-chart-down" /> Yearly Activity</div>
            <div className="mini-title">Samples stored this year</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#16304f" }}>{formatNum(samples.length)}</div>
            <div className="mini-title">Projects near allocation limit</div>
            {nearLimit.map((p) => <div key={p.id} className="tooltip-row"><span>{p.name}</span><strong>{Math.round((p.used / p.allocated) * 100)}%</strong></div>)}
            {nearLimit.length === 0 && <div style={{ color: "#8a9bb4", fontSize: 13 }}>None — within limits.</div>}
          </div>
          <div className="bio-card">
            <div className="bio-card-title"><i className="bx bx-alarm-exclamation" /> Risk Overview</div>
            <div className="mini-title">Capacity freeing up next month</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#31b577" }}>240 <span style={{ fontSize: 13 }}>positions</span></div>
            <div className="mini-title">Samples affected by FRZ-002 temp fault</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#d32f2f" }}>214</div>
          </div>
        </div>
      </div>
    </Fade>
  );
}

function boxes(f) {
  const out = [];
  const walk = (n) => { if (n.level === "box") out.push(n); (n.children || []).forEach(walk); };
  walk(f);
  return out;
}
function summarizePct(f) {
  let occ = 0, total = 0;
  boxes(f).forEach((b) => { occ += b.stats.occupied; total += b.stats.total; });
  return total ? Math.round((occ / total) * 100) : 0;
}