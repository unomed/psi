
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Clock } from "lucide-react";
import { useOptimizedEmployeeTags, useOptimizedTagTypes } from "@/hooks/useOptimizedEmployeeTags";
import { useRealTimeTagMonitoring } from "@/hooks/useRealTimeTagMonitoring";
import { useRoleRequiredTags } from "@/hooks/useRoleRequiredTags";
import { TagsOverviewTab } from "./TagsOverviewTab";
import { TagsManagementTab } from "./TagsManagementTab";
import { TagsAnalyticsTab } from "./TagsAnalyticsTab";
import { TagsMonitoringTab } from "./TagsMonitoringTab";
import { AIEnhancedTagsManager } from "./AIEnhancedTagsManager";

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="management">Gestão</TabsTrigger>
            <TabsTrigger value="ai">IA & Automação</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <TagsOverviewTab 
              tagAnalysis={tagAnalysis}
              tagStatistics={tagStatistics}
              employeeTags={employeeTags}
            />
          </TabsContent>

          <TabsContent value="management" className="space-y-4">
            <TagsManagementTab
              employeeTags={employeeTags}
              requiredTags={requiredTags}
              filteredTagTypes={filteredTagTypes}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              addEmployeeTagMutation={addEmployeeTag}
              removeEmployeeTagMutation={removeEmployeeTag}
            />
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <AIEnhancedTagsManager
              employeeId={employeeId}
              roleId={selectedRole}
              companyId={companyId}
              onTagsChange={onTagsChange}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <TagsAnalyticsTab
              tagStatistics={tagStatistics}
              performanceMetrics={performanceMetrics}
            />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <TagsMonitoringTab
              connectionStatus={connectionStatus}
              eventsCount={eventsCount}
              isConnected={isConnected}
              employeeId={employeeId}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
