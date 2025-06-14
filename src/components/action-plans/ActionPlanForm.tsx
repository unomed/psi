
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ActionPlan } from '@/hooks/useActionPlans';
import { useAuth } from '@/contexts/AuthContext';
import { useSectors } from '@/hooks/useSectors';
import { actionPlanSchema, ActionPlanFormData } from './schemas/actionPlanSchema';
import { BasicInfoFields } from './form-fields/BasicInfoFields';
import { CompanyAndSectorFields } from './form-fields/CompanyAndSectorFields';
import { StatusAndPriorityFields } from './form-fields/StatusAndPriorityFields';
import { DatesAndBudgetFields } from './form-fields/DatesAndBudgetFields';

interface ActionPlanFormProps {
  plan?: ActionPlan;
  onSubmit: (data: ActionPlanFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ActionPlanForm({ plan, onSubmit, onCancel, isLoading }: ActionPlanFormProps) {
  const { userRole, userCompanies } = useAuth();
  const { sectors } = useSectors();
  const shouldShowCompanySelect = userRole === 'superadmin' && userCompanies && userCompanies.length > 1;

  const form = useForm<ActionPlanFormData>({
    resolver: zodResolver(actionPlanSchema),
    defaultValues: {
      title: plan?.title || '',
      description: plan?.description || '',
      status: plan?.status || 'draft',
      priority: plan?.priority || 'medium',
      company_id: plan?.company_id || '',
      sector_id: plan?.sector_id || '',
      start_date: plan?.start_date || '',
      due_date: plan?.due_date || '',
      risk_level: plan?.risk_level || 'medium',
      budget_allocated: plan?.budget_allocated || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicInfoFields control={form.control} />
          
          <CompanyAndSectorFields
            control={form.control}
            shouldShowCompanySelect={shouldShowCompanySelect}
            userCompanies={userCompanies}
            sectors={sectors}
          />

          <StatusAndPriorityFields control={form.control} />
          
          <DatesAndBudgetFields control={form.control} />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : plan ? 'Atualizar' : 'Criar Plano'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
