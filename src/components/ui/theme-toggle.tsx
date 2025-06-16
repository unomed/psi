
import React from 'react';
import { Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme } = useTheme();

  return (
    <Button variant="ghost" size="sm" className="h-8 w-8 px-0 transition-all duration-200 hover:scale-105">
      <Sun className="h-4 w-4" />
      <span className="sr-only">Tema claro ativo</span>
    </Button>
  );
}
