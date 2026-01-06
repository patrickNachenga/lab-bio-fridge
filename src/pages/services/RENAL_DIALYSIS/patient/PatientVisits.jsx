import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "animate.css";
import { formatDate } from "../../../../helpers/DateFormater";
import patientsData from "./patientsData.json";
import DialysisModal from "./DialysisModal";
import BreadCumb from "../../../../layouts/BreadCumb";

export const PatientVisitsPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [visitTypeFilter, setVisitTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("most-recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const selectedPatient = patientsData.patients.find(
      (p) => p.id === parseInt(patientId)
    );
    if (selectedPatient) {
      setPatient(selectedPatient);
    }
  }, [patientId]);

  if (!patient) {
    return (
      <div className="container-fluid py-4">
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "12px" }}
        >
          <div className="card-body text-center py-5">
            <i className="bx bx-user-x fs-1 text-muted mb-3"></i>
            <h5 className="fw-bold text-gray-800 mb-2">
              Patient Record Not Found
            </h5>
            <p className="text-muted small mb-3">
              The requested patient record could not be retrieved.
            </p>
            <button
              className="btn btn-primary btn-sm px-3"
              onClick={() => navigate("/renal-dialysis/patients")}
            >
              <i className="bx bx-arrow-back me-1"></i>Return to Patients
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter visits
  const filteredVisits = patient.visits.filter((visit) => {
    if (filterStatus === "all") return true;
    return filterStatus === "discharged" ? visit.discharged : !visit.discharged;
  });

  // Get active visit (only one should exist)
  const activeVisit = patient.visits.find((v) => !v.discharged);
  const dischargedVisits = patient.visits.filter((v) => v.discharged);

  // Pagination
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisits = filteredVisits.slice(indexOfFirstItem, indexOfLastItem);

  const calculateAge = (dateOfBirth) => {
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

  const getGenderIcon = (gender) => {
    return gender && gender.toLowerCase() === "m"
      ? "bx-male-sign"
      : "bx-female-sign";
  };

  const handleViewDetails = (visit) => {
    sessionStorage.setItem("dialysisVisitData", JSON.stringify(visit));
    sessionStorage.setItem("dialysisPatientData", JSON.stringify(patient));
    navigate(`/renal-dialysis/visit/${visit.id}`);
  };

  const toggleVisitExpansion = (visitId) => {
    setExpandedVisit(expandedVisit === visitId ? null : visitId);
  };

  const getStatusColor = (discharged) => {
    return discharged ? "#10b981" : "#f59e0b";
  };

  const getVisitTypeBadge = (visitType) => {
    const types = {
      routine: { bg: "bg-blue-50", text: "text-blue-700", icon: "bx-refresh" },
      emergency: {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: "bx-alarm-exclamation",
      },
      followup: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        icon: "bx-calendar-check",
      },
    };
    return (
      types[visitType?.toLowerCase()] || {
        bg: "bg-gray-50",
        text: "text-gray-700",
        icon: "bx-calendar",
      }
    );
  };

  return (
    <div className="container-fluid py-3" style={{ maxWidth: "1500px" }}>
      <BreadCumb pageList={["Renal Dialysis", "Patient Details"]} />

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              <div>
                <h4 className="fw-bold text-gray-800 mb-1">
                  Dialysis Visits Management
                </h4>
                <div className="d-flex align-items-center">
                  <span className="badge bg-light text-dark me-2">
                    <i className="bx bx-id-card me-1"></i>
                    {patient.hospital_reg_no}
                  </span>
                  <span className="text-muted">
                    Patient:{" "}
                    <strong>
                      {patient.first_name} {patient.last_name}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#dialysisModal"
              className="btn btn-primary"
            >
              <i className="bx bx-plus me-1"></i>New Session
            </button>
          </div>
        </div>
      </div>

      {/* Patient Profile & Stats - Medium Size */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "12px" }}
          >
            <div className="card-body p-4">
              <div className="row align-items-center">
                {/* Patient Profile */}
                <div className="col-md-4 border-end">
                  <div className="d-flex align-items-start mb-3">
                    <div className="position-relative me-4">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "64px",
                          height: "64px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          fontSize: "22px",
                          fontWeight: "600",
                        }}
                      >
                        {patient.first_name?.charAt(0)}
                        {patient.last_name?.charAt(0)}
                      </div>
                      <div
                        className="position-absolute bottom-0 end-0 rounded-circle border border-3 border-white"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor:
                            patient.sex?.toLowerCase() === "m"
                              ? "#3b82f6"
                              : "#ec4899",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className={`bx ${getGenderIcon(
                            patient.sex
                          )} text-white fs-6`}
                        ></i>
                      </div>
                    </div>
                    <div>
                      <h5 className="fw-bold text-gray-800 mb-1">
                        {patient.first_name} {patient.last_name}
                      </h5>
                      <p className="text-muted mb-2">
                        <i className="bx bx-cake me-1"></i>
                        {calculateAge(patient.date_of_birth)} years •{" "}
                        {patient.phone_number}
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-light text-dark">
                          <i className="bx bx-phone me-1"></i>
                          {patient.phone_number}
                        </span>
                        <span className="badge bg-light text-dark">
                          <i className="bx bx-group me-1"></i>
                          {patient.next_of_kin_type || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-top pt-3">
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-2">
                          <div className="small text-muted">Next of Kin</div>
                          <div className="fw-semibold">
                            {patient.next_of_kin}
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-2">
                          <div className="small text-muted">
                            Emergency Contact
                          </div>
                          <div className="fw-semibold">
                            {patient.next_of_kin_phone || "Not available"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="col-md-8">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body text-center py-3">
                          <div className="d-flex justify-content-center mb-2">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                              <i className="bx bx-calendar-check text-primary fs-4"></i>
                            </div>
                          </div>
                          <h3 className="fw-bold text-gray-800 mb-1">
                            {patient.visits.length}
                          </h3>
                          <p className="text-muted mb-0">Total Sessions</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body text-center py-3">
                          <div className="d-flex justify-content-center mb-2">
                            <div className="bg-success bg-opacity-10 rounded-circle p-2">
                              <i className="bx bx-check-circle text-success fs-4"></i>
                            </div>
                          </div>
                          <h3 className="fw-bold text-gray-800 mb-1">
                            {dischargedVisits.length}
                          </h3>
                          <p className="text-muted mb-0">Completed</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="card border-0 bg-light h-100">
                        <div className="card-body text-center py-3">
                          <div className="d-flex justify-content-center mb-2">
                            <div className="bg-info bg-opacity-10 rounded-circle p-2">
                              <i className="bx bx-timer text-info fs-4"></i>
                            </div>
                          </div>
                          <h3 className="fw-bold text-gray-800 mb-1">156h</h3>
                          <p className="text-muted mb-0">Total Time</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Below - Fills the space */}
                    <div className="col-12 mt-2">
                      <div
                        className="card border-0"
                        style={{ backgroundColor: "#f8fafc" }}
                      >
                        <div className="card-body py-3">
                          <h6 className="fw-bold text-gray-800 mb-3">
                            <i className="bx bx-stats me-2"></i>
                            Session Analytics
                          </h6>
                          <div className="row text-center">
                            <div className="col-md-4">
                              <div className="mb-2">
                                <div className="small text-muted">
                                  Avg Duration
                                </div>
                                <div className="fw-bold text-gray-800 fs-5">
                                  4h 18m
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-2">
                                <div className="small text-muted">
                                  Success Rate
                                </div>
                                <div className="fw-bold text-success fs-5">
                                  98.2%
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="mb-2">
                                <div className="small text-muted">
                                  Monthly Avg
                                </div>
                                <div className="fw-bold text-gray-800 fs-5">
                                  8 sessions
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Session Alert */}
      {activeVisit && (
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="alert alert-warning border-0 shadow-sm d-flex align-items-center justify-content-between"
              style={{ borderRadius: "12px" }}
            >
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-25 rounded-circle p-2 me-3">
                  <i className="bx bx-pulse fs-4 text-warning"></i>
                </div>
                <div>
                  <h6 className="fw-bold text-gray-800 mb-1">
                    Active Session in Progress
                  </h6>
                  <p className="mb-0 small">
                    <span className="me-3">
                      <i className="bx bx-calendar me-1"></i>
                      {formatDate(activeVisit.visit_date, "DD MMM YYYY, HH:mm")}
                    </span>
                    <span className="me-3">
                      <i className="bx bx-map me-1"></i>
                      {activeVisit.ward}
                    </span>
                    <span>
                      <i className="bx bx-user me-1"></i>
                      Dr. {activeVisit.attending_doctor}
                    </span>
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleViewDetails(activeVisit)}
                >
                  <i className="bx bx-show me-1"></i>View Details
                </button>
                <button className="btn btn-outline-warning btn-sm">
                  <i className="bx bx-edit me-1"></i>Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Table - Full Width */}
      <div className="row">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "12px" }}
          >
            <div className="card-header bg-white border-0 py-3 px-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h5 className="fw-bold text-gray-800 mb-1">
                    Session History
                  </h5>
                  <p className="text-muted small mb-0">
                    Showing {currentVisits.length} of {filteredVisits.length}{" "}
                    sessions
                  </p>
                </div>

                {/* Table Filters & Search */}
                <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
                  {/* Search */}
                  <div
                    className="input-group input-group-sm"
                    style={{ width: "200px" }}
                  >
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bx bx-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-sm border-start-0"
                      placeholder="Search sessions..."
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bx bx-filter-alt me-1"></i>
                      Status:{" "}
                      {filterStatus === "all"
                        ? "All"
                        : filterStatus === "active"
                        ? "Active"
                        : "Completed"}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className={`dropdown-item ${
                            filterStatus === "all" ? "active" : ""
                          }`}
                          onClick={() => setFilterStatus("all")}
                        >
                          <i className="bx bx-list-ul me-2"></i>
                          All Sessions
                          <span className="badge bg-light text-dark float-end">
                            {patient.visits.length}
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          className={`dropdown-item ${
                            filterStatus === "active" ? "active" : ""
                          }`}
                          onClick={() => setFilterStatus("active")}
                        >
                          <i className="bx bx-pulse me-2"></i>
                          Active Only
                          <span className="badge bg-light text-dark float-end">
                            {activeVisit ? 1 : 0}
                          </span>
                        </button>
                      </li>
                      <li>
                        <button
                          className={`dropdown-item ${
                            filterStatus === "discharged" ? "active" : ""
                          }`}
                          onClick={() => setFilterStatus("discharged")}
                        >
                          <i className="bx bx-check-circle me-2"></i>
                          Completed Only
                          <span className="badge bg-light text-dark float-end">
                            {dischargedVisits.length}
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Sort By */}
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bx bx-sort me-1"></i>
                      Sort
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className={`dropdown-item ${
                            sortBy === "most-recent" ? "active" : ""
                          }`}
                          onClick={() => setSortBy("most-recent")}
                        >
                          Most Recent First
                        </button>
                      </li>
                      <li>
                        <button
                          className={`dropdown-item ${
                            sortBy === "oldest" ? "active" : ""
                          }`}
                          onClick={() => setSortBy("oldest")}
                        >
                          Oldest First
                        </button>
                      </li>
                      <li>
                        <button
                          className={`dropdown-item ${
                            sortBy === "duration" ? "active" : ""
                          }`}
                          onClick={() => setSortBy("duration")}
                        >
                          By Duration
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Export/Print */}
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bx bx-printer"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4" style={{ width: "25%" }}>
                        <i className="bx bx-calendar me-1"></i>
                        Date & Time
                      </th>
                      <th style={{ width: "30%" }}>
                        <i className="bx bx-detail me-1"></i>
                        Session Details
                      </th>
                      <th style={{ width: "20%" }}>
                        <i className="bx bx-plus-medical me-1"></i>
                        Medical Info
                      </th>
                      <th style={{ width: "15%" }}>
                        <i className="bx bx-info-circle me-1"></i>
                        Status
                      </th>
                      <th className="text-end pe-4" style={{ width: "10%" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVisits.length > 0 ? (
                      currentVisits.map((visit) => {
                        const statusColor = getStatusColor(visit.discharged);
                        const typeBadge = getVisitTypeBadge(visit.visit_type);

                        return (
                          <React.Fragment key={visit.id}>
                            <tr
                              className="cursor-pointer"
                              onClick={() => toggleVisitExpansion(visit.id)}
                              style={{
                                borderLeft: `3px solid ${statusColor}`,
                              }}
                            >
                              <td className="ps-4">
                                <div className="d-flex align-items-center">
                                  <div className="me-3">
                                    <div
                                      className={`rounded p-2 ${typeBadge.bg}`}
                                    >
                                      <i
                                        className={`bx ${typeBadge.icon} fs-5 ${typeBadge.text}`}
                                      ></i>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="fw-semibold text-gray-800">
                                      {formatDate(
                                        visit.visit_date,
                                        "DD MMM YYYY"
                                      )}
                                    </div>
                                    <div className="small text-muted">
                                      {formatDate(visit.visit_date, "HH:mm")}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="mb-1">
                                  <span className="badge bg-light text-dark me-2">
                                    <i className="bx bx-map me-1"></i>
                                    {visit.ward}
                                  </span>
                                  <span
                                    className={`badge ${typeBadge.bg} ${typeBadge.text}`}
                                  >
                                    <i
                                      className={`bx ${typeBadge.icon} me-1`}
                                    ></i>
                                    {visit.visit_type || "Routine"}
                                  </span>
                                </div>
                                <div className="small">
                                  <i className="bx bx-user me-1"></i>
                                  {visit.attending_doctor}
                                </div>
                              </td>
                              <td>
                                <div className="mb-1">
                                  <div className="small text-muted">
                                    Diagnosis
                                  </div>
                                  <div
                                    className="fw-semibold text-truncate"
                                    style={{ maxWidth: "200px" }}
                                  >
                                    {visit.diagnosis}
                                  </div>
                                </div>
                                <div className="small text-muted">
                                  <i className="bx bx-time me-1"></i>
                                  4h 15m • 2.1L
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <span
                                    className="dot me-2"
                                    style={{
                                      width: "8px",
                                      height: "8px",
                                      borderRadius: "50%",
                                      backgroundColor: statusColor,
                                    }}
                                  ></span>
                                  <span className="fw-medium">
                                    {visit.discharged ? "Completed" : "Active"}
                                  </span>
                                </div>
                              </td>
                              <td className="text-end pe-4">
                                <div
                                  className="btn-group btn-group-sm"
                                  role="group"
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetails(visit);
                                    }}
                                    title="View Full Details"
                                  >
                                    <i className="bx bx-show"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-success"
                                    title="Edit Session"
                                  >
                                    <i className="bx bx-edit"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Expanded Details Row */}
                            {expandedVisit === visit.id && (
                              <tr className="bg-light">
                                <td colSpan="5" className="ps-5 pe-4 py-3">
                                  <div className="row">
                                    <div className="col-md-4">
                                      <div className="mb-2">
                                        <strong className="text-muted small">
                                          Additional Notes:
                                        </strong>
                                        <div className="mt-1">
                                          {visit.notes ||
                                            "No additional notes recorded for this session."}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-2">
                                        <strong className="text-muted small">
                                          Treatment Details:
                                        </strong>
                                        <div className="mt-1">
                                          Hemodialysis • Duration: 4 hours •
                                          Fluid Removal: 2.1L
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-4">
                                      <div className="mb-2">
                                        <strong className="text-muted small">
                                          Vitals:
                                        </strong>
                                        <div className="mt-1">
                                          BP: 120/80 mmHg • Weight: 68.5kg •
                                          Temp: 36.8°C
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-5">
                          <div className="py-4">
                            <i className="bx bx-inbox fs-1 text-muted mb-3 d-block"></i>
                            <h6 className="text-gray-600 mb-2">
                              No sessions found
                            </h6>
                            <p className="text-muted small mb-3">
                              {filterStatus === "active"
                                ? "No active sessions currently running."
                                : "No sessions match your current filters."}
                            </p>
                            <button
                              type="button"
                              data-bs-toggle="modal"
                              data-bs-target="#dialysisModal"
                              className="btn btn-primary btn-sm"
                            >
                              <i className="bx bx-plus me-1"></i>Create New
                              Session
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="card-footer bg-white border-0 py-3 px-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <i className="bx bx-chevron-left"></i> Previous
                      </button>
                      {Array.from(
                        { length: Math.min(3, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage === 1) {
                            pageNum = i + 1;
                          } else if (currentPage === totalPages) {
                            pageNum = totalPages - 2 + i;
                          } else {
                            pageNum = currentPage - 1 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              className={`btn btn-sm ${
                                currentPage === pageNum
                                  ? "btn-primary"
                                  : "btn-outline-secondary"
                              }`}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next <i className="bx bx-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <DialysisModal onClose={() => {}} />

      <style jsx>{`
        .card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(59, 130, 246, 0.05) !important;
        }

        .cursor-pointer {
          cursor: pointer;
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

        .text-truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .alert {
          border-radius: 12px !important;
        }
      `}</style>
    </div>
  );
};
