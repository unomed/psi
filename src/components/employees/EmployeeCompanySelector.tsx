
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EmployeeCompanySelectorProps {
  selectedCompany: string | null;
  onCompanyChange: (value: string) => void;
  userCompanies: Array<{ companyId: string; companyName: string }>;
}

export function EmployeeCompanySelector({ 
  selectedCompany, 
  onCompanyChange, 
  userCompanies 
}: EmployeeCompanySelectorProps) {
  if (userCompanies.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Empresa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-md">
          <Label htmlFor="company">Selecione a empresa:</Label>
          <Select 
            value={selectedCompany || ""} 
            onValueChange={onCompanyChange}
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
  );
}
