
import { useAuth } from '@/contexts/AuthContext';

// Hook simplificado que apenas expõe as ações do contexto
export function useAuthActions() {
  const { signIn, signUp, signOut } = useAuth();
  
  return { signIn, signUp, signOut };
}
