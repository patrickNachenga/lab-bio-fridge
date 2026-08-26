import React from "react";
import { movements, auditLog } from "./bioData";
import { PageHeader, Fade, Stat, StatusBadge } from "./bioUI";

export default function Transactions() {
  return (
    <Fade>
      <div className="bio-page">
        <PageHeader title="Access & Transactions" crumb="Access & Transactions" subtitle="Sample access, checkout, return and barcode scans" />
        <div className="bio-grid bio-grid-4">
          <Stat icon="bx bx-qr-scan" title="Barcode Scans" color="info" value="128" />
          <Stat icon="bx bx-log-in" title="Checkouts" color="warning" value="6" />
          <Stat icon="bx bx-log-out" title="Returns" color="ok" value="3" />
          <Stat icon="bx bx-user-check" title="Active users today" color="purple" value="9" />
        </div>

        <div className="bio-grid bio-grid-2">
          <div className="bio-card">
            <div className="bio-card-title"><i className="bx bx-qr-scan" /> Quick Barcode Lookup</div>
            <input placeholder="Scan or type a box / sample barcode…" style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #dbe6f0", fontSize: 13 }} />
            <div className="bio-card" style={{ background: "#f2f8ff", marginTop: 14 }}>
              <div className="bio-mono" style={{ fontWeight: 800 }}>BOX · BX-0025</div>
              <div className="bio-mono" style={{ fontSize: 11, color: "#5c6e88" }}>Fridge FRZ-001 · B02 · C03 · R04</div>
              <div className="bio-grid bio-grid-3" style={{ gap: 8, margin: "10px 0", textAlign: "center" }}>
                <div><div style={{ fontSize: 20, fontWeight: 800 }}>81</div><div style={{ fontSize: 10, color: "#8a9bb4" }}>Capacity</div></div>
                <div><div style={{ fontSize: 20, fontWeight: 800, color: "#d32f2f" }}>64</div><div style={{ fontSize: 10, color: "#8a9bb4" }}>Occupied</div></div>
                <div><div style={{ fontSize: 20, fontWeight: 800, color: "#31b577" }}>17</div><div style={{ fontSize: 10, color: "#8a9bb4" }}>Available</div></div>
              </div>
            </div>
          </div>

          <div className="bio-card">
            <div className="bio-card-title"><i className="bx bx-swap-horizontal" /> Recent Transactions</div>
            <div className="bio-table-wrap">
              <table className="bio-table">
                <thead><tr><th>Type</th><th>Object</th><th>User</th><th>Time</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>Checkout</td><td className="bio-mono">BIO-2026-00221</td><td>Jane</td><td>09:44</td><td><StatusBadge status="pending" /></td></tr>
                  <tr><td>Scan</td><td className="bio-mono">BX-0025</td><td>Patrick</td><td>09:30</td><td><StatusBadge status="ok" /></td></tr>
                  <tr><td>Return</td><td className="bio-mono">BIO-2026-00103</td><td>Patrick</td><td>08:15</td><td><StatusBadge status="ok" /></td></tr>
                  <tr><td>Scan</td><td className="bio-mono">FRZ-003</td><td>Admin</td><td>07:58</td><td><StatusBadge status="warning" /></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
}