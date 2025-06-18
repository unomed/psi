
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp } from 'lucide-react';

interface CandidateComparisonProps {
  selectedCompany?: string;
}

export function CandidateComparison({ selectedCompany }: CandidateComparisonProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Comparação de Candidatos</CardTitle>
          </div>
          <CardDescription>
            Compare candidatos com base em competências comportamentais e adequação às funções
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedCompany ? (
            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Funcionalidade em Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  A comparação de candidatos para a empresa selecionada será implementada em breve.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">
                Selecione uma empresa para visualizar as comparações de candidatos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
