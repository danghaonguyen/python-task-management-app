import { Navigate } from "react-router-dom";

function ProtectRoute({ children, requiredRole }) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <Navigate to={role === "admin" ? "/admin/users" : "/tasks"} replace />
    );
  }

  return children;
}

export default ProtectRoute;
