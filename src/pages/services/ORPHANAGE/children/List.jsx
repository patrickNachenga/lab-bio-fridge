import React, { useState, useContext, useMemo } from "react";
import { childrenData } from "../../../../data/orphanageSampleData";
import { ChildrenContext } from "../../../../utils/context";
import BreadCumb from "../../../../layouts/BreadCumb";
import ChildrenModal from "./Modal";
import ChildrenViewModal from "./ViewModal";
import Swal from "sweetalert2";
import showToast from "../../../../helpers/ToastHelper";
import { useNavigate } from "react-router-dom";

export const ChildrenPage = () => {
  const navigate = useNavigate();
  const [selectedObj, setSelectedObj] = useState(null);
  const [viewObj, setViewObj] = useState(null);
  const [tableRefresh, setTableRefresh] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    return childrenData.filter((child) => {
      const matchesSearch =
        child.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.child_unique_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        child.facility_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGender =
        filterGender === "all" || child.gender === filterGender;

      return matchesSearch && matchesGender;
    });
  }, [searchTerm, filterGender]);

  const handleAddNew = () => {
    setSelectedObj({});
  };

  const handleEdit = (child) => {
    setSelectedObj(child);
  };

  const handleView = (child) => {
    setViewObj(child);
  };

  const handleDelete = (child) => {
    Swal.fire({
      title: "Delete Child Record",
      text: `Are you sure you want to delete ${child.full_name}'s record?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dd6b55",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        showToast("success", "Child record deleted successfully");
        setTableRefresh((prev) => prev + 1);
      }
    });
  };

  return (
    <ChildrenContext.Provider
      value={{ selectedObj, setSelectedObj, tableRefresh, setTableRefresh }}
    >
      <BreadCumb pageList={["Children Registry"]} />

      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-gradient-success py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="card-title text-white mb-0">
                    <i className="bx bx-group me-2"></i> Children Registry
                  </h5>
                </div>
                <div className="col-md-6 text-md-end">
                  <button
                    className="btn btn-sm btn-light me-2"
                    onClick={handleAddNew}
                    data-bs-toggle="modal"
                    data-bs-target="#childrenModal"
                  >
                    <i className="bx bx-plus me-1"></i> Add Child
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
                      placeholder="Search by name, ID, or facility..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                  >
                    <option value="all">All Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
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
                        <strong>Child ID</strong>
                      </th>
                      <th>
                        <strong>Name</strong>
                      </th>
                      <th className="text-center">
                        <strong>Age</strong>
                      </th>
                      <th className="text-center">
                        <strong>Gender</strong>
                      </th>
                      <th>
                        <strong>Facility</strong>
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
                      filteredData.map((child, index) => (
                        <tr key={child.id} className="border-bottom">
                          <td className="text-center">
                            <span className="fw-bold">{index + 1}</span>
                          </td>
                          <td>
                            <span className="badge bg-label-info">
                              {child.child_unique_number}
                            </span>
                          </td>
                          <td>
                            <strong className="text-dark">
                              {child.full_name}
                            </strong>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-secondary">
                              {calculateAge(child.date_of_birth)} yrs
                            </span>
                          </td>
                          <td className="text-center">
                            <span
                              className={`badge ${
                                child.gender === "Male"
                                  ? "bg-label-primary"
                                  : "bg-label-danger"
                              }`}
                            >
                              {child.gender}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {child.facility_name}
                            </small>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-success">
                              {child.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-info"
                                title="Medical Records"
                                onClick={() => navigate(`/orphanage/children/${child.id}`)}
                              >
                                <i className="bx bx-clinic"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                title="View"
                                onClick={() => handleView(child)}
                                data-bs-toggle="modal"
                                data-bs-target="#childrenViewModal"
                              >
                                <i className="bx bx-show"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-warning"
                                title="Edit"
                                onClick={() => handleEdit(child)}
                                data-bs-toggle="modal"
                                data-bs-target="#childrenModal"
                              >
                                <i className="bx bx-edit"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Delete"
                                onClick={() => handleDelete(child)}
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
                            <p>No children found</p>
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
                    <h6 className="text-muted mb-1">Total Children</h6>
                    <h3 className="text-success fw-bold">
                      {childrenData.length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Active</h6>
                    <h3 className="text-info fw-bold">
                      {childrenData.filter((c) => c.status === "active").length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Males</h6>
                    <h3 className="text-primary fw-bold">
                      {childrenData.filter((c) => c.gender === "Male").length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Females</h6>
                    <h3 className="text-danger fw-bold">
                      {childrenData.filter((c) => c.gender === "Female").length}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChildrenModal />
      <ChildrenViewModal viewObj={viewObj} calculateAge={calculateAge} />
    </ChildrenContext.Provider>
  );
};
