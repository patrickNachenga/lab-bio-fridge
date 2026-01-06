import React, { useState, useContext, useMemo } from "react";
import { prescriptionsData, medicinesData } from "../../../../data/orphanageSampleData";
import { PrescriptionsContext } from "../../../../utils/context";
import BreadCumb from "../../../../layouts/BreadCumb";
import PrescriptionsViewModal from "./ViewModal";
import { formatDate } from "../../../../helpers/DateFormater";
import Swal from "sweetalert2";
import showToast from "../../../../helpers/ToastHelper";

export const PrescriptionsPage = () => {
  const [viewObj, setViewObj] = useState(null);
  const [tableRefresh, setTableRefresh] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredData = useMemo(() => {
    return prescriptionsData.filter((pres) => {
      const matchesSearch =
        pres.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pres.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || pres.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus]);

  const handleView = (prescription) => {
    setViewObj(prescription);
  };

  const handleDelete = (prescription) => {
    Swal.fire({
      title: "Delete Prescription",
      text: `Are you sure you want to delete the prescription for ${prescription.child_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dd6b55",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        showToast("success", "Prescription deleted successfully");
        setTableRefresh((prev) => prev + 1);
      }
    });
  };

  return (
    <PrescriptionsContext.Provider
      value={{ tableRefresh, setTableRefresh }}
    >
      <BreadCumb pageList={["Prescriptions"]} />

      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-gradient-success py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="card-title text-white mb-0">
                    <i className="bx bx-pill me-2"></i> Prescriptions Management
                  </h5>
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
                      placeholder="Search by child name or doctor..."
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
                    <option value="active">Active</option>
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
                        <strong>Doctor</strong>
                      </th>
                      <th className="text-center">
                        <strong>Medicines</strong>
                      </th>
                      <th>
                        <strong>Confirmed Date</strong>
                      </th>
                      <th className="text-center">
                        <strong>Status</strong>
                      </th>
                      <th style={{ width: "120px" }} className="text-center">
                        <strong>Actions</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((pres, index) => (
                        <tr key={pres.id} className="border-bottom">
                          <td className="text-center">
                            <span className="fw-bold">{index + 1}</span>
                          </td>
                          <td>
                            <strong className="text-dark">
                              {pres.child_name}
                            </strong>
                          </td>
                          <td>
                            <small className="text-muted">
                              {pres.doctor_name}
                            </small>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-label-primary">
                              {pres.medicines.length} medicine(s)
                            </span>
                          </td>
                          <td>
                            <small>
                              {formatDate(
                                pres.confirmed_at,
                                "DD/MM/YYYY HH:mm"
                              )}
                            </small>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-success">
                              {pres.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-info"
                                title="View"
                                onClick={() => handleView(pres)}
                                data-bs-toggle="modal"
                                data-bs-target="#prescriptionsViewModal"
                              >
                                <i className="bx bx-show"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Delete"
                                onClick={() => handleDelete(pres)}
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="text-muted">
                            <i className="bx bx-inbox"></i>
                            <p>No prescriptions found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Stats */}
              <div className="row mt-4 pt-3 border-top">
                <div className="col-md-4">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Total Prescriptions</h6>
                    <h3 className="text-primary fw-bold">
                      {prescriptionsData.length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Active</h6>
                    <h3 className="text-success fw-bold">
                      {prescriptionsData.filter(
                        (p) => p.status === "active"
                      ).length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Total Medicines Used</h6>
                    <h3 className="text-info fw-bold">
                      {new Set(
                        prescriptionsData.flatMap((p) =>
                          p.medicines.map((m) => m.id)
                        )
                      ).size}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PrescriptionsViewModal viewObj={viewObj} />
    </PrescriptionsContext.Provider>
  );
};
