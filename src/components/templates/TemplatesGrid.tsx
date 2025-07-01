
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TemplateCard } from "./TemplateCard";

interface TemplatesGridProps {
  templates: any[];
  onTemplateSelect: (templateId: string) => void;
  isSubmitting: boolean;
  isCreatingTemplate: boolean;
}

export function TemplatesGrid({ 
  templates, 
  onTemplateSelect, 
  isSubmitting, 
  isCreatingTemplate 
}: TemplatesGridProps) {
  // Loading skeleton para quando templates estão sendo carregados
  const TemplateCardSkeleton = () => (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <Skeleton className="h-4 w-1/2 mb-2" />
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {isCreatingTemplate ? (
        // Mostrar skeletons durante carregamento
        Array.from({ length: 8 }).map((_, index) => (
          <TemplateCardSkeleton key={index} />
        ))
      ) : (
        templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onTemplateSelect}
            isSubmitting={isSubmitting}
            isCreatingTemplate={isCreatingTemplate}
          />
        ))
      )}
    </div>
  );
}
