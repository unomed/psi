
import React, { useState } from 'react';
import { useNR01ActionPlans, NR01ActionPlan } from '@/hooks/action-plans/useNR01ActionPlans';
import { usePsychosocialRiskData } from '@/hooks/action-plans/usePsychosocialRiskData';
import { useSectors } from '@/hooks/sectors/useSectors';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from 'react-day-picker';
import { NR01RiskStatistics } from './nr01/NR01RiskStatistics';
import { NR01FiltersSection } from './nr01/NR01FiltersSection';
import { NR01ActionPlansList } from './nr01/NR01ActionPlansList';

interface NR01ActionPlansFilterProps {
  onPlanSelect?: (plan: NR01ActionPlan) => void;
}

export function NR01ActionPlansFilter({ onPlanSelect }: NR01ActionPlansFilterProps) {
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined;
  
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    sector: 'all',
    status: 'all',
    dateRange: undefined as DateRange | undefined
  });

  const { actionPlans, isLoading } = useNR01ActionPlans(filters);
  const { riskStats, isLoading: isLoadingStats } = usePsychosocialRiskData();
  const { sectors } = useSectors({ companyId });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      riskLevel: 'all',
      sector: 'all',
      status: 'all',
      dateRange: undefined
    });
  };

  if (isLoading || isLoadingStats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const activePlansCount = actionPlans.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6">
      <NR01RiskStatistics 
        riskStats={riskStats} 
        activePlansCount={activePlansCount} 
      />
      
      <NR01FiltersSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        riskStats={riskStats}
        sectors={sectors}
        resultCount={actionPlans.length}
      />

      <NR01ActionPlansList 
        actionPlans={actionPlans}
        onPlanSelect={onPlanSelect}
      />
    </div>
  );
}
