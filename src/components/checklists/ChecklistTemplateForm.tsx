
import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DiscFactorType, DiscQuestion, ChecklistTemplate } from "@/types/checklist";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChecklistTemplateFormProps {
  onSubmit: (data: Omit<ChecklistTemplate, "id" | "createdAt">) => void;
}

export function ChecklistTemplateForm({ onSubmit }: ChecklistTemplateFormProps) {
  const [questions, setQuestions] = useState<Omit<DiscQuestion, "id">[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [targetFactor, setTargetFactor] = useState<DiscFactorType>("D");
  const [weight, setWeight] = useState(1);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: "disc" as const,
    },
  });

  const handleAddQuestion = () => {
    if (!questionText.trim()) {
      toast.error("O texto da questão não pode estar vazio");
      return;
    }

    const newQuestion = {
      text: questionText,
      targetFactor,
      weight,
    };

    setQuestions([...questions, newQuestion]);
    setQuestionText("");
    setTargetFactor("D");
    setWeight(1);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (questions.length === 0) {
      toast.error("Adicione pelo menos uma questão ao checklist");
      return;
    }

    // Create unique IDs for each question
    const questionsWithIds = questions.map((q) => ({
      ...q,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }));

    onSubmit({
      ...data,
      questions: questionsWithIds,
    });
  });

  const getFactorColor = (type: DiscFactorType) => {
    switch (type) {
      case "D": return "bg-red-100 hover:bg-red-200";
      case "I": return "bg-yellow-100 hover:bg-yellow-200";
      case "S": return "bg-green-100 hover:bg-green-200";
      case "C": return "bg-blue-100 hover:bg-blue-200";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
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
                    <RadioGroupItem value="custom" id="custom-type" />
                    <Label htmlFor="custom-type">Personalizado</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="font-medium text-sm">Questões</div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="question-text">Texto da Questão</Label>
                    <Textarea 
                      id="question-text"
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Ex: Prefiro tomar decisões rápidas e assumir riscos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-factor">Fator Alvo</Label>
                    <Select 
                      value={targetFactor} 
                      onValueChange={(val) => setTargetFactor(val as DiscFactorType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Fator" />
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
                    <Label htmlFor="weight">Peso</Label>
                    <Select 
                      value={weight.toString()} 
                      onValueChange={(val) => setWeight(parseInt(val))}
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
                  variant="outline"
                  className="w-full"
                  onClick={handleAddQuestion}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Questão
                </Button>
              </div>
            </CardContent>
          </Card>

          {questions.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Questões Adicionadas ({questions.length})</div>
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div 
                    key={index} 
                    className="flex items-start justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">{question.text}</p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline"
                          className={cn("text-xs font-medium", getFactorColor(question.targetFactor))}
                        >
                          {question.targetFactor}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Peso: {question.weight}
                        </span>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveQuestion(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit">Criar Checklist</Button>
        </div>
      </form>
    </Form>
  );
}
