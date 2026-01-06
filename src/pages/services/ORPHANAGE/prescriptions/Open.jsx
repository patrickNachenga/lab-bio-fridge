import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  prescriptionsData,
  medicinesData,
  hospitalVisitsData,
  staffData,
} from "../../../../data/orphanageSampleData";

export const PrescriptionsOpenPage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [formData, setFormData] = useState({
    hospital_visit_id: "",
    doctor_id: "",
    notes: "",
    medicines: [],
  });
  const [newMedicine, setNewMedicine] = useState({
    medicine_id: "",
    dosage: "",
    frequency_per_day: "1",
    duration_days: "7",
    start_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (uid && uid !== "new") {
      const found = prescriptionsData.find((p) => p.id === uid);
      if (found) {
        setPrescription(found);
        setFormData({
          hospital_visit_id: found.hospital_visit_id,
          doctor_id: found.doctor_id,
          notes: found.notes,
          medicines: found.medicines,
        });
      }
    }
  }, [uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewMedicineChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addMedicine = (e) => {
    e.preventDefault();
    if (newMedicine.medicine_id && newMedicine.dosage) {
      const selectedMedicine = medicinesData.find((m) => m.id === newMedicine.medicine_id);
      setFormData((prev) => ({
        ...prev,
        medicines: [
          ...prev.medicines,
          {
            id: `med-${Date.now()}`,
            name: selectedMedicine.name,
            dosage: parseFloat(newMedicine.dosage),
            unit: selectedMedicine.unit,
            frequency_per_day: parseInt(newMedicine.frequency_per_day),
            duration_days: parseInt(newMedicine.duration_days),
            start_date: newMedicine.start_date,
          },
        ],
      }));
      setNewMedicine({
        medicine_id: "",
        dosage: "",
        frequency_per_day: "1",
        duration_days: "7",
        start_date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const removeMedicine = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.medicines.length === 0) {
      alert("Please add at least one medicine to the prescription!");
      return;
    }
    alert(
      uid === "new"
        ? "Prescription created successfully!"
        : "Prescription updated successfully!"
    );
    navigate("/orphanage/prescriptions");
  };

  const doctors = staffData.filter((s) => s.role === "Medical Officer");

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              {uid === "new" ? "Create New Prescription" : "Edit Prescription"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Hospital Visit</label>
                  <select
                    className="form-control"
                    name="hospital_visit_id"
                    value={formData.hospital_visit_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a hospital visit</option>
                    {hospitalVisitsData.map((visit) => (
                      <option key={visit.id} value={visit.id}>
                        {visit.child_name} - {new Date(visit.visit_date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Doctor</label>
                  <select
                    className="form-control"
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter prescription notes..."
                ></textarea>
              </div>

              <div className="card mb-3 bg-light">
                <div className="card-header">
                  <h6 className="card-title mb-0">Add Medicine</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Medicine</label>
                      <select
                        className="form-control"
                        name="medicine_id"
                        value={newMedicine.medicine_id}
                        onChange={handleNewMedicineChange}
                      >
                        <option value="">Select medicine</option>
                        {medicinesData.map((med) => (
                          <option key={med.id} value={med.id}>
                            {med.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Dosage</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          name="dosage"
                          value={newMedicine.dosage}
                          onChange={handleNewMedicineChange}
                          placeholder="Amount"
                          step="0.1"
                        />
                        <span className="input-group-text">mg</span>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Frequency/Day</label>
                      <input
                        type="number"
                        className="form-control"
                        name="frequency_per_day"
                        value={newMedicine.frequency_per_day}
                        onChange={handleNewMedicineChange}
                        min="1"
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Duration (Days)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="duration_days"
                        value={newMedicine.duration_days}
                        onChange={handleNewMedicineChange}
                        min="1"
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="start_date"
                        value={newMedicine.start_date}
                        onChange={handleNewMedicineChange}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={addMedicine}
                  >
                    <i className="bx bx-plus"></i> Add Medicine
                  </button>
                </div>
              </div>

              {formData.medicines.length > 0 && (
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="card-title mb-0">
                      Prescribed Medicines ({formData.medicines.length})
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Duration</th>
                            <th>Start Date</th>
                            <th width="50"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.medicines.map((med, idx) => (
                            <tr key={idx}>
                              <td>{med.name}</td>
                              <td>
                                {med.dosage} {med.unit}
                              </td>
                              <td>{med.frequency_per_day}x/day</td>
                              <td>{med.duration_days}d</td>
                              <td>{med.start_date}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeMedicine(idx)}
                                >
                                  <i className="bx bx-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  <i className="bx bx-save"></i> Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/orphanage/prescriptions")}
                >
                  <i className="bx bx-x"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {prescription && (
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Prescription Info</h5>
            </div>
            <div className="card-body">
              <p className="mb-3">
                <strong>Child:</strong> <br />
                <small>{prescription.child_name}</small>
              </p>
              <p className="mb-3">
                <strong>Doctor:</strong> <br />
                <small>{prescription.doctor_name}</small>
              </p>
              <p className="mb-3">
                <strong>Status:</strong> <br />
                <span className="badge bg-label-success">{prescription.status.toUpperCase()}</span>
              </p>
              <p className="mb-0">
                <strong>Medicines:</strong> <br />
                <span className="badge bg-label-info">{prescription.medicines.length}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
