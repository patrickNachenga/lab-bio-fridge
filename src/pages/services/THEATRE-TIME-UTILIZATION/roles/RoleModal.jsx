import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { ShieldCheck } from "lucide-react";
import GraphqlModal from "../../../../components/GraphqlModal";
import showToast from "../../../../helpers/ToastHelper";
import { useRegisterTheatreRolesMutation } from "../../../../features/theatre/theatreGraphqlApi";

const roleValidationSchema = Yup.object().shape({
  name: Yup.string().required("Role name is required"),
  description: Yup.string(),
});

const FieldError = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
  </ErrorMessage>
);

const RoleModal = ({ role, onSuccess, onClose }) => {
  const initialValues = role || { name: "", description: "" };
  const [registerTheatreRoles] = useRegisterTheatreRolesMutation();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const result = await registerTheatreRoles([values]).unwrap();
      if (result?.status === false) {
        throw new Error(result?.message || "GraphQL request failed");
      }
      showToast("Role saved successfully", "success", "Complete");
      resetForm();
      if (onSuccess) onSuccess();
      onClose?.();
    } catch (error) {
      console.error("Error saving role:", error);
      showToast(error?.message || "Failed to save role", "error", "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={roleValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <GraphqlModal
          isOpen
          title={role?.uid ? "Update Role" : "Add Role"}
          subtitle="Team members can be assigned these roles when recording theatre time to indicate their responsibility for the recorded time entry."
          icon={<ShieldCheck size={20} />}
          onClose={onClose}
          isSubmitting={isSubmitting}
          footer={
            <>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" form="roleForm" className="btn btn-primary" disabled={isSubmitting}>
                <i className="bx bx-save me-1"></i>
                {isSubmitting ? "Saving..." : "Save Role"}
              </button>
            </>
          }
        >
          <Form id="roleForm">
            <div className="alert alert-primary d-flex align-items-center" role="alert">
              <i className="bx bx-info-circle me-2"></i>
              <div>Roles filter theatre members in the utilization form.</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Role Name</label>
              <Field name="name" className="form-control" placeholder="e.g. Surgeon" />
              <FieldError name="name" />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <Field name="description" className="form-control" placeholder="Role description" as="textarea" rows="4" />
              <FieldError name="description" />
            </div>
          </Form>
        </GraphqlModal>
      )}
    </Formik>
  );
};

export default RoleModal;
