import React, { useRef, useState } from "react";
import BreadCumb from "../../../../layouts/BreadCumb";
import TheatreGraphqlPaginatedTable from "../../../../components/ui-templates/TheatreGraphqlPaginatedTable";
import { useGetProceduresQuery, useLazyDownloadProcedureTemplateQuery, useImportProcedureFromExcelMutation } from "../../../../features/theatre/theatreGraphqlApi";
import ProcedureModal from "./ProcedureModal";
import ProcedureImportModal from "./procedureImportModal";

const formatDuration = (minutes) => {
  const value = Number(minutes || 0);
  if (!value) return "N/A";
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  return [hours ? `${hours}h` : "", mins ? `${mins}m` : ""].filter(Boolean).join(" ");
};

const ProcedureView = () => {
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const fileInputRef = useRef(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [downloadTemplate] = useLazyDownloadProcedureTemplateQuery();
  const [importProcedures] = useImportProcedureFromExcelMutation();



  const openModal = (procedure = null) => {
    setSelectedProcedure(procedure);
    setModalOpen(true);
  };

  return (
    <>
      <BreadCumb pageList={["Theatre Performance Monitor", "Procedures"]} />
      <style>
        {`
        .mnh-dropdown-header {
        background: linear-gradient(135deg, #e53935 0%, #1976d2 50%, #ffd700 100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
        color: #fff;
        }

        `}
      </style>

      <div className="card mb-4 shadow-sm animate__animated animate__fadeInDown animate__faster">
        <div className="card-body mnh-dropdown-header">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="mb-1 fw-bold text-white"> 
                <i className="bx bx-task me-2"></i>Procedures
              </h4>
              <p className="text-white mb-0">Maintain theatre procedure types used in utilization forms.</p>
            </div>

            <div className="d-flex gap-3">
              <button className="btn btn-sm btn-outline-info" style={{ minWidth: "120px", border: "0.5px solid white" }} type="button" onClick={() => setImportModalOpen(true)}>
                <i className="bx bx-upload me-2"></i>Import Excel
              </button>

              <button className="btn btn-sm btn-primary" type="button" style={{ border: "0.5px solid white" }} onClick={() => openModal()}>
                <i className="bx bx-plus me-2"></i>Add Procedure
              </button>
            </div>
          </div>
        </div>
      </div>

      <TheatreGraphqlPaginatedTable
        key="procedures"
        useQuery={useGetProceduresQuery}
        title="Procedure Types"
        isRefresh={refreshKey}
        searchPlaceholder="Search procedures..."
        columns={[
          { key: "SN", label: "SN", style: { width: "70px" }, className: "text-center" },
          {
            key: "name",
            label: "Procedure",
            render: (row) => (
              <div>
                <span className="fw-semibold text-dark">{row.name}</span>
              </div>
            ),
          },
          {
            key: "code",
            label: "ICD-10 Code",
            style: { width: "160px" },
            render: (row) => <span className="badge bg-label-info">{row.code || "N/A"}</span>,
          },
          {
            key: "estimatedMinutes",
            label: "Estimated Time",
            style: { width: "170px" },
            render: (row) => (
              <span className="badge bg-label-primary">
                {row.estimatedMinutes ? formatDuration(row.estimatedMinutes) : "N/A"}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            className: "text-center",
            style: { width: "120px" },
            render: (row) => (
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-secondary border-0"
                  type="button"
                  title="Edit"
                  onClick={() => openModal(row)}
                >
                  <i className="bx bx-edit"></i>
                </button>
              </div>
            ),
          },
        ]}
      />

      {modalOpen && (
        <ProcedureModal
          procedure={selectedProcedure}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
          onClose={() => {
            setModalOpen(false);
            setSelectedProcedure(null);
          }}
        />
      )}

      {importModalOpen && (
        <ProcedureImportModal
          meta={{ title: "Procedures" }}
          importMutation={importProcedures}
          downloadTemplateQuery={downloadTemplate}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
          onClose={() => setImportModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProcedureView;
