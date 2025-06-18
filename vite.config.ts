
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
      // CONFIGURAÇÃO EXTREMA para React
      fastRefresh: true,
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
  // OTIMIZAÇÃO EXTREMA - Excluir TODAS as libs Radix UI temporariamente
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query'
    ],
    // EXCLUIR TODAS as libs Radix UI para eliminar conflitos
    exclude: [
      '@radix-ui/react-tooltip',
      '@radix-ui/react-scroll-area', 
      '@radix-ui/react-popover',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-switch',
      '@radix-ui/react-label',
      '@radix-ui/react-avatar',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-hover-card',
      '@radix-ui/react-menubar',
      '@radix-ui/react-navigation-menu',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group'
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
