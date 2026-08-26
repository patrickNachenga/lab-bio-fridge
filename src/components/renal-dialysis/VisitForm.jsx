import React, { useState } from "react";
import { VisitAPI } from "../../services/renalDialysisAPI";
import Swal from "sweetalert2";
import { X, Loader } from "lucide-react";

const VisitForm = ({ visit, patients, onClose }) => {
  const [formData, setFormData] = useState(
    visit || {
      patient: "",
      ward: "",
      diagnosis: "",
      attending_doctor: "",
      discharged: false,
    }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patient) newErrors.patient = "Patient is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      if (visit?.id) {
        await VisitAPI.updateVisit(visit.id, formData);
        Swal.fire("Success!", "Visit updated successfully.", "success");
      } else {
        await VisitAPI.createVisit(formData);
        Swal.fire("Success!", "Visit created successfully.", "success");
      }
      onClose();
    } catch (error) {
      console.error("Error saving visit:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save visit",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {visit ? "Edit Visit" : "New Visit"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient *
            </label>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              disabled={!!visit}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.hospital_reg_no} - {p.first_name} {p.last_name}
                </option>
              ))}
            </select>
            {errors.patient && (
              <p className="text-red-500 text-sm mt-1">{errors.patient}</p>
            )}
          </div>

          {/* Ward */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ward
            </label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              placeholder="e.g., Renal Unit"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis
            </label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Attending Doctor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attending Doctor
            </label>
            <input
              type="text"
              name="attending_doctor"
              value={formData.attending_doctor}
              onChange={handleChange}
              placeholder="e.g., Dr. John Smith"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Discharged */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="discharged"
                checked={formData.discharged}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Patient Discharged
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              {visit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitForm;
