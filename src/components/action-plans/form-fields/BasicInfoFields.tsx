
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
import { Textarea } from '@/components/ui/textarea';
import { ActionPlanFormData } from '../schemas/actionPlanSchema';

interface BasicInfoFieldsProps {
  control: Control<ActionPlanFormData>;
}

export function BasicInfoFields({ control }: BasicInfoFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Título do Plano</FormLabel>
            <FormControl>
              <Input placeholder="Digite o título do plano de ação" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o objetivo e escopo do plano de ação" 
                {...field} 
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
