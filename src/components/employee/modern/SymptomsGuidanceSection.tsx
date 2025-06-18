import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  Brain, 
  Stethoscope, 
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Info,
  Apple,
  Dumbbell,
  Shield
} from "lucide-react";

export function SymptomsGuidanceSection() {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  const physicalSymptoms = [
    { name: "Fadiga e cansaço", exams: ["Hemograma completo", "TSH", "Glicemia"] },
    { name: "Dor de cabeça frequente", exams: ["Ressonância magnética", "Tomografia", "Consulta neurológica"] },
    { name: "Tontura e vertigens", exams: ["Exame vestibular", "Ressonância magnética", "Consulta otorrino"] },
    { name: "Dor no peito", exams: ["Eletrocardiograma", "Ecocardiograma", "Teste ergométrico"] },
    { name: "Falta de ar", exams: ["Raio-X do tórax", "Espirometria", "Gasometria arterial"] },
    { name: "Palpitações", exams: ["Eletrocardiograma", "Holter 24h", "Ecocardiograma"] },
    { name: "Dor abdominal", exams: ["Ultrassom abdominal", "Endoscopia", "Exames de sangue"] },
    { name: "Náuseas e Vômitos", exams: ["Endoscopia", "Ultrassom abdominal", "Exames de sangue"] },
    { name: "Febre persistente", exams: ["Hemograma", "Hemocultura", "Exames de imagem"] },
    { name: "Perda de peso", exams: ["Exames de sangue", "Tomografia", "Consulta nutricional"] },
    { name: "Dor nas articulações", exams: ["Raio-X", "Ressonância magnética", "Exames reumatológicos"] },
    { name: "Alterações na Urina", exams: ["Urina tipo 1", "Urocultura", "Ultrassom renal"] }
  ];

  const mentalHealthSymptoms = [
    { name: "Ansiedade persistente", guidance: "Procure um médico clínico ou psiquiatra para avaliação" },
    { name: "Tristeza profunda", guidance: "Importante buscar acompanhamento médico especializado" },
    { name: "Insônia crônica", guidance: "Consulte um médico para investigação das causas" },
    { name: "Irritabilidade excessiva", guidance: "Avaliação médica pode ajudar a identificar causas" },
    { name: "Perda de interesse", guidance: "Sintoma que requer atenção médica especializada" },
    { name: "Dificuldade de concentração", guidance: "Procure orientação médica para investigação" }
  ];

  const nutritionTips = [
    { topic: "Hidratação", guidance: "Beba pelo menos 2 litros de água por dia", details: "Mantenha uma garrafa de água sempre por perto" },
    { topic: "Frutas e Vegetais", guidance: "Consuma ao menos 5 porções por dia", details: "Variedade de cores garante diferentes nutrientes" },
    { topic: "Proteínas", guidance: "Inclua proteínas em todas as refeições", details: "Carnes magras, ovos, leguminosas e laticínios" },
    { topic: "Carboidratos Integrais", guidance: "Prefira versões integrais", details: "Arroz integral, pães integrais, aveia" },
    { topic: "Redução de Açúcar", guidance: "Limite doces e refrigerantes", details: "Prefira frutas como sobremesa" },
    { topic: "Horários Regulares", guidance: "Faça refeições em horários fixos", details: "Evite pular refeições principais" }
  ];

  const exerciseTips = [
    { activity: "Caminhada", frequency: "30 min, 5x por semana", benefits: "Melhora cardiovascular e disposição" },
    { activity: "Alongamento", frequency: "10 min diários", benefits: "Flexibilidade e alívio de tensões" },
    { activity: "Musculação", frequency: "2-3x por semana", benefits: "Fortalecimento muscular e ósseo" },
    { activity: "Dança", frequency: "2x por semana", benefits: "Coordenação e bem-estar mental" },
    { activity: "Natação", frequency: "2-3x por semana", benefits: "Exercício completo, baixo impacto" },
    { activity: "Yoga/Pilates", frequency: "2x por semana", benefits: "Flexibilidade, força e relaxamento" }
  ];

  const preventiveCare = [
    { care: "Check-up Anual", frequency: "1x por ano", description: "Exames gerais para prevenção" },
    { care: "Exame Oftalmológico", frequency: "1-2x por ano", description: "Avaliação da visão e saúde ocular" },
    { care: "Exame Dentário", frequency: "2x por ano", description: "Limpeza e prevenção de problemas bucais" },
    { care: "Mamografia", frequency: "Anual após 40 anos", description: "Prevenção do câncer de mama" },
    { care: "Papanicolau", frequency: "Anual ou conforme orientação", description: "Prevenção do câncer cervical" },
    { care: "Colonoscopia", frequency: "Conforme orientação médica", description: "Prevenção do câncer colorretal" },
    { care: "Vacinação", frequency: "Conforme calendário", description: "Manter cartão de vacinas atualizado" }
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Activity className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Saúde e Bem-estar</h2>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> As orientações abaixo são apenas informativas. 
          Sempre consulte um médico para diagnóstico e tratamento adequados.
        </AlertDescription>
      </Alert>

      {/* Sintomas Físicos */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleCategory('physical')}
          >
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-blue-500" />
              <span>Sintomas Físicos</span>
              <Badge variant="secondary">{physicalSymptoms.length}</Badge>
            </div>
            {expandedCategory === 'physical' ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </CardTitle>
        </CardHeader>
        
        {expandedCategory === 'physical' && (
          <CardContent>
            <div className="space-y-4">
              {physicalSymptoms.map((symptom, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{symptom.name}</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Exames sugeridos:</p>
                    <div className="flex flex-wrap gap-2">
                      {symptom.exams.map((exam, examIndex) => (
                        <Badge key={examIndex} variant="outline" className="text-xs">
                          {exam}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Saúde Mental */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleCategory('mental')}
          >
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <span>Saúde Mental</span>
              <Badge variant="secondary">{mentalHealthSymptoms.length}</Badge>
            </div>
            {expandedCategory === 'mental' ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </CardTitle>
        </CardHeader>
        
        {expandedCategory === 'mental' && (
          <CardContent>
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                A Unomed não possui psicólogo(a) em sua equipe. 
                Para questões de saúde mental, recomendamos buscar profissionais especializados.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              {mentalHealthSymptoms.map((symptom, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{symptom.name}</h4>
                  <p className="text-sm text-gray-600">{symptom.guidance}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Nutrição */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleCategory('nutrition')}
          >
            <div className="flex items-center space-x-2">
              <Apple className="h-5 w-5 text-green-500" />
              <span>Nutrição e Alimentação</span>
              <Badge variant="secondary">{nutritionTips.length}</Badge>
            </div>
            {expandedCategory === 'nutrition' ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </CardTitle>
        </CardHeader>
        
        {expandedCategory === 'nutrition' && (
          <CardContent>
            <div className="space-y-4">
              {nutritionTips.map((tip, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{tip.topic}</h4>
                  <p className="text-sm text-gray-700 mb-1">{tip.guidance}</p>
                  <p className="text-xs text-gray-500">{tip.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Exercícios */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleCategory('exercise')}
          >
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-5 w-5 text-orange-500" />
              <span>Exercícios e Atividade Física</span>
              <Badge variant="secondary">{exerciseTips.length}</Badge>
            </div>
            {expandedCategory === 'exercise' ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </CardTitle>
        </CardHeader>
        
        {expandedCategory === 'exercise' && (
          <CardContent>
            <div className="space-y-4">
              {exerciseTips.map((exercise, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{exercise.activity}</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-blue-600 font-medium">Frequência: {exercise.frequency}</p>
                    <p className="text-xs text-gray-600">{exercise.benefits}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Cuidados Preventivos */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleCategory('preventive')}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              <span>Cuidados Preventivos</span>
              <Badge variant="secondary">{preventiveCare.length}</Badge>
            </div>
            {expandedCategory === 'preventive' ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </CardTitle>
        </CardHeader>
        
        {expandedCategory === 'preventive' && (
          <CardContent>
            <div className="space-y-4">
              {preventiveCare.map((care, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{care.care}</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-indigo-600 font-medium">Frequência: {care.frequency}</p>
                    <p className="text-xs text-gray-600">{care.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Disclaimer Médico */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900 mb-1">Aviso Médico Importante</h4>
              <p className="text-sm text-orange-800">
                As informações apresentadas são de caráter educativo e não substituem 
                a consulta médica. Em caso de sintomas persistentes ou preocupantes, 
                procure imediatamente um profissional de saúde qualificado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
