
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { fetchAssessmentByToken } from "@/services/assessment/results";

export default function PublicAssessment() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationComplete, setValidationComplete] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const validateAndRedirect = async () => {
      if (!token) {
        console.error("[PublicAssessment] Token não fornecido na URL");
        setError("Token de avaliação não fornecido na URL");
        setIsLoading(false);
        return;
      }

      console.log("[PublicAssessment] Iniciando validação do token:", token);
      console.log("[PublicAssessment] URL atual:", window.location.href);
      console.log("[PublicAssessment] Tentativa número:", retryCount + 1);
      
      try {
        setValidationComplete(false);
        setError(null);
        
        // Verificar se o token é válido
        console.log("[PublicAssessment] Chamando fetchAssessmentByToken...");
        const response = await fetchAssessmentByToken(token);
        
        console.log("[PublicAssessment] Resposta recebida:", {
          hasError: !!response.error,
          hasTemplate: !!(response as any).template,
          hasEmployeeId: !!(response as any).employeeId
        });
        
        if (response.error) {
          console.error("[PublicAssessment] Erro na validação:", response.error);
          setError(response.error);
          setIsLoading(false);
          return;
        }

        // Type guard para verificar se a resposta tem template
        if (!('template' in response) || !response.template || !response.employeeId) {
          console.error("[PublicAssessment] Dados incompletos:", {
            hasTemplate: !!(response as any).template,
            hasEmployeeId: !!(response as any).employeeId,
            responseKeys: Object.keys(response)
          });
          setError("Dados da avaliação incompletos");
          setIsLoading(false);
          return;
        }

        console.log("[PublicAssessment] Validação bem-sucedida:", {
          templateId: response.template.id,
          templateTitle: response.template.title,
          employeeId: response.employeeId,
          questionsCount: response.template.questions?.length || 0
        });

        setValidationComplete(true);

        // Aguardar um pouco para mostrar o feedback visual
        setTimeout(() => {
          console.log("[PublicAssessment] Redirecionando para portal do funcionário...");
          // Redirecionar para o portal do funcionário com todos os parâmetros necessários
          const redirectUrl = `/employee-portal/${response.template.id}?token=${token}&employee=${response.employeeId}`;
          console.log("[PublicAssessment] URL de redirecionamento:", redirectUrl);
          navigate(redirectUrl);
        }, 1500);

      } catch (err) {
        console.error("[PublicAssessment] Erro crítico na validação:", {
          error: err,
          message: err?.message || 'Unknown error',
          stack: err?.stack || 'No stack trace'
        });
        setError("Erro crítico ao validar avaliação: " + (err?.message || 'Erro desconhecido'));
        setIsLoading(false);
      }
    };

    validateAndRedirect();
  }, [token, navigate, retryCount]);

  const handleRetry = () => {
    console.log("[PublicAssessment] Tentando novamente...");
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setError(null);
    setValidationComplete(false);
  };

  const handleGoHome = () => {
    console.log("[PublicAssessment] Redirecionando para home...");
    navigate("/");
  };

  if (isLoading || validationComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            {validationComplete ? (
              <div className="flex items-center space-x-3 text-green-600">
                <CheckCircle className="h-6 w-6" />
                <div>
                  <div className="font-medium">Validação concluída!</div>
                  <div className="text-sm text-muted-foreground">
                    Redirecionando para a avaliação...
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <div>
                  <div className="font-medium">Validando link de avaliação...</div>
                  <div className="text-sm text-muted-foreground">
                    Verificando permissões e dados...
                    {retryCount > 0 && ` (Tentativa ${retryCount + 1})`}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-destructive mb-4">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Erro na Validação</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            
            {/* Informações de debug para desenvolvimento */}
            {process.env.NODE_ENV === 'development' && token && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs">
                <strong>Debug Info:</strong><br />
                Token: {token}<br />
                Tentativas: {retryCount + 1}<br />
                URL: {window.location.href}
              </div>
            )}
            
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={handleGoHome}
              >
                Voltar ao início
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleRetry}
                disabled={retryCount >= 3}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {retryCount >= 3 ? 'Muitas tentativas' : 'Tentar novamente'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
