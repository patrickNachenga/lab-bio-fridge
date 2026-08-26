import React, { useMemo, useState } from "react";
import { Boxes, Plus, Save } from "lucide-react";
import GraphqlModal from "../../../components/GraphqlModal";
import { PageHeader, Fade, Stat, StatusBadge, formatNum } from "../bioUI";
import { FRIDGE_TYPES, SAMPLE_CONDITIONS, SAMPLE_NATURES, SAMPLE_SOURCES, SAMPLE_TYPES, TEMPERATURE_RANGES, UNITS } from "../bioData";

const LOOKUPS = {
    "sample-types": { title: "Sample Types", icon: "bx-test-tube", description: "Manage biological material categories used during registration.", field: "Type", values: SAMPLE_TYPES, color: "info" },
    "sample-sources": { title: "Sample Sources", icon: "bx-data", description: "Maintain the source categories available for sample intake.", field: "Source", values: SAMPLE_SOURCES, color: "primary" },
    "sample-natures": { title: "Sample Natures", icon: "bx-layer", description: "Define preservation and processing states for stored material.", field: "Nature", values: SAMPLE_NATURES, color: "purple" },
    "sample-conditions": { title: "Sample Conditions", icon: "bx-check-circle", description: "Control the condition labels shown in inventory and audit views.", field: "Condition", values: SAMPLE_CONDITIONS, color: "warning" },
    units: { title: "Units", icon: "bx-ruler", description: "Manage measurement and container units used for sample volumes.", field: "Unit", values: UNITS, color: "success" },
    "fridge-types": { title: "Fridge Types", icon: "bx-fridge", description: "Configure the storage equipment types available to the fridge builder.", field: "Fridge type", values: FRIDGE_TYPES, color: "info" },
    "storage-levels": { title: "Storage Levels", icon: "bx-layer", description: "Define the hierarchy used to navigate physical storage locations.", field: "Storage level", values: ["Block", "Column", "Rack / Drawer", "Box", "Position"], color: "primary" },
    "temperature-ranges": { title: "Temperature Ranges", icon: "bx-thermometer", description: "Review the accepted temperature bands used by storage monitoring.", field: "Range", values: TEMPERATURE_RANGES.map((range) => `${range.name} (${range.min} to ${range.max}°C)`), color: "warning" },
};

export default function LookupView({ lookupKey }) {
    const meta = LOOKUPS[lookupKey] || LOOKUPS["sample-types"];
    const [items, setItems] = useState(() => meta.values.map((value, index) => ({ id: `${lookupKey}-${index}`, name: value, code: `${lookupKey.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, "0")}`, status: "active" })));
    const [selected, setSelected] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => items.filter((item) => `${item.name} ${item.code}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
    const openModal = (item = null) => { setSelected(item); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setSelected(null); };
    const saveItem = (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const next = { id: selected?.id || `${lookupKey}-${Date.now()}`, name: form.get("name"), code: form.get("code"), status: "active" };
        setItems((previous) => selected ? previous.map((item) => item.id === selected.id ? next : item) : [...previous, next]);
        closeModal();
    };

    return (
        <Fade>
            <div className="bio-page">
                <PageHeader title={meta.title} crumb={`Settings / ${meta.title}`} subtitle={meta.description} actions={<button className="btn-bio btn-bio-primary" type="button" onClick={() => openModal()}><Plus size={16} /> Add {meta.field}</button>} />
                <div className="row g-3">
                    <div className="col-xl-3 col-md-6"><Stat icon={`bx ${meta.icon}`} title="Configured" color={meta.color} value={formatNum(items.length)} /></div>
                    <div className="col-xl-3 col-md-6"><Stat icon="bx bx-check-shield" title="Active" color="ok" value={formatNum(items.filter((item) => item.status === "active").length)} /></div>
                </div>
                <div className="bio-card">
                    <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                        <div className="bio-card-title mb-0"><i className={`bx ${meta.icon}`} /> {meta.title} Registry <span className="bio-card-sub">{filtered.length} shown</span></div>
                        <input className="form-control" style={{ maxWidth: 280 }} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${meta.title.toLowerCase()}...`} />
                    </div>
                    <div className="bio-table-wrap">
                        <table className="bio-table">
                            <thead><tr><th>SN</th><th>{meta.field}</th><th>Code</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
                            <tbody>
                                {filtered.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td><td><strong>{item.name}</strong></td><td><span className="bio-badge badge-info">{item.code}</span></td><td><StatusBadge status={item.status} /></td>
                                        <td className="text-end"><button className="btn btn-sm btn-outline-secondary" type="button" title={`Edit ${item.name}`} onClick={() => openModal(item)}><i className="bx bx-edit" /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filtered.length === 0 && <div className="empty-wrap">No {meta.title.toLowerCase()} match your search.</div>}
                </div>
                {modalOpen && <GraphqlModal isOpen title={selected ? `Update ${meta.field}` : `Add ${meta.field}`} subtitle="Saved in the current BIOFRIDGE settings workspace." icon={<Boxes size={20} />} onClose={closeModal} size="md" footer={<><button type="button" className="btn btn-outline-secondary" onClick={closeModal}>Cancel</button><button type="submit" form="lookup-form" className="btn btn-primary"><Save size={15} className="me-1" /> Save</button></>}>
                    <form id="lookup-form" onSubmit={saveItem}>
                        <div className="mb-3"><label className="form-label">{meta.field}</label><input name="name" className="form-control" defaultValue={selected?.name || ""} placeholder={`Enter ${meta.field.toLowerCase()}`} required autoFocus /></div>
                        <div className="mb-3"><label className="form-label">Code</label><input name="code" className="form-control" defaultValue={selected?.code || ""} placeholder="Enter a short code" required /></div>
                    </form>
                </GraphqlModal>}
            </div>
        </Fade>
    );
}
