import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage, summarize } from "./bioStorage";
import { PageHeader, Fade, StatusBadge, formatNum } from "./bioUI";

export default function StorageLocations() {
  const nav = useNavigate();
  const [openFx, setOpenFx] = useState(() => new Set());
  const { fridges } = getStorage();
  const toggle = (id) => setOpenFx((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Storage Locations" crumb="Storage Locations" subtitle="Dynamic hierarchical capacity at every level" />
        <div className="bio-card">
          <div className="bio-table-wrap">
            <table className="bio-table">
              <thead><tr><th>Location</th><th>Level</th><th className="num">Total</th><th className="num">Occupied</th><th className="num">Available</th><th className="num">%</th><th>Bar</th></tr></thead>
              <tbody>
                {fridges.map((f) => (
                  <React.Fragment key={f.id}>
                    <Row node={f} level="fridge" open setOpen={() => toggle(f.id)} isOpen={openFx.has(f.id)} onOpen={() => nav(`/fridges/${f.id}`)} />
                    {openFx.has(f.id) && f.children.map((b) => (
                      <React.Fragment key={b.id}>
                        <Row node={b} level="block" />
                        {b.children.map((c) => (
                          <React.Fragment key={c.id}>
                            <Row node={c} level="column" />
                            {c.children.map((r) => <Row key={r.id} node={r} level="rack" />)}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fade>
  );
}

const INDENT = { fridge: 0, block: 24, column: 48, rack: 72 };
function Row({ node, level, open, setOpen, isOpen, onOpen }) {
  const s = summarize(node);
  const color = s.pct > 85 ? "#f34848" : s.pct > 65 ? "#ff9d2e" : "#31b577";
  return (
    <tr style={{ cursor: open ? "pointer" : undefined }} onClick={open ? setOpen : onOpen}>
      <td style={{ paddingLeft: 12 + (INDENT[level] || 0) }}>
        {open && <i className={`bx ${isOpen ? "bx-chevron-down" : "bx-chevron-right"}`} style={{ color: "#1976d2" }} />}
        <strong>{node.label}</strong>
        {level === "fridge" && <span style={{ color: "#8a9bb4", marginLeft: 6 }}>{node.name}</span>}
      </td>
      <td>{level}</td>
      <td className="num">{formatNum(s.total)}</td>
      <td className="num">{formatNum(s.occupied)}</td>
      <td className="num" style={{ color: "#31b577" }}>{formatNum(s.available)}</td>
      <td className="num" style={{ fontWeight: 700 }}>{s.pct}%</td>
      <td style={{ width: 130 }}><div className="bio-bar"><span style={{ width: `${s.pct}%`, background: color }} /></div></td>
    </tr>
  );
}