
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertCircle, Plus } from "lucide-react";
import { useIntelligentTagSuggestions } from "@/hooks/useIntelligentTagSuggestions";

interface IntelligentTagSuggestionsProps {
  roleId?: string;
  employeeId?: string;
  onAddTag?: (tagTypeId: string) => void;
}

export function IntelligentTagSuggestions({ 
  roleId, 
  employeeId, 
  onAddTag 
}: IntelligentTagSuggestionsProps) {
  const { suggestions, isLoading } = useIntelligentTagSuggestions(roleId, employeeId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Carregando Sugestões IA...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Sugestões Inteligentes de Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhuma sugestão disponível no momento.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default: return <Plus className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Sugestões Inteligentes de Tags
          <Badge variant="outline">{suggestions.length} sugestões</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.slice(0, 5).map((suggestion, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {getPriorityIcon(suggestion.priority)}
                <span className="font-medium">{suggestion.tagType.name}</span>
                <Badge variant={getPriorityColor(suggestion.priority)}>
                  {Math.round(suggestion.confidence * 100)}% confiança
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {suggestion.reason}
              </p>
              {suggestion.tagType.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {suggestion.tagType.description}
                </p>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddTag?.(suggestion.tagType.id)}
              className="ml-4"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        ))}
        
        {suggestions.length > 5 && (
          <div className="text-center pt-2">
            <Badge variant="outline">
              +{suggestions.length - 5} sugestões adicionais
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
