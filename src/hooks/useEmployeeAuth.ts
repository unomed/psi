
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
      console.log(`[useEmployeeAuth] Configurando sessão para funcionário: ${employeeId}`);
      
      // Usar a nova função corrigida
      await supabase.rpc('set_employee_session', {
        employee_id_value: employeeId
      });
      
      // Verificar se a configuração foi aplicada
      const { data: currentSetting } = await supabase
        .from('employees') // Usar uma query simples para testar a sessão
        .select('id')
        .eq('id', employeeId)
        .single();
      
      if (currentSetting) {
        console.log(`[useEmployeeAuth] Sessão configurada com sucesso para: ${employeeId}`);
      } else {
        console.warn(`[useEmployeeAuth] Falha ao verificar configuração de sessão`);
      }
    } catch (error) {
      console.error('Erro ao configurar sessão do funcionário:', error);
    }
  };

  const login = async (cpf: string, password: string) => {
    try {
      setLoading(true);
      
      console.log(`[useEmployeeAuth] Tentativa de login para CPF: ${cpf.substring(0, 3)}***`);
      
      const { data, error } = await supabase.rpc('authenticate_employee', {
        p_cpf: cpf,
        p_password: password
      });

      if (error) {
        console.error('[useEmployeeAuth] Erro na autenticação:', error);
        throw error;
      }

      const authData = data[0];
      
      if (!authData?.is_valid) {
        console.log('[useEmployeeAuth] Credenciais inválidas');
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

      console.log(`[useEmployeeAuth] Login bem-sucedido para: ${authData.employee_name}`);
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
      console.log('[useEmployeeAuth] Fazendo logout do funcionário');
      
      // Limpar o setting da sessão
      await supabase.rpc('set_employee_session', {
        employee_id_value: ''
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
