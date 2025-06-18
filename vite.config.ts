
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // CONFIGURAÇÃO para React - sem fastRefresh pois não é válido
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // ALIASES EXTREMOS para forçar uma única versão do React
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "node_modules/react/jsx-dev-runtime"),
    },
    // DEDUPE EXTREMO - Forçar instância única
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    // FORÇAR RESOLUÇÃO para development e browser
    conditions: ['development', 'browser']
  },
  // OTIMIZAÇÃO EXTREMA - Sem mais Radix UI
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query'
    ],
    force: true, // FORÇAR REBUILD COMPLETO
    esbuildOptions: {
      // Garantir que React seja único
      define: {
        global: 'globalThis',
      },
      jsx: 'automatic',
    }
  },
  esbuild: {
    // Forçar JSX transform
    jsx: 'automatic'
  },
  // CONFIGURAÇÕES ADICIONAIS para build estável
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'query-vendor': ['@tanstack/react-query']
        }
      }
    },
    // Forçar rebuild completo
    emptyOutDir: true
  },
  // CACHE EXTREMO
  cacheDir: '.vite-emergency-clean',
  // Limpar tela desabilitado para debug
  clearScreen: false,
  // DEFINIÇÕES GLOBAIS para garantir React único
  define: {
    __DEV__: mode === 'development',
  }
}));
