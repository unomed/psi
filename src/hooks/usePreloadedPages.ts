
import { lazy } from "react";
import { useOptimizedQueries } from "./useOptimizedQueries";

// Pre-carrega páginas mais acessadas
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Empresas = lazy(() => import("@/pages/Empresas"));
const Funcionarios = lazy(() => import("@/pages/Funcionarios"));

// Cache de componentes carregados
const componentCache = new Map();

export function usePreloadedPages() {
  const { prefetchQuery } = useOptimizedQueries();

  // Preload das páginas principais
  const preloadMainPages = () => {
    const mainPages = [
      () => import("@/pages/Dashboard"),
      () => import("@/pages/Empresas"),
      () => import("@/pages/Funcionarios")
    ];

    mainPages.forEach((importFn, index) => {
      setTimeout(() => {
        if (!componentCache.has(index)) {
          importFn().then(module => {
            componentCache.set(index, module);
          });
        }
      }, index * 100); // Carrega progressivamente
    });
  };

  // Preload baseado em navegação provável
  const preloadByRoute = (currentRoute: string) => {
    const routeRelations: Record<string, string[]> = {
      '/dashboard': ['/empresas', '/funcionarios'],
      '/empresas': ['/funcionarios', '/setores'],
      '/funcionarios': ['/funcoes', '/empresas'],
      '/setores': ['/funcoes', '/empresas'],
      '/funcoes': ['/setores', '/funcionarios']
    };

    const relatedRoutes = routeRelations[currentRoute] || [];
    relatedRoutes.forEach(route => {
      const pageImport = getPageImport(route);
      if (pageImport) {
        setTimeout(() => pageImport(), 200);
      }
    });
  };

  return {
    preloadMainPages,
    preloadByRoute,
    componentCache
  };
}

function getPageImport(route: string) {
  const imports: Record<string, () => Promise<any>> = {
    '/empresas': () => import("@/pages/Empresas"),
    '/funcionarios': () => import("@/pages/Funcionarios"),
    '/setores': () => import("@/pages/Setores"),
    '/funcoes': () => import("@/pages/Funcoes"),
    '/templates': () => import("@/pages/Checklists"),
    '/resultados': () => import("@/pages/AssessmentResults"),
    '/gestao-riscos': () => import("@/pages/GestaoRiscos"),
    '/plano-acao': () => import("@/pages/PlanoAcao"),
    '/faturamento': () => import("@/pages/Faturamento")
  };

  return imports[route];
}
