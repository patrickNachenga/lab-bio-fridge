import React, { useState, useContext, useMemo } from "react";
import { staffData } from "../../../../data/orphanageSampleData";
import { StaffContext } from "../../../../utils/context";
import BreadCumb from "../../../../layouts/BreadCumb";
import StaffModal from "./Modal";
import StaffViewModal from "./ViewModal";
import Swal from "sweetalert2";
import showToast from "../../../../helpers/ToastHelper";

export const StaffPage = () => {
  const [selectedObj, setSelectedObj] = useState(null);
  const [viewObj, setViewObj] = useState(null);
  const [tableRefresh, setTableRefresh] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filteredData = useMemo(() => {
    return staffData.filter((staff) => {
      const matchesSearch =
        staff.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === "all" || staff.role === filterRole;

      const matchesType =
        filterType === "all" ||
        (filterType === "internal" && !staff.is_external) ||
        (filterType === "external" && staff.is_external);

      return matchesSearch && matchesRole && matchesType;
    });
  }, [searchTerm, filterRole, filterType]);

  const handleAddNew = () => {
    setSelectedObj({});
  };

  const handleEdit = (staff) => {
    setSelectedObj(staff);
  };

  const handleView = (staff) => {
    setViewObj(staff);
  };

  const handleDelete = (staff) => {
    Swal.fire({
      title: "Delete Staff Member",
      text: `Are you sure you want to delete ${staff.full_name} from the system?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dd6b55",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        showToast("success", "Staff member deleted successfully");
        setTableRefresh((prev) => prev + 1);
      }
    });
  };

  return (
    <StaffContext.Provider
      value={{ selectedObj, setSelectedObj, tableRefresh, setTableRefresh }}
    >
      <BreadCumb pageList={["Staff Management"]} />

      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-gradient-info py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="card-title text-white mb-0">
                    <i className="bx bx-user-check me-2"></i> Staff Management
                  </h5>
                </div>
                <div className="col-md-6 text-md-end">
                  <button
                    className="btn btn-sm btn-light me-2"
                    onClick={handleAddNew}
                    data-bs-toggle="modal"
                    data-bs-target="#staffModal"
                  >
                    <i className="bx bx-plus me-1"></i> Add Staff
                  </button>
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
                      placeholder="Search by name, email, or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="Caretaker">Caretaker</option>
                    <option value="Medical Officer">Medical Officer</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Cook">Cook</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="internal">Internal Staff</option>
                    <option value="external">External/Contract</option>
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
                        <strong>Name</strong>
                      </th>
                      <th>
                        <strong>Email</strong>
                      </th>
                      <th className="text-center">
                        <strong>Role</strong>
                      </th>
                      <th>
                        <strong>Department</strong>
                      </th>
                      <th>
                        <strong>Facility</strong>
                      </th>
                      <th className="text-center">
                        <strong>Type</strong>
                      </th>
                      <th style={{ width: "150px" }} className="text-center">
                        <strong>Actions</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((staff, index) => (
                        <tr key={staff.id} className="border-bottom">
                          <td className="text-center">
                            <span className="fw-bold">{index + 1}</span>
                          </td>
                          <td>
                            <strong className="text-dark">
                              {staff.full_name}
                            </strong>
                          </td>
                          <td>
                            <small className="text-muted">{staff.email}</small>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-label-primary">
                              {staff.role}
                            </span>
                          </td>
                          <td>
                            <small>{staff.department}</small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {staff.facility_name}
                            </small>
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge ${
                                staff.is_external
                                  ? "bg-warning"
                                  : "bg-success"
                              }`}
                            >
                              {staff.is_external ? "External" : "Internal"}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-info"
                                title="View"
                                onClick={() => handleView(staff)}
                                data-bs-toggle="modal"
                                data-bs-target="#staffViewModal"
                              >
                                <i className="bx bx-show"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-warning"
                                title="Edit"
                                onClick={() => handleEdit(staff)}
                                data-bs-toggle="modal"
                                data-bs-target="#staffModal"
                              >
                                <i className="bx bx-edit"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Delete"
                                onClick={() => handleDelete(staff)}
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
                            <p>No staff members found</p>
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
                    <h6 className="text-muted mb-1">Total Staff</h6>
                    <h3 className="text-primary fw-bold">
                      {staffData.length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Internal</h6>
                    <h3 className="text-success fw-bold">
                      {staffData.filter((s) => !s.is_external).length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">External/Contract</h6>
                    <h3 className="text-warning fw-bold">
                      {staffData.filter((s) => s.is_external).length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Doctors</h6>
                    <h3 className="text-danger fw-bold">
                      {staffData.filter((s) => s.role === "Medical Officer")
                        .length}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StaffModal />
      <StaffViewModal viewObj={viewObj} />
    </StaffContext.Provider>
  );
};
