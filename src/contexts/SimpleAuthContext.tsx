
// Redirecionamento para o contexto otimizado
export { 
  OptimizedAuthProvider as SimpleAuthProvider,
  useOptimizedAuth as useSimpleAuth 
} from './OptimizedAuthContext';

// Manter tipos para compatibilidade
export type { OptimizedAuthContextType as SimpleAuthContextType } from './OptimizedAuthContext';
