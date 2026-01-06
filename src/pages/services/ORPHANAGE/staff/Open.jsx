import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { staffData, facilitiesData } from "../../../../data/orphanageSampleData";

export const StaffOpenPage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    role: "Caretaker",
    phone: "",
    email: "",
    facility_id: "",
    is_external: false,
  });

  useEffect(() => {
    if (uid && uid !== "new") {
      const found = staffData.find((s) => s.id === uid);
      if (found) {
        setStaff(found);
        setFormData({
          full_name: found.full_name,
          role: found.role,
          phone: found.phone,
          email: found.email,
          facility_id: found.facility_id,
          is_external: found.is_external,
        });
      }
    }
  }, [uid]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(uid === "new" ? "Staff added successfully!" : "Staff record updated successfully!");
    navigate("/orphanage/staff");
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              {uid === "new" ? "Add New Staff" : "Edit Staff Record"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
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

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-control"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="Caretaker">Caretaker</option>
                    <option value="Medical Officer">Medical Officer</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Cook">Cook</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
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
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isExternal"
                    name="is_external"
                    checked={formData.is_external}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isExternal">
                    External Staff Member (e.g., Visiting Doctor)
                  </label>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bx bx-save"></i> Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/orphanage/staff")}
                >
                  <i className="bx bx-x"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {staff && (
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Staff Details</h5>
            </div>
            <div className="card-body">
              <p className="mb-3">
                <strong>Role:</strong> <br />
                <span className="badge bg-label-primary">{staff.role}</span>
              </p>
              <p className="mb-3">
                <strong>Facility:</strong> <br />
                <small>{staff.facility_name}</small>
              </p>
              <p className="mb-3">
                <strong>Type:</strong> <br />
                <span className="badge bg-label-info">{staff.is_external ? "External" : "Internal"}</span>
              </p>
              <p className="mb-3">
                <strong>Status:</strong> <br />
                <span className="badge bg-label-success">{staff.status.toUpperCase()}</span>
              </p>
              <p className="mb-0">
                <strong>Hire Date:</strong> <br />
                {new Date(staff.hire_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
