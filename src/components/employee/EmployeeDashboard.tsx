
import { useEffect, useState } from "react";
import { CalendarIcon, ChevronDown, ChevronUp, Clock, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ScheduledAssessment } from "@/types";

interface AssessmentCardProps {
  assessment: ScheduledAssessment;
}

function AssessmentCard({ assessment }: AssessmentCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{assessment.checklist_templates?.title}</CardTitle>
        <CardDescription>
          <Clock className="mr-2 h-4 w-4 inline-block" />
          {assessment.checklist_templates?.title || "Avaliação disponível"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={65} />
      </CardContent>
    </Card>
  );
}

interface EmployeeDashboardProps {
  employeeId?: string;
}

export function EmployeeDashboard({ employeeId }: EmployeeDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAssessments, setPendingAssessments] = useState<ScheduledAssessment[]>([]);
  const [completedAssessments, setCompletedAssessments] = useState<ScheduledAssessment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Você será redirecionado para a página de login.",
    });

    // Simulate logout process
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  // Mock pending assessments with correct types
  const mockPendingAssessments: ScheduledAssessment[] = [
    {
      id: "1",
      template_id: "template-1",
      employee_id: "emp-1",
      scheduled_date: new Date().toISOString(),
      status: "pending",
      company_id: "company-1",
      created_at: new Date().toISOString(),
      // Propriedades de compatibilidade legacy
      templateId: "template-1",
      employeeId: "emp-1", 
      scheduledDate: new Date(),
      sentAt: new Date(),
      completedAt: new Date(),
      linkUrl: "/assessment/1",
      checklist_templates: {
        title: "Avaliação de Estresse no Trabalho"
      }
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Seu Nome</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    seuemail@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User2 className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Agendamentos</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Clock className="mr-2 h-4 w-4" />
                <span>Histórico</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Avaliações Pendentes
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : pendingAssessments.length > 0 ? (
            <div className="space-y-4">
              {mockPendingAssessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhuma avaliação pendente no momento.</p>
          )}
        </div>

        <Separator className="my-8" />

        <div className="py-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Avaliações Concluídas
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : completedAssessments.length > 0 ? (
            <ScrollArea className="rounded-md border">
              {completedAssessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </ScrollArea>
          ) : (
            <p className="text-gray-500">Nenhuma avaliação concluída ainda.</p>
          )}
        </div>
      </main>

      <footer className="bg-white mt-auto py-4 text-center text-gray-500">
        © {new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.
      </footer>
    </div>
  );
}
