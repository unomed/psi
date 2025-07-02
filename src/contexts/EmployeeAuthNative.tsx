
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
      } catch (error) {
        console.error('[EmployeeAuthNative] Erro ao parsear sessão:', error);
        localStorage.removeItem('employee-session');
      }
    }
    
    setLoading(false);
  }, []);

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
      
      // Configurar sessão do funcionário no Supabase
      try {
        await supabase.rpc('set_employee_session', {
          employee_id_value: employeeData.employee_id
        });
        console.log('[EmployeeAuthNative] Sessão do funcionário configurada no Supabase');
      } catch (sessionError) {
        console.error('[EmployeeAuthNative] Erro ao configurar sessão no Supabase:', sessionError);
        // Não falhar o login por causa disso, mas log o erro
      }
      
      // Salvar sessão no localStorage
      localStorage.setItem('employee-session', JSON.stringify(newSession));
      localStorage.setItem('current_employee_id', employeeData.employee_id);
      setSession(newSession);

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
