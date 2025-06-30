import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Trash2, RotateCcw, Search, Mail, Calendar, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScheduledAssessment } from "@/types";

interface EmailHistoryTableProps {
  assessments: ScheduledAssessment[];
  onResendEmail: (assessmentId: string) => void;
  onRefresh: () => void;
}

export function EmailHistoryTable({
  assessments,
  onResendEmail,
  onRefresh
}: EmailHistoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredAssessments = assessments.filter(assessment => {
    const searchMatch =
      assessment.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.checklist_templates?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const dateMatch = selectedDate
      ? format(assessment.scheduledDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      : true;

    const statusMatch = filterStatus ? assessment.status === filterStatus : true;

    return searchMatch && dateMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      sent: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: "Agendada",
      sent: "Enviada",
      completed: "Concluída",
      overdue: "Em Atraso"
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Emails</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por funcionário ou avaliação..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DatePicker
            placeholderText="Filtrar por data"
            selected={selectedDate}
            onChange={setSelectedDate}
          />

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              className="appearance-none pl-8 pr-4 py-2 border rounded leading-tight focus:outline-none focus:shadow-outline w-full"
              onChange={(e) => setFilterStatus(e.target.value)}
              value={filterStatus || ""}
            >
              <option value="">Filtrar por status</option>
              <option value="scheduled">Agendada</option>
              <option value="sent">Enviada</option>
              <option value="completed">Concluída</option>
              <option value="overdue">Em Atraso</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead>Data Agendada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>{assessment.employee_name}</TableCell>
                  <TableCell>{assessment.checklist_templates?.title}</TableCell>
                  <TableCell>
                    {format(assessment.scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(assessment.status)}>
                      {getStatusLabel(assessment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onResendEmail(assessment.id)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Reenviar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Total de agendamentos: {assessments.length}
          </p>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
