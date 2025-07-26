import psiSafeIcon from "@/assets/psi-safe-icon.png";

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <img 
        src={psiSafeIcon} 
        alt="PSI Safe NR 01" 
        className="w-12 h-12 flex-shrink-0"
      />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}