import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ChildrenContext } from "../../../../utils/context";
import { facilitiesData } from "../../../../data/orphanageSampleData";
import showToast from "../../../../helpers/ToastHelper";

const ChildrenModal = () => {
  const { selectedObj, setSelectedObj, tableRefresh, setTableRefresh } =
    useContext(ChildrenContext);

  const validationSchema = Yup.object().shape({
    child_unique_number: Yup.string().required("Child number is required"),
    full_name: Yup.string().required("Full name is required"),
    date_of_birth: Yup.date().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required"),
    facility_id: Yup.string().required("Facility is required"),
    admission_date: Yup.date().required("Admission date is required"),
    contact_person: Yup.string().required("Contact person is required"),
    contact_phone: Yup.string().required("Contact phone is required"),
  });

  const initialValues = {
    child_unique_number: selectedObj?.child_unique_number || "",
    full_name: selectedObj?.full_name || "",
    date_of_birth: selectedObj?.date_of_birth || "",
    gender: selectedObj?.gender || "Male",
    facility_id: selectedObj?.facility_id || "",
    admission_date: selectedObj?.admission_date || "",
    health_status: selectedObj?.health_status || "Good",
    contact_person: selectedObj?.contact_person || "",
    contact_phone: selectedObj?.contact_phone || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (selectedObj?.id) {
        showToast("success", "Child record updated successfully");
      } else {
        showToast("success", "Child record created successfully");
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
      id="childrenModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="childrenModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-gradient-success">
            <h5 className="modal-title text-white" id="childrenModalLabel">
              <i className="bx bx-group me-2"></i>
              {selectedObj?.id ? "Edit Child Record" : "Add New Child"}
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
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Child Number <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control ${
                          touched.child_unique_number &&
                          errors.child_unique_number
                            ? "is-invalid"
                            : ""
                        }`}
                        name="child_unique_number"
                        placeholder="e.g., CHD-KLA-2020-001"
                      />
                      <ErrorMessage name="child_unique_number">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control ${
                          touched.full_name && errors.full_name
                            ? "is-invalid"
                            : ""
                        }`}
                        name="full_name"
                        placeholder="Full name"
                      />
                      <ErrorMessage name="full_name">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        Date of Birth <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="date"
                        className={`form-control ${
                          touched.date_of_birth && errors.date_of_birth
                            ? "is-invalid"
                            : ""
                        }`}
                        name="date_of_birth"
                      />
                      <ErrorMessage name="date_of_birth">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        Gender <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className={`form-control ${
                          touched.gender && errors.gender ? "is-invalid" : ""
                        }`}
                        name="gender"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Field>
                      <ErrorMessage name="gender">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-bold">
                        Health Status
                      </label>
                      <Field
                        as="select"
                        className="form-control"
                        name="health_status"
                      >
                        <option value="Good">Good</option>
                        <option value="Stable">Stable</option>
                        <option value="At Risk">At Risk</option>
                      </Field>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Facility <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className={`form-control ${
                          touched.facility_id && errors.facility_id
                            ? "is-invalid"
                            : ""
                        }`}
                        name="facility_id"
                      >
                        <option value="">Select Facility</option>
                        {facilitiesData.map((facility) => (
                          <option key={facility.id} value={facility.id}>
                            {facility.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="facility_id">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Admission Date <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="date"
                        className={`form-control ${
                          touched.admission_date && errors.admission_date
                            ? "is-invalid"
                            : ""
                        }`}
                        name="admission_date"
                      />
                      <ErrorMessage name="admission_date">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Contact Person <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control ${
                          touched.contact_person && errors.contact_person
                            ? "is-invalid"
                            : ""
                        }`}
                        name="contact_person"
                        placeholder="Parent/Guardian name"
                      />
                      <ErrorMessage name="contact_person">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Contact Phone <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="tel"
                        className={`form-control ${
                          touched.contact_phone && errors.contact_phone
                            ? "is-invalid"
                            : ""
                        }`}
                        name="contact_phone"
                        placeholder="+254..."
                      />
                      <ErrorMessage name="contact_phone">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>
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
                    className="btn btn-success"
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

export default ChildrenModal;
