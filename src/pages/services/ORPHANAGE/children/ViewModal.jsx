import React from "react";
import { formatDate } from "../../../../helpers/DateFormater";

const ChildrenViewModal = ({ viewObj, calculateAge }) => {
  if (!viewObj) return null;

  return (
    <div
      className="modal fade"
      id="childrenViewModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="childrenViewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content border-0">
          <div className="modal-header bg-gradient-success">
            <h5 className="modal-title text-white" id="childrenViewModalLabel">
              <i className="bx bx-group me-2"></i> Child Details
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {/* Header with avatar and basic info */}
            <div className="row mb-4 p-3 bg-light rounded align-items-center">
              <div className="col-md-4 text-center">
                <div
                  className="avatar avatar-xl p-4 mb-3"
                  style={{
                    backgroundColor: `${
                      viewObj.gender === "Male" ? "#E8F2FF" : "#FFE8F0"
                    }`,
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
                    className={`bx ${
                      viewObj.gender === "Male" ? "bxs-male" : "bxs-female"
                    }`}
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
                <h5 className="text-dark fw-bold">{viewObj.full_name}</h5>
                <p className="text-muted small">
                  <span className="badge bg-info">
                    {viewObj.child_unique_number}
                  </span>
                </p>
              </div>
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <strong className="text-muted">Age</strong>
                    <p className="mb-0">
                      {calculateAge(viewObj.date_of_birth)} years old
                    </p>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong className="text-muted">Gender</strong>
                    <p className="mb-0">{viewObj.gender}</p>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong className="text-muted">Date of Birth</strong>
                    <p className="mb-0">
                      {formatDate(viewObj.date_of_birth, "DD/MM/YYYY")}
                    </p>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong className="text-muted">Status</strong>
                    <p className="mb-0">
                      <span className="badge bg-success">
                        {viewObj.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Facility & Admission Info */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    <i className="bx bx-building me-1"></i> Facility
                  </label>
                  <p className="detail-value fw-bold">{viewObj.facility_name}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    <i className="bx bx-calendar me-1"></i> Admission Date
                  </label>
                  <p className="detail-value">
                    {formatDate(viewObj.admission_date, "DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </div>

            {/* Health Status */}
            <div className="mb-4">
              <div className="detail-group">
                <label className="detail-label text-muted small">
                  <i className="bx bx-heart me-1"></i> Health Status
                </label>
                <p className="detail-value">
                  <span
                    className={`badge ${
                      viewObj.health_status === "Good"
                        ? "bg-success"
                        : viewObj.health_status === "Stable"
                        ? "bg-info"
                        : "bg-warning"
                    }`}
                  >
                    {viewObj.health_status}
                  </span>
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card border-0 bg-light p-3 mb-4">
              <h6 className="text-dark fw-bold mb-3">
                <i className="bx bx-phone me-2"></i> Contact Information
              </h6>
              <div className="row">
                <div className="col-md-6">
                  <strong className="text-muted small">Contact Person</strong>
                  <p className="mb-2">{viewObj.contact_person}</p>
                </div>
                <div className="col-md-6">
                  <strong className="text-muted small">Contact Phone</strong>
                  <p className="mb-0">{viewObj.contact_phone}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="text-muted small mt-4 pt-3 border-top">
              <div className="row">
                <div className="col-md-6">
                  <strong>Record Created:</strong>
                  <p>{formatDate(viewObj.created_at, "DD/MM/YYYY HH:mm")}</p>
                </div>
              </div>
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

export default ChildrenViewModal;
