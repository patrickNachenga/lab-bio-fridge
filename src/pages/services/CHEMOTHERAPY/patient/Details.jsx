import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "../../../../helpers/DateFormater";
import patientsData from "./patientsData.json";
import BreadCumb from "../../../../layouts/BreadCumb";

export const ChemotherapyDetailsPage = () => {
  const { visitId } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const foundPatient = JSON.parse(sessionStorage.getItem("selectedPatient"));
    const foundVisit = patientsData.patients
      .flatMap((p) => p.visits)
      .find((v) => v.id === parseInt(visitId));

    setPatient(foundPatient);
    setVisit(foundVisit);
    setLoading(false);
  }, [visitId]);

  if (loading) {
    return (
      <>
        <BreadCumb pageList={["Chemotherapy", "Patient", "Visit Details"]} />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "500px" }}
        >
          <div className="text-center">
            <div className="position-relative mb-4">
              <i className="bx bx-loader-circle fs-1 text-primary animate__animated animate__spin"></i>
            </div>
            <h6 className="text-gray-600 mb-2">Loading Treatment Record</h6>
            <p className="text-muted small">
              Retrieving chemotherapy session details...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!visit || !patient) {
    return (
      <>
        <BreadCumb pageList={["Chemotherapy", "Patient", "Visit Details"]} />
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "16px" }}
        >
          <div className="card-body text-center py-5">
            <i className="bx bx-error fs-1 text-danger mb-3 d-block"></i>
            <h4 className="text-gray-800 mb-3">
              Treatment Record Not Available
            </h4>
            <p className="text-muted mb-4">
              The chemotherapy session details could not be retrieved.
            </p>
            <button
              className="btn btn-primary px-4"
              onClick={() => navigate("/chemotherapy/patients")}
            >
              <i className="bx bx-arrow-back me-2"></i>Back to Patients
            </button>
          </div>
        </div>
      </>
    );
  }

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

  const getStatusBadge = (status) => {
    return status === "ACTIVE"
      ? { class: "bg-success-subtle text-success", text: "Active" }
      : { class: "bg-secondary-subtle text-secondary", text: "Completed" };
  };

  return (
    <>
      <BreadCumb pageList={["Chemotherapy", "Patient", "Visit Details"]} />

      <div className="container-fluid py-4">
        {/* Header Section */}
        <div className="row align-items-center mb-4">
          <div className="col-lg-8">
            <div className="d-flex align-items-center mb-3">
              <div
                className="p-3 rounded-circle me-3"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                }}
              >
                <i className="bx bx-injection text-white fs-2"></i>
              </div>
              <div>
                <h1 className="h3 mb-1 fw-bold">
                  Chemotherapy Treatment Details
                </h1>
                <p className="text-muted mb-0">
                  {patient.first_name} {patient.last_name} (
                  {patient.hospital_reg_no})
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 text-lg-end">
            <span
              className={`badge fs-6 ${getStatusBadge(visit.status).class}`}
            >
              {getStatusBadge(visit.status).text}
            </span>
          </div>
        </div>

        {/* Patient & Visit Info Cards */}
        <div className="row g-3 mb-4">
          <div className="col-lg-3 col-md-6">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "12px",
                borderLeft: "4px solid #6366f1",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted small fw-semibold mb-1">Age</h6>
                    <h5 className="mb-0 fw-bold">
                      {calculateAge(patient.date_of_birth)} years
                    </h5>
                    <small className="text-muted">
                      DOB: {formatDate(patient.date_of_birth, "DD MMM YYYY")}
                    </small>
                  </div>
                  <i className="bx bx-user text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "12px",
                borderLeft: "4px solid #6366f1",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted small fw-semibold mb-1">
                      Visit Date
                    </h6>
                    <h5 className="mb-0 fw-bold">
                      {formatDate(visit.visit_date, "DD MMM YYYY")}
                    </h5>
                    <small className="text-muted">{visit.admitting_ward}</small>
                  </div>
                  <i className="bx bx-calendar text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "12px",
                borderLeft: "4px solid #6366f1",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted small fw-semibold mb-1">
                      Cancer Stage
                    </h6>
                    <h5 className="mb-0 fw-bold">{visit.cancer_stage}</h5>
                    <small className="text-muted">{visit.diagnosis}</small>
                  </div>
                  <span className="badge bg-warning-subtle text-warning">
                    {visit.cancer_stage}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "12px",
                borderLeft: "4px solid #6366f1",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-muted small fw-semibold mb-1">
                      Doctor
                    </h6>
                    <h5 className="mb-0 fw-bold small">
                      {visit.attending_doctor}
                    </h5>
                    {visit.regimen && (
                      <small className="text-muted">{visit.regimen.name}</small>
                    )}
                  </div>
                  <i className="bx bx-user-check text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "12px" }}
        >
          <div className="card-header bg-white p-0 border-0">
            <ul
              className="nav nav-tabs border-0 ps-4"
              style={{ borderBottom: "2px solid #e5e7eb" }}
            >
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "overview" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("overview")}
                  style={{
                    borderBottom:
                      activeTab === "overview" ? "3px solid #6366f1" : "none",
                    color: activeTab === "overview" ? "#6366f1" : "#6b7280",
                  }}
                >
                  <i className="bx bx-info-circle me-2"></i>Overview
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "vitals" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("vitals")}
                  style={{
                    borderBottom:
                      activeTab === "vitals" ? "3px solid #6366f1" : "none",
                    color: activeTab === "vitals" ? "#6366f1" : "#6b7280",
                  }}
                >
                  <i className="bx bx-heart me-2"></i>Vitals
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "labs" ? "active" : ""}`}
                  onClick={() => setActiveTab("labs")}
                  style={{
                    borderBottom:
                      activeTab === "labs" ? "3px solid #6366f1" : "none",
                    color: activeTab === "labs" ? "#6366f1" : "#6b7280",
                  }}
                >
                  <i className="bx bx-test-tube me-2"></i>Lab Results
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "medications" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("medications")}
                  style={{
                    borderBottom:
                      activeTab === "medications"
                        ? "3px solid #6366f1"
                        : "none",
                    color: activeTab === "medications" ? "#6366f1" : "#6b7280",
                  }}
                >
                  <i className="bx bx-pill me-2"></i>Medications
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "administration" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("administration")}
                  style={{
                    borderBottom:
                      activeTab === "administration"
                        ? "3px solid #6366f1"
                        : "none",
                    color:
                      activeTab === "administration" ? "#6366f1" : "#6b7280",
                  }}
                >
                  <i className="bx bx-injection me-2"></i>Administration
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "cycle" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("cycle")}
                  style={{
                    borderBottom:
                      activeTab === "cycle" ? "3px solid #6366f1" : "none",
                    color: activeTab === "cycle" ? "#6366f1" : "#6b7280",
                  }}
                >
                  <i className="bx bx-refresh me-2"></i>Cycle Info
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-4">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h5 className="mb-3 fw-bold">
                  Diagnosis & Regimen Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div
                      className="p-3 rounded"
                      style={{ backgroundColor: "#f9fafb" }}
                    >
                      <p className="mb-2 small text-muted">Diagnosis</p>
                      <h6 className="fw-bold mb-2">{visit.diagnosis}</h6>
                      <span className="badge bg-info-subtle text-info">
                        {visit.cancer_stage}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="p-3 rounded"
                      style={{ backgroundColor: "#f9fafb" }}
                    >
                      <p className="mb-2 small text-muted">Start Date</p>
                      <h6 className="fw-bold mb-2">
                        {formatDate(visit.start_date, "DD MMM YYYY")}
                      </h6>
                      <small className="text-muted">
                        {visit.admitting_ward}
                      </small>
                    </div>
                  </div>

                  {visit.regimen && (
                    <>
                      <div className="col-md-6">
                        <div
                          className="p-3 rounded"
                          style={{ backgroundColor: "#f9fafb" }}
                        >
                          <p className="mb-2 small text-muted">Regimen Name</p>
                          <h6 className="fw-bold">{visit.regimen.name}</h6>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div
                          className="p-3 rounded"
                          style={{ backgroundColor: "#f9fafb" }}
                        >
                          <p className="mb-2 small text-muted">
                            Cycle Interval
                          </p>
                          <h6 className="fw-bold">
                            {visit.regimen.cycle_interval_weeks} weeks
                          </h6>
                        </div>
                      </div>
                      <div className="col-12">
                        <div
                          className="p-3 rounded border"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <p className="mb-2 small text-muted">Description</p>
                          <p className="mb-0">{visit.regimen.description}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Vitals Tab */}
            {activeTab === "vitals" && (
              <div>
                <h5 className="mb-3 fw-bold">Treatment Vitals</h5>
                <div className="row g-3">
                  {visit.vitals_pre && (
                    <div className="col-md-6">
                      <div
                        className="border rounded p-3"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        <h6 className="fw-bold mb-3 text-primary">
                          <i className="bx bx-arrow-to-right me-2"></i>
                          Pre-Treatment Vitals
                        </h6>
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">
                              Temperature
                            </small>
                            <p className="fw-bold mb-0">
                              {visit.vitals_pre.temperature_c}°C
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">
                              Pulse
                            </small>
                            <p className="fw-bold mb-0">
                              {visit.vitals_pre.pulse} bpm
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">
                              Blood Pressure
                            </small>
                            <p className="fw-bold mb-0">
                              {visit.vitals_pre.blood_pressure}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">
                              Respiratory Rate
                            </small>
                            <p className="fw-bold mb-0">
                              {visit.vitals_pre.respiratory_rate} /min
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {visit.vitals_post && (
                    <div className="col-md-6">
                      <div
                        className="border rounded p-3"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        <h6 className="fw-bold mb-3 text-success">
                          <i className="bx bx-arrow-to-left me-2"></i>
                          Post-Treatment Vitals
                        </h6>
                        <div className="row g-2">
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">
                              Temperature
                            </small>
                            <p className="fw-bold mb-0">
                              {visit.vitals_post.temperature_c}°C
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">
                              Pulse
                            </small>
                            <p className="fw-bold mb-0">
                              {visit.vitals_post.pulse} bpm
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">
                              Blood Pressure
                            </small>
                            <p className="fw-bold mb-0">
                              {visit.vitals_post.blood_pressure}
                            </p>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block mb-1">
                              Respiratory Rate
                            </small>
                            <p className="fw-bold mb-0">
                              {visit.vitals_post.respiratory_rate} /min
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lab Results Tab */}
            {activeTab === "labs" && (
              <div>
                <h5 className="mb-3 fw-bold">Laboratory Results</h5>
                {visit.lab_results && visit.lab_results.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: "#f9fafb" }}>
                        <tr>
                          <th>Test Name</th>
                          <th>Result</th>
                          <th>Unit</th>
                          <th>Normal Range</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visit.lab_results.map((lab, idx) => (
                          <tr key={idx}>
                            <td className="fw-medium">{lab.test_name}</td>
                            <td className="fw-bold">{lab.value}</td>
                            <td>{lab.unit}</td>
                            <td>
                              <small className="text-muted">
                                {lab.normal_range}
                              </small>
                            </td>
                            <td>{formatDate(lab.test_date, "DD MMM YYYY")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bx bx-test-tube fs-3 text-muted mb-2 d-block"></i>
                    <p className="text-muted">No lab results available</p>
                  </div>
                )}
              </div>
            )}

            {/* Medications Tab */}
            {activeTab === "medications" && (
              <div>
                <h5 className="mb-3 fw-bold">Chemotherapy Medications</h5>
                {visit.medications && visit.medications.length > 0 ? (
                  <div className="row g-3">
                    {visit.medications.map((med, idx) => (
                      <div key={idx} className="col-md-6">
                        <div
                          className="border rounded p-3"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <h6 className="fw-bold text-primary mb-2">
                            {med.drug}
                          </h6>
                          <div className="row g-2 small">
                            <div className="col-6">
                              <p className="text-muted mb-1">Dose/m²</p>
                              <p className="fw-bold">{med.dose_per_m2} mg/m²</p>
                            </div>
                            <div className="col-6">
                              <p className="text-muted mb-1">Calculated Dose</p>
                              <p className="fw-bold">
                                {med.calculated_dose} mg
                              </p>
                            </div>
                            <div className="col-6">
                              <p className="text-muted mb-1">Patient Dose</p>
                              <p className="fw-bold">{med.patient_dose} mg</p>
                            </div>
                            <div className="col-6">
                              <p className="text-muted mb-1">Schedule</p>
                              <span className="badge bg-info-subtle text-info">
                                {med.days}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bx bx-pill fs-3 text-muted mb-2 d-block"></i>
                    <p className="text-muted">No medications recorded</p>
                  </div>
                )}
              </div>
            )}

            {/* Administration Tab */}
            {activeTab === "administration" && (
              <div>
                <h5 className="mb-3 fw-bold">Drug Administration Records</h5>
                {visit.administration && visit.administration.length > 0 ? (
                  <div className="row g-3">
                    {visit.administration.map((admin, idx) => (
                      <div key={idx} className="col-12">
                        <div
                          className="border rounded p-3"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <h6 className="fw-bold text-primary mb-3">
                            <i className="bx bx-injection me-2"></i>
                            {admin.drug}
                          </h6>
                          <div className="row g-3 small">
                            <div className="col-md-6">
                              <p className="text-muted mb-1">Route</p>
                              <p className="fw-bold">{admin.route}</p>
                            </div>
                            <div className="col-md-6">
                              <p className="text-muted mb-1">Diluent</p>
                              <p className="fw-bold">{admin.diluent}</p>
                            </div>
                            <div className="col-md-6">
                              <p className="text-muted mb-1">Rate</p>
                              <p className="fw-bold">{admin.rate}</p>
                            </div>
                            <div className="col-md-6">
                              <p className="text-muted mb-1">Final Volume</p>
                              <p className="fw-bold">{admin.final_volume}</p>
                            </div>
                            <div className="col-md-6">
                              <p className="text-muted mb-1">Administered By</p>
                              <p className="fw-bold">{admin.administered_by}</p>
                            </div>
                            <div className="col-md-6">
                              <p className="text-muted mb-1">Checked By</p>
                              <p className="fw-bold">{admin.checked_by}</p>
                            </div>
                            <div className="col-12">
                              <p className="text-muted mb-1">Date/Time</p>
                              <p className="fw-bold">
                                {formatDate(
                                  admin.administration_date,
                                  "DD MMM YYYY HH:mm"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bx bx-error fs-3 text-muted mb-2 d-block"></i>
                    <p className="text-muted">No administration records</p>
                  </div>
                )}
              </div>
            )}

            {/* Cycle Info Tab */}
            {activeTab === "cycle" && (
              <div>
                <h5 className="mb-3 fw-bold">Treatment Cycle Information</h5>
                {visit.cycle ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{ backgroundColor: "#f9fafb" }}
                      >
                        <p className="mb-2 small text-muted">Cycle Number</p>
                        <h5 className="fw-bold">
                          Cycle {visit.cycle.cycle_number}
                        </h5>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{ backgroundColor: "#f9fafb" }}
                      >
                        <p className="mb-2 small text-muted">Planned Date</p>
                        <h5 className="fw-bold">
                          {formatDate(visit.cycle.planned_date, "DD MMM YYYY")}
                        </h5>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{ backgroundColor: "#f9fafb" }}
                      >
                        <p className="mb-2 small text-muted">Actual Date</p>
                        <h5 className="fw-bold">
                          {formatDate(visit.cycle.actual_date, "DD MMM YYYY")}
                        </h5>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="p-3 rounded"
                        style={{ backgroundColor: "#f9fafb" }}
                      >
                        <p className="mb-2 small text-muted">
                          Weight Adjustment
                        </p>
                        <h5 className="fw-bold">
                          {visit.cycle.weight_adjustment ? "Yes" : "No"}
                        </h5>
                      </div>
                    </div>
                    {visit.cycle.percentage_adjustment && (
                      <div className="col-md-6">
                        <div
                          className="p-3 rounded"
                          style={{ backgroundColor: "#f9fafb" }}
                        >
                          <p className="mb-2 small text-muted">
                            Percentage Adjustment
                          </p>
                          <h5 className="fw-bold">
                            {visit.cycle.percentage_adjustment}%
                          </h5>
                        </div>
                      </div>
                    )}
                    <div className="col-12">
                      <div
                        className="p-3 rounded"
                        style={{ backgroundColor: "#f9fafb" }}
                      >
                        <p className="mb-2 small text-muted">Prescribed By</p>
                        <h5 className="fw-bold">{visit.cycle.prescribed_by}</h5>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bx bx-refresh fs-3 text-muted mb-2 d-block"></i>
                    <p className="text-muted">No cycle information available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-link {
          border: none;
          color: #6b7280;
          padding: 1rem 1.5rem;
          margin-bottom: -2px;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: #6366f1;
          background-color: #f9fafb;
        }

        .nav-link.active {
          color: #6366f1;
          background: none;
          border: none;
        }

        .badge {
          padding: 0.4rem 0.8rem;
          font-weight: 500;
        }
      `}</style>
    </>
  );
};
