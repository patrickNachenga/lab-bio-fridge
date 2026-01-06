import React from "react";
import { formatDate } from "../../../../helpers/DateFormater";

const StaffViewModal = ({ viewObj }) => {
  if (!viewObj) return null;

  return (
    <div
      className="modal fade"
      id="staffViewModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="staffViewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content border-0">
          <div className="modal-header bg-gradient-info">
            <h5 className="modal-title text-white" id="staffViewModalLabel">
              <i className="bx bx-user-check me-2"></i> Staff Details
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {/* Header with avatar */}
            <div className="row mb-4 p-3 bg-light rounded align-items-center">
              <div className="col-md-3 text-center">
                <div
                  className="avatar p-4"
                  style={{
                    backgroundColor: "#E8F2FF",
                    borderRadius: "50%",
                    width: "100px",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                  }}
                >
                  <i
                    className="bx bxs-user-circle"
                    style={{ fontSize: "3rem", color: "#0071B8" }}
                  ></i>
                </div>
              </div>
              <div className="col-md-9">
                <h5 className="text-dark fw-bold">{viewObj.full_name}</h5>
                <p className="text-muted mb-2">
                  <span className="badge bg-label-primary me-2">
                    {viewObj.role}
                  </span>
                  <span
                    className={`badge ${
                      viewObj.is_external ? "bg-warning" : "bg-success"
                    }`}
                  >
                    {viewObj.is_external ? "External Staff" : "Internal Staff"}
                  </span>
                </p>
                <p className="text-muted small mb-0">{viewObj.facility_name}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card border-0 bg-light p-3 mb-4">
              <h6 className="text-dark fw-bold mb-3">
                <i className="bx bx-phone me-2"></i> Contact Information
              </h6>
              <div className="row">
                <div className="col-md-6">
                  <strong className="text-muted small">Email</strong>
                  <p className="mb-2">
                    <a href={`mailto:${viewObj.email}`}>{viewObj.email}</a>
                  </p>
                </div>
                <div className="col-md-6">
                  <strong className="text-muted small">Phone</strong>
                  <p className="mb-2">
                    <a href={`tel:${viewObj.phone}`}>{viewObj.phone}</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    <i className="bx bx-briefcase me-1"></i> Department
                  </label>
                  <p className="detail-value fw-bold">{viewObj.department}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    <i className="bx bx-building me-1"></i> Facility
                  </label>
                  <p className="detail-value fw-bold">
                    {viewObj.facility_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    Hire Date
                  </label>
                  <p className="detail-value">
                    {formatDate(viewObj.hire_date, "DD/MM/YYYY")}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    Status
                  </label>
                  <p className="detail-value">
                    <span className="badge bg-success">
                      {viewObj.status.toUpperCase()}
                    </span>
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

export default StaffViewModal;
