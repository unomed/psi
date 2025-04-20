
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface LoginButtonProps {
  isLoading: boolean;
  disabled: boolean;
}

export function LoginButton({ isLoading, disabled }: LoginButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={disabled}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Entrando...
        </>
      ) : (
        "Entrar"
      )}
    </Button>
  );
}
