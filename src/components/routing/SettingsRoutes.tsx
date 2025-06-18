
import { Routes, Route, Navigate } from "react-router-dom";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import PermissionsPage from "@/pages/configuracoes/PermissionsPage";
import UserManagementPage from "@/pages/configuracoes/UserManagementPage";

export function SettingsRoutes() {
  console.log('[SettingsRoutes] Renderizando rotas de configuração');
  
  return (
    <Routes>
      {/* Rota padrão redireciona para critérios */}
      <Route path="/" element={<Navigate to="/configuracoes/criterios-avaliacao" replace />} />
      
      {/* Gerenciamento de Usuários - Admin e Superadmin */}
      <Route 
        path="/usuarios" 
        element={
          <PermissionGuard requiredPermission="manage_users">
            <UserManagementPage />
          </PermissionGuard>
        } 
      />
      
      {/* Permissões - Apenas Superadmin */}
      <Route 
        path="/permissoes" 
        element={
          <PermissionGuard requiredPermission="manage_permissions">
            <PermissionsPage />
          </PermissionGuard>
        } 
      />
      
      {/* Outras rotas de configuração podem ser adicionadas aqui */}
      <Route path="/criterios-avaliacao" element={<div>Critérios de Avaliação</div>} />
      <Route path="/periodicidade" element={<div>Periodicidade</div>} />
      <Route path="/servidor-email" element={<div>Servidor de Email</div>} />
      <Route path="/templates-email" element={<div>Templates de Email</div>} />
      <Route path="/notificacoes" element={<div>Notificações</div>} />
      <Route path="/automacao-psicossocial" element={<div>Automação Psicossocial</div>} />
      <Route path="/automacao-avancada" element={<div>Automação Avançada</div>} />
      <Route path="/auditoria" element={<div>Auditoria</div>} />
      
      {/* Fallback para rotas não encontradas */}
      <Route path="*" element={<Navigate to="/configuracoes/criterios-avaliacao" replace />} />
    </Routes>
  );
}
