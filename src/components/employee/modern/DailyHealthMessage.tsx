
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Heart, Brain, Sun, Gift } from 'lucide-react';

const healthMessages = [
  {
    icon: Heart,
    title: "Cuide do seu coração",
    message: "Lembre-se de respirar fundo. Alguns minutos de respiração consciente podem reduzir o estresse e melhorar seu humor.",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Brain,
    title: "Sua mente importa",
    message: "Cada pequeno passo é uma vitória. Você está fazendo o seu melhor e isso é suficiente.",
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: Sun,
    title: "Energia positiva",
    message: "Um novo dia, novas possibilidades. Que tal uma pausa de 5 minutos para apreciar algo bom ao seu redor?",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Heart,
    title: "Autocuidado é importante",
    message: "Hidrate-se, estique-se e sorria. Pequenos gestos de autocuidado fazem toda a diferença.",
    color: "from-teal-500 to-cyan-500"
  },
  {
    icon: Brain,
    title: "Mindfulness no trabalho",
    message: "Pratique a presença consciente. Concentre-se no momento atual e deixe as preocupações para depois.",
    color: "from-emerald-500 to-green-500"
  },
  {
    icon: Sun,
    title: "Gratidão diária",
    message: "Pense em 3 coisas pelas quais você é grato hoje. A gratidão é um remédio natural para a mente.",
    color: "from-blue-500 to-cyan-500"
  }
];

interface DailyHealthMessageProps {
  employeeId: string;
}

export function DailyHealthMessage({ employeeId }: DailyHealthMessageProps) {
  const [currentMessage, setCurrentMessage] = React.useState(0);

  React.useEffect(() => {
    // Rotaciona a mensagem baseado no dia + employeeId para personalização
    const today = new Date().getDate();
    const employeeHash = employeeId.length; // Simples hash baseado no ID
    setCurrentMessage((today + employeeHash) % healthMessages.length);
  }, [employeeId]);

  const handleRefresh = () => {
    setCurrentMessage((prev) => (prev + 1) % healthMessages.length);
  };

  const message = healthMessages[currentMessage];
  const IconComponent = message.icon;

  return (
    <Card className={`bg-gradient-to-r ${message.color} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <IconComponent className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">{message.title}</h3>
          </div>
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            title="Nova mensagem"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <p className="text-white/90 leading-relaxed">{message.message}</p>
      </CardContent>
    </Card>
  );
}
