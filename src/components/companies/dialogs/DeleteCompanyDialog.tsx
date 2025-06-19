
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, AlertTriangle, Building2 } from "lucide-react";

interface DeleteCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: any;
  onDelete: (companyId: string) => Promise<void>;
}

export function DeleteCompanyDialog({ open, onOpenChange, company, onDelete }: DeleteCompanyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!company?.id) return;

    setIsLoading(true);
    try {
      await onDelete(company.id);
      onOpenChange(false);
      toast.success('Empresa excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      toast.error('Erro ao excluir empresa');
    } finally {
      setIsLoading(false);
    }
  };

  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Excluir Empresa
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Todos os dados relacionados a esta empresa serão permanentemente removidos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Dados da Empresa</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Nome:</span> {company.name}
              </div>
              <div>
                <span className="font-medium">CNPJ:</span> {company.cnpj}
              </div>
              {company.city && company.state && (
                <div>
                  <span className="font-medium">Localização:</span> {company.city}, {company.state}
                </div>
              )}
              {company.industry && (
                <div>
                  <span className="font-medium">Ramo:</span> {company.industry}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Atenção!</span>
            </div>
            <p className="text-sm text-destructive/80">
              Ao excluir esta empresa, você também removerá:
            </p>
            <ul className="text-sm text-destructive/80 mt-2 list-disc list-inside">
              <li>Todos os funcionários vinculados</li>
              <li>Avaliações e resultados</li>
              <li>Setores e funções</li>
              <li>Planos de ação</li>
              <li>Histórico de atividades</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir Empresa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
