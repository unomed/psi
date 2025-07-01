
import React from "react";
import { EmployeeModernDashboard } from "@/components/employee/modern/EmployeeModernDashboard";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";

export function EmployeePortalPage() {
  const { session } = useEmployeeAuthNative();

  console.log('[EmployeePortalPage] Renderizando portal para:', session?.employee?.employeeName);

  if (!session?.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Acesso não autorizado</p>
        </div>
      </div>
    );
  }

  return (
    <EmployeeModernDashboard 
      assessmentToken={null}
      templateId={undefined}
      assessmentId={undefined}
      expectedEmployeeId={session.employee.employeeId}
    />
  );
}
