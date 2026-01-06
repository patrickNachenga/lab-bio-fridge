import React, { useState, useMemo } from "react";
import { remindersData } from "../../../../data/orphanageSampleData";
import BreadCumb from "../../../../layouts/BreadCumb";
import RemindersViewModal from "./ViewModal";
import { formatDate } from "../../../../helpers/DateFormater";
import Swal from "sweetalert2";
import showToast from "../../../../helpers/ToastHelper";

export const RemindersPage = () => {
  const [viewObj, setViewObj] = useState(null);
  const [tableRefresh, setTableRefresh] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredData = useMemo(() => {
    return remindersData.filter((reminder) => {
      const matchesSearch =
        reminder.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reminder.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "pending" && !reminder.is_completed) ||
        (filterStatus === "completed" && reminder.is_completed);

      const matchesPriority =
        filterPriority === "all" || reminder.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, filterStatus, filterPriority]);

  const handleView = (reminder) => {
    setViewObj(reminder);
  };

  const handleComplete = (reminder) => {
    Swal.fire({
      title: "Mark as Completed",
      text: `Mark reminder for ${reminder.child_name} as completed?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Mark Complete",
    }).then((result) => {
      if (result.isConfirmed) {
        showToast("success", "Reminder marked as completed");
        setTableRefresh((prev) => prev + 1);
      }
    });
  };

  const handleDelete = (reminder) => {
    Swal.fire({
      title: "Delete Reminder",
      text: `Are you sure you want to delete this reminder for ${reminder.child_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dd6b55",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        showToast("success", "Reminder deleted successfully");
        setTableRefresh((prev) => prev + 1);
      }
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "normal":
        return "warning";
      case "low":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <BreadCumb pageList={["Reminders"]} />

      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-gradient-info py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="card-title text-white mb-0">
                    <i className="bx bx-bell me-2"></i> Health Reminders
                  </h5>
                </div>
                <div className="col-md-6 text-md-end">
                  <small className="text-white-50">
                    <i className="bx bx-info-circle me-1"></i> Auto-generated from
                    visits & prescriptions
                  </small>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Search and Filters */}
              <div className="row mb-4">
                <div className="col-md-5">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bx bx-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search by child name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="all">All Status</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "60px" }} className="text-center">
                        <strong>SN</strong>
                      </th>
                      <th>
                        <strong>Child Name</strong>
                      </th>
                      <th>
                        <strong>Description</strong>
                      </th>
                      <th className="text-center">
                        <strong>Type</strong>
                      </th>
                      <th>
                        <strong>Remind At</strong>
                      </th>
                      <th className="text-center">
                        <strong>Priority</strong>
                      </th>
                      <th className="text-center">
                        <strong>Status</strong>
                      </th>
                      <th style={{ width: "170px" }} className="text-center">
                        <strong>Actions</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((reminder, index) => (
                        <tr
                          key={reminder.id}
                          className={`border-bottom ${
                            reminder.is_completed ? "opacity-50" : ""
                          }`}
                        >
                          <td className="text-center">
                            <span className="fw-bold">{index + 1}</span>
                          </td>
                          <td>
                            <strong className="text-dark">
                              {reminder.child_name}
                            </strong>
                          </td>
                          <td>
                            <small className="text-muted">
                              {reminder.description}
                            </small>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-label-primary">
                              {reminder.reminder_type
                                .replace(/_/g, " ")
                                .toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <small>
                              {formatDate(
                                reminder.remind_at,
                                "DD/MM/YYYY HH:mm"
                              )}
                            </small>
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge bg-${getPriorityColor(
                                reminder.priority
                              )}`}
                            >
                              {reminder.priority.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge ${
                                reminder.is_completed
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {reminder.is_completed
                                ? "COMPLETED"
                                : "PENDING"}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-info"
                                title="View"
                                onClick={() => handleView(reminder)}
                                data-bs-toggle="modal"
                                data-bs-target="#remindersViewModal"
                              >
                                <i className="bx bx-show"></i>
                              </button>
                              {!reminder.is_completed && (
                                <button
                                  type="button"
                                  className="btn btn-outline-success"
                                  title="Mark Complete"
                                  onClick={() => handleComplete(reminder)}
                                >
                                  <i className="bx bx-check"></i>
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Delete"
                                onClick={() => handleDelete(reminder)}
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <div className="text-muted">
                            <i className="bx bx-inbox"></i>
                            <p>No reminders found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Stats */}
              <div className="row mt-4 pt-3 border-top">
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Total Reminders</h6>
                    <h3 className="text-primary fw-bold">
                      {remindersData.length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Pending</h6>
                    <h3 className="text-warning fw-bold">
                      {remindersData.filter((r) => !r.is_completed).length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">High Priority</h6>
                    <h3 className="text-danger fw-bold">
                      {remindersData.filter((r) => r.priority === "high")
                        .length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Completed</h6>
                    <h3 className="text-success fw-bold">
                      {remindersData.filter((r) => r.is_completed).length}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RemindersViewModal viewObj={viewObj} />
    </>
  );
};
