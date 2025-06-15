
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Search, RefreshCw, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScheduledAssessment } from "@/types/assessment";

interface EmailHistoryTableProps {
  assessments: ScheduledAssessment[];
  onResendEmail: (assessmentId: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const statusLabels = {
  scheduled: "Agendado",
  sent: "Enviado",
  completed: "Concluído"
};

const statusColors = {
  scheduled: "secondary",
  sent: "default", 
  completed: "outline"
} as const;

export function EmailHistoryTable({ 
  assessments, 
  onResendEmail, 
  onRefresh,
  isLoading = false 
}: EmailHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = 
      assessment.employees?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.employees?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.checklist_templates?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => (
    <Badge variant={statusColors[status as keyof typeof statusColors] || "secondary"}>
      {statusLabels[status as keyof typeof statusLabels] || status}
    </Badge>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Histórico de Emails
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por funcionário, email ou template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="sent">Enviado</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead>Concluído em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {assessments.length === 0 
                      ? "Nenhum email enviado ainda" 
                      : "Nenhum resultado encontrado para os filtros aplicados"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssessments.map(assessment => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {assessment.employees?.name || "Funcionário não encontrado"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {assessment.employees?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {assessment.checklist_templates?.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(assessment.status)}
                    </TableCell>
                    <TableCell>
                      {assessment.sentAt ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {format(assessment.sentAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {assessment.completedAt ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {format(assessment.completedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {assessment.status === "sent" && !assessment.completedAt && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onResendEmail(assessment.id)}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                        )}
                        {assessment.linkUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(assessment.linkUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats */}
        {assessments.length > 0 && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Total: {assessments.length}</span>
            <span>Enviados: {assessments.filter(a => a.status === 'sent').length}</span>
            <span>Concluídos: {assessments.filter(a => a.status === 'completed').length}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
