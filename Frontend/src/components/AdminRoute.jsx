import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

export const AdminRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
