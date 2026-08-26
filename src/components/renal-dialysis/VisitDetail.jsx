import React from "react";
import { X } from "lucide-react";

const VisitDetail = ({ visit, onClose }) => {
  const sections = [
    {
      title: "Vascular Access",
      data: visit.vascular_access,
      fields: ["access_type"],
    },
    {
      title: "Pre-Dialysis Assessment",
      data: visit.pre_dialysis,
      fields: ["weight", "height_cm", "standing_bp", "resting_bp", "pulse", "respiration", "temperature", "spo2"],
    },
    {
      title: "Dialysis Order",
      data: visit.dialysis_order,
      fields: [
        "dialysate_na",
        "dialysate_k",
        "bicarbonate",
        "hours_of_dialysis",
        "target_weight_loss",
      ],
    },
    {
      title: "Dialysis Session",
      data: visit.dialysis_session,
      fields: ["machine_type", "dialyzer_type", "start_time", "end_time"],
    },
    {
      title: "Post-Dialysis Assessment",
      data: visit.post_dialysis,
      fields: [
        "weight",
        "weight_loss",
        "standing_bp",
        "resting_bp",
        "pulse",
        "respiration",
        "temperature",
        "spo2",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Visit Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {section.title}
              </h3>
              {section.data ? (
                <div className="grid grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <div key={field}>
                      <p className="text-sm text-gray-600 capitalize">
                        {field.replace(/_/g, " ")}
                      </p>
                      <p className="text-gray-900 font-medium">
                        {String(section.data[field] || "-")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No data recorded</p>
              )}
            </div>
          ))}

          {/* Investigations */}
          {visit.investigations && visit.investigations.length > 0 && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Investigations
              </h3>
              <div className="space-y-2">
                {visit.investigations.map((inv, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-900">{inv.name}</p>
                    <p className="text-sm text-gray-600">
                      Pre: {inv.pre_dialysis_value} | Post:{" "}
                      {inv.post_dialysis_value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medications */}
          {visit.medications && visit.medications.length > 0 && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Medications
              </h3>
              <div className="space-y-2">
                {visit.medications.map((med, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium text-gray-900">{med.name}</p>
                    <p className="text-sm text-gray-600">
                      {med.dose} | {med.route} | {med.frequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problems */}
          {visit.dialysis_problems && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Dialysis Problems
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  Hypotension:{" "}
                  <span
                    className={visit.dialysis_problems.hypotension ? "text-red-600" : "text-green-600"}
                  >
                    {visit.dialysis_problems.hypotension ? "Yes" : "No"}
                  </span>
                </p>
                <p>
                  Hypertension:{" "}
                  <span
                    className={visit.dialysis_problems.hypertension ? "text-red-600" : "text-green-600"}
                  >
                    {visit.dialysis_problems.hypertension ? "Yes" : "No"}
                  </span>
                </p>
                <p>
                  Chills:{" "}
                  <span
                    className={visit.dialysis_problems.chills ? "text-red-600" : "text-green-600"}
                  >
                    {visit.dialysis_problems.chills ? "Yes" : "No"}
                  </span>
                </p>
                <p>
                  Fever:{" "}
                  <span
                    className={visit.dialysis_problems.fever ? "text-red-600" : "text-green-600"}
                  >
                    {visit.dialysis_problems.fever ? "Yes" : "No"}
                  </span>
                </p>
                {visit.dialysis_problems.other_problems && (
                  <p className="mt-2">
                    Other: {visit.dialysis_problems.other_problems}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitDetail;
