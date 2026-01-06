import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { HospitalsContext } from "../../../../utils/context";
import showToast from "../../../../helpers/ToastHelper";

const HospitalsModal = () => {
  const { selectedObj, setSelectedObj, tableRefresh, setTableRefresh } =
    useContext(HospitalsContext);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Hospital name is required"),
    address: Yup.string().required("Address is required"),
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email("Invalid email"),
    city: Yup.string().required("City is required"),
    region: Yup.string().required("Region is required"),
  });

  const initialValues = {
    name: selectedObj?.name || "",
    address: selectedObj?.address || "",
    phone: selectedObj?.phone || "",
    email: selectedObj?.email || "",
    city: selectedObj?.city || "",
    region: selectedObj?.region || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (selectedObj?.id) {
        showToast("success", "Hospital updated successfully");
      } else {
        showToast("success", "Hospital added successfully");
      }
      setTableRefresh((prev) => prev + 1);
      resetForm();
      setSelectedObj(null);
      setSubmitting(false);
    } catch (error) {
      showToast("error", error.message || "An error occurred");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="hospitalsModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="hospitalsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-gradient-danger">
            <h5 className="modal-title text-white" id="hospitalsModalLabel">
              <i className="bx bx-hospital me-2"></i>
              {selectedObj?.id ? "Edit Hospital" : "Add New Hospital"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              onClick={() => setSelectedObj(null)}
            ></button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Hospital Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      className={`form-control ${
                        touched.name && errors.name ? "is-invalid" : ""
                      }`}
                      name="name"
                      placeholder="e.g., Nairobi General Hospital"
                    />
                    <ErrorMessage name="name">
                      {(msg) => (
                        <div className="invalid-feedback d-block">{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        City <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control ${
                          touched.city && errors.city ? "is-invalid" : ""
                        }`}
                        name="city"
                        placeholder="City"
                      />
                      <ErrorMessage name="city">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Region <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control ${
                          touched.region && errors.region ? "is-invalid" : ""
                        }`}
                        name="region"
                        placeholder="e.g., Nairobi County"
                      />
                      <ErrorMessage name="region">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="tel"
                        className={`form-control ${
                          touched.phone && errors.phone ? "is-invalid" : ""
                        }`}
                        name="phone"
                        placeholder="+254..."
                      />
                      <ErrorMessage name="phone">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Email</label>
                      <Field
                        type="email"
                        className={`form-control ${
                          touched.email && errors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        placeholder="info@hospital.org"
                      />
                      <ErrorMessage name="email">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Address <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="textarea"
                      className={`form-control ${
                        touched.address && errors.address ? "is-invalid" : ""
                      }`}
                      name="address"
                      placeholder="Full address"
                      rows="3"
                    />
                    <ErrorMessage name="address">
                      {(msg) => (
                        <div className="invalid-feedback d-block">{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => setSelectedObj(null)}
                  >
                    <i className="bx bx-x me-1"></i> Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={isSubmitting}
                  >
                    <i className="bx bx-check me-1"></i>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default HospitalsModal;
