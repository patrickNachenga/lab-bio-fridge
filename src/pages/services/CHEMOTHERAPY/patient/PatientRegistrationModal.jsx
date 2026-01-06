import React, { useState } from "react";

const PatientRegistrationModal = ({ onPatientAdded }) => {
  const [formData, setFormData] = useState({
    hospital_reg_no: "",
    first_name: "",
    last_name: "",
    sex: "F",
    date_of_birth: "",
    phone_number: "",
    email: "",
    address: "",
    next_of_kin: "",
    next_of_kin_relationship: "",
    next_of_kin_phone: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (
      !formData.hospital_reg_no ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.date_of_birth ||
      !formData.phone_number
    ) {
      alert("Please fill in all required fields");
      return;
    }

    onPatientAdded(formData);

    // Reset form
    setFormData({
      hospital_reg_no: "",
      first_name: "",
      last_name: "",
      sex: "F",
      date_of_birth: "",
      phone_number: "",
      email: "",
      address: "",
      next_of_kin: "",
      next_of_kin_relationship: "",
      next_of_kin_phone: "",
      status: "active",
    });

    // Close modal
    const modal = document.getElementById("patientRegistrationModal");
    const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  };

  return (
    <div
      className="modal fade"
      id="patientRegistrationModal"
      tabIndex="-1"
      aria-labelledby="patientRegistrationLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content border-0">
          <div
            className="modal-header p-4 border-0"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            <h5 className="modal-title text-white fw-bold" id="patientRegistrationLabel">
              <i className="bx bx-user-plus me-2"></i>Register New Patient
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                {/* Hospital Registration Number */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Hospital Reg No. <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="hospital_reg_no"
                    placeholder="MNH-ONC-XXXXX"
                    value={formData.hospital_reg_no}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* First Name */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Gender */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">Gender</label>
                  <select
                    className="form-select"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                  >
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone_number"
                    placeholder="+255..."
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Address */}
                <div className="col-12">
                  <label className="form-label fw-medium">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    placeholder="Street, City, Region"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                {/* Next of Kin */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">Next of Kin Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="next_of_kin"
                    placeholder="Full name"
                    value={formData.next_of_kin}
                    onChange={handleChange}
                  />
                </div>

                {/* Next of Kin Relationship */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">Relationship</label>
                  <select
                    className="form-select"
                    name="next_of_kin_relationship"
                    value={formData.next_of_kin_relationship}
                    onChange={handleChange}
                  >
                    <option value="">-- Select --</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Next of Kin Phone */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">Next of Kin Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="next_of_kin_phone"
                    placeholder="+255..."
                    value={formData.next_of_kin_phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label fw-medium">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer p-4 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bx bx-user-check me-2"></i>Register Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistrationModal;
