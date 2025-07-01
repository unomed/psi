
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardMetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  className?: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
  suffix?: string;
}

export function DashboardMetricCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  change,
  suffix = ""
}: DashboardMetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toLocaleString()}{suffix}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
        {change && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                change.trend === "up" ? "text-green-600" : "text-red-600"
              )}
            >
              {change.trend === "up" ? "+" : "-"}{change.value}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              vs. período anterior
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
