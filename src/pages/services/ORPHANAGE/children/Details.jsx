import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BreadCumb from "../../../../layouts/BreadCumb";
import { formatDate } from "../../../../helpers/DateFormater";
import VisitDetailsModal from "./VisitDetailsModal";
import { getChildDetailsById } from "../../../../data/childrenDetailsData";
import { motion } from "framer-motion";
import "./Details.css";

// Sample child data - replace with API call
const defaultChildDetailData = {
  child: {
    id: "c1a1f9a2-3c1a-4a3d-b4d2-98c8d2c112aa",
    unique_number: "CH-000123",
    full_name: "Amanuel Tesfaye",
    gender: "Male",
    date_of_birth: "2015-06-12",
    age: 9,
  },
  family_history: {
    father_name: "Unknown",
    mother_name: "Unknown",
    medical_conditions: ["Asthma"],
    notes: "Child was admitted through social services",
  },
  facility_history: [
    {
      facility_id: "fac-001",
      facility_name: "Addis Orphanage Center",
      start_date: "2018-01-10",
      end_date: "2021-05-20",
    },
    {
      facility_id: "fac-002",
      facility_name: "Bahir Dar Care Center",
      start_date: "2021-05-21",
      end_date: null,
    },
  ],
  hospital_visits: [
    {
      visit_id: "visit-001",
      visit_date: "2024-02-10",
      next_visit_date: "2024-03-10",
      facility: "Bahir Dar Care Center",
      hospital: {
        id: "hos-001",
        name: "Bahir Dar Referral Hospital",
      },
      status: "CONFIRMED",
      created_by: "CARETAKER",
      doctor: {
        id: "doc-001",
        name: "Dr. Alemayehu",
      },
      prescription_summary: [
        {
          medicine: "Salbutamol",
          dosage: "5 mg",
          frequency_per_day: 2,
          duration_days: 7,
        },
      ],
    },
    {
      visit_id: "visit-002",
      visit_date: "2024-01-15",
      next_visit_date: "2024-02-15",
      facility: "Bahir Dar Care Center",
      hospital: {
        id: "hos-001",
        name: "Bahir Dar Referral Hospital",
      },
      status: "COMPLETED",
      created_by: "DOCTOR",
      doctor: {
        id: "doc-002",
        name: "Dr. Kebede",
      },
      prescription_summary: [
        {
          medicine: "Paracetamol",
          dosage: "250 mg",
          frequency_per_day: 3,
          duration_days: 5,
        },
      ],
    },
    {
      visit_id: "visit-003",
      visit_date: "2023-12-20",
      next_visit_date: "2024-01-20",
      facility: "Addis Orphanage Center",
      hospital: {
        id: "hos-002",
        name: "Addis Medical Center",
      },
      status: "COMPLETED",
      created_by: "NURSE",
      doctor: {
        id: "doc-003",
        name: "Dr. Solomon",
      },
      prescription_summary: [
        {
          medicine: "Amoxicillin",
          dosage: "250 mg",
          frequency_per_day: 3,
          duration_days: 10,
        },
      ],
    },
  ],
  active_medications: [
    {
      medicine: "Salbutamol",
      dosage: "5 mg",
      frequency_per_day: 2,
      start_date: "2024-02-10",
      end_date: "2024-02-17",
    },
  ],
  upcoming_reminders: [
    {
      type: "MEDICINE",
      message: "Give Salbutamol 5 mg",
      remind_at: "2024-02-11T08:00:00",
    },
    {
      type: "VISIT",
      message: "Hospital follow-up visit",
      remind_at: "2024-03-10T09:00:00",
    },
  ],
};

const ChildDetailsPage = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [visitSortBy, setVisitSortBy] = useState("recent");
  const [showAllMedications, setShowAllMedications] = useState(false);

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const sortedVisits = useMemo(() => {
    const visits = [...defaultChildDetailData.hospital_visits];
    if (visitSortBy === "recent") {
      visits.sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));
    } else if (visitSortBy === "oldest") {
      visits.sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date));
    }
    return visits;
  }, [visitSortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "badge-success";
      case "COMPLETED":
        return "badge-info";
      case "PENDING":
        return "badge-warning";
      case "CANCELLED":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bx-check-circle";
      case "COMPLETED":
        return "bx-check-double";
      case "PENDING":
        return "bx-hourglass";
      case "CANCELLED":
        return "bx-x-circle";
      default:
        return "bx-info-circle";
    }
  };

  // Get child data from database or use default
  let data = getChildDetailsById(childId);

  // If no data found, use default
  if (!data) {
    data = defaultChildDetailData;
  }

  const child = data.child;

  return (
    <>
      <BreadCumb pageList={["Children", child.full_name, "Medical Records"]} />

      <div className="child-details-container">
        {/* Header Section */}
        <motion.div
          className="row mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="col-lg-12">
            <div className="card border-0 shadow-sm header-card">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2 text-center">
                    <div
                      className="avatar-lg mb-3"
                      style={{
                        backgroundColor:
                          child.gender === "Male" ? "#e3f2fd" : "#fce4ec",
                        borderRadius: "50%",
                        width: "120px",
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                      }}
                    >
                      <i
                        className={`bx ${
                          child.gender === "Male" ? "bxs-male" : "bxs-female"
                        }`}
                        style={{
                          fontSize: "3rem",
                          color:
                            child.gender === "Male" ? "#1976d2" : "#c2185b",
                        }}
                      ></i>
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div className="row">
                      <div className="col-md-8">
                        <h2 className="mb-1 fw-bold text-dark">
                          {child.full_name}
                        </h2>
                        <p className="text-muted mb-3">
                          <span className="badge bg-info me-2">
                            {child.unique_number}
                          </span>
                          <span className="badge bg-secondary">
                            {child.gender}
                          </span>
                        </p>
                        <div className="row">
                          <div className="col-md-4">
                            <p className="mb-1">
                              <small className="text-muted">Age</small>
                            </p>
                            <h5 className="text-primary fw-bold">
                              {calculateAge(child.date_of_birth)} years
                            </h5>
                          </div>
                          <div className="col-md-4">
                            <p className="mb-1">
                              <small className="text-muted">
                                Date of Birth
                              </small>
                            </p>
                            <h5 className="fw-bold">
                              {formatDate(child.date_of_birth, "DD/MM/YYYY")}
                            </h5>
                          </div>
                          <div className="col-md-4">
                            <p className="mb-1">
                              <small className="text-muted">Medical ID</small>
                            </p>
                            <h5 className="fw-bold text-info">
                              {child.unique_number}
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <button
                          className="btn btn-outline-secondary me-2"
                          onClick={() => navigate("/orphanage/children")}
                        >
                          <i className="bx bx-arrow-back me-1"></i> Back
                        </button>
                        <button className="btn btn-primary">
                          <i className="bx bx-edit me-1"></i> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="row">
          {/* Left Column - Medical Info */}
          <div className="col-lg-4">
            {/* Family History */}
            <motion.div
              className="card border-0 shadow-sm mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="card-header bg-gradient-info py-3">
                <h5 className="card-title text-white mb-0">
                  <i className="bx bx-family me-2"></i> Family History
                </h5>
              </div>
              <div className="card-body">
                <div className="family-info">
                  <div className="info-item mb-3">
                    <label className="text-muted small">Father</label>
                    <p className="fw-bold mb-0">
                      {data.family_history.father_name}
                    </p>
                  </div>
                  <div className="info-item mb-3">
                    <label className="text-muted small">Mother</label>
                    <p className="fw-bold mb-0">
                      {data.family_history.mother_name}
                    </p>
                  </div>
                  <hr />
                  <div className="info-item mb-3">
                    <label className="text-muted small">
                      Medical Conditions
                    </label>
                    <div>
                      {data.family_history.medical_conditions.map(
                        (condition, idx) => (
                          <span
                            key={idx}
                            className="badge bg-warning-light text-warning d-inline-block me-2 mb-2"
                            style={{
                              backgroundColor: "#fff3cd",
                              color: "#856404",
                            }}
                          >
                            <i className="bx bx-health me-1"></i>
                            {condition}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div className="info-item">
                    <label className="text-muted small">Notes</label>
                    <p className="mb-0">
                      <em>{data.family_history.notes}</em>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Facility History */}
            <motion.div
              className="card border-0 shadow-sm mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="card-header bg-gradient-warning py-3">
                <h5 className="card-title text-white mb-0">
                  <i className="bx bx-building me-2"></i> Facility History
                </h5>
              </div>
              <div className="card-body">
                <div className="timeline">
                  {data.facility_history.map((facility, idx) => (
                    <div key={idx} className="timeline-item mb-3">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h6 className="fw-bold mb-1">
                          {facility.facility_name}
                        </h6>
                        <small className="text-muted d-block">
                          <i className="bx bx-calendar me-1"></i>
                          {formatDate(facility.start_date, "DD/MM/YYYY")} -{" "}
                          {facility.end_date
                            ? formatDate(facility.end_date, "DD/MM/YYYY")
                            : "Present"}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Active Medications */}
            <motion.div
              className="card border-0 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="card-header bg-gradient-danger py-3">
                <h5 className="card-title text-white mb-0">
                  <i className="bx bx-pill me-2"></i> Active Medications
                </h5>
              </div>
              <div className="card-body">
                {data.active_medications.length > 0 ? (
                  <div className="medications-list">
                    {data.active_medications.map((med, idx) => (
                      <div
                        key={idx}
                        className="medication-card p-3 mb-3 rounded bg-light border-start border-danger border-4"
                      >
                        <div className="row align-items-center">
                          <div className="col-md-8">
                            <h6 className="fw-bold mb-1">{med.medicine}</h6>
                            <small className="text-muted d-block">
                              <i className="bx bx-beaker me-1"></i>
                              {med.dosage}
                            </small>
                            <small className="text-muted d-block">
                              <i className="bx bx-time me-1"></i>
                              {med.frequency_per_day}x daily
                            </small>
                          </div>
                          <div className="col-md-4 text-end">
                            <span className="badge bg-success">Active</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center py-3">
                    <i className="bx bx-check-circle"></i> No active medications
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Hospital Visits */}
          <div className="col-lg-8">
            <motion.div
              className="card border-0 shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="card-header bg-gradient-success py-3">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h5 className="card-title text-white mb-0">
                      <i className="bx bx-clinic me-2"></i> Hospital Visits
                      <span className="badge bg-white text-success ms-2">
                        {data.hospital_visits.length}
                      </span>
                    </h5>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <select
                      className="form-select form-select-sm"
                      style={{
                        width: "auto",
                        marginLeft: "auto",
                        display: "inline-block",
                      }}
                      value={visitSortBy}
                      onChange={(e) => setVisitSortBy(e.target.value)}
                    >
                      <option value="recent">Most Recent</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {sortedVisits.length > 0 ? (
                  <div className="visits-list">
                    {sortedVisits.map((visit, idx) => (
                      <motion.div
                        key={visit.visit_id}
                        className="visit-card border rounded-lg p-4 mb-3"
                        style={{
                          borderLeft: "4px solid #0dcaf0",
                          backgroundColor: "#f8f9fa",
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        whileHover={{
                          y: -2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      >
                        <div className="row align-items-start">
                          <div className="col-md-8">
                            <div className="visit-header mb-3">
                              <div className="row align-items-center mb-2">
                                <div className="col-md-8">
                                  <h6 className="fw-bold mb-1">
                                    <i className="bx bx-hospital me-2 text-info"></i>
                                    {visit.hospital.name}
                                  </h6>
                                  <p className="text-muted small mb-2">
                                    <i className="bx bx-map me-1"></i>
                                    {visit.facility}
                                  </p>
                                </div>
                                <div className="col-md-4 text-md-end">
                                  <span
                                    className={`badge ${getStatusColor(
                                      visit.status
                                    )}`}
                                  >
                                    <i
                                      className={`bx ${getStatusIcon(
                                        visit.status
                                      )} me-1`}
                                    ></i>
                                    {visit.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="visit-details row">
                              <div className="col-md-6 mb-2">
                                <small className="text-muted d-block">
                                  Visit Date
                                </small>
                                <p className="fw-bold mb-0">
                                  <i className="bx bx-calendar me-1"></i>
                                  {formatDate(visit.visit_date, "DD/MM/YYYY")}
                                </p>
                              </div>
                              <div className="col-md-6 mb-2">
                                <small className="text-muted d-block">
                                  Next Visit
                                </small>
                                <p className="fw-bold mb-0">
                                  <i className="bx bx-calendar me-1"></i>
                                  {formatDate(
                                    visit.next_visit_date,
                                    "DD/MM/YYYY"
                                  )}
                                </p>
                              </div>
                              <div className="col-md-6 mb-2">
                                <small className="text-muted d-block">
                                  Doctor
                                </small>
                                <p className="fw-bold mb-0">
                                  <i className="bx bx-user-check me-1"></i>
                                  {visit.doctor.name}
                                </p>
                              </div>
                              <div className="col-md-6 mb-2">
                                <small className="text-muted d-block">
                                  Recorded By
                                </small>
                                <p className="fw-bold mb-0">
                                  <span className="badge bg-light text-dark">
                                    {visit.created_by}
                                  </span>
                                </p>
                              </div>
                            </div>

                            {visit.prescription_summary.length > 0 && (
                              <div className="mt-3 pt-3 border-top">
                                <h6 className="fw-bold mb-2">
                                  <i className="bx bx-pill me-1 text-danger"></i>
                                  Prescriptions
                                </h6>
                                {visit.prescription_summary.map(
                                  (prescription, pIdx) => (
                                    <div
                                      key={pIdx}
                                      className="prescription-item p-2 rounded mb-2 bg-white border-start border-danger border-2"
                                    >
                                      <div className="row align-items-center">
                                        <div className="col-md-6">
                                          <p className="fw-bold mb-1 small">
                                            {prescription.medicine}
                                          </p>
                                          <small className="text-muted d-block">
                                            Dosage: {prescription.dosage}
                                          </small>
                                        </div>
                                        <div className="col-md-6 text-md-end">
                                          <small className="text-muted d-block">
                                            {prescription.frequency_per_day}x
                                            daily
                                          </small>
                                          <small className="text-muted d-block">
                                            {prescription.duration_days} days
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <div className="col-md-4">
                            <button
                              className="btn btn-sm btn-info w-100"
                              onClick={() => setSelectedVisit(visit)}
                              data-bs-toggle="modal"
                              data-bs-target="#visitDetailsModal"
                            >
                              <i className="bx bx-show me-1"></i> View Full
                              Details
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i
                      className="bx bx-inbox"
                      style={{
                        fontSize: "3rem",
                        color: "#ccc",
                        display: "block",
                        marginBottom: "1rem",
                      }}
                    ></i>
                    <p className="text-muted">No hospital visits recorded</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Reminders */}
            {data.upcoming_reminders.length > 0 && (
              <motion.div
                className="card border-0 shadow-sm mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="card-header bg-gradient-warning py-3">
                  <h5 className="card-title text-white mb-0">
                    <i className="bx bx-bell me-2"></i> Upcoming Reminders
                  </h5>
                </div>
                <div className="card-body">
                  {data.upcoming_reminders.map((reminder, idx) => (
                    <div
                      key={idx}
                      className="reminder-item p-3 mb-2 rounded border-start border-warning border-4"
                      style={{ backgroundColor: "#fffbf0" }}
                    >
                      <div className="row align-items-center">
                        <div className="col-md-1 text-center">
                          <i
                            className={`bx ${
                              reminder.type === "MEDICINE"
                                ? "bx-pill"
                                : "bx-hospital"
                            }`}
                            style={{ fontSize: "1.5rem", color: "#ff9800" }}
                          ></i>
                        </div>
                        <div className="col-md-7">
                          <p className="fw-bold mb-1">{reminder.message}</p>
                          <small className="text-muted">
                            <i className="bx bx-time me-1"></i>
                            {formatDate(reminder.remind_at, "DD/MM/YYYY HH:mm")}
                          </small>
                        </div>
                        <div className="col-md-4 text-md-end">
                          <span className="badge bg-warning text-dark">
                            {reminder.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Visit Details */}
      <VisitDetailsModal visit={selectedVisit} />
    </>
  );
};

export default ChildDetailsPage;
