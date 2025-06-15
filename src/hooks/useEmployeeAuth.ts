
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
        // Configurar a sessão no Supabase para RLS
        configureEmployeeSession(parsedSession.employee.employeeId);
      } catch (error) {
        console.error('Erro ao recuperar sessão do funcionário:', error);
        localStorage.removeItem('employee-session');
      }
    }
    setLoading(false);
  }, []);

  const configureEmployeeSession = async (employeeId: string) => {
    try {
      // Configurar o setting para a sessão atual do funcionário
      await (supabase.rpc as any)('set_config', {
        setting_name: 'app.current_employee_id',
        setting_value: employeeId,
        is_local: false
      });
      console.log(`[EmployeeAuth] Sessão configurada para funcionário: ${employeeId}`);
    } catch (error) {
      console.error('Erro ao configurar sessão do funcionário:', error);
    }
  };

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

      const authData = data[0];
      
      if (!authData?.is_valid) {
        return { success: false, error: 'CPF ou senha inválidos' };
      }

      // Mapear os dados do banco para o tipo EmployeeAuth
      const employee: EmployeeAuth = {
        employeeId: authData.employee_id,
        employeeName: authData.employee_name,
        companyId: authData.company_id,
        companyName: authData.company_name,
        isValid: authData.is_valid
      };

      const newSession: EmployeeSession = {
        employee,
        isAuthenticated: true
      };

      setSession(newSession);
      localStorage.setItem('employee-session', JSON.stringify(newSession));

      // Configurar a sessão no Supabase para RLS
      await configureEmployeeSession(authData.employee_id);

      return { success: true };
    } catch (error: any) {
      console.error('Erro no login do funcionário:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Limpar o setting da sessão
      await (supabase.rpc as any)('set_config', {
        setting_name: 'app.current_employee_id',
        setting_value: '',
        is_local: false
      });
    } catch (error) {
      console.error('Erro ao limpar sessão do funcionário:', error);
    }
    
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
