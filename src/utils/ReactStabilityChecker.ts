
import React from 'react';

// Sistema robusto de verificação de estabilidade do React
export class ReactStabilityChecker {
  private static instance: ReactStabilityChecker;
  private isStable = false;
  private testsPassed = 0;
  private totalTests = 5;

  static getInstance(): ReactStabilityChecker {
    if (!ReactStabilityChecker.instance) {
      ReactStabilityChecker.instance = new ReactStabilityChecker();
    }
    return ReactStabilityChecker.instance;
  }

  async checkReactStability(): Promise<boolean> {
    if (this.isStable) return true;

    this.testsPassed = 0;

    // Test 1: Verificar se React está disponível globalmente
    if (this.testReactGlobal()) this.testsPassed++;
    
    // Test 2: Verificar se hooks básicos estão disponíveis
    if (this.testBasicHooks()) this.testsPassed++;
    
    // Test 3: Verificar se o dispatcher está ativo
    if (await this.testDispatcher()) this.testsPassed++;
    
    // Test 4: Verificar se o DOM está pronto
    if (this.testDOMReady()) this.testsPassed++;
    
    // Test 5: Verificar se não há errors de hook
    if (await this.testHookExecution()) this.testsPassed++;

    this.isStable = this.testsPassed >= 4; // Precisa passar em pelo menos 4 de 5 testes
    
    console.log(`[ReactStabilityChecker] Testes: ${this.testsPassed}/${this.totalTests}, Estável: ${this.isStable}`);
    
    return this.isStable;
  }

  private testReactGlobal(): boolean {
    try {
      return typeof window !== 'undefined' && 
             typeof React !== 'undefined';
    } catch {
      return false;
    }
  }

  private testBasicHooks(): boolean {
    try {
      return React && 
             typeof React.useState === 'function' &&
             typeof React.useEffect === 'function' &&
             typeof React.useContext === 'function';
    } catch {
      return false;
    }
  }

  private async testDispatcher(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Verificar se há um dispatcher React ativo
        const ReactInternals = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        const dispatcher = ReactInternals?.ReactCurrentDispatcher?.current;
        resolve(dispatcher !== null && dispatcher !== undefined);
      } catch {
        resolve(false);
      }
    });
  }

  private testDOMReady(): boolean {
    try {
      return typeof document !== 'undefined' && 
             document.readyState === 'complete' &&
             document.getElementById('root') !== null;
    } catch {
      return false;
    }
  }

  private async testHookExecution(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Criar um componente de teste temporário
        const TestComponent = () => {
          const [test] = React.useState(true);
          return test;
        };

        // Verificar se o componente pode ser "executado"
        const result = TestComponent();
        resolve(result === true);
      } catch {
        resolve(false);
      }
    });
  }

  reset(): void {
    this.isStable = false;
    this.testsPassed = 0;
  }
}
