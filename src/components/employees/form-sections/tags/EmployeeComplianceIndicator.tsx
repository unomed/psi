import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { EmployeeTag, RoleRequiredTag } from "@/types/tags";

interface EmployeeComplianceIndicatorProps {
  employeeId?: string;
  roleId?: string;
  employeeName?: string;
  roleName?: string;
  onViewDetails?: () => void;
}

interface ComplianceData {
  requiredTags: RoleRequiredTag[];
  employeeTags: EmployeeTag[];
  missingTags: RoleRequiredTag[];
  expiredTags: EmployeeTag[];
  isCompliant: boolean;
  compliancePercentage: number;
}

export function EmployeeComplianceIndicator({ 
  employeeId, 
  roleId, 
  employeeName,
  roleName,
  onViewDetails 
}: EmployeeComplianceIndicatorProps) {
  
  const { data: compliance, isLoading } = useQuery({
    queryKey: ['employee-compliance', employeeId, roleId],
    queryFn: async (): Promise<ComplianceData> => {
      if (!employeeId || !roleId) {
        return {
          requiredTags: [],
          employeeTags: [],
          missingTags: [],
          expiredTags: [],
          isCompliant: true,
          compliancePercentage: 100
        };
      }

      // Buscar tags obrigatórias da função
      const { data: requiredTags, error: reqError } = await supabase
        .from('role_required_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('role_id', roleId)
        .eq('is_mandatory', true);

      if (reqError) throw reqError;

      // Buscar tags do funcionário
      const { data: employeeTags, error: empError } = await supabase
        .from('employee_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('employee_id', employeeId);

      if (empError) throw empError;

      // Verificar quais tags estão faltando
      const employeeTagTypeIds = employeeTags?.map(et => et.tag_type_id) || [];
      const missingTags = requiredTags?.filter(rt => 
        !employeeTagTypeIds.includes(rt.tag_type_id)
      ) || [];

      // Verificar tags expiradas (somente as obrigatórias)
      const requiredTagTypeIds = requiredTags?.map(rt => rt.tag_type_id) || [];
      const expiredTags = employeeTags?.filter(et => 
        requiredTagTypeIds.includes(et.tag_type_id) &&
        et.expiry_date && 
        new Date(et.expiry_date) < new Date()
      ) || [];

      const totalRequired = requiredTags?.length || 0;
      const totalMissing = missingTags.length + expiredTags.length;
      const compliancePercentage = totalRequired > 0 
        ? ((totalRequired - totalMissing) / totalRequired) * 100 
        : 100;

      return {
        requiredTags: requiredTags || [],
        employeeTags: employeeTags || [],
        missingTags,
        expiredTags,
        isCompliant: totalMissing === 0,
        compliancePercentage
      };
    },
    enabled: !!employeeId && !!roleId
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Verificando compliance...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!compliance || !employeeId || !roleId) {
    return null;
  }

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 100) return "text-green-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getComplianceIcon = (percentage: number) => {
    if (percentage >= 100) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (percentage >= 80) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getComplianceStatus = (percentage: number) => {
    if (percentage >= 100) return "Compliant";
    if (percentage >= 80) return "Parcial";
    return "Não Conforme";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {getComplianceIcon(compliance.compliancePercentage)}
              Compliance de Tags
            </CardTitle>
            <CardDescription>
              {employeeName && roleName ? (
                `${employeeName} - ${roleName}`
              ) : (
                "Verificação de tags obrigatórias"
              )}
            </CardDescription>
          </div>
          <Badge 
            variant={compliance.isCompliant ? "default" : "destructive"}
            className={compliance.isCompliant ? "bg-green-100 text-green-800" : ""}
          >
            {getComplianceStatus(compliance.compliancePercentage)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Barra de progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Compliance</span>
            <span className={getComplianceColor(compliance.compliancePercentage)}>
              {compliance.compliancePercentage.toFixed(0)}%
            </span>
          </div>
          <Progress value={compliance.compliancePercentage} className="h-2" />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {compliance.requiredTags.length - compliance.missingTags.length - compliance.expiredTags.length}
            </div>
            <div className="text-xs text-muted-foreground">Conformes</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">
              {compliance.missingTags.length}
            </div>
            <div className="text-xs text-muted-foreground">Faltando</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-600">
              {compliance.expiredTags.length}
            </div>
            <div className="text-xs text-muted-foreground">Expiradas</div>
          </div>
        </div>

        {/* Tags faltando */}
        {compliance.missingTags.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-red-600 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Tags Obrigatórias Faltando:
            </div>
            <div className="flex flex-wrap gap-1">
              {compliance.missingTags.map((tag) => (
                <Badge key={tag.id} variant="destructive" className="text-xs">
                  {tag.tag_type?.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tags expiradas */}
        {compliance.expiredTags.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-yellow-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Tags Obrigatórias Expiradas:
            </div>
            <div className="flex flex-wrap gap-1">
              {compliance.expiredTags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs border-yellow-500 text-yellow-700">
                  {tag.tag_type?.name}
                  {tag.expiry_date && (
                    <span className="ml-1">
                      (exp. {new Date(tag.expiry_date).toLocaleDateString('pt-BR')})
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Ação para ver detalhes */}
        {onViewDetails && (
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewDetails}
              className="w-full"
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver Detalhes das Tags
            </Button>
          </div>
        )}

        {/* Status resumido quando tudo está ok */}
        {compliance.isCompliant && (
          <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded">
            ✅ Todas as tags obrigatórias estão em conformidade
          </div>
        )}
      </CardContent>
    </Card>
  );
}