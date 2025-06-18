import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export interface PsychosocialRiskStats {
  totalAnalyses: number;
  riskLevels: {
    baixo: number;
    medio: number;
    alto: number;
    critico: number;
  };
  categories: {
    [key: string]: {
      count: number;
      averageScore: number;
    };
  };
  sectors: {
    id: string;
    name: string;
    riskCount: number;
    averageScore: number;
  }[];
}

export function usePsychosocialRiskData() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? userCompanies[0].companyId : null;

  const { data: riskStats, isLoading } = useQuery({
    queryKey: ['psychosocial-risk-stats', companyId],
    queryFn: async (): Promise<PsychosocialRiskStats> => {
      if (!companyId) {
        return {
          totalAnalyses: 0,
          riskLevels: { baixo: 0, medio: 0, alto: 0, critico: 0 },
          categories: {},
          sectors: []
        };
      }

      // Buscar análises de risco psicossocial
      const { data: analyses, error } = await supabase
        .from('psychosocial_risk_analysis')
        .select(`
          id,
          category,
          exposure_level,
          risk_score,
          sector_id,
          sectors(id, name)
        `)
        .eq('company_id', companyId);

      if (error) {
        console.error('Error fetching psychosocial risk data:', error);
        toast.error('Error fetching psychosocial risk data');
        throw error;
      }

      const totalAnalyses = analyses?.length || 0;
      
      // Contar por nível de exposição
      const riskLevels = {
        baixo: 0,
        medio: 0,
        alto: 0,
        critico: 0
      };

      // Agrupar por categoria
      const categories: { [key: string]: { count: number; averageScore: number; totalScore: number } } = {};
      
      // Agrupar por setor
      const sectorMap: { [key: string]: { id: string; name: string; count: number; totalScore: number } } = {};

      analyses?.forEach(analysis => {
        // Contar níveis de risco
        if (analysis.exposure_level in riskLevels) {
          riskLevels[analysis.exposure_level as keyof typeof riskLevels]++;
        }

        // Agrupar por categoria
        if (!categories[analysis.category]) {
          categories[analysis.category] = { count: 0, averageScore: 0, totalScore: 0 };
        }
        categories[analysis.category].count++;
        categories[analysis.category].totalScore += analysis.risk_score;

        // Agrupar por setor
        if (analysis.sectors && analysis.sector_id) {
          if (!sectorMap[analysis.sector_id]) {
            sectorMap[analysis.sector_id] = {
              id: analysis.sector_id,
              name: analysis.sectors.name,
              count: 0,
              totalScore: 0
            };
          }
          sectorMap[analysis.sector_id].count++;
          sectorMap[analysis.sector_id].totalScore += analysis.risk_score;
        }
      });

      // Calcular médias das categorias
      Object.keys(categories).forEach(category => {
        categories[category].averageScore = categories[category].totalScore / categories[category].count;
      });

      // Converter setores para array com médias
      const sectors = Object.values(sectorMap).map(sector => ({
        id: sector.id,
        name: sector.name,
        riskCount: sector.count,
        averageScore: sector.totalScore / sector.count
      }));

      return {
        totalAnalyses,
        riskLevels,
        categories: Object.fromEntries(
          Object.entries(categories).map(([key, value]) => [
            key, 
            { count: value.count, averageScore: value.averageScore }
          ])
        ),
        sectors
      };
    },
    enabled: !!companyId
  });

  return {
    riskStats: riskStats || {
      totalAnalyses: 0,
      riskLevels: { baixo: 0, medio: 0, alto: 0, critico: 0 },
      categories: {},
      sectors: []
    },
    isLoading
  };
}
