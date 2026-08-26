import React, { useState } from "react";
import { alerts } from "./bioData";
import { PageHeader, Fade, Stat, StatusBadge } from "./bioUI";

const lv = { critical: ["#ffe7e7", "#d32f2f"], warning: ["#fff4e0", "#c77700"], info: ["#e8f4fb", "#0288d1"] };
export default function Alerts() {
  const [f, setF] = useState("all");
  const list = alerts.filter((a) => f === "all" || a.level === f);
  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Alerts & Notifications" crumb="Alerts" subtitle="Derived from live fridge state" />
        <div className="bio-grid bio-grid-4">
          <Stat icon="bx bx-alarm-exclamation" title="Total Active" color="danger" value={alerts.length} />
          <Stat icon="bx bx-alarm" title="Critical" color="danger" value={alerts.filter((a) => a.level === "critical").length} />
          <Stat icon="bx bx-chip" title="Temperature" color="warning" value={alerts.filter((a) => a.type.includes("Temperature")).length} />
          <Stat icon="bx bx-bell" title="Info" color="info" value={alerts.filter((a) => a.level === "info").length} />
        </div>
        <div className="bio-pill-row">
          {["all", "critical", "warning", "info"].map((s) => <button key={s} className={`bio-chip ${f === s ? "is-active" : ""}`} onClick={() => setF(s)}>{s}</button>)}
        </div>
        <div className="bio-grid bio-grid-2">
          {list.map((a) => (
            <div className="bio-card" key={a.id} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: lv[a.level][0], color: lv[a.level][1], display: "grid", placeItems: "center", fontSize: 20, flexShrink: 0 }}><i className="bx bx-bell" /></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: 14 }}>{a.type}</strong><StatusBadge status={a.level} />
                </div>
                <div style={{ fontSize: 13, color: "#5c6e88", marginTop: 4 }}>{a.message}</div>
                <div style={{ fontSize: 11, color: "#8a9bb4", marginTop: 4 }}>{a.fridge} · {a.time}</div>
              </div>
              <button className="btn-bio btn-bio-outline" style={{ alignSelf: "center" }}>Acknowledge</button>
            </div>
          ))}
        </div>
      </div>
    </Fade>
  );
}