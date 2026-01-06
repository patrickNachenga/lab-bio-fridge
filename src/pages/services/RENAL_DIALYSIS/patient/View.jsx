import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "animate.css";
import { formatDate } from "../../../../helpers/DateFormater";
import dialysisData from "./dialysisData.json";
import DialysisModal from "./DialysisModal";

export const PatientPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const patient = dialysisData.patient;
  const visits = dialysisData.visits;

  // Filter visits
  const filteredVisits = visits.filter((visit) => {
    const matchesSearch = visit.diagnosis
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "discharged"
        ? visit.discharged
        : !visit.discharged;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisits = filteredVisits.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusBadge = (discharged) => {
    return discharged
      ? { class: "bg-success-subtle text-success", text: "Discharged" }
      : { class: "bg-warning-subtle text-warning", text: "Active" };
  };

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

  const getGenderColor = (gender) => {
    return gender && gender.toLowerCase() === "male" ? "#3b82f6" : "#ec4899";
  };

  const getGenderIcon = (gender) => {
    return gender && gender.toLowerCase() === "male" ? "bx-male" : "bx-female";
  };

  const handleViewDetails = (visit) => {
    sessionStorage.setItem("dialysisVisitData", JSON.stringify(visit));
    sessionStorage.setItem("dialysisPatientData", JSON.stringify(patient));
    navigate(`/renal-dialysis/visit/${visit.id}`);
  };

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row align-items-center mb-6">
        <div className="col-lg-8 col-md-6 mb-4 mb-md-0">
          <div className="d-flex align-items-center mb-3">
            <div className="me-3">
              <i className="bx bx-water text-primary fs-1"></i>
            </div>
            <div>
              <h1 className="h2 mb-1">Renal Dialysis - Patient Management</h1>
              <p className="text-muted mb-0">
                Manage dialysis sessions and patient care records
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#dialysisModal"
            className="btn btn-md w-100 d-flex align-items-center justify-content-center btn-primary"
          >
            <i className="bx bx-plus me-2"></i>
            New Visit
          </button>
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div
          className="px-4 py-2 border-bottom"
          style={{ backgroundColor: "#f8fafc" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bx bx-user-circle text-primary me-2"></i>
              <span className="fw-semibold text-dark">Patient Record</span>
            </div>
            <div className="d-flex align-items-center gap-3 small">
              <span>
                <i className="bx bx-hash text-muted me-1"></i>
                <strong>{patient.hospital_reg_no}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-auto">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "28px",
                  backgroundColor: getGenderColor(patient.sex),
                }}
              >
                {patient.first_name?.charAt(0)}
                {patient.last_name?.charAt(0)}
              </div>
            </div>
            <div className="col">
              <h3 className="mb-1 fw-bold text-dark">
                {patient.first_name} {patient.last_name}
              </h3>
              <div className="d-flex flex-wrap gap-3 text-muted">
                <span>
                  <i className={`bx ${getGenderIcon(patient.sex)} me-1`}></i>
                  {patient.sex}
                </span>
                <span>
                  <i className="bx bx-calendar me-1"></i>
                  {calculateAge(patient.date_of_birth)} years old
                </span>
                <span>
                  <i className="bx bx-phone me-1"></i>
                  {patient.phone_number}
                </span>
                <span>
                  <i className="bx bx-user me-1"></i>
                  Next of Kin: {patient.next_of_kin}
                </span>
              </div>
            </div>
            <div className="col-auto text-end">
              <small className="text-muted d-block mb-1">Total Visits</small>
              <h4 className="mb-2">{visits.length}</h4>
              <span className="badge bg-success">
                <i className="bx bx-check-circle me-1"></i>
                Active Patient
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-white border-end-0">
              <i className="bx bx-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by diagnosis..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <select
            className="form-select form-select-lg"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="discharged">Discharged</option>
            <option value="active">Active</option>
          </select>
        </div>
      </div>

      {/* Visits Table */}
      <div className="card border-0 shadow-sm animate__animated animate__fadeIn">
        <div className="card-header bg-white border-bottom pt-4 pb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bx bx-history me-2 text-primary"></i>
              Dialysis Visits
            </h5>
            <span className="badge bg-light text-dark">
              {currentVisits.length} of {filteredVisits.length}
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Visit Date</th>
                <th>Visit ID</th>
                <th>Ward</th>
                <th>Diagnosis</th>
                <th>Doctor</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentVisits.length > 0 ? (
                currentVisits.map((visit) => {
                  const statusBadge = getStatusBadge(visit.discharged);
                  return (
                    <tr key={visit.id} className="align-middle">
                      <td className="fw-semibold">
                        {formatDate(visit.visit_date, "DD MMM YYYY")}
                      </td>
                      <td>
                        <code className="bg-light px-2 py-1 rounded">
                          {visit.id}
                        </code>
                      </td>
                      <td>{visit.ward}</td>
                      <td>
                        <span className="badge bg-info-subtle text-info">
                          {visit.diagnosis}
                        </span>
                      </td>
                      <td>{visit.attending_doctor}</td>
                      <td>
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewDetails(visit)}
                            title="View Details"
                          >
                            <i className="bx bx-show"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            title="Edit"
                          >
                            <i className="bx bx-edit"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                          >
                            <i className="bx bx-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="text-muted">
                      <i className="bx bx-inbox fs-1 d-block mb-2"></i>
                      <p className="mb-0">No visits found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredVisits.length > itemsPerPage && (
          <div className="card-footer bg-white pt-3 pb-4">
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-sm mb-0 justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="bx bx-chevron-left"></i>
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        page === currentPage ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}

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
        )}
      </div>

      <style jsx>{`
        .table-hover tbody tr:hover {
          background-color: #f8f9fa;
        }

        .btn-group .btn {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }

        .page-item.active .page-link {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .page-link {
          color: #0d6efd;
        }

        .page-link:hover {
          color: #0a58ca;
        }

        .input-group-lg .form-control {
          height: calc(1.5em + 1rem + 2px);
          padding: 0.5rem 1rem;
          font-size: 1rem;
        }
      `}</style>

      {/* Modal */}
      <DialysisModal
        onClose={() => {
          // Optional: refresh data or perform any cleanup
        }}
      />
    </div>
  );
};
