
import PeriodicitySettings from "@/components/settings/PeriodicitySettings";

export default function PeriodicityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Periodicidade</h1>
        <p className="text-muted-foreground mt-2">
          Configure a frequência padrão das avaliações por nível de risco.
        </p>
      </div>
      <PeriodicitySettings />
    </div>
  );
}
