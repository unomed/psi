
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import EmployeeLogin from "@/pages/auth/EmployeeLogin";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/employee" element={<EmployeeLogin />} />
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};
