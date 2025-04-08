
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  change?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
  };
  className?: string;
}

export function DashboardMetricCard({
  title,
  value,
  description,
  icon: Icon,
  change,
  className,
}: DashboardMetricCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || change) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {description}
            {change && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5",
                  change.trend === "up" && "text-green-500",
                  change.trend === "down" && "text-red-500"
                )}
              >
                {change.trend === "up" && "↑"}
                {change.trend === "down" && "↓"}
                {change.value}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
