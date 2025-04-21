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
import { ScaleType } from "@/types";
import { PsicossocialQuestion } from '@/types/checklist';

const PSICOSSOCIAL_TEMPLATE: PsicossocialQuestion[] = [
  // Demandas de Trabalho
  { category: "Demandas de Trabalho", id: "1", text: "Tenho tempo suficiente para realizar minhas tarefas diárias" },
  { category: "Demandas de Trabalho", id: "2", text: "O volume de trabalho é adequado para o tempo disponível" },
  { category: "Demandas de Trabalho", id: "3", text: "Preciso trabalhar muito rapidamente para cumprir meus prazos" },
  { category: "Demandas de Trabalho", id: "4", text: "Consigo fazer pausas quando necessário" },
  { category: "Demandas de Trabalho", id: "5", text: "Sinto-me pressionado pelas metas e indicadores de desempenho" },
  // Controle e Autonomia
  { category: "Controle e Autonomia", id: "6", text: "Tenho liberdade para decidir como realizar meu trabalho" },
  { category: "Controle e Autonomia", id: "7", text: "Posso influenciar decisões importantes relacionadas ao meu trabalho" },
  { category: "Controle e Autonomia", id: "8", text: "Minhas sugestões de melhorias são consideradas" },
  { category: "Controle e Autonomia", id: "9", text: "Tenho flexibilidade para organizar meu próprio tempo" },
  { category: "Controle e Autonomia", id: "10", text: "Minhas atividades são excessivamente controladas ou monitoradas" },
  // Suporte Social
  { category: "Suporte Social", id: "11", text: "Recebo ajuda e apoio dos meus colegas quando preciso" },
  { category: "Suporte Social", id: "12", text: "Meu superior imediato me dá o suporte necessário" },
  { category: "Suporte Social", id: "13", text: "Existe cooperação entre os membros da equipe" },
  { category: "Suporte Social", id: "14", text: "Tenho acesso aos recursos necessários para realizar meu trabalho" },
  { category: "Suporte Social", id: "15", text: "As dificuldades são discutidas abertamente e recebem atenção" },
  // Relacionamentos Interpessoais
  { category: "Relacionamentos Interpessoais", id: "16", text: "O ambiente de trabalho é respeitoso entre todos" },
  { category: "Relacionamentos Interpessoais", id: "17", text: "Já presenciei ou sofri situações de assédio moral" },
  { category: "Relacionamentos Interpessoais", id: "18", text: "Há conflitos frequentes entre colegas ou setores" },
  { category: "Relacionamentos Interpessoais", id: "19", text: "Recebo tratamento justo e respeitoso da chefia" },
  { category: "Relacionamentos Interpessoais", id: "20", text: "Existe competição excessiva entre colegas" },
  // Clareza de Papel
  { category: "Clareza de Papel", id: "21", text: "Sei exatamente quais são minhas responsabilidades" },
  { category: "Clareza de Papel", id: "22", text: "Os objetivos do meu trabalho são claros" },
  { category: "Clareza de Papel", id: "23", text: "Recebo informações contraditórias sobre o que devo fazer" },
  { category: "Clareza de Papel", id: "24", text: "Existem expectativas claras sobre meu desempenho" },
  { category: "Clareza de Papel", id: "25", text: "Entendo como meu trabalho contribui para os objetivos da empresa" },
  // Reconhecimento e Recompensas
  { category: "Reconhecimento e Recompensas", id: "26", text: "Meu trabalho é valorizado e reconhecido" },
  { category: "Reconhecimento e Recompensas", id: "27", text: "As oportunidades de crescimento são justas e transparentes" },
  { category: "Reconhecimento e Recompensas", id: "28", text: "A remuneração é compatível com minhas responsabilidades" },
  { category: "Reconhecimento e Recompensas", id: "29", text: "Recebo feedback construtivo sobre meu desempenho" },
  { category: "Reconhecimento e Recompensas", id: "30", text: "Vejo possibilidades de desenvolvimento profissional" },
  // Gestão de Mudanças
  { category: "Gestão de Mudanças", id: "31", text: "Mudanças organizacionais são comunicadas com antecedência" },
  { category: "Gestão de Mudanças", id: "32", text: "Recebo treinamento adequado para lidar com novas demandas" },
  { category: "Gestão de Mudanças", id: "33", text: "Tenho oportunidade de opinar nas mudanças que afetam meu trabalho" },
  { category: "Gestão de Mudanças", id: "34", text: "As mudanças são implementadas de forma planejada" },
  { category: "Gestão de Mudanças", id: "35", text: "Me sinto inseguro quando ocorrem mudanças na empresa" },
  // Equilíbrio Trabalho-Vida
  { category: "Equilíbrio Trabalho-Vida", id: "36", text: "Consigo desconectar do trabalho em meu tempo livre" },
  { category: "Equilíbrio Trabalho-Vida", id: "37", text: "Preciso estender meu horário para concluir minhas atividades" },
  { category: "Equilíbrio Trabalho-Vida", id: "38", text: "O trabalho interfere na minha vida pessoal/familiar" },
  { category: "Equilíbrio Trabalho-Vida", id: "39", text: "Consigo conciliar compromissos pessoais com o trabalho" },
  { category: "Equilíbrio Trabalho-Vida", id: "40", text: "Sinto-me cansado demais após o trabalho para realizar atividades pessoais" },
  // Impactos na Saúde
  { category: "Impactos na Saúde", id: "41", text: "Sinto dificuldade para dormir devido a preocupações com o trabalho" },
  { category: "Impactos na Saúde", id: "42", text: "Experimentei sintomas físicos relacionados ao estresse (dores, problemas digestivos, etc.)" },
  { category: "Impactos na Saúde", id: "43", text: "Sinto-me emocionalmente esgotado ao final do dia" },
  { category: "Impactos na Saúde", id: "44", text: "Tenho dificuldade em me concentrar no trabalho" },
  { category: "Impactos na Saúde", id: "45", text: "Sinto-me desmotivado ou sem energia para trabalhar" },
];

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  type: z.enum(["disc", "custom", "psicossocial"]),
  scaleType: z.enum(["binary", "likert", "numeric", "psicossocial"]),
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
    defaultValues?.scaleType || existingTemplate?.scaleType || (defaultValues?.type === "psicossocial" ? "psicossocial" : "binary")
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
    if (method === "psicossocial") {
      setSelectedScale(ScaleType.Psicossocial);
      form.setValue("scaleType", ScaleType.Psicossocial);
      form.setValue("questions", PSICOSSOCIAL_TEMPLATE);
    } else if (method === "custom") {
      setSelectedScale(ScaleType.Likert);
      form.setValue("scaleType", ScaleType.Likert);
      form.setValue("questions", []);
    } else {
      setSelectedScale(ScaleType.YesNo);
      form.setValue("scaleType", ScaleType.YesNo);
      form.setValue("questions", []);
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
                <SelectItem value="custom">Personalizado</SelectItem>
                <SelectItem value="psicossocial">Psicossocial</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel>Escala</FormLabel>
            <Select value={selectedScale} onValueChange={(val) => {
              setSelectedScale(val);
              form.setValue("scaleType", val as "binary" | "likert" | "numeric" | "psicossocial");
            }}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escala" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {method === "psicossocial" ? (
                  <SelectItem value="psicossocial">Psicossocial (1-Nunca/Quase nunca ... 5-Sempre/Quase sempre)</SelectItem>
                ) : (
                  <>
                    <SelectItem value="binary">Sim/Não</SelectItem>
                    <SelectItem value="likert">Likert (1-5)</SelectItem>
                    <SelectItem value="numeric">Numérico</SelectItem>
                  </>
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
                {method === "psicossocial"
                  ? "Categorias e perguntas serão geradas conforme o padrão psicossocial."
                  : "Adicione as perguntas do seu checklist personalizado."}
              </FormDescription>
              <FormControl>
                {method === "psicossocial" ? (
                  <div>
                    {PSICOSSOCIAL_TEMPLATE.reduce((cats, q) => 
                      cats.includes(q.category) ? cats : [...cats, q.category], [] as string[]
                    ).map(cat => (
                      <div key={cat} className="mb-2">
                        <div className="font-semibold">{cat}</div>
                        <ul className="ml-4 list-disc">
                          {PSICOSSOCIAL_TEMPLATE.filter(q => q.category === cat).map(q => (
                            <li key={q.id}>{q.text}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
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
                )}
              </FormControl>
              <FormMessage />
              {method !== "psicossocial" && (
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
              )}
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
