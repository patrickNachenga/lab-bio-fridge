import React from "react";
import { formatDate } from "../../../../helpers/DateFormater";

const FacilitiesViewModal = ({ viewObj }) => {
  if (!viewObj) return null;

  return (
    <div
      className="modal fade"
      id="facilitiesViewModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="facilitiesViewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content border-0">
          <div className="modal-header bg-gradient-info">
            <h5 className="modal-title text-white" id="facilitiesViewModalLabel">
              <i className="bx bx-building me-2"></i> Facility Details
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    Facility Code
                  </label>
                  <p className="detail-value fw-bold text-primary">
                    {viewObj.facility_code}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    Facility Name
                  </label>
                  <p className="detail-value fw-bold">{viewObj.name}</p>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    Email
                  </label>
                  <p className="detail-value">{viewObj.email}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    Phone
                  </label>
                  <p className="detail-value">{viewObj.phone}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="detail-group">
                <label className="detail-label text-muted small">
                  Address
                </label>
                <p className="detail-value">{viewObj.address}</p>
              </div>
            </div>

            <div className="row mb-4 p-3 bg-light rounded">
              <div className="col-md-4 text-center">
                <div className="mb-2">
                  <i
                    className="bx bx-group"
                    style={{ fontSize: "2rem", color: "#28a745" }}
                  ></i>
                </div>
                <h6 className="text-muted mb-1">Children</h6>
                <h3 className="text-success fw-bold">{viewObj.children_count}</h3>
              </div>
              <div className="col-md-4 text-center">
                <div className="mb-2">
                  <i
                    className="bx bx-user-check"
                    style={{ fontSize: "2rem", color: "#007bff" }}
                  ></i>
                </div>
                <h6 className="text-muted mb-1">Staff</h6>
                <h3 className="text-info fw-bold">{viewObj.staff_count}</h3>
              </div>
              <div className="col-md-4 text-center">
                <div className="mb-2">
                  <i
                    className="bx bx-trending-up"
                    style={{ fontSize: "2rem", color: "#ffc107" }}
                  ></i>
                </div>
                <h6 className="text-muted mb-1">Ratio</h6>
                <h3 className="text-warning fw-bold">
                  {(viewObj.children_count / viewObj.staff_count).toFixed(1)}:1
                </h3>
              </div>
            </div>

            <div className="row text-muted small mt-4 pt-3 border-top">
              <div className="col-md-6">
                <strong>Created:</strong>
                <p>{formatDate(viewObj.created_at, "DD/MM/YYYY HH:mm")}</p>
              </div>
              <div className="col-md-6">
                <strong>Last Updated:</strong>
                <p>{formatDate(viewObj.updated_at, "DD/MM/YYYY HH:mm")}</p>
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

export default FacilitiesViewModal;
