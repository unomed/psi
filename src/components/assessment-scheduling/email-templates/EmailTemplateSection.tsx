
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Settings, Plus, AlertCircle } from "lucide-react";
import { EmailTemplateManager } from "./EmailTemplateManager";
import { EmailPreviewDialog } from "./EmailPreviewDialog";
import { useEmailTemplates } from "@/hooks/assessment-scheduling/useEmailTemplates";
import { EmailTemplate } from "@/types";

export function EmailTemplateSection() {
  const [showManager, setShowManager] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  
  const {
    templates,
    isLoading,
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    handleCreateDefaultTemplates
  } = useEmailTemplates();

  const getTemplateStats = () => {
    const stats = {
      total: templates.length,
      byType: {} as Record<string, number>
    };

    templates.forEach(template => {
      if (template.type) {
        stats.byType[template.type] = (stats.byType[template.type] || 0) + 1;
      }
    });

    return stats;
  };

  const stats = getTemplateStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Carregando templates...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Templates de Email
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Gerencie templates personalizados para comunicação automatizada
              </p>
            </div>
            <div className="flex gap-2">
              {templates.length === 0 && (
                <Button variant="outline" onClick={handleCreateDefaultTemplates}>
                  Criar Templates Padrão
                </Button>
              )}
              <Button onClick={() => setShowManager(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Gerenciar Templates
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum template configurado</h3>
              <p className="text-muted-foreground mb-4">
                Crie templates personalizados ou use os templates padrão para começar
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleCreateDefaultTemplates}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Templates Padrão
                </Button>
                <Button variant="outline" onClick={() => setShowManager(true)}>
                  Criar Personalizado
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Template Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Templates Totais</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{stats.byType.initial_invite || 0}</div>
                  <div className="text-sm text-muted-foreground">Convites</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">
                    {(stats.byType.reminder_3_days || 0) + (stats.byType.reminder_1_day || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Lembretes</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{stats.byType.high_risk_alert || 0}</div>
                  <div className="text-sm text-muted-foreground">Alertas</div>
                </div>
              </div>

              {/* Quick Template Preview */}
              <div className="space-y-2">
                <h4 className="font-medium">Templates Disponíveis</h4>
                <div className="grid gap-2">
                  {templates.slice(0, 5).map(template => (
                    <div 
                      key={template.id}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <div>
                        <span className="font-medium">{template.name}</span>
                        {template.type && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {template.type}
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        Visualizar
                      </Button>
                    </div>
                  ))}
                  
                  {templates.length > 5 && (
                    <div className="text-center p-2">
                      <Button variant="link" onClick={() => setShowManager(true)}>
                        Ver todos os {templates.length} templates
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Warning about missing templates */}
              {stats.total < 6 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Para automação completa, recomendamos ter ao menos 6 templates configurados
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Template Manager Modal */}
      {showManager && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gerenciar Templates de Email</h2>
                <Button variant="outline" onClick={() => setShowManager(false)}>
                  Fechar
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <EmailTemplateManager
                templates={templates}
                onCreateTemplate={handleCreateTemplate}
                onUpdateTemplate={handleUpdateTemplate}
                onDeleteTemplate={handleDeleteTemplate}
                onPreviewTemplate={setPreviewTemplate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Dialog */}
      <EmailPreviewDialog
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
      />
    </div>
  );
}
