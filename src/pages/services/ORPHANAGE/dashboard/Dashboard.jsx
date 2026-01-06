import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "animate.css";
import { dashboardStats, facilitiesData, childrenData, hospitalVisitsData } from "../../../../data/orphanageSampleData";
import PaginatedTable from "../../../../components/ui-templates/PaginatedTable";
import { formatDate } from "../../../../helpers/DateFormater";

export const OrphanageDashboard = () => {
  const user = useSelector((state) => state.userReducer?.data);
  const navigate = useNavigate();
  const [stats, setStats] = useState(dashboardStats);

  useEffect(() => {
    // Load dashboard stats
    setStats(dashboardStats);
  }, []);

  const StatCard = ({ title, value, icon, color = "primary" }) => (
    <div className="col-lg-3 col-md-6 col-6 mb-4">
      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex align-items-start justify-content-between">
            <div className="avatar flex-shrink-0">
              <div
                className={`avatar-initial rounded bg-label-${color}`}
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                {icon}
              </div>
            </div>
          </div>
          <span className="fw-medium d-block mb-1 text-muted">{title}</span>
          <h3 className="card-title mb-2">{value}</h3>
          <small className="text-success fw-medium">
            <i className="bx bx-up-arrow-alt"></i> Active
          </small>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Welcome Card */}
      <div className="row">
        <div className="col-lg-8 mb-4 order-0">
          <div className="card">
            <div className="d-flex align-items-end row">
              <div className="col-sm-7">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    Welcome, {user?.first_name || "Administrator"}!
                  </h5>
                  <p className="mb-4">
                    Welcome to the <span className="fw-medium">Orphanage Management System</span>.
                    This system helps you manage facilities, children, staff, and healthcare records.
                  </p>
                  <button
                    aria-label="view children"
                    onClick={() => navigate("/orphanage/children")}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View All Children
                  </button>
                </div>
              </div>
              <div className="col-sm-5 text-center text-sm-left">
                <div className="card-body pb-0 px-0 px-md-4">
                  <img
                    aria-label="dashboard icon image"
                    src="/assets/img/illustrations/man-with-laptop-light.png"
                    height="140"
                    alt="Dashboard Icon"
                    data-app-dark-img="illustrations/man-with-laptop-dark.png"
                    data-app-light-img="illustrations/man-with-laptop-light.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="col-lg-4 col-md-4 order-1">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <span className="fw-medium d-block mb-1 text-muted">Facilities</span>
                  <h3 className="card-title mb-2">{stats.total_facilities}</h3>
                  <small className="text-success fw-medium">
                    <i className="bx bx-home"></i> Active
                  </small>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <span className="fw-medium d-block mb-1 text-muted">Children</span>
                  <h3 className="card-title mb-2">{stats.active_children}</h3>
                  <small className="text-success fw-medium">
                    <i className="bx bx-user-plus"></i> Active
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row">
        <StatCard title="Total Facilities" value={stats.total_facilities} icon="🏠" color="primary" />
        <StatCard title="Total Children" value={stats.total_children} icon="👨‍👩‍👧‍👦" color="success" />
        <StatCard title="Staff Members" value={stats.total_staff} icon="👥" color="warning" />
        <StatCard title="Pending Visits" value={stats.pending_visits} icon="🏥" color="danger" />
      </div>

      {/* Recent Hospital Visits */}
      <div className="row mt-4">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title mb-0">Recent Hospital Visits</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate("/orphanage/hospital-visits")}
              >
                View All
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Child Name</th>
                      <th>Hospital</th>
                      <th>Visit Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_visits.map((visit) => (
                      <tr key={visit.id}>
                        <td>
                          <strong>{visit.child_name}</strong>
                        </td>
                        <td>{visit.hospital_name}</td>
                        <td>{formatDate(visit.visit_date, "DD/MM/YYYY")}</td>
                        <td>
                          <span
                            className={`badge bg-label-${
                              visit.status === "completed"
                                ? "success"
                                : visit.status === "pending"
                                ? "warning"
                                : "info"
                            }`}
                          >
                            {visit.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/orphanage/hospital-visits/open/${visit.id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="row mt-4">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Links</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-2 mb-3">
                  <button
                    className="btn btn-block btn-outline-primary w-100"
                    onClick={() => navigate("/orphanage/children")}
                  >
                    <i className="bx bx-user"></i> Children
                  </button>
                </div>
                <div className="col-md-2 mb-3">
                  <button
                    className="btn btn-block btn-outline-success w-100"
                    onClick={() => navigate("/orphanage/facilities")}
                  >
                    <i className="bx bx-building"></i> Facilities
                  </button>
                </div>
                <div className="col-md-2 mb-3">
                  <button
                    className="btn btn-block btn-outline-warning w-100"
                    onClick={() => navigate("/orphanage/staff")}
                  >
                    <i className="bx bx-user-pin"></i> Staff
                  </button>
                </div>
                <div className="col-md-2 mb-3">
                  <button
                    className="btn btn-block btn-outline-danger w-100"
                    onClick={() => navigate("/orphanage/hospital-visits")}
                  >
                    <i className="bx bx-plus-medical"></i> Visits
                  </button>
                </div>
                <div className="col-md-2 mb-3">
                  <button
                    className="btn btn-block btn-outline-info w-100"
                    onClick={() => navigate("/orphanage/prescriptions")}
                  >
                    <i className="bx bx-capsule"></i> Medicines
                  </button>
                </div>
                <div className="col-md-2 mb-3">
                  <button
                    className="btn btn-block btn-outline-secondary w-100"
                    onClick={() => navigate("/orphanage/reminders")}
                  >
                    <i className="bx bx-bell"></i> Reminders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
