import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    facilitiesData,
    childrenData,
    staffData,
} from "../../../../data/orphanageSampleData";
import BreadCumb from "../../../../layouts/BreadCumb";
import showToast from "../../../../helpers/ToastHelper";
import Swal from "sweetalert2";
import { formatDate } from "../../../../helpers/DateFormater";
import "./Details.css"; // Custom CSS for animations and enhanced styling

export const FacilityDetailsPage = () => {
    const { uid } = useParams();
    const navigate = useNavigate();
    const [facility, setFacility] = useState(null);
    const [staffMembers, setStaffMembers] = useState([]);
    const [childrenList, setChildrenList] = useState([]);
    const [editingFacility, setEditingFacility] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [searchChild, setSearchChild] = useState("");
    const [searchStaff, setSearchStaff] = useState("");
    const [showAddStaffModal, setShowAddStaffModal] = useState(false);
    const [showAddChildModal, setShowAddChildModal] = useState(false);

    // Form states
    const [facilityForm, setFacilityForm] = useState({
        name: "",
        facility_code: "",
        address: "",
        phone: "",
        email: "",
    });

    const [staffForm, setStaffForm] = useState({
        full_name: "",
        role: "",
        phone: "",
        email: "",
        department: "",
    });

    const [childForm, setChildForm] = useState({
        full_name: "",
        date_of_birth: "",
        gender: "",
        contact_person: "",
        contact_phone: "",
        health_status: "Good",
    });

    // Load facility data
    useEffect(() => {
        if (uid) {
            const found = facilitiesData.find((f) => f.id === uid || f.uid === uid);
            if (found) {
                setFacility(found);
                setFacilityForm({
                    name: found.name,
                    facility_code: found.facility_code,
                    address: found.address,
                    phone: found.phone,
                    email: found.email || "",
                });

                // Load staff for this facility
                const facilityStaff = staffData.filter(
                    (s) => s.facility_id === found.id || s.facility_id === found.uid
                );
                setStaffMembers(facilityStaff);

                // Load children for this facility
                const facilityChildren = childrenData.filter(
                    (c) => c.facility_id === found.id || c.facility_id === found.uid
                );
                setChildrenList(facilityChildren);
            } else {
                showToast("error", "Facility not found");
                navigate("/orphanage/facilities");
            }
        }
    }, [uid, navigate]);

    const handleFacilityChange = (e) => {
        const { name, value } = e.target;
        setFacilityForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStaffChange = (e) => {
        const { name, value } = e.target;
        setStaffForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChildChange = (e) => {
        const { name, value } = e.target;
        setChildForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateFacility = async (e) => {
        e.preventDefault();
        if (
            !facilityForm.name ||
            !facilityForm.facility_code ||
            !facilityForm.address
        ) {
            showToast("error", "Please fill in all required fields");
            return;
        }
        try {
            // Here you would typically make an API call
            showToast("success", "Facility updated successfully");
            setEditingFacility(false);
            setFacility({ ...facility, ...facilityForm });
        } catch (error) {
            showToast("error", "Failed to update facility");
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        if (!staffForm.full_name || !staffForm.role || !staffForm.phone) {
            showToast("error", "Please fill in all required fields");
            return;
        }
        try {
            const newStaff = {
                id: `staff-${Date.now()}`,
                uid: `staff-${Date.now()}`,
                ...staffForm,
                facility_id: facility.id,
                facility_name: facility.name,
                status: "active",
                is_external: false,
                hire_date: new Date().toISOString().split("T")[0],
                created_at: new Date().toISOString(),
            };
            setStaffMembers([...staffMembers, newStaff]);
            setStaffForm({
                full_name: "",
                role: "",
                phone: "",
                email: "",
                department: "",
            });
            setShowAddStaffModal(false);
            showToast("success", "Staff member added successfully");
        } catch (error) {
            showToast("error", "Failed to add staff member");
        }
    };

    const handleAddChild = async (e) => {
        e.preventDefault();
        if (!childForm.full_name || !childForm.date_of_birth || !childForm.gender) {
            showToast("error", "Please fill in all required fields");
            return;
        }
        try {
            const newChild = {
                id: `child-${Date.now()}`,
                uid: `child-${Date.now()}`,
                child_unique_number: `CHD-${facility.facility_code.split("-")[1]}-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                ...childForm,
                facility_id: facility.id,
                facility_name: facility.name,
                status: "active",
                admission_date: new Date().toISOString().split("T")[0],
                created_at: new Date().toISOString(),
            };
            setChildrenList([...childrenList, newChild]);
            setChildForm({
                full_name: "",
                date_of_birth: "",
                gender: "",
                contact_person: "",
                contact_phone: "",
                health_status: "Good",
            });
            setShowAddChildModal(false);
            showToast("success", "Child added to facility successfully");
        } catch (error) {
            showToast("error", "Failed to add child");
        }
    };

    const handleRemoveStaff = (staffId) => {
        Swal.fire({
            title: "Remove Staff Member",
            text: "Are you sure you want to remove this staff member from the facility?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dd6b55",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Yes, Remove",
        }).then((result) => {
            if (result.isConfirmed) {
                setStaffMembers(staffMembers.filter((s) => s.id !== staffId));
                showToast("success", "Staff member removed successfully");
            }
        });
    };

    const handleRemoveChild = (childId) => {
        Swal.fire({
            title: "Remove Child",
            text: "Are you sure you want to remove this child from the facility?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dd6b55",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Yes, Remove",
        }).then((result) => {
            if (result.isConfirmed) {
                setChildrenList(childrenList.filter((c) => c.id !== childId));
                showToast("success", "Child removed successfully");
            }
        });
    };

    const filteredStaff = staffMembers.filter(
        (s) =>
            s.full_name.toLowerCase().includes(searchStaff.toLowerCase()) ||
            s.role.toLowerCase().includes(searchStaff.toLowerCase())
    );

    const filteredChildren = childrenList.filter(
        (c) =>
            c.full_name.toLowerCase().includes(searchChild.toLowerCase()) ||
            c.child_unique_number.toLowerCase().includes(searchChild.toLowerCase())
    );

    if (!facility) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <BreadCumb
                pageList={["Facilities", facility.name]}
            />

            {/* Enhanced Header Card with Facility Info */}
            <div className="row mb-5">
                <div className="col-lg-12">
                    <div className="card border-0 shadow-lg facility-header-card" 
                         style={{
                             background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                             borderRadius: "15px",
                             overflow: "hidden",
                             transition: "all 0.3s ease"
                         }}>
                        <div className="card-body p-4">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <h2 className="mb-3 text-white fw-bold">
                                        <i className="bx bx-building me-3" style={{ fontSize: "1.8rem" }}></i>
                                        {facility.name}
                                    </h2>
                                    <div className="d-flex flex-wrap gap-3 mb-2">
                                        <span className="badge bg-light text-dark px-3 py-2" 
                                              style={{ fontSize: "0.9rem", borderRadius: "8px" }}>
                                            <i className="bx bx-barcode me-2"></i>
                                            {facility.facility_code}
                                        </span>
                                        <span className="text-white-50" style={{ fontSize: "0.95rem" }}>
                                            <i className="bx bx-map me-2"></i>
                                            {facility.address}
                                        </span>
                                    </div>
                                    <p className="mb-0 text-white-50">
                                        <i className="bx bx-phone me-2"></i>
                                        {facility.phone}
                                    </p>
                                </div>
                                <div className="col-md-4">
                                    <div className="row g-3 text-center">
                                        <div className="col-6">
                                            <div className="stat-card p-3" 
                                                 style={{
                                                     background: "rgba(255, 255, 255, 0.15)",
                                                     borderRadius: "12px",
                                                     backdropFilter: "blur(10px)",
                                                     border: "1px solid rgba(255, 255, 255, 0.2)"
                                                 }}>
                                                <h4 className="text-white mb-1 fw-bold">{childrenList.length}</h4>
                                                <small className="text-white-50">Children</small>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="stat-card p-3"
                                                 style={{
                                                     background: "rgba(255, 255, 255, 0.15)",
                                                     borderRadius: "12px",
                                                     backdropFilter: "blur(10px)",
                                                     border: "1px solid rgba(255, 255, 255, 0.2)"
                                                 }}>
                                                <h4 className="text-white mb-1 fw-bold">{staffMembers.length}</h4>
                                                <small className="text-white-50">Staff</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs with Enhanced Styling */}
            <div className="row mb-5">
                <div className="col-lg-12">
                    <div className="card border-0 shadow-md" style={{ borderRadius: "12px" }}>
                        <div className="card-body p-0">
                            <ul className="nav nav-tabs nav-pills custom-tabs p-3" 
                                role="tablist" 
                                style={{ borderBottom: "2px solid #f5f5f5", gap: "1rem" }}>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link px-4 py-2 rounded-pill transition-all ${activeTab === "overview" ? "active bg-primary text-white" : "text-dark"}`}
                                        onClick={() => setActiveTab("overview")}
                                        style={{ cursor: "pointer", fontWeight: "500" }}
                                    >
                                        <i className="bx bx-layout me-2"></i>Overview
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link px-4 py-2 rounded-pill transition-all ${activeTab === "children" ? "active bg-success text-white" : "text-dark"}`}
                                        onClick={() => setActiveTab("children")}
                                        style={{ cursor: "pointer", fontWeight: "500" }}
                                    >
                                        <i className="bx bx-user me-2"></i>Children ({childrenList.length})
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link px-4 py-2 rounded-pill transition-all ${activeTab === "staff" ? "active bg-info text-white" : "text-dark"}`}
                                        onClick={() => setActiveTab("staff")}
                                        style={{ cursor: "pointer", fontWeight: "500" }}
                                    >
                                        <i className="bx bx-user-check me-2"></i>Staff ({staffMembers.length})
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={`nav-link px-4 py-2 rounded-pill transition-all ${activeTab === "settings" ? "active bg-warning text-white" : "text-dark"}`}
                                        onClick={() => setActiveTab("settings")}
                                        style={{ cursor: "pointer", fontWeight: "500" }}
                                    >
                                        <i className="bx bx-cog me-2"></i>Settings
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
                <div className="row g-4">
                    <div className="col-lg-8">
                        {/* Facility Information Card */}
                        <div className="card border-0 shadow-md mb-4 hover-lift" style={{ borderRadius: "12px" }}>
                            <div className="card-header bg-light py-4 border-0" style={{ borderRadius: "12px 12px 0 0", backgroundColor: "#f8f9fa !important" }}>
                                <h5 className="card-title mb-0 fw-bold text-dark">
                                    <i className="bx bx-info-circle me-2" style={{ color: "#667eea" }}></i>Facility Information
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <p className="text-muted mb-2" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Facility Name</p>
                                        <h6 className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>{facility.name}</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted mb-2" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Facility Code</p>
                                        <h6 className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>{facility.facility_code}</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted mb-2" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Phone</p>
                                        <h6 className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>{facility.phone}</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted mb-2" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Email</p>
                                        <h6 className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>
                                            {facility.email || "Not specified"}
                                        </h6>
                                    </div>
                                    <div className="col-12">
                                        <p className="text-muted mb-2" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Address</p>
                                        <h6 className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>{facility.address}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="row mb-4 g-3">
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm hover-lift" style={{ borderRadius: "12px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                                    <div className="card-body text-center py-4">
                                        <i className="bx bx-user text-white" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}></i>
                                        <h6 className="text-white mb-2" style={{ opacity: "0.9", fontWeight: "500" }}>Total Children</h6>
                                        <h3 className="text-white fw-bold">{childrenList.length}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm hover-lift" style={{ borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}>
                                    <div className="card-body text-center py-4">
                                        <i className="bx bx-user-check text-white" style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}></i>
                                        <h6 className="text-white mb-2" style={{ opacity: "0.9", fontWeight: "500" }}>Staff Members</h6>
                                        <h3 className="text-white fw-bold">{staffMembers.length}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Facility Timeline */}
                        <div className="card border-0 shadow-md" style={{ borderRadius: "12px" }}>
                            <div className="card-header bg-light py-4 border-0" style={{ borderRadius: "12px 12px 0 0", backgroundColor: "#f8f9fa !important" }}>
                                <h5 className="card-title mb-0 fw-bold text-dark">
                                    <i className="bx bx-history me-2" style={{ color: "#667eea" }}></i>Facility Timeline
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="timeline">
                                    <div className="timeline-item mb-4">
                                        <div className="timeline-marker" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", width: "16px", height: "16px", borderRadius: "50%", marginRight: "1.5rem" }}></div>
                                        <div className="timeline-content">
                                            <h6 className="fw-bold text-dark">Facility Created</h6>
                                            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                                                {formatDate(facility.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <div className="timeline-marker" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", width: "16px", height: "16px", borderRadius: "50%", marginRight: "1.5rem" }}></div>
                                        <div className="timeline-content">
                                            <h6 className="fw-bold text-dark">Last Updated</h6>
                                            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                                                {formatDate(facility.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Quick Actions */}
                    <div className="col-lg-4">
                        {/* Quick Actions */}
                        <div className="card border-0 shadow-md mb-4 hover-lift" style={{ borderRadius: "12px" }}>
                            <div className="card-header bg-light py-4 border-0" style={{ borderRadius: "12px 12px 0 0", backgroundColor: "#f8f9fa !important" }}>
                                <h5 className="card-title mb-0 fw-bold text-dark">
                                    <i className="bx bx-lightning-charge me-2" style={{ color: "#f59e0b" }}></i>Quick Actions
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="d-grid gap-3">
                                    <button
                                        className="btn btn-lg py-3 fw-bold transition-all"
                                        style={{
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            color: "white",
                                            borderRadius: "10px",
                                            border: "none"
                                        }}
                                        onClick={() => setActiveTab("settings")}
                                    >
                                        <i className="bx bx-edit me-2"></i>Edit Facility
                                    </button>
                                    <button
                                        className="btn btn-lg py-3 fw-bold transition-all"
                                        style={{
                                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                            color: "white",
                                            borderRadius: "10px",
                                            border: "none"
                                        }}
                                        onClick={() => setActiveTab("children")}
                                    >
                                        <i className="bx bx-plus me-2"></i>Add Child
                                    </button>
                                    <button
                                        className="btn btn-lg py-3 fw-bold transition-all"
                                        style={{
                                            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                            color: "white",
                                            borderRadius: "10px",
                                            border: "none"
                                        }}
                                        onClick={() => setActiveTab("staff")}
                                    >
                                        <i className="bx bx-plus me-2"></i>Add Staff
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Children */}
                        <div className="card border-0 shadow-md hover-lift" style={{ borderRadius: "12px" }}>
                            <div className="card-header bg-light py-4 border-0" style={{ borderRadius: "12px 12px 0 0", backgroundColor: "#f8f9fa !important" }}>
                                <h5 className="card-title mb-0 fw-bold text-dark">
                                    <i className="bx bx-user-circle me-2" style={{ color: "#667eea" }}></i>Recent Children
                                </h5>
                            </div>
                            <div className="card-body p-0" style={{ maxHeight: "350px", overflowY: "auto" }}>
                                {childrenList.length > 0 ? (
                                    <div className="list-group list-group-flush">
                                        {childrenList.slice(0, 5).map((child, idx) => (
                                            <div
                                                key={child.id}
                                                className="list-group-item px-4 py-3 border-bottom transition-all hover-bg"
                                                style={{ background: idx % 2 === 0 ? "#f8f9fa" : "white" }}
                                            >
                                                <small className="text-muted d-block mb-1" style={{ fontWeight: "500" }}>
                                                    {child.child_unique_number}
                                                </small>
                                                <strong className="d-block text-dark mb-1">
                                                    {child.full_name}
                                                </strong>
                                                <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                                                    {child.gender} • {child.date_of_birth}
                                                </small>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted text-center mb-0 py-4">No children yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CHILDREN TAB */}
            {activeTab === "children" && (
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card border-0 shadow-md" style={{ borderRadius: "12px", overflow: "hidden" }}>
                            <div className="card-header py-4 border-0" 
                                 style={{ 
                                     background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                     borderRadius: "12px 12px 0 0"
                                 }}>
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <h5 className="card-title text-white mb-0 fw-bold">
                                            <i className="bx bx-user me-2"></i>Children in {facility.name}
                                        </h5>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <button
                                            className="btn btn-sm btn-light fw-bold px-4 py-2"
                                            onClick={() => setShowAddChildModal(true)}
                                            style={{ borderRadius: "8px" }}
                                        >
                                            <i className="bx bx-plus me-1"></i>Add Child
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-4">
                                {/* Search */}
                                <div className="mb-4">
                                    <div className="input-group input-group-lg" style={{ borderRadius: "10px", overflow: "hidden" }}>
                                        <span className="input-group-text bg-white border-0" style={{ color: "#667eea" }}>
                                            <i className="bx bx-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-0 ps-3"
                                            placeholder="Search by name or ID..."
                                            value={searchChild}
                                            onChange={(e) => setSearchChild(e.target.value)}
                                            style={{ fontSize: "1rem" }}
                                        />
                                    </div>
                                </div>

                                {/* Children Table */}
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead style={{ backgroundColor: "#f8f9fa" }}>
                                            <tr>
                                                <th style={{ width: "60px" }} className="text-center fw-bold text-dark">
                                                    SN
                                                </th>
                                                <th className="fw-bold text-dark">ID Number</th>
                                                <th className="fw-bold text-dark">Full Name</th>
                                                <th className="text-center fw-bold text-dark">Gender</th>
                                                <th className="fw-bold text-dark">Date of Birth</th>
                                                <th className="fw-bold text-dark">Health Status</th>
                                                <th className="text-center fw-bold text-dark" style={{ width: "120px" }}>
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredChildren.length > 0 ? (
                                                filteredChildren.map((child, index) => (
                                                    <tr key={child.id} className="border-bottom transition-all hover-row" style={{ cursor: "pointer" }}>
                                                        <td className="text-center fw-bold text-dark">{index + 1}</td>
                                                        <td>
                                                            <span className="badge px-3 py-2 fw-bold" 
                                                                  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: "8px" }}>
                                                                {child.child_unique_number}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <strong className="text-dark">{child.full_name}</strong>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className="badge px-3 py-2" style={{ background: "#e0e7ff", color: "#667eea", borderRadius: "8px" }}>
                                                                {child.gender}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">{child.date_of_birth}</small>
                                                        </td>
                                                        <td>
                                                            <span
                                                                className="badge px-3 py-2 fw-bold"
                                                                style={{
                                                                    background: child.health_status === "Good" ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                                                    color: "white",
                                                                    borderRadius: "8px"
                                                                }}
                                                            >
                                                                {child.health_status}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="btn-group btn-group-sm gap-1">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm transition-all"
                                                                    style={{ borderRadius: "8px", color: "#3b82f6", background: "#eff6ff", border: "1px solid #bfdbfe" }}
                                                                    title="View"
                                                                >
                                                                    <i className="bx bx-show"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm transition-all"
                                                                    style={{ borderRadius: "8px", color: "#f59e0b", background: "#fffbeb", border: "1px solid #fde68a" }}
                                                                    title="Edit"
                                                                >
                                                                    <i className="bx bx-edit"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm transition-all"
                                                                    style={{ borderRadius: "8px", color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca" }}
                                                                    title="Remove"
                                                                    onClick={() => handleRemoveChild(child.id)}
                                                                >
                                                                    <i className="bx bx-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-5">
                                                        <div className="text-muted">
                                                            <i className="bx bx-inbox" style={{ fontSize: "3rem", opacity: "0.3" }}></i>
                                                            <p className="mt-3 mb-0" style={{ fontSize: "1.1rem" }}>No children found</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* STAFF TAB */}
            {activeTab === "staff" && (
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card border-0 shadow-md" style={{ borderRadius: "12px", overflow: "hidden" }}>
                            <div className="card-header py-4 border-0" 
                                 style={{ 
                                     background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                     borderRadius: "12px 12px 0 0"
                                 }}>
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <h5 className="card-title text-white mb-0 fw-bold">
                                            <i className="bx bx-user-check me-2"></i>Staff Members
                                        </h5>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <button
                                            className="btn btn-sm btn-light fw-bold px-4 py-2"
                                            onClick={() => setShowAddStaffModal(true)}
                                            style={{ borderRadius: "8px" }}
                                        >
                                            <i className="bx bx-plus me-1"></i>Assign Staff
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body p-4">
                                {/* Search */}
                                <div className="mb-4">
                                    <div className="input-group input-group-lg" style={{ borderRadius: "10px", overflow: "hidden" }}>
                                        <span className="input-group-text bg-white border-0" style={{ color: "#3b82f6" }}>
                                            <i className="bx bx-search"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-0 ps-3"
                                            placeholder="Search by name or role..."
                                            value={searchStaff}
                                            onChange={(e) => setSearchStaff(e.target.value)}
                                            style={{ fontSize: "1rem" }}
                                        />
                                    </div>
                                </div>

                                {/* Staff Grid */}
                                {filteredStaff.length > 0 ? (
                                    <div className="row g-4">
                                        {filteredStaff.map((staff) => (
                                            <div key={staff.id} className="col-lg-6 col-xl-4">
                                                <div className="card border-0 shadow-sm hover-lift transition-all h-100" style={{ borderRadius: "12px", overflow: "hidden" }}>
                                                    <div
                                                        className="card-header py-3 border-0"
                                                        style={{ background: "linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)" }}
                                                    >
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <h6 className="card-title mb-1 text-dark fw-bold">
                                                                    {staff.full_name}
                                                                </h6>
                                                                <small className="text-muted fw-bold">{staff.role}</small>
                                                            </div>
                                                            <span
                                                                className="badge px-2 py-1 fw-bold"
                                                                style={{
                                                                    background: staff.status === "active" ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                                                    color: "white",
                                                                    borderRadius: "6px"
                                                                }}
                                                            >
                                                                {staff.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="card-body py-3">
                                                        <div className="mb-3">
                                                            <small className="text-muted d-block mb-1" style={{ fontWeight: "500" }}>
                                                                Department
                                                            </small>
                                                            <span className="badge px-3 py-2" 
                                                                  style={{ background: "#e0e7ff", color: "#667eea", borderRadius: "8px", fontWeight: "500" }}>
                                                                {staff.department || "N/A"}
                                                            </span>
                                                        </div>
                                                        <div className="mb-3">
                                                            <small className="text-muted d-block mb-1" style={{ fontWeight: "500" }}>
                                                                <i className="bx bx-phone me-1"></i>Phone
                                                            </small>
                                                            <p className="mb-0 text-dark fw-bold">{staff.phone}</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <small className="text-muted d-block mb-1" style={{ fontWeight: "500" }}>
                                                                <i className="bx bx-envelope me-1"></i>Email
                                                            </small>
                                                            <p className="mb-0 text-dark text-break" style={{ fontSize: "0.9rem" }}>{staff.email || "N/A"}</p>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted d-block mb-1" style={{ fontWeight: "500" }}>
                                                                Hire Date
                                                            </small>
                                                            <p className="mb-0 text-dark fw-bold">{staff.hire_date || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="card-footer bg-light border-0 py-3">
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm flex-fill transition-all fw-bold"
                                                                style={{ borderRadius: "8px", color: "#f59e0b", background: "#fffbeb", border: "1px solid #fde68a" }}
                                                                title="Edit"
                                                            >
                                                                <i className="bx bx-edit-alt me-1"></i>Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm flex-fill transition-all fw-bold"
                                                                style={{ borderRadius: "8px", color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca" }}
                                                                title="Remove"
                                                                onClick={() => handleRemoveStaff(staff.id)}
                                                            >
                                                                <i className="bx bx-trash me-1"></i>Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <i
                                            className="bx bx-user-check"
                                            style={{ fontSize: "3.5rem", color: "#ccc" }}
                                        ></i>
                                        <p className="text-muted mt-3" style={{ fontSize: "1.1rem" }}>No staff members assigned</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-md" style={{ borderRadius: "12px", overflow: "hidden" }}>
                            <div className="card-header py-4 border-0" 
                                 style={{ 
                                     background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                     borderRadius: "12px 12px 0 0"
                                 }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="card-title text-white mb-0 fw-bold">
                                        <i className="bx bx-cog me-2"></i>Facility Settings
                                    </h5>
                                    {!editingFacility && (
                                        <button
                                            className="btn btn-sm btn-light fw-bold px-4 py-2"
                                            onClick={() => setEditingFacility(true)}
                                            style={{ borderRadius: "8px" }}
                                        >
                                            <i className="bx bx-edit me-1"></i>Edit
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="card-body p-4">
                                {editingFacility ? (
                                    <form onSubmit={handleUpdateFacility}>
                                        <div className="mb-4">
                                            <label className="form-label fw-bold text-dark">
                                                Facility Name *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="name"
                                                value={facilityForm.name}
                                                onChange={handleFacilityChange}
                                                required
                                                style={{ borderRadius: "10px", borderColor: "#e5e7eb", padding: "0.75rem 1rem" }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold text-dark">
                                                Facility Code *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                name="facility_code"
                                                value={facilityForm.facility_code}
                                                onChange={handleFacilityChange}
                                                required
                                                style={{ borderRadius: "10px", borderColor: "#e5e7eb", padding: "0.75rem 1rem" }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold text-dark">
                                                Address *
                                            </label>
                                            <textarea
                                                className="form-control form-control-lg"
                                                name="address"
                                                rows="3"
                                                value={facilityForm.address}
                                                onChange={handleFacilityChange}
                                                required
                                                style={{ borderRadius: "10px", borderColor: "#e5e7eb", padding: "0.75rem 1rem" }}
                                            ></textarea>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold text-dark">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control form-control-lg"
                                                name="phone"
                                                value={facilityForm.phone}
                                                onChange={handleFacilityChange}
                                                required
                                                style={{ borderRadius: "10px", borderColor: "#e5e7eb", padding: "0.75rem 1rem" }}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold text-dark">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control form-control-lg"
                                                name="email"
                                                value={facilityForm.email}
                                                onChange={handleFacilityChange}
                                                style={{ borderRadius: "10px", borderColor: "#e5e7eb", padding: "0.75rem 1rem" }}
                                            />
                                        </div>

                                        <div className="d-flex gap-2 pt-3">
                                            <button
                                                type="submit"
                                                className="btn btn-lg fw-bold px-4 transition-all"
                                                style={{
                                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                    color: "white",
                                                    borderRadius: "10px",
                                                    border: "none"
                                                }}
                                            >
                                                <i className="bx bx-save me-2"></i>Save Changes
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-lg fw-bold px-4 transition-all"
                                                style={{
                                                    background: "#e5e7eb",
                                                    color: "#374151",
                                                    borderRadius: "10px",
                                                    border: "none"
                                                }}
                                                onClick={() => setEditingFacility(false)}
                                            >
                                                <i className="bx bx-x me-2"></i>Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div>
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <p className="text-muted mb-2" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Facility Name</p>
                                                <h6 className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>{facilityForm.name}</h6>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="text-muted mb-2" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Facility Code</p>
                                                <h6 className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>{facilityForm.facility_code}</h6>
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-muted mb-2" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Address</p>
                                            <h6 className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>{facilityForm.address}</h6>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="text-muted mb-2" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Phone</p>
                                                <h6 className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>{facilityForm.phone}</h6>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="text-muted mb-2" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Email</p>
                                                <h6 className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>
                                                    {facilityForm.email || "Not specified"}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-md" style={{ borderRadius: "12px", overflow: "hidden" }}>
                            <div className="card-header py-4 border-0" 
                                 style={{ 
                                     background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                     borderRadius: "12px 12px 0 0"
                                 }}>
                                <h5 className="card-title text-white mb-0 fw-bold">
                                    <i className="bx bx-error-circle me-2"></i>Danger Zone
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                <p className="text-muted mb-4" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                                    Deleting this facility will permanently remove all associated data including children and staff records.
                                </p>
                                <button className="btn btn-lg w-100 fw-bold transition-all py-3"
                                        style={{
                                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                            color: "white",
                                            borderRadius: "10px",
                                            border: "none"
                                        }}>
                                    <i className="bx bx-trash me-2"></i>Delete Facility
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODALS */}

            {/* Add Child Modal */}
            {showAddChildModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
                >
                    <div className="modal-dialog modal-lg" style={{ animation: "slideUp 0.3s ease" }}>
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "12px" }}>
                            <div className="modal-header border-0 py-4" 
                                 style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                                <h5 className="modal-title text-white fw-bold">
                                    <i className="bx bx-user-plus me-2"></i>Add Child to Facility
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowAddChildModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleAddChild}>
                                <div className="modal-body p-4">
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            name="full_name"
                                            value={childForm.full_name}
                                            onChange={handleChildChange}
                                            required
                                            style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                        />
                                    </div>

                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold text-dark">
                                                Date of Birth *
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control form-control-lg"
                                                name="date_of_birth"
                                                value={childForm.date_of_birth}
                                                onChange={handleChildChange}
                                                required
                                                style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold text-dark">
                                                Gender *
                                            </label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="gender"
                                                value={childForm.gender}
                                                onChange={handleChildChange}
                                                required
                                                style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            Health Status
                                        </label>
                                        <select
                                            className="form-select form-select-lg"
                                            name="health_status"
                                            value={childForm.health_status}
                                            onChange={handleChildChange}
                                            style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                        >
                                            <option value="Good">Good</option>
                                            <option value="Stable">Stable</option>
                                            <option value="At Risk">At Risk</option>
                                            <option value="Critical">Critical</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            Contact Person
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            name="contact_person"
                                            value={childForm.contact_person}
                                            onChange={handleChildChange}
                                            style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control form-control-lg"
                                            name="contact_phone"
                                            value={childForm.contact_phone}
                                            onChange={handleChildChange}
                                            style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 bg-light py-3 px-4" style={{ borderRadius: "0 0 12px 12px" }}>
                                    <button
                                        type="button"
                                        className="btn btn-lg fw-bold px-4"
                                        style={{
                                            background: "#e5e7eb",
                                            color: "#374151",
                                            borderRadius: "10px",
                                            border: "none"
                                        }}
                                        onClick={() => setShowAddChildModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-lg fw-bold px-4 transition-all"
                                        style={{
                                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                            color: "white",
                                            borderRadius: "10px",
                                            border: "none"
                                        }}>
                                        <i className="bx bx-plus me-2"></i>Add Child
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Staff Modal */}
            {showAddStaffModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
                >
                    <div className="modal-dialog modal-lg" style={{ animation: "slideUp 0.3s ease" }}>
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "12px" }}>
                            <div className="modal-header border-0 py-4" 
                                 style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}>
                                <h5 className="modal-title text-white fw-bold">
                                    <i className="bx bx-user-plus me-2"></i>Assign Staff to Facility
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowAddStaffModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleAddStaff}>
                                <div className="modal-body p-4">
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            name="full_name"
                                            value={staffForm.full_name}
                                            onChange={handleStaffChange}
                                            required
                                            style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                        />
                                    </div>

                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold text-dark">
                                                Role *
                                            </label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="role"
                                                value={staffForm.role}
                                                onChange={handleStaffChange}
                                                required
                                                style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                            >
                                                <option value="">Select Role</option>
                                                <option value="Caretaker">Caretaker</option>
                                                <option value="Medical Officer">Medical Officer</option>
                                                <option value="Administrator">Administrator</option>
                                                <option value="Teacher">Teacher</option>
                                                <option value="Cook">Cook</option>
                                                <option value="Driver">Driver</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold text-dark">
                                                Department *
                                            </label>
                                            <select
                                                className="form-select form-select-lg"
                                                name="department"
                                                value={staffForm.department}
                                                onChange={handleStaffChange}
                                                required
                                                style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                            >
                                                <option value="">Select Department</option>
                                                <option value="Childcare">Childcare</option>
                                                <option value="Health">Health</option>
                                                <option value="Administration">Administration</option>
                                                <option value="Education">Education</option>
                                                <option value="Support Services">Support Services</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control form-control-lg"
                                            name="phone"
                                            value={staffForm.phone}
                                            onChange={handleStaffChange}
                                            required
                                            style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-dark">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg"
                                            name="email"
                                            value={staffForm.email}
                                            onChange={handleStaffChange}
                                            style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 bg-light py-3 px-4" style={{ borderRadius: "0 0 12px 12px" }}>
                                    <button
                                        type="button"
                                        className="btn btn-lg fw-bold px-4"
                                        style={{
                                            background: "#e5e7eb",
                                            color: "#374151",
                                            borderRadius: "10px",
                                            border: "none"
                                        }}
                                        onClick={() => setShowAddStaffModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-lg fw-bold px-4 transition-all"
                                        style={{
                                            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                            color: "white",
                                            borderRadius: "10px",
                                            border: "none"
                                        }}>
                                        <i className="bx bx-plus me-2"></i>Assign Staff
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FacilityDetailsPage;
