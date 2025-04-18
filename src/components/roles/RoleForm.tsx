
import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { SkillsInput } from "./form/SkillsInput";

const roleSchema = z.object({
  name: z.string().min(2, "O nome da função é obrigatório"),
  description: z.string().optional(),
  riskLevel: z.string().optional(),
  requiredSkills: z.array(z.string()).optional(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  onSubmit: (values: RoleFormValues) => void;
  defaultValues?: Partial<RoleFormValues>;
}

export function RoleForm({ onSubmit, defaultValues }: RoleFormProps) {
  const [skills, setSkills] = React.useState<string[]>(defaultValues?.requiredSkills || []);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      description: "",
      riskLevel: "",
      requiredSkills: [],
      ...defaultValues,
    },
  });

  const handleSubmitForm = (data: RoleFormValues) => {
    onSubmit({
      ...data,
      requiredSkills: skills,
    });
  };

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      const newSkills = [...skills, skill.trim()];
      setSkills(newSkills);
      form.setValue("requiredSkills", newSkills);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    form.setValue("requiredSkills", newSkills);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
        <BasicInfoFields form={form} />
        
        <SkillsInput 
          skills={skills}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
        />

        <FormField
          control={form.control}
          name="riskLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível de Risco Psicossocial</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Baixo, Médio, Alto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Salvar Função</Button>
        </div>
      </form>
    </Form>
  );
}
