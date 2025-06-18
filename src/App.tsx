
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EmployeeAuthNativeProvider } from "@/contexts/EmployeeAuthNative";
import { SimpleRoutes } from "@/components/routing/SimpleRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  console.log('[App] Portal do Funcionário - Versão Simplificada');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <EmployeeAuthNativeProvider>
          <SimpleRoutes />
        </EmployeeAuthNativeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
