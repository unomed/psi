
import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const sectorSchema = z.object({
  name: z.string().min(2, "O nome do setor é obrigatório"),
  description: z.string().optional(),
  location: z.string().optional(),
  riskLevel: z.string().optional(),
});

type SectorFormValues = z.infer<typeof sectorSchema>;

interface SectorFormProps {
  onSubmit: (values: SectorFormValues) => void;
  defaultValues?: Partial<SectorFormValues>;
}

export function SectorForm({ onSubmit, defaultValues }: SectorFormProps) {
  const form = useForm<SectorFormValues>({
    resolver: zodResolver(sectorSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      riskLevel: "",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Setor</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Produção, Administrativo, Manutenção" {...field} />
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
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva as atividades realizadas neste setor" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localização</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Bloco A, 2º andar, Matriz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="riskLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível de Risco Inicial</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Baixo, Médio, Alto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Salvar Setor</Button>
        </div>
      </form>
    </Form>
  );
}
