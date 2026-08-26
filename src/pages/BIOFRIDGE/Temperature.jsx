import React, { useState } from "react";
import { temperatureReadings, excursions } from "./bioData";
import { PageHeader, Fade, StatusBadge, SparkBars } from "./bioUI";

export default function Temperature() {
  const [fid, setFid] = useState("all");
  const rows = temperatureReadings.filter((t) => fid === "all" || t.id === fid);
  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Temperature Monitoring" crumb="Temperature Monitoring" subtitle="Live readings, thresholds and excursions"
          actions={<button className="btn-bio btn-bio-outline"><i className="bx bx-plus" /> Add reading</button>} />
        <div className="bio-pill-row">
          {[{ id: "all", fridge: "All" }, ...temperatureReadings.map((t) => ({ id: t.id, fridge: t.fridge }))].map((t) => (
            <button key={t.id} className={`bio-chip ${fid === t.id ? "is-active" : ""}`} onClick={() => setFid(t.id)}>{t.fridge}</button>
          ))}
        </div>

        <div className="bio-grid bio-grid-3">
          {rows.map((t) => {
            const bad = t.series.some((p) => !p.ok);
            return (
              <div className="bio-card" key={t.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><strong>{t.fridge}</strong> <div style={{ fontSize: 11, color: "#8a9bb4" }}>{t.name}</div></div>
                  <StatusBadge status={bad ? "warning" : "ok"} />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "10px 0 4px" }}>
                  <span style={{ fontSize: 30, fontWeight: 800, color: bad ? "#d32f2f" : "#16304f" }}>{t.temp}°C</span>
                  <span style={{ fontSize: 12, color: "#8a9bb4" }}>set point</span>
                </div>
                <div style={{ fontSize: 12, color: "#5c6e88", marginBottom: 10 }}>Range {t.min} .. {t.max} °C</div>
                <SparkBars values={t.series.map((x) => x.value)} height={60} color={bad ? "#f34848" : "#31b577"} />
                <div className="mini-title">Readings (last 24h)</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {t.series.map((x) => (
                    <span key={x.time} className={`bio-badge ${x.ok ? "badge-ok" : "badge-danger"}`}>{x.time} {x.value}°</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bio-card">
          <div className="bio-card-title"><i className="bx bx-alarm-exclamation" /> Temperature Excursions</div>
          <div className="bio-table-wrap">
            <table className="bio-table">
              <thead><tr><th>Fridge</th><th>Start</th><th>End</th><th>Max</th><th>Min</th><th>Duration</th><th>Severity</th><th>Samples</th><th>Status</th></tr></thead>
              <tbody>
                {excursions.map((e) => (
                  <tr key={e.id}>
                    <td><strong>{e.fridge}</strong></td><td>{e.start}</td><td>{e.end}</td><td className="num">{e.maxT}°</td><td className="num">{e.minT}°</td><td>{e.duration}</td>
                    <td><StatusBadge status={e.severity === "Critical" ? "critical" : "warning"} /></td><td className="num">{e.samples}</td><td><StatusBadge status={e.status} /></td>
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