
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useOptimizedEmployeeTags, useOptimizedTagTypes } from "@/hooks/useOptimizedEmployeeTags";
import { useRealTimeTagMonitoring } from "@/hooks/useRealTimeTagMonitoring";
import { useRoleRequiredTags } from "@/hooks/useRoleRequiredTags";

interface AdvancedTagsManagerProps {
  employeeId?: string;
  selectedRole: string | null;
  companyId?: string;
  onTagsChange?: (tags: string[]) => void;
}

export function AdvancedTagsManager({ 
  employeeId, 
  selectedRole, 
  companyId, 
  onTagsChange 
}: AdvancedTagsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Hooks otimizados
  const { 
    employeeTags, 
    isLoading: isLoadingTags,
    addEmployeeTag,
    removeEmployeeTag,
    performanceMetrics,
    tagStatistics
  } = useOptimizedEmployeeTags({ 
    employeeId, 
    realTimeUpdates: true,
    enableCache: true 
  });

  const { tagTypes, typeStatistics } = useOptimizedTagTypes();
  const { requiredTags } = useRoleRequiredTags(selectedRole);
  
  // Monitoramento em tempo real
  const { connectionStatus, eventsCount, isConnected } = useRealTimeTagMonitoring({
    employeeId,
    companyId,
    enableNotifications: true,
    onTagChange: (event) => {
      console.log("[AdvancedTagsManager] Evento de tag recebido:", event);
      if (onTagsChange) {
        const newTags = employeeTags.map(t => t.tag_type?.name || '');
        onTagsChange(newTags);
      }
    }
  });

  // Filtros e análises
  const filteredTagTypes = useMemo(() => {
    let filtered = tagTypes;

    if (searchTerm) {
      filtered = filtered.filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(tag => tag.category === categoryFilter);
    }

    return filtered;
  }, [tagTypes, searchTerm, categoryFilter]);

  const tagAnalysis = useMemo(() => {
    const currentTagIds = employeeTags.map(t => t.tag_type_id);
    const requiredTagIds = requiredTags.map(rt => rt.tag_type_id);
    
    const missingRequired = requiredTags.filter(rt => !currentTagIds.includes(rt.tag_type_id));
    const extraTags = employeeTags.filter(et => !requiredTagIds.includes(et.tag_type_id));
    const expiredTags = employeeTags.filter(tag => 
      tag.expiry_date && new Date(tag.expiry_date) < new Date()
    );

    return {
      compliance: requiredTags.length > 0 ? 
        ((requiredTags.length - missingRequired.length) / requiredTags.length * 100) : 100,
      missingRequired: missingRequired.length,
      extraTags: extraTags.length,
      expiredTags: expiredTags.length,
      totalRequired: requiredTags.length
    };
  }, [employeeTags, requiredTags]);

  const handleAddTag = async (tagTypeId: string) => {
    await addEmployeeTag.mutateAsync({
      tagTypeId,
      acquiredDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleRemoveTag = async (tagId: string) => {
    await removeEmployeeTag.mutateAsync(tagId);
  };

  if (isLoadingTags) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 animate-spin" />
            Carregando Sistema Avançado de Tags...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sistema Avançado de Tags
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "🟢 Tempo Real" : "⚪ Offline"}
            </Badge>
            {eventsCount > 0 && (
              <Badge variant="outline">
                {eventsCount} eventos
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="management">Gestão</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Conformidade</p>
                      <p className="text-2xl font-bold text-green-600">
                        {tagAnalysis.compliance.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Tags em Falta</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {tagAnalysis.missingRequired}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Total de Tags</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {tagStatistics.totalTags}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">Expiradas</p>
                      <p className="text-2xl font-bold text-red-600">
                        {tagAnalysis.expiredTags}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tags atuais */}
            <div className="space-y-2">
              <h4 className="font-medium">Tags Atuais</h4>
              <div className="flex flex-wrap gap-2">
                {employeeTags.map(tag => (
                  <Badge 
                    key={tag.id} 
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {tag.tag_type?.name}
                    {tag.expiry_date && new Date(tag.expiry_date) < new Date() && (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Gestão de Tags */}
          <TabsContent value="management" className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar tipos de tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="skill">Habilidades</SelectItem>
                  <SelectItem value="certification">Certificações</SelectItem>
                  <SelectItem value="requirement">Obrigatórias</SelectItem>
                  <SelectItem value="behavioral">Comportamental</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredTagTypes.map(tagType => {
                const hasTag = employeeTags.some(et => et.tag_type_id === tagType.id);
                const isRequired = requiredTags.some(rt => rt.tag_type_id === tagType.id);
                
                return (
                  <Card key={tagType.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-medium">{tagType.name}</h5>
                          {isRequired && (
                            <Badge variant="destructive" size="sm">Obrigatória</Badge>
                          )}
                          {tagType.category && (
                            <Badge variant="outline" size="sm">{tagType.category}</Badge>
                          )}
                        </div>
                        {tagType.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {tagType.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant={hasTag ? "destructive" : "default"}
                        onClick={() => {
                          if (hasTag) {
                            const tag = employeeTags.find(et => et.tag_type_id === tagType.id);
                            if (tag) handleRemoveTag(tag.id);
                          } else {
                            handleAddTag(tagType.id);
                          }
                        }}
                        disabled={addEmployeeTag.isPending || removeEmployeeTag.isPending}
                      >
                        {hasTag ? "Remover" : "Adicionar"}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Distribuição por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(tagStatistics.categoryDistribution).map(([category, count]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="capitalize">{category}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Cache Status:</span>
                      <Badge variant="outline">{performanceMetrics.cacheStatus}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Otimização:</span>
                      <Badge variant={performanceMetrics.isOptimized ? "default" : "secondary"}>
                        {performanceMetrics.isOptimized ? "Ativa" : "Desabilitada"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo Real:</span>
                      <Badge variant={performanceMetrics.hasRealTime ? "default" : "secondary"}>
                        {performanceMetrics.hasRealTime ? "Ativo" : "Desabilitado"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoramento */}
          <TabsContent value="monitoring" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status da Conexão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <Badge variant={isConnected ? "default" : "secondary"}>
                      {connectionStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Eventos Recebidos:</span>
                    <Badge variant="outline">{eventsCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Funcionário Monitorado:</span>
                    <Badge variant="outline">{employeeId || 'Nenhum'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
