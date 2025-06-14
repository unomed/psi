
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculatePsicossocialRisk } from "@/data/psicossocialTemplates";
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface PsicossocialRiskCardProps {
  category: string;
  score: number;
  totalQuestions: number;
  completedQuestions: number;
}

export function PsicossocialRiskCard({ 
  category, 
  score, 
  totalQuestions, 
  completedQuestions 
}: PsicossocialRiskCardProps) {
  const risk = calculatePsicossocialRisk(score);
  const completionPercentage = (completedQuestions / totalQuestions) * 100;

  const getRiskIcon = () => {
    switch (risk.level) {
      case 'baixo':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'medio':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'alto':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'critico':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBadgeVariant = () => {
    switch (risk.level) {
      case 'baixo':
        return 'default';
      case 'medio':
        return 'secondary';
      case 'alto':
        return 'destructive';
      case 'critico':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium truncate">
            {category}
          </CardTitle>
          {getRiskIcon()}
        </div>
        <CardDescription>
          {completedQuestions}/{totalQuestions} questões respondidas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{score}%</span>
          <Badge variant={getBadgeVariant()}>
            {risk.label}
          </Badge>
        </div>
        
        <Progress value={completionPercentage} className="h-2" />
        
        <p className="text-xs text-muted-foreground">
          {completionPercentage < 100 
            ? `${(100 - completionPercentage).toFixed(0)}% pendente`
            : 'Categoria completa'
          }
        </p>
      </CardContent>
    </Card>
  );
}
