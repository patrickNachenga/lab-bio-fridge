import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadCumb from "../../../../layouts/BreadCumb";
import TheatreGraphqlPaginatedTable from "../../../../components/ui-templates/TheatreGraphqlPaginatedTable";
import { useGetTheatreTimeRecordsQuery } from "../../../../features/theatre/theatreGraphqlApi";
import { TheatreTimeFormModal } from "./TheatreTimeFormModal";
import { formatTime12Hour } from "../../../../helpers/WordHelper";
import { formatDuration } from "../../../../services/theatreTimeUtilizationService";

export const TheatreTimeRecordsPage = () => {
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const openModal = (record = null) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const viewRecord = (uid) => {
    navigate(`/theatre-time-utilization/procedure-records/${uid}`);
  };

  return (
    <>
      <BreadCumb pageList={["Theatre Time Utilization", "Procedure Records"]} />

      <style>
        {`
        .mnh-dropdown-header {
          background: linear-gradient(135deg, #e53935 5%, #1976d2 50%, #ffd700  100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          color: #fff;
          border-radius: "30px";
          
        }

        `}
      </style>

      <div className="card mb-4 mnh-dropdown-header shadow-sm animate__animated animate__fadeInDown animate__faster">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="mb-1 fw-bold text-white">
                <i className="bx bx-clipboard me-2 "></i>Theatre Procedure Records
              </h4>
              <p className="text-secondary text-white mb-0">Captured procedure Records, delay status, and delay causes.</p>
            </div>
            <button className="btn btn-sm btn-primary" type="button" onClick={() => openModal()}>
              <i className="bx bx-plus me-2"></i>Fill Form
            </button>
          </div>
        </div>
      </div>

      <TheatreGraphqlPaginatedTable
        key="theatre-time-records"
        useQuery={useGetTheatreTimeRecordsQuery}
        title="Submitted Forms"
        isRefresh={refreshKey}
        searchPlaceholder="Search forms..."
        columns={[
          {
            key: "SN",
            label: "SN",
            className: "text-center",
            style: { width: "60px" },
          },

          {
            key: "patient",
            label: "Patient",
            style: { width: "200px" },
            render: (row) => (
              <div className="medium">
                <div className="fw-semibold">{row.patientMrn || "N/A"}</div>
                <div className="text-muted " style={{ fontSize: "13px" }}>
                  <span className="text-primary">{row.patientSex || "-"}</span>
                  <strong className="text-dark p-2">|</strong>
                  <span className={`badge ${row.patientType === "ELECTIVE" ? "text-warning" : "text-danger"}`} >{row.patientType || "-"}</span>
                  <div className="text-muted" style={{ fontSize: "13px" }}>
                    {row.patientRegion?.name || "-"}
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: "unit",
            label: "Unit",
            style: { width: "180px" },
            render: (row) => (
              <div className="small">
                {row.theatreUnit?.name || "N/A"}
              </div>
            ),
          },

          {
            key: "procedure",
            label: "Procedure",
            style: { width: "250px" },
            render: (row) => (
              <div className="">
                <div className="fw-semibold">
                  {row.procedure?.name || "N/A"}
                </div>
                <div className="text-muted small">
                  ICD-10 : <strong>{row.procedure?.code || "-"}</strong>
                </div>
              </div>
            ),
          },

          {
            key: "time",
            label: "Date & Time",
            style: { width: "160px" },
            render: (row) => (
              <div className="small">
                <div>{row.procedureDate || "-"}</div>
                <div className="text-muted">
                  <span className="text-info"> {formatTime12Hour(row.procedureStartTime)}</span> → <span className="text-primary">{formatTime12Hour(row.procedureEndTime)}</span>
                </div>
              </div>
            ),
          },

          {
            key: "duration",
            label: "Duration",
            className: "text-center",
            style: { width: "130px" },
            render: (row) => (
              <span style={{ fontSize: "14px" }} >
                {formatDuration(row.durationMinutes)}
              </span>
            ),
          },

          {
            key: "delay",
            label: "Delay",
            className: "text-center",
            style: { width: "80px", },
            render: (row) => (
              <span
                className={`badge ${row.hadDelay ? "bg-danger" : "bg-info"
                  }`}
                style={{ fontSize: "12px", fontWeight: "bold" }}
              >
                {row.hadDelay ? "YES" : "NO"}
              </span>
            ),
          },

          {
            key: "outcome",
            label: "Outcome",
            className: "text-center",
            style: { width: "100px" },
            render: (row) => (
              <span
                className={`badge ${row.outcome === "DEATH"
                  ? "bg-danger"
                  : "bg-secondary"
                  }`}
                style={{ fontSize: "12px" }}
              >
                {row.outcome}
              </span>
            ),
          },

          {
            key: "createdBy",
            label: "Submitted By",
            style: { width: "180px" },
            render: (row) => (
              <div className="small">
                {row.createdBy
                  ? `${row.createdBy}`
                  : "-"}
              </div>
            ),
          },

          {
            key: "actions",
            label: "Actions",
            className: "text-center",
            style: { width: "120px" },
            render: (row) => (
              <div className="btn-group btn-group-sm">
                <button
                  className="btn btn-sm btn-outline-info"
                  style={{ width: "80px" }}
                  onClick={() => viewRecord(row.uid)}
                >
                  <i class="bx bx-chevron-right" />
                  View
                </button>
              </div>
            ),
          },
        ]}
      />

      {modalOpen && (
        <TheatreTimeFormModal
          selectedRecord={selectedRecord}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
          onClose={() => {
            setModalOpen(false);
            setSelectedRecord(null);
          }}
        />
      )}
    </>
  );
};
