
import React from 'react';
import { useSafeState, useSafeEffect } from '@/hooks/useSafeReact';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, X, Download, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  // Check React availability first
  if (typeof React === 'undefined' || !React) {
    console.warn('[InstallPrompt] React not available');
    return null;
  }

  const [deferredPrompt, setDeferredPrompt] = useSafeState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useSafeState(false);
  const [isIOS, setIsIOS] = useSafeState(false);
  const [isStandalone, setIsStandalone] = useSafeState(false);

  useSafeEffect(() => {
    console.log('[InstallPrompt] Inicializando...');
    
    // Detectar se é iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    console.log('[InstallPrompt] É iOS:', iOS);

    // Detectar se já está instalado como PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
    console.log('[InstallPrompt] Já está instalado:', standalone);

    // Se já está instalado, não mostrar prompt
    if (standalone) {
      console.log('[InstallPrompt] App já instalado, não mostrando prompt');
      return;
    }

    // Verificar se foi dispensado recentemente
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
      if (dismissedTime > threeDaysAgo) {
        console.log('[InstallPrompt] Foi dispensado recentemente');
        return;
      } else {
        localStorage.removeItem('pwa-install-dismissed');
      }
    }

    // Listener para o evento beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[InstallPrompt] Evento beforeinstallprompt detectado');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Para todos os dispositivos, mostrar prompt após um tempo menor
    const timer = setTimeout(() => {
      console.log('[InstallPrompt] Mostrando prompt após timeout');
      setShowInstallPrompt(true);
    }, iOS ? 2000 : 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('[InstallPrompt] Tentando instalar...');
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('[InstallPrompt] Resultado da instalação:', outcome);
      
      if (outcome === 'accepted') {
        toast.success('PSI Unomed instalado com sucesso!');
      } else {
        toast.info('Instalação cancelada');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } else {
      toast.info('Para instalar: use o menu do navegador > "Adicionar à tela inicial"');
    }
  };

  const handleDismiss = () => {
    console.log('[InstallPrompt] Prompt dispensado pelo usuário');
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Não mostrar se já está instalado
  if (!showInstallPrompt || isStandalone) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm shadow-lg border-2 border-primary/20 animate-in slide-in-from-bottom-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-semibold">Instalar PSI Unomed</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          {isIOS 
            ? 'Adicione à tela inicial para acesso rápido e offline'
            : 'Instale o app para uma melhor experiência e acesso offline'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {isIOS ? (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="flex items-center gap-2">
                <span className="text-lg">1.</span>
                Toque no ícone de compartilhar 
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded text-xs">⬆️</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">2.</span>
                Selecione "Adicionar à Tela Inicial"
                <Plus className="h-4 w-4" />
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">3.</span>
                Confirme tocando em "Adicionar"
              </p>
            </div>
            <Button 
              onClick={handleInstallClick} 
              className="w-full text-xs h-8"
              size="sm"
              variant="outline"
            >
              <Download className="h-3 w-3 mr-1" />
              Mostrar Instruções
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleInstallClick} 
            className="w-full text-xs h-8"
            size="sm"
          >
            <Download className="h-3 w-3 mr-1" />
            Instalar PSI Unomed
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
