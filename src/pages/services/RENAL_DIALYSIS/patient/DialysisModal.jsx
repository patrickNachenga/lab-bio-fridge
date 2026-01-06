import React, { useState } from "react";

const DialysisModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    visit_date: new Date().toISOString().split("T")[0],
    ward: "Renal Ward",
    diagnosis: "",
    attending_doctor: "",
    pre_dialysis: {
      weight: "",
      height_cm: "",
      standing_bp: "",
      resting_bp: "",
      pulse: "",
      temperature: "",
    },
    dialysis_order: {
      hours_of_dialysis: 4,
      target_weight_loss: "",
      heparin_units: 5000,
    },
    dialysis_session: {
      machine_type: "",
      dialyzer_type: "",
      started_by: "",
    },
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.visit_date) newErrors.visit_date = "Visit date is required";
      if (!formData.diagnosis) newErrors.diagnosis = "Diagnosis is required";
      if (!formData.attending_doctor)
        newErrors.attending_doctor = "Doctor name is required";
    }

    if (currentStep === 2) {
      if (!formData.pre_dialysis.weight)
        newErrors["pre_dialysis.weight"] = "Weight is required";
      if (!formData.pre_dialysis.standing_bp)
        newErrors["pre_dialysis.standing_bp"] = "BP is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      console.log("Form submitted:", formData);
      // Here you would typically send data to backend
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      visit_date: new Date().toISOString().split("T")[0],
      ward: "Renal Ward",
      diagnosis: "",
      attending_doctor: "",
      pre_dialysis: {
        weight: "",
        height_cm: "",
        standing_bp: "",
        resting_bp: "",
        pulse: "",
        temperature: "",
      },
      dialysis_order: {
        hours_of_dialysis: 4,
        target_weight_loss: "",
        heparin_units: 5000,
      },
      dialysis_session: {
        machine_type: "",
        dialyzer_type: "",
        started_by: "",
      },
    });
    setStep(1);
    setErrors({});
  };

  return (
    <div
      className="modal fade"
      id="dialysisModal"
      tabIndex="-1"
      aria-labelledby="dialysisModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          {/* Header */}
          <div className="modal-header bg-gradient-primary border-0">
            <div>
              <h5 className="modal-title text-white fw-bold" id="dialysisModalLabel">
                <i className="bx bx-plus-circle me-2"></i>
                New Dialysis Visit
              </h5>
              <small className="text-white-50">Step {step} of 3</small>
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
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="animate__animated animate__fadeIn animate__faster">
                  <h6 className="fw-bold mb-3">
                    <i className="bx bx-info-circle me-2 text-primary"></i>
                    Basic Information
                  </h6>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Visit Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control form-control-lg ${
                        errors.visit_date ? "is-invalid" : ""
                      }`}
                      name="visit_date"
                      value={formData.visit_date}
                      onChange={handleInputChange}
                    />
                    {errors.visit_date && (
                      <div className="invalid-feedback d-block">
                        {errors.visit_date}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Ward <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Diagnosis <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select form-select-lg ${
                        errors.diagnosis ? "is-invalid" : ""
                      }`}
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                    >
                      <option value="">Select diagnosis...</option>
                      <option value="CKD Stage 3">CKD Stage 3</option>
                      <option value="CKD Stage 4">CKD Stage 4</option>
                      <option value="CKD Stage 5">CKD Stage 5</option>
                      <option value="ESRD">ESRD</option>
                      <option value="Acute Kidney Injury">
                        Acute Kidney Injury
                      </option>
                    </select>
                    {errors.diagnosis && (
                      <div className="invalid-feedback d-block">
                        {errors.diagnosis}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Attending Doctor <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${
                        errors.attending_doctor ? "is-invalid" : ""
                      }`}
                      name="attending_doctor"
                      placeholder="Dr. Name"
                      value={formData.attending_doctor}
                      onChange={handleInputChange}
                    />
                    {errors.attending_doctor && (
                      <div className="invalid-feedback d-block">
                        {errors.attending_doctor}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Pre-Dialysis Vitals */}
              {step === 2 && (
                <div className="animate__animated animate__fadeIn animate__faster">
                  <h6 className="fw-bold mb-3">
                    <i className="bx bx-heart me-2 text-danger"></i>
                    Pre-Dialysis Vital Signs
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Weight (kg) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className={`form-control form-control-lg ${
                          errors["pre_dialysis.weight"] ? "is-invalid" : ""
                        }`}
                        name="pre_dialysis.weight"
                        placeholder="64.5"
                        value={formData.pre_dialysis.weight}
                        onChange={handleInputChange}
                      />
                      {errors["pre_dialysis.weight"] && (
                        <div className="invalid-feedback d-block">
                          {errors["pre_dialysis.weight"]}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="pre_dialysis.height_cm"
                        placeholder="160"
                        value={formData.pre_dialysis.height_cm}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Standing BP <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${
                          errors["pre_dialysis.standing_bp"] ? "is-invalid" : ""
                        }`}
                        name="pre_dialysis.standing_bp"
                        placeholder="150/90"
                        value={formData.pre_dialysis.standing_bp}
                        onChange={handleInputChange}
                      />
                      {errors["pre_dialysis.standing_bp"] && (
                        <div className="invalid-feedback d-block">
                          {errors["pre_dialysis.standing_bp"]}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Resting BP
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="pre_dialysis.resting_bp"
                        placeholder="145/85"
                        value={formData.pre_dialysis.resting_bp}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Pulse (bpm)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="pre_dialysis.pulse"
                        placeholder="88"
                        value={formData.pre_dialysis.pulse}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">
                        Temperature (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control form-control-lg"
                        name="pre_dialysis.temperature"
                        placeholder="36.8"
                        value={formData.pre_dialysis.temperature}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">SpO2 (%)</label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="pre_dialysis.spo2"
                        placeholder="97"
                        value={formData.pre_dialysis.spo2}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Dialysis Parameters */}
              {step === 3 && (
                <div className="animate__animated animate__fadeIn animate__faster">
                  <h6 className="fw-bold mb-3">
                    <i className="bx bx-flask me-2 text-success"></i>
                    Dialysis Parameters
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Machine Type
                      </label>
                      <select
                        className="form-select form-select-lg"
                        name="dialysis_session.machine_type"
                        value={formData.dialysis_session.machine_type}
                        onChange={handleInputChange}
                      >
                        <option value="">Select machine...</option>
                        <option value="Fresenius 4008S">Fresenius 4008S</option>
                        <option value="Baxter AS90">Baxter AS90</option>
                        <option value="Nippon NXe">Nippon NXe</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Dialyzer Type
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="dialysis_session.dialyzer_type"
                        placeholder="FX80"
                        value={formData.dialysis_session.dialyzer_type}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Started By
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="dialysis_session.started_by"
                        placeholder="Nurse Name"
                        value={formData.dialysis_session.started_by}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Hours of Dialysis
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        className="form-control form-control-lg"
                        name="dialysis_order.hours_of_dialysis"
                        value={formData.dialysis_order.hours_of_dialysis}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Target Weight Loss (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-control form-control-lg"
                        name="dialysis_order.target_weight_loss"
                        placeholder="2.5"
                        value={formData.dialysis_order.target_weight_loss}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Heparin Units
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg"
                        name="dialysis_order.heparin_units"
                        value={formData.dialysis_order.heparin_units}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="alert alert-info-subtle border-info">
                    <i className="bx bx-info-circle me-2"></i>
                    <strong>Note:</strong> Complete vital signs will be recorded
                    during the session. Additional session details can be added
                    after the visit is created.
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer bg-light border-top pt-4 pb-4 px-4">
              <div className="d-flex gap-2 w-100">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handlePrev}
                  disabled={step === 1}
                >
                  <i className="bx bx-chevron-left me-2"></i>Previous
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary ms-auto"
                  data-bs-dismiss="modal"
                  onClick={() => resetForm()}
                >
                  Cancel
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next<i className="bx bx-chevron-right ms-2"></i>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success">
                    <i className="bx bx-check me-2"></i>Create Visit
                  </button>
                )}
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

export default DialysisModal;
