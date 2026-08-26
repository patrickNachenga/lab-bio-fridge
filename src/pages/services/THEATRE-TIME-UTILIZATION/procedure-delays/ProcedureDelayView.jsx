import React, { useMemo, useState } from "react";
import BreadCumb from "../../../../layouts/BreadCumb";
import TheatreGraphqlPaginatedTable from "../../../../components/ui-templates/TheatreGraphqlPaginatedTable";
import {
  useGetProcedureDelayCategoriesQuery,
  useGetProcedureDelayCausesQuery,
} from "../../../../features/theatre/theatreGraphqlApi";
import ProcedureDelayModal from "./ProcedureDelayModal";

const ProcedureDelayView = () => {
  const [selectedDelayCause, setSelectedDelayCause] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: delayCategoryResponse } = useGetProcedureDelayCategoriesQuery({ limit: 100 });
  const delayCategories = useMemo(() => delayCategoryResponse?.data?.items || [], [delayCategoryResponse]);

  const getCategoryName = (categoryUid) => {
    const cat = delayCategories.find((c) => c.uid === categoryUid);
    return cat?.name || "N/A";
  };

  const openModal = (delayCause = null) => {
    setSelectedDelayCause(delayCause);
    setModalOpen(true);
  };

  return (
    <>
      <BreadCumb pageList={["Theatre Performance Monitor", "Procedure Delay"]} />

      <style>
        {`
        .mnh-dropdown-header {
        background: linear-gradient(135deg, #e53935 5%, #1976d2 50%, #ffd700  100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
        color: #fff;
        }

        `}
      </style>

      <div className="card mb-4 shadow-sm animate__animated animate__fadeInDown animate__faster">
        <div className="card-body mnh-dropdown-header ">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="mb-1 fw-bold text-white">
                <i className="bx bx-error-circle me-2"></i>Procedure Delay
              </h4>
              <p className="text-secondary mb-0 text-white">Maintain theatre delay causes used in utilization forms.</p>
            </div>

            <div className="d-flex gap-3">

              <button className="btn btn-sm btn-primary" type="button" style={{ border: "0.5px solid white" }} onClick={() => openModal()}>
                <i className="bx  bx-plus me-2"></i>Add Delay Cause
            </button>
            </div>
          </div>
        </div>
      </div>

      <TheatreGraphqlPaginatedTable
        key="procedure-delays"
        useQuery={useGetProcedureDelayCausesQuery}
        title="Procedure Delay Causes"
        isRefresh={refreshKey}
        searchPlaceholder="Search delay causes..."
        columns={[
          { key: "SN", label: "SN", style: { width: "70px" }, className: "text-center" },
          {
            key: "name",
            label: "Delay Cause",
            style: { minWidth: "240px" },
            render: (row) => (
              <div>
                <span className="fw-semibold text-dark">{row.name}</span>
              </div>
            ),
          },
          {
            key: "code",
            label: "Code",
            style: { width: "150px" },
            render: (row) => <span className="badge bg-label-warning">{row.code || "N/A"}</span>,
          },
          {
            key: "category",
            label: "category",
            render: (row) => <span className="text-muted text-wrap">{row.procedureDelayCategory?.name || "-"}</span>,
          },
          {
            key: "description",
            label: "Description",
            render: (row) => <span className="text-muted text-wrap">{row.description || "-"}</span>,
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
        <ProcedureDelayModal
          delayCause={selectedDelayCause}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
          onClose={() => {
            setModalOpen(false);
            setSelectedDelayCause(null);
          }}
        />
      )}
    </>
  );
};

export default ProcedureDelayView;
