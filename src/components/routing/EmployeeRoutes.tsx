
import { Routes, Route } from "react-router-dom";
import EmployeePortal from "@/pages/EmployeePortal";
import PublicAssessment from "@/pages/PublicAssessment";
import { EmployeeAuthProvider } from "@/contexts/EmployeeAuthContext";
import EmployeeLogin from "@/pages/auth/EmployeeLogin";

export function EmployeeRoutes() {
  console.log('[EmployeeRoutes] Renderizando rotas de funcionários');
  
  return (
    <EmployeeAuthProvider>
      <Routes>
        {/* Login de funcionário */}
        <Route path="/auth/employee" element={<EmployeeLogin />} />
        
        {/* Portal do funcionário */}
        <Route path="/employee-portal" element={<EmployeePortal />} />
        <Route path="/employee-portal/:templateId" element={<EmployeePortal />} />
        
        {/* Avaliações públicas com tokens - rotas melhoradas */}
        <Route path="/avaliacao/:token" element={<PublicAssessment />} />
        <Route path="/assessment/:token" element={<PublicAssessment />} />
      </Routes>
    </EmployeeAuthProvider>
  );
}
