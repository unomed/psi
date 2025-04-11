
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentComplete = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Questão {currentStep + 1} de {totalSteps}</h3>
        <span className="text-sm text-muted-foreground">
          {percentComplete}% completo
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </div>
  );
}
