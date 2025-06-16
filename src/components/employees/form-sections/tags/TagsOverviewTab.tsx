
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { TagMetricsCards } from "./TagMetricsCards";
import type { EmployeeTag } from "@/types/tags";

interface TagAnalysis {
  compliance: number;
  missingRequired: number;
  expiredTags: number;
  totalRequired: number;
}

interface TagStatistics {
  totalTags: number;
  categoryDistribution: Record<string, number>;
  hasExpiredTags: boolean;
}

interface TagsOverviewTabProps {
  tagAnalysis: TagAnalysis;
  tagStatistics: TagStatistics;
  employeeTags: EmployeeTag[];
}

export function TagsOverviewTab({ tagAnalysis, tagStatistics, employeeTags }: TagsOverviewTabProps) {
  return (
    <div className="space-y-4">
      <TagMetricsCards tagAnalysis={tagAnalysis} tagStatistics={tagStatistics} />

      {/* Tags atuais */}
      <div className="space-y-2">
        <h4 className="font-medium">Tags Atuais</h4>
        <div className="flex flex-wrap gap-2">
          {employeeTags.map(tag => (
            <Badge 
              key={tag.id} 
              variant="outline"
              className="flex items-center gap-1"
            >
              {tag.tag_type?.name}
              {tag.expiry_date && new Date(tag.expiry_date) < new Date() && (
                <AlertTriangle className="h-3 w-3 text-red-500" />
              )}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
