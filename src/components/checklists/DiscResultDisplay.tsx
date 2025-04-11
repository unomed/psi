
import { ChecklistResult } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { DiscResultSummary } from "./disc/DiscResultSummary";
import { DiscFactorDetails } from "./disc/DiscFactorDetails";

interface DiscResultDisplayProps {
  result: ChecklistResult;
  onClose: () => void;
}

export function DiscResultDisplay({ result, onClose }: DiscResultDisplayProps) {
  // Mock function to download results (would be implemented with actual PDF generation)
  const handleDownload = () => {
    console.log("Downloading results:", result);
    alert("O download do relatório será implementado em breve!");
  };

  return (
    <div className="space-y-6">
      <DiscResultSummary result={result} onDownload={handleDownload} />
      
      <DiscFactorDetails dominantFactor={result.dominantFactor} />
      
      <div className="flex justify-end">
        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  );
}
