
import React, { Component, createContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeAuth, EmployeeSession } from '@/types/employee-auth';

interface EmployeeAuthContextType {
  session: EmployeeSession | null;
  login: (cpf: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | null>(null);

interface EmployeeAuthState {
  session: EmployeeSession | null;
  loading: boolean;
}

export class EmployeeAuthNativeProvider extends Component<
  { children: ReactNode },
  EmployeeAuthState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    
    this.state = {
      session: null,
      loading: true
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.loadStoredSession = this.loadStoredSession.bind(this);
    this.configureEmployeeSession = this.configureEmployeeSession.bind(this);
  }

  componentDidMount() {
    console.log('[EmployeeAuthNative] Inicializando provider');
    this.loadStoredSession();
  }

  loadStoredSession() {
    try {
      const savedSession = localStorage.getItem('employee-session');
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        console.log('[EmployeeAuthNative] Sessão encontrada no localStorage');
        this.setState({ 
          session: parsedSession, 
          loading: false 
        });
        
        setTimeout(() => {
          this.configureEmployeeSession(parsedSession.employee.employeeId);
        }, 100);
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error('[EmployeeAuthNative] Erro ao recuperar sessão:', error);
      localStorage.removeItem('employee-session');
      this.setState({ loading: false });
    }
  }

  async configureEmployeeSession(employeeId: string) {
    try {
      console.log(`[EmployeeAuthNative] Configurando sessão para funcionário: ${employeeId}`);
      
      await supabase.rpc('set_employee_session', {
        employee_id_value: employeeId
      });
      
      console.log(`[EmployeeAuthNative] Sessão configurada com sucesso`);
    } catch (error) {
      console.error('[EmployeeAuthNative] Erro ao configurar sessão:', error);
    }
  }

  async login(cpf: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.setState({ loading: true });
      
      console.log(`[EmployeeAuthNative] Tentativa de login para CPF: ${cpf.substring(0, 3)}***`);
      
      const { data, error } = await supabase.rpc('authenticate_employee', {
        p_cpf: cpf,
        p_password: password
      });

      if (error) {
        console.error('[EmployeeAuthNative] Erro na autenticação:', error);
        throw error;
      }

      const authData = data[0];
      
      if (!authData?.is_valid) {
        console.log('[EmployeeAuthNative] Credenciais inválidas');
        this.setState({ loading: false });
        return { success: false, error: 'CPF ou senha inválidos' };
      }

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

      this.setState({ 
        session: newSession, 
        loading: false 
      });
      
      localStorage.setItem('employee-session', JSON.stringify(newSession));
      await this.configureEmployeeSession(authData.employee_id);

      console.log(`[EmployeeAuthNative] Login bem-sucedido para: ${authData.employee_name}`);
      return { success: true };
    } catch (error: any) {
      console.error('[EmployeeAuthNative] Erro no login:', error);
      this.setState({ loading: false });
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  async logout() {
    try {
      console.log('[EmployeeAuthNative] Fazendo logout do funcionário');
      
      await supabase.rpc('set_employee_session', {
        employee_id_value: ''
      });
    } catch (error) {
      console.error('[EmployeeAuthNative] Erro ao limpar sessão:', error);
    }
    
    this.setState({ session: null });
    localStorage.removeItem('employee-session');
  }

  render() {
    const contextValue: EmployeeAuthContextType = {
      session: this.state.session,
      login: this.login,
      logout: this.logout,
      loading: this.state.loading
    };

    return (
      <EmployeeAuthContext.Provider value={contextValue}>
        {this.props.children}
      </EmployeeAuthContext.Provider>
    );
  }
}

// Hook seguro que não depende de React.useContext
export function useEmployeeAuthNative(): EmployeeAuthContextType {
  // Safety check for React availability
  if (typeof React === 'undefined' || !React.useContext) {
    console.warn('[useEmployeeAuthNative] React não disponível, retornando valores padrão');
    return {
      session: null,
      login: async () => ({ success: false, error: 'Sistema indisponível' }),
      logout: () => {},
      loading: false
    };
  }

  const context = React.useContext(EmployeeAuthContext);
  
  if (!context) {
    console.warn('[useEmployeeAuthNative] Contexto não encontrado, retornando valores padrão');
    return {
      session: null,
      login: async () => ({ success: false, error: 'Sistema indisponível' }),
      logout: () => {},
      loading: false
    };
  }
  
  return context;
}

export { EmployeeAuthContext };
