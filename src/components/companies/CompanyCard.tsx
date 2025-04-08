
import { Building2, MapPin, Phone, Mail, Briefcase, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CompanyData {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
}

interface CompanyCardProps {
  company: CompanyData;
  className?: string;
  onClick?: () => void;
}

export function CompanyCard({ company, className, onClick }: CompanyCardProps) {
  return (
    <Card 
      className={cn("cursor-pointer hover:shadow-md transition-shadow", className)} 
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {company.name}
        </CardTitle>
        <CardDescription>CNPJ: {company.cnpj}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{company.address}, {company.city} - {company.state}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span>{company.industry}</span>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <User className="h-4 w-4" />
            Responsável pelo PGR
          </h4>
          <div className="space-y-1 text-sm">
            <p>{company.contactName}</p>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{company.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{company.contactPhone}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
