import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { EmployeeAssessmentForm } from "@/components/employee/assessment/EmployeeAssessmentForm";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";
import { EmployeeModernDashboard } from "@/components/employee/modern/EmployeeModernDashboard";

export function EmployeeAssessmentPage() {
  const { assessmentId } = useParams();
  const { session } = useEmployeeAuthNative();

  if (!session?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Usando o EmployeeModernDashboard como layout para manter o menu lateral
  // Passando o assessmentId para que o dashboard saiba qual aba mostrar
  return (
    <EmployeeModernDashboard 
      assessmentId={assessmentId} 
      expectedEmployeeId={session.employee.employeeId} 
    />
  );
}
