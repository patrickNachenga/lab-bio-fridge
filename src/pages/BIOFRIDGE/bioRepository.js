import { auditLog as seedAudit, movements as seedMovements, projects as seedProjects, reservations as seedReservations, samples as seedSamples } from "./bioData";

// This is the frontend adapter for the repository API. The screens only depend
// on these operations, so replacing localStorage with HTTP later is contained
// in this file.
const KEY = "bioRepo.domain.v1";
const EVENT = "bio-repository-domain-changed";

function readState() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "null");
    return stored && typeof stored === "object" ? stored : seedState();
  } catch {
    return seedState();
  }
}

function seedState() {
  return { projects: seedProjects, reservations: seedReservations, samples: seedSamples, movements: seedMovements, auditLog: seedAudit };
}

function writeState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(EVENT));
  return state;
}

function update(mutator) {
  const state = readState();
  mutator(state);
  return writeState(state);
}

function id(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function now() {
  return new Date().toISOString();
}

export function repositoryEventName() {
  return EVENT;
}

export function getRepositoryState() {
  return readState();
}

export function createProject(input) {
  const project = {
    id: id("prj"), code: input.code, name: input.name, description: input.description || "",
    pi: input.pi || "Unassigned", owner: input.owner || input.pi || "Unassigned", institution: input.institution || "",
    samplesExpected: Number(input.samplesExpected) || 0, allocated: 0, temp: Number(input.temp) || -80,
    from: input.from || now().slice(0, 10), to: input.to || "", status: "approval",
  };
  update((state) => {
    state.projects.unshift(project);
    state.auditLog.unshift({ id: id("au"), user: "Current user", action: "Created Project", target: project.code, detail: project.name, date: now(), role: "Repository User" });
  });
  return project;
}

export function createStorageRequest(input) {
  const request = {
    id: id("rsv"), projectId: input.projectId, project: input.project, unit: input.unit,
    detail: input.detail || "Awaiting allocation", positions: Number(input.positions) || 0,
    status: "pending", date: now().slice(0, 10), requestedBy: input.requestedBy || "Current user",
  };
  update((state) => {
    state.reservations.unshift(request);
    state.auditLog.unshift({ id: id("au"), user: "Current user", action: "Created Storage Request", target: request.id, detail: `${request.project} · ${request.positions} positions`, date: now(), role: "Repository User" });
  });
  return request;
}

export function registerSample(input) {
  const sample = {
    id: input.id || `BIO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    barcode: input.barcode || `BC-${String(Date.now()).slice(-8)}`, projectId: input.projectId, project: input.project,
    projectCode: input.projectCode, project_pi: input.projectPi || "Unassigned", type: input.type || "Other",
    source: input.source || "Laboratory", nature: input.nature || "Fresh", condition: input.condition || "Good",
    volume: String(input.volume || "0"), unit: input.unit || "mL", container: input.container || "Cryovial",
    integrity: "Intact", collected: input.collected || now(), received: now(), stored_on: now(), status: input.location ? "stored" : "received",
    owner: input.owner || "Unassigned", ...(input.location || {}), history: [{ event: "Registered", date: now(), location: input.location ? locationText(input.location) : "Not yet placed" }],
  };
  update((state) => {
    state.samples.unshift(sample);
    state.auditLog.unshift({ id: id("au"), user: "Current user", action: "Registered Sample", target: sample.id, detail: sample.projectCode || sample.type, date: now(), role: "Sample Manager" });
  });
  return sample;
}

export function moveSample(sampleId, input) {
  let result;
  update((state) => {
    const sample = state.samples.find((item) => item.id === sampleId);
    if (!sample) throw new Error("Sample was not found.");
    const target = input.location ? (typeof input.location === "string" ? parseLocation(input.location) : input.location) : input;
    const from = locationText(sample);
    const to = locationText(target);
    const movement = { id: id("mv"), sample: sample.id, from, to, by: "Current user", date: now(), reason: input.reason || "Relocation", condition: input.condition || "Good", status: "completed" };
    Object.assign(sample, target, { status: "stored", stored_on: now(), history: [...(sample.history || []), { event: "Moved", date: now(), location: to, reason: movement.reason }] });
    state.movements.unshift(movement);
    state.auditLog.unshift({ id: id("au"), user: "Current user", action: "Moved Sample", target: sample.id, detail: `${from} → ${to}`, date: now(), role: "Sample Manager" });
    result = movement;
  });
  return result;
}

export function locationText(location) {
  if (!location) return "Unplaced";
  if (typeof location === "string") return location;
  return [location.fridge, location.block, location.column, location.rack, location.box, location.position].filter(Boolean).join(" / ");
}

export function parseLocation(value) {
  const parts = String(value || "").split("/").map((part) => part.trim()).filter(Boolean);
  return { fridge: parts[0] || "", block: parts[1] || "", column: parts[2] || "", rack: parts[3] || "", box: parts[4] || "", position: parts[5] || "" };
}

export function projectUsageFrom(state) {
  return state.projects.map((project) => {
    const used = state.samples.filter((sample) => sample.projectId === project.id).length;
    return { ...project, used, available: Math.max(0, Number(project.allocated || 0) - used) };
  });
}
