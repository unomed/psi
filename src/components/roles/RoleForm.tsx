
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const roleSchema = z.object({
  name: z.string().min(2, "O nome da função é obrigatório"),
  description: z.string().optional(),
  riskLevel: z.string().optional(),
  requiredSkills: z.array(z.string()).optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormProps {
  onSubmit: (values: RoleFormValues) => void;
  defaultValues?: Partial<RoleFormValues>;
}

const commonSkillOptions = [
  "Atenção", "Foco", "Comprometimento", "Trabalho em equipe", 
  "Comunicação", "Liderança", "Resolução de problemas",
  "Flexibilidade", "Proatividade", "Organização",
  "Criatividade", "Empatia", "Resiliência"
];

export function RoleForm({ onSubmit, defaultValues }: RoleFormProps) {
  const [skillInput, setSkillInput] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>(defaultValues?.requiredSkills || []);
  const [suggestedSkills, setSuggestedSkills] = React.useState<string[]>([]);

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
    const formData = {
      ...data,
      requiredSkills: skills,
    };
    onSubmit(formData);
  };

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      const newSkills = [...skills, skill.trim()];
      setSkills(newSkills);
      form.setValue("requiredSkills", newSkills);
      setSkillInput("");
      setSuggestedSkills([]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    form.setValue("requiredSkills", newSkills);
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSkillInput(input);
    
    if (input.trim()) {
      const filtered = commonSkillOptions.filter(
        skill => skill.toLowerCase().includes(input.toLowerCase()) && !skills.includes(skill)
      );
      setSuggestedSkills(filtered);
    } else {
      setSuggestedSkills([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Função</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Operador de Máquina, Analista de RH, Técnico de Segurança" {...field} />
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
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Habilidades e Competências Necessárias</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-2 py-1 text-sm">
                {skill}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveSkill(skill)}
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="relative">
            <Input
              placeholder="Digite uma habilidade e pressione Enter"
              value={skillInput}
              onChange={handleSkillInputChange}
              onKeyDown={handleKeyDown}
              className="mb-1"
            />
            {suggestedSkills.length > 0 && (
              <div className="absolute z-10 bg-popover border rounded-md shadow-md p-2 w-full max-h-60 overflow-y-auto">
                {suggestedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="px-2 py-1 hover:bg-muted cursor-pointer rounded-sm"
                    onClick={() => handleAddSkill(skill)}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {commonSkillOptions.slice(0, 6).map((skill) => (
              !skills.includes(skill) && (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => handleAddSkill(skill)}
                >
                  {skill}
                </Badge>
              )
            ))}
          </div>
        </div>

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
