
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";
import { ScaleType } from "@/types";
import { PsicossocialQuestion } from '@/types/checklist';
import { ScaleTypeSelector } from './ScaleTypeSelector';
import { CategoryQuestionGroup, CategoryQuestion } from './form/CategoryQuestionGroup';

// Modelo de perguntas psicossociais para referência
const PSICOSSOCIAL_CATEGORIES = [
  "Demandas de Trabalho",
  "Controle e Autonomia",
  "Suporte Social",
  "Relacionamentos Interpessoais",
  "Clareza de Papel",
  "Reconhecimento e Recompensas",
  "Gestão de Mudanças",
  "Equilíbrio Trabalho-Vida",
  "Impactos na Saúde"
];

const PSICOSSOCIAL_TEMPLATE: PsicossocialQuestion[] = [
  // Demandas de Trabalho
  { category: "Demandas de Trabalho", id: "1", text: "Tenho tempo suficiente para realizar minhas tarefas diárias" },
  { category: "Demandas de Trabalho", id: "2", text: "O volume de trabalho é adequado para o tempo disponível" },
  { category: "Demandas de Trabalho", id: "3", text: "Preciso trabalhar muito rapidamente para cumprir meus prazos" },
  { category: "Demandas de Trabalho", id: "4", text: "Consigo fazer pausas quando necessário" },
  { category: "Demandas de Trabalho", id: "5", text: "Sinto-me pressionado pelas metas e indicadores de desempenho" },
  // ... outras perguntas
];

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  type: z.enum(["disc", "custom", "psicossocial"]),
  scaleType: z.string(),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string().min(1, "A pergunta não pode estar vazia"),
    category: z.string().optional(),
    targetFactor: z.string().optional(),
    weight: z.number().optional()
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
  const [selectedScale, setSelectedScale] = useState<ScaleType>(
    defaultValues?.scaleType || existingTemplate?.scaleType || ScaleType.YesNo
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("basic");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || existingTemplate?.title || '',
      description: defaultValues?.description || existingTemplate?.description || '',
      type: defaultValues?.type || existingTemplate?.type || 'disc',
      scaleType: defaultValues?.scaleType || existingTemplate?.scaleType || ScaleType.YesNo,
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
    if (method === "psicossocial") {
      setSelectedScale(ScaleType.Psicossocial);
      form.setValue("scaleType", ScaleType.Psicossocial);
      
      // Inicializar com categorias do modelo psicossocial
      setCategories(PSICOSSOCIAL_CATEGORIES);
      
      // Decidir se queremos inicializar com o template completo ou deixar vazio para o usuário preencher
      const shouldPopulateTemplate = false; // Modificar para true se quisermos preencher automaticamente
      
      if (shouldPopulateTemplate) {
        form.setValue("questions", PSICOSSOCIAL_TEMPLATE);
      } else {
        form.setValue("questions", []);
      }
    } else if (method === "custom") {
      setSelectedScale(ScaleType.Likert);
      form.setValue("scaleType", ScaleType.Likert);
      setCategories([]);
      form.setValue("questions", []);
    } else {
      setSelectedScale(ScaleType.YesNo);
      form.setValue("scaleType", ScaleType.YesNo);
      setCategories([]);
      form.setValue("questions", []);
    }
  }, [method, form]);

  // Inicializar categorias a partir das perguntas existentes
  useEffect(() => {
    if (existingTemplate?.questions && existingTemplate.questions.length > 0) {
      const existingCategories = new Set<string>();
      
      existingTemplate.questions.forEach((q: any) => {
        if (q.category) {
          existingCategories.add(q.category);
        }
      });
      
      if (existingCategories.size > 0) {
        setCategories(Array.from(existingCategories));
      }
    }
  }, [existingTemplate]);

  const handleAddCategory = (category: string) => {
    setCategories([...categories, category]);
  };

  const handleAddQuestion = (question: any) => {
    const currentQuestions = form.getValues("questions") || [];
    
    if (method === "disc") {
      form.setValue("questions", [...currentQuestions, {
        id: uuidv4(),
        text: question.text,
        targetFactor: question.targetFactor,
        weight: question.weight || 1
      }]);
    } else if (method === "psicossocial" || method === "custom") {
      form.setValue("questions", [...currentQuestions, {
        id: uuidv4(),
        text: question.text,
        category: question.category,
        weight: question.weight || 1
      }]);
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    const currentQuestions = form.getValues("questions");
    form.setValue(
      "questions", 
      currentQuestions.filter(q => q.id !== questionId)
    );
  };

  const handleScaleChange = (newScale: ScaleType) => {
    setSelectedScale(newScale);
    form.setValue("scaleType", newScale);
  };

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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="questions">Perguntas & Categorias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
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
                <Select 
                  value={method} 
                  onValueChange={(val) => setMethod(val)}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="disc">DISC</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                    <SelectItem value="psicossocial">Psicossocial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>

              <ScaleTypeSelector 
                value={selectedScale} 
                onChange={handleScaleChange}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab("questions")}
              >
                Próximo: Perguntas e Categorias
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="questions" className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="questions"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      {method === "disc" ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Perguntas DISC</h3>
                          <FormDescription>
                            Adicione perguntas para o checklist DISC e especifique o fator alvo.
                          </FormDescription>
                          
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
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <Label>Fator Alvo</Label>
                                        <Select
                                          value={question.targetFactor}
                                          onValueChange={(value) => {
                                            const updatedQuestions = [...field.value];
                                            updatedQuestions[index].targetFactor = value;
                                            field.onChange(updatedQuestions);
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Selecione o fator" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="D">D - Dominância</SelectItem>
                                            <SelectItem value="I">I - Influência</SelectItem>
                                            <SelectItem value="S">S - Estabilidade</SelectItem>
                                            <SelectItem value="C">C - Conformidade</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>Peso</Label>
                                        <Select
                                          value={question.weight?.toString() || "1"}
                                          onValueChange={(value) => {
                                            const updatedQuestions = [...field.value];
                                            updatedQuestions[index].weight = parseInt(value);
                                            field.onChange(updatedQuestions);
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Peso" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="1">1 - Baixo</SelectItem>
                                            <SelectItem value="2">2 - Médio</SelectItem>
                                            <SelectItem value="3">3 - Alto</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
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
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              field.onChange([
                                ...field.value, 
                                { id: uuidv4(), text: '', targetFactor: 'D', weight: 1 }
                              ]);
                            }} 
                            className="mt-2"
                          >
                            Adicionar Pergunta DISC
                          </Button>
                        </div>
                      ) : (
                        <CategoryQuestionGroup 
                          categories={categories}
                          questions={field.value.map(q => ({
                            id: q.id,
                            text: q.text,
                            category: q.category || 'Geral'
                          }))}
                          onAddCategory={handleAddCategory}
                          onAddQuestion={handleAddQuestion}
                          onRemoveQuestion={handleRemoveQuestion}
                          onUpdateQuestion={(updatedQuestion) => {
                            const currentQuestions = field.value;
                            const updatedQuestions = currentQuestions.map(q => 
                              q.id === updatedQuestion.id ? updatedQuestion : q
                            );
                            field.onChange(updatedQuestions);
                          }}
                          selectedScaleType={selectedScale}
                        />
                      )}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab("basic")}
              >
                Voltar para Informações Básicas
              </Button>
              
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Salvar Checklist
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
