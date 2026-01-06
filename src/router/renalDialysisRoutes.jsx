import { Route } from "react-router-dom";
import ProtectedRoute from "../components/wrapper/ProtectedRoute";
import {
  PatientListPage,
  PatientVisitsPage,
  DialysisDetailsPage,
} from "../pages/services/RENAL_DIALYSIS/patient";

export const renalDialysisRoutes = (
  <>
    {/* Main Patient Registry */}
    <Route
      path="/renal-dialysis/patients"
      element={
        <PatientListPage />
        // <ProtectedRoute
        //   requiredPermissions={["view_renal_dialysis_service"]}
        //   requiredRoles={["admin", "staff"]}
        // >
        //   <PatientListPage />
        // </ProtectedRoute>
      }
    />

    {/* Patient Dialysis Visits List */}
    <Route
      path="/renal-dialysis/patient-visits/:patientId"
      element={
        <PatientVisitsPage />
        // <ProtectedRoute
        //   requiredPermissions={["view_renal_dialysis_service"]}
        //   requiredRoles={["admin", "staff"]}
        // >
        //   <PatientVisitsPage />
        // </ProtectedRoute>
      }
    />

    {/* Dialysis Visit Details */}
    <Route
      path="/renal-dialysis/visit/:visitId"
      element={
        <DialysisDetailsPage />
        // <ProtectedRoute
        //   requiredPermissions={["view_renal_dialysis_service"]}
        //   requiredRoles={["admin", "staff"]}
        // >
        //   <DialysisDetailsPage />
        // </ProtectedRoute>
      }
    />

    {/* Legacy routes for backward compatibility */}
    <Route
      path="/renal-dialysis/patient"
      element={
        <PatientListPage />
        // <ProtectedRoute
        //   requiredPermissions={["view_renal_dialysis_service"]}
        //   requiredRoles={["admin", "staff"]}
        // >
        //   <PatientListPage />
        // </ProtectedRoute>
      }
    />

    <Route
      path="/renal-dialysis/visit/:visitId"
      element={
        <DialysisDetailsPage />
        // <ProtectedRoute
        //   requiredPermissions={["view_renal_dialysis_service"]}
        //   requiredRoles={["admin", "staff"]}
        // >
        //   <DialysisDetailsPage />
        // </ProtectedRoute>
      }
    />
  </>
);
