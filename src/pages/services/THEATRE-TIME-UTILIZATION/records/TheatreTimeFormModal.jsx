import React, { useMemo, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormWizard from "react-form-wizard-component";
import "react-form-wizard-component/dist/style.css";
import { Clock3 } from "lucide-react";
import GraphqlModal from "../../../../components/GraphqlModal";
import showToast from "../../../../helpers/ToastHelper";
import FormikSelect from "../../../../components/ui-templates/form-components/FormikSelect";
import {
  calculateDurationMinutes,
  formatDuration,
  getTimeCompliance,
} from "../../../../services/theatreTimeUtilizationService";
import {
  useGetDeathReasonsQuery,
  useGetExternalSourcesQuery,
  useGetInternalSourcesQuery,
  useGetProcedureDelayCausesQuery,
  useGetProceduresQuery,
  useGetRegionsQuery,
  useGetTheatreMembersQuery,
  useGetTheatreMemberRolesQuery,
  useGetTheatreRolesQuery,
  useGetTheatreUnitsQuery,
  useRegisterTheatreTimeRecordMutation,
} from "../../../../features/theatre/theatreGraphqlApi";

const yesNoOptions = ["YES", "NO"];
const sexOptions = ["Male", "Female"];
const patientTypeOptions = ["ELECTIVE", "EMERGENCY"];
const sourceTypeOptions = ["INTERNAL", "EXTERNAL"];

const validationSchema = Yup.object().shape({
  patientMrn: Yup.string().required("Patient MRN is required"),
  patientDob: Yup.string().required("Date of birth is required"),
  patientSex: Yup.string().required("Sex is required"),
  patientRegionUid: Yup.string().required("Region is required"),
  patientType: Yup.string().oneOf(patientTypeOptions).required("Patient type is required"),
  patientSourceType: Yup.string().oneOf(sourceTypeOptions).required("Source type is required"),
  internalSourceUid: Yup.string().when("patientSourceType", {
    is: "INTERNAL",
    then: (schema) => schema.required("Internal source is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  externalSourceUid: Yup.string().when("patientSourceType", {
    is: "EXTERNAL",
    then: (schema) => schema.required("External source is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  theatreUnitUid: Yup.string().required("Surgical theatre unit is required"),
  procedureUid: Yup.string().required("Procedure type is required"),
  procedureDate: Yup.string().required("Procedure date is required"),
  surgeonUid: Yup.array().min(1, "At least one surgeon is required").required("Surgeon is required"),
  anesthetistUid: Yup.array().min(1, "At least one anesthetist is required").required("Anesthetist is required"),
  scrubNurseUid: Yup.array().min(1, "At least one scrub nurse is required").required("Scrub nurse is required"),
  runnerNurseUid: Yup.array().min(1, "At least one runner nurse is required").required("Runner nurse is required"),
  procedureStartTime: Yup.string().required("Procedure start time is required"),
  procedureEndTime: Yup.string().required("Procedure end time is required"),
  wasThereDelay: Yup.string().oneOf(yesNoOptions).required("Please select Yes or No"),
  surgeryBeyondTheatreTime: Yup.string().oneOf(yesNoOptions).required("Please select Yes or No"),
  delayCauseUids: Yup.array().when("wasThereDelay", {
    is: "YES",
    then: (schema) => schema.min(1, "At least one delay cause is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  delayReason: Yup.string().when("wasThereDelay", {
    is: "YES",
    then: (schema) => schema.required("Delay description is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  patientOutcome: Yup.string().oneOf(["DISCHARGED", "DEATH"]).required("Patient outcome is required"),
  dischargeDestination: Yup.string().when("patientOutcome", {
    is: "DISCHARGED",
    then: (schema) => schema.oneOf(["INTERNAL", "HOME"]).required("Discharge destination is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  dischargeInternalSourceUid: Yup.string().when(["patientOutcome", "dischargeDestination"], {
    is: (patientOutcome, dischargeDestination) =>
      patientOutcome === "DISCHARGED" && dischargeDestination === "INTERNAL",
    then: (schema) => schema.required("Internal discharge destination is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  deathReasonUid: Yup.string().when("patientOutcome", {
    is: "DEATH",
    then: (schema) => schema.required("Death reason is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  deathDescription: Yup.string().when("patientOutcome", {
    is: "DEATH",
    then: (schema) => schema.required("Death description is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const defaultValues = {
  patientMrn: "",
  patientDob: "",
  patientSex: "",
  patientRegionUid: "",
  patientRegionName: "",
  patientType: "ELECTIVE",
  patientSourceType: "INTERNAL",
  internalSourceUid: "",
  internalSourceName: "",
  externalSourceUid: "",
  externalSourceName: "",
  patientSourceName: "",
  theatreUnitUid: "",
  theatreUnitName: "",
  theatreUnitCode: "",
  procedureUid: "",
  procedureName: "",
  procedureCode: "",
  estimatedProcedureMinutes: "",
  procedureDate: new Date().toISOString().split("T")[0],
  surgeonUid: [],
  anesthetistUid: [],
  scrubNurseUid: [],
  runnerNurseUid: [],
  procedureStartTime: "",
  procedureEndTime: "",
  wasThereDelay: "NO",
  surgeryBeyondTheatreTime: "",
  surgeryMetTimeBetweenCases: "",
  delayCauseUids: [],
  delayReason: "",
  patientOutcome: "DISCHARGED",
  dischargeDestination: "HOME",
  dischargeInternalSourceUid: "",
  dischargeInternalSourceName: "",
  deathReasonUid: "",
  deathReasonName: "",
  deathDescription: "",
};

const FieldError = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
  </ErrorMessage>
);

const StaticSelect = ({ name, label, options, containerClass = "col-md-6 mb-3" }) => (
  <div className={containerClass}>
    <label className="form-label">{label}</label>
    <Field as="select" name={name} className="form-select">
      <option value="">Select...</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Field>
    <FieldError name={name} />
  </div>
);

const ChoiceGroup = ({ name, label, options, values, setFieldValue, tone = "primary", onChange }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label d-block small fw-bold text-uppercase text-muted mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{label}</label>
    <div className="btn-group" style={{ border: '1.5px solid #ced4da' }} role="group" aria-label={label}>
      {options.map((option) => (
        <React.Fragment key={`${name}-${option}`}>
          <Field
            type="radio"
            className="btn-check"
            name={name}
            id={`${name}-${option}`}
            value={option}
            checked={values[name] === option}
            onChange={() => {
              setFieldValue(name, option);
              if (onChange) onChange(option);
            }}
          />
          <label
            className={`btn btn-sm btn-outline-${tone} py-1 fw-bold px-4`}
            style={{ textTransform: 'capitalize', minWidth: '120px' }}
            htmlFor={`${name}-${option}`}
          >
            {option}
          </label>
        </React.Fragment>
      ))}
    </div>
    <FieldError name={name} />
  </div>
);

const SectionTitle = ({ icon, title, subtitle }) => (
  <div className="mb-3">
    <h6 className="fw-bold mb-1">
      <i className={`bx ${icon} me-2`}></i>
      {title}
    </h6>
    {subtitle && <p className="text-muted mb-0 small">{subtitle}</p>}
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="col-md-4 mb-3">
    <small className="text-muted d-block">{label}</small>
    <span className="fw-semibold">{value || "N/A"}</span>
  </div>
);

export const TheatreTimeFormModal = ({ selectedRecord, onSuccess, onClose }) => {
  const { data: proceduresResponse } = useGetProceduresQuery({ limit: 500 });
  const { data: delayCausesResponse } = useGetProcedureDelayCausesQuery({ limit: 500 });
  const { data: regionsResponse } = useGetRegionsQuery({ limit: 500 });
  const { data: internalSourcesResponse } = useGetInternalSourcesQuery({ limit: 500 });
  const { data: externalSourcesResponse } = useGetExternalSourcesQuery({ limit: 500 });
  const { data: theatreUnitsResponse } = useGetTheatreUnitsQuery({ limit: 500 });
  const { data: deathReasonsResponse } = useGetDeathReasonsQuery({ limit: 500 });
  const { data: theatreRolesResponse } = useGetTheatreRolesQuery({ limit: 500 });
  const { data: theatreMembersResponse } = useGetTheatreMembersQuery({ limit: 500 });
  const { data: theatreMemberRolesResponse } = useGetTheatreMemberRolesQuery({ limit: 1000 });
  const [registerTheatreTimeRecords] = useRegisterTheatreTimeRecordMutation();

  const procedures = useMemo(() => proceduresResponse?.data?.items || [], [proceduresResponse]);
  const delayCauses = useMemo(() => delayCausesResponse?.data?.items || [], [delayCausesResponse]);
  const regions = useMemo(() => regionsResponse?.data?.items || [], [regionsResponse]);
  const internalSources = useMemo(() => internalSourcesResponse?.data?.items || [], [internalSourcesResponse]);
  const externalSources = useMemo(() => externalSourcesResponse?.data?.items || [], [externalSourcesResponse]);
  const theatreUnits = useMemo(() => theatreUnitsResponse?.data?.items || [], [theatreUnitsResponse]);
  const deathReasons = useMemo(() => deathReasonsResponse?.data?.items || [], [deathReasonsResponse]);
  const theatreRoles = useMemo(() => theatreRolesResponse?.data?.items || [], [theatreRolesResponse]);
  const theatreMembers = useMemo(() => theatreMembersResponse?.data?.items || [], [theatreMembersResponse]);
  const theatreMemberRoles = useMemo(() => theatreMemberRolesResponse?.data?.items || [], [theatreMemberRolesResponse]);

  const getMembersForRoleName = (roleName) => {
    const role = theatreRoles.find((item) => item.name?.toLowerCase() === roleName.toLowerCase());
    if (!role) return [];
    const memberUids = theatreMemberRoles.filter((mapping) => mapping.roleUid === role.uid).map((mapping) => mapping.memberUid);
    return theatreMembers.filter((member) => memberUids.includes(member.uid));
  };

  const surgeonMembers = useMemo(() => getMembersForRoleName("Surgeon"), [theatreRoles, theatreMemberRoles, theatreMembers]);
  const anesthetistMembers = useMemo(() => getMembersForRoleName("Anesthetist"), [theatreRoles, theatreMemberRoles, theatreMembers]);
  const scrubNurseMembers = useMemo(() => getMembersForRoleName("Scrub Nurse"), [theatreRoles, theatreMemberRoles, theatreMembers]);
  const runnerNurseMembers = useMemo(() => getMembersForRoleName("Runner Nurse"), [theatreRoles, theatreMemberRoles, theatreMembers]);

  const initialValues = useMemo(() => {
    const vals = { ...defaultValues, ...(selectedRecord || {}) };
    // Ensure team UIDs are arrays for multi-select compatibility
    ["surgeonUid", "anesthetistUid", "scrubNurseUid", "runnerNurseUid"].forEach(
      (key) => {
        if (vals[key] && !Array.isArray(vals[key])) {
          vals[key] = [vals[key]];
        } else if (!vals[key]) {
          vals[key] = [];
        }
      }
    );
    // Ensure delayCauseUids is an array
    if (!Array.isArray(vals.delayCauseUids)) {
      vals.delayCauseUids = [];
    }
    // Ensure delayReason has a default
    if (!vals.delayReason) {
      vals.delayReason = "";
    }
    return vals;
  }, [selectedRecord]);

  const closeModal = () => {
    if (onClose) onClose();
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Calculate duration from start/end times
      const duration = calculateDurationMinutes(values.procedureStartTime, values.procedureEndTime);
      const estimated = Number(values.estimatedProcedureMinutes) || 0;
      const variance = duration - estimated;

      // Map role display names to uppercase role constants
      const roleToConstant = {
        "Surgeon": "SURGEON",
        "Anesthetist": "ANESTHETIST",
        "Scrub Nurse": "SCRUB_NURSE",
        "Runner Nurse": "RUNNER_NURSE",
      };

      // Build team_members array with role as string name and rank order
      const teamMembers = [
        ...(values.surgeonUid || []).map((memberUid, idx) => ({ memberUid, role: roleToConstant["Surgeon"], rank: idx + 1 })),
        ...(values.anesthetistUid || []).map((memberUid, idx) => ({ memberUid, role: roleToConstant["Anesthetist"], rank: idx + 1 })),
        ...(values.scrubNurseUid || []).map((memberUid, idx) => ({ memberUid, role: roleToConstant["Scrub Nurse"], rank: idx + 1 })),
        ...(values.runnerNurseUid || []).map((memberUid, idx) => ({ memberUid, role: roleToConstant["Runner Nurse"], rank: idx + 1 })),
      ].filter((item) => item.memberUid);

      // Build delay_courses array with just delayCauseUid
      const normalizedDelayUids = values.wasThereDelay === "YES" ? (values.delayCauseUids || []) : [];
      const delayCourses = normalizedDelayUids
        .filter((uid) => uid)
        .map((uid) => ({
          delayCauseUid: uid,
        }));

      // Build single payload matching backend schema
      const payload = {
        uid: selectedRecord?.uid || undefined,
        patientMrn: values.patientMrn,
        patientDob: values.patientDob,
        patientSex: values.patientSex,
        patientRegionUid: values.patientRegionUid,
        patientType: values.patientType,
        patientSourceType: values.patientSourceType,
        internalSourceUid: values.patientSourceType === "INTERNAL" ? values.internalSourceUid : undefined,
        externalSourceUid: values.patientSourceType === "EXTERNAL" ? values.externalSourceUid : undefined,
        theatreUnitUid: values.theatreUnitUid,
        procedureUid: values.procedureUid,
        procedureDate: values.procedureDate,
        procedureStartTime: values.procedureStartTime || undefined,
        procedureEndTime: values.procedureEndTime || undefined,
        durationMinutes: duration > 0 ? duration : undefined,
        estimatedDurationMinutes: estimated > 0 ? estimated : undefined,
        varianceMinutes: variance !== 0 ? variance : undefined,
        hadDelay: values.wasThereDelay === "YES",
        surgeryBeyondTheatreTime: values.surgeryBeyondTheatreTime === "YES",
        delayReason: values.wasThereDelay === "YES" ? values.delayReason : undefined,
        outcome: values.patientOutcome,
        dischargeDirection: values.patientOutcome === "DISCHARGED" ? values.dischargeDestination : undefined,
        dischargeDestinationUid: values.patientOutcome === "DISCHARGED" && values.dischargeDestination === "INTERNAL" ? values.dischargeInternalSourceUid : undefined,
        deathReasonUid: values.patientOutcome === "DEATH" ? values.deathReasonUid : undefined,
        deathDescription: values.patientOutcome === "DEATH" ? values.deathDescription : undefined,
        teamMembers: teamMembers.length > 0 ? teamMembers : undefined,
        delayCourses: delayCourses.length > 0 ? delayCourses : undefined,
      };

      // Remove undefined fields
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) delete payload[key];
      });

      const result = await registerTheatreTimeRecords(payload).unwrap();

      if (result?.status === false) {
        throw new Error(result?.message || "GraphQL request failed");
      }

      showToast("Theatre time form saved successfully", "success", "Complete");
      resetForm();
      closeModal();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Unable to save theatre time form:", error);
      showToast("Unable to save theatre time form", "error", "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const toMemberOption = (member) => ({
    value: member.uid,
    label: [member.firstName, member.middleName, member.lastName].filter(Boolean).join(" "),
    pfNumber: member.pfNumber,
  });

  const toLookupOption = (item) => ({
    value: item.uid,
    label: `${item.name}${item.code ? ` (${item.code})` : ""}`,
    ...item,
  });

  const procedureOptions = procedures.map((procedure) => ({
    value: procedure.uid,
    label: `${procedure.name} (${procedure.code})`,
    ...procedure,
  }));
  const regionOptions = regions.map(toLookupOption);
  const internalSourceOptions = internalSources.map(toLookupOption);
  const externalSourceOptions = externalSources.map(toLookupOption);
  const theatreUnitOptions = theatreUnits.map(toLookupOption);
  const deathReasonOptions = deathReasons.map(toLookupOption);
  const delayCauseOptions = delayCauses.map((c) => ({
    value: c.uid,
    label: `${c.name}${c.code ? ` (${c.code})` : ""}`,
    ...c,
  }));

  const mapStaticOption = (item) => item;
  const formatMemberOption = (option) => (
    <div>
      <div className="fw-semibold">{option.label}</div>
      <small className="text-muted">PF: {option.pfNumber || "N/A"}</small>
    </div>
  );
  const formatProcedureOption = (option) => (
    <div>
      <div className="fw-semibold">{option.label}</div>
      <small className="text-muted">Estimated time: {formatDuration(option.estimatedMinutes)}</small>
    </div>
  );

  const activeTabRef = useRef(0);

  const getFieldsForTab = (tabIndex) => {
    const fieldsByTab = [
      ['patientMrn', 'patientDob', 'patientSex', 'patientRegionUid', 'patientType', 'patientSourceType', 'internalSourceUid', 'externalSourceUid'],
      ['theatreUnitUid', 'procedureUid', 'procedureDate'],
      ['surgeonUid', 'anesthetistUid', 'scrubNurseUid', 'runnerNurseUid', 'procedureStartTime', 'procedureEndTime'],
      ['wasThereDelay', 'surgeryBeyondTheatreTime', 'delayCauseUids', 'delayReason', 'patientOutcome', 'dischargeDestination', 'dischargeInternalSourceUid', 'deathReasonUid', 'deathDescription'],
      [],
    ];
    return fieldsByTab[tabIndex] || [];
  };

  const hasTabErrors = (errors, tabIndex) => {
    const fields = getFieldsForTab(tabIndex);
    return fields.some((field) => !!errors[field]);
  };

  const allMemberOptions = useMemo(() => theatreMembers.map(toMemberOption), [theatreMembers]);

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ isSubmitting, values, setFieldValue, resetForm, validateForm, errors, setFieldTouched }) => {
        const duration = calculateDurationMinutes(values.procedureStartTime, values.procedureEndTime);
        const compliance = getTimeCompliance(duration, values.estimatedProcedureMinutes);

        return (
          <GraphqlModal
            isOpen
            size="full"
            title={selectedRecord ? "Update Performance Monitor Form" : "Fill Performance Monitor Form"}
            subtitle="Patient, theatre, team, timing, and delay data saved through Theatre GraphQL."
            icon={<Clock3 size={20} />}
            onClose={closeModal}
            isSubmitting={isSubmitting}
          >
            <Form>
              <div className="theatre-time-form-modal">
                    <style>
                      {`
                        .theatre-time-form-modal .wizard-tab-content { text-align: left; }
                        .theatre-time-form-modal .wizard-card-footer { padding: 0 1rem 1rem; }
                        .theatre-time-form-modal .theatre-section {
                          border: 1px solid #e9ecef;
                          border-radius: 8px;
                          padding: 18px;
                          background: #fff;
                        }
                        .theatre-time-form-modal .time-panel {
                          border-radius: 8px;
                          padding: 16px;
                          border: 1px solid #e9ecef;
                        }
                      `}
                    </style>

                    <FormWizard
                      shape="circle"
                      inlineStep
                      showProggressBar
                      showProgressBar
                    color="#696cff"
                    stepSize="xs"
                      backButtonTemplate={(handlePrevious) => (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          style={{ width: "100px", marginLeft: "1%", border: "1px solid #ced4da" }}
                          onClick={() => {
                            activeTabRef.current = Math.max(activeTabRef.current - 1, 0);
                            handlePrevious();
                          }}
                        >
                          <i className="bx bx-chevron-left me-1"></i>Back
                        </button>
                      )}
                      nextButtonTemplate={(handleNext) => (
                        <button
                          type="button"
                          className="base-button btn btn-sm btn-primary"
                          style={{ width: "100px", marginLeft: "80%" }}
                          onClick={async () => {
                            const validationErrors = await validateForm();
                            const currentTab = activeTabRef.current;
                            if (hasTabErrors(validationErrors, currentTab)) {
                              const tabFields = getFieldsForTab(currentTab);
                              tabFields.forEach((field) => setFieldTouched(field, true));
                              return;
                            }
                            activeTabRef.current = Math.min(currentTab + 1, 4);
                            handleNext();
                          }}
                        >
                          Next<i className="bx bx-chevron-right ms-1"></i>
                        </button>
                      )}
                      finishButtonTemplate={() => (
                        <button
                          type="submit"
                          className="base-button btn btn-sm btn-success"
                          style={{ minWidth: "120px", marginLeft: "80%", marginTop: "-50px" }}
                          disabled={isSubmitting}
                        >
                          <i className="bx bx-save me-1"></i>
                          {selectedRecord ? "Update Form" : "Save Form"}
                        </button>
                      )}
                    >
                      <FormWizard.TabContent title="Patient & Source" icon="bx bx-user">
                        <div className="theatre-section mb-3">
                          <SectionTitle icon="bx-id-card" title="Patient Demographics" subtitle="Capture basic patient identifiers." />
                          <div className="row">
                            <div className="col-md-3 mb-3">
                              <label className="form-label">Patient MRN</label>
                              <Field name="patientMrn" className="form-control" placeholder="Enter MRN" />
                              <FieldError name="patientMrn" />
                            </div>
                            <div className="col-md-3 mb-3">
                              <label className="form-label">Date of Birth</label>
                              <Field type="date" name="patientDob" className="form-control" />
                              <FieldError name="patientDob" />
                            </div>
                            <StaticSelect name="patientSex" label="Sex" options={sexOptions} containerClass="col-md-3 mb-3" />
                            <FormikSelect
                              name="patientRegionUid"
                              label="Region"
                              staticOptions={regionOptions}
                              mapOption={mapStaticOption}
                              containerClass="col-md-3 mb-3"
                              placeholder="Select region..."
                              minChars={0}
                              onSelectObject={(option) => setFieldValue("patientRegionName", option?.name || "")}
                            />
                          </div>
                        </div>

                        <div className="theatre-section">
                          <SectionTitle icon="bx-transfer" title="Case Classification" subtitle="Patient type and arrival source." />
                          <div className="row">
                            <ChoiceGroup
                              name="patientType"
                              label="Patient Type"
                              options={patientTypeOptions}
                              values={values}
                              tone="primary"
                              setFieldValue={setFieldValue}
                              onChange={(option) => {
                                if (option === "EMERGENCY") {
                                  setFieldValue("wasThereDelay", "NO");
                                  setFieldValue("surgeryBeyondTheatreTime", "");
                                  setFieldValue("delayCauseUids", []);
                                }
                              }}
                            />
                            <ChoiceGroup
                              name="patientSourceType"
                              label="Source Type"
                              options={sourceTypeOptions}
                              values={values}
                              setFieldValue={setFieldValue}
                              tone="info"
                              onChange={(option) => {
                                setFieldValue("internalSourceUid", "");
                                setFieldValue("internalSourceName", "");
                                setFieldValue("externalSourceUid", "");
                                setFieldValue("externalSourceName", "");
                                setFieldValue("patientSourceName", "");
                                setFieldValue("patientSourceType", option);
                              }}
                            />

                            {values.patientSourceType === "INTERNAL" ? (
                              <FormikSelect
                                name="internalSourceUid"
                                label="Internal Source (Ward/Clinic)"
                                staticOptions={internalSourceOptions}
                                mapOption={mapStaticOption}
                                containerClass="col-md-12 mb-3"
                                placeholder="Select ward..."
                                minChars={0}
                                onSelectObject={(option) => {
                                  setFieldValue("internalSourceName", option?.name || "");
                                  setFieldValue("patientSourceName", option?.name || "");
                                }}
                              />
                            ) : (
                              <FormikSelect
                                name="externalSourceUid"
                                  label="External Source (Facility)"
                                staticOptions={externalSourceOptions}
                                mapOption={mapStaticOption}
                                  containerClass="col-md-12 mb-3"
                                  placeholder="Select hospital..."
                                minChars={0}
                                onSelectObject={(option) => {
                                  setFieldValue("externalSourceName", option?.name || "");
                                  setFieldValue("patientSourceName", option?.name || "");
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </FormWizard.TabContent>

                      <FormWizard.TabContent title="Procedure" icon="bx bx-clinic">
                        <div className="theatre-section">
                          <SectionTitle icon="bx-clinic" title="Theatre and Procedure" subtitle="Select the theatre unit and procedure type." />
                          <div className="row">
                            <FormikSelect
                              name="theatreUnitUid"
                              label="Surgical Theatre Unit"
                              staticOptions={theatreUnitOptions}
                              mapOption={mapStaticOption}
                              containerClass="col-md-6 mb-3"
                              placeholder="Select theatre unit..."
                              minChars={0}
                              onSelectObject={(option) => {
                                setFieldValue("theatreUnitName", option?.name || "");
                                setFieldValue("theatreUnitCode", option?.code || "");
                              }}
                            />
                            <FormikSelect
                              name="procedureUid"
                              label="Procedure Type"
                              staticOptions={procedureOptions}
                              mapOption={mapStaticOption}
                              formatOptionLabel={formatProcedureOption}
                              containerClass="col-md-6 mb-3"
                              placeholder="Select procedure..."
                              minChars={0}
                              onSelectObject={(option) => {
                                setFieldValue("procedureName", option?.name || "");
                                setFieldValue("procedureCode", option?.code || "");
                                setFieldValue("estimatedProcedureMinutes", option?.estimatedMinutes || "");
                              }}
                            />
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Procedure Date</label>
                              <Field type="date" name="procedureDate" className="form-control" />
                              <FieldError name="procedureDate" />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Estimated Procedure Time</label>
                              <div className="form-control bg-light fw-semibold">
                                {values.estimatedProcedureMinutes ? formatDuration(values.estimatedProcedureMinutes) : "Select procedure"}
                              </div>
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Theatre Unit Code</label>
                              <div className="form-control bg-light fw-semibold">{values.theatreUnitCode || "Select theatre"}</div>
                            </div>
                          </div>
                        </div>
                      </FormWizard.TabContent>

                      <FormWizard.TabContent title="Team & Time" icon="bx bx-time-five">
                        <div className="theatre-section">
                          <SectionTitle icon="bx-group" title="Team and Calculated Time" subtitle="Add theatre team members and procedure start/end time." />
                          <div className="row">
                        <FormikSelect name="surgeonUid" label="Surgeons" isMulti staticOptions={allMemberOptions} mapOption={mapStaticOption} formatOptionLabel={formatMemberOption} containerClass="col-md-6 mb-3" placeholder="Select surgeons..." minChars={0} />
                        <FormikSelect name="anesthetistUid" label="Anesthetists" isMulti staticOptions={allMemberOptions} mapOption={mapStaticOption} formatOptionLabel={formatMemberOption} containerClass="col-md-6 mb-3" placeholder="Select anesthetists..." minChars={0} />
                        <FormikSelect name="scrubNurseUid" label="Scrub Nurses" isMulti staticOptions={allMemberOptions} mapOption={mapStaticOption} formatOptionLabel={formatMemberOption} containerClass="col-md-6 mb-3" placeholder="Select scrub nurses..." minChars={0} />
                        <FormikSelect name="runnerNurseUid" label="Runner Nurses" isMulti staticOptions={allMemberOptions} mapOption={mapStaticOption} formatOptionLabel={formatMemberOption} containerClass="col-md-6 mb-3" placeholder="Select runner nurses..." minChars={0} />

                            <div className="col-md-4 mb-3">
                              <label className="form-label">Procedure start time (24h)</label>
                              <Field type="time" name="procedureStartTime" className="form-control" />
                              <FieldError name="procedureStartTime" />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Procedure end time (24h)</label>
                              <Field type="time" name="procedureEndTime" className="form-control" />
                              <FieldError name="procedureEndTime" />
                            </div>
                            <div className="col-md-4 mb-3">
                              <label className="form-label">Calculated time</label>
                              <div className="form-control bg-light fw-semibold">{formatDuration(duration)}</div>
                            </div>

                            <div className="col-12">
                              <div className={`time-panel bg-label-${compliance.tone}`}>
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                  <div>
                                    <small className="text-muted d-block">Did the surgery meet the time between cases?</small>
                                    <span className={`badge bg-${compliance.tone}`}>
                                      {compliance.met === "YES" ? "Yes, within estimated time" : compliance.met === "NO" ? "No, above estimated time" : "Pending"}
                                    </span>
                                  </div>
                                  <div className="text-end">
                                    <div className="fw-bold">{compliance.label}</div>
                                    <small className="text-muted">
                                      Calculated {formatDuration(duration)} vs estimated {values.estimatedProcedureMinutes ? formatDuration(values.estimatedProcedureMinutes) : "N/A"}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FormWizard.TabContent>

                      <FormWizard.TabContent title="Delay & Outcome" icon="bx bx-check-shield">
                        <div className="theatre-section mb-3">
                      <SectionTitle icon="bx-error-circle" title="Delay Details" subtitle="Was there a delay? If YES, add one or more delay causes." />
                          <div className="row">
                            <ChoiceGroup
                              name="wasThereDelay"
                              label="Was there any delay?"
                              options={yesNoOptions}
                              values={values}
                              setFieldValue={setFieldValue}
                              tone="warning"
                              onChange={(option) => {
                                if (option === "NO") {
                                setFieldValue("wasThereDelay", "NO");
                                setFieldValue("delayCauseUids", []);
                              }
                              }}
                        />
                        <ChoiceGroup name="surgeryBeyondTheatreTime" label="Was the surgery beyond the theatre time?" options={yesNoOptions} values={values} setFieldValue={setFieldValue} tone="danger" />

                        {values.wasThereDelay === "YES" && (
                          <>
                            <FormikSelect
                              name="delayCauseUids"
                              label="Delay Cause (Reason)"
                              isMulti
                              staticOptions={delayCauseOptions}
                              mapOption={mapStaticOption}
                              containerClass="col-md-12 mb-3"
                              placeholder="Select delay causes..."
                              minChars={0}
                            />

                            <div className="col-md-12 mb-3">
                              <label className="form-label">
                                <i className="bx bx-comment-detail me-1"></i>Delay Description
                              </label>
                              <Field
                                as="textarea"
                                name="delayReason"
                                className="form-control"
                                rows="3"
                                placeholder="Describe what caused the delay(s) in detail..."
                              />
                              <FieldError name="delayReason" />
                            </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="theatre-section">
                          <SectionTitle icon="bx-check-shield" title="Patient Outcome" />
                          <div className="row">
                            <ChoiceGroup
                              name="patientOutcome"
                              label="Outcome"
                              options={["DISCHARGED", "DEATH"]}
                              values={values}
                              setFieldValue={setFieldValue}
                              tone="success"
                              onChange={(option) => {
                                if (option === "DISCHARGED") {
                                  setFieldValue("deathReasonUid", "");
                                  setFieldValue("deathReasonName", "");
                                  setFieldValue("deathDescription", "");
                                } else {
                                  setFieldValue("dischargeDestination", "");
                                  setFieldValue("dischargeInternalSourceUid", "");
                                  setFieldValue("dischargeInternalSourceName", "");
                                }
                              }}
                            />

                            {values.patientOutcome === "DISCHARGED" && (
                              <>
                                <ChoiceGroup name="dischargeDestination" label="Discharge To" options={["INTERNAL", "HOME"]} values={values} setFieldValue={setFieldValue} tone="info" />
                                {values.dischargeDestination === "INTERNAL" && (
                                  <FormikSelect
                                    name="dischargeInternalSourceUid"
                                    label="Internal Destination"
                                    staticOptions={internalSourceOptions}
                                    mapOption={mapStaticOption}
                                    containerClass="col-md-6 mb-3"
                                    placeholder="Select internal destination..."
                                    minChars={0}
                                    onSelectObject={(option) => setFieldValue("dischargeInternalSourceName", option?.name || "")}
                                  />
                                )}
                              </>
                            )}

                            {values.patientOutcome === "DEATH" && (
                              <>
                                <FormikSelect
                                  name="deathReasonUid"
                                  label="Death Reason"
                                  staticOptions={deathReasonOptions}
                                  mapOption={mapStaticOption}
                                  containerClass="col-md-6 mb-3"
                                  placeholder="Select death reason..."
                                  minChars={0}
                                  onSelectObject={(option) => setFieldValue("deathReasonName", option?.name || "")}
                                />
                                <div className="col-md-12 mb-3">
                                  <label className="form-label">Death Description</label>
                                  <Field as="textarea" name="deathDescription" className="form-control" rows="3" placeholder="Write outcome description" />
                                  <FieldError name="deathDescription" />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </FormWizard.TabContent>

                      <FormWizard.TabContent title="Review" icon="bx bx-list-check">
                        <div className="theatre-section">
                          <SectionTitle icon="bx-list-check" title="Review Before Saving" />
                          <div className="row">
                            <DetailItem label="MRN" value={values.patientMrn} />
                            <DetailItem label="DOB / Sex" value={`${values.patientDob || "N/A"} / ${values.patientSex || "N/A"}`} />
                            <DetailItem label="Region" value={values.patientRegionName} />
                            <DetailItem label="Patient Type" value={values.patientType} />
                            <DetailItem label="Source" value={`${values.patientSourceType} - ${values.patientSourceName || "N/A"}`} />
                            <DetailItem label="Theatre Unit" value={values.theatreUnitName} />
                            <DetailItem label="Procedure" value={values.procedureName} />
                            <DetailItem label="Calculated Time" value={formatDuration(duration)} />
                            <DetailItem label="Surgeons" value={surgeonMembers.filter(m => values.surgeonUid?.includes(m.uid)).map(m => [m.firstName, m.lastName].filter(Boolean).join(" ")).join(", ") || "N/A"} />
                            <DetailItem label="Anesthetists" value={anesthetistMembers.filter(m => values.anesthetistUid?.includes(m.uid)).map(m => [m.firstName, m.lastName].filter(Boolean).join(" ")).join(", ") || "N/A"} />
                            <DetailItem label="Scrub Nurses" value={scrubNurseMembers.filter(m => values.scrubNurseUid?.includes(m.uid)).map(m => [m.firstName, m.lastName].filter(Boolean).join(" ")).join(", ") || "N/A"} />
                            <DetailItem label="Runner Nurses" value={runnerNurseMembers.filter(m => values.runnerNurseUid?.includes(m.uid)).map(m => [m.firstName, m.lastName].filter(Boolean).join(" ")).join(", ") || "N/A"} />
                            <DetailItem label="Estimated Time" value={values.estimatedProcedureMinutes ? formatDuration(values.estimatedProcedureMinutes) : "N/A"} />
                            <DetailItem label="Time Compliance" value={compliance.label} />
                            <DetailItem label="Delay" value={values.wasThereDelay} />
                            {values.wasThereDelay === "YES" && (
                              <div className="col-12 mb-3">
                            <small className="text-muted d-block">Delay Causes:</small>
                            {(values.delayCauseUids || []).length > 0 ? (
                                  <div className="mt-1">
                                {(values.delayCauseUids || []).map((uid, i) => {
                                  const cause = delayCauses.find((c) => c.uid === uid);
                                      return (
                                        <div key={i} className="mb-1 p-2 bg-light rounded">
                                          <span className="badge bg-warning me-1">#{i + 1}</span>
                                          <span className="fw-semibold">{cause?.name || uid}</span>
                                        </div>
                                      );
                                    })}
                                {values.delayReason && (
                                      <div className="mt-1 p-2 bg-light rounded">
                                        <small className="text-muted d-block"><i className="bx bx-comment-detail me-1"></i>Overall Delay Description:</small>
                                    <span className="fw-semibold">{values.delayReason}</span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted">No delays specified</span>
                                )}
                              </div>
                            )}
                            <DetailItem label="Outcome" value={values.patientOutcome === "DEATH" ? `Death - ${values.deathReasonName || "N/A"}` : `Discharged to ${values.dischargeDestination || "N/A"}`} />
                          </div>
                        </div>
                      </FormWizard.TabContent>
                    </FormWizard>

                    <div className="d-flex justify-content-center mb-3" style={{ marginTop: "-70px" }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        style={{ border: "0.5px solid yellow" }}
                        onClick={() => {
                          resetForm();
                          setFieldValue("procedureDate", new Date().toISOString().split("T")[0]);
                        }}
                      >
                        <i className="bx bx-refresh me-1"></i>Clear Form
                      </button>
                    </div>
              </div>
            </Form>
          </GraphqlModal>
        );
      }}
    </Formik>
  );
};

export default TheatreTimeFormModal;
