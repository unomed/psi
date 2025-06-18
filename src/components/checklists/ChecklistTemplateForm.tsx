
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChecklistTemplate } from '@/types/checklist';

const formSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().optional(),
})

interface ChecklistTemplateFormProps {
  template?: ChecklistTemplate;
  onCancel?: () => void;
}

export function ChecklistTemplateForm({ template, onCancel }: ChecklistTemplateFormProps) {
  const [isNewTemplate, setIsNewTemplate] = useState(!template);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: template?.title || "",
      description: template?.description || "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const payload = {
        title: values.title,
        description: values.description,
        type: 'psicossocial' as const,
        scale_type: 'likert5' as const,
        company_id: user.user_metadata?.companyId,
        created_by: user.id,
      };

      let result;

      if (isNewTemplate) {
        result = await supabase
          .from('checklist_templates')
          .insert([payload]);
      } else {
        result = await supabase
          .from('checklist_templates')
          .update(payload)
          .eq('id', template?.id);
      }

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      toast.success(`Template ${isNewTemplate ? 'criado' : 'atualizado'} com sucesso!`);
      navigate('/checklists');
    },
    onError: (error: any) => {
      toast.error(`Erro ao ${isNewTemplate ? 'criar' : 'atualizar'} template: ${error.message}`);
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Avaliação de Desempenho" {...field} />
              </FormControl>
              <FormDescription>
                Este é o título que seus funcionários verão.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Uma breve descrição sobre o template."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Adicione uma descrição para ajudar a identificar este template.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  )
}
