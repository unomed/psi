
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChecklistTemplateForm } from "./ChecklistTemplateForm";
import { QuestionnaireTemplateSelector } from "./QuestionnaireTemplateSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ChecklistTemplateWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  existingTemplate?: any;
  isEditing?: boolean;
}

export function ChecklistTemplateWorkflow({ 
  isOpen, 
  onClose, 
  onSubmit, 
  existingTemplate,
  isEditing = false 
}: ChecklistTemplateWorkflowProps) {
  const [step, setStep] = useState<'selector' | 'form'>('selector');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Efeito para lidar com templates pré-selecionados com validação melhorada
  useEffect(() => {
    if (existingTemplate && isOpen) {
      console.log("🔄 Processando template existente:", existingTemplate.title);
      
      // Validação do template existente
      if (validateTemplate(existingTemplate)) {
        setSelectedTemplate(existingTemplate);
        setStep('form');
        setValidationError(null);
        console.log("✅ Template existente validado e carregado");
      } else {
        console.error("❌ Template existente inválido");
        setValidationError("Template fornecido é inválido");
        setStep('selector');
      }
    } else if (!existingTemplate && isOpen && !isEditing) {
      console.log("🔄 Iniciando seleção de template");
      setSelectedTemplate(null);
      setStep('selector');
      setValidationError(null);
    }
  }, [existingTemplate, isOpen, isEditing]);

  // Validação de template com logs detalhados
  const validateTemplate = (template: any): boolean => {
    if (!template) {
      console.error("❌ Template é nulo ou undefined");
      return false;
    }

    if (!template.title || template.title.trim() === "") {
      console.error("❌ Template sem título válido:", template);
      return false;
    }

    if (!template.questions || !Array.isArray(template.questions)) {
      console.error("❌ Template sem array de perguntas válido:", template);
      return false;
    }

    if (template.questions.length === 0) {
      console.error("❌ Template sem perguntas:", template);
      return false;
    }

    // Validação específica por tipo
    if (template.type && !['disc', 'custom', 'psicossocial', 'srq20', 'phq9', 'gad7', 'mbi', 'audit', 'pss', 'personal_life', 'evaluation_360'].includes(template.type)) {
      console.error("❌ Tipo de template inválido:", template.type);
      return false;
    }

    console.log("✅ Template validado com sucesso:", {
      title: template.title,
      type: template.type,
      questions: template.questions.length
    });

    return true;
  };

  const handleTemplateSelect = async (template: any) => {
    setIsLoading(true);
    setValidationError(null);

    try {
      console.log("🔄 Selecionando template:", template.title);

      // Validação do template selecionado
      if (!validateTemplate(template)) {
        throw new Error("Template selecionado é inválido");
      }

      // Simular carregamento para templates complexos (opcional)
      if (template.questions.length > 50) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setSelectedTemplate(template);
      setStep('form');
      
      console.log("✅ Template selecionado com sucesso");
      toast.success(`Template "${template.title}" carregado com sucesso!`);
      
    } catch (error) {
      console.error("❌ Erro ao selecionar template:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setValidationError(errorMessage);
      toast.error("Erro ao carregar template", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    setValidationError(null);

    try {
      console.log("🔄 Submetendo formulário de template:", data.title);

      // Validação final dos dados
      if (!validateTemplate(data)) {
        throw new Error("Dados do formulário são inválidos");
      }

      await onSubmit(data);
      handleClose();
      
      console.log("✅ Formulário submetido com sucesso");
      
    } catch (error) {
      console.error("❌ Erro ao submeter formulário:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao salvar template";
      setValidationError(errorMessage);
      toast.error("Erro ao salvar template", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    console.log("🔄 Fechando workflow de template");
    setStep('selector');
    setSelectedTemplate(null);
    setValidationError(null);
    setIsLoading(false);
    onClose();
  };

  const handleBackToSelector = () => {
    console.log("🔄 Voltando para seletor de template");
    setStep('selector');
    setSelectedTemplate(null);
    setValidationError(null);
  };

  // Determinar o título do diálogo com feedback visual melhorado
  const getDialogTitle = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Carregando...
        </div>
      );
    }

    if (validationError) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          Erro na Validação
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Editar Questionário
        </div>
      );
    }
    
    if (existingTemplate) {
      return (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          Personalizar: {existingTemplate.title || "Template Selecionado"}
        </div>
      );
    }
    
    if (step === 'selector') {
      return "Criar Novo Questionário";
    }
    
    return (
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        Personalizar: {selectedTemplate?.title || "Template"}
      </div>
    );
  };

  // Renderizar conteúdo baseado no estado com loading states
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-8 space-y-4">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium">Carregando template...</h3>
            <p className="text-muted-foreground">Preparando o questionário para edição</p>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      );
    }

    if (validationError) {
      return (
        <div className="py-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-600 mb-2">Erro de Validação</h3>
          <p className="text-red-500 mb-4">{validationError}</p>
          <div className="space-x-2">
            <button
              onClick={handleBackToSelector}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Tentar Novamente
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      );
    }

    if (step === 'selector' && !isEditing && !existingTemplate) {
      return (
        <QuestionnaireTemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onCancel={handleClose}
        />
      );
    }

    return (
      <ChecklistTemplateForm
        defaultValues={selectedTemplate || existingTemplate}
        onSubmit={handleFormSubmit}
        onCancel={existingTemplate ? handleClose : handleBackToSelector}
        existingTemplate={existingTemplate}
        isEditing={isEditing}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
