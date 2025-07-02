
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { backgroundProcessor } from "@/services/riskManagement/automation/backgroundProcessor";
import type { ProcessingStatus } from "@/services/riskManagement/automation/backgroundProcessor";
import { toast } from "sonner";

export function useBackgroundProcessor() {
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);

  // Get processing status
  const { 
    data: statusData, 
    isLoading,
    refetch: refetchStatus 
  } = useQuery({
    queryKey: ['processing-status'],
    queryFn: () => backgroundProcessor.getProcessingStatus(),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  useEffect(() => {
    if (statusData) {
      setProcessingStatus(statusData);
    }
  }, [statusData]);

  // Start processing mutation
  const startProcessing = useMutation({
    mutationFn: () => backgroundProcessor.startProcessing(),
    onSuccess: () => {
      console.log('Background processing started');
      toast.success('Processamento em background iniciado e salvo!');
      refetchStatus();
    },
    onError: (error) => {
      console.error('Failed to start processing:', error);
      toast.error('Erro ao iniciar processamento em background');
    }
  });

  // Stop processing mutation
  const stopProcessing = useMutation({
    mutationFn: () => backgroundProcessor.stopProcessing(),
    onSuccess: () => {
      console.log('Background processing stopped');
      toast.success('Processamento em background pausado e salvo!');
      refetchStatus();
    },
    onError: (error) => {
      console.error('Failed to stop processing:', error);
      toast.error('Erro ao pausar processamento em background');
    }
  });

  // Queue job mutation
  const queueJob = useMutation({
    mutationFn: ({ 
      assessmentResponseId, 
      companyId, 
      priority = 'medium' 
    }: { 
      assessmentResponseId: string; 
      companyId: string; 
      priority?: 'low' | 'medium' | 'high' | 'critical' 
    }) => backgroundProcessor.queueJob(assessmentResponseId, companyId, priority),
    onSuccess: (jobId) => {
      console.log('Job queued successfully:', jobId);
      refetchStatus();
    },
    onError: (error) => {
      console.error('Failed to queue job:', error);
    }
  });

  return {
    processingStatus,
    isLoading,
    startProcessing,
    stopProcessing,
    queueJob,
    refetchStatus
  };
}
