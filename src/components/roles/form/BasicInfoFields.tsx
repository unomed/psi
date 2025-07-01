
import * as React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { RoleFormValues } from "../RoleForm";
import { cn } from "@/lib/utils";

interface BasicInfoFieldsProps {
  form: UseFormReturn<RoleFormValues>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Função</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Operador de Máquina, Analista de RH, Técnico de Segurança" 
                {...field}
                className={form.formState.errors.name ? "border-destructive" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição da Função</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva as atividades e responsabilidades desta função" 
                className={cn("min-h-[100px]", form.formState.errors.description && "border-destructive")}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
