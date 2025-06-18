
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppContent } from "@/components/routing/AppContent";

// QueryClient configuração
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('[App] Sistema Principal - Iniciando aplicação');
  
  // Ensure React is available before rendering
  if (typeof React === 'undefined') {
    console.error('[App] React not available');
    return null;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
