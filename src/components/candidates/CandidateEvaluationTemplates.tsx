
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CandidateEvaluationTemplatesProps {
  selectedCompany?: string;
}

export function CandidateEvaluationTemplates({ selectedCompany }: CandidateEvaluationTemplatesProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <CardTitle>Templates de Avaliação</CardTitle>
              </div>
              <CardDescription>
                Templates e ferramentas para avaliação comportamental e técnica de candidatos
              </CardDescription>
            </div>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedCompany ? (
            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Templates em Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Os templates de avaliação de candidatos serão disponibilizados em breve.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">
                Selecione uma empresa para visualizar os templates de avaliação.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
