
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
      
      // Input validation
      if (!cpf || cpf.length < 11) {
        return { success: false, error: 'CPF inválido' };
      }
      
      if (!password || password.length < 4) {
        return { success: false, error: 'Senha inválida' };
      }
      
      // Call secure authentication function
      const { data, error } = await supabase.rpc('authenticate_employee', {
        p_cpf: cpf,
        p_password: password
      });

      if (error) {
        console.error('[EmployeeAuthNative] Erro na autenticação:', error);
        return { success: false, error: 'Erro na autenticação' };
      }

      // Type assertion for the response
      const response = data as { success: boolean; employee?: any; error?: string };
      
      if (!response || !response.success) {
        console.log('[EmployeeAuthNative] Credenciais inválidas:', response?.error);
        return { success: false, error: response?.error || 'CPF ou senha inválidos' };
      }

      const employeeData = response.employee;
      
      // Get company information
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('name')
        .eq('id', employeeData.company_id)
        .single();
      
      if (companyError || !companyData) {
        console.error('[EmployeeAuthNative] Erro ao buscar empresa:', companyError);
        return { success: false, error: 'Erro ao carregar informações da empresa' };
      }
      
      const newSession: EmployeeSession = {
        employee: {
          employeeId: employeeData.id,
          employeeName: employeeData.name,
          companyId: employeeData.company_id,
          companyName: companyData.name,
          isValid: true
        },
        isAuthenticated: true
      };

      console.log('[EmployeeAuthNative] Login bem-sucedido:', newSession);
      
      // Configurar sessão do funcionário no Supabase
      try {
        await supabase.rpc('set_employee_session', {
          employee_id_value: employeeData.id
        });
        console.log('[EmployeeAuthNative] Sessão do funcionário configurada no Supabase');
      } catch (sessionError) {
        console.error('[EmployeeAuthNative] Erro ao configurar sessão no Supabase:', sessionError);
        // Não falhar o login por causa disso, mas log o erro
      }
      
      // Store session securely (will be migrated to httpOnly cookies later)
      const sessionData = {
        ...newSession,
        timestamp: Date.now(),
        sessionToken: crypto.randomUUID() // Generate session token
      };
      
      // Save session in localStorage (temporary - will be moved to secure cookies)
      try {
        localStorage.setItem('employee-session', JSON.stringify(sessionData));
        localStorage.setItem('current_employee_id', employeeData.id);
      } catch (storageError) {
        console.error('[EmployeeAuthNative] Erro ao armazenar sessão:', storageError);
        // Continue without throwing - session will work but won't persist
      }
      
      setSession(newSession);

      // Log successful login (removing for now until function is available in types)
      console.log('[EmployeeAuthNative] Login bem-sucedido registrado:', employeeData.id);

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
