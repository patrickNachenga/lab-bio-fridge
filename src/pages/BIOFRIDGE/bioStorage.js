// ============================================================================
// BIO FRIDGE — Dynamic Storage Engine
// Nothing about physical structure is hard-coded. Every fridge is described by
// its own block / column / rack / box / box-grid configuration and expanded
// into a hierarchical StorageNode tree. Capacity is derived, never stored.
// ============================================================================

// --- Deterministic pseudo-random helpers (stable across renders) ------------
export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const rowsLabel = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

// Produce a deterministic status for a single position cell.
// 'occupied' | 'pending(reserved)' | 'maintenance' | 'disabled' | 'available'
export function cellStatus(pathKey, rowI, colI, occBias = 0.62) {
  const h = hashString(`${pathKey}|${rowsLabel[rowI]}${colI + 1}`);
  const r = h % 100;
  if (r < 5) return "disabled"; // 5% disabled
  if (r < 13) return "maintenance"; // 8% maintenance
  const rr = (h >> 3) % 100;
  if (rr < 100 * occBias) return "occupied";
  if (rr < 100 * (occBias + 0.12)) return "pending"; // reserved
  return "available";
}

export function positionLabel(row, col) {
  return `${rowsLabel[row] || "?"}${col + 1}`;
}

// --- Fridge structure definitions (each fridge can be completely different) ---
// blocks: array of block configs = { columns, racksPerColumn, boxesPerRack, grid }.
// Different blocks within one fridge may differ.
const FRIDGE_CONFIGS = [
  {
    id: "frz-001", code: "FRZ-001", name: "Ultra-Low Freezer Alpha",
    type: "Ultra-Low Freezer", temp: -80, min: -90, max: -70,
    location: "Laboratory A", room: "Cold Room 1", facility: "MNH BioBank",
    status: "active", alert: "ok", model: "Thermo ULT-86",
    structure: [
      { columns: 3, racksPerColumn: 5, boxesPerRack: 8, grid: { rows: 9, cols: 9 } },
      { columns: 2, racksPerColumn: 4, boxesPerRack: 6, grid: { rows: 9, cols: 9 } },
      { columns: 3, racksPerColumn: 5, boxesPerRack: 8, grid: { rows: 9, cols: 9 } },
      { columns: 2, racksPerColumn: 4, boxesPerRack: 6, grid: { rows: 9, cols: 9 } },
    ],
  },
  {
    id: "frz-002", code: "FRZ-002", name: "Ultra-Low Freezer Bravo", type: "Ultra-Low Freezer", temp: -80, min: -90, max: -70,
    location: "Laboratory A", room: "Cold Room 1", facility: "MNH CoreBank",
    status: "active", alert: "warning", model: "Eppendorf 86C", tempExcursions: 1,
    structure: [
      { columns: 3, racksPerColumn: 5, boxesPerRack: 8, grid: { rows: 9, cols: 9 } },
      { columns: 3, racksPerColumn: 5, boxesPerRack: 8, grid: { rows: 9, cols: 9 } },
      { columns: 2, racksPerColumn: 4, boxesPerRack: 6, grid: { rows: 10, cols: 10 } },
    ],
  },
  {
    id: "frz-003", code: "FRZ-003", name: "Plasma Freezer", type: "Plasma Freezer", temp: -25, min: -35, max: -15,
    location: "Laboratory B", room: "Cold Room 2", facility: "MNH CoreBank",
    status: "maintenance", alert: "maintenance", model: "Panasonic MDF",
    structure: [
      { columns: 4, racksPerColumn: 6, boxesPerRack: 10, grid: { rows: 5, cols: 10 } },
      { columns: 4, racksPerColumn: 6, boxesPerRack: 10, grid: { rows: 5, cols: 10 } },
    ],
  },
  {
    id: "ref-001", code: "REF-001", name: "Refrigerator +4C", type: "Refrigerator", temp: 4, min: 2, max: 8,
    location: "Laboratory B", room: "Sample Prep", facility: "MNH CoreBank",
    status: "active", alert: "ok", model: "LabCold LR",
    structure: [
      { columns: 2, racksPerColumn: 4, boxesPerRack: 6, grid: { rows: 8, cols: 6 } },
      { columns: 2, racksPerColumn: 3, boxesPerRack: 5, grid: { rows: 8, cols: 6 } },
    ],
  },
];

const STORAGE_CONFIG_KEY = "bioRepo.storageUnits.v1";
const STORAGE_EVENT = "bio-repository-storage-changed";

function readConfigs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_CONFIG_KEY) || "null");
    return Array.isArray(saved) && saved.length ? saved : FRIDGE_CONFIGS;
  } catch {
    return FRIDGE_CONFIGS;
  }
}

export function persistStorageConfigs(configs) {
  localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(configs));
  cached = null;
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
}

export function addStorageUnit(config) {
  const configs = readConfigs();
  persistStorageConfigs([...configs, config]);
}

export function storageChangeEventName() {
  return STORAGE_EVENT;
}

// --- hierarchy label conventions -----------------------------------------------------
export const LEVELS = ["fridge", "block", "column", "rack", "box"];

// --- tree builder --------------------------------------------------------------------
export function buildFridgeTree(cfg) {
  const root = {
    id: cfg.id, code: cfg.code, name: cfg.name, type: cfg.type,
    temp: cfg.temp, min: cfg.min, max: cfg.max,
    location: cfg.location, room: cfg.room, facility: cfg.facility,
    status: cfg.status, model: cfg.model, alert: cfg.alert,
    level: "fridge", label: cfg.code,
    children: [],
  };

  const configured = cfg.structure || [{ levels: [{ type: "BLOCK", count: 1 }, { type: "BOX", count: 1, rows: 9, cols: 9 }] }];
  const firstLevels = configured[0]?.levels;
  const structure = firstLevels
    ? Array.from({ length: Math.max(1, Number(firstLevels.find((level) => level.type === "BLOCK")?.count) || 1) }, () => ({ levels: firstLevels.filter((level) => level.type !== "BLOCK") }))
    : configured;
  structure.forEach((blockCfg, bi) => {
    const block = {
      id: `${cfg.id}/B${String(bi + 1).padStart(2, "0")}`,
      code: `B${String(bi + 1).padStart(2, "0")}`,
      label: `B${String(bi + 1).padStart(2, "0")}`,
      level: "block", nodeType: "BLOCK", node_type: "BLOCK", children: [], parentId: cfg.id,
    };
    const levels = blockCfg.levels || [
      { type: "COLUMN", count: blockCfg.columns },
      { type: "RACK", count: blockCfg.racksPerColumn },
      { type: "BOX", count: blockCfg.boxesPerRack, rows: blockCfg.grid.rows, cols: blockCfg.grid.cols },
    ];
    const childLevels = levels.filter((level) => level.type !== "BLOCK");
    function createChildren(parent, levelIndex, path) {
      const level = childLevels[levelIndex];
      if (!level) return;
      const count = Math.max(1, Number(level.count) || 1);
      for (let i = 0; i < count; i++) {
        const type = String(level.type || "NODE").toUpperCase();
        const short = type === "POSITION" ? "POS" : type.slice(0, 3);
        const code = `${short}${String(i + 1).padStart(2, "0")}`;
        const node = {
          id: `${path}/${code}`, code, label: code, level: type.toLowerCase(), nodeType: type, node_type: type,
          parentId: parent.id, children: [],
        };
        if (type === "BOX" || levelIndex === childLevels.length - 1 && level.rows && level.cols) {
          node.level = "box";
          node.rows = Number(level.rows) || 1;
          node.cols = Number(level.cols) || 1;
          node.capacity = node.rows * node.cols;
        }
        parent.children.push(node);
        createChildren(node, levelIndex + 1, node.id);
      }
    }
    createChildren(block, 0, block.id);
    if (!block.children.length) for (let ci = 0; ci < (blockCfg.columns || 1); ci++) {
      const column = {
        id: `${block.id}/C${String(ci + 1).padStart(2, "0")}`,
        code: `C${String(ci + 1).padStart(2, "0")}`,
        label: `C${String(ci + 1).padStart(2, "0")}`,
        level: "column", children: [],
      };
      for (let ri = 0; ri < blockCfg.racksPerColumn; ri++) {
        const rack = {
          id: `${column.id}/R${String(ri + 1).padStart(2, "0")}`,
          code: `R${String(ri + 1).padStart(2, "0")}`,
          label: `R${String(ri + 1).padStart(2, "0")}`,
          level: "rack", children: [],
        };
        for (let xi = 0; xi < blockCfg.boxesPerRack; xi++) {
          const box = {
            id: `${rack.id}/BX${String(xi + 1).padStart(2, "0")}`,
            code: `BX${String(xi + 1).padStart(2, "0")}`,
            label: `BX${String(xi + 1).padStart(2, "0")}`,
            level: "box", grid: blockCfg.grid,
            rows: blockCfg.grid.rows, cols: blockCfg.grid.cols,
            capacity: blockCfg.grid.rows * blockCfg.grid.cols,
            children: [],
          };
          rack.children.push(box);
        }
        column.children.push(rack);
      }
      block.children.push(column);
    }
    root.children.push(block);
  });

  finalize(root);
  return root;
}

// walk every box, compute per-cell counts & a live position map
function finalize(root) {
  eachBox(root, (box) => {
    const stats = { total: 0, occupied: 0, pending: 0, maintenance: 0, disabled: 0, available: 0 };
    const map = [];
    for (let r = 0; r < box.rows; r++) {
      const rowArr = [];
      for (let c = 0; c < box.cols; c++) {
        const st = cellStatus(box.id, r, c);
        stats.total++;
        if (st === "occupied") stats.occupied++;
        else if (st === "pending") stats.pending++;
        else if (st === "maintenance") stats.maintenance++;
        else if (st === "disabled") stats.disabled++;
        else stats.available++;
        rowArr.push({ st });
      }
      map.push(rowArr);
    }
    box.stats = stats;
    box.map = map;
  });
}

function eachBox(node, cb) {
  if (node.level === "box") cb(node);
  (node.children || []).forEach((ch) => eachBox(ch, cb));
}

export function collectBoxes(node, out) {
  if (node.level === "box") out.push(node);
  (node.children || []).forEach((ch) => collectBoxes(ch, out));
  return out;
}
// --- Capacity aggregation at every level --------------------------------------
// Summarize stats recursively. A node's stats include its own boxes only; roll
// up children to get fridge / block / column / rack totals.
export function summarize(node) {
  if (node.level === "box") {
    const s = { ...node.stats, reserved: node.stats.pending, pct: 0 };
    s.pct = node.stats.total ? Math.round((node.stats.occupied / node.stats.total) * 100) : 0;
    return s;
  }
  const s = { total: 0, occupied: 0, pending: 0, reserved: 0, maintenance: 0, disabled: 0, available: 0, boxes: 0, pct: 0 };
  (node.children || []).forEach((ch) => {
    const cs = summarize(ch);
    s.total += cs.total; s.occupied += cs.occupied; s.pending += cs.pending;
    s.reserved += cs.reserved; s.maintenance += cs.maintenance;
    s.disabled += cs.disabled; s.available += cs.available;
    if (cs.boxes) s.boxes += cs.boxes;
  });
  if (node.level === "rack") s.racks = (node.children || []).length;
  if (node.level === "column") s.racks = (node.children || []).length;
  if (node.level === "block") s.columns = (node.children || []).length;
  if (node.level === "fridge") s.blocks = (node.children || []).length;
  s.pct = s.total ? Math.round((s.occupied / s.total) * 100) : 0;
  return s;
}

let cached = null;
export function getStorage() {
  if (cached) return cached;
  const fridges = readConfigs().map(buildFridgeTree);
  const allBoxes = [];
  fridges.forEach((f) => collectBoxes(f, allBoxes));
  cached = { fridges, allBoxes };
  return cached;
}

// Locate a box by its fridge + block + column + rack + box labels
export function findBox(fridgeCode, block, column, rack, box) {
  const { fridges } = getStorage();
  const f = fridges.find((x) => x.code === fridgeCode);
  if (!f) return null;
  const b = f.children.find((x) => x.label === block);
  const c = b && b.children.find((x) => x.label === column);
  const r = c && c.children.find((x) => x.label === rack);
  return r && r.children.find((x) => x.label === box) ? r.children.find((x) => x.label === box) : null;
}

export function fullPath(box) {
  // reconstruct labels from id
  const parts = box.id.split("/");
  return { fridge: parts[0], block: parts[1], column: parts[2], rack: parts[3], box: parts[4] };
}
