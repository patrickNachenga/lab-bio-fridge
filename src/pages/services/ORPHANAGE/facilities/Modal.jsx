import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { FacilitiesContext } from "../../../../utils/context";
import showToast from "../../../../helpers/ToastHelper";

const FacilitiesModal = () => {
  const { selectedObj, setSelectedObj, tableRefresh, setTableRefresh } =
    useContext(FacilitiesContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    facility_code: Yup.string().required("Facility code is required"),
    name: Yup.string().required("Facility name is required"),
    address: Yup.string().required("Address is required"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\+?[0-9]{1,15}$/, "Invalid phone number"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
  });

  const initialValues = {
    facility_code: selectedObj?.facility_code || "",
    name: selectedObj?.name || "",
    address: selectedObj?.address || "",
    phone: selectedObj?.phone || "",
    email: selectedObj?.email || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (selectedObj?.id) {
        showToast("success", "Facility updated successfully");
      } else {
        showToast("success", "Facility created successfully");
      }
      setTableRefresh((prev) => prev + 1);
      resetForm();
      setSelectedObj(null);
      setIsModalOpen(false);
      setSubmitting(false);
    } catch (error) {
      showToast("error", error.message || "An error occurred");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedObj !== null) {
      setIsModalOpen(true);
    }
  }, [selectedObj]);

  return (
    <div
      className="modal fade"
      id="facilitiesModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="facilitiesModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-gradient-primary">
            <h5 className="modal-title text-white" id="facilitiesModalLabel">
              <i className="bx bx-building me-2"></i>
              {selectedObj?.id ? "Edit Facility" : "Add New Facility"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              onClick={() => {
                setSelectedObj(null);
                setIsModalOpen(false);
              }}
            ></button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values, errors, touched }) => (
              <Form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Facility Code <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control ${
                          touched.facility_code && errors.facility_code
                            ? "is-invalid"
                            : ""
                        }`}
                        name="facility_code"
                        placeholder="e.g., ORF-KLA-001"
                      />
                      <ErrorMessage name="facility_code">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Facility Name <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control ${
                          touched.name && errors.name ? "is-invalid" : ""
                        }`}
                        name="name"
                        placeholder="Facility name"
                      />
                      <ErrorMessage name="name">
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
                      <label className="form-label fw-bold">
                        Email <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="email"
                        className={`form-control ${
                          touched.email && errors.email ? "is-invalid" : ""
                        }`}
                        name="email"
                        placeholder="info@facility.org"
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
                    onClick={() => {
                      setSelectedObj(null);
                      setIsModalOpen(false);
                    }}
                  >
                    <i className="bx bx-x me-1"></i> Close
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
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

export default FacilitiesModal;
