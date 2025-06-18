import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle, User2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentEmployeeId } from '@/utils/auth';
import { useQuery } from '@tanstack/react-query';
import { getEmployeePendingAssessments, getEmployeeMoodStats } from '@/services/employee/employeeService';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon } from '@radix-ui/react-icons';

interface Assessment {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  dueDate: string;
  completedAt: string | null;
  description: string;
}

interface PendingAssessment {
  assessment_id: string;
  template_title: string;
  template_description: string;
  scheduled_date: string;
  completed_date: string | null;
  days_remaining: number | null;
}

export function EmployeeSimpleDashboard() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const employeeId = getCurrentEmployeeId();
  
  const { data: pendingAssessments = [], isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['employee-pending-assessments', employeeId],
    queryFn: () => getEmployeePendingAssessments(employeeId!),
    enabled: !!employeeId,
  });

  const { data: moodStats } = useQuery({
    queryKey: ['employee-mood-stats', employeeId],
    queryFn: () => getEmployeeMoodStats(employeeId!),
    enabled: !!employeeId,
  });

  // Convert PendingAssessment to Assessment format
  const assessments: Assessment[] = pendingAssessments.map((assessment) => ({
    id: assessment.assessment_id,
    title: assessment.template_title || 'Avaliação',
    status: 'pending' as const,
    dueDate: new Date(assessment.scheduled_date).toLocaleDateString(),
    completedAt: null,
    description: assessment.template_description || 'Sem descrição',
  }));

  const recentAssessments: Assessment[] = pendingAssessments
    .filter(assessment => assessment.days_remaining !== null && assessment.days_remaining <= 7)
    .map((assessment) => ({
      id: assessment.assessment_id,
      title: assessment.template_title || 'Avaliação',
      status: 'pending' as const,
      dueDate: new Date(assessment.scheduled_date).toLocaleDateString(),
      completedAt: null,
      description: assessment.template_description || 'Sem descrição',
    }));

  const handleMoodSelection = (mood: number) => {
    setSelectedMood(mood);
    // Implement mood logging logic here
    console.log(`Mood selected: ${mood}`);
  };

  return (
    <div className="w-full max-w-none p-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Seu Nome</p>
              <p className="text-xs text-muted-foreground">
                seuemail@example.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mood Logging Card */}
        <Card>
          <CardHeader>
            <CardTitle>Como você está se sentindo hoje?</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Button
              variant={selectedMood === 1 ? "secondary" : "outline"}
              onClick={() => handleMoodSelection(1)}
            >
              Muito Ruim
            </Button>
            <Button
              variant={selectedMood === 2 ? "secondary" : "outline"}
              onClick={() => handleMoodSelection(2)}
            >
              Ruim
            </Button>
            <Button
              variant={selectedMood === 3 ? "secondary" : "outline"}
              onClick={() => handleMoodSelection(3)}
            >
              Neutro
            </Button>
            <Button
              variant={selectedMood === 4 ? "secondary" : "outline"}
              onClick={() => handleMoodSelection(4)}
            >
              Bem
            </Button>
            <Button
              variant={selectedMood === 5 ? "secondary" : "outline"}
              onClick={() => handleMoodSelection(5)}
            >
              Muito Bem
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido a funcionalidades importantes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="outline" className="justify-start">
              <User2 className="mr-2 h-4 w-4" />
              Ver meu perfil
            </Button>
            <Button variant="outline" className="justify-start">
              <CalendarDays className="mr-2 h-4 w-4" />
              Agendar Avaliação
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      {/* Assessments Section */}
      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Suas Avaliações Pendentes</CardTitle>
            <CardDescription>Lista de avaliações que você precisa completar.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full">
              <div className="divide-y divide-border">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="py-4">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{assessment.title}</p>
                      <Badge variant="secondary">{assessment.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{assessment.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <CalendarIcon className="mr-1 w-3 h-3" />
                      Entrega: {assessment.dueDate}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Notificações sobre suas últimas atividades e avaliações.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full">
              <div className="divide-y divide-border">
                {recentAssessments.map((assessment) => (
                  <div key={assessment.id} className="py-4">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{assessment.title}</p>
                      <Badge variant="secondary">{assessment.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{assessment.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <CalendarIcon className="mr-1 w-3 h-3" />
                      Entrega: {assessment.dueDate}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
