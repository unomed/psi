
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { OptimizedAuthProvider } from "@/contexts/OptimizedAuthContext";
import { SimpleAppContent } from "@/components/routing/SimpleAppContent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  console.log('[App] Portal do Funcionário - Sistema Principal');
  
  return (
    <QueryClientProvider client={queryClient}>
      <OptimizedAuthProvider>
        <SimpleAppContent />
        <Toaster />
      </OptimizedAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
