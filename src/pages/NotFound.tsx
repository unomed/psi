
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-psi-blue-50 to-psi-teal-50">
      <div className="text-center space-y-6 max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-psi-blue-700">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        <p className="text-gray-500">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button onClick={() => navigate("/")} className="mt-6">
          <Home className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
