
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { fetchAssessmentByToken } from "@/services/assessment/results";

export default function PublicAssessment() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToEmployeePortal = async () => {
      if (!token) {
        setError("Token de avaliação não fornecido");
        setIsLoading(false);
        return;
      }

      try {
        // Verificar se o token é válido
        const response = await fetchAssessmentByToken(token);
        
        if (response.error) {
          setError(response.error);
          setIsLoading(false);
          return;
        }

        // Redirecionar para o portal do funcionário com o token
        navigate(`/employee-portal/${response.template?.id}?token=${token}&employee=${response.employee?.id || ''}`);
      } catch (err) {
        console.error("Erro ao verificar avaliação:", err);
        setError("Erro ao carregar avaliação");
        setIsLoading(false);
      }
    };

    redirectToEmployeePortal();
  }, [token, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Redirecionando para a área do funcionário...</span>
            </div>
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
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Erro</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button 
              className="mt-4 w-full" 
              onClick={() => navigate("/")}
            >
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
