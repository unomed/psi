import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { SkillsInput } from "./form/SkillsInput";
import { toast } from "sonner";

const roleSchema = z.object({
  name: z.string().min(2, "O nome da função deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres").optional(),
  riskLevel: z.string().optional().nullable(),
  requiredSkills: z.array(z.string()).min(1, "Adicione pelo menos uma habilidade"),
  sectorId: z.string().optional().nullable(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  onSubmit: (values: RoleFormValues) => void;
  defaultValues?: Partial<RoleFormValues>;
  sectors: { id: string; name: string }[];
}

const RISK_LEVELS = [
  { value: "low", label: "Baixo" },
  { value: "medium", label: "Médio" },
  { value: "high", label: "Alto" }
].filter(level => level.value && String(level.value).trim() !== ""); // Ensure RISK_LEVELS are valid

export function RoleForm({ onSubmit, defaultValues, sectors }: RoleFormProps) {
  const [skills, setSkills] = React.useState<string[]>(defaultValues?.requiredSkills || []);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      riskLevel: "",
      requiredSkills: [],
      sectorId: null,
      ...defaultValues,
    },
  });

  const handleSubmitForm = async (data: RoleFormValues) => {
    try {
      await onSubmit({
        ...data,
        requiredSkills: skills,
      });
    } catch (error) {
      toast.error("Erro ao salvar função. Tente novamente.");
      console.error("Error submitting role form:", error);
    }
  };

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      const newSkills = [...skills, skill.trim()];
      setSkills(newSkills);
      form.setValue("requiredSkills", newSkills);
      form.trigger("requiredSkills");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    form.setValue("requiredSkills", newSkills);
    form.trigger("requiredSkills");
  };

  const validSectors = (sectors || []).filter(sector => 
    sector && sector.id && String(sector.id).trim() !== "" && sector.name && String(sector.name).trim() !== ""
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
        <BasicInfoFields form={form} />
        
        {validSectors.length > 0 && (
          <FormField
            control={form.control}
            name="sectorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Setor</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {validSectors.map((sector) => (
                          <SelectItem key={String(sector.id)} value={String(sector.id)}>
                            {sector.name}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <SkillsInput 
          skills={skills}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
          error={form.formState.errors.requiredSkills?.message}
        />

        <FormField
          control={form.control}
          name="riskLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível de Risco (será calculado após avaliações)</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Será definido após avaliações" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">
            Salvar Função
          </Button>
        </div>
      </form>
    </Form>
  );
}
