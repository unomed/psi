
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthRoutes } from "./AuthRoutes";
import { MainRoutes } from "./MainRoutes";
import { SettingsRoutes } from "./SettingsRoutes";
import NotFound from "@/pages/NotFound";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Home route redirects to login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      
      {/* Auth routes */}
      <AuthRoutes />
      
      {/* Main application routes */}
      <MainRoutes />
      
      {/* Settings routes */}
      <SettingsRoutes />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
