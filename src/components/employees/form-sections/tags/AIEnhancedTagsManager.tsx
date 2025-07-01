
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Zap } from "lucide-react";
import { IntelligentTagSuggestions } from "./IntelligentTagSuggestions";
import { CompetencyGapAnalysis } from "./CompetencyGapAnalysis";
import { PredictiveReports } from "./PredictiveReports";
import { useOptimizedEmployeeTags } from "@/hooks/useOptimizedEmployeeTags";

interface AIEnhancedTagsManagerProps {
  employeeId?: string;
  roleId?: string;
  companyId?: string;
  sectorId?: string;
  onTagsChange?: (tags: string[]) => void;
}

export function AIEnhancedTagsManager({ 
  employeeId, 
  roleId, 
  companyId, 
  sectorId, 
  onTagsChange 
}: AIEnhancedTagsManagerProps) {
  const [activeTab, setActiveTab] = useState("suggestions");
  
  const { addEmployeeTag } = useOptimizedEmployeeTags({ 
    employeeId, 
    realTimeUpdates: true 
  });

  const handleAddSuggestedTag = async (tagTypeId: string) => {
    if (!employeeId) return;
    
    try {
      await addEmployeeTag.mutateAsync({
        tagTypeId,
        acquiredDate: new Date().toISOString().split('T')[0]
      });
      onTagsChange?.([]);
    } catch (error) {
      console.error("Error adding suggested tag:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Sistema de IA e Automação Avançada
          <Badge variant="outline">🤖 AI-Powered</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Sugestões IA
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Análise de Gaps
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Relatórios Preditivos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-4 mt-4">
            <IntelligentTagSuggestions
              roleId={roleId}
              employeeId={employeeId}
              onAddTag={handleAddSuggestedTag}
            />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 mt-4">
            <CompetencyGapAnalysis
              employeeId={employeeId}
              roleId={roleId}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4 mt-4">
            <PredictiveReports
              companyId={companyId}
              sectorId={sectorId}
              timeRange="quarter"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
