import React, { useMemo } from "react";
import * as XLSX from "xlsx";
import BreadCumb from "../../../../layouts/BreadCumb";
import TheatreGraphqlPaginatedTable from "../../../../components/ui-templates/TheatreGraphqlPaginatedTable";
import showToast from "../../../../helpers/ToastHelper";
import { useGetTheatreTimeRecordsQuery } from "../../../../features/theatre/theatreGraphqlApi";

const TheatreTimeReportsPage = () => {
  const { data: recordsResponse } = useGetTheatreTimeRecordsQuery({ limit: 1000 });
  const records = useMemo(() => recordsResponse?.data?.items || [], [recordsResponse]);

  const exportReport = () => {
    const rows = records.map((record, index) => ({
      SN: index + 1,
      UID: record.uid,
      MRN: record.patientMrn || "N/A",
      "Procedure Date": record.procedureDate || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Performance Report");
    XLSX.writeFile(workbook, "theatre-performance-monitor-report.xlsx");
    showToast("Report exported successfully", "success", "Export Complete");
  };

  return (
    <>
      <BreadCumb pageList={["Theatre Performance Monitor", "Reports"]} />

      <div className="card mb-4">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 className="mb-1">GraphQL Performance Report</h5>
            <p className="text-muted mb-0">Exports the fields currently exposed by the theatre record endpoint.</p>
          </div>
          <button className="btn btn-success" type="button" onClick={exportReport}>
            <i className="bx bx-download me-2"></i>Export Excel
          </button>
        </div>
      </div>

      <TheatreGraphqlPaginatedTable
        useQuery={useGetTheatreTimeRecordsQuery}
        title="Performance Monitor Report"
        columns={[
          { key: "SN", label: "SN", className: "text-center", style: { width: "70px" } },
          {
            key: "patientMrn",
            label: "Patient MRN",
            render: (row) => <span className="fw-semibold text-primary">{row.patientMrn || "N/A"}</span>,
          },
          {
            key: "procedureDate",
            label: "Procedure Date",
            render: (row) => row.procedureDate || "N/A",
          },
          {
            key: "uid",
            label: "Record UID",
            render: (row) => <small className="text-muted">{row.uid}</small>,
          },
        ]}
      />
    </>
  );
};

export default TheatreTimeReportsPage;
