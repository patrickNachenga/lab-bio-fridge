import React from "react";
import { formatDate } from "../../../../helpers/DateFormater";
import "./VisitDetailsModal.css";

const VisitDetailsModal = ({ visit }) => {
  if (!visit) return null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-success";
      case "COMPLETED":
        return "bg-info";
      case "PENDING":
        return "bg-warning";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div
      className="modal fade"
      id="visitDetailsModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="visitDetailsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content border-0 visit-modal">
          {/* Header */}
          <div className="modal-header bg-gradient-success p-4">
            <div>
              <h5 className="modal-title text-white fw-bold mb-1" id="visitDetailsModalLabel">
                <i className="bx bx-clinic me-2"></i>
                Hospital Visit Details
              </h5>
              <p className="text-white-50 small mb-0">
                {visit.hospital.name}
              </p>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            {/* Status and Basic Info */}
            <div className="row mb-4">
              <div className="col-md-8">
                <div className="visit-info-block">
                  <h6 className="text-muted mb-3">
                    <i className="bx bx-info-circle me-2"></i>Visit Status
                  </h6>
                  <div>
                    <span className={`badge ${getStatusBadgeClass(visit.status)} badge-lg`}>
                      <i className={`bx ${
                        visit.status === "CONFIRMED" ? "bx-check-circle" :
                        visit.status === "COMPLETED" ? "bx-check-double" :
                        visit.status === "PENDING" ? "bx-hourglass" :
                        "bx-x-circle"
                      } me-1`}></i>
                      {visit.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="visit-info-block">
                  <h6 className="text-muted mb-3">
                    <i className="bx bx-user me-2"></i>Recorded By
                  </h6>
                  <p className="mb-0">
                    <span className="badge bg-light text-dark">
                      {visit.created_by}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <hr />

            {/* Hospital and Facility Info */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="visit-info-block">
                  <h6 className="text-muted mb-2">
                    <i className="bx bx-hospital me-2"></i>Hospital Name
                  </h6>
                  <p className="fw-bold text-dark mb-0">
                    {visit.hospital.name}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="visit-info-block">
                  <h6 className="text-muted mb-2">
                    <i className="bx bx-building me-2"></i>Facility
                  </h6>
                  <p className="fw-bold text-dark mb-0">
                    {visit.facility}
                  </p>
                </div>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="visit-info-block bg-light p-3 rounded border-start border-primary border-4">
                  <h6 className="text-muted mb-2">
                    <i className="bx bx-user-check me-2"></i>Attending Doctor
                  </h6>
                  <p className="fw-bold text-dark mb-1">
                    {visit.doctor.name}
                  </p>
                  <small className="text-muted">
                    Doctor ID: {visit.doctor.id}
                  </small>
                </div>
              </div>
            </div>

            <hr />

            {/* Visit Dates */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="visit-info-block">
                  <h6 className="text-muted mb-2">
                    <i className="bx bx-calendar-check me-2"></i>Visit Date
                  </h6>
                  <p className="fw-bold text-dark mb-0">
                    {formatDate(visit.visit_date, "dddd, DD MMMM YYYY")}
                  </p>
                  <small className="text-muted">
                    {formatDate(visit.visit_date, "HH:mm")}
                  </small>
                </div>
              </div>
              <div className="col-md-6">
                <div className="visit-info-block">
                  <h6 className="text-muted mb-2">
                    <i className="bx bx-calendar-plus me-2"></i>Next Visit
                  </h6>
                  <p className="fw-bold text-dark mb-0">
                    {formatDate(visit.next_visit_date, "dddd, DD MMMM YYYY")}
                  </p>
                  <small className="text-muted">
                    {visit.next_visit_date && new Date(visit.next_visit_date) > new Date() ? (
                      <span className="badge bg-warning-light text-warning">Upcoming</span>
                    ) : (
                      <span className="badge bg-danger-light text-danger">Overdue</span>
                    )}
                  </small>
                </div>
              </div>
            </div>

            {/* Prescription Summary */}
            {visit.prescription_summary && visit.prescription_summary.length > 0 && (
              <>
                <hr />
                <div className="prescriptions-section">
                  <h6 className="fw-bold text-dark mb-3">
                    <i className="bx bx-pill me-2 text-danger"></i>
                    Prescriptions ({visit.prescription_summary.length})
                  </h6>
                  <div className="prescriptions-list">
                    {visit.prescription_summary.map((prescription, idx) => (
                      <div
                        key={idx}
                        className="prescription-detail-card p-3 mb-3 rounded border-start border-danger border-4"
                        style={{ backgroundColor: "#fff5f5" }}
                      >
                        <div className="row align-items-start">
                          <div className="col-md-6">
                            <div className="mb-2">
                              <h6 className="fw-bold text-dark mb-1">
                                {prescription.medicine}
                              </h6>
                              <p className="text-muted small mb-2">
                                <i className="bx bx-beaker me-1"></i>
                                Dosage: <strong>{prescription.dosage}</strong>
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="prescription-meta">
                              <p className="text-muted small mb-1">
                                <i className="bx bx-time-five me-1"></i>
                                Frequency: <strong>{prescription.frequency_per_day}x daily</strong>
                              </p>
                              <p className="text-muted small mb-0">
                                <i className="bx bx-calendar me-1"></i>
                                Duration: <strong>{prescription.duration_days} days</strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Additional Notes Section */}
            <hr />
            <div className="notes-section">
              <h6 className="fw-bold text-dark mb-3">
                <i className="bx bx-note me-2"></i>Notes
              </h6>
              <div className="bg-light p-3 rounded">
                <p className="text-muted mb-0">
                  {visit.notes || "No additional notes recorded for this visit."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light p-3">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              <i className="bx bx-x me-1"></i>Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
            >
              <i className="bx bx-edit me-1"></i>Edit Visit
            </button>
            <button
              type="button"
              className="btn btn-success"
            >
              <i className="bx bx-download me-1"></i>Print Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitDetailsModal;
