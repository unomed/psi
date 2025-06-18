
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmployeeLoginPage } from "@/pages/EmployeeLoginPage";
import { EmployeePortalPage } from "@/pages/EmployeePortalPage";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";

// Create a QueryClient instance for this component tree
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function SimpleRoutes() {
  const authData = useEmployeeAuthNative();
  
  console.log('[SimpleRoutes] Estado da autenticação:', {
    hasSession: !!authData.session,
    isAuthenticated: authData.session?.isAuthenticated,
    loading: authData.loading
  });

  // Loading state
  if (authData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Carregando Portal do Funcionário...</p>
        </div>
      </div>
    );
  }

  // Routes based on authentication status
  const isAuthenticated = authData.session?.isAuthenticated || false;

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<EmployeeLoginPage />} />
            <Route path="/*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/portal" element={<EmployeePortalPage />} />
            <Route path="/*" element={<Navigate to="/portal" replace />} />
          </>
        )}
      </Routes>
    </QueryClientProvider>
  );
}
