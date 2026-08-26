import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage, summarize } from "./bioStorage";
import { PageHeader, Fade, Legend, StatusBadge, formatNum } from "./bioUI";

export default function Mapping() {
  const nav = useNavigate();
  const { fridges } = getStorage();
  const [fid, setFid] = useState(fridges[0].id);
  const fridge = fridges.find((f) => f.id === fid) || fridges[0];
  const block = fridge.children[0];

  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Sample Mapping" crumb="Sample Mapping" subtitle="Virtual interactive map — drill from fridge to block to box to position" />

        <div className="bio-pill-row">
          {fridges.map((f) => (
            <button key={f.id} className={`bio-chip ${fid === f.id ? "is-active" : ""}`} onClick={() => setFid(f.id)}>
              <i className="bx bx-fridge" /> {f.code} <span style={{ opacity: .7 }}>· {f.temp}°C</span>
            </button>
          ))}
        </div>

        <div className="bio-grid bio-grid-3">
          <div className="bio-card" style={{ gridColumn: "span 2" }}>
            <div className="bio-card-title"><i className="bx bx-sitemap" /> {fridge.code} — Block {block.label} <span className="bio-card-sub">click a box to open its position grid</span></div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {block.children.map((c, ci) => (
                <div key={c.id} style={{ border: "1px solid #e4ebf5", borderRadius: 12, padding: 10, minWidth: 170, flex: "1 1 170px" }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#33507a" }}>{c.label} · {summarize(c).pct}%</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
                    {c.children.map((r) => (
                      <div key={r.id}>
                        <div style={{ fontSize: 10, color: "#8a9bb4" }}>{r.label}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(22px,1fr))", gap: 3 }}>
                          {r.children.map((b) => (
                            <div key={b.id} title={`${b.label} ${summarize(b).pct}%`} onClick={() => nav(`/fridges/${fridge.id}`)}
                              style={{ width: 22, height: 22, borderRadius: 5, background: boxBg(summarize(b).pct), cursor: "pointer" }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bio-card">
            <div className="bio-card-title"><i className="bx bx-bulb" /> Smart Allocation</div>
            <p style={{ fontSize: 13, color: "#5c6e88" }}>Need 1,500 positions at −80°C? The engine scans available storage and recommends:</p>
            <div className="bio-card" style={{ background: "#f2f8ff", border: "1px solid #dcebfa" }}>
              <div className="bio-mono" style={{ fontWeight: 800, color: "#16304f" }}>FRZ-002 · B03 · C02 · R04</div>
              <div style={{ fontSize: 13, color: "#5c6e88", marginTop: 6 }}>Available <strong>1,620</strong> positions</div>
              <div style={{ fontSize: 13, color: "#5c6e88" }}>Temperature −80°C · Availability 100%</div>
            </div>
            <button className="btn-bio btn-bio-primary" style={{ width: "100%", marginTop: 12 }} onClick={() => nav("/fridges/frz-002")}>Approve allocation</button>
            <div className="mini-title">Legend</div>
            <Legend />
          </div>
        </div>
      </div>
    </Fade>
  );
}

function boxBg(pct) {
  if (pct > 80) return "#f34848";
  if (pct > 50) return "#ff9d2e";
  if (pct > 20) return "#ffc107";
  return "#31b577";
}