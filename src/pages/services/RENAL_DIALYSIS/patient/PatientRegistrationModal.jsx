import React, { useState } from "react";

const PatientRegistrationModal = ({ onPatientAdded }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    sex: "",
    date_of_birth: "",
    hospital_reg_no: "",
    phone_number: "",
    email: "",
    next_of_kin: "",
    next_of_kin_relationship: "",
    next_of_kin_phone: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.sex) newErrors.sex = "Gender is required";
    if (!formData.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
    if (!formData.hospital_reg_no.trim())
      newErrors.hospital_reg_no = "Hospital registration number is required";
    if (!formData.phone_number.trim())
      newErrors.phone_number = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.next_of_kin.trim())
      newErrors.next_of_kin = "Next of kin name is required";
    if (!formData.next_of_kin_relationship.trim())
      newErrors.next_of_kin_relationship = "Relationship is required";
    if (!formData.next_of_kin_phone.trim())
      newErrors.next_of_kin_phone = "Next of kin phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onPatientAdded(formData);
      resetForm();
      document.getElementById("closeModal").click();
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      sex: "",
      date_of_birth: "",
      hospital_reg_no: "",
      phone_number: "",
      email: "",
      next_of_kin: "",
      next_of_kin_relationship: "",
      next_of_kin_phone: "",
      status: "active",
    });
    setErrors({});
  };

  return (
    <div
      className="modal fade"
      id="patientRegistrationModal"
      tabIndex="-1"
      aria-labelledby="patientRegistrationModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          {/* Header */}
          <div className="modal-header bg-gradient-primary border-0">
            <div>
              <h5
                className="modal-title text-white fw-bold"
                id="patientRegistrationModalLabel"
              >
                <i className="bx bx-user-plus me-2"></i>
                Register New Patient
              </h5>
              <small className="text-white-50">
                Complete patient information for dialysis treatment
              </small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => resetForm()}
            ></button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* Personal Information Section */}
              <h6 className="fw-bold mb-3 text-uppercase text-muted small border-bottom pb-2">
                <i className="bx bx-user-circle me-2 text-primary"></i>
                Personal Information
              </h6>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      errors.first_name ? "is-invalid" : ""
                    }`}
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First name"
                  />
                  {errors.first_name && (
                    <div className="invalid-feedback d-block">
                      {errors.first_name}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      errors.last_name ? "is-invalid" : ""
                    }`}
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last name"
                  />
                  {errors.last_name && (
                    <div className="invalid-feedback d-block">
                      {errors.last_name}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select form-select-lg ${
                      errors.sex ? "is-invalid" : ""
                    }`}
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                  >
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  {errors.sex && (
                    <div className="invalid-feedback d-block">{errors.sex}</div>
                  )}
                </div>

                <div className="col-md-8">
                  <label className="form-label fw-semibold">
                    Date of Birth <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control form-control-lg ${
                      errors.date_of_birth ? "is-invalid" : ""
                    }`}
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                  />
                  {errors.date_of_birth && (
                    <div className="invalid-feedback d-block">
                      {errors.date_of_birth}
                    </div>
                  )}
                </div>
              </div>

              {/* Hospital Information Section */}
              <h6 className="fw-bold mb-3 text-uppercase text-muted small border-bottom pb-2">
                <i className="bx bx-hospital me-2 text-primary"></i>
                Hospital Information
              </h6>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Hospital Reg No <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      errors.hospital_reg_no ? "is-invalid" : ""
                    }`}
                    name="hospital_reg_no"
                    value={formData.hospital_reg_no}
                    onChange={handleInputChange}
                    placeholder="e.g., MNH/REN/001001"
                  />
                  {errors.hospital_reg_no && (
                    <div className="invalid-feedback d-block">
                      {errors.hospital_reg_no}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Status
                  </label>
                  <select
                    className="form-select form-select-lg"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Contact Information Section */}
              <h6 className="fw-bold mb-3 text-uppercase text-muted small border-bottom pb-2">
                <i className="bx bx-phone me-2 text-primary"></i>
                Contact Information
              </h6>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`form-control form-control-lg ${
                      errors.phone_number ? "is-invalid" : ""
                    }`}
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="0754123456"
                  />
                  {errors.phone_number && (
                    <div className="invalid-feedback d-block">
                      {errors.phone_number}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control form-control-lg ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="patient@email.com"
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Next of Kin Section */}
              <h6 className="fw-bold mb-3 text-uppercase text-muted small border-bottom pb-2">
                <i className="bx bx-user me-2 text-primary"></i>
                Next of Kin
              </h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      errors.next_of_kin ? "is-invalid" : ""
                    }`}
                    name="next_of_kin"
                    value={formData.next_of_kin}
                    onChange={handleInputChange}
                    placeholder="Full name"
                  />
                  {errors.next_of_kin && (
                    <div className="invalid-feedback d-block">
                      {errors.next_of_kin}
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Relationship <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select form-select-lg ${
                      errors.next_of_kin_relationship ? "is-invalid" : ""
                    }`}
                    name="next_of_kin_relationship"
                    value={formData.next_of_kin_relationship}
                    onChange={handleInputChange}
                  >
                    <option value="">Select relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.next_of_kin_relationship && (
                    <div className="invalid-feedback d-block">
                      {errors.next_of_kin_relationship}
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`form-control form-control-lg ${
                      errors.next_of_kin_phone ? "is-invalid" : ""
                    }`}
                    name="next_of_kin_phone"
                    value={formData.next_of_kin_phone}
                    onChange={handleInputChange}
                    placeholder="0754888999"
                  />
                  {errors.next_of_kin_phone && (
                    <div className="invalid-feedback d-block">
                      {errors.next_of_kin_phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="alert alert-info-subtle border-info mt-4">
                <i className="bx bx-info-circle me-2"></i>
                <strong>Note:</strong> Dialysis visits can be recorded after
                patient registration is complete.
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer bg-light border-top pt-4 pb-4 px-4">
              <div className="d-flex gap-2 w-100">
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-auto"
                  data-bs-dismiss="modal"
                  onClick={() => resetForm()}
                  id="closeModal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bx bx-check me-2"></i>Register Patient
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
        }

        .modal-header {
          padding: 1.5rem;
        }

        .modal-body {
          background: #fff;
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }

        .invalid-feedback {
          color: #dc3545;
        }

        .alert-info-subtle {
          background-color: #cff4fc;
          border-color: #0dcaf0;
          color: #055160;
        }
      `}</style>
    </div>
  );
};

export default PatientRegistrationModal;
