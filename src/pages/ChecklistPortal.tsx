
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { validatePortalAccess } from "@/services/assessment/portalLinkGeneration";
import { toast } from "sonner";

export default function ChecklistPortal() {
  const { checklistName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  const employeeId = searchParams.get("employee");
  const assessmentId = searchParams.get("assessment");
  const token = searchParams.get("token");

  console.log("[ChecklistPortal] Parâmetros recebidos:", {
    checklistName,
    employeeId,
    assessmentId,
    token: token ? `${token.substring(0, 10)}...` : null
  });

  useEffect(() => {
    const validateAndRedirect = async () => {
      try {
        // Verificar se todos os parâmetros necessários estão presentes
        if (!employeeId || !assessmentId || !token) {
          console.error("[ChecklistPortal] Parâmetros obrigatórios em falta");
          toast.error("Link inválido. Parâmetros obrigatórios em falta.");
          setIsValidating(false);
          return;
        }

        // Validar acesso ao portal
        const isValid = await validatePortalAccess(employeeId, assessmentId, token);

        if (!isValid) {
          console.error("[ChecklistPortal] Acesso inválido");
          toast.error("Link inválido ou expirado. Entre em contato com o RH.");
          setIsValidating(false);
          return;
        }

        // Redirecionar para o portal do funcionário com os parâmetros
        const portalUrl = `/employee-portal?employee=${employeeId}&assessment=${assessmentId}&token=${token}`;
        
        console.log("[ChecklistPortal] Redirecionando para:", portalUrl);
        navigate(portalUrl, { replace: true });

      } catch (error) {
        console.error("[ChecklistPortal] Erro durante validação:", error);
        toast.error("Erro ao validar acesso. Tente novamente.");
        setIsValidating(false);
      }
    };

    validateAndRedirect();
  }, [employeeId, assessmentId, token, navigate]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner />
          <div className="text-muted-foreground">
            <h2 className="text-xl font-semibold mb-2">Validando acesso ao questionário</h2>
            <p>Aguarde enquanto verificamos suas credenciais...</p>
            {checklistName && (
              <p className="mt-2 text-sm">Checklist: <span className="font-medium">{checklistName.replace(/-/g, ' ')}</span></p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-red-600">
          <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
          <p>Não foi possível validar o acesso ao questionário.</p>
          <p className="text-sm mt-2">Entre em contato com o RH para obter um novo link.</p>
        </div>
      </div>
    </div>
  );
}
