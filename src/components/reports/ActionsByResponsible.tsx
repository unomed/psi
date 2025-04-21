
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";

interface ActionsByResponsibleProps {
  filters: {
    dateRange: DateRange;
    selectedSector: string;
    selectedRole: string;
    selectedCompany?: string | null;
  };
}

export function ActionsByResponsible({ filters }: ActionsByResponsibleProps) {
  // Mock data - em uma aplicação real, isso seria filtrado com base nos filtros
  const responsibles = [
    { name: "Maria Silva (Recursos Humanos)", actions: 9, percentage: 90 },
    { name: "João Pereira (SESMT)", actions: 8, percentage: 80 },
    { name: "Carlos Santos (Segurança)", actions: 5, percentage: 50 },
    { name: "Ana Oliveira (Produção)", actions: 2, percentage: 20 },
    { name: "Roberto Gomes (TI)", actions: 4, percentage: 40 },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ações por Responsável</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {responsibles.map((responsible) => (
            <div key={responsible.name} className="flex justify-between items-center">
              <span className="truncate max-w-[250px]">{responsible.name}</span>
              <div className="w-2/3 bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-primary h-4 rounded-full" 
                  style={{width: `${responsible.percentage}%`}}
                ></div>
              </div>
              <span className="font-bold">{responsible.actions}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
