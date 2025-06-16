
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function TagSystemDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostic = async () => {
    setIsLoading(true);
    try {
      console.log("[TagSystemDebug] Iniciando diagnóstico...");
      
      // 1. Verificar permissões do usuário
      const { data: permissions, error: permError } = await supabase
        .rpc('debug_user_tag_permissions');
      
      if (permError) {
        console.error("[TagSystemDebug] Erro ao verificar permissões:", permError);
        throw permError;
      }

      // 2. Verificar tipos de tags disponíveis
      const { data: tagTypes, error: tagTypesError } = await supabase
        .from('employee_tag_types')
        .select('*')
        .eq('is_active', true);

      if (tagTypesError) {
        console.error("[TagSystemDebug] Erro ao buscar tipos de tags:", tagTypesError);
      }

      // 3. Verificar tags de funcionários
      const { data: employeeTags, error: empTagsError } = await supabase
        .from('employee_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .limit(5);

      if (empTagsError) {
        console.error("[TagSystemDebug] Erro ao buscar tags de funcionários:", empTagsError);
      }

      // 4. Verificar tags obrigatórias de funções
      const { data: requiredTags, error: reqTagsError } = await supabase
        .from('role_required_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .limit(5);

      if (reqTagsError) {
        console.error("[TagSystemDebug] Erro ao buscar tags obrigatórias:", reqTagsError);
      }

      const diagnosticResult = {
        permissions: permissions?.[0] || null,
        tagTypes: tagTypes || [],
        employeeTags: employeeTags || [],
        requiredTags: requiredTags || [],
        errors: {
          permissions: permError?.message,
          tagTypes: tagTypesError?.message,
          employeeTags: empTagsError?.message,
          requiredTags: reqTagsError?.message
        }
      };

      setDebugInfo(diagnosticResult);
      
      console.log("[TagSystemDebug] Diagnóstico completo:", diagnosticResult);
      
      // Análise dos resultados
      if (diagnosticResult.permissions?.is_superadmin) {
        toast.success("✅ Usuário é superadmin - todas as permissões disponíveis");
      } else if (diagnosticResult.permissions?.accessible_companies?.length > 0) {
        toast.success(`✅ Usuário tem acesso a ${diagnosticResult.permissions.accessible_companies.length} empresa(s)`);
      } else {
        toast.warning("⚠️ Usuário não tem acesso a nenhuma empresa");
      }

      if (diagnosticResult.tagTypes.length === 0) {
        toast.warning("⚠️ Nenhum tipo de tag encontrado");
      } else {
        toast.success(`✅ ${diagnosticResult.tagTypes.length} tipos de tags disponíveis`);
      }

    } catch (error: any) {
      console.error("[TagSystemDebug] Erro durante diagnóstico:", error);
      toast.error(`Erro no diagnóstico: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testTagCreation = async () => {
    if (!debugInfo?.tagTypes?.length) {
      toast.error("Nenhum tipo de tag disponível para teste");
      return;
    }

    try {
      // Buscar um funcionário para teste
      const { data: employees } = await supabase
        .from('employees')
        .select('id, name')
        .limit(1);

      if (!employees?.length) {
        toast.error("Nenhum funcionário encontrado para teste");
        return;
      }

      const testEmployee = employees[0];
      const testTagType = debugInfo.tagTypes[0];

      console.log("[TagSystemDebug] Testando criação de tag:", {
        employeeId: testEmployee.id,
        tagTypeId: testTagType.id
      });

      const { data, error } = await supabase
        .from('employee_tags')
        .insert({
          employee_id: testEmployee.id,
          tag_type_id: testTagType.id,
          notes: 'Tag de teste criada pelo diagnóstico'
        })
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .single();

      if (error) {
        console.error("[TagSystemDebug] Erro ao criar tag de teste:", error);
        toast.error(`Erro ao criar tag: ${error.message}`);
      } else {
        console.log("[TagSystemDebug] Tag de teste criada com sucesso:", data);
        toast.success(`✅ Tag de teste criada: ${testTagType.name} para ${testEmployee.name}`);
        
        // Atualizar dados do diagnóstico
        runDiagnostic();
      }
    } catch (error: any) {
      console.error("[TagSystemDebug] Erro durante teste:", error);
      toast.error(`Erro no teste: ${error.message}`);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔧 Diagnóstico do Sistema de Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runDiagnostic} disabled={isLoading}>
            {isLoading ? "Executando..." : "Executar Diagnóstico"}
          </Button>
          {debugInfo && (
            <Button onClick={testTagCreation} variant="outline">
              Testar Criação de Tag
            </Button>
          )}
        </div>

        {debugInfo && (
          <div className="space-y-4">
            {/* Permissões */}
            <div>
              <h3 className="font-medium mb-2">Permissões do Usuário</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant={debugInfo.permissions?.is_superadmin ? "default" : "secondary"}>
                  {debugInfo.permissions?.is_superadmin ? "Superadmin" : "Usuário Regular"}
                </Badge>
                <Badge variant={debugInfo.permissions?.accessible_companies?.length > 0 ? "default" : "destructive"}>
                  {debugInfo.permissions?.accessible_companies?.length || 0} Empresas
                </Badge>
                <Badge variant={debugInfo.permissions?.can_see_employee_tags ? "default" : "destructive"}>
                  {debugInfo.permissions?.can_see_employee_tags ? "Pode Ver Tags" : "Sem Acesso a Tags"}
                </Badge>
              </div>
              {debugInfo.permissions?.accessible_companies?.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  IDs das empresas: {debugInfo.permissions.accessible_companies.join(", ")}
                </p>
              )}
            </div>

            {/* Tipos de Tags */}
            <div>
              <h3 className="font-medium mb-2">Tipos de Tags ({debugInfo.tagTypes.length})</h3>
              <div className="flex flex-wrap gap-2">
                {debugInfo.tagTypes.map((tag: any) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name} {tag.category && `(${tag.category})`}
                  </Badge>
                ))}
                {debugInfo.tagTypes.length === 0 && (
                  <span className="text-muted-foreground text-sm">Nenhum tipo de tag encontrado</span>
                )}
              </div>
            </div>

            {/* Tags de Funcionários */}
            <div>
              <h3 className="font-medium mb-2">Tags de Funcionários (amostra: {debugInfo.employeeTags.length})</h3>
              <div className="space-y-1">
                {debugInfo.employeeTags.map((tag: any) => (
                  <div key={tag.id} className="text-sm">
                    Tag: {tag.tag_type?.name} - Funcionário: {tag.employee_id}
                  </div>
                ))}
                {debugInfo.employeeTags.length === 0 && (
                  <span className="text-muted-foreground text-sm">Nenhuma tag de funcionário encontrada</span>
                )}
              </div>
            </div>

            {/* Tags Obrigatórias */}
            <div>
              <h3 className="font-medium mb-2">Tags Obrigatórias (amostra: {debugInfo.requiredTags.length})</h3>
              <div className="space-y-1">
                {debugInfo.requiredTags.map((tag: any) => (
                  <div key={tag.id} className="text-sm">
                    Tag: {tag.tag_type?.name} - Função: {tag.role_id}
                  </div>
                ))}
                {debugInfo.requiredTags.length === 0 && (
                  <span className="text-muted-foreground text-sm">Nenhuma tag obrigatória encontrada</span>
                )}
              </div>
            </div>

            {/* Erros */}
            {Object.values(debugInfo.errors).some(error => error) && (
              <div>
                <h3 className="font-medium mb-2 text-red-600">Erros Encontrados</h3>
                <div className="space-y-1">
                  {Object.entries(debugInfo.errors).map(([key, error]) => 
                    error && (
                      <div key={key} className="text-sm text-red-600">
                        {key}: {error}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
