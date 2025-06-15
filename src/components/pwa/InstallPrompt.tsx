
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, X, Download } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar se é iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detectar se já está instalado como PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Se já está instalado, não mostrar prompt
    if (standalone) return;

    // Listener para o evento beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Para iOS, mostrar prompt manual após um tempo
    if (iOS && !standalone) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('App instalado com sucesso!');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Lembrar que o usuário dispensou por 7 dias
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Verificar se foi dispensado recentemente
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (dismissedTime > sevenDaysAgo) {
        setShowInstallPrompt(false);
        return;
      }
    }
  }, []);

  if (!showInstallPrompt || isStandalone) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm shadow-lg border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm">Instalar App</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          {isIOS 
            ? 'Adicione à tela inicial para acesso rápido'
            : 'Instale o app para uma melhor experiência'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {isIOS ? (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>1. Toque no ícone de compartilhar ⬆️</p>
            <p>2. Selecione "Adicionar à Tela Inicial"</p>
            <p>3. Confirme tocando em "Adicionar"</p>
          </div>
        ) : (
          <Button 
            onClick={handleInstallClick} 
            className="w-full text-xs h-8"
            size="sm"
          >
            <Download className="h-3 w-3 mr-1" />
            Instalar App
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
