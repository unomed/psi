
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Coffee, Moon, Users } from 'lucide-react';

const wellnessTips = [
  {
    icon: Coffee,
    tip: "Faça pausas regulares",
    description: "A cada hora, levante e caminhe por 2 minutos"
  },
  {
    icon: Moon,
    tip: "Durma bem",
    description: "7-8 horas de sono melhoram o humor e a produtividade"
  },
  {
    icon: Users,
    tip: "Conecte-se",
    description: "Converse com colegas, o apoio social é fundamental"
  },
  {
    icon: Sparkles,
    tip: "Celebre pequenas vitórias",
    description: "Reconheça seus progressos, por menores que sejam"
  }
];

export function WellnessCard() {
  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
          Dicas de Bem-estar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {wellnessTips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <IconComponent className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{tip.tip}</h4>
                  <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
