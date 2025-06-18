
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
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // DEDUPE AGRESSIVO - Forçar mesma instância React
    dedupe: ['react', 'react-dom'],
    // FORÇAR RESOLUÇÃO para development e browser
    conditions: ['development', 'browser']
  },
  // OTIMIZAÇÃO FORÇADA - Reconstruir tudo
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
    }
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
  // CACHE LIMPO
  cacheDir: '.vite-clean',
  // Limpar tela desabilitado para debug
  clearScreen: false
}));
