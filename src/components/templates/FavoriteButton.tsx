
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Heart } from "lucide-react";
import { useTemplateFavorites } from "@/hooks/useTemplateFavorites";

interface FavoriteButtonProps {
  templateId: string;
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "outline" | "default";
}

export function FavoriteButton({ 
  templateId, 
  size = "sm", 
  variant = "ghost" 
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoading } = useTemplateFavorites();
  const favorite = isFavorite(templateId);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(templateId);
          }}
          disabled={isLoading}
          className={`transition-colors ${favorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Heart 
            className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} 
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}</p>
      </TooltipContent>
    </Tooltip>
  );
}
