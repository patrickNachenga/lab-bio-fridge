import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LinearIndeterminate from "../../LinearIndeterminate";
import { jwtDecode } from "jwt-decode";
import { normalizeUserRoles } from "../../utils/permissions";
import { clearAuthState, refreshAuthSession } from "../../features/auth/authSession";

function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = [],
}) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.userReducer);
  const user = authState?.data;
  const accessToken = authState?.access_token || localStorage.getItem("accessToken");
  const refreshToken = authState?.refresh_token || localStorage.getItem("refreshToken");
  const isAuthenticated = Boolean(user && accessToken);

  useEffect(() => {
    checkAuth();
  }, [accessToken, dispatch]);

  const checkAuth = async () => {
    try {
      if (!accessToken) {
        throw new Error("No token found");
      }

      const decoded = jwtDecode(accessToken);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        const refreshed = await refreshAuthSession(dispatch, refreshToken, user);
        if (!refreshed) {
          throw new Error("Token refresh failed");
        }
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error("Authorization error:", error);
      setIsAuthorized(false);
      clearAuthState(dispatch);
    }
  };

  // Show loader while determining
  if (isAuthorized === null) {
    return <LinearIndeterminate />;
  }

  const isAuthPath = location.pathname.includes("auth");

  // Not logged in and not on auth page
  if (!isAuthorized && !isAuthPath) {
    return <Navigate to="/auth/login" />;
  }

  // During/after logout, redux user can be cleared before route settles.
  // Redirect silently to login instead of showing "Access Denied" popup.
  if ((isAuthorized || isAuthenticated) && !user && !isAuthPath) {
    return <Navigate to="/auth/login" replace />;
  }

  // Logged in but navigating to auth page
  if (isAuthorized && isAuthPath) {
    return <Navigate to="/" />;
  }

  // ✅ If user is logged in, now check permissions and roles
  const userPermissions = user?.user_permissions || [];
  const userRolesNorm = normalizeUserRoles(user?.groups || []);
  const permLower = new Set(userPermissions.map((p) => String(p).toLowerCase()));

  const hasRequiredPermissions =
    !requiredPermissions.length ||
    requiredPermissions.some((perm) =>
      permLower.has(String(perm).toLowerCase())
    );

  const roleLower = new Set(userRolesNorm.map((r) => r.toLowerCase()));
  const hasRequiredRoles =
    !requiredRoles.length ||
    requiredRoles.some((role) => roleLower.has(String(role).toLowerCase()));

  if (!hasRequiredPermissions || !hasRequiredRoles) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
