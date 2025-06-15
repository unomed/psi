
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface EmployeeTypeAndTagsFieldsProps {
  form: any;
  selectedRole: string | null;
  requiredTags: string[];
}

export function EmployeeTypeAndTagsFields({ 
  form, 
  selectedRole, 
  requiredTags 
}: EmployeeTypeAndTagsFieldsProps) {
  const [newTag, setNewTag] = useState("");
  const currentTags = form.watch("employee_tags") || [];
  const currentType = form.watch("employee_type") || "funcionario";

  const addTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      const updatedTags = [...currentTags, newTag.trim()];
      form.setValue("employee_tags", updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = currentTags.filter((tag: string) => tag !== tagToRemove);
    form.setValue("employee_tags", updatedTags);
  };

  const addRequiredTag = (tag: string) => {
    if (!currentTags.includes(tag)) {
      const updatedTags = [...currentTags, tag];
      form.setValue("employee_tags", updatedTags);
    }
  };

  const missingRequiredTags = requiredTags.filter(tag => !currentTags.includes(tag));

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">Tipo e Competências</h3>
      
      <FormField
        control={form.control}
        name="employee_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Pessoa</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidato">Candidato (Entrevista)</SelectItem>
                  <SelectItem value="funcionario">Funcionário (Ativo)</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tags Obrigatórias */}
      {requiredTags.length > 0 && (
        <div className="space-y-2">
          <FormLabel>Tags Obrigatórias para a Função</FormLabel>
          <div className="flex flex-wrap gap-2">
            {requiredTags.map(tag => (
              <Badge 
                key={tag} 
                variant={currentTags.includes(tag) ? "default" : "destructive"}
                className="cursor-pointer"
                onClick={() => addRequiredTag(tag)}
              >
                {tag}
                {currentTags.includes(tag) ? " ✓" : " (obrigatória)"}
              </Badge>
            ))}
          </div>
          {missingRequiredTags.length > 0 && currentType === "funcionario" && (
            <p className="text-sm text-red-600">
              Tags obrigatórias em falta: {missingRequiredTags.join(", ")}
            </p>
          )}
        </div>
      )}

      {/* Tags do Funcionário */}
      <FormField
        control={form.control}
        name="employee_tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Competências/Tags</FormLabel>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite uma competência..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
