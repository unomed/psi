
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Database } from "lucide-react";

interface MigrationStats {
  employee_tags: number;
  role_required_tags: number;
  employee_tag_types: number;
  funcionarios_com_tags_jsonb: number;
  funcoes_com_tags_obrigatorias: number;
}

export function TagMigrationStatus() {
  const [stats, setStats] = useState<MigrationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkMigrationStatus = async () => {
    setIsLoading(true);
    try {
      console.log("[TagMigrationStatus] Verificando status da migração...");

      // Verificar quantos registros foram migrados
      const { data: migrationData, error: migrationError } = await supabase
        .from('employee_tags')
        .select('id', { count: 'exact', head: true });

      const { data: roleTagsData, error: roleTagsError } = await supabase
        .from('role_required_tags')
        .select('id', { count: 'exact', head: true });

      const { data: tagTypesData, error: tagTypesError } = await supabase
        .from('employee_tag_types')
        .select('id', { count: 'exact', head: true });

      // Verificar se ainda há dados JSONB não migrados
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('employee_tags')
        .not('employee_tags', 'eq', '[]')
        .not('employee_tags', 'is', null);

      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('required_tags')
        .not('required_tags', 'eq', '[]')
        .not('required_tags', 'is', null);

      if (migrationError || roleTagsError || tagTypesError || employeesError || rolesError) {
        throw new Error('Erro ao verificar status da migração');
      }

      const migrationStats: MigrationStats = {
        employee_tags: migrationData?.length || 0,
        role_required_tags: roleTagsData?.length || 0,
        employee_tag_types: tagTypesData?.length || 0,
        funcionarios_com_tags_jsonb: employeesData?.length || 0,
        funcoes_com_tags_obrigatorias: rolesData?.length || 0
      };

      setStats(migrationStats);
      
      console.log("[TagMigrationStatus] Status da migração:", migrationStats);

      if (migrationStats.funcionarios_com_tags_jsonb === 0 && migrationStats.funcoes_com_tags_obrigatorias === 0) {
        toast.success("✅ Migração completa! Todos os dados foram convertidos para o sistema relacional.");
      } else {
        toast.warning(`⚠️ Migração parcial: ${migrationStats.funcionarios_com_tags_jsonb} funcionários e ${migrationStats.funcoes_com_tags_obrigatorias} funções ainda possuem dados JSONB.`);
      }

    } catch (error: any) {
      console.error("[TagMigrationStatus] Erro:", error);
      toast.error(`Erro ao verificar migração: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const isMigrationComplete = stats && 
    stats.funcionarios_com_tags_jsonb === 0 && 
    stats.funcoes_com_tags_obrigatorias === 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Status da Migração de Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {isMigrationComplete ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <Badge variant="default" className="bg-green-100 text-green-800">
                Migração Completa
              </Badge>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Migração Pendente
              </Badge>
            </>
          )}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={checkMigrationStatus}
            disabled={isLoading}
          >
            {isLoading ? "Verificando..." : "Atualizar Status"}
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Dados Migrados</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Tags de Funcionários:</span>
                  <Badge variant="outline">{stats.employee_tags}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tags Obrigatórias:</span>
                  <Badge variant="outline">{stats.role_required_tags}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tipos de Tags:</span>
                  <Badge variant="outline">{stats.employee_tag_types}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Dados JSONB Restantes</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Funcionários:</span>
                  <Badge variant={stats.funcionarios_com_tags_jsonb > 0 ? "destructive" : "default"}>
                    {stats.funcionarios_com_tags_jsonb}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Funções:</span>
                  <Badge variant={stats.funcoes_com_tags_obrigatorias > 0 ? "destructive" : "default"}>
                    {stats.funcoes_com_tags_obrigatorias}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isMigrationComplete && stats && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <strong>Ação Necessária:</strong> Ainda existem dados em formato JSONB que precisam ser migrados. 
              Execute novamente a função de migração para completar o processo.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
