import React, { useState } from "react";
import { PatientAPI } from "../../services/renalDialysisAPI";
import Swal from "sweetalert2";
import { X, Loader } from "lucide-react";

const PatientForm = ({ patient, onClose }) => {
  const [formData, setFormData] = useState(
    patient || {
      hospital_reg_no: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      sex: "M",
      phone_number: "",
      next_of_kin: "",
      next_of_kin_relationship: "",
      next_of_kin_phone: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.hospital_reg_no.trim())
      newErrors.hospital_reg_no = "Registration number is required";
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.date_of_birth) newErrors.date_of_birth = "DOB is required";
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
      if (patient?.id) {
        await PatientAPI.updatePatient(patient.id, formData);
        Swal.fire("Success!", "Patient updated successfully.", "success");
      } else {
        await PatientAPI.createPatient(formData);
        Swal.fire("Success!", "Patient created successfully.", "success");
      }
      onClose();
    } catch (error) {
      console.error("Error saving patient:", error);
      const errorMessage =
        error.response?.data?.hospital_reg_no?.[0] ||
        error.response?.data?.detail ||
        "Failed to save patient";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {patient ? "Edit Patient" : "New Patient"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hospital Reg No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hospital Registration No *
            </label>
            <input
              type="text"
              name="hospital_reg_no"
              value={formData.hospital_reg_no}
              onChange={handleChange}
              disabled={!!patient}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            {errors.hospital_reg_no && (
              <p className="text-red-500 text-sm mt-1">{errors.hospital_reg_no}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
              )}
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sex
              </label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Next of Kin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next of Kin
            </label>
            <input
              type="text"
              name="next_of_kin"
              value={formData.next_of_kin}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* NOK Relationship */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NOK Relationship
              </label>
              <input
                type="text"
                name="next_of_kin_relationship"
                value={formData.next_of_kin_relationship}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* NOK Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NOK Phone
              </label>
              <input
                type="tel"
                name="next_of_kin_phone"
                value={formData.next_of_kin_phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              {patient ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
