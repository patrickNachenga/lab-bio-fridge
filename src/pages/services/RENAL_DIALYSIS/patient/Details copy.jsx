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
    { id: "session", label: "Session", icon: "bx-droplet", color: "#3b82f6" },
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

  return (
    <>
      <BreadCumb pageList={["Renal Dialysis", "Patient", "Session Details"]} />

      {/* Header Section */}
      <div
        className="card border-0 shadow-sm mb-4"
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
                  <h6 className="text-muted small mb-1">Visit ID</h6>
                  <div className="fw-bold text-gray-800">
                    <code className="bg-light px-2 py-1 rounded">
                      {visit.id}
                    </code>
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

      {/* Main Content Area with Right Sidebar */}
      <div className="row">
        {/* Main Content */}
        <div className="col-xl-9 col-lg-8">
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: "16px" }}
          >
            <div className="card-body p-4">
              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="animate__animated animate__fadeIn">
                  <div className="row">
                    {/* Quick Stats */}
                    <div className="col-md-8">
                      <h5 className="fw-bold text-gray-800 mb-4">
                        Session Overview
                      </h5>

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
                              {postDialysis.resting_bp || "118/78"}{" "}
                              post-dialysis
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
                              icon: "bx-trending-down",
                            },
                            {
                              key: "hypertension",
                              label: "Hypertension",
                              value: dialysisProblems.hypertension,
                              icon: "bx-trending-up",
                            },
                            {
                              key: "chills",
                              label: "Chills",
                              value: dialysisProblems.chills,
                              icon: "bx-cloud-snow",
                            },
                            {
                              key: "fever",
                              label: "Fever",
                              value: dialysisProblems.fever,
                              icon: "bx-thermometer",
                            },
                          ].map((problem) => (
                            <div className="col-md-3" key={problem.key}>
                              <div
                                className={`border rounded-3 p-3 text-center ${
                                  problem.value
                                    ? "border-danger"
                                    : "border-success"
                                }`}
                              >
                                <div
                                  className={`mb-2 ${
                                    problem.value
                                      ? "text-danger"
                                      : "text-success"
                                  }`}
                                >
                                  <i className={`bx ${problem.icon} fs-2`}></i>
                                </div>
                                <div className="fw-medium">{problem.label}</div>
                                <div className="small">
                                  {problem.value ? (
                                    <span className="text-danger">Present</span>
                                  ) : (
                                    <span className="text-success">Absent</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Medical Staff Sidebar */}
                    <div className="col-md-4">
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{ borderRadius: "12px" }}
                      >
                        <div className="card-body">
                          <h6 className="fw-bold text-gray-800 mb-3 border-bottom pb-2">
                            <i className="bx bx-group me-2 text-primary"></i>
                            Medical Team
                          </h6>

                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                              <div className="me-3">
                                <div
                                  className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <i className="bx bx-user-md text-primary"></i>
                                </div>
                              </div>
                              <div>
                                <div className="fw-medium">
                                  {medicalStaff.physician.name}
                                </div>
                                <div className="text-muted small">
                                  {medicalStaff.physician.role}
                                </div>
                              </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                              <div className="me-3">
                                <div
                                  className="rounded-circle bg-success-subtle d-flex align-items-center justify-content-center"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <i className="bx bx-stethoscope text-success"></i>
                                </div>
                              </div>
                              <div>
                                <div className="fw-medium">
                                  {medicalStaff.specialist.name}
                                </div>
                                <div className="text-muted small">
                                  {medicalStaff.specialist.role}
                                </div>
                              </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                              <div className="me-3">
                                <div
                                  className="rounded-circle bg-info-subtle d-flex align-items-center justify-content-center"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <i className="bx bx-plus-medical text-info"></i>
                                </div>
                              </div>
                              <div>
                                <div className="fw-medium">
                                  {medicalStaff.nurse.name}
                                </div>
                                <div className="text-muted small">
                                  {medicalStaff.nurse.role}
                                </div>
                              </div>
                            </div>

                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <div
                                  className="rounded-circle bg-warning-subtle d-flex align-items-center justify-content-center"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <i className="bx bx-cog text-warning"></i>
                                </div>
                              </div>
                              <div>
                                <div className="fw-medium">
                                  {medicalStaff.technician.name}
                                </div>
                                <div className="text-muted small">
                                  {medicalStaff.technician.role}
                                </div>
                              </div>
                            </div>
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
                        status: "normal",
                      },
                      {
                        label: "Height",
                        value: `${preDialysis.height_cm} cm`,
                        icon: "bx-ruler",
                        color: "#10b981",
                        status: "normal",
                      },
                      {
                        label: "Temperature",
                        value: `${preDialysis.temperature}°C`,
                        icon: "bx-thermometer",
                        color: "#ec4899",
                        status: "normal",
                      },
                      {
                        label: "Resting BP",
                        value: preDialysis.resting_bp,
                        icon: "bx-heart",
                        color: "#ef4444",
                        status: "normal",
                      },
                      {
                        label: "Standing BP",
                        value: preDialysis.standing_bp,
                        icon: "bx-trending-up",
                        color: "#f59e0b",
                        status: "normal",
                      },
                      {
                        label: "Pulse",
                        value: `${preDialysis.pulse} bpm`,
                        icon: "bx-pulse",
                        color: "#8b5cf6",
                        status: "normal",
                      },
                      {
                        label: "SpO2",
                        value: `${preDialysis.spo2}%`,
                        icon: "bx-wind",
                        color: "#06b6d4",
                        status: "normal",
                      },
                      {
                        label: "Respiration",
                        value: `${preDialysis.respiration}/min`,
                        icon: "bx-cloud",
                        color: "#14b8a6",
                        status: "normal",
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
                          <div className="fw-bold text-gray-800 fs-5 mb-1">
                            {vital.value || "-"}
                          </div>
                          <span
                            className={`badge ${
                              vital.status === "normal"
                                ? "bg-success-subtle text-success"
                                : "bg-danger-subtle text-danger"
                            } small`}
                          >
                            {vital.status === "normal" ? "Normal" : "Abnormal"}
                          </span>
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

                  <div className="row">
                    <div className="col-md-8">
                      {/* Dialysate Parameters */}
                      <div className="mb-4">
                        <h6 className="fw-bold text-gray-700 mb-3">
                          <i className="bx bx-flask me-2 text-primary"></i>
                          Dialysate Parameters
                        </h6>
                        <div className="row g-2">
                          {[
                            {
                              label: "Sodium (Na)",
                              value: dialysisOrder.dialysate_na,
                              unit: "mmol/L",
                              color: "#3b82f6",
                            },
                            {
                              label: "Potassium (K)",
                              value: dialysisOrder.dialysate_k,
                              unit: "mmol/L",
                              color: "#10b981",
                            },
                            {
                              label: "Calcium (Ca)",
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
                            {
                              label: "Hours",
                              value: dialysisOrder.hours_of_dialysis,
                              unit: "hours",
                              color: "#06b6d4",
                            },
                            {
                              label: "Target Loss",
                              value: dialysisOrder.target_weight_loss,
                              unit: "kg",
                              color: "#ec4899",
                            },
                          ].map((param, idx) => (
                            <div className="col-md-4" key={idx}>
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
                                    {param.value ||
                                      (param.label === "Hours"
                                        ? "4"
                                        : param.label === "Target Loss"
                                        ? "2.5"
                                        : "140")}
                                  </h3>
                                  <small className="text-muted">
                                    {param.unit}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Medications Given */}
                      <div>
                        <h6 className="fw-bold text-gray-700 mb-3">
                          <i className="bx bx-capsule me-2 text-success"></i>
                          Medications Administered
                        </h6>
                        <div className="row g-2">
                          {[
                            {
                              label: "Heparin",
                              value: `${
                                dialysisOrder.heparin_units || 5000
                              } IU`,
                              given: true,
                              icon: "bx-droplet",
                              time: "Start",
                            },
                            {
                              label: "EPO",
                              value: "4000 IU",
                              given: dialysisOrder.epo_given,
                              icon: "bx-heart-circle",
                              time: "Mid",
                            },
                            {
                              label: "LMWH",
                              value: "40 mg",
                              given: dialysisOrder.lmwh_used,
                              icon: "bx-shield",
                              time: "Start",
                            },
                            {
                              label: "Iron",
                              value: "100 mg",
                              given: dialysisOrder.iron_given,
                              icon: "bx-atom",
                              time: "End",
                            },
                          ].map((med, idx) => (
                            <div className="col-md-3" key={idx}>
                              <div
                                className={`border rounded-3 p-3 ${
                                  med.given
                                    ? "border-success"
                                    : "border-secondary"
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
                                    {med.given ? `✓ ${med.time}` : "Not Given"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      {/* Quick Actions Card */}
                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{ borderRadius: "12px" }}
                      >
                        <div className="card-body">
                          <h6 className="fw-bold text-gray-800 mb-3 border-bottom pb-2">
                            <i className="bx bx-rocket me-2 text-primary"></i>
                            Quick Actions
                          </h6>

                          <div className="d-grid gap-2 mb-4">
                            <button className="btn btn-primary btn-sm d-flex align-items-center justify-content-center py-2">
                              <i className="bx bx-edit me-2"></i>
                              Edit Session Record
                            </button>
                            <button className="btn btn-success btn-sm d-flex align-items-center justify-content-center py-2">
                              <i className="bx bx-printer me-2"></i>
                              Print Full Report
                            </button>
                            <button className="btn btn-info btn-sm d-flex align-items-center justify-content-center py-2">
                              <i className="bx bx-download me-2"></i>
                              Export to PDF
                            </button>
                            <button className="btn btn-warning btn-sm d-flex align-items-center justify-content-center py-2">
                              <i className="bx bx-transfer me-2"></i>
                              Transfer Patient
                            </button>
                            <button className="btn btn-danger btn-sm d-flex align-items-center justify-content-center py-2">
                              <i className="bx bx-x-circle me-2"></i>
                              Cancel Session
                            </button>
                          </div>

                          {/* Session Timing */}
                          <div className="border-top pt-3">
                            <h6 className="fw-bold text-gray-700 mb-2 small">
                              Session Timing
                            </h6>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Start:</span>
                              <span className="fw-medium">
                                {formatDate(
                                  dialysisSession.start_time,
                                  "HH:mm"
                                )}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">End:</span>
                              <span className="fw-medium">
                                {formatDate(dialysisSession.end_time, "HH:mm")}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">Duration:</span>
                              <span className="fw-medium">
                                {dialysisOrder.hours_of_dialysis || 4} hours
                              </span>
                            </div>
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
                                Removed
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
                              >
                                <td className="ps-4 py-3">
                                  <div className="d-flex align-items-center">
                                    <div className="me-2">
                                      <div
                                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                        }}
                                      >
                                        <span className="fw-bold">
                                          {record.time}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="fw-medium">
                                        Hour {idx + 1}
                                      </div>
                                      <div className="text-muted small">
                                        Monitoring
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
                                <td className="text-center py-3">
                                  <code className="bg-light px-2 py-1 rounded">
                                    {record.total_removed_ml || 0} mL
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

                  <div className="row">
                    <div className="col-md-8">
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
                                <div className="mx-4">
                                  <div className="text-muted small">
                                    Final Weight
                                  </div>
                                  <div className="fw-bold fs-4">
                                    {postDialysis.weight} kg
                                  </div>
                                </div>
                                <i className="bx bx-right-arrow-alt text-muted fs-2"></i>
                                <div className="ms-4">
                                  <div className="text-muted small">
                                    Net Loss
                                  </div>
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

                    <div className="col-md-4">
                      {/* Post-Dialysis Quick Actions */}
                      <div
                        className="card border-0 shadow-sm"
                        style={{ borderRadius: "12px" }}
                      >
                        <div className="card-body">
                          <h6 className="fw-bold text-gray-800 mb-3 border-bottom pb-2">
                            <i className="bx bx-check-circle me-2 text-success"></i>
                            Session Completion
                          </h6>

                          <div className="mb-3">
                            <div className="d-flex align-items-center mb-3">
                              <div className="me-3">
                                <div
                                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <i className="bx bx-check fs-4"></i>
                                </div>
                              </div>
                              <div>
                                <div className="fw-medium">
                                  Session Completed
                                </div>
                                <div className="text-muted small">
                                  All parameters stable
                                </div>
                              </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                              <div className="me-3">
                                <div
                                  className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <i className="bx bx-bell fs-4"></i>
                                </div>
                              </div>
                              <div>
                                <div className="fw-medium">
                                  Follow-up Required
                                </div>
                                <div className="text-muted small">
                                  Next session: 48 hours
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="d-grid gap-2">
                            <button className="btn btn-success btn-sm">
                              <i className="bx bx-check-double me-2"></i>
                              Mark as Complete
                            </button>
                            <button className="btn btn-outline-primary btn-sm">
                              <i className="bx bx-calendar me-2"></i>
                              Schedule Follow-up
                            </button>
                            <button className="btn btn-outline-secondary btn-sm">
                              <i className="bx bx-notification me-2"></i>
                              Notify Team
                            </button>
                          </div>
                        </div>
                      </div>
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
        .btn-link.active {
          background-color: rgba(99, 102, 241, 0.05);
        }

        .btn-link:hover {
          background-color: rgba(99, 102, 241, 0.05);
        }

        .table-hover tbody tr:hover {
          background-color: rgba(59, 130, 246, 0.05) !important;
        }

        .bg-light-subtle {
          background-color: #f8f9fa;
        }

        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};
