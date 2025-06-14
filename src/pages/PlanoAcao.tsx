
import React, { useState } from "react";
import { ActionPlanHeader } from "@/components/action-plan/ActionPlanHeader";
import { ActionPlanFilters } from "@/components/action-plan/ActionPlanFilters";
import { ActionPlanTable } from "@/components/action-plan/ActionPlanTable";
import { NewActionForm } from "@/components/action-plan/NewActionForm";
import { ActionFilters } from "@/types/actionPlan";
import { mockActions } from "@/data/mockActionData";

export default function PlanoAcao() {
  const [selectedTab, setSelectedTab] = useState("pendentes");
  const [selectedFilters, setSelectedFilters] = useState<ActionFilters>({
    department: "all",
    responsibles: "all",
    priority: "all"
  });

  return (
    <div className="space-y-6">
      <ActionPlanHeader />
      
      <ActionPlanFilters 
        filters={selectedFilters}
        onFiltersChange={setSelectedFilters}
      />

      <ActionPlanTable 
        actions={mockActions}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      <NewActionForm />
    </div>
  );
}
