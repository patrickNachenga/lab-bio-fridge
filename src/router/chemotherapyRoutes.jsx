import { Route } from "react-router-dom";
import {
  PatientListPage,
  PatientVisitsPage,
  ChemotherapyDetailsPage,
} from "../pages/services/CHEMOTHERAPY/patient";

export const chemotherapyRoutes = (
  <>
    {/* Main Patient Registry */}
    <Route path="/chemotherapy/patients" element={<PatientListPage />} />

    {/* Patient Chemotherapy Visits List */}
    <Route
      path="/chemotherapy/patient-visits/:patientId"
      element={<PatientVisitsPage />}
    />

    {/* Chemotherapy Visit Details */}
    <Route
      path="/chemotherapy/visit/:visitId"
      element={<ChemotherapyDetailsPage />}
    />

    {/* Legacy routes for backward compatibility */}
    <Route path="/chemotherapy/patient" element={<PatientListPage />} />

    <Route
      path="/chemotherapy/visit/:visitId"
      element={<ChemotherapyDetailsPage />}
    />
  </>
);
