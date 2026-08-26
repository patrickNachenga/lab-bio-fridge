// ============================================================================
// BIO FRIDGE — Domain data (derived from the dynamic storage engine)
// Samples are generated from the *actual* occupied cells of the fridge trees so
// every location, mapping, inventory and report stays consistent with reality.
// ============================================================================
import { getStorage, cellStatus, positionLabel } from "./bioStorage";

const { fridges, allBoxes } = getStorage();

export const SAMPLE_TYPES = ["Blood", "Serum", "Plasma", "Tissue", "DNA", "RNA", "Urine", "Saliva", "Cell Culture"];
export const SAMPLE_SOURCES = ["Human", "Animal", "Environmental", "Clinical", "Laboratory"];
export const SAMPLE_NATURES = ["Fresh", "Frozen", "Preserved", "Extracted", "Processed", "Archived"];
export const SAMPLE_CONDITIONS = ["Good", "Damaged", "Questionable", "Compromised"];
export const UNITS = ["mL", "µL", "mg", "g", "ng", "Specimen", "Vial", "Aliquot"];
export const FRIDGE_TYPES = ["Ultra-Low Freezer", "Plasma Freezer", "Refrigerator", "Liquid Nitrogen", "Chest Freezer", "Pharmacy Fridge"];
export const STORAGE_LEVELS = [
  { label: "Block", code: "BLOCK", icon: "bx bx-grid" },
  { label: "Column", code: "COLUMN", icon: "bx bx-columns" },
  { label: "Rack / Drawer", code: "RACK", icon: "bx bx-layer" },
  { label: "Box", code: "BOX", icon: "bx bx-cube" },
  { label: "Position", code: "POSITION", icon: "bx bx-dots-vertical-rounded" },
];
export const TEMPERATURE_RANGES = [
  { name: "Ambient", min: 15, max: 25, ideal: 20, color: "success" },
  { name: "Cold (2-8C)", min: 2, max: 8, ideal: 4, color: "info" },
  { name: "Freezer (-20C)", min: -30, max: -15, ideal: -20, color: "primary" },
  { name: "Ultra-Low (-80C)", min: -90, max: -70, ideal: -80, color: "warning" },
  { name: "LN2 (-196C)", min: -200, max: -180, ideal: -196, color: "danger" },
];

// --- small helper: deterministic date strings ----------------------------------
function isoDaysAgo(days, h = 9, m = 30) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function splitId(id) {
  const p = id.split("/");
  return { fridge: p[0], block: p[1], column: p[2], rack: p[3], box: p[4] };
}

// -----------------------------------------------------------------------------
// PROJECTS
// -----------------------------------------------------------------------------
export const projects = [
  { id: "prj-001", code: "HIV-2026", name: "HIV Research Study 2026", pi: "Dr. John Kombe", owner: "Researcher X", samplesExpected: 5000, temp: -80, from: "2026-09-01", to: "2028-09-01", status: "active", allocated: 5000 },
  { id: "prj-002", code: "CAN-2026", name: "Cancer Genomics Biobank", pi: "Dr. Amina Juma", owner: "Dr. Y", samplesExpected: 3000, temp: -80, from: "2026-03-15", to: "2027-03-15", status: "active", allocated: 3000 },
  { id: "prj-003", code: "DNA-2025", name: "Population DNA Cohort", pi: "Prof. Yusuf Said", owner: "Researcher Z", samplesExpected: 12000, temp: -196, from: "2025-06-01", to: "2027-06-01", status: "active", allocated: 9000 },
  { id: "prj-004", code: "TB-2026", name: "Tuberculosis Surveillance", pi: "Dr. Grace Mhina", owner: "Lab Manager", samplesExpected: 2000, temp: -25, from: "2026-01-10", to: "2026-12-31", status: "approval", allocated: 0 },
  { id: "prj-005", code: "MAT-2025", name: "Maternal Health Plasma", pi: "Dr. Sarah Neema", owner: "Dr. K", samplesExpected: 1500, temp: -25, from: "2025-08-01", to: "2026-08-01", status: "active", allocated: 1500 },
  { id: "prj-006", code: "RN-2024", name: "Rare Neonatal Archive", pi: "Prof. T. Mazengo", owner: "Prof. T", samplesExpected: 800, temp: -80, from: "2024-05-01", to: "2025-05-01", status: "expired", allocated: 800 },
];

// usage rotation so each sample maps to a valid project
const ROTATION = ["prj-001", "prj-002", "prj-003", "prj-005", "prj-003", "prj-001", "prj-002", "prj-001"];

// --- generate samples from actually-occupied cells ------------------------------
function buildSamples() {
  const out = [];
  const MAX = 360;
  outer:
  for (const box of allBoxes) {
    if (out.length >= MAX) break;
    const meta = splitId(box.id);
    for (let r = 0; r < box.rows; r++) {
      for (let c = 0; c < box.cols; c++) {
        if (cellStatus(box.id, r, c) !== "occupied") continue;
        if (out.length >= MAX) break outer;
        const seq = String(out.length + 1).padStart(5, "0");
        const prjId = ROTATION[out.length % ROTATION.length];
        const prjObj = projects.find((p) => p.id === prjId);
        const stored = isoDaysAgo((out.length % 400) + 10);
        out.push({
          id: `BIO-2026-${seq}`,
          barcode: `BC-${meta.rack}${meta.box}-${seq.slice(-3)}`,
          projectId: prjId,
          project: prjObj?.name,
          projectCode: prjObj?.code,
          project_pi: prjObj?.pi,
          type: SAMPLE_TYPES[out.length % SAMPLE_TYPES.length],
          source: SAMPLE_SOURCES[(out.length >> 1) % SAMPLE_SOURCES.length],
          nature: SAMPLE_NATURES[(out.length >> 2) % SAMPLE_NATURES.length],
          condition: SAMPLE_CONDITIONS[out.length % SAMPLE_CONDITIONS.length],
          volume: (0.5 + (out.length % 4) * 0.5).toFixed(1),
          unit: "mL",
          container: "Cryovial",
          integrity: out.length % 17 === 0 ? "Damaged" : "Intact",
          collected: isoDaysAgo((out.length * 7) + 60),
          received: stored,
          stored_on: stored,
          fridge: meta.fridge, block: meta.block, column: meta.column, rack: meta.rack, box: meta.box,
          position: positionLabel(r, c),
          status: "stored",
          owner: prjObj?.owner,
        });
      }
    }
  }
  return out;
}

// -----------------------------------------------------------------------------
// RESERVATIONS
// -----------------------------------------------------------------------------
export const reservations = [
  { id: "rsv-001", projectId: "prj-001", project: "HIV Research Study 2026", unit: "2 Racks", detail: "FRZ-001 / B01 / C02 / R03 • R04", positions: 162, status: "allocated", date: "2026-08-20" },
  { id: "rsv-002", projectId: "prj-005", project: "Maternal Health Plasma", unit: "3 Boxes", detail: "FRZ-003 / B01 / C01 / R02", positions: 150, status: "active", date: "2026-08-10" },
  { id: "rsv-003", projectId: "prj-003", project: "Population DNA Cohort", unit: "1 Block", detail: "LNG-001 / B02", positions: 200, status: "approval", date: "2026-08-22" },
  { id: "rsv-004", projectId: "prj-004", project: "Tuberculosis Surveillance", unit: "2 Columns", detail: "FRZ-003 / B01 / C01 • C02", positions: 400, status: "pending", date: "2026-08-23" },
];

// -----------------------------------------------------------------------------
// TEMPERATURE — deterministic readings around each fridge setpoint
// -----------------------------------------------------------------------------
const HOURS = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
function hashInt(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
function tempSeries(fridge) {
  return HOURS.map((t, i) => {
    const h = (hashInt(fridge.id) + i * 37) % 100;
    let val = fridge.temp + Math.round(((h % 20) - 10)) / 2; // ±2.5
    if (fridge.id === "frz-002" && i >= 5 && i <= 7) val = fridge.temp + 12; // excursion
    const ok = val >= fridge.min && val <= fridge.max;
    return { time: t, value: val, ok };
  });
}
export const temperatureReadings = fridges.map((f) => ({
  fridge: f.code, id: f.id, name: f.name, temp: f.temp, min: f.min, max: f.max, series: tempSeries(f),
}));

export const excursions = [
  { id: "ex-001", fridge: "FRZ-002", start: "2026-08-25 13:00", end: "2026-08-25 13:32", maxT: -65, minT: -68, duration: "32 min", severity: "Critical", status: "open", samples: 214, responsible: "Patrick" },
  { id: "ex-002", fridge: "FRZ-001", start: "2026-08-20 04:12", end: "2026-08-20 04:40", maxT: -69, minT: -71, duration: "28 min", severity: "Warning", status: "resolved", samples: 150, responsible: "Jane" },
];

// -----------------------------------------------------------------------------
// MOVEMENTS
// -----------------------------------------------------------------------------
export const movements = [
  { id: "mv-001", sample: "BIO-2026-00145", from: "FRZ-001 / B01 / C02 / R03 / BX05 / A1", to: "FRZ-002 / B03 / C01 / R02 / BX10 / C4", by: "Patrick", date: "2026-08-25 14:22", reason: "Freezer maintenance", condition: "Good", status: "completed" },
  { id: "mv-002", sample: "BIO-2026-00071", from: "FRZ-002 / B01 / C02 / R01 / BX02 / B3", to: "FRZ-002 / B01 / C02 / R02 / BX01 / A1", by: "Jane", date: "2026-08-24 10:05", reason: "Defragmentation", condition: "Good", status: "completed" },
  { id: "mv-003", sample: "BIO-2026-00103", from: "LNG-001 / B01 / C03 / R01 / BX01 / D9", to: "LNG-001 / B02 / C01 / R01 / BX01 / H1", by: "Patrick", date: "2026-08-22 16:40", reason: "Project consolidation", condition: "Good", status: "completed" },
  { id: "mv-004", sample: "BIO-2026-00221", from: "FRZ-003 / B01 / C02 / R03 / BX04 / E2", to: "FRZ-002 / B03 / C03 / R01 / BX08 / A1", by: "Sara", date: "2026-08-21 09:12", reason: "Fridge maintenance", condition: "Inside", status: "pending" },
  { id: "mv-005", sample: "BIO-2025-00112", from: "FRZ-001 / B04 / C01 / R02 / BX06 / F7", to: "Disposal", by: "Admin", date: "2026-08-18 11:30", reason: "Project archive", condition: "Frozen", removal: true, status: "completed" },
];
// -----------------------------------------------------------------------------
// AUDIT LOG
// -----------------------------------------------------------------------------
export const auditLog = [
  { id: "au-001", user: "Patrick", action: "Moved Sample", target: "BIO-2026-00412", detail: "FRZ-001→FRZ-002", date: "2026-08-25 14:22", role: "Fridge Administrator" },
  { id: "au-002", user: "Jane", action: "Stored Sample", target: "BIO-2026-00071", detail: "Allocated BX02/B3", date: "2026-08-24 10:05", role: "Sample Manager" },
  { id: "au-003", user: "Sara", action: "Created Project", target: "TB-2026", detail: "Tuberculosis Surveillance", date: "2026-08-23 08:40", role: "Researcher" },
  { id: "au-004", user: "Admin", action: "Approved Reservation", target: "RSV-003", detail: "1 Block on LNG-001", date: "2026-08-22 15:01", role: "Super Administrator" },
  { id: "au-005", user: "Patrick", action: "Edit Fridge", target: "FRZ-003", detail: "Set maintenance mode", date: "2026-08-20 13:00", role: "Fridge Administrator" },
  { id: "au-006", user: "Jane", action: "Checked Out Sample", target: "BIO-2026-00221", detail: "To sequencing lab", date: "2026-08-19 09:44", role: "Sample Manager" },
  { id: "au-007", user: "Prof. T", action: "Removed Sample", target: "BIO-2025-00112", detail: "Disposal — expired", date: "2026-08-18 11:30", role: "Researcher" },
];

// -----------------------------------------------------------------------------
// ALERTS (state is derived from data + manual entries)
// -----------------------------------------------------------------------------
export const alerts = [
  { id: "al-001", type: "Temperature Critical", level: "critical", fridge: "FRZ-002", message: "Temperature recorded -65°C outside -90..-70 range", time: "2026-08-25 13:00", status: "active" },
  { id: "al-002", type: "Fridge Under Maintenance", level: "warning", fridge: "FRZ-003", message: "Compressor inspection in progress", time: "2026-08-20 13:00", status: "active" },
  { id: "al-003", type: "Capacity Low", level: "warning", fridge: "FRZ-001", message: "Occupancy above 85%", time: "2026-08-24 09:00", status: "active" },
  { id: "al-004", type: "Reservation Expiring", level: "info", fridge: "—", message: "RN-2024 storage reserve ends soon", time: "2026-08-22 08:00", status: "active" },
  { id: "al-005", type: "Maintenance Due", level: "info", fridge: "FRZ-002", message: "Preventive maintenance due in 7 days", time: "2026-08-25 06:00", status: "active" },
  { id: "al-006", type: "Movement Pending", level: "info", fridge: "—", message: "BIO-2026-00221 awaiting verification", time: "2026-08-21 09:12", status: "active" },
];

// -----------------------------------------------------------------------------
// DERIVED AGGREGATES (used by dashboard, analytics, reports)
// -----------------------------------------------------------------------------
// Maintenance records & reports data -------------------------------------------------
export const maintenance = [
  { id: "mt-001", fridge: "FRZ-003", type: "Preventive Maintenance", type2: "PM", date: "2026-08-15", technician: "John Doe", description: "Compressor inspection", status: "completed", next: "2027-02-15" },
  { id: "mt-002", fridge: "FRZ-001", type: "Preventive Maintenance", type2: "PM", date: "2026-07-10", technician: "John Doe", description: "Door seal & defrost", status: "completed", next: "2027-01-10" },
  { id: "mt-003", fridge: "FRZ-002", type: "Corrective", type2: "CM", date: "2026-08-25", technician: "H. Vu", description: "Alarm probe verification", status: "pending", next: "—" },
];
export const samples = buildSamples();

export const projectUsage = projects.map((p) => {
  const count = samples.filter((s) => s.projectId === p.id).length;
  return { ...p, used: count, available: p.allocated - count };
});

export const totalSamples = samples.length;
export const activeProjectCount = projects.filter((p) => p.status === "active").length;