
import * as React from "react";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const commonSkillOptions = [
  "Atenção", "Foco", "Comprometimento", "Trabalho em equipe", 
  "Comunicação", "Liderança", "Resolução de problemas",
  "Flexibilidade", "Proatividade", "Organização",
  "Criatividade", "Empatia", "Resiliência"
];

interface SkillsInputProps {
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
}

export function SkillsInput({ skills, onAddSkill, onRemoveSkill }: SkillsInputProps) {
  const [skillInput, setSkillInput] = React.useState("");
  const [suggestedSkills, setSuggestedSkills] = React.useState<string[]>([]);

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
      onAddSkill(skillInput);
      setSkillInput("");
      setSuggestedSkills([]);
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Habilidades e Competências Necessárias</FormLabel>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="px-2 py-1 text-sm">
            {skill}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveSkill(skill)}
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
                onClick={() => {
                  onAddSkill(skill);
                  setSkillInput("");
                  setSuggestedSkills([]);
                }}
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
              onClick={() => onAddSkill(skill)}
            >
              {skill}
            </Badge>
          )
        ))}
      </div>
    </div>
  );
}
