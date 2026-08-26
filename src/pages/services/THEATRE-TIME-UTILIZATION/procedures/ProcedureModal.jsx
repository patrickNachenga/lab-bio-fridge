import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ClipboardList } from "lucide-react";
import GraphqlModal from "../../../../components/GraphqlModal";
import showToast from "../../../../helpers/ToastHelper";
import { useRegisterProceduresMutation } from "../../../../features/theatre/theatreGraphqlApi";

const procedureValidationSchema = Yup.object().shape({
    name: Yup.string().required("Procedure name is required"),
    code: Yup.string().required("Procedure code is required"),
    estimatedMinutes: Yup.number()
        .typeError("Estimated time must be a number")
        .min(1, "Estimated time must be at least 1 minute")
        .required("Estimated time is required"),
});

const FieldError = ({ name }) => (
    <ErrorMessage name={name}>
        {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
    </ErrorMessage>
);

const ProcedureModal = ({ procedure, onSuccess, onClose }) => {
    const initialValues = procedure || { name: "", code: "", estimatedMinutes: "" };
    const [registerProcedures] = useRegisterProceduresMutation();

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                ...values,
                estimatedMinutes: values.estimatedMinutes ? Number(values.estimatedMinutes) : null,
            };
            const result = await registerProcedures([payload]).unwrap();
            if (result?.status === false) {
                throw new Error(result?.message || "GraphQL request failed");
            }
            showToast("Procedure saved successfully", "success", "Complete");
            resetForm();
            if (onSuccess) onSuccess();
            onClose?.();
        } catch (error) {
            console.error("Error saving procedure:", error);
            showToast(error?.message || "Failed to save procedure", "error", "Failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={procedureValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ isSubmitting }) => (
                <GraphqlModal
                    isOpen
                    title={procedure?.uid ? "Update Procedure" : "Add Procedure"}
                    subtitle="Procedures appear in the theatre performance monitor form."
                    icon={<ClipboardList size={20} />}
                    onClose={onClose}
                    isSubmitting={isSubmitting}
                    footer={
                        <>
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </button>
                            <button type="submit" form="procedureForm" className="btn btn-primary" disabled={isSubmitting}>
                                <i className="bx bx-save me-1"></i>
                                {isSubmitting ? "Saving..." : "Save Procedure"}
                            </button>
                        </>
                    }
                >
                    <Form id="procedureForm">
                        <div className="alert alert-primary d-flex align-items-center" role="alert">
                            <i className="bx bx-info-circle me-2"></i>
                            <div>Procedure types appear in the theatre performance monitor form.</div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Procedure Name</label>
                                <Field name="name" className="form-control" placeholder="e.g. Appendectomy" />
                                <FieldError name="name" />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">ICD-10 Code</label>
                                <Field name="code" className="form-control" placeholder="e.g. APP-001" />
                                <FieldError name="code" />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label">Estimated Time (minutes)</label>
                                <Field type="number" min="1" name="estimatedMinutes" className="form-control" placeholder="e.g. 90" />
                                <FieldError name="estimatedMinutes" />
                            </div>
                        </div>
                    </Form>
                </GraphqlModal>
            )}
        </Formik>
    );
};

export default ProcedureModal;
