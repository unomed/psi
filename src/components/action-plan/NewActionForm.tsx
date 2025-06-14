
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function NewActionForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Ação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Descrição da Ação *</label>
            <Textarea placeholder="Descreva a ação a ser realizada" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Risco Relacionado</label>
              <select className="border p-2 w-full rounded">
                <option value="">Selecione um risco...</option>
                <option value="PS001">PS001 - Sobrecarga de trabalho no setor de atendimento</option>
                <option value="PS003">PS003 - Assédio moral na equipe de vendas</option>
                <option value="PS007">PS007 - Falta de autonomia na equipe de produção</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Departamento *</label>
              <select className="border p-2 w-full rounded">
                <option value="">Selecione um departamento...</option>
                <option value="atendimento">Atendimento</option>
                <option value="vendas">Vendas</option>
                <option value="producao">Produção</option>
                <option value="rh">Recursos Humanos</option>
                <option value="ti">TI</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Responsável *</label>
              <select className="border p-2 w-full rounded">
                <option value="">Selecione um responsável...</option>
                <option value="maria">Maria Silva (RH)</option>
                <option value="joao">João Pereira (SESMT)</option>
                <option value="carlos">Carlos Mendes (Supervisor)</option>
                <option value="joana">Joana Lima (TI)</option>
                <option value="ana">Ana Oliveira (Produção)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prazo *</label>
              <Input type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prioridade</label>
              <select className="border p-2 w-full rounded">
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="low">Baixa</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Detalhamento da Ação</label>
            <Textarea 
              className="h-24" 
              placeholder="Forneça mais detalhes sobre como a ação deve ser implementada, recursos necessários, etc."
            />
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" className="mr-2">Cancelar</Button>
            <Button>Salvar Ação</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
