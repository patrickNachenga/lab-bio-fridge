import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import BreadCumb from "../../../../layouts/BreadCumb";
import { BarChart, DoughnutChart, StatCard } from "../../../../components/DashboardCharts";
import {
  useGetTheatreTimeRecordsQuery,
  useGetDashboardStatsQuery,
  useGetDelayDistributionQuery,
  useGetTheatreUnitActivityQuery,
} from "../../../../features/theatre/theatreGraphqlApi";

const emptyChart = [{ label: "No data", count: 0, color: "#94a3b8" }];

const TheatreTimeDashboard = () => {
  const { data: recordsResponse } = useGetTheatreTimeRecordsQuery({ limit: 8 });
  const { data: statsResponse } = useGetDashboardStatsQuery();
  const { data: delayResponse } = useGetDelayDistributionQuery();
  const { data: unitResponse } = useGetTheatreUnitActivityQuery();

  const records = useMemo(() => recordsResponse?.data?.items || [], [recordsResponse]);
  const total = recordsResponse?.data?.totalCount ?? records.length;

  const stats = useMemo(() => ({
    delayRate: statsResponse?.data?.delayRate,
    avgProcedureMinutes: statsResponse?.data?.avgProcedureMinutes,
    missedEstimateRate: statsResponse?.data?.missedEstimateRate,
  }), [statsResponse]);

  const delayData = useMemo(() =>
    delayResponse?.data?.items && delayResponse.data.items.length > 0
      ? delayResponse.data.items
      : emptyChart,
    [delayResponse]);

  const unitData = useMemo(() =>
    unitResponse?.data?.items && unitResponse.data.items.length > 0
      ? unitResponse.data.items
      : emptyChart,
    [unitResponse]);

  return (
    <>
      <BreadCumb pageList={["Theatre Performance Monitor", "Dashboard"]} />

      <style>
        {`
        .mnh-dropdown-header {
        background: linear-gradient(135deg, #e53935 5%, #1976d2 50%, #ffd700  100%);
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        overflow: hidden;
        color: #fff;
        border-radius: 20px;
        }

        `}
      </style>

      <div className="card mb-4 mnh-dropdown-header  shadow-sm animate__animated animate__fadeInDown animate__faster">
        <div className="card-body ">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h4 className="mb-1 fw-bold text-white">
                <i className="bx bx-tachometer me-2"></i>Theatre Performance Monitor
              </h4>
              <p className="text-secondary mb-0 text-white">Live GraphQL overview for theatre time records.</p>
            </div>
            <Link className="btn btn-sm btn-primary" style={{ border: "0.5px solid white" }} to="/theatre-time-utilization/procedure-records">
              <i className="bx bx-plus me-2"></i>Fill Form
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <StatCard title="Total Forms" value={total} icon="bx-clipboard" color="primary" />
        </div>
        <div className="col-xl-3 col-md-6">
          <StatCard title="Delay Rate" value={stats.delayRate != null ? `${stats.delayRate}%` : "—"} icon="bx-error-circle" color="warning" />
        </div>
        <div className="col-xl-3 col-md-6">
          <StatCard title="Avg Procedure Time" value={stats.avgProcedureMinutes != null ? `${stats.avgProcedureMinutes} min` : "—"} icon="bx-time" color="info" />
        </div>
        <div className="col-xl-3 col-md-6">
          <StatCard title="Missed Estimate" value={stats.missedEstimateRate != null ? `${stats.missedEstimateRate}%` : "—"} icon="bx-timer" color="danger" />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Delay Distribution</h5>
            </div>
            <div className="card-body">
              <DoughnutChart data={delayData} centerLabel="Delays" />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Theatre Unit Activity</h5>
            </div>
            <div className="card-body">
              <BarChart data={unitData} barColor="bg-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Forms</h5>
          <Link to="/theatre-time-utilization/procedure-records" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Patient MRN</th>
                <th>Procedure Date</th>
                <th>Record UID</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">No forms submitted yet</td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.uid}>
                    <td className="fw-semibold text-primary">{record.patientMrn || "N/A"}</td>
                    <td>{record.procedureDate || "N/A"}</td>
                    <td><small className="text-muted">{record.uid}</small></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TheatreTimeDashboard;