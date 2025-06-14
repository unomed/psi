
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeAuth, EmployeeSession } from '@/types/employee-auth';

interface EmployeeAuthContextType {
  session: EmployeeSession | null;
  login: (cpf: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined);

export function useEmployeeAuth() {
  const context = useContext(EmployeeAuthContext);
  if (!context) {
    throw new Error('useEmployeeAuth must be used within EmployeeAuthProvider');
  }
  return context;
}

export function useEmployeeAuthProvider() {
  const [session, setSession] = useState<EmployeeSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há sessão salva no localStorage
    const savedSession = localStorage.getItem('employee-session');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        setSession(parsedSession);
      } catch (error) {
        console.error('Erro ao recuperar sessão do funcionário:', error);
        localStorage.removeItem('employee-session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (cpf: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('authenticate_employee', {
        p_cpf: cpf,
        p_password: password
      });

      if (error) {
        throw error;
      }

      const authData = data[0] as EmployeeAuth;
      
      if (!authData?.isValid) {
        return { success: false, error: 'CPF ou senha inválidos' };
      }

      const newSession: EmployeeSession = {
        employee: authData,
        isAuthenticated: true
      };

      setSession(newSession);
      localStorage.setItem('employee-session', JSON.stringify(newSession));

      // Definir CPF na sessão para RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.current_employee_cpf',
        setting_value: cpf,
        is_local: false
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erro no login do funcionário:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('employee-session');
  };

  return {
    session,
    login,
    logout,
    loading
  };
}

export { EmployeeAuthContext };
