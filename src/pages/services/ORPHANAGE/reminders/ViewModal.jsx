import React from "react";
import { formatDate } from "../../../../helpers/DateFormater";

const RemindersViewModal = ({ viewObj }) => {
  if (!viewObj) return null;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "normal":
        return "warning";
      case "low":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <div
      className="modal fade"
      id="remindersViewModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="remindersViewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content border-0">
          <div className="modal-header bg-gradient-info">
            <h5 className="modal-title text-white" id="remindersViewModalLabel">
              <i className="bx bx-bell me-2"></i> Reminder Details
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
            <div className="row mb-4 p-3 bg-light rounded align-items-center">
              <div className="col-md-6">
                <h6 className="text-muted small mb-1">Child</h6>
                <h5 className="text-dark fw-bold">{viewObj.child_name}</h5>
              </div>
              <div className="col-md-6 text-md-end">
                <span
                  className={`badge p-2 bg-${getPriorityColor(
                    viewObj.priority
                  )}`}
                >
                  {viewObj.priority.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>

            {/* Status & Type */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    <i className="bx bx-check me-1"></i> Status
                  </label>
                  <p className="detail-value">
                    <span
                      className={`badge ${
                        viewObj.is_completed ? "bg-success" : "bg-warning"
                      }`}
                    >
                      {viewObj.is_completed ? "COMPLETED" : "PENDING"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    <i className="bx bx-category me-1"></i> Reminder Type
                  </label>
                  <p className="detail-value">
                    <span className="badge bg-label-primary">
                      {viewObj.reminder_type
                        .replace(/_/g, " ")
                        .toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card border-0 bg-light p-3 mb-4">
              <h6 className="text-dark fw-bold mb-2">
                <i className="bx bx-note me-2"></i> Description
              </h6>
              <p className="mb-0">{viewObj.description}</p>
            </div>

            {/* Reminder Schedule */}
            <div className="row mb-4 p-3 bg-light rounded">
              <div className="col-md-12">
                <strong className="text-muted small">
                  <i className="bx bx-calendar me-1"></i> Reminder Date & Time
                </strong>
                <h5 className="text-dark fw-bold mt-1">
                  {formatDate(viewObj.remind_at, "DD/MM/YYYY HH:mm")}
                </h5>
                <small className="text-muted">
                  {formatDate(viewObj.remind_at, "dddd, MMMM DD, YYYY")}
                </small>
              </div>
            </div>

            {/* Reference Information */}
            <div className="card border-0 bg-light p-3 mb-4">
              <h6 className="text-dark fw-bold mb-2">
                <i className="bx bx-link me-2"></i> Reference Information
              </h6>
              <div className="row">
                <div className="col-md-6">
                  <strong className="text-muted small">Reference ID</strong>
                  <p className="mb-0 text-monospace">
                    <code>{viewObj.reference_id}</code>
                  </p>
                </div>
              </div>
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

export default RemindersViewModal;
