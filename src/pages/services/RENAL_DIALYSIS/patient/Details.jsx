import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import "animate.css";
import { useNavigate, useParams } from "react-router-dom";
import BreadCumb from "../../../../layouts/BreadCumb";
import { formatDate } from "../../../../helpers/DateFormater";

export const DialysisDetailsPage = () => {
  const [visitData, setVisitData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedMonitoring, setExpandedMonitoring] = useState(null);
  const navigate = useNavigate();
  const { visitId } = useParams();

  useEffect(() => {
    const storedVisit = sessionStorage.getItem("dialysisVisitData");
    const storedPatient = sessionStorage.getItem("dialysisPatientData");

    if (storedVisit && storedPatient) {
      setVisitData(JSON.parse(storedVisit));
      setPatientData(JSON.parse(storedPatient));
    }
    setLoading(false);
  }, [visitId]);

  const getGenderIcon = (gender) => {
    if (!gender) return "bx-user";
    return gender.toLowerCase() === "m" || gender === "M"
      ? "bx-male-sign"
      : "bx-female-sign";
  };

  const getGenderColor = (gender) => {
    if (!gender) return "#6c757d";
    return gender.toLowerCase() === "m" || gender === "M"
      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
      : "linear-gradient(135deg, #ec4899 0%, #be185d 100%)";
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "-";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <>
        <BreadCumb pageList={["Renal Dialysis", "Patient", "Visit Details"]} />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "500px" }}
        >
          <div className="text-center">
            <div className="position-relative mb-4">
              <div className="position-relative">
                <ReactLoading
                  type="spin"
                  color="#6366f1"
                  height={60}
                  width={60}
                  className="mx-auto"
                />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <i className="bx bx-droplet fs-4 text-primary"></i>
                </div>
              </div>
            </div>
            <h6 className="text-gray-600 mb-2">Loading Dialysis Record</h6>
            <p className="text-muted small">
              Retrieving patient session details...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!visitData || !patientData) {
    return (
      <>
        <BreadCumb pageList={["Renal Dialysis", "Patient", "Visit Details"]} />
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "16px" }}
        >
          <div className="card-body text-center py-5">
            <div className="mb-4">
              <div className="position-relative d-inline-block">
                <div
                  className="p-4 rounded-circle"
                  style={{
                    background:
                      "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                  }}
                >
                  <i className="bx bx-error text-primary fs-1"></i>
                </div>
              </div>
            </div>
            <h4 className="text-gray-800 mb-3">Session Record Not Available</h4>
            <p
              className="text-muted mb-4 mx-auto"
              style={{ maxWidth: "400px" }}
            >
              The dialysis session details could not be retrieved. Please
              navigate back and select a valid session.
            </p>
            <button
              className="btn btn-primary px-4"
              onClick={() => navigate("/renal-dialysis/patient")}
            >
              <i className="bx bx-arrow-back me-2"></i>Return to Patient Visits
            </button>
          </div>
        </div>
      </>
    );
  }

  const visit = visitData;
  const patient = patientData;
  const preDialysis = visit.pre_dialysis || {};
  const dialysisOrder = visit.dialysis_order || {};
  const dialysisSession = visit.dialysis_session || {};
  const monitoring = visit.dialysis_monitoring || [];
  const postDialysis = visit.post_dialysis || {};
  const investigations = visit.investigations || [];
  const medications = visit.medications || [];
  const dialysisProblems = visit.dialysis_problems || {};

  // Mock medical staff data (in real app, this would come from API)
  const medicalStaff = {
    physician: {
      name: "Dr. Sarah Johnson",
      role: "Attending Physician",
      specialty: "Nephrology",
      contact: "ext. 2345",
    },
    specialist: {
      name: "Dr. Michael Chen",
      role: "Renal Specialist",
      specialty: "Dialysis",
      contact: "ext. 5678",
    },
    nurse: {
      name: "Emily Rodriguez, RN",
      role: "Charge Nurse",
      specialty: "Critical Care",
      contact: "ext. 8901",
    },
    technician: {
      name: "Robert Kim",
      role: "Dialysis Technician",
      specialty: "Equipment",
      contact: "ext. 3456",
    },
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: "bx-dashboard",
      color: "#6366f1",
    },
    {
      id: "pre-dialysis",
      label: "Pre-Dialysis",
      icon: "bx-heart",
      color: "#10b981",
    },
    {
      id: "session",
      label: "Session Details",
      icon: "bx-droplet",
      color: "#3b82f6",
    },
    {
      id: "monitoring",
      label: "Monitoring",
      icon: "bx-bar-chart-alt-2",
      color: "#f59e0b",
    },
    {
      id: "post-dialysis",
      label: "Post-Dialysis",
      icon: "bx-check-shield",
      color: "#8b5cf6",
    },
    {
      id: "investigations",
      label: "Lab Results",
      icon: "bx-test-tube",
      color: "#ec4899",
    },
    {
      id: "medications",
      label: "Medications",
      icon: "bx-capsule",
      color: "#06b6d4",
    },
    { id: "staff", label: "Medical Staff", icon: "bx-group", color: "#14b8a6" },
  ];

  const getVitalStatus = (value, type) => {
    const ranges = {
      bp: { normal: "120/80", warning: "140/90", danger: "160/100" },
      pulse: { normal: "60-100", warning: "100-120", danger: ">120" },
      spo2: { normal: "95-100", warning: "90-94", danger: "<90" },
    };
    return "normal"; // Simplified for this example
  };

  return (
    <>
      <BreadCumb pageList={["Renal Dialysis", "Patient", "Session Details"]} />

      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "16px" }}
          >
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-start">
                    <div className="position-relative me-4">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{
                          width: "72px",
                          height: "72px",
                          fontSize: "24px",
                          background: getGenderColor(patient.sex),
                          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                        }}
                      >
                        {patient.first_name?.charAt(0)}
                        {patient.last_name?.charAt(0)}
                      </div>
                      <div className="position-absolute bottom-0 end-0">
                        <div className="bg-white rounded-circle border border-2 border-primary p-1">
                          <i
                            className={`bx ${getGenderIcon(
                              patient.sex
                            )} text-primary fs-6`}
                          ></i>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <h2 className="h4 fw-bold text-gray-800 mb-0 me-3">
                          {patient.first_name} {patient.last_name}
                        </h2>
                        <span
                          className={`badge ${
                            visit.discharged
                              ? "bg-success-subtle text-success"
                              : "bg-warning-subtle text-warning"
                          }`}
                        >
                          <i
                            className={`bx ${
                              visit.discharged ? "bx-check-circle" : "bx-timer"
                            } me-1`}
                          ></i>
                          {visit.discharged ? "Discharged" : "Active"}
                        </span>
                      </div>

                      <div className="row g-3">
                        <div className="col-auto">
                          <div className="d-flex align-items-center text-muted">
                            <i className="bx bx-cake me-2"></i>
                            <span>
                              {calculateAge(patient.date_of_birth)} yrs •{" "}
                              {patient.sex}
                            </span>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="d-flex align-items-center text-muted">
                            <i className="bx bx-id-card me-2"></i>
                            <code className="bg-light px-2 py-1 rounded">
                              {patient.hospital_reg_no}
                            </code>
                          </div>
                        </div>
                        <div className="col-auto">
                          <div className="d-flex align-items-center text-muted">
                            <i className="bx bx-phone me-2"></i>
                            <span>{patient.phone_number}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="badge bg-primary-subtle text-primary me-2">
                          <i className="bx bx-water me-1"></i>
                          {visit.diagnosis}
                        </span>
                        <span className="badge bg-secondary-subtle text-secondary">
                          <i className="bx bx-map me-1"></i>
                          {visit.ward}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                  <div className="d-flex flex-column">
                    <div className="mb-3">
                      <h6 className="text-muted small mb-1">Session Date</h6>
                      <div className="fw-bold text-gray-800">
                        {formatDate(visit.visit_date, "DD MMM YYYY, HH:mm")}
                      </div>
                    </div>
                    <div>
                      <h6 className="text-muted small mb-1">
                        Attending Physician
                      </h6>
                      <div className="fw-bold text-gray-800 d-flex align-items-center justify-content-md-end">
                        <i className="bx bx-user-md me-2 text-primary"></i>
                        {visit.attending_doctor}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Navigation Tabs */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: "12px" }}
      >
        <div className="card-body p-0">
          <div
            className="d-flex align-items-center px-3 py-2"
            style={{ overflowX: "auto", scrollbarWidth: "none" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`btn btn-link text-decoration-none px-3 py-3 d-flex align-items-center me-4 ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  borderBottom: `3px solid ${
                    activeTab === tab.id ? tab.color : "transparent"
                  }`,
                  color: activeTab === tab.id ? tab.color : "#6c757d",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  whiteSpace: "nowrap",
                }}
              >
                <i className={`bx ${tab.icon} me-2 fs-5`}></i>
                {tab.label}
                {tab.id === "monitoring" && monitoring.length > 0 && (
                  <span className="badge bg-light text-dark ms-2">
                    {monitoring.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="row">
        {/* Left Sidebar - Quick Stats */}
        <div className="col-xl-3 col-lg-3 mb-4">
          <div className="sticky-top" style={{ top: "20px" }}>
            {/* Session Summary */}
            <div
              className="card border-0 shadow-sm mb-4"
              style={{ borderRadius: "12px" }}
            >
              <div className="card-body">
                <h6 className="fw-bold text-gray-800 mb-3 border-bottom pb-2">
                  <i className="bx bx-bar-chart-square me-2"></i>
                  Session Summary
                </h6>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Duration</span>
                    <span className="fw-bold" style={{ color: "#3b82f6" }}>
                      {dialysisOrder.hours_of_dialysis || 4}h
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Weight Loss</span>
                    <span className="fw-bold" style={{ color: "#10b981" }}>
                      {postDialysis.weight_loss || 2.1} kg
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Access Type</span>
                    <span className="badge bg-info-subtle text-info">
                      {visit.vascular_access?.access_type || "AV Fistula"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Status</span>
                    <div className="d-flex align-items-center">
                      <span
                        className={`dot me-2 ${
                          visit.discharged ? "bg-success" : "bg-warning"
                        }`}
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                        }}
                      ></span>
                      <span className="fw-medium">
                        {visit.discharged ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="card border-0 shadow-sm mb-4"
              style={{ borderRadius: "12px" }}
            >
              <div className="card-body">
                <h6 className="fw-bold text-gray-800 mb-3 border-bottom pb-2">
                  <i className="bx bx-command me-2"></i>
                  Quick Actions
                </h6>

                <div className="d-grid gap-2">
                  <button className="btn btn-primary btn-sm">
                    <i className="bx bx-edit me-2"></i>
                    Edit Session
                  </button>
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="bx bx-printer me-2"></i>
                    Print Report
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bx bx-download me-2"></i>
                    Export PDF
                  </button>
                  <button className="btn btn-outline-danger btn-sm">
                    <i className="bx bx-x-circle me-2"></i>
                    Cancel Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-xl-9 col-lg-9">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "16px" }}
          >
            <div className="card-body p-4">
              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold text-gray-800 mb-4">
                    Session Overview
                  </h5>

                  {/* Vital Signs Summary */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div
                        className="border rounded-3 p-3 text-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                        }}
                      >
                        <div className="mb-2">
                          <i className="bx bx-body text-primary fs-1"></i>
                        </div>
                        <div className="fw-bold text-gray-800 mb-1">
                          Weight Loss
                        </div>
                        <h3 className="mb-0" style={{ color: "#0369a1" }}>
                          {postDialysis.weight_loss || 2.1} kg
                        </h3>
                        <div className="text-muted small">
                          {preDialysis.weight} kg → {postDialysis.weight} kg
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div
                        className="border rounded-3 p-3 text-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                        }}
                      >
                        <div className="mb-2">
                          <i className="bx bx-heart-circle text-success fs-1"></i>
                        </div>
                        <div className="fw-bold text-gray-800 mb-1">
                          BP Change
                        </div>
                        <h3 className="mb-0" style={{ color: "#166534" }}>
                          {preDialysis.resting_bp || "120/80"}
                        </h3>
                        <div className="text-muted small">
                          {postDialysis.resting_bp || "118/78"} post-dialysis
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div
                        className="border rounded-3 p-3 text-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                        }}
                      >
                        <div className="mb-2">
                          <i className="bx bx-timer text-warning fs-1"></i>
                        </div>
                        <div className="fw-bold text-gray-800 mb-1">
                          Session Duration
                        </div>
                        <h3 className="mb-0" style={{ color: "#92400e" }}>
                          {dialysisOrder.hours_of_dialysis || 4}h
                        </h3>
                        <div className="text-muted small">
                          Start:{" "}
                          {formatDate(dialysisSession.start_time, "HH:mm")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Problems Overview */}
                  <div className="mb-4">
                    <h6 className="fw-bold text-gray-800 mb-3">
                      <i className="bx bx-alert-triangle me-2 text-warning"></i>
                      Complications During Session
                    </h6>
                    <div className="row g-2">
                      {[
                        {
                          key: "hypotension",
                          label: "Hypotension",
                          value: dialysisProblems.hypotension,
                        },
                        {
                          key: "hypertension",
                          label: "Hypertension",
                          value: dialysisProblems.hypertension,
                        },
                        {
                          key: "chills",
                          label: "Chills",
                          value: dialysisProblems.chills,
                        },
                        {
                          key: "fever",
                          label: "Fever",
                          value: dialysisProblems.fever,
                        },
                      ].map((problem) => (
                        <div className="col-md-3" key={problem.key}>
                          <div
                            className={`border rounded-3 p-3 text-center ${
                              problem.value ? "border-danger" : "border-success"
                            }`}
                          >
                            <div
                              className={`mb-2 ${
                                problem.value ? "text-danger" : "text-success"
                              }`}
                            >
                              <i
                                className={`bx ${
                                  problem.value
                                    ? "bx-x-circle"
                                    : "bx-check-circle"
                                } fs-2`}
                              ></i>
                            </div>
                            <div className="fw-medium">{problem.label}</div>
                            <div className="small text-muted">
                              {problem.value ? "Present" : "Absent"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Equipment Summary */}
                  <div>
                    <h6 className="fw-bold text-gray-800 mb-3">
                      <i className="bx bx-cog me-2 text-secondary"></i>
                      Equipment Used
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="border rounded-3 p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="text-muted small">
                                Machine Type
                              </div>
                              <div className="fw-bold">
                                {dialysisSession.machine_type ||
                                  "Fresenius 5008S"}
                              </div>
                            </div>
                            <i className="bx bx-chip text-primary fs-3"></i>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="border rounded-3 p-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="text-muted small">Dialyzer</div>
                              <div className="fw-bold">
                                {dialysisSession.dialyzer_type ||
                                  "Polyflux 170H"}
                              </div>
                            </div>
                            <i className="bx bx-filter-alt text-success fs-3"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pre-dialysis" && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold text-gray-800 mb-4">
                    Pre-Dialysis Assessment
                  </h5>
                  <div className="row g-3">
                    {[
                      {
                        label: "Weight",
                        value: `${preDialysis.weight} kg`,
                        icon: "bx-weight",
                        color: "#6366f1",
                      },
                      {
                        label: "Height",
                        value: `${preDialysis.height_cm} cm`,
                        icon: "bx-ruler",
                        color: "#10b981",
                      },
                      {
                        label: "Temperature",
                        value: `${preDialysis.temperature}°C`,
                        icon: "bx-thermometer",
                        color: "#ec4899",
                      },
                      {
                        label: "Resting BP",
                        value: preDialysis.resting_bp,
                        icon: "bx-heart",
                        color: "#ef4444",
                      },
                      {
                        label: "Standing BP",
                        value: preDialysis.standing_bp,
                        icon: "bx-trending-up",
                        color: "#f59e0b",
                      },
                      {
                        label: "Pulse",
                        value: `${preDialysis.pulse} bpm`,
                        icon: "bx-pulse",
                        color: "#8b5cf6",
                      },
                      {
                        label: "SpO2",
                        value: `${preDialysis.spo2}%`,
                        icon: "bx-wind",
                        color: "#06b6d4",
                      },
                      {
                        label: "Respiration",
                        value: `${preDialysis.respiration}/min`,
                        icon: "bx-cloud",
                        color: "#14b8a6",
                      },
                    ].map((vital, idx) => (
                      <div className="col-md-3" key={idx}>
                        <div className="border rounded-3 p-3 text-center h-100">
                          <div className="mb-2">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                              style={{
                                width: "48px",
                                height: "48px",
                                backgroundColor: `${vital.color}20`,
                                color: vital.color,
                              }}
                            >
                              <i className={`bx ${vital.icon} fs-3`}></i>
                            </div>
                          </div>
                          <div className="text-muted small mb-1">
                            {vital.label}
                          </div>
                          <div className="fw-bold text-gray-800 fs-5">
                            {vital.value || "-"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "session" && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold text-gray-800 mb-4">
                    Session Details
                  </h5>

                  {/* Dialysate Parameters */}
                  <div className="mb-4">
                    <h6 className="fw-bold text-gray-700 mb-3">
                      <i className="bx bx-flask me-2 text-primary"></i>
                      Dialysate Parameters
                    </h6>
                    <div className="row g-2">
                      {[
                        {
                          label: "Na",
                          value: dialysisOrder.dialysate_na,
                          unit: "mmol/L",
                          color: "#3b82f6",
                        },
                        {
                          label: "K",
                          value: dialysisOrder.dialysate_k,
                          unit: "mmol/L",
                          color: "#10b981",
                        },
                        {
                          label: "Ca",
                          value: dialysisOrder.dialysate_ca,
                          unit: "mmol/L",
                          color: "#f59e0b",
                        },
                        {
                          label: "Bicarbonate",
                          value: dialysisOrder.bicarbonate,
                          unit: "mmol/L",
                          color: "#8b5cf6",
                        },
                      ].map((param, idx) => (
                        <div className="col-md-3" key={idx}>
                          <div className="border rounded-3 p-3 text-center">
                            <div className="mb-1">
                              <div className="fw-bold text-gray-800">
                                {param.label}
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                              <h3
                                className="mb-0 me-2"
                                style={{ color: param.color }}
                              >
                                {param.value || "140"}
                              </h3>
                              <small className="text-muted">{param.unit}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medications Given */}
                  <div className="mb-4">
                    <h6 className="fw-bold text-gray-700 mb-3">
                      <i className="bx bx-capsule me-2 text-success"></i>
                      Medications Administered
                    </h6>
                    <div className="row g-2">
                      {[
                        {
                          label: "Heparin",
                          value: `${dialysisOrder.heparin_units || 5000} IU`,
                          given: true,
                          icon: "bx-droplet",
                        },
                        {
                          label: "EPO",
                          value: "4000 IU",
                          given: dialysisOrder.epo_given,
                          icon: "bx-heart-circle",
                        },
                        {
                          label: "LMWH",
                          value: "40 mg",
                          given: dialysisOrder.lmwh_used,
                          icon: "bx-shield",
                        },
                        {
                          label: "Iron",
                          value: "100 mg",
                          given: dialysisOrder.iron_given,
                          icon: "bx-atom",
                        },
                      ].map((med, idx) => (
                        <div className="col-md-3" key={idx}>
                          <div
                            className={`border rounded-3 p-3 ${
                              med.given ? "border-success" : "border-secondary"
                            }`}
                          >
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <div className="fw-medium">{med.label}</div>
                                <div className="text-muted small">
                                  {med.value}
                                </div>
                              </div>
                              <div
                                className={`rounded-circle d-flex align-items-center justify-content-center ${
                                  med.given ? "bg-success" : "bg-secondary"
                                }`}
                                style={{ width: "24px", height: "24px" }}
                              >
                                <i
                                  className={`bx ${med.icon} text-white fs-6`}
                                ></i>
                              </div>
                            </div>
                            <div className="text-center">
                              <span
                                className={`badge ${
                                  med.given
                                    ? "bg-success-subtle text-success"
                                    : "bg-secondary-subtle text-secondary"
                                }`}
                              >
                                {med.given ? "Administered" : "Not Given"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timing Information */}
                  <div>
                    <h6 className="fw-bold text-gray-700 mb-3">
                      <i className="bx bx-time me-2 text-warning"></i>
                      Session Timing
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="border rounded-3 p-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <div className="text-muted small">Started By</div>
                              <div className="fw-bold">
                                {dialysisSession.started_by}
                              </div>
                            </div>
                            <i className="bx bx-play-circle text-success fs-3"></i>
                          </div>
                          <div className="text-muted">
                            {formatDate(dialysisSession.start_time, "HH:mm")}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="border rounded-3 p-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                              <div className="text-muted small">Closed By</div>
                              <div className="fw-bold">
                                {dialysisSession.closed_by}
                              </div>
                            </div>
                            <i className="bx bx-stop-circle text-primary fs-3"></i>
                          </div>
                          <div className="text-muted">
                            {formatDate(dialysisSession.end_time, "HH:mm")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "monitoring" && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold text-gray-800 mb-4">
                    Hourly Monitoring Records
                  </h5>

                  <div className="card border-0 shadow-sm">
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead style={{ backgroundColor: "#f8fafc" }}>
                            <tr>
                              <th className="ps-4 py-3 fw-semibold text-gray-700">
                                Time
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                BP
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                Pulse
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                Resp
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                AP
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                VP
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                Blood Flow
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                TMP
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                UF Rate
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                Removed <br />
                                <span className="text-secondary">( mL )</span>
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                RBG
                              </th>
                              <th className="py-3 fw-semibold text-gray-700 text-center">
                                SpO2
                              </th>
                              <th className="pe-4 py-3 fw-semibold text-gray-700">
                                Remarks
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {monitoring.map((record, idx) => (
                              <tr
                                key={idx}
                                className={
                                  idx % 2 === 0 ? "bg-white" : "bg-light-subtle"
                                }
                                title={`Hour ${idx + 1} Monitoring`}
                              >
                                <td className="ps-4 py-3">
                                  <div className="d-flex align-items-center">
                                    <div>
                                      <div className="fw-medium">
                                        <span className="fw-bold">
                                          {record.time}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-center py-3">
                                  <span className="badge bg-info-subtle text-info py-1 px-2">
                                    {record.bp || "-"}
                                  </span>
                                </td>
                                <td className="text-center py-3">
                                  <span
                                    className={`badge ${
                                      record.pulse >= 60 && record.pulse <= 100
                                        ? "bg-success-subtle text-success"
                                        : "bg-danger-subtle text-danger"
                                    } py-1 px-2`}
                                  >
                                    {record.pulse || "-"}
                                  </span>
                                </td>
                                <td className="text-center py-3">
                                  <span className="badge bg-secondary-subtle text-secondary py-1 px-2">
                                    {record.resp || "-"}
                                  </span>
                                </td>
                                <td className="text-center py-3">
                                  <span className="badge bg-warning-subtle text-warning py-1 px-2">
                                    {record.ap || "-"}
                                  </span>
                                </td>
                                <td className="text-center py-3">
                                  <span className="badge bg-warning-subtle text-warning py-1 px-2">
                                    {record.vp || "-"}
                                  </span>
                                </td>
                                <td className="text-center py-3">
                                  <span className="badge bg-primary-subtle text-primary py-1 px-2">
                                    {record.blood_flow || "-"}
                                  </span>
                                </td>
                                <td className="text-center py-3">
                                  <span className="badge bg-dark-subtle text-dark py-1 px-2">
                                    {record.tmp || "-"}
                                  </span>
                                </td>
                                <td className="text-center py-3">
                                  <span className="badge bg-success-subtle text-success py-1 px-2">
                                    {record.uf_rate || "-"}
                                  </span>
                                </td>
                                <td
                                  className="text-center py-3"
                                  style={{ width: "130px" }}
                                >
                                  <code className="bg-light px-2 py-1 rounded">
                                    {record.total_removed_ml || 0}
                                  </code>
                                </td>
                                <td className="text-center py-3">
                                  <span
                                    className={`badge ${
                                      record.rbg >= 4 && record.rbg <= 7
                                        ? "bg-success-subtle text-success"
                                        : "bg-danger-subtle text-danger"
                                    } py-1 px-2`}
                                  >
                                    {record.rbg || "-"}
                                  </span>
                                </td>
                                <td className="text-center py-3">
                                  <span
                                    className={`badge ${
                                      record.spo2 >= 95
                                        ? "bg-success-subtle text-success"
                                        : record.spo2 >= 90
                                        ? "bg-warning-subtle text-warning"
                                        : "bg-danger-subtle text-danger"
                                    } py-1 px-2`}
                                  >
                                    {record.spo2 || "-"}%
                                  </span>
                                </td>
                                <td className="pe-4 py-3">
                                  <div
                                    className="small text-muted"
                                    style={{ maxWidth: "150px" }}
                                  >
                                    {record.remarks || "No remarks"}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {monitoring.length === 0 && (
                        <div className="text-center py-5">
                          <i className="bx bx-bar-chart-alt text-muted fs-1 d-block mb-3"></i>
                          <p className="text-muted">
                            No monitoring records available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "post-dialysis" && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold text-gray-800 mb-4">
                    Post-Dialysis Assessment
                  </h5>

                  {/* Weight Loss Highlight */}
                  <div className="mb-4">
                    <div
                      className="border rounded-3 p-4"
                      style={{
                        background:
                          "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                        borderColor: "#10b981",
                      }}
                    >
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <h6 className="fw-bold text-gray-800 mb-2">
                            <i className="bx bx-trending-down text-success me-2"></i>
                            Successful Fluid Removal
                          </h6>
                          <div className="d-flex align-items-center">
                            <div className="me-4">
                              <div className="text-muted small">
                                Starting Weight
                              </div>
                              <div className="fw-bold fs-4">
                                {preDialysis.weight} kg
                              </div>
                            </div>
                            <i className="bx bx-right-arrow-alt text-muted fs-2"></i>
                            <div className="ms-4">
                              <div className="text-muted small">
                                Final Weight
                              </div>
                              <div className="fw-bold fs-4">
                                {postDialysis.weight} kg
                              </div>
                            </div>
                            <div className="ms-4">
                              <div className="text-muted small">Net Loss</div>
                              <div className="fw-bold fs-4 text-success">
                                {postDialysis.weight_loss} kg
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 text-center">
                          <div
                            className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <div>
                              <div className="fs-1 fw-bold">
                                {postDialysis.weight_loss}
                              </div>
                              <div className="small">kg</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs Comparison */}
                  <div>
                    <h6 className="fw-bold text-gray-700 mb-3">
                      Vital Signs Comparison
                    </h6>
                    <div className="row g-3">
                      {[
                        {
                          label: "Blood Pressure",
                          pre: preDialysis.resting_bp,
                          post: postDialysis.resting_bp,
                          icon: "bx-heart",
                          unit: "mmHg",
                        },
                        {
                          label: "Pulse",
                          pre: `${preDialysis.pulse} bpm`,
                          post: `${postDialysis.pulse} bpm`,
                          icon: "bx-pulse",
                          unit: "bpm",
                        },
                        {
                          label: "SpO2",
                          pre: `${preDialysis.spo2}%`,
                          post: `${postDialysis.spo2}%`,
                          icon: "bx-wind",
                          unit: "%",
                        },
                        {
                          label: "Temperature",
                          pre: `${preDialysis.temperature}°C`,
                          post: `${postDialysis.temperature}°C`,
                          icon: "bx-thermometer",
                          unit: "°C",
                        },
                      ].map((vital, idx) => (
                        <div className="col-md-3" key={idx}>
                          <div className="border rounded-3 p-3 h-100">
                            <div className="text-center mb-3">
                              <i
                                className={`bx ${vital.icon} text-primary fs-2`}
                              ></i>
                            </div>
                            <div className="text-center mb-2">
                              <div className="fw-medium text-gray-800">
                                {vital.label}
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="text-center">
                                <div className="text-muted small">Pre</div>
                                <div className="fw-bold text-warning">
                                  {vital.pre || "-"}
                                </div>
                              </div>
                              <i className="bx bx-right-arrow-alt text-muted"></i>
                              <div className="text-center">
                                <div className="text-muted small">Post</div>
                                <div className="fw-bold text-success">
                                  {vital.post || "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "investigations" && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold text-gray-800 mb-4">
                    Laboratory Results
                  </h5>

                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead style={{ backgroundColor: "#f8fafc" }}>
                        <tr>
                          <th className="ps-4 py-3 fw-semibold text-gray-700">
                            Parameter
                          </th>
                          <th className="py-3 fw-semibold text-gray-700 text-center">
                            Pre-Dialysis
                          </th>
                          <th className="py-3 fw-semibold text-gray-700 text-center">
                            Post-Dialysis
                          </th>
                          <th className="py-3 fw-semibold text-gray-700 text-center">
                            Reduction
                          </th>
                          <th className="py-3 fw-semibold text-gray-700 text-center">
                            Status
                          </th>
                          <th className="pe-4 py-3 fw-semibold text-gray-700">
                            Reference Range
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {investigations.map((inv, idx) => {
                          const reduction =
                            inv.pre_dialysis_value - inv.post_dialysis_value;
                          const percentage = (
                            (reduction / inv.pre_dialysis_value) *
                            100
                          ).toFixed(1);

                          return (
                            <tr key={idx} className="border-bottom">
                              <td className="ps-4 py-3">
                                <div className="fw-semibold">{inv.name}</div>
                                <div className="text-muted small">
                                  {inv.unit}
                                </div>
                              </td>
                              <td className="text-center py-3">
                                <span className="badge bg-warning-subtle text-warning py-2 px-3">
                                  {inv.pre_dialysis_value}
                                </span>
                              </td>
                              <td className="text-center py-3">
                                <span className="badge bg-success-subtle text-success py-2 px-3">
                                  {inv.post_dialysis_value}
                                </span>
                              </td>
                              <td className="text-center py-3">
                                <div className="d-flex flex-column align-items-center">
                                  <span className="fw-bold text-success">
                                    {reduction.toFixed(1)}
                                  </span>
                                  <span className="text-muted small">
                                    ({percentage}%)
                                  </span>
                                </div>
                              </td>
                              <td className="text-center py-3">
                                <div className="d-flex justify-content-center">
                                  <span
                                    className={`badge ${
                                      percentage > 30
                                        ? "bg-success-subtle text-success"
                                        : "bg-warning-subtle text-warning"
                                    }`}
                                  >
                                    <i
                                      className={`bx ${
                                        percentage > 30
                                          ? "bx-check-circle"
                                          : "bx-time"
                                      } me-1`}
                                    ></i>
                                    {percentage > 30 ? "Good" : "Moderate"}
                                  </span>
                                </div>
                              </td>
                              <td className="pe-4 py-3">
                                <span className="badge bg-light text-dark">
                                  {inv.reference_range || "N/A"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {investigations.length === 0 && (
                    <div className="text-center py-5">
                      <i className="bx bx-test-tube text-muted fs-1 d-block mb-3"></i>
                      <p className="text-muted">
                        No laboratory results available
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "medications" && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold text-gray-800 mb-4">
                    Prescribed Medications
                  </h5>

                  <div className="row g-3">
                    {medications.map((med, idx) => (
                      <div className="col-md-4" key={idx}>
                        <div className="border rounded-3 p-3 h-100">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="mb-1 fw-bold">{med.name}</h6>
                              <span className="badge bg-secondary-subtle text-secondary">
                                {med.route}
                              </span>
                            </div>
                            <div
                              className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center"
                              style={{ width: "40px", height: "40px" }}
                            >
                              <i className="bx bx-capsule text-primary"></i>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-1">
                              <i className="bx bx-capsule text-muted me-2"></i>
                              <span className="fw-medium">Dose: </span>
                              <span className="ms-2">{med.dose}</span>
                            </div>
                            <div className="d-flex align-items-center mb-1">
                              <i className="bx bx-time text-muted me-2"></i>
                              <span className="fw-medium">Frequency: </span>
                              <span className="ms-2">{med.frequency}</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <i className="bx bx-calendar text-muted me-2"></i>
                              <span className="fw-medium">Duration: </span>
                              <span className="ms-2">
                                {med.duration || "As needed"}
                              </span>
                            </div>
                          </div>

                          <div className="border-top pt-2">
                            <div className="text-muted small">Instructions</div>
                            <div className="small">
                              {med.instructions || "Take as prescribed"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {medications.length === 0 && (
                    <div className="text-center py-5">
                      <i className="bx bx-capsule text-muted fs-1 d-block mb-3"></i>
                      <p className="text-muted">
                        No medications prescribed for this session
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "staff" && (
                <div className="animate__animated animate__fadeIn">
                  <h5 className="fw-bold text-gray-800 mb-4">Medical Team</h5>

                  <div className="row g-3">
                    {Object.entries(medicalStaff).map(([role, staff]) => (
                      <div className="col-md-6" key={role}>
                        <div
                          className="card border-0 shadow-sm h-100"
                          style={{ borderRadius: "12px" }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-start">
                              <div className="me-3">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    background:
                                      role === "physician"
                                        ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                                        : role === "specialist"
                                        ? "linear-gradient(135deg, #10b981 0%, #047857 100%)"
                                        : role === "nurse"
                                        ? "linear-gradient(135deg, #ec4899 0%, #be185d 100%)"
                                        : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                  }}
                                >
                                  <i
                                    className={`bx ${
                                      role === "physician"
                                        ? "bx-user-md"
                                        : role === "specialist"
                                        ? "bx-stethoscope"
                                        : role === "nurse"
                                        ? "bx-plus-medical"
                                        : "bx-cog"
                                    } text-white fs-3`}
                                  ></i>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fw-bold text-gray-800 mb-1">
                                  {staff.name}
                                </h6>
                                <div className="d-flex align-items-center mb-2">
                                  <span className="badge bg-primary-subtle text-primary me-2">
                                    {staff.role}
                                  </span>
                                  <span className="badge bg-secondary-subtle text-secondary">
                                    {staff.specialty}
                                  </span>
                                </div>
                                <div className="text-muted small mb-2">
                                  <i className="bx bx-phone me-1"></i>
                                  Contact: {staff.contact}
                                </div>
                                <div className="small">
                                  <div className="text-muted mb-1">
                                    Responsibilities:
                                  </div>
                                  <ul className="mb-0 ps-3">
                                    {role === "physician" && [
                                      <li key="1">Primary care management</li>,
                                      <li key="2">Treatment planning</li>,
                                      <li key="3">Prescription authority</li>,
                                    ]}
                                    {role === "specialist" && [
                                      <li key="1">
                                        Dialysis procedure oversight
                                      </li>,
                                      <li key="2">Complication management</li>,
                                      <li key="3">Quality assurance</li>,
                                    ]}
                                    {role === "nurse" && [
                                      <li key="1">Patient monitoring</li>,
                                      <li key="2">
                                        Medication administration
                                      </li>,
                                      <li key="3">Patient education</li>,
                                    ]}
                                    {role === "technician" && [
                                      <li key="1">
                                        Equipment setup & maintenance
                                      </li>,
                                      <li key="2">
                                        Session technical support
                                      </li>,
                                      <li key="3">Safety checks</li>,
                                    ]}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .accordion-button:not(.collapsed) {
          box-shadow: none;
          border-color: rgba(59, 130, 246, 0.5);
        }

        .accordion-button:focus {
          box-shadow: none;
          border-color: rgba(59, 130, 246, 0.5);
        }

        .nav-link.active {
          color: #6366f1;
          font-weight: 600;
        }

        .dot {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        .card {
          transition: transform 0.2s ease;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        .table-hover tbody tr:hover {
          background-color: rgba(59, 130, 246, 0.05) !important;
        }
      `}</style>
    </>
  );
};
