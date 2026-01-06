import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "animate.css";
import { formatDate } from "../../../../helpers/DateFormater";
import patientsData from "./patientsData.json";
import PatientRegistrationModal from "./PatientRegistrationModal";
import BreadCumb from "../../../../layouts/BreadCumb";

export const PatientListPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(patientsData.patients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const itemsPerPage = viewMode === "grid" ? 9 : 10;

  // Calculate statistics
  const activePatients = patients.filter((p) => p.status === "active").length;
  const totalVisits = patients.reduce((sum, p) => sum + p.visits.length, 0);
  const avgVisits = (totalVisits / patients.length).toFixed(1);
  const recentPatients = patients.filter(
    (p) =>
      new Date(p.registration_date) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.hospital_reg_no
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.phone_number.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" ? true : filterStatus === patient.status;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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

  const handleViewVisits = (patient) => {
    sessionStorage.setItem("selectedPatient", JSON.stringify(patient));
    navigate(`/renal-dialysis/patient-visits/${patient.id}`);
  };

  const handleAddPatient = (newPatient) => {
    const maxId = Math.max(...patients.map((p) => p.id), 0);
    const patientWithId = {
      ...newPatient,
      id: maxId + 1,
      registration_date: new Date().toISOString().split("T")[0],
      visits: [],
    };
    setPatients([...patients, patientWithId]);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="container-fluid py-4 px-3" style={{ maxWidth: "1600px" }}>
        {/* Header Section */}
        <div className="row align-items-center mb-4">
          <div className="col-md-8">
            <div className="d-flex align-items-center mb-2">
              <div className="position-relative me-3">
                <div
                  className="p-3 rounded-circle"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  }}
                >
                  <i className="bx bx-droplet fs-3 text-white"></i>
                </div>
                <div
                  className="position-absolute top-0 end-0 bg-success rounded-circle border border-3 border-white"
                  style={{ width: "12px", height: "12px" }}
                ></div>
              </div>
              <div>
                <h1 className="h2 mb-1 fw-bold text-gray-800">
                  Renal Dialysis Unit
                </h1>
                <p className="text-muted mb-0">
                  <i className="bx bx-building me-1"></i>
                  Patient Management System
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex gap-2 justify-content-md-end">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#patientRegistrationModal"
                className="btn btn-primary px-4 d-flex align-items-center"
              >
                <i className="bx bx-user-plus me-2 fs-5"></i>
                Register Patient
              </button>
              <button className="btn btn-outline-secondary d-flex align-items-center">
                <i className="bx bx-download me-1"></i>
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="row g-3 mb-4">
          <div className="col-xl-3 col-md-6">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1 small fw-semibold">
                      Total Patients
                    </h6>
                    <h2 className="mb-0 fw-bold" style={{ color: "#0369a1" }}>
                      {patients.length}
                    </h2>
                    <div className="d-flex align-items-center mt-1">
                      <span className="badge bg-white text-primary small px-2 py-1">
                        <i className="bx bx-up-arrow-alt me-1"></i>+
                        {recentPatients} this month
                      </span>
                    </div>
                  </div>
                  <div
                    className="p-3 rounded-circle"
                    style={{
                      backgroundColor: "rgba(14, 165, 233, 0.15)",
                    }}
                  >
                    <i
                      className="bx bx-group fs-2"
                      style={{ color: "#0369a1" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1 small fw-semibold">
                      Active Treatment
                    </h6>
                    <h2 className="mb-0 fw-bold" style={{ color: "#166534" }}>
                      {activePatients}
                    </h2>
                    <p className="text-muted small mb-0 mt-1">
                      {((activePatients / patients.length) * 100).toFixed(0)}%
                      of total
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-circle"
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.15)",
                    }}
                  >
                    <i
                      className="bx bx-pulse fs-2"
                      style={{ color: "#166534" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1 small fw-semibold">
                      Total Sessions
                    </h6>
                    <h2 className="mb-0 fw-bold" style={{ color: "#92400e" }}>
                      {totalVisits}
                    </h2>
                    <div className="d-flex align-items-center mt-1">
                      <span className="badge bg-white text-warning small px-2 py-1">
                        Avg: {avgVisits} per patient
                      </span>
                    </div>
                  </div>
                  <div
                    className="p-3 rounded-circle"
                    style={{
                      backgroundColor: "rgba(245, 158, 11, 0.15)",
                    }}
                  >
                    <i
                      className="bx bx-timer fs-2"
                      style={{ color: "#92400e" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1 small fw-semibold">
                      Critical Status
                    </h6>
                    <h2 className="mb-0 fw-bold" style={{ color: "#9d174d" }}>
                      8
                    </h2>
                    <p className="text-muted small mb-0 mt-1">
                      Requires immediate attention
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-circle"
                    style={{
                      backgroundColor: "rgba(236, 72, 153, 0.15)",
                    }}
                  >
                    <i
                      className="bx bx-alarm-exclamation fs-2"
                      style={{ color: "#9d174d" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Bar */}
        <div
          className="card border-0 shadow-sm mb-4"
          style={{ borderRadius: "12px" }}
        >
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <div className="position-relative">
                  <i className="bx bx-search position-absolute top-50 start-3 translate-middle-y text-muted"></i>
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5"
                    placeholder="Search by name, ID, or phone number..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex justify-content-end gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small fw-semibold">View:</span>
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className={`btn btn-sm ${
                          viewMode === "grid"
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        <i className="bx bx-grid"></i>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${
                          viewMode === "table"
                            ? "btn-primary"
                            : "btn-outline-secondary"
                        }`}
                        onClick={() => setViewMode("table")}
                      >
                        <i className="bx bx-list-ul"></i>
                      </button>
                    </div>
                  </div>

                  <select
                    className="form-select form-select-sm w-auto"
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Patients</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                    <option value="critical">Critical Status</option>
                  </select>

                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bx bx-filter-alt"></i>
                    More Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patients Grid/Table View */}
        {viewMode === "grid" ? (
          <div className="row g-3 animate__animated animate__fadeIn">
            {currentPatients.length > 0 ? (
              currentPatients.map((patient) => {
                const age = calculateAge(patient.date_of_birth);
                const isCritical = patient.visits.length > 10; // Example logic

                return (
                  <div className="col-xl-4 col-lg-6" key={patient.id}>
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{
                        borderRadius: "12px",
                        borderLeft: `4px solid ${
                          isCritical
                            ? "#ef4444"
                            : patient.status === "active"
                            ? "#10b981"
                            : "#6b7280"
                        }`,
                      }}
                    >
                      <div className="card-body p-3">
                        {/* Patient Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div className="position-relative me-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  fontSize: "18px",
                                  background:
                                    patient.sex?.toLowerCase() === "m"
                                      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                                      : "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                                }}
                              >
                                {patient.first_name?.charAt(0)}
                                {patient.last_name?.charAt(0)}
                              </div>
                              {isCritical && (
                                <div className="position-absolute top-0 start-100 translate-middle">
                                  <span className="badge bg-danger rounded-circle p-1">
                                    <i className="bx bx-alarm fs-6"></i>
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h6 className="mb-0 fw-bold text-gray-800">
                                {patient.first_name} {patient.last_name}
                              </h6>
                              <div className="d-flex align-items-center gap-2 text-muted small">
                                <span>
                                  <i
                                    className={`bx ${
                                      patient.sex?.toLowerCase() === "m"
                                        ? "bx-male"
                                        : "bx-female"
                                    }`}
                                  ></i>
                                  {patient.sex}, {age} yrs
                                </span>
                                <span className="badge bg-light text-dark small">
                                  ID: {patient.hospital_reg_no}
                                </span>
                              </div>
                            </div>
                          </div>

                          <span
                            className={`badge ${
                              patient.status === "active"
                                ? "bg-success-subtle text-success"
                                : "bg-danger-subtle text-danger"
                            }`}
                          >
                            {patient.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>

                        {/* Contact & Info */}
                        <div className="mb-3">
                          <div className="row g-2 small">
                            <div className="col-6">
                              <div className="text-muted mb-1">
                                <i className="bx bx-phone me-1"></i> Contact
                              </div>
                              <div className="fw-medium">
                                {patient.phone_number}
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="text-muted mb-1">
                                <i className="bx bx-calendar me-1"></i>{" "}
                                Registered
                              </div>
                              <div className="fw-medium">
                                {formatDate(
                                  patient.registration_date,
                                  "MMM YYYY"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="bg-gray-100 rounded p-2 mb-3">
                          <div className="d-flex justify-content-between small">
                            <div className="text-center">
                              <div
                                className="fw-bold"
                                style={{ color: "#0369a1" }}
                              >
                                {patient.visits.length}
                              </div>
                              <div className="text-muted">Sessions</div>
                            </div>
                            <div className="text-center">
                              <div
                                className="fw-bold"
                                style={{ color: "#10b981" }}
                              >
                                {
                                  patient.visits.filter((v) => !v.discharged)
                                    .length
                                }
                              </div>
                              <div className="text-muted">Active</div>
                            </div>
                            <div className="text-center">
                              <div
                                className="fw-bold"
                                style={{ color: "#8b5cf6" }}
                              >
                                {patient.next_of_kin_relationship}
                              </div>
                              <div className="text-muted">Kin</div>
                            </div>
                            <div className="text-center">
                              <div
                                className="fw-bold"
                                style={{ color: "#f59e0b" }}
                              >
                                {patient.blood_group || "NA"}
                              </div>
                              <div className="text-muted">Blood</div>
                            </div>
                          </div>
                        </div>

                        {/* Next of Kin */}
                        <div className="border-top pt-2">
                          <div className="text-muted small mb-1">
                            Next of Kin
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="fw-medium">
                              {patient.next_of_kin}
                            </div>
                            <button
                              onClick={() => handleViewVisits(patient)}
                              className="btn btn-primary btn-sm px-3"
                            >
                              <i className="bx bx-show me-1"></i>
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <div className="mb-4">
                      <div className="position-relative d-inline-block">
                        <i className="bx bx-user-x fs-1 text-muted"></i>
                        <div className="position-absolute top-0 start-100 translate-middle">
                          <i className="bx bx-search text-warning fs-4"></i>
                        </div>
                      </div>
                    </div>
                    <h5 className="text-gray-700 mb-2">No Patients Found</h5>
                    <p className="text-muted mb-4">
                      {searchTerm || filterStatus !== "all"
                        ? "No patients match your search criteria"
                        : "Get started by registering a new patient"}
                    </p>
                    <button
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#patientRegistrationModal"
                      className="btn btn-primary px-4"
                    >
                      <i className="bx bx-user-plus me-2"></i>
                      Register First Patient
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Table View */
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "12px" }}
          >
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ backgroundColor: "#f8fafc" }}>
                    <tr>
                      <th className="ps-4 py-3 fw-semibold text-gray-700">
                        Patient
                      </th>
                      <th className="py-3 fw-semibold text-gray-700">
                        Contact
                      </th>
                      <th className="py-3 fw-semibold text-gray-700">Status</th>
                      <th className="py-3 fw-semibold text-gray-700">
                        Sessions
                      </th>
                      <th className="py-3 fw-semibold text-gray-700">
                        Last Visit
                      </th>
                      <th className="py-3 fw-semibold text-gray-700 text-center pe-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPatients.map((patient) => {
                      const age = calculateAge(patient.date_of_birth);
                      const lastVisit =
                        patient.visits.length > 0 ? patient.visits[0] : null;

                      return (
                        <tr key={patient.id} className="border-bottom">
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  fontSize: "14px",
                                  background:
                                    patient.sex?.toLowerCase() === "m"
                                      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                                      : "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                                }}
                              >
                                {patient.first_name?.charAt(0)}
                                {patient.last_name?.charAt(0)}
                              </div>
                              <div>
                                <div className="fw-semibold text-gray-800">
                                  {patient.first_name} {patient.last_name}
                                </div>
                                <div className="small text-muted">
                                  ID: {patient.hospital_reg_no} • {patient.sex},{" "}
                                  {age} yrs
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="small">{patient.phone_number}</div>
                            <div className="text-muted small">
                              {patient.email}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <span
                                className={`dot me-2 ${
                                  patient.status === "active"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                }}
                              ></span>
                              <span className="fw-medium">
                                {patient.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <span className="badge bg-primary-subtle text-primary">
                                  {patient.visits.length}
                                </span>
                              </div>
                              <div
                                className="progress"
                                style={{ width: "60px", height: "6px" }}
                              >
                                <div
                                  className="progress-bar bg-primary"
                                  style={{
                                    width: `${Math.min(
                                      patient.visits.length * 10,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            {lastVisit ? (
                              <div>
                                <div className="fw-medium">
                                  {formatDate(lastVisit.visit_date, "DD MMM")}
                                </div>
                                <div className="text-muted small">
                                  {lastVisit.ward}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted">No visits</span>
                            )}
                          </td>
                          <td className="text-center pe-4 py-3">
                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                            >
                              <button
                                onClick={() => handleViewVisits(patient)}
                                className="btn btn-outline-primary"
                                title="View Sessions"
                              >
                                <i className="bx bx-show"></i>
                              </button>
                              <button
                                className="btn btn-outline-success"
                                title="Add Session"
                              >
                                <i className="bx bx-plus-medical"></i>
                              </button>
                              <button
                                className="btn btn-outline-secondary"
                                title="More"
                              >
                                <i className="bx bx-dots-vertical-rounded"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pagination & Summary */}
        {filteredPatients.length > 0 && (
          <div className="row mt-4 align-items-center">
            <div className="col-md-4">
              <div className="text-muted small">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredPatients.length)} of{" "}
                {filteredPatients.length} patients
              </div>
            </div>
            <div className="col-md-8">
              <nav
                aria-label="Page navigation"
                className="d-flex justify-content-end"
              >
                <ul className="pagination pagination-sm mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="bx bx-chevron-left"></i>
                    </button>
                  </li>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${
                          pageNum === currentPage ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="bx bx-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}

        <style jsx>{`
          .card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
          }

          .progress {
            background-color: rgba(59, 130, 246, 0.1);
          }

          .table-hover tbody tr:hover {
            background-color: rgba(59, 130, 246, 0.05) !important;
          }

          .bg-gray-100 {
            background-color: #f3f4f6;
          }

          .dot {
            display: inline-block;
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

          .page-item.active .page-link {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-color: #6366f1;
            color: white;
          }

          .page-link {
            border: 1px solid #e5e7eb;
            color: #6b7280;
            padding: 0.375rem 0.75rem;
          }

          .page-link:hover {
            background-color: #f3f4f6;
            color: #4b5563;
          }

          .form-control-lg {
            border-radius: 10px;
            border: 1px solid #e5e7eb;
          }

          .form-control-lg:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.15);
          }
        `}</style>

        {/* Modal */}
        <PatientRegistrationModal onPatientAdded={handleAddPatient} />
      </div>
    </>
  );
};
