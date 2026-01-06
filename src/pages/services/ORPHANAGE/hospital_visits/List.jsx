import React, { useState, useContext, useMemo } from "react";
import { hospitalVisitsData } from "../../../../data/orphanageSampleData";
import { HospitalVisitsContext } from "../../../../utils/context";
import BreadCumb from "../../../../layouts/BreadCumb";
import HospitalVisitsModal from "./Modal";
import HospitalVisitsViewModal from "./ViewModal";
import { formatDate } from "../../../../helpers/DateFormater";
import Swal from "sweetalert2";
import showToast from "../../../../helpers/ToastHelper";

export const HospitalVisitsPage = () => {
  const [selectedObj, setSelectedObj] = useState(null);
  const [viewObj, setViewObj] = useState(null);
  const [tableRefresh, setTableRefresh] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredData = useMemo(() => {
    return hospitalVisitsData.filter((visit) => {
      const matchesSearch =
        visit.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || visit.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const handleAddNew = () => {
    setSelectedObj({});
  };

  const handleEdit = (visit) => {
    setSelectedObj(visit);
  };

  const handleView = (visit) => {
    setViewObj(visit);
  };

  const handleDelete = (visit) => {
    Swal.fire({
      title: "Delete Hospital Visit",
      text: `Are you sure you want to delete this visit record for ${visit.child_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dd6b55",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        showToast("success", "Hospital visit deleted successfully");
        setTableRefresh((prev) => prev + 1);
      }
    });
  };

  return (
    <HospitalVisitsContext.Provider
      value={{ selectedObj, setSelectedObj, tableRefresh, setTableRefresh }}
    >
      <BreadCumb pageList={["Hospital Visits"]} />

      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-gradient-warning py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="card-title text-white mb-0">
                    <i className="bx bx-clinic me-2"></i> Hospital Visits
                  </h5>
                </div>
                <div className="col-md-6 text-md-end">
                  <button
                    className="btn btn-sm btn-light me-2"
                    onClick={handleAddNew}
                    data-bs-toggle="modal"
                    data-bs-target="#hospitalVisitsModal"
                  >
                    <i className="bx bx-plus me-1"></i> Record Visit
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Search and Filter */}
              <div className="row mb-4">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bx bx-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search by child name, hospital, or diagnosis..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
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
                        <strong>Hospital</strong>
                      </th>
                      <th>
                        <strong>Diagnosis</strong>
                      </th>
                      <th>
                        <strong>Doctor</strong>
                      </th>
                      <th className="text-center">
                        <strong>Visit Date</strong>
                      </th>
                      <th className="text-center">
                        <strong>Status</strong>
                      </th>
                      <th style={{ width: "150px" }} className="text-center">
                        <strong>Actions</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((visit, index) => (
                        <tr key={visit.id} className="border-bottom">
                          <td className="text-center">
                            <span className="fw-bold">{index + 1}</span>
                          </td>
                          <td>
                            <strong className="text-dark">
                              {visit.child_name}
                            </strong>
                          </td>
                          <td>
                            <small className="text-muted">
                              {visit.hospital_name}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-label-primary">
                              {visit.diagnosis}
                            </span>
                          </td>
                          <td>
                            <small>{visit.doctor_name}</small>
                          </td>
                          <td className="text-center">
                            <small>
                              {formatDate(visit.visit_date, "DD/MM/YYYY")}
                            </small>
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge ${
                                visit.status === "completed"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {visit.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-info"
                                title="View"
                                onClick={() => handleView(visit)}
                                data-bs-toggle="modal"
                                data-bs-target="#hospitalVisitsViewModal"
                              >
                                <i className="bx bx-show"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-warning"
                                title="Edit"
                                onClick={() => handleEdit(visit)}
                                data-bs-toggle="modal"
                                data-bs-target="#hospitalVisitsModal"
                              >
                                <i className="bx bx-edit"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Delete"
                                onClick={() => handleDelete(visit)}
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
                            <p>No hospital visits found</p>
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
                    <h6 className="text-muted mb-1">Total Visits</h6>
                    <h3 className="text-primary fw-bold">
                      {hospitalVisitsData.length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Completed</h6>
                    <h3 className="text-success fw-bold">
                      {hospitalVisitsData.filter(
                        (v) => v.status === "completed"
                      ).length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Pending</h6>
                    <h3 className="text-warning fw-bold">
                      {hospitalVisitsData.filter(
                        (v) => v.status === "pending"
                      ).length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Follow-ups Due</h6>
                    <h3 className="text-danger fw-bold">
                      {hospitalVisitsData.filter(
                        (v) =>
                          new Date(v.next_visit_date) <= new Date() &&
                          v.status === "completed"
                      ).length}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HospitalVisitsModal />
      <HospitalVisitsViewModal viewObj={viewObj} />
    </HospitalVisitsContext.Provider>
  );
};
