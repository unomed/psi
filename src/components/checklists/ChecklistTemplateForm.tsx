import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Trash2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  type: z.enum(["disc", "custom"]),
  scaleType: z.enum(["binary", "likert", "numeric"]),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string().min(1, "A pergunta não pode estar vazia"),
    type: z.string()
  })).min(1, "Adicione pelo menos uma pergunta")
});

type FormValues = z.infer<typeof formSchema>;

interface ChecklistTemplateFormProps {
  defaultValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  existingTemplate?: any;
  isEditing?: boolean;
}

const psicoScaleType = [
  { value: "psicossocial", label: "Psicossocial (1-Nunca/Quase nunca ... 5-Sempre/Quase sempre)" },
];

const scaleTypeOptions = [
  { value: "binary", label: "Sim/Não" },
  { value: "likert", label: "Likert (1-5)" },
  { value: "numeric", label: "Numérico" },
  ...psicoScaleType
];

export function ChecklistTemplateForm({ 
  defaultValues, 
  onSubmit, 
  onCancel,
  existingTemplate,
  isEditing = false
}: ChecklistTemplateFormProps) {
  const { hasRole } = useAuth();
  const [canEditStandard, setCanEditStandard] = useState(false);
  const [method, setMethod] = useState<string>(
    defaultValues?.type || existingTemplate?.type || 'disc'
  );
  const [selectedScale, setSelectedScale] = useState<string>(
    defaultValues?.scaleType || existingTemplate?.scaleType || (defaultValues?.type === "custom" ? "psicossocial" : "binary")
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || existingTemplate?.title || '',
      description: defaultValues?.description || existingTemplate?.description || '',
      type: defaultValues?.type || existingTemplate?.type || 'disc',
      scaleType: defaultValues?.scaleType || existingTemplate?.scaleType || 'binary',
      questions: defaultValues?.questions || existingTemplate?.questions || [],
    }
  });
  
  useEffect(() => {
    const checkPermissions = async () => {
      const isSuperAdmin = await hasRole('superadmin');
      setCanEditStandard(isSuperAdmin);
    };
    
    checkPermissions();
  }, [hasRole]);
  
  useEffect(() => {
    if (method === "custom") {
      setSelectedScale("psicossocial");
      form.setValue("scaleType", "psicossocial");
    } else {
      setSelectedScale("binary");
      form.setValue("scaleType", "binary");
    }
    // eslint-disable-next-line
  }, [method]);

  const handleSubmit = async (data: FormValues) => {
    try {
      if ((existingTemplate?.is_standard || defaultValues?.is_standard) && !canEditStandard) {
        toast.error("Apenas superadmins podem editar modelos padrão");
        return;
      }
      
      const isEvaluator = await hasRole('evaluator');
      if (isEvaluator) {
        toast.error("Avaliadores não podem criar ou editar modelos de checklist");
        return;
      }
      
      onSubmit({
        ...data,
        type: method,
        scaleType: selectedScale,
      });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erro ao salvar checklist");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Checklist de Segurança do Trabalho" 
                  {...field}
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
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o objetivo e o escopo deste checklist" 
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Tipo</FormLabel>
            <Select value={method} onValueChange={(val) => setMethod(val)}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="disc">DISC</SelectItem>
                <SelectItem value="custom">Personalizado/Psicossocial</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Escala</FormLabel>
            <Select value={selectedScale} onValueChange={(val) => {
              setSelectedScale(val);
              form.setValue("scaleType", val);
            }}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escala" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {method === "custom" ? (
                  psicoScaleType.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))
                ) : (
                  scaleTypeOptions.filter(opt => opt.value !== "psicossocial").map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </div>

        <FormField
          control={form.control}
          name="questions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perguntas</FormLabel>
              <FormDescription>
                Adicione as perguntas do seu checklist.
              </FormDescription>
              <FormControl>
                <div>
                  <Accordion type="multiple" className="w-full">
                    {field.value.map((question, index) => (
                      <AccordionItem value={question.id} key={question.id}>
                        <AccordionTrigger>
                          {index + 1}. {question.text || "Nova Pergunta"}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 gap-2">
                            <Input
                              type="text"
                              placeholder="Digite a pergunta"
                              value={question.text}
                              onChange={(e) => {
                                const updatedQuestions = [...field.value];
                                updatedQuestions[index].text = e.target.value;
                                field.onChange(updatedQuestions);
                              }}
                            />
                            <Button 
                              type="button" 
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updatedQuestions = field.value.filter((_, i) => i !== index);
                                field.onChange(updatedQuestions);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir Pergunta
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </FormControl>
              <FormMessage />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  field.onChange([...field.value, { id: uuidv4(), text: '', type: 'text' }]);
                }} 
                className="mt-2"
              >
                Adicionar Pergunta
              </Button>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Salvar Checklist
          </Button>
        </div>
      </form>
    </Form>
  );
}
