import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
import AccessDenied from "./AccessDenied";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, token } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
