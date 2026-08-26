import React, { useRef, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Boxes } from "lucide-react";
import GraphqlModal from "../../../../components/GraphqlModal";
import showToast from "../../../../helpers/ToastHelper";

const FileUpload = ({ file, onChange, onClear, accept }) => (
    <div>
        <div className="border rounded-3 p-4 text-center bg-light" style={{ cursor: "pointer" }}>
            {!file ? (
                <label className="d-block mb-0" style={{ cursor: "pointer" }}>
                    <i className="bx bx-upload fs-1 text-primary d-block mb-2"></i>
                    <span className="fw-semibold">Click to select an Excel file</span>
                    <br />
                    <small className="text-muted">Accepts .xlsx, .xls files</small>
                    <input
                        type="file"
                        className="d-none"
                        accept={accept || ".xlsx,.xls"}
                        onChange={onChange}
                    />
                </label>
            ) : (
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 p-3 rounded">
                            <FileSpreadbox size={24} className="text-primary" />
                        </div>
                        <div className="text-start">
                            <span className="fw-semibold d-block text-dark">{file.name}</span>
                            <small className="text-muted">{(file.size / 1024).toFixed(1)} KB</small>
                        </div>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-danger border-0" onClick={onClear}>
                        <i className="bx bx-x"></i>
                    </button>
                </div>
            )}
        </div>
    </div>
);

const FileSpreadbox = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
        <line x1="8" y1="9" x2="10" y2="9" />
    </svg>
);

const LookupImportModal = ({ meta, importMutation, downloadTemplateQuery, onSuccess, onClose }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const fileInputRef = useRef(null);

    const validationSchema = Yup.object().shape({
        file: Yup.mixed().required("Please select an Excel file to import"),
    });

    const initialValues = { file: null };

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
        });

    const handleDownloadTemplate = async () => {
        try {
            setIsDownloading(true);
            // downloadTemplateQuery is a lazy query trigger that returns { data, error }
            const response = await downloadTemplateQuery();
            const result = response?.data?.data || response?.data;
            if (!result || result?.status === false) {
                throw new Error(result?.message || "Failed to download template");
            }
            const { fileName, base64Data } = result || {};
            if (!base64Data) {
                throw new Error("No template data received");
            }

            const binary = atob(base64Data);
            const array = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                array[i] = binary.charCodeAt(i);
            }
            const blob = new Blob([array], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName || `${meta.title.toLowerCase().replace(/\s+/g, "_")}_import_template.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showToast("Template downloaded successfully", "success", "Download Complete");
        } catch (error) {
            console.error("Template download failed:", error);
            showToast(error?.message || "Unable to download template", "error", "Download Failed");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        if (!values.file) {
            showToast("Please select a file to import", "warning", "No File");
            return;
        }

        try {
            const base64Data = await toBase64(values.file);
            const fileInput = {
                fileName: values.file.name,
                base64Data: base64Data,
            };

            const result = await importMutation(fileInput).unwrap();
            if (result?.status === false) {
                throw new Error(result?.message || "Import failed");
            }

            const successfulCount = result?.data?.successfulCount ?? result?.data?.items?.length ?? 0;
            const failedCount = result?.data?.failedCount ?? 0;
            const failedRecordsFile = result?.data?.failedRecordsFile;
            const outcome = failedCount === 0
                ? "complete"
                : successfulCount > 0
                    ? "partial"
                    : "failed";

            setImportResult({ successfulCount, failedCount, failedRecordsFile, outcome });
            showToast(
                `${successfulCount} completed, ${failedCount} failed`,
                outcome === "complete" ? "success" : "warning",
                outcome === "complete"
                    ? "Import Complete"
                    : outcome === "partial"
                        ? "Import Partially Completed"
                        : "Import Failed" 
            );
            resetForm();
            if (fileInputRef.current) fileInputRef.current.value = "";
            onSuccess?.();
        } catch (error) {
            console.error("Import failed:", error);
            showToast(error?.message || "Unable to import file. Check your data and try again.", "error", "Import Failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDownloadFailedRecords = () => {
        if (!importResult?.failedRecordsFile) return;

        try {
            const binary = atob(importResult.failedRecordsFile);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }

            const blob = new Blob([bytes], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${meta.title.toLowerCase().replace(/\s+/g, "_")}_failed_records.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed records download failed:", error);
            showToast("Unable to download failed records", "error", "Download Failed");
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, values, setFieldValue, resetForm }) => (
                <GraphqlModal
                    isOpen
                    title={`Import ${meta.title}`}
                    subtitle="Upload an Excel file to bulk import records."
                    icon={<Boxes size={20} />}
                    onClose={onClose}
                    isSubmitting={isSubmitting}
                    size="md"
                    footer={
                        <>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={onClose}
                                disabled={isSubmitting}
                                style={{ border: "0.5px solid gray", minWidth: "120px" }}
                            >
                                {importResult ? "Close" : "Cancel"}
                            </button>

                            {!importResult && <button
                                type="submit"
                                form="importForm"
                                className="btn btn-primary"
                                disabled={isSubmitting || !values.file}
                            >
                                <i className={`bx ${isSubmitting ? "bx-loader-alt bx-spin" : "bx-upload"} me-1`}></i>
                                {isSubmitting ? "Importing..." : "Import"}
                            </button>}
                        </>
                    }
                >
                    <Form id="importForm">
                        {importResult && (
                            <div
                                className={`alert ${importResult.outcome === "complete"
                                    ? "alert-success"
                                    : importResult.outcome === "partial"
                                        ? "alert-warning"
                                        : "alert-danger"
                                    } mb-4 shadow-sm border-0`}
                                role="alert"
                            >
                                <div className="d-flex align-items-start gap-3">

                                    <div className="fs-3">
                                        {importResult.outcome === "complete"
                                            ? "✅"
                                            : importResult.outcome === "partial"
                                                ? "⚠️"
                                                : "❌"}
                                    </div>

                                    <div className="flex-grow-1">

                                        <h6 className="alert-heading fw-bold mb-2">
                                            {importResult.outcome === "complete"
                                                ? "Import Completed Successfully"
                                                : importResult.outcome === "partial"
                                                    ? "Import Completed with Some Errors"
                                                    : "Import Failed"}
                                        </h6>

                                        <div className="d-flex gap-3 flex-wrap mb-2">

                                            <span className="badge bg-success px-3 py-2">
                                                ✓ {importResult.successfulCount} Successful
                                            </span>

                                            <span className="badge bg-danger px-3 py-2">
                                                ✕ {importResult.failedCount} Failed
                                            </span>

                                        </div>


                                        {importResult.failedRecordsFile && (
                                            <div className="mt-3 p-3 bg-white rounded border">
                                                <div className="fw-semibold mb-1">
                                                    Failed Records Available
                                                </div>

                                                <div className="small text-muted">
                                                    Download the failed records file, fix the errors,
                                                    and upload it again.
                                                </div>
                                                {importResult?.failedRecordsFile && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-warning"
                                                        onClick={handleDownloadFailedRecords}
                                                        disabled={isSubmitting}
                                                        style={{ border: "0.5px solid orange", minWidth: "180px", marginTop: "8px" }}
                                                    >
                                                        <i className="bx bx-download me-1"></i>
                                                        Download Failed Records
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                    </div>

                                </div>
                            </div>
                        )}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0">Download Template</h6>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-info"
                                    onClick={handleDownloadTemplate}
                                    disabled={isDownloading}
                                    style={{ border: "0.5px solid green" }}
                                >
                                    <i className={`bx ${isDownloading ? "bx-loader-alt bx-spin" : "bx-download"} me-1`}></i>
                                    {isDownloading ? "Downloading..." : "Download Template"}
                                </button>
                            </div>
                            <p className="text-muted small mb-0">
                                Download the import template to see the required columns and format.
                                Prepare your data according to the template and then upload.
                            </p>
                        </div>

                        <hr className="my-3" />

                        <div className="mb-3">
                            <h6 className="fw-bold mb-1">Upload Excel File</h6>
                            <p className="text-muted small mb-3">
                                Select your prepared Excel file (.xlsx or .xls) containing the data to import.
                            </p>

                            <FileUpload
                                file={values.file}
                                onChange={(event) => {
                                    const file = event.currentTarget.files?.[0];
                                    if (file) {
                                        if (file.size > 10 * 1024 * 1024) {
                                            showToast("File size must be less than 10MB", "warning", "File Too Large");
                                            event.target.value = "";
                                            return;
                                        }
                                        setFieldValue("file", file);
                                    }
                                }}
                                onClear={() => {
                                    setFieldValue("file", null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                            />
                        </div>
                    </Form>
                </GraphqlModal>
            )}
        </Formik>
    );
};

export default LookupImportModal;
