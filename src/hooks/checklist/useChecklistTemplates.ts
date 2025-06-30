
import { useState, useEffect } from 'react';
import { ChecklistTemplate } from '@/types';
import { STANDARD_QUESTIONNAIRE_TEMPLATES } from '@/data/standardQuestionnaires';

export function useChecklistTemplates() {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // Convert the standardQuestionnaires to proper ChecklistTemplate format
        const convertedTemplates: ChecklistTemplate[] = STANDARD_QUESTIONNAIRE_TEMPLATES.map(template => ({
          id: `standard-${template.id}`,
          name: template.name,
          title: template.name,
          description: template.description,
          category: template.type === 'custom' ? 'default' : template.type,
          type: template.type === 'custom' ? 'psicossocial' : template.type,
          scale_type: template.scale_type,
          is_standard: true,
          is_active: true,
          estimated_time_minutes: template.estimated_time_minutes,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          cutoff_scores: { high: 80, medium: 60, low: 40 },
          questions: template.questions.map((q, index) => ({
            id: `q-${index}`,
            template_id: `standard-${template.id}`,
            question_text: typeof q === 'string' ? q : q.text || '',
            text: typeof q === 'string' ? q : q.text || '',
            order_number: index + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }))
        }));

        setTemplates(convertedTemplates);
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

  const getCustomQuestionnaires = () => {
    return templates.filter(template => template.type === 'psicossocial');
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
    checklists: templates, // Alias para compatibilidade
    isLoading,
    error,
    getTemplatesByCategory,
    getTemplatesByType,
    getStandardTemplates,
    getCustomTemplates,
    getTemplateById,
    getPsicossocialTemplates,
    getDiscTemplates,
    getCustomQuestionnaires,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
}

export function useChecklistOperations() {
  const { createTemplate, updateTemplate, deleteTemplate } = useChecklistTemplates();
  
  return {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    isDeleting: false
  };
}
