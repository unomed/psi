import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";

export default function Perfil() {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string;
    email: string | undefined;
    role: string | null;
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Get user email
        const { data: emailData, error: emailError } = await supabase
          .rpc('get_user_emails', { user_ids: [user.id] });
          
        if (emailError) throw emailError;
        
        setProfile({
          id: profileData.id,
          full_name: profileData.full_name || '',
          email: emailData[0]?.email,
          role: userRole
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [user, userRole]);
  
  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!profile || !user) return;
    
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) {
    return <ProfileSkeleton />;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <ProfileInfo profile={profile} />
          <PasswordChangeForm />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Editar Informações</CardTitle>
            <CardDescription>
              Atualize seus dados pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  value={profile?.full_name || ''}
                  onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : prev)}
                  placeholder="Seu nome completo" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={profile?.email || ''}
                  disabled
                  readOnly
                />
                <p className="text-sm text-muted-foreground">
                  O email não pode ser alterado
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Perfil de Acesso</Label>
                <Input 
                  id="role" 
                  value={profile?.role === 'superadmin' ? 'Administrador Master' : 
                         profile?.role === 'admin' ? 'Administrador' : 
                         profile?.role === 'evaluator' ? 'Avaliador' : 'Usuário'}
                  disabled
                  readOnly
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={updating}>
                {updating ? "Atualizando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
