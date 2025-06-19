
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Calendar } from "lucide-react";

interface WelcomeBannerProps {
  user: any;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-xl font-semibold">
                {getCurrentGreeting()}, {userName}!
              </h2>
            </div>
            <p className="text-blue-100 mb-4">
              Bem-vindo ao Sistema de Gestão Psicossocial
            </p>
            <div className="flex items-center gap-2 text-blue-100">
              <Calendar className="h-4 w-4" />
              <span className="text-sm capitalize">{getCurrentDate()}</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-2xl font-bold">NR-01</div>
              <div className="text-blue-100 text-sm">Compliance</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
