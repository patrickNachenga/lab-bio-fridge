import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { HospitalVisitsContext } from "../../../../utils/context";
import {
  childrenData,
  hospitalsData,
  staffData,
} from "../../../../data/orphanageSampleData";
import showToast from "../../../../helpers/ToastHelper";

const HospitalVisitsModal = () => {
  const { selectedObj, setSelectedObj, tableRefresh, setTableRefresh } =
    useContext(HospitalVisitsContext);

  const validationSchema = Yup.object().shape({
    child_id: Yup.string().required("Child is required"),
    hospital_id: Yup.string().required("Hospital is required"),
    doctor_id: Yup.string().required("Doctor is required"),
    visit_date: Yup.date().required("Visit date is required"),
    next_visit_date: Yup.date().required("Next visit date is required"),
    diagnosis: Yup.string().required("Diagnosis is required"),
    notes: Yup.string().required("Notes are required"),
  });

  const initialValues = {
    child_id: selectedObj?.child_id || "",
    hospital_id: selectedObj?.hospital_id || "",
    doctor_id: selectedObj?.doctor_id || "",
    caretaker_id: selectedObj?.caretaker_id || "",
    visit_date: selectedObj?.visit_date
      ? selectedObj.visit_date.split("T")[0]
      : "",
    next_visit_date: selectedObj?.next_visit_date || "",
    diagnosis: selectedObj?.diagnosis || "",
    notes: selectedObj?.notes || "",
    status: selectedObj?.status || "pending",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (selectedObj?.id) {
        showToast("success", "Hospital visit updated successfully");
      } else {
        showToast("success", "Hospital visit recorded successfully");
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

  const getCaretakersForChild = (childId) => {
    // In a real app, this would return carers/staff assigned to the facility
    return staffData.filter((s) => s.role === "Caretaker");
  };

  return (
    <div
      className="modal fade"
      id="hospitalVisitsModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="hospitalVisitsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-gradient-warning">
            <h5 className="modal-title text-white" id="hospitalVisitsModalLabel">
              <i className="bx bx-clinic me-2"></i>
              {selectedObj?.id ? "Edit Hospital Visit" : "Record Hospital Visit"}
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
            {({ isSubmitting, errors, touched, values }) => (
              <Form>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Child <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className={`form-control ${
                          touched.child_id && errors.child_id
                            ? "is-invalid"
                            : ""
                        }`}
                        name="child_id"
                      >
                        <option value="">Select Child</option>
                        {childrenData.map((child) => (
                          <option key={child.id} value={child.id}>
                            {child.full_name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="child_id">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Hospital <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className={`form-control ${
                          touched.hospital_id && errors.hospital_id
                            ? "is-invalid"
                            : ""
                        }`}
                        name="hospital_id"
                      >
                        <option value="">Select Hospital</option>
                        {hospitalsData.map((hospital) => (
                          <option key={hospital.id} value={hospital.id}>
                            {hospital.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="hospital_id">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Doctor <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className={`form-control ${
                          touched.doctor_id && errors.doctor_id
                            ? "is-invalid"
                            : ""
                        }`}
                        name="doctor_id"
                      >
                        <option value="">Select Doctor</option>
                        {staffData
                          .filter((s) => s.role === "Medical Officer")
                          .map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              {doctor.full_name}
                            </option>
                          ))}
                      </Field>
                      <ErrorMessage name="doctor_id">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Caretaker</label>
                      <Field
                        as="select"
                        className="form-control"
                        name="caretaker_id"
                      >
                        <option value="">Select Caretaker</option>
                        {getCaretakersForChild(values.child_id).map(
                          (caretaker) => (
                            <option key={caretaker.id} value={caretaker.id}>
                              {caretaker.full_name}
                            </option>
                          )
                        )}
                      </Field>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Visit Date <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="datetime-local"
                        className={`form-control ${
                          touched.visit_date && errors.visit_date
                            ? "is-invalid"
                            : ""
                        }`}
                        name="visit_date"
                      />
                      <ErrorMessage name="visit_date">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Next Visit Date <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="date"
                        className={`form-control ${
                          touched.next_visit_date && errors.next_visit_date
                            ? "is-invalid"
                            : ""
                        }`}
                        name="next_visit_date"
                      />
                      <ErrorMessage name="next_visit_date">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Diagnosis <span className="text-danger">*</span>
                      </label>
                      <Field
                        type="text"
                        className={`form-control ${
                          touched.diagnosis && errors.diagnosis
                            ? "is-invalid"
                            : ""
                        }`}
                        name="diagnosis"
                        placeholder="e.g., Respiratory Infection"
                      />
                      <ErrorMessage name="diagnosis">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Status</label>
                      <Field
                        as="select"
                        className="form-control"
                        name="status"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </Field>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Notes <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="textarea"
                      className={`form-control ${
                        touched.notes && errors.notes ? "is-invalid" : ""
                      }`}
                      name="notes"
                      placeholder="Visit details and recommendations"
                      rows="3"
                    />
                    <ErrorMessage name="notes">
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
                    className="btn btn-warning"
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

export default HospitalVisitsModal;
