import { Route } from "react-router-dom";
import ProtectedRoute from "../components/wrapper/ProtectedRoute";
import BioDashboard from "../pages/BIOFRIDGE/Dashboard";
import Analytics from "../pages/BIOFRIDGE/Analytics";
import Reports from "../pages/BIOFRIDGE/Reports";
import Fridges from "../pages/BIOFRIDGE/Fridges";
import FridgeDetail from "../pages/BIOFRIDGE/FridgeDetail";
import Samples from "../pages/BIOFRIDGE/Samples";
import Projects from "../pages/BIOFRIDGE/Projects";
import Mapping from "../pages/BIOFRIDGE/Mapping";
import Inventory from "../pages/BIOFRIDGE/Inventory";
import StorageLocations from "../pages/BIOFRIDGE/StorageLocations";
import Temperature from "../pages/BIOFRIDGE/Temperature";
import Alerts from "../pages/BIOFRIDGE/Alerts";
import Movements from "../pages/BIOFRIDGE/Movements";
import Transactions from "../pages/BIOFRIDGE/Transactions";
import AuditTrail from "../pages/BIOFRIDGE/AuditTrail";
import LookupView from "../pages/BIOFRIDGE/settings/LookupView";

const staffRoles = ["admin", "staff"];

const protectedPage = (element, requiredRoles = staffRoles) => (
    <ProtectedRoute requiredPermissions={[]} requiredRoles={requiredRoles}>
        {element}
    </ProtectedRoute>
);

export const bioRoutes = (
    <>
        <Route path="/" element={protectedPage(<BioDashboard />)} />
        <Route path="/analytics" element={protectedPage(<Analytics />)} />
        <Route path="/reports" element={protectedPage(<Reports />)} />
        <Route path="/fridges" element={protectedPage(<Fridges />)} />
        <Route path="/fridges/:id" element={protectedPage(<FridgeDetail />)} />
        <Route path="/samples" element={protectedPage(<Samples />)} />
        <Route path="/projects" element={protectedPage(<Projects />)} />
        <Route path="/mapping" element={protectedPage(<Mapping />)} />
        <Route path="/inventory" element={protectedPage(<Inventory />)} />
        <Route path="/storage-locations" element={protectedPage(<StorageLocations />)} />
        <Route path="/temperature-monitoring" element={protectedPage(<Temperature />)} />
        <Route path="/alerts" element={protectedPage(<Alerts />)} />
        <Route path="/sample-movements" element={protectedPage(<Movements />)} />
        <Route path="/transactions" element={protectedPage(<Transactions />)} />
        <Route path="/audit-trail" element={protectedPage(<AuditTrail />, ["admin"])} />
        <Route path="/settings/sample-types" element={protectedPage(<LookupView lookupKey="sample-types" />, ["admin"])} />
        <Route path="/settings/sample-sources" element={protectedPage(<LookupView lookupKey="sample-sources" />, ["admin"])} />
        <Route path="/settings/sample-natures" element={protectedPage(<LookupView lookupKey="sample-natures" />, ["admin"])} />
        <Route path="/settings/sample-conditions" element={protectedPage(<LookupView lookupKey="sample-conditions" />, ["admin"])} />
        <Route path="/settings/units" element={protectedPage(<LookupView lookupKey="units" />, ["admin"])} />
        <Route path="/settings/fridge-types" element={protectedPage(<LookupView lookupKey="fridge-types" />, ["admin"])} />
        <Route path="/settings/storage-levels" element={protectedPage(<LookupView lookupKey="storage-levels" />, ["admin"])} />
        <Route path="/settings/temperature-ranges" element={protectedPage(<LookupView lookupKey="temperature-ranges" />, ["admin"])} />
    </>
);
