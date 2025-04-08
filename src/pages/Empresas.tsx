
import { useState } from "react";
import { PlusCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/forms/CompanyForm";
import { CompanyCard, CompanyData } from "@/components/companies/CompanyCard";
import { toast } from "sonner";

export default function Empresas() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<CompanyData[]>([]);

  const handleAddCompany = (data: Omit<CompanyData, "id">) => {
    const newCompany = {
      ...data,
      id: `company-${Date.now()}`,  // Simple ID generation for demonstration
    };
    
    setCompanies([...companies, newCompany]);
    setIsDialogOpen(false);
    toast.success("Empresa cadastrada com sucesso!");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as empresas e suas filiais, incluindo informações do PGR.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>
      
      {companies.length === 0 ? (
        <div className="flex items-center justify-center h-64 border rounded-lg">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhuma empresa cadastrada</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Cadastre empresas e filiais, gerencie informações sobre o ramo de atividade
              e registre os responsáveis pelo PGR.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Cadastrar Empresa
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              onClick={() => toast.info("Edição de empresa será implementada em breve!")}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastro de Empresa</DialogTitle>
            <DialogDescription>
              Preencha os dados da empresa para cadastrá-la no sistema.
            </DialogDescription>
          </DialogHeader>
          <CompanyForm onSubmit={handleAddCompany} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
