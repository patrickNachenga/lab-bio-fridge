import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { StaffContext } from "../../../../utils/context";
import { facilitiesData } from "../../../../data/orphanageSampleData";
import showToast from "../../../../helpers/ToastHelper";

const StaffModal = () => {
  const { selectedObj, setSelectedObj, tableRefresh, setTableRefresh } =
    useContext(StaffContext);

  const validationSchema = Yup.object().shape({
    full_name: Yup.string().required("Full name is required"),
    role: Yup.string().required("Role is required"),
    phone: Yup.string().required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    facility_id: Yup.string().required("Facility is required"),
  });

  const initialValues = {
    full_name: selectedObj?.full_name || "",
    role: selectedObj?.role || "",
    phone: selectedObj?.phone || "",
    email: selectedObj?.email || "",
    facility_id: selectedObj?.facility_id || "",
    is_external: selectedObj?.is_external || false,
    department: selectedObj?.department || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (selectedObj?.id) {
        showToast("success", "Staff member updated successfully");
      } else {
        showToast("success", "Staff member added successfully");
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
      id="staffModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="staffModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-gradient-info">
            <h5 className="modal-title text-white" id="staffModalLabel">
              <i className="bx bx-user-check me-2"></i>
              {selectedObj?.id ? "Edit Staff Member" : "Add New Staff Member"}
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
                        placeholder="email@example.com"
                      />
                      <ErrorMessage name="email">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Role <span className="text-danger">*</span>
                      </label>
                      <Field
                        as="select"
                        className={`form-control ${
                          touched.role && errors.role ? "is-invalid" : ""
                        }`}
                        name="role"
                      >
                        <option value="">Select Role</option>
                        <option value="Caretaker">Caretaker</option>
                        <option value="Medical Officer">Medical Officer</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Cook">Cook</option>
                        <option value="Cleaner">Cleaner</option>
                      </Field>
                      <ErrorMessage name="role">
                        {(msg) => (
                          <div className="invalid-feedback d-block">{msg}</div>
                        )}
                      </ErrorMessage>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">
                        Department
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        name="department"
                        placeholder="e.g., Childcare, Health"
                      />
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
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <Field
                        type="checkbox"
                        className="form-check-input"
                        id="isExternal"
                        name="is_external"
                      />
                      <label className="form-check-label" htmlFor="isExternal">
                        External Staff (Contract)
                      </label>
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
                    className="btn btn-info"
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

export default StaffModal;
