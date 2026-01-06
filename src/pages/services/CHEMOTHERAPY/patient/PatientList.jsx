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
  const [viewMode, setViewMode] = useState("grid");
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
    navigate(`/chemotherapy/patient-visits/${patient.id}`);
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
                  <i className="bx bx-injection fs-3 text-white"></i>
                </div>
                <div
                  className="position-absolute top-0 end-0 bg-success rounded-circle border border-3 border-white"
                  style={{ width: "12px", height: "12px" }}
                ></div>
              </div>
              <div>
                <h1 className="h2 mb-1 fw-bold text-gray-800">
                  Chemotherapy - Patient Management
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
                background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
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
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1 small fw-semibold">
                      This Month
                    </h6>
                    <h2 className="mb-0 fw-bold" style={{ color: "#0369a1" }}>
                      {recentPatients}
                    </h2>
                    <p className="text-muted small mb-0 mt-1">New registrations</p>
                  </div>
                  <div
                    className="p-3 rounded-circle"
                    style={{
                      backgroundColor: "rgba(14, 165, 233, 0.15)",
                    }}
                  >
                    <i
                      className="bx bx-trending-up fs-2"
                      style={{ color: "#0369a1" }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="row mb-4 g-3">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bx bx-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 form-control-lg"
                placeholder="Search by name, hospital number, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="col-md-4">
            <select
              className="form-select form-select-lg"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-muted small">
            {filteredPatients.length} patients found
          </div>
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMode("grid")}
            >
              <i className="bx bx-grid-alt"></i> Grid
            </button>
            <button
              type="button"
              className={`btn ${viewMode === "table" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setViewMode("table")}
            >
              <i className="bx bx-list-ul"></i> Table
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && filteredPatients.length > 0 && (
          <div className="row g-3 mb-4">
            {currentPatients.map((patient) => {
              const lastVisit = patient.visits[0];
              const age = calculateAge(patient.date_of_birth);
              return (
                <div key={patient.id} className="col-lg-4 col-md-6">
                  <div
                    className="card border-0 shadow-sm h-100"
                    style={{ borderRadius: "12px", overflow: "hidden" }}
                  >
                    <div
                      className="card-header p-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        borderBottom: "none",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h5 className="card-title mb-1 text-white fw-bold">
                            {patient.first_name} {patient.last_name}
                          </h5>
                          <p className="card-text text-white-50 small mb-0">
                            {patient.hospital_reg_no}
                          </p>
                        </div>
                        <span
                          className={`badge ${
                            patient.status === "active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {patient.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    <div className="card-body p-3">
                      <div className="row text-center g-2 mb-3">
                        <div className="col-4">
                          <small className="text-muted d-block">Age</small>
                          <strong>{age} yrs</strong>
                        </div>
                        <div className="col-4">
                          <small className="text-muted d-block">Gender</small>
                          <strong>{patient.sex === "M" ? "Male" : "Female"}</strong>
                        </div>
                        <div className="col-4">
                          <small className="text-muted d-block">Visits</small>
                          <strong>{patient.visits.length}</strong>
                        </div>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted d-block mb-1">Contact</small>
                        <div className="small">
                          <div>{patient.phone_number}</div>
                          <div className="text-muted">{patient.email}</div>
                        </div>
                      </div>

                      {lastVisit && (
                        <div className="p-2 rounded" style={{ backgroundColor: "#f9fafb" }}>
                          <small className="text-muted d-block mb-1">Last Visit</small>
                          <div className="small">
                            <div className="fw-medium">
                              {formatDate(lastVisit.visit_date, "DD MMM YYYY")}
                            </div>
                            <div className="text-muted text-truncate">
                              {lastVisit.diagnosis}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card-footer bg-white border-top p-2">
                      <button
                        onClick={() => handleViewVisits(patient)}
                        className="btn btn-sm btn-primary w-100"
                      >
                        <i className="bx bx-show me-1"></i>View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && filteredPatients.length > 0 && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ background: "#f9fafb" }}>
                  <tr>
                    <th className="py-3">Name</th>
                    <th className="py-3">Hospital No.</th>
                    <th className="py-3">Age/Gender</th>
                    <th className="py-3">Contact</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Sessions</th>
                    <th className="py-3">Last Visit</th>
                    <th className="py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatients.map((patient) => {
                    const lastVisit = patient.visits[0];
                    const age = calculateAge(patient.date_of_birth);
                    return (
                      <tr key={patient.id}>
                        <td className="py-3">
                          <div className="fw-medium">
                            {patient.first_name} {patient.last_name}
                          </div>
                        </td>
                        <td className="py-3 text-muted small">
                          {patient.hospital_reg_no}
                        </td>
                        <td className="py-3 small">
                          {age} / {patient.sex === "M" ? "M" : "F"}
                        </td>
                        <td className="py-3">
                          <div className="small">{patient.phone_number}</div>
                          <div className="text-muted small">{patient.email}</div>
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
                          </div>
                        </td>
                        <td className="py-3">
                          {lastVisit ? (
                            <div>
                              <div className="fw-medium">
                                {formatDate(lastVisit.visit_date, "DD MMM")}
                              </div>
                              <div className="text-muted small">
                                {lastVisit.admitting_ward}
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
                              title="View Details"
                            >
                              <i className="bx bx-show"></i>
                            </button>
                            <button
                              className="btn btn-outline-success"
                              title="Add Session"
                            >
                              <i className="bx bx-plus-medical"></i>
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
        )}

        {/* No Results */}
        {filteredPatients.length === 0 && (
          <div className="text-center py-5">
            <i className="bx bx-inbox fs-1 text-muted mb-3 d-block"></i>
            <h5>No patients found</h5>
            <p className="text-muted">Try adjusting your search criteria</p>
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
            background-color: rgba(99, 102, 241, 0.1);
          }

          .table-hover tbody tr:hover {
            background-color: rgba(99, 102, 241, 0.05) !important;
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
