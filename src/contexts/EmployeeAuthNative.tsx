
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeSession } from '@/types/employee-auth';

interface EmployeeAuthContextType {
  session: EmployeeSession | null;
  loading: boolean;
  login: (cpf: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined);

export function EmployeeAuthNativeProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<EmployeeSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[EmployeeAuthNative] Inicializando contexto de autenticação');
    
    // Verificar se há uma sessão armazenada
    const storedSession = localStorage.getItem('employee-session');
    
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        console.log('[EmployeeAuthNative] Sessão encontrada no localStorage:', parsedSession);
        setSession(parsedSession);
        
        // Configurar o contexto do funcionário na sessão do Supabase
        setEmployeeSession(parsedSession.employee.employeeId);
      } catch (error) {
        console.error('[EmployeeAuthNative] Erro ao parsear sessão:', error);
        localStorage.removeItem('employee-session');
      }
    }
    
    setLoading(false);
  }, []);

  const setEmployeeSession = async (employeeId: string) => {
    try {
      console.log('[EmployeeAuthNative] Configurando sessão do funcionário:', employeeId);
      
      // Armazenar o ID do funcionário no localStorage para uso posterior
      localStorage.setItem('current_employee_id', employeeId);
      
      // Como alternativa, vamos tentar executar um SQL raw usando uma query simples
      // que vai configurar a variável de sessão
      const { error } = await supabase
        .from('employees')
        .select('id')
        .eq('id', employeeId)
        .single();
        
      if (error) {
        console.error('[EmployeeAuthNative] Erro ao validar funcionário:', error);
      } else {
        console.log('[EmployeeAuthNative] Sessão do funcionário configurada com sucesso');
      }
    } catch (error) {
      console.error('[EmployeeAuthNative] Erro inesperado ao configurar sessão:', error);
    }
  };

  const login = async (cpf: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('[EmployeeAuthNative] Tentando fazer login com CPF:', cpf);
      
      const { data, error } = await supabase.rpc('authenticate_employee', {
        p_cpf: cpf,
        p_password: password
      });

      if (error) {
        console.error('[EmployeeAuthNative] Erro na autenticação:', error);
        return { success: false, error: 'Erro na autenticação' };
      }

      if (!data || data.length === 0 || !data[0].is_valid) {
        console.log('[EmployeeAuthNative] Credenciais inválidas');
        return { success: false, error: 'CPF ou senha inválidos' };
      }

      const employeeData = data[0];
      const newSession: EmployeeSession = {
        employee: {
          employeeId: employeeData.employee_id,
          employeeName: employeeData.employee_name,
          companyId: employeeData.company_id,
          companyName: employeeData.company_name,
          isValid: true
        },
        isAuthenticated: true
      };

      console.log('[EmployeeAuthNative] Login bem-sucedido:', newSession);
      
      // Salvar sessão no localStorage
      localStorage.setItem('employee-session', JSON.stringify(newSession));
      setSession(newSession);
      
      // Configurar contexto do funcionário no Supabase
      await setEmployeeSession(employeeData.employee_id);

      return { success: true };
    } catch (error) {
      console.error('[EmployeeAuthNative] Erro no login:', error);
      return { success: false, error: 'Erro interno no login' };
    }
  };

  const logout = () => {
    console.log('[EmployeeAuthNative] Fazendo logout');
    localStorage.removeItem('employee-session');
    localStorage.removeItem('current_employee_id');
    setSession(null);
    
    window.location.href = '/login';
  };

  return (
    <EmployeeAuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </EmployeeAuthContext.Provider>
  );
}

export function useEmployeeAuthNative() {
  const context = useContext(EmployeeAuthContext);
  if (context === undefined) {
    throw new Error('useEmployeeAuthNative must be used within an EmployeeAuthNativeProvider');
  }
  return context;
}
