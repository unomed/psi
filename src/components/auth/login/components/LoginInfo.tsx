
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface LoginInfoProps {
  info: string;
}

export function LoginInfo({ info }: LoginInfoProps) {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertDescription className="text-blue-700 text-xs">
        {info}
      </AlertDescription>
    </Alert>
  );
}
