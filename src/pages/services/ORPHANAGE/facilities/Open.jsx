import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { facilitiesData } from "../../../../data/orphanageSampleData";

export const FacilityOpenPage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [facility, setFacility] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    facility_code: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (uid && uid !== "new") {
      const found = facilitiesData.find((f) => f.id === uid);
      if (found) {
        setFacility(found);
        setFormData({
          name: found.name,
          facility_code: found.facility_code,
          address: found.address,
          phone: found.phone,
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
    alert(uid === "new" ? "Facility created successfully!" : "Facility updated successfully!");
    navigate("/orphanage/facilities");
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0">
              {uid === "new" ? "Add New Facility" : "Edit Facility"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Facility Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Facility Code</label>
                <input
                  type="text"
                  className="form-control"
                  name="facility_code"
                  value={formData.facility_code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
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

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bx bx-save"></i> Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/orphanage/facilities")}
                >
                  <i className="bx bx-x"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {facility && (
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Facility Details</h5>
            </div>
            <div className="card-body">
              <p className="mb-3">
                <strong>Code:</strong> <span className="badge bg-label-primary">{facility.facility_code}</span>
              </p>
              <p className="mb-3">
                <strong>Children:</strong> <span className="badge bg-label-success">{facility.children_count}</span>
              </p>
              <p className="mb-3">
                <strong>Staff:</strong> <span className="badge bg-label-info">{facility.staff_count}</span>
              </p>
              <p className="mb-3">
                <strong>Created:</strong> {new Date(facility.created_at).toLocaleDateString()}
              </p>
              <p className="mb-0">
                <strong>Updated:</strong> {new Date(facility.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
