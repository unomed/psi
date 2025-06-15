
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ title, children, className }: SidebarSectionProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </div>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
