
import { useState, useEffect } from 'react';
import { ChecklistTemplate } from '@/types';
import { standardQuestionnaires } from '@/data/standardQuestionnaires';

export function useChecklistTemplates() {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Convert the standardQuestionnaires to proper ChecklistTemplate format
        const convertedTemplates: ChecklistTemplate[] = standardQuestionnaires.map(template => ({
          ...template,
          cutoff_scores: typeof template.cutoff_scores === 'object' && template.cutoff_scores !== null 
            ? template.cutoff_scores as { high: number; medium: number; low: number; }
            : { high: 80, medium: 60, low: 40 }
        }));

        // Normalize scale types
        const normalizedTemplates = convertedTemplates.map(template => {
          let normalizedScaleType = template.scale_type;
          
          if (normalizedScaleType === 'likert5') {
            normalizedScaleType = 'likert5';
          } else if (normalizedScaleType === 'likert7') {
            normalizedScaleType = 'likert7';
          } else {
            normalizedScaleType = 'likert5';
          }

          return {
            ...template,
            scale_type: normalizedScaleType
          };
        });

        setTemplates(normalizedTemplates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const getTemplatesByCategory = (category: string) => {
    return templates.filter(template => template.category === category);
  };

  const getTemplatesByType = (type: string) => {
    return templates.filter(template => template.type === type);
  };

  const getStandardTemplates = () => {
    return templates.filter(template => template.is_standard);
  };

  const getCustomTemplates = () => {
    return templates.filter(template => !template.is_standard);
  };

  const getTemplateById = (id: string) => {
    return templates.find(template => template.id === id);
  };

  const getPsicossocialTemplates = () => {
    return templates.filter(template => template.type === 'psicossocial');
  };

  const getDiscTemplates = () => {
    return templates.filter(template => template.type === 'disc');
  };

  const getStressTemplates = () => {
    return templates.filter(template => template.type === 'custom');
  };

  const createTemplate = async (templateData: Partial<ChecklistTemplate>) => {
    try {
      const newTemplate: ChecklistTemplate = {
        id: `custom-${Date.now()}`,
        name: templateData.name || 'Novo Template',
        title: templateData.title || templateData.name || 'Novo Template',
        description: templateData.description || '',
        category: templateData.category || 'default',
        type: templateData.type || 'custom',
        scale_type: templateData.scale_type || 'likert5',
        is_standard: false,
        is_active: true,
        estimated_time_minutes: templateData.estimated_time_minutes || 10,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        questions: templateData.questions || [],
        cutoff_scores: templateData.cutoff_scores || { high: 80, medium: 60, low: 40 }
      };

      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      throw new Error('Failed to create template');
    }
  };

  const updateTemplate = async (id: string, updates: Partial<ChecklistTemplate>) => {
    try {
      setTemplates(prev => prev.map(template => 
        template.id === id 
          ? { ...template, ...updates, updated_at: new Date().toISOString() }
          : template
      ));
    } catch (err) {
      throw new Error('Failed to update template');
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      setTemplates(prev => prev.filter(template => template.id !== id));
    } catch (err) {
      throw new Error('Failed to delete template');
    }
  };

  return {
    templates,
    isLoading,
    error,
    getTemplatesByCategory,
    getTemplatesByType,
    getStandardTemplates,
    getCustomTemplates,
    getTemplateById,
    getPsicossocialTemplates,
    getDiscTemplates,
    getStressTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
}
