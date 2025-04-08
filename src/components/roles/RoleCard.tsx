
import { UserRound, Tag, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface RoleData {
  id: string;
  name: string;
  description?: string;
  sectorId: string;
  companyId: string;
  requiredSkills: string[];
  riskLevel?: string;
}

interface RoleCardProps {
  role: RoleData;
  className?: string;
  onClick?: () => void;
}

export function RoleCard({ role, className, onClick }: RoleCardProps) {
  return (
    <Card 
      className={cn("cursor-pointer hover:shadow-md transition-shadow", className)} 
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5" />
          {role.name}
        </CardTitle>
        {role.description && (
          <CardDescription>{role.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {role.requiredSkills && role.requiredSkills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span>Habilidades necessárias:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.requiredSkills.map((skill) => (
                <Badge key={skill} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {role.riskLevel && (
          <div className="flex items-center gap-2 text-sm mt-4">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <span>Nível de risco: {role.riskLevel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
