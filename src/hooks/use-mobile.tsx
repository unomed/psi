
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Função para verificar se é mobile
    const checkMobile = () => {
      const width = window.innerWidth;
      const newIsMobile = width < MOBILE_BREAKPOINT;
      setIsMobile(newIsMobile);
      
      // Log para debug no preview
      console.log('[useIsMobile] Window width:', width, 'isMobile:', newIsMobile);
    };

    // Verificação inicial
    checkMobile();

    // Listener para mudanças de tamanho
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => checkMobile();
    
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [])

  // Se ainda não foi definido, assumir desktop por padrão
  return isMobile ?? false;
}
