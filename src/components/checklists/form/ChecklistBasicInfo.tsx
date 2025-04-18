import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { ScaleTypeSelector } from "@/components/checklists/ScaleTypeSelector";
import { ScaleType } from "@/types";

interface ChecklistBasicInfoProps {
  form: UseFormReturn<{
    title: string;
    description: string;
    type: "disc" | "custom";
  }, any, undefined>;
  scaleType: ScaleType;
  onScaleTypeChange: (value: ScaleType) => void;
}

export function ChecklistBasicInfo({ 
  form, 
  scaleType, 
  onScaleTypeChange 
}: ChecklistBasicInfoProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título do Checklist</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Análise de Perfil DISC para Liderança" {...field} />
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
                placeholder="Descreva o objetivo deste checklist e como ele deve ser utilizado" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Avaliação</FormLabel>
              <FormControl>
                <RadioGroup 
                  defaultValue={field.value} 
                  onValueChange={field.onChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="disc" id="disc-type" />
                    <Label htmlFor="disc-type">DISC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom-type" disabled />
                    <Label htmlFor="custom-type" className="text-muted-foreground">Personalizado</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ScaleTypeSelector value={scaleType} onChange={onScaleTypeChange} />
      </div>
    </>
  );
}
