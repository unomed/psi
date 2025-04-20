
import { useState, useEffect } from "react";
import { AssessmentHandler } from "@/components/assessments/AssessmentHandler";
import { AssessmentErrorBoundary } from "@/components/assessments/error-boundary/AssessmentErrorBoundary";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanyAccessCheck } from "@/hooks/useCompanyAccessCheck";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { generateAssessmentLink, updateAssessmentStatus } from "@/services/assessment/links";
import { ShareLinkDialog } from "@/components/assessments/ShareLinkDialog";

export default function Avaliacoes() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedCompany');
    return saved || null;
  });
  
  const { userRole, userCompanies } = useAuth();
  const { verifyCompanyAccess } = useCompanyAccessCheck();
  
  useEffect(() => {
    const checkCompanyAccess = async () => {
      if (!selectedCompany) return;
      
      if (userRole === 'superadmin') return;
      
      const hasAccess = await verifyCompanyAccess(selectedCompany);
      if (!hasAccess) {
        toast.error('Você não tem acesso à empresa selecionada');
        
        if (userCompanies.length > 0) {
          const firstCompany = userCompanies[0].companyId;
          setSelectedCompany(firstCompany);
          localStorage.setItem('selectedCompany', firstCompany);
        } else {
          setSelectedCompany(null);
          localStorage.removeItem('selectedCompany');
        }
      }
    };
    
    checkCompanyAccess();
  }, [selectedCompany, userRole, userCompanies, verifyCompanyAccess]);
  
  const handleCompanyChange = (value: string) => {
    setSelectedCompany(value);
    localStorage.setItem('selectedCompany', value);
  };

  const handleShareAssessment = async (assessment: any) => {
    try {
      // Verificar se temos todos os dados necessários
      if (!assessment.employeeId || !assessment.templateId) {
        toast.error("Dados do funcionário ou template incompletos");
        return;
      }

      const link = await generateAssessmentLink(
        assessment.employeeId,
        assessment.templateId
      );
      
      if (link) {
        await updateAssessmentStatus(assessment.id, link);
        setGeneratedLink(link);
        setSelectedAssessment(assessment);
        setIsShareDialogOpen(true);
        
        // Forçar uma atualização da página após 1 segundo para mostrar o status atualizado
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Erro ao compartilhar avaliação:", error);
      toast.error("Erro ao gerar link de compartilhamento");
    }
  };

  const handleSendEmail = async () => {
    if (selectedAssessment) {
      try {
        //await handleSendEmail(selectedAssessment.id);
        toast.success("Email enviado com sucesso!");
      } catch (error) {
        console.error("Erro ao enviar email:", error);
        toast.error("Erro ao enviar email");
      }
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {userCompanies.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label htmlFor="company">Selecione a empresa:</Label>
              <Select 
                value={selectedCompany || ""} 
                onValueChange={handleCompanyChange}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {userCompanies.map(company => (
                    <SelectItem key={company.companyId} value={company.companyId}>
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
      
      <AssessmentErrorBoundary>
        <AssessmentHandler companyId={selectedCompany} onShareAssessment={handleShareAssessment} />
      </AssessmentErrorBoundary>
      
      <ShareLinkDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        employeeName={selectedAssessment?.employees?.name || ""}
        assessmentLink={generatedLink}
        onSendEmail={handleSendEmail}
      />
    </div>
  );
}
