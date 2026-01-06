import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "../../../../helpers/DateFormater";
import patientsData from "./patientsData.json";
import BreadCumb from "../../../../layouts/BreadCumb";

export const PatientVisitsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    const foundPatient = patientsData.patients.find(
      (p) => p.id === parseInt(patientId)
    );
    setPatient(foundPatient);
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
              className="btn btn-primary-outline btn-sm px-1"
              onClick={() => navigate("/chemotherapy/patients")}
            >
              <i className="bx bx-add me-1"></i>New Visit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter visits
  const filteredVisits = patient.visits.filter((visit) => {
    if (filterStatus === "all") return true;
    return filterStatus === "completed"
      ? visit.status === "COMPLETED"
      : visit.status === "ACTIVE";
  });

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
    sessionStorage.setItem("selectedVisit", JSON.stringify(visit));
    sessionStorage.setItem("selectedPatient", JSON.stringify(patient));
    navigate(`/chemotherapy/visit/${visit.id}`);
  };

  const toggleVisitExpansion = (visitId) => {
    setExpandedVisit(expandedVisit === visitId ? null : visitId);
  };

  const getStatusColor = (status) => {
    return status === "COMPLETED" ? "#10b981" : "#f59e0b";
  };

  return (
    <div className="container-fluid py-3" style={{ maxWidth: "1500px" }}>
      <BreadCumb pageList={["Chemotherapy", "Patient Details"]} />

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              <div>
                <h4 className="fw-bold text-gray-800 mb-1">
                  Chemotherapy Sessions
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
              className="btn btn-outline-primary btn-sm px-4 "
              // onClick={() => navigate("/chemotherapy/patients")}
            >
              <i className="bx bx-list-plus me-1"></i>New Visit
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
                          <i className="bx bx-envelope me-1"></i>
                          {patient.email || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-top pt-3">
                    <div className="row">
                      <div className="col-6">
                        <div className="mb-2">
                          <div className="small text-muted">Date of Birth</div>
                          <div className="fw-semibold">
                            {formatDate(patient.date_of_birth, "DD MMM YYYY")}
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-2">
                          <div className="small text-muted">Gender</div>
                          <div className="fw-semibold">
                            {patient.sex === "M" ? "Male" : "Female"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="col-md-8 ps-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div
                        className="p-3 rounded"
                        style={{ background: "#f0f4ff" }}
                      >
                        <div className="small text-muted mb-2">
                          Total Sessions
                        </div>
                        <div
                          className="h4 fw-bold mb-1"
                          style={{ color: "#6366f1" }}
                        >
                          {patient.visits.length}
                        </div>
                        <div className="small text-muted">
                          Treatment sessions
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div
                        className="p-3 rounded"
                        style={{ background: "#fff0f0" }}
                      >
                        <div className="small text-muted mb-2">
                          Active Sessions
                        </div>
                        <div
                          className="h4 fw-bold mb-1"
                          style={{ color: "#f59e0b" }}
                        >
                          {
                            patient.visits.filter((v) => v.status === "ACTIVE")
                              .length
                          }
                        </div>
                        <div className="small text-muted">Currently active</div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div
                        className="p-3 rounded"
                        style={{ background: "#f0fdf4" }}
                      >
                        <div className="small text-muted mb-2">Completed</div>
                        <div
                          className="h4 fw-bold mb-1"
                          style={{ color: "#10b981" }}
                        >
                          {
                            patient.visits.filter(
                              (v) => v.status === "COMPLETED"
                            ).length
                          }
                        </div>
                        <div className="small text-muted">Completed</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-top">
                    <div className="row">
                      <div className="col-4">
                        <div className="small text-muted">
                          Registration Date
                        </div>
                        <div className="fw-semibold">
                          {formatDate(patient.registration_date, "DD MMM YYYY")}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="small text-muted">Last Visit</div>
                        <div className="fw-semibold">
                          {formatDate(patient.registration_date, "DD MMM YYYY")}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="small text-muted">Status</div>
                        <div className="fw-semibold">
                          <span
                            className={`badge ${
                              patient.status === "active"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {patient.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
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

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${
                filterStatus === "all" ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => {
                setFilterStatus("all");
                setCurrentPage(1);
              }}
            >
              All Sessions
            </button>
            <button
              className={`btn btn-sm ${
                filterStatus === "active"
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => {
                setFilterStatus("active");
                setCurrentPage(1);
              }}
            >
              Active
            </button>
            <button
              className={`btn btn-sm ${
                filterStatus === "completed"
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => {
                setFilterStatus("completed");
                setCurrentPage(1);
              }}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="row">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "12px" }}
          >
            <div
              className="card-header p-4 border-0"
              style={{ background: "#f9fafb" }}
            >
              <h5 className="mb-0 fw-bold">
                <i className="bx bx-calendar me-2"></i>Treatment Sessions
              </h5>
            </div>

            {currentVisits.length === 0 ? (
              <div className="card-body text-center py-5">
                <i className="bx bx-calendar-x fs-1 text-muted mb-3 d-block"></i>
                <h6 className="text-gray-600 mb-2">No sessions found</h6>
                <p className="text-muted small mb-3">
                  {filterStatus === "active"
                    ? "No active sessions currently running."
                    : "No sessions match your current filters."}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="border-0">
                    <tr style={{ background: "#f9fafb" }}>
                      <th className="fw-semibold border-0 ps-4">Date</th>
                      <th className="fw-semibold border-0">Diagnosis</th>
                      <th className="fw-semibold border-0">Cancer Stage</th>
                      <th className="fw-semibold border-0">Doctor</th>
                      <th className="fw-semibold border-0">Regimen</th>
                      <th className="fw-semibold border-0">Status</th>
                      <th className="fw-semibold border-0 text-end pe-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVisits.map((visit) => {
                      const statusColor = getStatusColor(visit.status);
                      return (
                        <React.Fragment key={visit.id}>
                          <tr
                            className="cursor-pointer"
                            onClick={() => toggleVisitExpansion(visit.id)}
                          >
                            <td className="ps-4">
                              <div className="mb-1">
                                <div className="fw-semibold">
                                  {formatDate(visit.visit_date, "DD MMMM YYYY")}
                                </div>
                                <div className="small text-muted">
                                  {visit.admitting_ward}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="mb-1">
                                <div
                                  className="fw-semibold text-truncate"
                                  style={{ maxWidth: "150px" }}
                                >
                                  {visit.diagnosis}
                                </div>
                                <div className="small text-muted">
                                  <i className="bx bx-time me-1"></i>
                                  Treatment session
                                </div>
                              </div>
                            </td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  background:
                                    visit.cancer_stage === "Stage I"
                                      ? "#dbeafe"
                                      : visit.cancer_stage === "Stage II"
                                      ? "#fef3c7"
                                      : visit.cancer_stage === "Stage III"
                                      ? "#fed7aa"
                                      : "#fecaca",
                                  color:
                                    visit.cancer_stage === "Stage I"
                                      ? "#1e40af"
                                      : visit.cancer_stage === "Stage II"
                                      ? "#92400e"
                                      : visit.cancer_stage === "Stage III"
                                      ? "#9a3412"
                                      : "#7f1d1d",
                                }}
                              >
                                {visit.cancer_stage}
                              </span>
                            </td>
                            <td>
                              <div className="fw-semibold small">
                                {visit.attending_doctor}
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold small">
                                {visit.regimen?.name || "N/A"}
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
                                <span className="fw-medium small">
                                  {visit.status === "COMPLETED"
                                    ? "Completed"
                                    : "Active"}
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
                              <td colSpan="7" className="ps-5 pe-4 py-3">
                                <div className="row">
                                  <div className="col-md-4">
                                    <div className="mb-2">
                                      <strong className="text-muted small">
                                        Ward:
                                      </strong>
                                      <div className="mt-1">
                                        {visit.admitting_ward}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="mb-2">
                                      <strong className="text-muted small">
                                        Treatment Details:
                                      </strong>
                                      <div className="mt-1">
                                        {visit.cancer_stage} • Regimen:{" "}
                                        {visit.regimen?.name || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="mb-2">
                                      <strong className="text-muted small">
                                        Doctor:
                                      </strong>
                                      <div className="mt-1">
                                        {visit.attending_doctor}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="card-footer bg-white border-0 py-3 px-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted small">
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
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
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
                    })}
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
      `}</style>
    </div>
  );
};
