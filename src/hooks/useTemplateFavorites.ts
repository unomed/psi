
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FavoriteTemplate {
  templateId: string;
  userId: string;
  createdAt: Date;
}

export function useTemplateFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user?.id]);

  const loadFavorites = async () => {
    if (!user?.id) return;
    
    try {
      // Simular carregamento de favoritos do localStorage por enquanto
      const stored = localStorage.getItem(`favorites_${user.id}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const toggleFavorite = async (templateId: string) => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para favoritar templates');
      return;
    }

    setIsLoading(true);
    
    try {
      const newFavorites = favorites.includes(templateId)
        ? favorites.filter(id => id !== templateId)
        : [...favorites, templateId];
      
      setFavorites(newFavorites);
      
      // Salvar no localStorage por enquanto
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
      
      toast.success(
        favorites.includes(templateId) 
          ? 'Template removido dos favoritos'
          : 'Template adicionado aos favoritos'
      );
      
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      toast.error('Erro ao atualizar favorito');
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (templateId: string) => favorites.includes(templateId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoading
  };
}
