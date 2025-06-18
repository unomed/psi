
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { EmployeeLoginPage } from "@/pages/EmployeeLoginPage";
import { EmployeePortalPage } from "@/pages/EmployeePortalPage";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";

export function SimpleRoutes() {
  const { session, loading } = useEmployeeAuthNative();

  console.log('[SimpleRoutes] Estado:', {
    hasSession: !!session,
    isAuthenticated: session?.isAuthenticated,
    loading
  });

  // Loading simples
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Carregando Portal do Funcionário...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Se não está autenticado, mostrar login */}
      {!session?.isAuthenticated ? (
        <>
          <Route path="/login" element={<EmployeeLoginPage />} />
          <Route path="/auth/employee" element={<EmployeeLoginPage />} />
          <Route path="/*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <>
          {/* Se está autenticado, mostrar portal */}
          <Route path="/portal" element={<EmployeePortalPage />} />
          <Route path="/*" element={<Navigate to="/portal" replace />} />
        </>
      )}
    </Routes>
  );
}
