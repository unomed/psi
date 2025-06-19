
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react";

export interface CompanyData {
  id: string;
  name: string;
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

interface CompanyCardProps {
  company: CompanyData;
  onEdit: () => void;
  onDelete: () => void;
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{company.name}</CardTitle>
              {company.cnpj && (
                <Badge variant="outline" className="mt-1">
                  CNPJ: {company.cnpj}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {company.razao_social && (
          <div className="text-sm">
            <span className="font-medium">Razão Social:</span> {company.razao_social}
          </div>
        )}
        
        {company.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {company.email}
          </div>
        )}
        
        {company.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            {company.phone}
          </div>
        )}
        
        {company.address && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {company.address}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
