import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { childrenData, facilitiesData } from "../../../../data/orphanageSampleData";

export const ChildrenOpenPage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    child_unique_number: "",
    date_of_birth: "",
    gender: "Male",
    facility_id: "",
  });

  useEffect(() => {
    if (uid && uid !== "new") {
      const found = childrenData.find((c) => c.id === uid);
      if (found) {
        setChild(found);
        setFormData({
          full_name: found.full_name,
          child_unique_number: found.child_unique_number,
          date_of_birth: found.date_of_birth,
          gender: found.gender,
          facility_id: found.facility_id,
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
    alert(uid === "new" ? "Child added successfully!" : "Child record updated successfully!");
    navigate("/orphanage/children");
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              {uid === "new" ? "Add New Child" : "Edit Child Record"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Child Unique Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="child_unique_number"
                    value={formData.child_unique_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-control"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Facility</label>
                <select
                  className="form-control"
                  name="facility_id"
                  value={formData.facility_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a facility</option>
                  {facilitiesData.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bx bx-save"></i> Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/orphanage/children")}
                >
                  <i className="bx bx-x"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {child && (
        <div className="col-lg-4">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title mb-0">Child Information</h5>
            </div>
            <div className="card-body">
              <p className="mb-3">
                <strong>Child ID:</strong> <br />
                <span className="badge bg-label-info">{child.child_unique_number}</span>
              </p>
              <p className="mb-3">
                <strong>Facility:</strong> <br />
                <small>{child.facility_name}</small>
              </p>
              <p className="mb-3">
                <strong>Status:</strong> <br />
                <span className="badge bg-label-success">{child.status.toUpperCase()}</span>
              </p>
              <p className="mb-0">
                <strong>Admission Date:</strong> <br />
                {new Date(child.admission_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Health Records</h5>
            </div>
            <div className="card-body">
              <button className="btn btn-sm btn-outline-primary w-100 mb-2">
                View Hospital Visits
              </button>
              <button className="btn btn-sm btn-outline-success w-100 mb-2">
                View Prescriptions
              </button>
              <button className="btn btn-sm btn-outline-warning w-100">
                View Reminders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
