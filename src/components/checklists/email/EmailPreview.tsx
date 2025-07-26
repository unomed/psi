
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, User, Calendar, Link as LinkIcon, Building } from "lucide-react";

interface EmailPreviewProps {
  subject: string;
  body: string;
  employeeName: string;
  employeeEmail: string;
  templateName: string;
  linkUrl?: string;
  companyName?: string;
}

export function EmailPreview({
  subject,
  body,
  employeeName,
  employeeEmail,
  templateName,
  linkUrl,
  companyName = "[Nome da Empresa]"
}: EmailPreviewProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Preview do Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email headers */}
        <div className="space-y-2 p-4 bg-muted/50 rounded-md">
          <div className="flex items-center gap-2">
            <strong>Para:</strong>
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {employeeName} ({employeeEmail})
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <strong>Empresa:</strong>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {companyName}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <strong>Assunto:</strong>
            <span className="text-sm">{subject.replace(/\{\{companyName\}\}/g, companyName)}</span>
          </div>
          <div className="flex items-center gap-2">
            <strong>Template:</strong>
            <Badge variant="secondary">{templateName}</Badge>
          </div>
          {linkUrl && (
            <div className="flex items-center gap-2">
              <strong>Link:</strong>
              <Badge variant="outline" className="flex items-center gap-1">
                <LinkIcon className="h-3 w-3" />
                Link único gerado
              </Badge>
            </div>
          )}
        </div>

        {/* Email body preview */}
        <div className="border rounded-md">
          <div className="bg-primary/10 p-3 border-b">
            <div className="font-semibold text-sm">Corpo do Email:</div>
          </div>
          <div className="p-4">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: body
                  .replace(/\{\{employeeName\}\}/g, employeeName)
                  .replace(/\{\{templateName\}\}/g, templateName)
                  .replace(/\{\{linkUrl\}\}/g, linkUrl || '[Link será gerado automaticamente]')
                  .replace(/\{\{companyName\}\}/g, companyName)
                  // Basic XSS protection
                  .replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#x27;')
                  .replace(/\n/g, '<br>')
              }}
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-md">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3" />
            Este email será enviado imediatamente após confirmação
          </div>
          <div>
            • O nome da empresa será inserido automaticamente nos templates<br/>
            • Links únicos serão gerados automaticamente para cada funcionário<br/>
            • O progresso de entrega será monitorado na aba "Histórico"<br/>
            • Funcionários receberão notificação personalizada da empresa
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
