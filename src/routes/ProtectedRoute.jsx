
import { Navigate, Outlet } from "react-router-dom";
import AccessDenied from "../pages/errors/AccessDenied";

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const isAuthenticated = !!localStorage.getItem("refreshToken");
    const user = JSON.parse(localStorage.getItem("dentalcare_user") || null);
    const role     = user?.role?.toLowerCase();
    // Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check user role
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/access-denied" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
