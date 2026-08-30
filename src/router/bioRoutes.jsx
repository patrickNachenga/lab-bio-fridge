import { Route } from "react-router-dom";
import ProtectedRoute from "../components/wrapper/ProtectedRoute";
import BioDashboard from "../pages/BIOFRIDGE/dashboard/View";
import Analytics from "../pages/BIOFRIDGE/analytics/View";
import Reports from "../pages/BIOFRIDGE/reports/View";
import Fridges from "../pages/BIOFRIDGE/fridges/View";
import FridgeDetail from "../pages/BIOFRIDGE/fridges/Details";
import Samples from "../pages/BIOFRIDGE/samples/View";
import Projects from "../pages/BIOFRIDGE/projects/View";
import Mapping from "../pages/BIOFRIDGE/mapping/View";
import Inventory from "../pages/BIOFRIDGE/inventory/View";
import StorageLocations from "../pages/BIOFRIDGE/storage-locations/View";
import Temperature from "../pages/BIOFRIDGE/temperature/View";
import Alerts from "../pages/BIOFRIDGE/alerts/View";
import Movements from "../pages/BIOFRIDGE/movements/View";
import Transactions from "../pages/BIOFRIDGE/transactions/View";
import AuditTrail from "../pages/BIOFRIDGE/audit-trail/View";
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
