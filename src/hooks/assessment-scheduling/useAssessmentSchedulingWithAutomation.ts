import { useState, useCallback } from 'react';
import { Employee } from '@/types/employee';
import { ChecklistTemplate, RecurrenceType, generateEmployeePortalLink, scheduleAssessmentReminders } from '@/types';

interface SchedulingDetails {
  scheduledDate?: Date;
  recurrenceType: RecurrenceType;
  phoneNumber: string;
  sendEmail: boolean;
  sendWhatsApp: boolean;
}

interface AutomationConfig {
  enabled: boolean;
  template: ChecklistTemplate | null;
  employees: Employee[];
  schedulingDetails: SchedulingDetails;
}

export function useAssessmentSchedulingWithAutomation() {
  const [automationConfig, setAutomationConfig] = useState<AutomationConfig>({
    enabled: false,
    template: null,
    employees: [],
    schedulingDetails: {
      recurrenceType: 'monthly',
      phoneNumber: '',
      sendEmail: true,
      sendWhatsApp: false
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [schedulingDetails, setSchedulingDetails] = useState<SchedulingDetails>({
    recurrenceType: 'monthly',
    phoneNumber: '',
    sendEmail: true,
    sendWhatsApp: false
  });

  const updateAutomationConfig = useCallback((updates: Partial<AutomationConfig>) => {
    setAutomationConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSchedulingDetails = useCallback((details: Partial<SchedulingDetails>) => {
    setSchedulingDetails(prev => ({ ...prev, ...details }));
    setAutomationConfig(prev => ({
      ...prev,
      schedulingDetails: { ...prev.schedulingDetails, ...details }
    }));
  }, []);

  const scheduleAssessment = async (data: any) => {
    setIsProcessing(true);
    try {
      // Implementation for scheduling assessment
      console.log('Scheduling assessment:', data);
      return data;
    } catch (error) {
      console.error('Error scheduling assessment:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const processAutomatedScheduling = async () => {
    if (!automationConfig.template || automationConfig.employees.length === 0) {
      throw new Error('Template e funcionários são obrigatórios');
    }

    setIsProcessing(true);
    try {
      const scheduledAssessments = [];

      for (const employee of automationConfig.employees) {
        // Generate portal link for employee
        const portalLink = generateEmployeePortalLink(employee.id);
        
        const assessment = {
          id: Math.random().toString(36).substr(2, 9),
          employeeId: employee.id,
          templateId: automationConfig.template.id,
          scheduledDate: automationConfig.schedulingDetails.scheduledDate || new Date(),
          recurrenceType: automationConfig.schedulingDetails.recurrenceType,
          linkUrl: portalLink,
          phoneNumber: automationConfig.schedulingDetails.phoneNumber || employee.phone,
          sendEmail: automationConfig.schedulingDetails.sendEmail,
          sendWhatsApp: automationConfig.schedulingDetails.sendWhatsApp
        };

        scheduledAssessments.push(assessment);

        // Schedule reminders if enabled
        if (assessment.scheduledDate) {
          await scheduleAssessmentReminders(assessment.id, [new Date(assessment.scheduledDate)]);
        }
      }

      console.log('Automated assessments scheduled:', scheduledAssessments);
      return scheduledAssessments;
    } catch (error) {
      console.error('Error processing automated scheduling:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAutomation = () => {
    setAutomationConfig({
      enabled: false,
      template: null,
      employees: [],
      schedulingDetails: {
        recurrenceType: 'monthly',
        phoneNumber: '',
        sendEmail: true,
        sendWhatsApp: false
      }
    });
  };

  return {
    automationConfig,
    schedulingDetails,
    setSchedulingDetails,
    scheduleAssessment,
    isLoading: isProcessing,
    updateAutomationConfig,
    updateSchedulingDetails,
    isProcessing,
    processAutomatedScheduling,
    resetAutomation
  };
}
