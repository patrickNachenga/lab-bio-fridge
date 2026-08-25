import { Route, Routes } from "react-router-dom";
import { ErrorPage } from "../pages/misc/ErrorPage";
import { Services } from "../pages/Services";
import ProtectedRoute from "../components/wrapper/ProtectedRoute";

// Import orphanage routes
import { orphanageRoutes } from "./orphanageRoutes";

// Import auth routes
import { authRoutes } from "./authRoutes";
import { MaintenancePage } from "../pages/misc/MaintenancePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home & Services */}
      <Route path="/" element={<Services />} />

      {/* Auth Routes */}
      {authRoutes}

      {/* Orphanage Management Routes */}
      {orphanageRoutes}


      {/* Catch-all 404 */}
      <Route path="*" element={<MaintenancePage />} />
    </Routes>
  );
};

export default AppRoutes;
