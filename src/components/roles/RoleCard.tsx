import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export interface RoleData {
  id: string;
  name: string;
  description?: string;
  requiredSkills: string[];
  riskLevel?: string;
  sectorId?: string;
  companyId: string;
}

interface RoleCardProps {
  role: RoleData;
  onEdit?: (role: RoleData) => void;
  onDelete?: (role: RoleData) => void;
}

export function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  const { hasRole, hasCompanyAccess } = useAuth();
  const [canModify, setCanModify] = useState(false);
  
  useEffect(() => {
    const checkPermissions = async () => {
      const isEvaluator = await hasRole('evaluator');
      const hasAccess = await hasCompanyAccess(role.companyId);
      
      // User can modify if they're not an evaluator and have access to the company
      setCanModify(!isEvaluator && hasAccess);
    };
    
    checkPermissions();
  }, [role.companyId, hasRole, hasCompanyAccess]);
  
  const getRiskLevelColor = (level?: string) => {
    if (!level) return "bg-gray-100 text-gray-800";
    
    switch (level.toLowerCase()) {
      case "alto":
        return "bg-red-100 text-red-800";
      case "médio":
        return "bg-yellow-100 text-yellow-800";
      case "baixo":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(role);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{role.name}</CardTitle>
          {canModify && (
            <div className="flex gap-1">
              {onEdit && (
                <Button variant="ghost" size="icon" onClick={() => onEdit(role)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="icon" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        {role.riskLevel && (
          <Badge className={`${getRiskLevelColor(role.riskLevel)} mt-1`} variant="outline">
            Risco {role.riskLevel}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {role.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {role.description}
          </p>
        )}
        <div className="mt-auto">
          <p className="text-xs font-medium mb-1">Habilidades requeridas:</p>
          <div className="flex flex-wrap gap-1">
            {role.requiredSkills.slice(0, 5).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {role.requiredSkills.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{role.requiredSkills.length - 5}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
