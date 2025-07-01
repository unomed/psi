
import { useMemo } from "react";
import type { EmployeeTag } from "@/types/tags";

export function useTagStatistics(employeeTags: EmployeeTag[]) {
  // Funcionalidades avançadas
  const tagStatistics = useMemo(() => {
    const categoryStats = employeeTags.reduce((acc, tag) => {
      const category = tag.tag_type?.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTags: employeeTags.length,
      categoriesCount: Object.keys(categoryStats).length,
      categoryDistribution: categoryStats,
      hasExpiredTags: employeeTags.some(tag => 
        tag.expiry_date && new Date(tag.expiry_date) < new Date()
      )
    };
  }, [employeeTags]);

  return tagStatistics;
}
