
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface TestAccountInfo {
  email: string;
  password: string;
  description: string;
}

const TEST_ACCOUNTS: Record<string, TestAccountInfo> = {
  'superadmin': {
    email: 'superadmin@test.com',
    password: 'super123',
    description: "Super Admin: Acesso total ao sistema e todas as empresas."
  },
  'admin': {
    email: 'admin@company.com',
    password: 'admin123',
    description: "Admin da Empresa: Para ter acesso administrativo às empresas, este usuário precisa estar associado a elas na página de Configurações > Usuários."
  },
  'evaluator': {
    email: 'evaluator@company.com',
    password: 'eval123',
    description: "Avaliador: Para ter acesso às funcionalidades de avaliações, este usuário precisa estar associado a pelo menos uma empresa na página de Configurações > Usuários."
  }
};

export function TestAccountsSection() {
  const { loading } = useAuth();
  const [loginInfo, setLoginInfo] = useState<string | null>(null);

  const setTestCredentials = (accountType: keyof typeof TEST_ACCOUNTS) => {
    const account = TEST_ACCOUNTS[accountType];
    if (account) {
      setLoginInfo(account.description);
    }
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou use uma conta de teste
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {Object.entries(TEST_ACCOUNTS).map(([type, account]) => (
          <Button
            key={type}
            variant="outline"
            type="button"
            disabled={loading}
            onClick={() => setTestCredentials(type as keyof typeof TEST_ACCOUNTS)}
          >
            {type === 'superadmin' ? 'Super Admin' : 
             type === 'admin' ? 'Admin da Empresa' : 'Avaliador'}
          </Button>
        ))}
      </div>

      {loginInfo && (
        <Alert className="mt-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700 text-xs">
            {loginInfo}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
