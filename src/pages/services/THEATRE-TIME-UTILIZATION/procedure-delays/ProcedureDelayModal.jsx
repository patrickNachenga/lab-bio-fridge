import React, { useMemo } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { AlertTriangle } from "lucide-react";
import GraphqlModal from "../../../../components/GraphqlModal";
import showToast from "../../../../helpers/ToastHelper";
import {
  useGetProcedureDelayCategoriesQuery,
  useRegisterProcedureDelayCausesMutation,
} from "../../../../features/theatre/theatreGraphqlApi";
import FormikSelect from "../../../../components/ui-templates/form-components/FormikSelect";

const validationSchema = Yup.object().shape({
  procedureDelayCategoryUid: Yup.string().required("Delay category is required"),
  name: Yup.string().required("Delay cause name is required"),
  code: Yup.string().required("Delay cause code is required"),
  description: Yup.string().required("Description is required"),
});

const FieldError = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
  </ErrorMessage>
);

const ProcedureDelayModal = ({ delayCause, onSuccess, onClose }) => {
  const { data: delayCategoryResponse } = useGetProcedureDelayCategoriesQuery({ limit: 500 });
  const [registerProcedureDelayCauses] = useRegisterProcedureDelayCausesMutation();
  const delayCategories = useMemo(() => delayCategoryResponse?.data?.items || [], [delayCategoryResponse]);

  const categoryOptions = delayCategories.map((cat) => ({
    value: cat.uid,
    label: `${cat.name} (${cat.code || "N/A"})`,
    ...cat,
  }));

  const initialValues = {
    name: "",
    code: "",
    description: "",
    procedureDelayCategoryUid: "",
    procedureDelayCategoryName: ""
  };

  if (delayCause) {
    initialValues.uid = delayCause.uid;
    initialValues.name = delayCause.name;
    initialValues.code = delayCause.code;
    initialValues.description = delayCause.description;
    initialValues.procedureDelayCategoryUid = delayCause.procedureDelayCategory?.uid;
    initialValues.procedureDelayCategoryName = delayCause.procedureDelayCategory?.name;
  }

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Only send fields that match the ProcedureDelayCauseInput GraphQL input type
      const payload = {
        uid: values.uid || undefined,
        name: values.name,
        code: values.code,
        description: values.description,
        procedureDelayCategoryUid: values.procedureDelayCategoryUid,
      };
      const result = await registerProcedureDelayCauses([payload]).unwrap();
      if (result?.status === false) {
        throw new Error(result?.message || "GraphQL request failed");
      }
      showToast("Procedure delay cause saved successfully", "success", "Complete");
      resetForm();
      if (onSuccess) onSuccess();
      onClose?.();
    } catch (error) {
      console.error("Error saving procedure delay cause:", error);
      showToast(error?.message || "Failed to save procedure delay cause", "error", "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting, setFieldValue }) => (
        <GraphqlModal
          isOpen
          title={delayCause?.uid ? "Update Procedure Delay" : "Add Procedure Delay"}
          subtitle="The Procedure Delay Cause will be available as an option when recording theatre time delays."
          icon={<AlertTriangle size={20} />}
          onClose={onClose}
          isSubmitting={isSubmitting}
          footer={
            <>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" form="procedureDelayForm" className="btn btn-primary" disabled={isSubmitting}>
                <i className="bx bx-save me-1"></i>
                {isSubmitting ? "Saving..." : "Save Delay Cause"}
              </button>
            </>
          }
        >
          <Form id="procedureDelayForm">
            <div className="alert alert-primary d-flex align-items-center" role="alert">
              <i className="bx bx-info-circle me-2"></i>
              <div>Procedure delay causes appear as dropdown options in the theatre time form.</div>
            </div>

            <FormikSelect
              name="procedureDelayCategoryUid"
              label="Delay Category"
              staticOptions={categoryOptions}
              mapOption={(option) => option}
              containerClass="col-12 mb-3"
              placeholder="Select delay category..."
              minChars={0}
              onSelectObject={(option) => setFieldValue("procedureDelayCategoryName", option?.name || "")}
            />

            <div className="row">
              <div className="col-md-8 mb-3">
                <label className="form-label">Delay Cause Name</label>
                <Field name="name" className="form-control" placeholder="e.g. Late patient transfer" />
                <FieldError name="name" />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Code</label>
                <Field name="code" className="form-control" placeholder="e.g. LPT-001" />
                <FieldError name="code" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <Field name="description" className="form-control" placeholder="Describe this delay cause" as="textarea" rows="4" />
              <FieldError name="description" />
            </div>
          </Form>
        </GraphqlModal>
      )}
    </Formik>
  );
};

export default ProcedureDelayModal;
