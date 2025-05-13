
import { Route, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

export const AuthRoutes = () => {
  return (
    <>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      {/* Redirect /auth to login */}
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
    </>
  );
};
