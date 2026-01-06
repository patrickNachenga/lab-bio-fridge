// Extended child details data with multiple children and hospital visits

export const childrenDetailsDatabase = [
  {
    id: "c1a1f9a2-3c1a-4a3d-b4d2-98c8d2c112aa",
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
      medical_conditions: ["Asthma", "Allergies"],
      notes: "Child was admitted through social services. Parentless.",
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
          {
            medicine: "Cetirizine",
            dosage: "5 mg",
            frequency_per_day: 1,
            duration_days: 30,
          },
        ],
        notes: "Follow-up visit for asthma management. Patient showing improvement.",
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
        notes: "Initial consultation. Patient had mild fever and cough.",
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
        notes: "Treatment for respiratory infection.",
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
      {
        medicine: "Cetirizine",
        dosage: "5 mg",
        frequency_per_day: 1,
        start_date: "2024-02-10",
        end_date: null,
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
  },
  {
    id: "c2b2g0b3-4d2b-5b4e-c5e3-99d9e3d223bb",
    child: {
      id: "c2b2g0b3-4d2b-5b4e-c5e3-99d9e3d223bb",
      unique_number: "CH-000124",
      full_name: "Almaz Meheret",
      gender: "Female",
      date_of_birth: "2013-03-22",
      age: 11,
    },
    family_history: {
      father_name: "Meheret Abera",
      mother_name: "Unknown",
      medical_conditions: ["Anemia", "Malnutrition"],
      notes: "Single mother passed away. Father whereabouts unknown.",
    },
    facility_history: [
      {
        facility_id: "fac-002",
        facility_name: "Bahir Dar Care Center",
        start_date: "2020-08-15",
        end_date: null,
      },
    ],
    hospital_visits: [
      {
        visit_id: "visit-004",
        visit_date: "2024-02-05",
        next_visit_date: "2024-02-26",
        facility: "Bahir Dar Care Center",
        hospital: {
          id: "hos-001",
          name: "Bahir Dar Referral Hospital",
        },
        status: "COMPLETED",
        created_by: "CARETAKER",
        doctor: {
          id: "doc-004",
          name: "Dr. Henok",
        },
        prescription_summary: [
          {
            medicine: "Iron Supplement",
            dosage: "200 mg",
            frequency_per_day: 1,
            duration_days: 90,
          },
          {
            medicine: "Vitamin B12",
            dosage: "1000 mcg",
            frequency_per_day: 1,
            duration_days: 90,
          },
        ],
        notes: "Lab results show moderate anemia. Started supplementation.",
      },
      {
        visit_id: "visit-005",
        visit_date: "2023-11-10",
        next_visit_date: "2023-12-10",
        facility: "Bahir Dar Care Center",
        hospital: {
          id: "hos-001",
          name: "Bahir Dar Referral Hospital",
        },
        status: "COMPLETED",
        created_by: "DOCTOR",
        doctor: {
          id: "doc-001",
          name: "Dr. Alemayehu",
        },
        prescription_summary: [
          {
            medicine: "Multivitamin",
            dosage: "Pediatric",
            frequency_per_day: 1,
            duration_days: 30,
          },
        ],
        notes: "Nutritional assessment. Recommended dietary improvements.",
      },
    ],
    active_medications: [
      {
        medicine: "Iron Supplement",
        dosage: "200 mg",
        frequency_per_day: 1,
        start_date: "2024-02-05",
        end_date: null,
      },
      {
        medicine: "Vitamin B12",
        dosage: "1000 mcg",
        frequency_per_day: 1,
        start_date: "2024-02-05",
        end_date: null,
      },
    ],
    upcoming_reminders: [
      {
        type: "MEDICINE",
        message: "Give Iron Supplement 200 mg",
        remind_at: "2024-02-12T09:00:00",
      },
      {
        type: "VISIT",
        message: "Anemia follow-up visit",
        remind_at: "2024-02-26T10:00:00",
      },
    ],
  },
  {
    id: "c3c3h1c4-5e3c-6c5f-d6f4-00e0f4e334cc",
    child: {
      id: "c3c3h1c4-5e3c-6c5f-d6f4-00e0f4e334cc",
      unique_number: "CH-000125",
      full_name: "Dawit Gebremedhin",
      gender: "Male",
      date_of_birth: "2014-09-05",
      age: 9,
    },
    family_history: {
      father_name: "Unknown",
      mother_name: "Abeba Gebremedhin",
      medical_conditions: ["Diabetes Type 1"],
      notes: "Mother deceased. Father unknown. Diagnosed with diabetes in 2022.",
    },
    facility_history: [
      {
        facility_id: "fac-001",
        facility_name: "Addis Orphanage Center",
        start_date: "2019-04-20",
        end_date: null,
      },
    ],
    hospital_visits: [
      {
        visit_id: "visit-006",
        visit_date: "2024-02-08",
        next_visit_date: "2024-03-08",
        facility: "Addis Orphanage Center",
        hospital: {
          id: "hos-002",
          name: "Addis Medical Center",
        },
        status: "CONFIRMED",
        created_by: "CARETAKER",
        doctor: {
          id: "doc-005",
          name: "Dr. Yohannes",
        },
        prescription_summary: [
          {
            medicine: "Insulin NPH",
            dosage: "20 units",
            frequency_per_day: 2,
            duration_days: 30,
          },
          {
            medicine: "Metformin",
            dosage: "500 mg",
            frequency_per_day: 2,
            duration_days: 30,
          },
        ],
        notes: "Quarterly diabetes management review. HbA1c levels stable.",
      },
    ],
    active_medications: [
      {
        medicine: "Insulin NPH",
        dosage: "20 units",
        frequency_per_day: 2,
        start_date: "2022-06-15",
        end_date: null,
      },
      {
        medicine: "Metformin",
        dosage: "500 mg",
        frequency_per_day: 2,
        start_date: "2022-06-15",
        end_date: null,
      },
    ],
    upcoming_reminders: [
      {
        type: "MEDICINE",
        message: "Morning Insulin injection",
        remind_at: "2024-02-12T07:00:00",
      },
      {
        type: "MEDICINE",
        message: "Evening Insulin injection",
        remind_at: "2024-02-12T19:00:00",
      },
      {
        type: "VISIT",
        message: "Diabetes management follow-up",
        remind_at: "2024-03-08T08:00:00",
      },
    ],
  },
  {
    id: "c4d4i2d5-6f4d-7d6g-e7g5-11f1g5f445dd",
    child: {
      id: "c4d4i2d5-6f4d-7d6g-e7g5-11f1g5f445dd",
      unique_number: "CH-000126",
      full_name: "Tigist Mengistu",
      gender: "Female",
      date_of_birth: "2012-07-14",
      age: 11,
    },
    family_history: {
      father_name: "Mengistu Taye",
      mother_name: "Marta Taye",
      medical_conditions: ["None"],
      notes: "Both parents deceased in accident. Healthy child.",
    },
    facility_history: [
      {
        facility_id: "fac-001",
        facility_name: "Addis Orphanage Center",
        start_date: "2017-12-01",
        end_date: null,
      },
    ],
    hospital_visits: [
      {
        visit_id: "visit-007",
        visit_date: "2024-01-20",
        next_visit_date: "2024-07-20",
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
            medicine: "Calcium + Vitamin D",
            dosage: "500 mg + 400 IU",
            frequency_per_day: 1,
            duration_days: 180,
          },
        ],
        notes: "Annual health check-up. All parameters normal. Good health status.",
      },
    ],
    active_medications: [
      {
        medicine: "Calcium + Vitamin D",
        dosage: "500 mg + 400 IU",
        frequency_per_day: 1,
        start_date: "2024-01-20",
        end_date: null,
      },
    ],
    upcoming_reminders: [
      {
        type: "MEDICINE",
        message: "Take Calcium + Vitamin D supplement",
        remind_at: "2024-02-13T08:00:00",
      },
      {
        type: "VISIT",
        message: "Annual health check-up",
        remind_at: "2024-07-20T09:00:00",
      },
    ],
  },
];

// Function to get child details by ID
export const getChildDetailsById = (childId) => {
  return childrenDetailsDatabase.find((child) => child.id === childId);
};

// Function to get all children details
export const getAllChildrenDetails = () => {
  return childrenDetailsDatabase;
};
