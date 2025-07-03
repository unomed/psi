import React from 'react';
import { StepenovskiNR01Report } from './StepenovskiNR01Report';

interface NR01ComplianceReportProps {
  companyId: string;
  periodStart: string;
  periodEnd: string;
  selectedSector?: string;
  selectedRole?: string;
}

export function NR01ComplianceReport({ 
  companyId, 
  periodStart, 
  periodEnd,
  selectedSector,
  selectedRole
}: NR01ComplianceReportProps) {
  return (
    <StepenovskiNR01Report
      companyId={companyId}
      periodStart={periodStart}
      periodEnd={periodEnd}
      selectedSector={selectedSector}
      selectedRole={selectedRole}
    />
  );
}