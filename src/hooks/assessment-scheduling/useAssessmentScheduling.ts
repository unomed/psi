
import { useState } from 'react';
import { Employee } from '@/types/employee';
import { ChecklistTemplate, RecurrenceType, generateUniqueAssessmentLink } from '@/types';

interface SchedulingDetails {
  scheduledDate?: Date;
  recurrenceType: RecurrenceType;
  phoneNumber: string;
  sendEmail: boolean;
  sendWhatsApp: boolean;
}

export function useAssessmentScheduling() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [schedulingDetails, setSchedulingDetails] = useState<SchedulingDetails>({
    recurrenceType: 'monthly',
    phoneNumber: '',
    sendEmail: true,
    sendWhatsApp: false
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateSchedulingDetails = (details: Partial<SchedulingDetails>) => {
    setSchedulingDetails(prev => ({ ...prev, ...details }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate assessment link
      const assessmentId = Math.random().toString(36).substr(2, 9);
      const linkUrl = generateUniqueAssessmentLink(assessmentId);
      
      // Here you would typically save to database
      console.log('Assessment scheduled:', {
        employee: selectedEmployee,
        template: selectedTemplate,
        details: schedulingDetails,
        linkUrl
      });
      
      return true;
    } catch (error) {
      console.error('Error scheduling assessment:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedEmployee(null);
    setSelectedTemplate(null);
    setSchedulingDetails({
      recurrenceType: 'monthly',
      phoneNumber: '',
      sendEmail: true,
      sendWhatsApp: false
    });
    setCurrentStep(0);
  };

  return {
    selectedEmployee,
    setSelectedEmployee,
    selectedTemplate,
    setSelectedTemplate,
    schedulingDetails,
    updateSchedulingDetails,
    currentStep,
    setCurrentStep,
    isSubmitting,
    handleSubmit,
    resetForm
  };
}
