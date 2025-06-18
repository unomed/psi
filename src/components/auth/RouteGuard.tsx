
import { ReactNode } from 'react';
import { useCompanyAccess } from '@/hooks/useCompanyAccess';
import { useAuth } from '@/hooks/useAuth';

interface RouteGuardProps {
  children: ReactNode;
  companyId: string;
  fallback?: ReactNode;
}

export function RouteGuard({ children, companyId, fallback }: RouteGuardProps) {
  const { user } = useAuth();
  const { hasAccess } = useCompanyAccess(companyId);

  // Show loading state while checking access
  if (!user) {
    return <div>Verificando acesso...</div>;
  }

  if (!hasAccess) {
    return fallback || <div>Acesso negado</div>;
  }

  return <>{children}</>;
}
