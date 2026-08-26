import React, { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Boxes, Download } from "lucide-react";
import BreadCumb from "../../../../layouts/BreadCumb";
import GraphqlModal from "../../../../components/GraphqlModal";
import TheatreGraphqlPaginatedTable from "../../../../components/ui-templates/TheatreGraphqlPaginatedTable";
import showToast from "../../../../helpers/ToastHelper";
import FormikSelect from "../../../../components/ui-templates/form-components/FormikSelect";
import LookupImportModal from "./LookupImportModal";
import {
  useGetDeathReasonsQuery,
  useGetExternalSourcesQuery,
  useGetInternalSourcesQuery,
  useGetProcedureDelayCategoriesQuery,
  useGetRegionsQuery,
  useGetTheatreUnitsQuery,
  useRegisterDeathReasonsMutation,
  useRegisterExternalSourcesMutation,
  useRegisterInternalSourcesMutation,
  useRegisterProcedureDelayCategoriesMutation,
  useRegisterRegionsMutation,
  useRegisterTheatreUnitsMutation,
  useLazyDownloadDeathReasonTemplateQuery,
  useLazyDownloadRegionTemplateQuery,
  useLazyDownloadInternalSourceTemplateQuery,
  useLazyDownloadExternalSourceTemplateQuery,
  useLazyDownloadTheatreUnitTemplateQuery,
  useLazyDownloadProcedureDelayCategoryTemplateQuery,
  useImportDeathReasonsFromExcelMutation,
  useImportRegionsFromExcelMutation,
  useImportInternalSourcesFromExcelMutation,
  useImportExternalSourcesFromExcelMutation,
  useImportTheatreUnitsFromExcelMutation,
  useImportProcedureDelayCategoriesFromExcelMutation,
} from "../../../../features/theatre/theatreGraphqlApi";

const lookupMeta = {
  regions: {
    title: "Regions",
    icon: "bx-map",
    description: "Register patient and referring facility regions.",
    fields: ["name", "code"],
    queryKey: "regions",
    mutationKey: "regions",
    hasTemplate: true,
    downloadQueryKey: "regionTemplate",
    importMutationKey: "regions",
  },
  "internal-sources": {
    title: "Internal Sources",
    icon: "bx-building",
    description: "Register wards and MNH internal areas used as patient sources.",
    fields: ["name", "code"],
    queryKey: "internalSources",
    mutationKey: "internalSources",
    hasTemplate: true,
    downloadQueryKey: "internalSourceTemplate",
    importMutationKey: "internalSources",
  },
  "external-sources": {
    title: "External Sources",
    icon: "bx-plus-medical",
    description: "Register external hospitals and health care facilities.",
    fields: ["name", "code", "regionUid"],
    queryKey: "externalSources",
    mutationKey: "externalSources",
    hasTemplate: true,
    downloadQueryKey: "externalSourceTemplate",
    importMutationKey: "externalSources",
  },
  "theatre-units": {
    title: "Surgical Theatre Units",
    icon: "bx-clinic",
    description: "Register theatre units, codes, and locations.",
    fields: ["name", "code", "location"],
    queryKey: "theatreUnits",
    mutationKey: "theatreUnits",
    hasTemplate: true,
    downloadQueryKey: "theatreUnitTemplate",
    importMutationKey: "theatreUnits",
  },
  "death-reasons": {
    title: "Death Reasons",
    icon: "bx-first-aid",
    description: "Register standard patient death reasons.",
    fields: ["name", "code"],
    queryKey: "deathReasons",
    mutationKey: "deathReasons",
    hasTemplate: true,
    downloadQueryKey: "deathReasonTemplate",
    importMutationKey: "deathReasons",
  },
  "procedure-delay-categories": {
    title: "Procedure Delay Categories",
    icon: "bx-category",
    description: "Categorise procedure delay reasons.",
    fields: ["name", "code"],
    queryKey: "procedureDelayCategories",
    mutationKey: "procedureDelayCategories",
    hasTemplate: true,
    downloadQueryKey: "procedureDelayCategoryTemplate",
    importMutationKey: "procedureDelayCategories",
  },
};

const FieldError = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => <div className="invalid-feedback d-block">{msg}</div>}
  </ErrorMessage>
);

const normaliseHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const buildLookupPayload = (values, fields) =>
  fields.reduce(
    (payload, field) => ({
      ...payload,
      [field]: values[field] || "",
    }),
    values.uid ? { uid: values.uid } : {}
  );

const LookupModal = ({ meta, item, regions, registerItems, onSuccess, onClose }) => {
  const regionOptions = regions.map((region) => ({
    value: region.uid,
    label: `${region.name} (${region.code || "N/A"})`,
    ...region,
  }));

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    code: Yup.string().required("Code is required"),
    regionUid: meta.fields.includes("regionUid")
      ? Yup.string().required("Region is required")
      : Yup.string().notRequired(),
  });

  const initialValues = {
    name: "",
    code: "",
    regionUid: "",
    location: "",
    description: "",
    ...(item || {}),
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const result = await registerItems([buildLookupPayload(values, meta.fields)]).unwrap();
      if (result?.status === false) {
        throw new Error(result?.message || "GraphQL request failed");
      }

      showToast(`${meta.title} saved successfully`, "success", "Complete");
      resetForm();
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Lookup save failed:", error);
      showToast(error?.message || `Unable to save ${meta.title}`, "error", "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
      {({ isSubmitting, setFieldValue }) => (
        <GraphqlModal
          isOpen
          title={item?.uid ? `Update ${meta.title}` : `Add ${meta.title}`}
          subtitle="Saved directly through the Theatre GraphQL endpoint."
          icon={<Boxes size={20} />}
          onClose={onClose}
          isSubmitting={isSubmitting}
          footer={
            <>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" form="lookupForm" className="btn btn-primary" disabled={isSubmitting}>
                <i className="bx bx-save me-1"></i>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </>
          }
        >
          <Form id="lookupForm">
            <div className="row">
              <div className="col-md-8 mb-3">
                <label className="form-label">Name</label>
                <Field name="name" className="form-control" placeholder="Enter name" />
                <FieldError name="name" />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Code</label>
                <Field name="code" className="form-control" placeholder="Enter code" />
                <FieldError name="code" />
              </div>

              {meta.fields.includes("regionUid") && (
                <div className="row" style={{ minHeight: "300px" }}>
                  <FormikSelect
                  name="regionUid"
                  label="Region"
                  staticOptions={regionOptions}
                  mapOption={(option) => option}
                  containerClass="col-md-6 mb-3"
                  placeholder="Select region..."
                    minChars={2}
                  onSelectObject={(option) => setFieldValue("regionUid", option?.value || "")}
                    debounceMs={500}
                    styles={{
                      menu: (base) => ({
                        ...base,
                        position: "absolute",
                        zIndex: 99999,
                      }),
                    }}
                />
                </div>

              )}

              {meta.fields.includes("location") && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">Location</label>
                  <Field name="location" className="form-control" placeholder="e.g. Main theatre block" />
                </div>
              )}

              {meta.fields.includes("description") && (
                <div className="col-12 mb-3">
                  <label className="form-label">Description</label>
                  <Field name="description" className="form-control" as="textarea" rows="3" placeholder="Describe this item..." />
                </div>
              )}
            </div>
          </Form>
        </GraphqlModal>
      )}
    </Formik>
  );
};

const LookupView = () => {
  const { lookupSlug = "regions" } = useParams();
  const meta = lookupMeta[lookupSlug] || lookupMeta.regions;
  const fileInputRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const queryHooks = {
    regions: useGetRegionsQuery,
    internalSources: useGetInternalSourcesQuery,
    externalSources: useGetExternalSourcesQuery,
    theatreUnits: useGetTheatreUnitsQuery,
    deathReasons: useGetDeathReasonsQuery,
    procedureDelayCategories: useGetProcedureDelayCategoriesQuery,
  };

  // All register mutations called at top level
  const [registerRegions] = useRegisterRegionsMutation();
  const [registerInternalSources] = useRegisterInternalSourcesMutation();
  const [registerExternalSources] = useRegisterExternalSourcesMutation();
  const [registerTheatreUnits] = useRegisterTheatreUnitsMutation();
  const [registerDeathReasons] = useRegisterDeathReasonsMutation();
  const [registerProcedureDelayCategories] = useRegisterProcedureDelayCategoriesMutation();

  const mutationMap = {
    regions: registerRegions,
    internalSources: registerInternalSources,
    externalSources: registerExternalSources,
    theatreUnits: registerTheatreUnits,
    deathReasons: registerDeathReasons,
    procedureDelayCategories: registerProcedureDelayCategories,
  };

  // All import mutations called at top level
  const [importRegions] = useImportRegionsFromExcelMutation();
  const [importInternalSources] = useImportInternalSourcesFromExcelMutation();
  const [importExternalSources] = useImportExternalSourcesFromExcelMutation();
  const [importTheatreUnits] = useImportTheatreUnitsFromExcelMutation();
  const [importDeathReasons] = useImportDeathReasonsFromExcelMutation();
  const [importProcedureDelayCategories] = useImportProcedureDelayCategoriesFromExcelMutation();

  const importMutationMap = {
    regions: importRegions,
    internalSources: importInternalSources,
    externalSources: importExternalSources,
    theatreUnits: importTheatreUnits,
    deathReasons: importDeathReasons,
    procedureDelayCategories: importProcedureDelayCategories,
  };

  // All lazy download template hooks called at top level
  const [triggerDownloadRegionTemplate] = useLazyDownloadRegionTemplateQuery();
  const [triggerDownloadInternalSourceTemplate] = useLazyDownloadInternalSourceTemplateQuery();
  const [triggerDownloadExternalSourceTemplate] = useLazyDownloadExternalSourceTemplateQuery();
  const [triggerDownloadTheatreUnitTemplate] = useLazyDownloadTheatreUnitTemplateQuery();
  const [triggerDownloadDeathReasonTemplate] = useLazyDownloadDeathReasonTemplateQuery();
  const [triggerDownloadProcedureDelayCategoryTemplate] = useLazyDownloadProcedureDelayCategoryTemplateQuery();

  const downloadTriggerMap = {
    regionTemplate: triggerDownloadRegionTemplate,
    internalSourceTemplate: triggerDownloadInternalSourceTemplate,
    externalSourceTemplate: triggerDownloadExternalSourceTemplate,
    theatreUnitTemplate: triggerDownloadTheatreUnitTemplate,
    deathReasonTemplate: triggerDownloadDeathReasonTemplate,
    procedureDelayCategoryTemplate: triggerDownloadProcedureDelayCategoryTemplate,
  };

  const { data: regionsResponse } = useGetRegionsQuery({ limit: 500 });
  const regions = useMemo(() => regionsResponse?.data?.items || [], [regionsResponse]);
  const useLookupQuery = queryHooks[meta.queryKey] || useGetRegionsQuery;
  const registerItems = mutationMap[meta.mutationKey] || registerRegions;
  const activeImportMutation = importMutationMap[meta.importMutationKey];
  const activeDownloadTrigger = meta.hasTemplate ? downloadTriggerMap[meta.downloadQueryKey] : null;

  const openModal = (item = null) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const importExcel = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      const mappedRows = rows
        .map((row) => {
          const normalized = Object.entries(row).reduce((acc, [key, value]) => {
            acc[normaliseHeader(key)] = value;
            return acc;
          }, {});
          const regionName = normalized.region || normalized.region_name || "";
          const region = regions.find((item) => item.name.toLowerCase() === String(regionName).toLowerCase());

          return buildLookupPayload(
            {
              name: normalized.name || normalized.region || normalized.hospital_name || "",
              code: normalized.code || "",
              location: normalized.location || "",
              description: normalized.description || "",
              regionUid: region?.uid || "",
            },
            meta.fields
          );
        })
        .filter((row) => row.name && row.code);

      const result = await registerItems(mappedRows).unwrap();
      if (result?.status === false) {
        throw new Error(result?.message || "GraphQL request failed");
      }

      showToast(`${mappedRows.length} rows imported`, "success", "Import Complete");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Excel import failed:", error);
      showToast(error?.message || "Unable to import Excel file", "error", "Import Failed");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <>
      <style>
        {`
          .mnh-dropdown-header {
            background: linear-gradient(135deg, #1976d2 0%, #e53935 50%, #ffd700 100%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            position: relative;
            overflow: hidden;
            color: #fff;
            border-radius: "30px";
          }

        `}
      </style>


      <BreadCumb pageList={["Theatre Performance Monitor", meta.title]} />

      <div className="card mb-4 mnh-dropdown-header shadow-sm animate__animated animate__fadeInDown animate__faster">
        <div className="card-body ">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="mb-1 fw-bold text-white">
                <i className={`bx ${meta.icon} me-2`}></i>
                {meta.title}
              </h4>
              <p className="text-white mb-0">{meta.description}</p>
            </div>
            <div className="d-flex gap-3">
              {meta.hasTemplate && (
                <button className="btn btn-sm btn-outline-info" style={{ minWidth: "120px", border: "0.5px solid white" }} type="button" onClick={() => setImportModalOpen(true)}>
                  <i className="bx bx-upload me-2"></i>Import Excel
                </button>
              )}
              {!meta.hasTemplate && (
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="d-none" onChange={importExcel} />
              )}
              {!meta.hasTemplate && (
                <button className="btn btn-sm btn-outline-info" style={{ minWidth: "100px", border: "0.5px solid white" }} type="button" onClick={() => fileInputRef.current?.click()}>
                  <i className="bx bx-upload me-2"></i>Import Excel
                </button>
              )}
              <button className="btn btn-primary btn-sm" style={{ minWidth: "100px", border: "0.5px solid white" }} type="button" onClick={() => openModal()}>
                <i className="bx bx-plus me-2"></i>Add New
              </button>
            </div>
          </div>
        </div>
      </div>

      <TheatreGraphqlPaginatedTable
        key={lookupSlug}
        useQuery={useLookupQuery}
        title={meta.title}
        isRefresh={refreshKey}
        searchPlaceholder="Search lookup..."
        columns={[
          { key: "SN", label: "SN", style: { width: "70px" }, className: "text-center" },
          {
            key: "name",
            label: "Name",
            render: (row) => (
              <div>
                <span className="fw-semibold text-dark">{row.name}</span>
                {row.location && <small className="text-muted d-block">Location: {row.location}</small>}
                {row.region && (
                  <small className="text-muted d-block">
                    Region: <span className="fw-semibold text-dark">{row.region?.name}</span>
                  </small>
                )}
              </div>
            ),
          },
          {
            key: "code",
            label: "Code",
            style: { width: "160px" },
            render: (row) => <span className="badge bg-label-info">{row.code || "N/A"}</span>,
          },
          {
            key: "actions",
            label: "Actions",
            className: "text-center",
            style: { width: "90px" },
            render: (row) => (
              <button className="btn btn-sm btn-outline-secondary border-0" type="button" title="Edit" onClick={() => openModal(row)}>
                <i className="bx bx-edit"></i>
              </button>
            ),
          },
        ]}
      />

      {modalOpen && (
        <LookupModal
          meta={meta}
          item={selectedItem}
          regions={regions}
          registerItems={registerItems}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
          onClose={() => {
            setModalOpen(false);
            setSelectedItem(null);
          }}
        />
      )}

      {importModalOpen && meta.hasTemplate && activeImportMutation && activeDownloadTrigger && (
        <LookupImportModal
          meta={meta}
          importMutation={activeImportMutation}
          downloadTemplateQuery={activeDownloadTrigger}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
          onClose={() => setImportModalOpen(false)}
        />
      )}
    </>
  );
};

export default LookupView;