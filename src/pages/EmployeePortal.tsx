
import { EmployeeAuthProvider, useEmployeeAuth } from '@/contexts/EmployeeAuthContext';
import { EmployeeLoginForm } from '@/components/employee/EmployeeLoginForm';
import { EmployeeDashboard } from '@/components/employee/EmployeeDashboard';
import { LoadingSpinner } from '@/components/auth/LoadingSpinner';

function EmployeePortalContent() {
  const { session, loading } = useEmployeeAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session?.isAuthenticated) {
    return <EmployeeLoginForm />;
  }

  return <EmployeeDashboard />;
}

export default function EmployeePortal() {
  return (
    <EmployeeAuthProvider>
      <EmployeePortalContent />
    </EmployeeAuthProvider>
  );
}
