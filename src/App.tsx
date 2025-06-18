
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  console.log('[App] Sistema Principal - Iniciando aplicação');
  
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleAppContent />
    </QueryClientProvider>
  );
}

export default App;
