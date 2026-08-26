import { Route, Routes } from "react-router-dom";

// Import orphanage routes
import { orphanageRoutes } from "./orphanageRoutes";

// Import auth routes
import { authRoutes } from "./authRoutes";
import { MaintenancePage } from "../pages/misc/MaintenancePage";
import { bioRoutes } from "./bioRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* BIOFRIDGE routes */}
      {bioRoutes}

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
