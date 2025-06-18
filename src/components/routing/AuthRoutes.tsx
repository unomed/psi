
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import EmployeeLogin from "@/pages/auth/EmployeeLogin";
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary";

export const AuthRoutes = () => {
  return (
    <AuthErrorBoundary>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employee" element={<EmployeeLogin />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthErrorBoundary>
  );
};
