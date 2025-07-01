import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AssessmentSuccessPage() {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-md">
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Avaliação Concluída!
          </h2>
          <p className="text-green-700 mb-6">
            Suas respostas foram salvas com sucesso. Obrigado por participar!
          </p>
          <Button 
            onClick={() => navigate('/portal')}
            className="bg-green-600 hover:bg-green-700"
          >
            Voltar ao Portal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
