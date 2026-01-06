import React from "react";

const HospitalsViewModal = ({ viewObj }) => {
  if (!viewObj) return null;

  return (
    <div
      className="modal fade"
      id="hospitalsViewModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="hospitalsViewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content border-0">
          <div className="modal-header bg-gradient-danger">
            <h5 className="modal-title text-white" id="hospitalsViewModalLabel">
              <i className="bx bx-hospital me-2"></i> Hospital Details
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
              <div className="col-md-8">
                <h5 className="text-dark fw-bold">{viewObj.name}</h5>
                <p className="text-muted mb-0">
                  <i className="bx bx-map me-1"></i>
                  {viewObj.city}, {viewObj.region}
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <span className="badge bg-danger" style={{ padding: "8px 12px" }}>
                  Partner Hospital
                </span>
              </div>
            </div>

            {/* Location Information */}
            <div className="card border-0 bg-light p-3 mb-4">
              <h6 className="text-dark fw-bold mb-3">
                <i className="bx bx-map-pin me-2"></i> Location
              </h6>
              <div className="mb-2">
                <strong className="text-muted small">Full Address</strong>
                <p className="mb-0">{viewObj.address}</p>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <strong className="text-muted small">City</strong>
                  <p className="mb-0">{viewObj.city}</p>
                </div>
                <div className="col-md-6">
                  <strong className="text-muted small">Region</strong>
                  <p className="mb-0">{viewObj.region}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card border-0 bg-light p-3 mb-4">
              <h6 className="text-dark fw-bold mb-3">
                <i className="bx bx-phone me-2"></i> Contact Information
              </h6>
              <div className="row">
                <div className="col-md-6">
                  <strong className="text-muted small">Phone</strong>
                  <p className="mb-0">
                    <a href={`tel:${viewObj.phone}`}>{viewObj.phone}</a>
                  </p>
                </div>
                {viewObj.email && (
                  <div className="col-md-6">
                    <strong className="text-muted small">Email</strong>
                    <p className="mb-0">
                      <a href={`mailto:${viewObj.email}`}>{viewObj.email}</a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="row mt-3">
              <div className="col-md-6">
                <div className="text-center p-2 bg-label-info rounded">
                  <h6 className="text-muted mb-1">Record ID</h6>
                  <p className="text-small text-dark fw-bold mb-0">
                    {viewObj.uid || viewObj.id}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="text-center p-2 bg-label-danger rounded">
                  <h6 className="text-muted mb-1">Status</h6>
                  <p className="text-small text-dark fw-bold mb-0">Active Partner</p>
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

export default HospitalsViewModal;
