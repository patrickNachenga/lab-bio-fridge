import React, { useState, useContext, useMemo } from "react";
import { hospitalsData } from "../../../../data/orphanageSampleData";
import { HospitalsContext } from "../../../../utils/context";
import BreadCumb from "../../../../layouts/BreadCumb";
import HospitalsModal from "./Modal";
import HospitalsViewModal from "./ViewModal";
import Swal from "sweetalert2";
import showToast from "../../../../helpers/ToastHelper";

export const HospitalsPage = () => {
  const [selectedObj, setSelectedObj] = useState(null);
  const [viewObj, setViewObj] = useState(null);
  const [tableRefresh, setTableRefresh] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return hospitalsData.filter((hospital) => {
      return (
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);

  const handleAddNew = () => {
    setSelectedObj({});
  };

  const handleEdit = (hospital) => {
    setSelectedObj(hospital);
  };

  const handleView = (hospital) => {
    setViewObj(hospital);
  };

  const handleDelete = (hospital) => {
    Swal.fire({
      title: "Delete Hospital",
      text: `Are you sure you want to delete ${hospital.name} from partners?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dd6b55",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        showToast("success", "Hospital deleted successfully");
        setTableRefresh((prev) => prev + 1);
      }
    });
  };

  return (
    <HospitalsContext.Provider
      value={{ selectedObj, setSelectedObj, tableRefresh, setTableRefresh }}
    >
      <BreadCumb pageList={["Partner Hospitals"]} />

      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-gradient-danger py-3">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="card-title text-white mb-0">
                    <i className="bx bx-hospital me-2"></i> Partner Hospitals
                  </h5>
                </div>
                <div className="col-md-6 text-md-end">
                  <button
                    className="btn btn-sm btn-light me-2"
                    onClick={handleAddNew}
                    data-bs-toggle="modal"
                    data-bs-target="#hospitalsModal"
                  >
                    <i className="bx bx-plus me-1"></i> Add Hospital
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Search */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bx bx-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search by name, city, or region..."
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
                        <strong>Hospital Name</strong>
                      </th>
                      <th>
                        <strong>Location</strong>
                      </th>
                      <th>
                        <strong>Region</strong>
                      </th>
                      <th>
                        <strong>Phone</strong>
                      </th>
                      <th style={{ width: "150px" }} className="text-center">
                        <strong>Actions</strong>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((hospital, index) => (
                        <tr key={hospital.id} className="border-bottom">
                          <td className="text-center">
                            <span className="fw-bold">{index + 1}</span>
                          </td>
                          <td>
                            <strong className="text-dark">
                              {hospital.name}
                            </strong>
                          </td>
                          <td>
                            <small className="text-muted">
                              {hospital.address}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-label-info">
                              {hospital.region}
                            </span>
                          </td>
                          <td>
                            <small>
                              <a href={`tel:${hospital.phone}`}>
                                {hospital.phone}
                              </a>
                            </small>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-info"
                                title="View"
                                onClick={() => handleView(hospital)}
                                data-bs-toggle="modal"
                                data-bs-target="#hospitalsViewModal"
                              >
                                <i className="bx bx-show"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-warning"
                                title="Edit"
                                onClick={() => handleEdit(hospital)}
                                data-bs-toggle="modal"
                                data-bs-target="#hospitalsModal"
                              >
                                <i className="bx bx-edit"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Delete"
                                onClick={() => handleDelete(hospital)}
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="text-muted">
                            <i className="bx bx-inbox"></i>
                            <p>No hospitals found</p>
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
                    <h6 className="text-muted mb-1">Total Partner Hospitals</h6>
                    <h3 className="text-danger fw-bold">
                      {hospitalsData.length}
                    </h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Unique Regions Covered</h6>
                    <h3 className="text-info fw-bold">
                      {new Set(hospitalsData.map((h) => h.region)).size}
                    </h3>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <h6 className="text-muted mb-1">Unique Cities</h6>
                    <h3 className="text-primary fw-bold">
                      {new Set(hospitalsData.map((h) => h.city)).size}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HospitalsModal />
      <HospitalsViewModal viewObj={viewObj} />
    </HospitalsContext.Provider>
  );
};
