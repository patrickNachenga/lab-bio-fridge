import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BreadCumb from "../../../../layouts/BreadCumb";
import { useGetTheatreTimeRecordByUidQuery } from "../../../../features/theatre/theatreGraphqlApi";
import {
    formatDuration,
    calculateDurationMinutes,
    getTimeCompliance,
} from "../../../../services/theatreTimeUtilizationService";
import { formatTime12Hour } from "../../../../helpers/WordHelper";
import { TheatreTimeFormModal } from "./TheatreTimeFormModal";

// ─── COLOR PALETTE ──────────────────────────────────────────────────────────

const theme = {
    primary: "#2563EB",
    success: "#059669",
    danger: "#DC2626",
    warning: "#D97706",
    dark: "#1E293B",
    gray: "#6B7280",
    border: "#E5E7EB",
    bg: "#F3F4F6",
    text: "#111827",
    muted: "#9CA3AF",
    white: "#FFFFFF",
    cardShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
};

// ─── REUSABLE WIDGETS ───────────────────────────────────────────────────────

const Pill = ({ value, color = theme.primary, icon = "" }) => (
    <span
        className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-3 fw-bold"
        style={{ background: color, color: "#fff", fontSize: "0.85rem" }}
    >
        {icon && <i className={`bx ${icon}`} />}
        {value || "N/A"}
    </span>
);

const DataWidget = ({ label, value, col = "col-md-4", note = "" }) => (
    <div className={`${col} mb-3`}>
        <div
            className="rounded-3 p-3 h-100"
            style={{
                background: theme.white,
                border: `1px solid ${theme.border}`,
                boxShadow: theme.cardShadow,
            }}
        >
            <div
                className="text-muted text-uppercase mb-1"
                style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.5px" }}
            >
                {label}
            </div>
            <div className="fw-bold" style={{ color: theme.text, fontSize: "1rem" }}>
                {React.isValidElement(value) ? value : (value || <span className="text-muted fw-normal">—</span>)}
            </div>
            {note && (
                <div style={{ color: theme.muted, fontSize: "0.72rem", lineHeight: 1.3, marginTop: "4px" }}>
                    {note}
                </div>
            )}
        </div>
    </div>
);

const SectionCard = ({ title, icon, children }) => (
    <div
        className="mb-4 rounded-3"
        style={{
            background: theme.white,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.cardShadow,
            overflow: "hidden",
        }}
    >
        <div
            className="d-flex align-items-center gap-2 px-4 py-3"
            style={{ background: theme.bg, borderBottom: `1px solid ${theme.border}` }}
        >
            <span
                className="d-inline-flex align-items-center justify-content-center rounded-2"
                style={{ width: 34, height: 34, background: theme.primary, color: "#fff" }}
            >
                <i className={`bx ${icon} fs-5`} />
            </span>
            <span className="fw-bold" style={{ color: theme.text, fontSize: "1rem" }}>
                {title}
            </span>
        </div>
        <div className="p-4">
            <div className="row g-3">{children}</div>
        </div>
    </div>
);

const StatWidget = ({ icon, label, value, color = theme.primary }) => (
    <div className="col-md-3 col-6 mb-3">
        <div
            className="rounded-3 p-3 d-flex align-items-center gap-3 h-100"
            style={{
                background: theme.white,
                border: `1px solid ${theme.border}`,
                boxShadow: theme.cardShadow,
            }}
        >
            <span
                className="d-inline-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                style={{ width: 48, height: 48, background: color, color: "#fff" }}
            >
                <i className={`bx ${icon} fs-4`} />
            </span>
            <div className="min-w-0">
                <div className="fw-bold lh-1 mb-1" style={{ color: theme.text, fontSize: "1.4rem" }}>
                    {value}
                </div>
                <small
                    className="text-muted fw-semibold text-uppercase"
                    style={{ fontSize: "0.65rem", letterSpacing: "0.4px" }}
                >
                    {label}
                </small>
            </div>
        </div>
    </div>
);

const TeamMemberWidget = ({ member, role, rank }) => {
    const initials = [member?.firstName, member?.lastName]
        .filter(Boolean)
        .map((n) => n.charAt(0).toUpperCase())
        .join("");
    const roleIcons = {
        SURGEON: "bx-plus-medical",
        ANESTHETIST: "bx-sleepy",
        SCRUB_NURSE: "bx-band-aid",
        RUNNER_NURSE: "bx-run",
    };
    return (
        <div className="col-md-3 col-6 mb-2">
            <div
                className="rounded-3 p-3 d-flex align-items-center gap-3 h-100"
                style={{
                    background: theme.white,
                    border: `1px solid ${theme.border}`,
                    boxShadow: theme.cardShadow,
                }}
            >
                <div
                    className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0 fw-bold"
                    style={{
                        width: 44,
                        height: 44,
                        background: theme.primary,
                        color: "#fff",
                        fontSize: "0.9rem",
                    }}
                >
                    {initials || "?"}
                </div>
                <div className="min-w-0">
                    <div className="fw-bold" style={{ color: theme.text, fontSize: "0.88rem" }}>
                        {[member?.firstName, member?.lastName].filter(Boolean).join(" ") || "N/A"}
                    </div>
                    <div className="d-flex align-items-center gap-1" style={{ color: theme.gray, fontSize: "0.72rem" }}>
                        <i className={`bx ${roleIcons[role] || "bx-user"}`} />
                        {role?.replace(/_/g, " ") || "Member"}
                    </div>
                    {rank && (
                        <span
                            className="d-inline-block mt-1 px-2 py-0 rounded-2 fw-semibold"
                            style={{ background: "#EEF2FF", color: theme.primary, fontSize: "0.65rem" }}
                        >
                            {rank}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const DelayWidget = ({ dc, index }) => (
    <div
        className="d-flex align-items-start gap-3 p-3 rounded-3 mb-2"
        style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}
    >
        <span
            className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0 fw-bold"
            style={{ width: 30, height: 30, background: theme.danger, color: "#fff", fontSize: "0.8rem" }}
        >
            {index + 1}
        </span>
        <div className="min-w-0 flex-grow-1">
            <div className="d-flex flex-wrap gap-1 mb-1">
                <Pill value={dc.cause?.procedureDelayCategory?.name || "N/A"} color={theme.warning} />
                <Pill value={dc.cause?.code || dc.delayCause?.code || ""} color={theme.dark} />
            </div>
            <div className="fw-bold" style={{ color: theme.text, fontSize: "0.9rem" }}>
                {dc.cause?.name || dc.delayCause?.name || "N/A"}
            </div>
            {(dc.description || dc.cause?.description) && (
                <div style={{ color: theme.gray, fontSize: "0.8rem", lineHeight: 1.3, marginTop: "2px" }}>
                    {dc.description || dc.cause?.description}
                </div>
            )}
        </div>
    </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export const TheatreTimeRecordOpen = () => {
    const { uid } = useParams();
    const navigate = useNavigate();
    const [editModalOpen, setEditModalOpen] = useState(false);

    const { data: response, isFetching, isError, error } = useGetTheatreTimeRecordByUidQuery(uid, { skip: !uid });
    const record = useMemo(() => response?.data, [response]);

    // Loading
    if (isFetching) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" style={{ width: "3rem", height: "3rem", color: theme.primary }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="fw-bold mt-3" style={{ color: theme.text }}>Loading Record Details...</h5>
                <p style={{ color: theme.gray, fontSize: "0.9rem" }}>Please wait while we retrieve the theatre procedure information.</p>
            </div>
        );
    }

    // Error
    if (isError) {
        return (
            <>
                <BreadCumb pageList={["Theatre Time Utilization", "Procedure Records", "Details"]} onBack={() => navigate("/theatre-time-utilization/procedure-records")} />
                <div className="rounded-3 p-4 d-flex align-items-start gap-3" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                    <span className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0" style={{ width: 48, height: 48, background: theme.danger, color: "#fff" }}>
                        <i className="bx bx-error-circle fs-4" />
                    </span>
                    <div>
                        <h5 className="fw-bold mb-1" style={{ color: "#991B1B" }}>Unable to Load Record</h5>
                        <p className="mb-0" style={{ color: theme.gray, fontSize: "0.9rem", lineHeight: 1.4 }}>
                            {error?.message || "The server returned an error while fetching this record. It may have been deleted, or there could be a connectivity issue. Please try again or contact the system administrator."}
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // Not Found
    if (!record) {
        return (
            <>
                <BreadCumb pageList={["Theatre Time Utilization", "Procedure Records", "Details"]} onBack={() => navigate("/theatre-time-utilization/procedure-records")} />
                <div className="rounded-3 p-4 d-flex align-items-start gap-3" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                    <span className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0" style={{ width: 48, height: 48, background: theme.warning, color: "#fff" }}>
                        <i className="bx bx-search-alt fs-4" />
                    </span>
                    <div>
                        <h5 className="fw-bold mb-1" style={{ color: "#92400E" }}>Record Not Found</h5>
                        <p className="mb-0" style={{ color: theme.gray, fontSize: "0.9rem", lineHeight: 1.4 }}>
                            The theatre procedure record you are looking for does not exist in the system. This could mean the record was deleted, the provided UID is incorrect, or the link you followed is invalid. Please verify and try again.
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // ─── Derived Data ──────────────────────────────────────────────────────
    const durationMinutes = record.durationMinutes || calculateDurationMinutes(record.procedureStartTime, record.procedureEndTime);
    const varianceInfo = getTimeCompliance(durationMinutes, record.estimatedDurationMinutes);

    const patientSourceLabel = record.patientSourceType === "INTERNAL"
        ? record.internalSource?.name || "Internal"
        : record.externalSource?.name || "External";

    const outcomeColor = { DISCHARGED: theme.success, DEATH: theme.danger, TRANSFERRED: theme.warning, CANCELLED: theme.gray }[record.outcome] || theme.primary;
    const outcomeIcon = { DISCHARGED: "bx-check-circle", DEATH: "bx-x-circle", TRANSFERRED: "bx-transfer", CANCELLED: "bx-block" }[record.outcome] || "bx-check-shield";

    const durationPercent = record.estimatedDurationMinutes
        ? Math.min(Math.round((durationMinutes / record.estimatedDurationMinutes) * 100), 200)
        : 0;
    const isOverTime = durationPercent > 100;

    return (
        <>
            <BreadCumb pageList={["Theatre Time Utilization", "Procedure Records", "Details"]} onBack={() => navigate("/theatre-time-utilization/procedure-records")} />

            {/* ── HEADER WIDGET ──────────────────────────────────────────── */}
            <div
                className="rounded-3 px-4 py-3 mb-4 d-flex flex-wrap justify-content-between align-items-center"
                style={{ background: "linear-gradient(135deg, #1E40AF, #3B82F6)", color: "#fff", boxShadow: "0 4px 16px rgba(37, 99, 235, 0.25)" }}
            >
                <div className="d-flex align-items-center gap-3">
                    <span className="d-flex align-items-center justify-content-center rounded-2" style={{ width: 48, height: 48, background: "rgba(255,255,255,0.15)" }}>
                        <i className="bx bx-clipboard fs-4" />
                    </span>
                    <div>
                        <h4 className="fw-bold mb-1" style={{ color: "#fff", fontSize: "1.15rem" }}>Theatre Procedure Record</h4>
                        <div className="d-flex flex-wrap gap-2" style={{ opacity: 0.85, fontSize: "0.78rem" }}>
                            <span><i className="bx bx-hash me-1" />{record.uid?.slice(0, 10)}...</span>
                            <span>|</span>
                            <span><i className="bx bx-calendar me-1" />{record.procedureDate || "Date N/A"}</span>
                            <span>|</span>
                            <span><i className="bx bx-user me-1" />MRN: {record.patientMrn || "N/A"}</span>
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-2 mt-2 mt-md-0">
                    <button className="btn btn-sm px-3 py-2 d-flex align-items-center gap-1 fw-semibold" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: "8px" }}
                        onClick={() => navigate("/theatre-time-utilization/procedure-records")}>
                        <i className="bx bx-arrow-back" /> Back
                    </button>
                    <button className="btn btn-sm px-3 py-2 d-flex align-items-center gap-1 fw-semibold" style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: "8px" }}
                        onClick={() => setEditModalOpen(true)}>
                        <i className="bx bx-edit" /> Edit
                    </button>
                </div>
            </div>

            {/* ── STATS WIDGETS ROW ──────────────────────────────────────── */}
            <div className="row g-3 mb-4">
                <StatWidget icon="bx-time-five" label="Actual Duration" value={formatDuration(durationMinutes)} color={theme.primary} />
                <StatWidget icon="bx-hourglass" label="Estimated Duration" value={formatDuration(record.estimatedDurationMinutes)} color={theme.primary} />
                <StatWidget
                    icon={varianceInfo.varianceMinutes > 0 ? "bx-trending-up" : "bx-trending-down"}
                    label="Time Variance"
                    value={formatDuration(Math.abs(record.varianceMinutes ?? varianceInfo.varianceMinutes))}
                    color={varianceInfo.varianceMinutes > 0 ? theme.danger : theme.success}
                />
                <StatWidget icon={outcomeIcon} label="Patient Outcome" value={record.outcome || "—"} color={outcomeColor} />
            </div>

            {/* ── COMPLIANCE BAR WIDGET ──────────────────────────────────── */}
            {record.estimatedDurationMinutes && (
                <div className="rounded-3 p-4 mb-4" style={{ background: theme.white, border: `1px solid ${theme.border}`, boxShadow: theme.cardShadow }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h6 className="fw-bold mb-1" style={{ color: theme.text, fontSize: "0.85rem" }}>
                                <i className="bx bx-bar-chart-alt-2 me-1" style={{ color: theme.primary }} />Duration Compliance
                            </h6>
                            <p style={{ color: theme.gray, fontSize: "0.8rem", margin: 0, lineHeight: 1.3 }}>
                                {isOverTime
                                    ? "The actual procedure time exceeded the estimated duration. This may impact scheduling for subsequent procedures."
                                    : "The procedure was completed within the estimated time allocation, indicating good time management and scheduling accuracy."}
                            </p>
                        </div>
                        <span
                            className="fw-bold flex-shrink-0 d-flex align-items-center justify-content-center rounded-2"
                            style={{
                                background: isOverTime ? "#FEF2F2" : "#F0FDF4",
                                color: isOverTime ? theme.danger : theme.success,
                                padding: "4px 14px",
                                fontSize: "1.1rem",
                                border: `1px solid ${isOverTime ? "#FECACA" : "#BBF7D0"}`,
                            }}
                        >
                            {durationPercent}%
                        </span>
                    </div>
                    <div style={{ height: 10, background: theme.border, borderRadius: "5px", overflow: "hidden" }}>
                        <div style={{
                            width: `${Math.min(durationPercent, 100)}%`,
                            height: "100%",
                            background: isOverTime ? theme.danger : theme.success,
                            borderRadius: "5px",
                            transition: "width 0.6s ease",
                        }} />
                    </div>
                    <div className="d-flex justify-content-between mt-1" style={{ color: theme.muted, fontSize: "0.65rem" }}>
                        <span>0% (start)</span>
                        <span>100% (estimated target)</span>
                    </div>
                </div>
            )}

            {/* ── TIMELINE WIDGETS ───────────────────────────────────────── */}
            <SectionCard title="Procedure Timeline" icon="bx-timer">
                <div className="col-12 mb-2">
                    <p style={{ color: theme.gray, fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
                        The timeline below shows when the surgical procedure started and ended. This data is used to calculate total duration and assess scheduling efficiency.
                    </p>
                </div>
                <div className="col-md-6">
                    <div className="rounded-3 p-4 d-flex align-items-center gap-3" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                        <span className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0" style={{ width: 44, height: 44, background: theme.success, color: "#fff" }}>
                            <i className="bx bx-play-circle fs-4" />
                        </span>
                        <div>
                            <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Procedure Start</div>
                            <div className="fw-bold" style={{ color: theme.text, fontSize: "1.05rem" }}>{formatTime12Hour(record.procedureStartTime)}</div>
                            <div style={{ color: theme.gray, fontSize: "0.75rem" }}>Date: {record.procedureDate}</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="rounded-3 p-4 d-flex align-items-center gap-3" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
                        <span className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0" style={{ width: 44, height: 44, background: theme.danger, color: "#fff" }}>
                            <i className="bx bx-stop-circle fs-4" />
                        </span>
                        <div>
                            <div className="text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}>Procedure End</div>
                            <div className="fw-bold" style={{ color: theme.text, fontSize: "1.05rem" }}>{formatTime12Hour(record.procedureEndTime)}</div>
                            <div style={{ color: theme.gray, fontSize: "0.75rem" }}>Total Duration: {formatDuration(durationMinutes)}</div>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* ── PATIENT & SOURCE WIDGETS ───────────────────────────────── */}
            <SectionCard title="Patient & Source Information" icon="bx-id-card">
                <div className="col-12 mb-1">
                    <p style={{ color: theme.gray, fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
                        Demographic information about the patient who underwent the procedure, including their medical record number and referral source.
                    </p>
                </div>
                <DataWidget label="Patient MRN" value={record.patientMrn} note="Unique Medical Record Number assigned to this patient." />
                <DataWidget label="Date of Birth" value={record.patientDob} note="Patient's date of birth for identification." />
                <DataWidget label="Sex" value={<Pill value={record.patientSex} color={theme.gray} />} note="Biological sex as recorded in the medical file." />
                <DataWidget label="Region" value={record.patientRegion?.name || "—"} note="Geographic region or district where the patient resides." />
                <DataWidget
                    label="Patient Type"
                    value={<Pill value={record.patientType} color={record.patientType === "EMERGENCY" ? theme.danger : theme.success} />}
                    note={record.patientType === "EMERGENCY" ? "Emergency cases are prioritized and may impact theatre scheduling." : "Scheduled (elective) procedures are planned in advance."}
                />
                <DataWidget
                    label="Source Type"
                    value={<Pill value={record.patientSourceType} color={record.patientSourceType === "INTERNAL" ? theme.primary : theme.warning} />}
                    note={record.patientSourceType === "INTERNAL" ? "Referred from within the hospital (e.g., another ward or clinic)." : "Referred from an external healthcare facility."}
                />
                <DataWidget label="Source" value={patientSourceLabel} note="The specific department, ward, or external facility that referred the patient." />
                {record.externalSource?.region && (
                    <DataWidget label="External Region" value={record.externalSource.region.name} note="Region where the external referring facility is located." />
                )}
            </SectionCard>

            {/* ── PROCEDURE & TIMING WIDGETS ─────────────────────────────── */}
            <SectionCard title="Procedure & Timing Details" icon="bx-clinic">
                <div className="col-12 mb-1">
                    <p style={{ color: theme.gray, fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
                        Information about the surgical procedure performed, the theatre unit used, and detailed timing metrics for theatre utilization analysis.
                    </p>
                </div>
                <DataWidget label="Theatre Unit" value={record.theatreUnit?.name || "—"} note="Operating theatre where the procedure was performed." />
                <DataWidget label="Unit Location" value={record.theatreUnit?.location || "—"} note="Physical location or building of the theatre unit." />
                <DataWidget label="Procedure Name" value={record.procedure?.name || "—"} note="Medical name of the surgical procedure performed." />
                <DataWidget label="Procedure Code" value={record.procedure?.code || "—"} note="Standardized classification code (e.g., ICD, CPT) for this procedure." />
                <DataWidget label="Estimated Duration" value={formatDuration(record.estimatedDurationMinutes)} note="Expected time allocated based on scheduling estimates." />
                <DataWidget label="Procedure Date" value={record.procedureDate || "—"} note="Calendar date the procedure was performed." />
                <DataWidget label="Start Time" value={<Pill value={formatTime12Hour(record.procedureStartTime)} color={theme.success} icon="bx-play-circle" />} note="Exact time the surgical procedure began (incision or start)." />
                <DataWidget label="End Time" value={<Pill value={formatTime12Hour(record.procedureEndTime)} color={theme.danger} icon="bx-stop-circle" />} note="Exact time the surgical procedure was concluded." />
                <DataWidget label="Actual Duration" value={formatDuration(durationMinutes)} note={`Total time from start to end: ${durationPercent}% of estimated duration.`} />
                <DataWidget
                    label="Time Variance"
                    value={
                        <Pill
                            value={`${Math.abs(record.varianceMinutes ?? varianceInfo.varianceMinutes)} min`}
                            color={varianceInfo.varianceMinutes > 0 ? theme.danger : theme.success}
                            icon={varianceInfo.varianceMinutes > 0 ? "bx-trending-up" : "bx-trending-down"}
                        />
                    }
                    note={varianceInfo.varianceMinutes > 0
                        ? "Procedure took longer than estimated — may need to review estimates for future cases."
                        : "Procedure completed under estimated time — efficiency helps accommodate more cases."}
                />
            </SectionCard>

            {/* ── THEATRE TEAM WIDGETS ───────────────────────────────────── */}
            <SectionCard title="Theatre Team" icon="bx-group">
                <div className="col-12 mb-1">
                    <p style={{ color: theme.gray, fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
                        Medical professionals who participated in the procedure, showing their specific roles such as surgeon, anesthetist, and nursing staff.
                    </p>
                </div>
                {record.teamMembers && record.teamMembers.length > 0 ? (
                    record.teamMembers.map((tm, i) => (
                        <TeamMemberWidget key={tm.uid || i} member={tm.member} role={tm.role} rank={tm.rank} />
                    ))
                ) : (
                    <div className="col-12">
                        <div className="rounded-3 p-3 text-center" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
                            <i className="bx bx-info-circle fs-5" style={{ color: theme.gray }} />
                            <p className="mb-0 mt-1" style={{ color: theme.gray, fontSize: "0.85rem" }}>No team members have been recorded for this procedure.</p>
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* ── DELAY & COMPLIANCE WIDGETS ─────────────────────────────── */}
            <SectionCard title="Delay & Compliance" icon="bx-error-circle">
                <div className="col-12 mb-1">
                    <p style={{ color: theme.gray, fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
                        Time compliance indicators and any delays encountered during the procedure. This section helps identify bottlenecks and improve theatre scheduling efficiency.
                    </p>
                </div>
                <DataWidget
                    label="Delay Occurred"
                    value={record.hadDelay ? <Pill value="YES" color={theme.danger} icon="bx-error" /> : <Pill value="NO" color={theme.success} icon="bx-check" />}
                    note={record.hadDelay ? "One or more delays were recorded. See delay courses below for details." : "No delays recorded. Procedure proceeded on schedule."}
                />
                <DataWidget label="Delay Reason" value={record.delayReason || "—"} note="Primary reason provided for any delays encountered." />
                <DataWidget
                    label="Surgery Beyond Theatre Time"
                    value={record.surgeryBeyondTheatreTime === null ? <Pill value="N/A" color={theme.gray} /> : <Pill value={record.surgeryBeyondTheatreTime ? "YES" : "NO"} color={record.surgeryBeyondTheatreTime ? theme.danger : theme.success} />}
                    note={record.surgeryBeyondTheatreTime === null ? "Not recorded." : record.surgeryBeyondTheatreTime ? "Extended past allocated theatre time — may affect subsequent procedures." : "Completed within allocated theatre time slot."}
                />
                <DataWidget
                    label="Turnaround Target Met"
                    value={record.metTurnaroundTarget === null ? <Pill value="N/A" color={theme.gray} /> : <Pill value={record.metTurnaroundTarget ? "YES" : "NO"} color={record.metTurnaroundTarget ? theme.success : theme.danger} />}
                    note={record.metTurnaroundTarget === null ? "Not recorded." : record.metTurnaroundTarget ? "Met expected turnaround — indicates efficient workflow." : "Did not meet target — review processes may be needed."}
                />
                <DataWidget
                    label="Time Between Cases Met"
                    value={record.surgeryMetTimeBetweenCases === null ? <Pill value="N/A" color={theme.gray} /> : <Pill value={record.surgeryMetTimeBetweenCases ? "YES" : "NO"} color={record.surgeryMetTimeBetweenCases ? theme.success : theme.danger} />}
                    note={record.surgeryMetTimeBetweenCases === null ? "Not recorded." : record.surgeryMetTimeBetweenCases ? "Adequate time maintained between cases." : "Insufficient time between cases — may compromise preparation."}
                />

                {record.hadDelay && record.delayCourses && record.delayCourses.length > 0 && (
                    <div className="col-12 mt-3">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="d-flex align-items-center justify-content-center rounded-2 fw-bold" style={{ width: 28, height: 28, background: theme.danger, color: "#fff", fontSize: "0.75rem" }}>
                                {record.delayCourses.length}
                            </span>
                            <span className="fw-bold" style={{ color: theme.danger, fontSize: "0.8rem" }}>
                                Delay {record.delayCourses.length > 1 ? "Courses" : "Course"} — specific delay events recorded during the procedure
                            </span>
                        </div>
                        {record.delayCourses.map((dc, i) => (
                            <DelayWidget key={dc.uid || i} dc={dc} index={i} />
                        ))}
                    </div>
                )}
            </SectionCard>

            {/* ── PATIENT OUTCOME WIDGETS ────────────────────────────────── */}
            <SectionCard title="Patient Outcome" icon="bx-check-shield">
                <div className="col-12 mb-1">
                    <p style={{ color: theme.gray, fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
                        The final status of the patient after the procedure, including discharge information or, in the unfortunate event of mortality, the cause and details.
                    </p>
                </div>
                <DataWidget
                    label="Outcome"
                    value={<Pill value={record.outcome || "—"} color={outcomeColor} icon={outcomeIcon} />}
                    note="Overall result of the procedure for the patient — discharged, transferred, or death."
                />
                {record.outcome === "DISCHARGED" && (
                    <>
                        <DataWidget label="Discharge Direction" value={<Pill value={record.dischargeDirection || "—"} color={theme.primary} />} note="Type of discharge: home, ward transfer, or rehabilitation." />
                        {record.dischargeDestination && (
                            <DataWidget label="Discharge Destination" value={record.dischargeDestination.name} note="Specific unit, ward, or facility patient was discharged to." />
                        )}
                    </>
                )}
                {record.outcome === "DEATH" && (
                    <>
                        {record.deathReason && (
                            <DataWidget label="Cause of Death" value={<Pill value={record.deathReason.name} color={theme.danger} />} note="Medical reason identified for the patient's mortality." />
                        )}
                        <DataWidget label="Death Description" value={record.deathDescription || "—"} note="Additional clinical details about the mortality event." />
                    </>
                )}
            </SectionCard>

            {/* ── EDIT MODAL ─────────────────────────────────────────────── */}
            {editModalOpen && (
                <TheatreTimeFormModal
                    selectedRecord={{
                        uid: record.uid,
                        patientMrn: record.patientMrn,
                        patientDob: record.patientDob,
                        patientSex: record.patientSex,
                        patientRegionUid: record.patientRegion?.uid,
                        patientRegionName: record.patientRegion?.name,
                        patientType: record.patientType,
                        patientSourceType: record.patientSourceType,
                        internalSourceUid: record.internalSource?.uid,
                        internalSourceName: record.internalSource?.name,
                        externalSourceUid: record.externalSource?.uid,
                        externalSourceName: record.externalSource?.name,
                        patientSourceName: patientSourceLabel,
                        theatreUnitUid: record.theatreUnit?.uid,
                        theatreUnitName: record.theatreUnit?.name,
                        theatreUnitCode: record.theatreUnit?.code,
                        procedureUid: record.procedure?.uid,
                        procedureName: record.procedure?.name,
                        procedureCode: record.procedure?.code,
                        estimatedProcedureMinutes: record.estimatedDurationMinutes,
                        procedureDate: record.procedureDate,
                        surgeonUid: record.teamMembers?.filter((tm) => tm.role === "SURGEON").map((tm) => tm.member?.uid),
                        anesthetistUid: record.teamMembers?.filter((tm) => tm.role === "ANESTHETIST").map((tm) => tm.member?.uid),
                        scrubNurseUid: record.teamMembers?.filter((tm) => tm.role === "SCRUB_NURSE").map((tm) => tm.member?.uid),
                        runnerNurseUid: record.teamMembers?.filter((tm) => tm.role === "RUNNER_NURSE").map((tm) => tm.member?.uid),
                        procedureStartTime: record.procedureStartTime,
                        procedureEndTime: record.procedureEndTime,
                        wasThereDelay: record.hadDelay ? "YES" : "NO",
                        surgeryBeyondTheatreTime: record.surgeryBeyondTheatreTime ? "YES" : "NO",
                        procedureDelays: record.delayCourses?.map((dc) => ({
                            procedureDelayCategoryUid: dc.cause?.procedureDelayCategory?.uid || dc.procedureDelayCategory?.uid,
                            procedureDelayCategoryName: dc.cause?.procedureDelayCategory?.name || dc.procedureDelayCategory?.name,
                            delayCauseUid: dc.cause?.uid || dc.delayCause?.uid,
                            delayCauseName: dc.cause?.name || dc.delayCause?.name,
                        })),
                        delayDescription: record.delayCourses?.[0]?.description || "",
                        patientOutcome: record.outcome,
                        dischargeDestination: record.dischargeDirection,
                        dischargeInternalSourceUid: record.dischargeDestination?.uid,
                        dischargeInternalSourceName: record.dischargeDestination?.name,
                        deathReasonUid: record.deathReason?.uid,
                        deathReasonName: record.deathReason?.name,
                        deathDescription: record.deathDescription,
                    }}
                    onSuccess={() => setEditModalOpen(false)}
                    onClose={() => setEditModalOpen(false)}
                />
            )}
        </>
    );
};

export default TheatreTimeRecordOpen;