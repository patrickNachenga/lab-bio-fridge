import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  hospitalVisitsData,
  childrenData,
  hospitalsData,
  staffData,
} from "../../../../data/orphanageSampleData";

export const HospitalVisitsOpenPage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState(null);
  const [formData, setFormData] = useState({
    child_id: "",
    hospital_id: "",
    doctor_id: "",
    caretaker_id: "",
    visit_date: "",
    next_visit_date: "",
    notes: "",
    status: "pending",
  });

  useEffect(() => {
    if (uid && uid !== "new") {
      const found = hospitalVisitsData.find((v) => v.id === uid);
      if (found) {
        setVisit(found);
        setFormData({
          child_id: found.child_id,
          hospital_id: found.hospital_id,
          doctor_id: found.doctor_id,
          caretaker_id: found.caretaker_id,
          visit_date: found.visit_date.split("T")[0],
          next_visit_date: found.next_visit_date,
          notes: found.notes,
          status: found.status,
        });
      }
    }
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      uid === "new"
        ? "Hospital visit recorded successfully!"
        : "Hospital visit updated successfully!"
    );
    navigate("/orphanage/hospital-visits");
  };

  const doctors = staffData.filter((s) => s.role === "Medical Officer");

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              {uid === "new" ? "Record New Hospital Visit" : "Edit Hospital Visit"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Child</label>
                  <select
                    className="form-control"
                    name="child_id"
                    value={formData.child_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a child</option>
                    {childrenData.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Hospital</label>
                  <select
                    className="form-control"
                    name="hospital_id"
                    value={formData.hospital_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a hospital</option>
                    {hospitalsData.map((hosp) => (
                      <option key={hosp.id} value={hosp.id}>
                        {hosp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Doctor</label>
                  <select
                    className="form-control"
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Caretaker</label>
                  <select
                    className="form-control"
                    name="caretaker_id"
                    value={formData.caretaker_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a caretaker</option>
                    {staffData
                      .filter((s) => s.role === "Caretaker")
                      .map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.full_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Visit Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="visit_date"
                    value={formData.visit_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Next Visit Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="next_visit_date"
                    value={formData.next_visit_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  name="notes"
                  rows="4"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter any notes about the visit..."
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bx bx-save"></i> Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/orphanage/hospital-visits")}
                >
                  <i className="bx bx-x"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {visit && (
        <div className="col-lg-4">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title mb-0">Visit Details</h5>
            </div>
            <div className="card-body">
              <p className="mb-3">
                <strong>Child:</strong> <br />
                <small>{visit.child_name}</small>
              </p>
              <p className="mb-3">
                <strong>Hospital:</strong> <br />
                <small>{visit.hospital_name}</small>
              </p>
              <p className="mb-3">
                <strong>Doctor:</strong> <br />
                <small>{visit.doctor_name}</small>
              </p>
              <p className="mb-3">
                <strong>Status:</strong> <br />
                <span
                  className={`badge bg-label-${
                    visit.status === "completed" ? "success" : "warning"
                  }`}
                >
                  {visit.status.toUpperCase()}
                </span>
              </p>
              <p className="mb-0">
                <strong>Created:</strong> <br />
                {new Date(visit.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Related Records</h5>
            </div>
            <div className="card-body">
              <button className="btn btn-sm btn-outline-primary w-100 mb-2">
                View Prescription
              </button>
              <button className="btn btn-sm btn-outline-success w-100">
                Create Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
