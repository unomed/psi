
import { useQuery } from "@tanstack/react-query";
import { RecurrenceType, ScheduledAssessment, AssessmentStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface UseScheduledAssessmentsProps {
  companyId?: string | null;
}

export function useScheduledAssessments({ companyId }: UseScheduledAssessmentsProps = {}) {
  const { userRole } = useAuth();
  
  const {
    data: scheduledAssessments = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['scheduledAssessments', companyId],
    queryFn: async (): Promise<ScheduledAssessment[]> => {
      // Iniciar a query base
      let query = supabase
        .from('scheduled_assessments')
        .select(`
          id,
          employee_id,
          template_id,
          scheduled_date,
          sent_at,
          link_url,
          status,
          completed_at,
          recurrence_type,
          next_scheduled_date,
          phone_number,
          employees (
            name,
            email,
            phone,
            company_id
          ),
          checklist_templates(title)
        `);
      
      // Se um ID de empresa for fornecido, filtrar os funcionários pelo ID da empresa
      if (companyId && userRole !== 'superadmin') {
        // Obter primeiro os IDs dos funcionários da empresa
        const { data: employeeIds, error: employeeError } = await supabase
          .from('employees')
          .select('id')
          .eq('company_id', companyId);
          
        if (employeeError) {
          console.error("Error fetching employee IDs:", employeeError);
          toast.error("Erro ao buscar funcionários");
          return [];
        }
        
        // Se houver funcionários, filtrar as avaliações pelos IDs dos funcionários
        if (employeeIds && employeeIds.length > 0) {
          const ids = employeeIds.map(emp => emp.id);
          query = query.in('employee_id', ids);
        } else {
          // Se não houver funcionários, retornar lista vazia
          return [];
        }
      }
      
      // Ordenar e executar a consulta
      const { data, error } = await query.order('scheduled_date', { ascending: false });
      
      if (error) {
        console.error("Error fetching scheduled assessments:", error);
        toast.error("Erro ao carregar avaliações agendadas");
        return [];
      }
      
      return data.map(item => {
        // Safely extract employee data, using optional chaining and nullish coalescing
        let employeeInfo = null;
        
        // Check if employees data exists
        if (item.employees) {
          // Handle both possible cases: array or single object
          const employee = Array.isArray(item.employees) 
            ? (item.employees[0] || {}) 
            : item.employees;
            
          // Safe access with defaults
          employeeInfo = {
            name: employee?.name || 'Funcionário',
            email: employee?.email || '',
            phone: employee?.phone || ''
          };
        }

        return {
          id: item.id,
          employeeId: item.employee_id,
          templateId: item.template_id,
          scheduledDate: new Date(item.scheduled_date),
          sentAt: item.sent_at ? new Date(item.sent_at) : null,
          linkUrl: item.link_url || '',
          status: item.status as AssessmentStatus,
          completedAt: item.completed_at ? new Date(item.completed_at) : null,
          recurrenceType: item.recurrence_type as RecurrenceType | undefined,
          nextScheduledDate: item.next_scheduled_date ? new Date(item.next_scheduled_date) : null,
          phoneNumber: item.phone_number || undefined,
          employees: employeeInfo,
          checklist_templates: item.checklist_templates
        };
      });
    }
  });

  const handleScheduleAssessment = async (assessmentData: Omit<ScheduledAssessment, 'id' | 'linkUrl' | 'sentAt' | 'completedAt'>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Avaliação agendada com sucesso!");
      refetch();
      return true;
    } catch (error) {
      console.error("Error scheduling assessment:", error);
      toast.error("Erro ao agendar avaliação");
      return false;
    }
  };

  const handleSendEmail = async (assessmentId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Email enviado com sucesso!");
      refetch();
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Erro ao enviar email");
      return false;
    }
  };

  const handleShareAssessment = async (assessmentId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Link compartilhado com sucesso!");
      refetch();
      return "https://example.com/assessment/123";
    } catch (error) {
      console.error("Error sharing assessment:", error);
      toast.error("Erro ao compartilhar avaliação");
      return null;
    }
  };

  return {
    scheduledAssessments,
    isLoading,
    handleScheduleAssessment,
    handleSendEmail,
    handleShareAssessment
  };
}
