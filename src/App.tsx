import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
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
      <SimpleAuthProvider>
        <SimpleAppContent />
        <Toaster />
      </SimpleAuthProvider>
    </QueryClientProvider>
  );
}

export default App;