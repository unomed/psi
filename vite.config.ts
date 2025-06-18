
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
  // OTIMIZAÇÃO FORÇADA para incluir todas as dependências React
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-slot',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-switch',
      '@radix-ui/react-label',
      '@radix-ui/react-avatar',
      '@radix-ui/react-button'
    ],
    force: true
  },
  // CONFIGURAÇÕES ADICIONAIS para build estável
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'radix-vendor': [
            '@radix-ui/react-tooltip',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-slot'
          ]
        }
      }
    }
  },
  // Limpar tela desabilitado para debug
  clearScreen: false
}));
