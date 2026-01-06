import React from "react";
import { formatDate } from "../../../../helpers/DateFormater";

const HospitalVisitsViewModal = ({ viewObj }) => {
  if (!viewObj) return null;

  return (
    <div
      className="modal fade"
      id="hospitalVisitsViewModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="hospitalVisitsViewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content border-0">
          <div className="modal-header bg-gradient-warning">
            <h5 className="modal-title text-white" id="hospitalVisitsViewModalLabel">
              <i className="bx bx-clinic me-2"></i> Hospital Visit Details
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {/* Header */}
            <div className="row mb-4 p-3 bg-light rounded">
              <div className="col-md-6">
                <h6 className="text-muted small mb-1">Child</h6>
                <h5 className="text-dark fw-bold">{viewObj.child_name}</h5>
              </div>
              <div className="col-md-6 text-md-end">
                <span
                  className={`badge p-2 ${
                    viewObj.status === "completed"
                      ? "bg-success"
                      : "bg-warning"
                  }`}
                >
                  {viewObj.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Visit Information */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    <i className="bx bx-hospital me-1"></i> Hospital
                  </label>
                  <p className="detail-value fw-bold">{viewObj.hospital_name}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    <i className="bx bx-user-md me-1"></i> Doctor
                  </label>
                  <p className="detail-value fw-bold">{viewObj.doctor_name}</p>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="mb-4">
              <div className="detail-group">
                <label className="detail-label text-muted small">
                  <i className="bx bx-stethoscope me-1"></i> Diagnosis
                </label>
                <p className="detail-value">
                  <span className="badge bg-label-primary">
                    {viewObj.diagnosis}
                  </span>
                </p>
              </div>
            </div>

            {/* Dates */}
            <div className="row mb-4 p-3 bg-light rounded">
              <div className="col-md-6">
                <strong className="text-muted small">Visit Date & Time</strong>
                <p className="mb-0">
                  {formatDate(viewObj.visit_date, "DD/MM/YYYY HH:mm")}
                </p>
              </div>
              <div className="col-md-6">
                <strong className="text-muted small">Next Visit Date</strong>
                <p className="mb-0">
                  {formatDate(viewObj.next_visit_date, "DD/MM/YYYY")}
                </p>
              </div>
            </div>

            {/* Team */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="detail-group">
                  <label className="detail-label text-muted small">
                    Caretaker
                  </label>
                  <p className="detail-value">{viewObj.caretaker_name}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="card border-0 bg-light p-3 mb-4">
              <h6 className="text-dark fw-bold mb-2">
                <i className="bx bx-note me-2"></i> Notes & Observations
              </h6>
              <p className="mb-0">{viewObj.notes}</p>
            </div>

            {/* Timeline */}
            <div className="text-muted small mt-4 pt-3 border-top">
              <strong>Record Created:</strong>
              <p>{formatDate(viewObj.created_at, "DD/MM/YYYY HH:mm")}</p>
            </div>
          </div>

          <div className="modal-footer bg-light">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              <i className="bx bx-x me-1"></i> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalVisitsViewModal;
