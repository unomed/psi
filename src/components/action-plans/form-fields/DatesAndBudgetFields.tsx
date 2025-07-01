
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ActionPlanFormData } from '../schemas/actionPlanSchema';

interface DatesAndBudgetFieldsProps {
  control: Control<ActionPlanFormData>;
}

export function DatesAndBudgetFields({ control }: DatesAndBudgetFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="risk_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nível de Risco</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível de risco" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="low">Baixo</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Início</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="due_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Vencimento</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="budget_allocated"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Orçamento Alocado (R$)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
