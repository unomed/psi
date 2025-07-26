import React from 'react';
import { User, Settings, Lock, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function UserAvatar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleEditProfile = () => {
    console.log('Navegando para /perfil');
    navigate('/perfil');
  };

  const handleChangePassword = () => {
    console.log('Navegando para /perfil/alterar-senha');
    navigate('/perfil/alterar-senha');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/auth');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  // Obter iniciais do nome do usuário
  const getInitials = (email?: string) => {
    if (!email) return 'U';
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-accent transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(user?.email)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col space-y-1">
          <span className="text-sm font-medium">
            {user?.email?.split('@')[0] || 'Usuário'}
          </span>
          <span className="text-xs text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleEditProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Editar Perfil
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleChangePassword} className="cursor-pointer">
          <Lock className="mr-2 h-4 w-4" />
          Alterar Senha
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}