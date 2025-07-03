import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Mail, Phone, Calendar, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CandidateSelectionStepProps {
  selectedCandidate: any;
  onCandidateSelect: (candidate: any) => void;
  selectedCompany: string | null;
}

export function CandidateSelectionStep({
  selectedCandidate,
  onCandidateSelect,
  selectedCompany
}: CandidateSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar candidatos (funcionários com type='candidato')
  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['candidates-for-scheduling', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id,
          name,
          email,
          cpf,
          phone,
          start_date,
          status,
          sectors!inner(name),
          roles!inner(name)
        `)
        .eq('company_id', selectedCompany)
        .eq('employee_type', 'candidato')
        .eq('status', 'active')
        .order('name');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany
  });

  const filteredCandidates = candidates.filter(candidate => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      candidate.name?.toLowerCase().includes(searchLower) ||
      candidate.email?.toLowerCase().includes(searchLower) ||
      candidate.cpf?.includes(searchTerm)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando candidatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Selecionar Candidato</h3>
          <p className="text-muted-foreground">
            Escolha o candidato que receberá a avaliação agendada
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {filteredCandidates.length} candidato(s)
        </Badge>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por nome, email ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de Candidatos */}
      {filteredCandidates.length === 0 ? (
        <div className="text-center py-8">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Nenhum candidato encontrado</p>
          <p className="text-muted-foreground">
            {searchTerm 
              ? 'Tente ajustar os termos de busca' 
              : 'Cadastre candidatos na seção Funcionários com tipo "candidato"'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {filteredCandidates.map((candidate) => (
            <Card 
              key={candidate.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCandidate?.id === candidate.id 
                  ? 'ring-2 ring-primary shadow-md' 
                  : ''
              }`}
              onClick={() => onCandidateSelect(candidate)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{candidate.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {candidate.roles?.name || 'Sem função definida'}
                      </p>
                    </div>
                  </div>
                  {selectedCandidate?.id === candidate.id && (
                    <Badge variant="default">Selecionado</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  {candidate.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{candidate.email}</span>
                    </div>
                  )}
                  
                  {candidate.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{candidate.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Desde {new Date(candidate.start_date).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {candidate.sectors?.name && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {candidate.sectors.name}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t">
                  <Button 
                    size="sm" 
                    variant={selectedCandidate?.id === candidate.id ? "default" : "outline"}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCandidateSelect(candidate);
                    }}
                  >
                    {selectedCandidate?.id === candidate.id ? 'Selecionado' : 'Selecionar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Candidato Selecionado - Resumo */}
      {selectedCandidate && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Candidato Selecionado:</h4>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{selectedCandidate.name}</span>
            </div>
            {selectedCandidate.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{selectedCandidate.email}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}