
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Import the AppRole type to ensure consistency
type AppRole = 'superadmin' | 'admin' | 'evaluator';

interface CompanyAccess {
  companyId: string;
  companyName: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role?: AppRole, companyId?: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  userRole: string | null;
  userCompanies: CompanyAccess[];
  hasRole: (role: AppRole) => Promise<boolean>;
  hasCompanyAccess: (companyId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userCompanies, setUserCompanies] = useState<CompanyAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);
  const navigate = useNavigate();

  // Function to check if user has a specific role
  const hasRole = async (role: AppRole): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: role });
        
      if (error) {
        console.error('Error checking role:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  };

  // Function to check if user has access to a specific company
  const hasCompanyAccess = async (companyId: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Superadmins have access to all companies
      const isSuperadmin = await hasRole('superadmin');
      if (isSuperadmin) return true;
      
      // For non-superadmins, check company_users table
      return userCompanies.some(company => company.companyId === companyId);
    } catch (error) {
      console.error('Error checking company access:', error);
      return false;
    }
  };

  // Fetch user role and companies they have access to
  const fetchUserRoleAndCompanies = async (userId: string) => {
    try {
      console.log("Fetching user role and companies for:", userId);
      setRoleLoading(true);
      
      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Error fetching user role:', roleError);
        setUserRole('user');
      } else if (roleData) {
        console.log("User role data:", roleData);
        setUserRole(roleData.role);
      } else {
        setUserRole('user');
      }
      
      // For non-superadmins, fetch companies they have access to
      if (roleData?.role !== 'superadmin') {
        const { data: companies, error: companiesError } = await supabase
          .from('company_users')
          .select(`
            company_id,
            companies:company_id (name)
          `)
          .eq('user_id', userId);
        
        if (companiesError) {
          console.error('Error fetching user companies:', companiesError);
        } else if (companies) {
          const formattedCompanies = companies.map(item => ({
            companyId: item.company_id,
            companyName: item.companies?.name || 'Unknown Company'
          }));
          setUserCompanies(formattedCompanies);
        }
      } else {
        // Superadmins need to fetch all companies
        const { data: allCompanies, error: allCompaniesError } = await supabase
          .from('companies')
          .select('id, name');
          
        if (allCompaniesError) {
          console.error('Error fetching all companies:', allCompaniesError);
        } else if (allCompanies) {
          const formattedCompanies = allCompanies.map(company => ({
            companyId: company.id,
            companyName: company.name
          }));
          setUserCompanies(formattedCompanies);
        }
      }
    } catch (error) {
      console.error('Error fetching user role and companies:', error);
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change:", event);
        
        if (!mounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          if (mounted) {
            // Use setTimeout to avoid nested calls to Supabase API
            setTimeout(() => {
              if (mounted) {
                fetchUserRoleAndCompanies(currentSession.user.id);
              }
            }, 0);
          }
        } else {
          if (mounted) {
            setUserRole(null);
            setUserCompanies([]);
          }
        }
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Login realizado com sucesso",
            description: "Bem-vindo de volta!"
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logout realizado com sucesso",
            description: "Até breve!"
          });
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log("Session check result:", !!currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserRoleAndCompanies(currentSession.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Consider the app as loading if we're fetching the user role
  const isLoading = loading || roleLoading;

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role?: AppRole, companyId?: string) => {
    try {
      setLoading(true);
      
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      // If role is specified, assign it to the user
      if (authData.user && role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: role
          });
          
        if (roleError) {
          console.error("Error assigning role:", roleError);
          // Don't throw here, continue with the process
        }
        
        // If company_id is provided and the role is not superadmin,
        // create entry in company_users table
        if (companyId && role !== 'superadmin') {
          const { error: companyError } = await supabase
            .from('company_users')
            .insert({
              user_id: authData.user.id,
              company_id: companyId
            });
            
          if (companyError) {
            console.error("Error assigning company:", companyError);
            // Don't throw here, continue with the process
          }
        }
      }
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "O usuário já pode fazer login com suas credenciais"
      });
      
      // For admin user creation, don't navigate away
      if (!role) {
        navigate('/auth/login');
      }
      
      return authData.user;
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Verifique os dados informados e tente novamente",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth/login');
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      signIn, 
      signUp, 
      signOut, 
      loading: isLoading, 
      userRole,
      userCompanies,
      hasRole,
      hasCompanyAccess
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
