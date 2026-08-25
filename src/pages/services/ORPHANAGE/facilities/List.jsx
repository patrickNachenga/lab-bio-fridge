import React, { useState, useContext, useMemo } from "react";
import { facilitiesData } from "../../../../data/orphanageSampleData";
import { FacilitiesContext } from "../../../../utils/context";
import BreadCumb from "../../../../layouts/BreadCumb";
import FacilitiesModal from "./Modal";
import FacilitiesViewModal from "./ViewModal";
import { formatDate } from "../../../../helpers/DateFormater";
import Swal from "sweetalert2";
import showToast from "../../../../helpers/ToastHelper";
import { useNavigate } from "react-router-dom";

export const FacilitiesPage = () => {
  const navigate = useNavigate();
  const [selectedObj, setSelectedObj] = useState(null);
  const [viewObj, setViewObj] = useState(null);
  const [tableRefresh, setTableRefresh] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter and search data
  const filteredData = useMemo(() => {
    return facilitiesData.filter((facility) => {
      const matchesSearch =
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.facility_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.address.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm]);

  const handleAddNew = () => {
    setSelectedObj({});
  };

  const handleEdit = (facility) => {
    setSelectedObj(facility);
  };

  const handleView = (facility) => {
    setViewObj(facility);
  };

  const handleOpenFacility = (facility) => {
    navigate(`/orphanage/facilities/${facility.id}`);
  };

  const handleDelete = (facility) => {
    Swal.fire({
      title: "Delete Facility",
      text: `Are you sure you want to delete ${facility.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dd6b55",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        showToast("success", "Facility deleted successfully");
        setTableRefresh((prev) => prev + 1);
      }
    });
  };

  return (
    <FacilitiesContext.Provider
      value={{ selectedObj, setSelectedObj, tableRefresh, setTableRefresh }}
    >
      <BreadCumb pageList={["Facilities"]} />

      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-gradient-primary py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="card-title text-white mb-0">
                    <i className="bx bx-building me-2"></i> Facilities Management
                  </h5>
                </div>
                <div className="col-md-6 text-md-end">
                  <button
                    className="btn btn-sm btn-light me-2"
                    onClick={handleAddNew}
                    data-bs-toggle="modal"
                    data-bs-target="#facilitiesModal"
                  >
                    <i className="bx bx-plus me-1"></i> Add Facility
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Search and Filter */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bx bx-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search by name, code, or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
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
                        <strong>Facility Code</strong>
                      </th>
                      <th>
                        <strong>Facility Name</strong>
                      </th>
                      <th>
                        <strong>Location</strong>
                      </th>
                      <th className="text-center">
                        <strong>Children</strong>
                      </th>
                      <th className="text-center">
                        <strong>Staff</strong>
                      </th>
                      <th style={{ width: "150px" }} className="text-center">
                        <strong>Actions</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                       filteredData.map((facility, index) => (
                         <tr
                           key={facility.id}
                           className="border-bottom"
                           style={{ cursor: "pointer" }}
                           onClick={() => handleOpenFacility(facility)}
                         >
                           <td className="text-center">
                             <span className="fw-bold">{index + 1}</span>
                           </td>
                           <td>
                             <span className="badge bg-label-primary">
                               {facility.facility_code}
                             </span>
                           </td>
                           <td>
                             <strong className="text-dark">
                               {facility.name}
                             </strong>
                           </td>
                          <td>
                            <small className="text-muted">
                              {facility.address}
                            </small>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-success">
                              {facility.children_count}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-info">
                              {facility.staff_count}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-info"
                                title="View"
                                onClick={() => handleView(facility)}
                                data-bs-toggle="modal"
                                data-bs-target="#facilitiesViewModal"
                              >
                                <i className="bx bx-show"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-warning"
                                title="Edit"
                                onClick={() => handleEdit(facility)}
                                data-bs-toggle="modal"
                                data-bs-target="#facilitiesModal"
                              >
                                <i className="bx bx-edit"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Delete"
                                onClick={() => handleDelete(facility)}
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
                            <p>No facilities found</p>
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
                    <h6 className="text-muted mb-1">Total Facilities</h6>
                    <h3 className="text-primary fw-bold">
                      {facilitiesData.length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Total Children</h6>
                    <h3 className="text-success fw-bold">
                      {facilitiesData.reduce(
                        (sum, f) => sum + f.children_count,
                        0
                      )}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Total Staff</h6>
                    <h3 className="text-info fw-bold">
                      {facilitiesData.reduce(
                        (sum, f) => sum + f.staff_count,
                        0
                      )}
                    </h3>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Avg Children/Facility</h6>
                    <h3 className="text-warning fw-bold">
                      {Math.round(
                        facilitiesData.reduce(
                          (sum, f) => sum + f.children_count,
                          0
                        ) / facilitiesData.length
                      )}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FacilitiesModal />
      <FacilitiesViewModal viewObj={viewObj} />
    </FacilitiesContext.Provider>
  );
};
