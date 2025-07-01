
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface TemplateAnalyticsEvent {
  eventType: 'view' | 'select' | 'create' | 'preview' | 'favorite';
  templateId: string;
  templateType: string;
  userId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export function useTemplateAnalytics() {
  const { user } = useAuth();

  const trackEvent = useCallback(async (event: Omit<TemplateAnalyticsEvent, 'timestamp' | 'userId'>) => {
    try {
      const analyticsEvent: TemplateAnalyticsEvent = {
        ...event,
        userId: user?.id,
        timestamp: new Date()
      };

      // Por enquanto, vamos apenas logar no console e localStorage
      console.log('📊 Template Analytics:', analyticsEvent);
      
      // Armazenar eventos no localStorage para demonstração
      const existingEvents = JSON.parse(localStorage.getItem('template_analytics') || '[]');
      existingEvents.push(analyticsEvent);
      
      // Manter apenas os últimos 1000 eventos
      if (existingEvents.length > 1000) {
        existingEvents.splice(0, existingEvents.length - 1000);
      }
      
      localStorage.setItem('template_analytics', JSON.stringify(existingEvents));
      
    } catch (error) {
      console.error('Erro ao registrar analytics:', error);
    }
  }, [user?.id]);

  const trackTemplateView = useCallback((templateId: string, templateType: string) => {
    trackEvent({
      eventType: 'view',
      templateId,
      templateType
    });
  }, [trackEvent]);

  const trackTemplateSelect = useCallback((templateId: string, templateType: string) => {
    trackEvent({
      eventType: 'select',
      templateId,
      templateType
    });
  }, [trackEvent]);

  const trackTemplateCreate = useCallback((templateId: string, templateType: string, metadata?: Record<string, any>) => {
    trackEvent({
      eventType: 'create',
      templateId,
      templateType,
      metadata
    });
  }, [trackEvent]);

  const trackTemplatePreview = useCallback((templateId: string, templateType: string) => {
    trackEvent({
      eventType: 'preview',
      templateId,
      templateType
    });
  }, [trackEvent]);

  const trackTemplateFavorite = useCallback((templateId: string, templateType: string, favorited: boolean) => {
    trackEvent({
      eventType: 'favorite',
      templateId,
      templateType,
      metadata: { favorited }
    });
  }, [trackEvent]);

  const getAnalytics = useCallback(() => {
    try {
      const events = JSON.parse(localStorage.getItem('template_analytics') || '[]');
      return events as TemplateAnalyticsEvent[];
    } catch (error) {
      console.error('Erro ao recuperar analytics:', error);
      return [];
    }
  }, []);

  return {
    trackTemplateView,
    trackTemplateSelect,
    trackTemplateCreate,
    trackTemplatePreview,
    trackTemplateFavorite,
    getAnalytics
  };
}
