
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, Download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EmailRecord {
  id: string;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: Date;
  templateName?: string;
  errorMessage?: string;
}

interface EmailHistoryTableProps {
  emailHistory: EmailRecord[];
}

export function EmailHistoryTable({ emailHistory }: EmailHistoryTableProps) {
  const [filterDate, setFilterDate] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = emailHistory.filter((record) => {
    const matchesDate = !filterDate || 
      format(record.sentAt, 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd');
    const matchesSearch = !searchTerm || 
      record.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'failed': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const exportToCsv = () => {
    const csvContent = [
      ['Destinatário', 'Assunto', 'Status', 'Data de Envio', 'Template', 'Erro'].join(','),
      ...filteredHistory.map(record => [
        record.recipient,
        record.subject,
        record.status,
        format(record.sentAt, 'dd/MM/yyyy HH:mm'),
        record.templateName || '',
        record.errorMessage || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historico-emails-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de E-mails</CardTitle>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por destinatário ou assunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !filterDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filterDate ? format(filterDate, "dd/MM/yyyy") : "Filtrar por data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filterDate}
                onSelect={setFilterDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button onClick={exportToCsv} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destinatário</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Envio</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.recipient}</TableCell>
                <TableCell>{record.subject}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(record.status)}>
                    {record.status === 'sent' ? 'Enviado' : 
                     record.status === 'failed' ? 'Falhou' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell>{format(record.sentAt, 'dd/MM/yyyy HH:mm')}</TableCell>
                <TableCell>{record.templateName || '-'}</TableCell>
                <TableCell>
                  {record.status === 'failed' && record.errorMessage && (
                    <Button variant="ghost" size="sm">
                      Ver Erro
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
