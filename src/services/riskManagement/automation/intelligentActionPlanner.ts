
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export interface ActionTemplate {
  id: string;
  template_name: string;
  category: string;
  exposure_level: string;
  description: string;
  is_mandatory: boolean;
  recommended_timeline_days: number;
  template_actions: ActionItem[];
  legal_requirements?: string;
  responsible_roles?: string[];
}

export interface ActionItem {
  title: string;
  description: string;
  mandatory: boolean;
  timeline_days: number;
  responsible_role: string;
  estimated_hours: number;
  priority?: 'low' | 'medium' | 'high';
  dependencies?: string[];
}

export interface GeneratedActionPlan {
  id: string;
  title: string;
  description: string;
  items: ActionItem[];
  timeline_days: number;
  estimated_cost?: number;
  compliance_requirements: string[];
}

type PsychosocialRiskCategory = Database['public']['Enums']['psychosocial_risk_category'];
type PsychosocialExposureLevel = Database['public']['Enums']['psychosocial_exposure_level'];

export class IntelligentActionPlanner {
  
  async getTemplatesForRisk(category: string, exposureLevel: string): Promise<ActionTemplate[]> {
    const { data, error } = await supabase
      .from('nr01_action_templates')
      .select('*')
      .eq('category', category as PsychosocialRiskCategory)
      .eq('exposure_level', exposureLevel as PsychosocialExposureLevel)
      .order('is_mandatory', { ascending: false });

    if (error) throw error;
    
    // Convert database rows to ActionTemplate interface with proper type conversion
    return (data || []).map(template => ({
      id: template.id,
      template_name: template.template_name,
      category: template.category,
      exposure_level: template.exposure_level,
      description: template.description || '',
      is_mandatory: template.is_mandatory || false,
      recommended_timeline_days: template.recommended_timeline_days || 90,
      template_actions: this.parseActionItems(template.template_actions),
      legal_requirements: template.legal_requirements || undefined,
      responsible_roles: this.parseResponsibleRoles(template.responsible_roles)
    }));
  }

  private parseActionItems(templateActions: any): ActionItem[] {
    if (!templateActions) return [];
    
    try {
      const actions = Array.isArray(templateActions) ? templateActions : JSON.parse(templateActions);
      return actions.map((action: any) => ({
        title: action.title || '',
        description: action.description || '',
        mandatory: action.mandatory || false,
        timeline_days: action.timeline_days || 30,
        responsible_role: action.responsible_role || '',
        estimated_hours: action.estimated_hours || 0,
        priority: action.priority || 'medium',
        dependencies: action.dependencies || []
      }));
    } catch {
      return [];
    }
  }

  private parseResponsibleRoles(responsibleRoles: any): string[] {
    if (!responsibleRoles) return [];
    
    try {
      return Array.isArray(responsibleRoles) ? responsibleRoles : JSON.parse(responsibleRoles);
    } catch {
      return [];
    }
  }

  async generateActionPlan(
    riskAnalysisId: string,
    category: string,
    exposureLevel: string,
    companyId: string,
    sectorId?: string
  ): Promise<GeneratedActionPlan> {
    
    // Get base templates
    const templates = await this.getTemplatesForRisk(category, exposureLevel);
    
    if (!templates.length) {
      throw new Error(`No action templates found for ${category} - ${exposureLevel}`);
    }

    // Select the most appropriate template
    const selectedTemplate = this.selectBestTemplate(templates, exposureLevel);
    
    // Get sector-specific modifications if available
    const sectorModifications = sectorId ? 
      await this.getSectorModifications(companyId, sectorId, category) : null;

    // Generate the action plan
    const actionPlan = await this.createActionPlan(
      selectedTemplate,
      sectorModifications,
      riskAnalysisId,
      companyId,
      sectorId
    );

    return actionPlan;
  }

  private selectBestTemplate(templates: ActionTemplate[], exposureLevel: string): ActionTemplate {
    // Prioritize mandatory templates for critical/high risks
    if (exposureLevel === 'critico' || exposureLevel === 'alto') {
      const mandatoryTemplate = templates.find(t => t.is_mandatory);
      if (mandatoryTemplate) return mandatoryTemplate;
    }

    // Return the first template (they're ordered by is_mandatory desc)
    return templates[0];
  }

  private async getSectorModifications(
    companyId: string, 
    sectorId: string, 
    category: string
  ): Promise<any> {
    const { data } = await supabase
      .from('sector_risk_profiles')
      .select('risk_multipliers, baseline_scores')
      .eq('company_id', companyId)
      .eq('sector_id', sectorId)
      .single();

    return data;
  }

  private async createActionPlan(
    template: ActionTemplate,
    sectorModifications: any,
    riskAnalysisId: string,
    companyId: string,
    sectorId?: string
  ): Promise<GeneratedActionPlan> {

    // Enhance template actions with sector-specific adjustments
    const enhancedActions = this.enhanceActions(template.template_actions, sectorModifications);

    // Calculate timeline and cost estimates
    const timeline = this.calculateTimeline(enhancedActions);
    const estimatedCost = this.estimateCost(enhancedActions);

    // Create the action plan in database
    const planTitle = `${template.template_name} - Análise ${riskAnalysisId.slice(0, 8)}`;
    
    const { data: actionPlan, error } = await supabase.rpc('create_action_plan', {
      plan_data: {
        title: planTitle,
        description: `${template.description}\n\nPlano gerado automaticamente baseado na análise de risco psicossocial conforme NR-01.`,
        company_id: companyId,
        sector_id: sectorId,
        status: 'draft',
        priority: template.exposure_level === 'critico' ? 'high' : 'medium',
        risk_level: template.exposure_level,
        budget_allocated: estimatedCost,
        start_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + timeline * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    });

    if (error) throw error;

    // Create action plan items
    for (const action of enhancedActions) {
      await supabase.rpc('create_action_plan_item', {
        item_data: {
          action_plan_id: actionPlan,
          title: action.title,
          description: action.description,
          status: 'pending',
          priority: action.priority || 'medium',
          responsible_name: action.responsible_role,
          estimated_hours: action.estimated_hours,
          due_date: new Date(Date.now() + action.timeline_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      });
    }

    return {
      id: actionPlan,
      title: planTitle,
      description: template.description,
      items: enhancedActions,
      timeline_days: timeline,
      estimated_cost: estimatedCost,
      compliance_requirements: this.extractComplianceRequirements(template)
    };
  }

  private enhanceActions(baseActions: ActionItem[], sectorModifications: any): ActionItem[] {
    return baseActions.map(action => {
      let enhancedAction = { ...action };

      // Apply sector-specific multipliers if available
      if (sectorModifications?.risk_multipliers) {
        const multiplier = sectorModifications.risk_multipliers[action.responsible_role] || 1;
        enhancedAction.estimated_hours = Math.round(action.estimated_hours * multiplier);
      }

      // Add priority based on timeline and criticality
      if (!enhancedAction.priority) {
        enhancedAction.priority = action.timeline_days <= 3 ? 'high' : 
                                action.timeline_days <= 7 ? 'medium' : 'low';
      }

      return enhancedAction;
    });
  }

  private calculateTimeline(actions: ActionItem[]): number {
    return Math.max(...actions.map(a => a.timeline_days));
  }

  private estimateCost(actions: ActionItem[]): number {
    // Simple cost estimation: R$ 100 per hour
    const totalHours = actions.reduce((sum, action) => sum + action.estimated_hours, 0);
    return totalHours * 100;
  }

  private extractComplianceRequirements(template: ActionTemplate): string[] {
    const requirements = ['NR-01 - Disposições Gerais e Gerenciamento de Riscos Ocupacionais'];
    
    if (template.legal_requirements) {
      requirements.push(template.legal_requirements);
    }

    // Add category-specific requirements
    switch (template.category) {
      case 'organizacao_trabalho':
        requirements.push('CLT Art. 157 - Normas de segurança do trabalho');
        break;
      case 'condicoes_ambientais':
        requirements.push('NR-17 - Ergonomia');
        break;
      case 'relacoes_socioprofissionais':
        requirements.push('Lei 13.467/2017 - Reforma Trabalhista');
        break;
    }

    return requirements;
  }
}

export const intelligentActionPlanner = new IntelligentActionPlanner();
