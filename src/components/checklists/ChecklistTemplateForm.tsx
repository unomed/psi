import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
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

interface ChecklistTemplateFormProps {
  defaultValues?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export function ChecklistTemplateForm({ 
  defaultValues, 
  onSubmit, 
  onCancel 
}) {
  const { hasRole } = useAuth();
  const [canEditStandard, setCanEditStandard] = useState(false);
  const [form, setForm] = useState({
    title: defaultValues?.title || '',
    description: defaultValues?.description || '',
    type: defaultValues?.type || 'safety',
    scaleType: defaultValues?.scaleType || 'binary',
    questions: defaultValues?.questions || [],
    is_standard: defaultValues?.is_standard || false,
  });
  
  // Check if user can edit standard templates
  useEffect(() => {
    const checkPermissions = async () => {
      const isSuperAdmin = await hasRole('superadmin');
      setCanEditStandard(isSuperAdmin);
    };
    
    checkPermissions();
  }, [hasRole]);
  
  // Add this at the beginning of your handleSubmit function
  const handleSubmit = async (data) => {
    try {
      // Check if user is trying to edit a standard template
      if (defaultValues?.is_standard && !canEditStandard) {
        toast.error("Apenas superadmins podem editar modelos padrão");
        return;
      }
      
      // Check if user is an evaluator (they can't create/edit templates)
      const isEvaluator = await hasRole('evaluator');
      if (isEvaluator) {
        toast.error("Avaliadores não podem criar ou editar modelos de checklist");
        return;
      }
      
      onSubmit(form);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erro ao salvar checklist");
    }
  };
  
  const handleAddQuestion = () => {
    setForm({
      ...form,
      questions: [...form.questions, { id: uuidv4(), text: '', type: 'text' }]
    });
  };

  const handleQuestionChange = (id: string, field: string, value: string) => {
    const updatedQuestions = form.questions.map(question => {
      if (question.id === id) {
        return { ...question, [field]: value };
      }
      return question;
    });
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = form.questions.filter(question => question.id !== id);
    setForm({ ...form, questions: updatedQuestions });
  };

  return (
    <Form>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(form);
      }} className="space-y-4">
        <FormField>
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Checklist de Segurança do Trabalho" 
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField>
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descreva o objetivo e o escopo deste checklist" 
                className="min-h-[100px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField>
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="safety">Segurança</SelectItem>
                  <SelectItem value="ergonomics">Ergonomia</SelectItem>
                  <SelectItem value="psychosocial">Psicossocial</SelectItem>
                  <SelectItem value="environmental">Ambiental</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField>
            <FormItem>
              <FormLabel>Escala</FormLabel>
              <Select value={form.scaleType} onValueChange={(value) => setForm({ ...form, scaleType: value })}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a escala" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="binary">Sim/Não</SelectItem>
                  <SelectItem value="likert">Likert (1-5)</SelectItem>
                  <SelectItem value="numeric">Numérico</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField>
          <FormItem>
            <FormLabel>Perguntas</FormLabel>
            <FormDescription>
              Adicione as perguntas do seu checklist.
            </FormDescription>
            <FormControl>
              <Accordion type="multiple" className="w-full">
                {form.questions.map((question, index) => (
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
                          onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir Pergunta
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FormControl>
            <FormMessage />
            <Button type="button" variant="outline" onClick={handleAddQuestion} className="mt-2">
              Adicionar Pergunta
            </Button>
          </FormItem>
        </FormField>

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
