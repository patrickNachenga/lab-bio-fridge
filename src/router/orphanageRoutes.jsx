import { Route } from "react-router-dom";
import ProtectedRoute from "../components/wrapper/ProtectedRoute";

// Import orphanage pages
import { OrphanageDashboard } from "../pages/services/ORPHANAGE/dashboard/Dashboard";
import { FacilitiesPage } from "../pages/services/ORPHANAGE/facilities/List";
import { ChildrenPage } from "../pages/services/ORPHANAGE/children/List";
import { StaffPage } from "../pages/services/ORPHANAGE/staff/List";
import { HospitalVisitsPage } from "../pages/services/ORPHANAGE/hospital_visits/List";
import { PrescriptionsPage } from "../pages/services/ORPHANAGE/prescriptions/List";
import { RemindersPage } from "../pages/services/ORPHANAGE/reminders/List";
import { HospitalsPage } from "../pages/services/ORPHANAGE/hospitals/List";
import ChildDetailsPage from "../pages/services/ORPHANAGE/children/Details";

export const orphanageRoutes = (
  <>
    {/* Dashboard */}
    <Route path="/orphanage" element={<OrphanageDashboard />} />

    {/* Facilities Management */}
    <Route
      path="/orphanage/facilities"
      element={
        <ProtectedRoute
          requiredPermissions={[]}
          requiredRoles={["admin", "staff"]}
        >
          <FacilitiesPage />
        </ProtectedRoute>
      }
    />

    {/* Children/Orphans Management */}
    <Route
      path="/orphanage/children"
      element={
        <ProtectedRoute
          requiredPermissions={[]}
          requiredRoles={["admin", "staff"]}
        >
          <ChildrenPage />
        </ProtectedRoute>
      }
    />

    {/* Children Details */}
    <Route
      path="/orphanage/children/:childId"
      element={
        <ProtectedRoute
          requiredPermissions={[]}
          requiredRoles={["admin", "staff"]}
        >
          <ChildDetailsPage />
        </ProtectedRoute>
      }
    />

    {/* Staff Management */}
    <Route
      path="/orphanage/staff"
      element={
        <ProtectedRoute requiredPermissions={[]} requiredRoles={["admin"]}>
          <StaffPage />
        </ProtectedRoute>
      }
    />

    {/* Hospital Visits */}
    <Route
      path="/orphanage/hospital-visits"
      element={
        <ProtectedRoute
          requiredPermissions={[]}
          requiredRoles={["admin", "staff"]}
        >
          <HospitalVisitsPage />
        </ProtectedRoute>
      }
    />

    {/* Prescriptions */}
    <Route
      path="/orphanage/prescriptions"
      element={
        <ProtectedRoute
          requiredPermissions={[]}
          requiredRoles={["admin", "staff"]}
        >
          <PrescriptionsPage />
        </ProtectedRoute>
      }
    />

    {/* Reminders */}
    <Route
      path="/orphanage/reminders"
      element={
        <ProtectedRoute
          requiredPermissions={[]}
          requiredRoles={["admin", "staff"]}
        >
          <RemindersPage />
        </ProtectedRoute>
      }
    />

    {/* Hospitals */}
    <Route
      path="/orphanage/hospitals"
      element={
        <ProtectedRoute requiredPermissions={[]} requiredRoles={["admin"]}>
          <HospitalsPage />
        </ProtectedRoute>
      }
    />
  </>
);
