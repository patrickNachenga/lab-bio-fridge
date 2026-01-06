import React from "react";
import { formatDate } from "../../../../helpers/DateFormater";

const PrescriptionsViewModal = ({ viewObj }) => {
  if (!viewObj) return null;

  return (
    <div
      className="modal fade"
      id="prescriptionsViewModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="prescriptionsViewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content border-0">
          <div className="modal-header bg-gradient-success">
            <h5 className="modal-title text-white" id="prescriptionsViewModalLabel">
              <i className="bx bx-pill me-2"></i> Prescription Details
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
                    viewObj.status === "active" ? "bg-success" : "bg-info"
                  }`}
                >
                  {viewObj.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Doctor & Confirmation */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    <i className="bx bx-user-md me-1"></i> Prescribed By
                  </label>
                  <p className="detail-value fw-bold">{viewObj.doctor_name}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-group mb-3">
                  <label className="detail-label text-muted small">
                    <i className="bx bx-calendar me-1"></i> Confirmed Date
                  </label>
                  <p className="detail-value">
                    {formatDate(viewObj.confirmed_at, "DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {viewObj.notes && (
              <div className="card border-0 bg-light p-3 mb-4">
                <h6 className="text-dark fw-bold mb-2">
                  <i className="bx bx-note me-2"></i> Notes
                </h6>
                <p className="mb-0">{viewObj.notes}</p>
              </div>
            )}

            {/* Medicines */}
            <div className="card border-0 bg-light p-3">
              <h6 className="text-dark fw-bold mb-3">
                <i className="bx bx-capsule me-2"></i> Prescribed Medicines
              </h6>
              {viewObj.medicines && viewObj.medicines.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm table-borderless mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: "35%" }}>Medicine</th>
                        <th style={{ width: "25%" }}>Dosage</th>
                        <th style={{ width: "20%" }}>Frequency</th>
                        <th style={{ width: "20%" }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewObj.medicines.map((medicine, idx) => (
                        <tr key={idx} className="border-bottom">
                          <td className="fw-bold text-dark">
                            {medicine.name}
                          </td>
                          <td>
                            {medicine.dosage} {medicine.unit}
                          </td>
                          <td>
                            <small className="badge bg-label-info">
                              {medicine.frequency_per_day}x daily
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {medicine.duration_days} days
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No medicines prescribed</p>
              )}
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

export default PrescriptionsViewModal;
