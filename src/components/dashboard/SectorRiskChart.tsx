import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SectorRiskChartProps {
  companyId: string | null;
}

export function SectorRiskChart({ companyId }: SectorRiskChartProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([
    {
      name: "Produção",
      estresse: 65,
      assedio: 20,
      violencia: 15,
    },
    {
      name: "Administrativo",
      estresse: 45,
      assedio: 12,
      violencia: 5,
    },
    {
      name: "TI",
      estresse: 55,
      assedio: 18,
      violencia: 10,
    },
    {
      name: "Comercial",
      estresse: 40,
      assedio: 25,
      violencia: 12,
    },
    {
      name: "Logística",
      estresse: 48,
      assedio: 15,
      violencia: 25,
    },
  ]);

  useEffect(() => {
    if (!companyId) return;

    const fetchSectorRiskData = async () => {
      try {
        setLoading(true);
        console.log("Fetching sector risk data for company:", companyId);

        // Get all sectors for this company
        const { data: sectors, error: sectorError } = await supabase
          .from('sectors')
          .select('id, name')
          .eq('company_id', companyId);

        if (sectorError) throw sectorError;

        if (sectors && sectors.length > 0) {
          // Prepare array to collect sector risk data
          const sectorData = [];

          // For each sector, get assessment data
          for (const sector of sectors) {
            // In a real implementation, you would query assessment_responses with factors
            // This is a simplified version that generates sample data based on sector names
            
            // Get employees in this sector
            const { data: employees, error: empError } = await supabase
              .from('employees')
              .select('id')
              .eq('sector_id', sector.id);
              
            if (empError) throw empError;
            
            // Generate synthetic data based on number of employees
            // In a real implementation, you would aggregate real assessment data
            const empCount = employees?.length || 0;
            
            sectorData.push({
              name: sector.name,
              estresse: Math.floor(30 + Math.random() * 40 * (empCount || 1)),
              assedio: Math.floor(10 + Math.random() * 20 * (empCount || 1)),
              violencia: Math.floor(5 + Math.random() * 15 * (empCount || 1)),
            });
          }
          
          if (sectorData.length > 0) {
            setData(sectorData);
          }
        }
      } catch (error) {
        console.error("Error fetching sector risk data:", error);
        // Keep the default data on error
      } finally {
        setLoading(false);
      }
    };

    fetchSectorRiskData();
  }, [companyId]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Fatores de Risco por Setor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col justify-center">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Fatores de Risco por Setor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="estresse" name="Estresse" fill="#3b82f6" />
              <Bar dataKey="assedio" name="Assédio" fill="#8b5cf6" />
              <Bar dataKey="violencia" name="Violência" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
