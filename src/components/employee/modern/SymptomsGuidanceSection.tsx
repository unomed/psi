
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  Shield,
  Heart,
  BookOpen,
  Zap,
  Clock,
  Calendar,
  Search,
  Phone,
  MessageSquare,
  Mail
} from "lucide-react";

export function SymptomsGuidanceSection() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("sintomas");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Usando useMemo para evitar recriação dos arrays em cada renderização
  const physicalSymptoms = useMemo(() => [
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
  ], []);

  const mentalHealthSymptoms = useMemo(() => [
    { name: "Ansiedade persistente", guidance: "Procure um médico clínico ou psiquiatra para avaliação" },
    { name: "Tristeza profunda", guidance: "Importante buscar acompanhamento médico especializado" },
    { name: "Insônia crônica", guidance: "Consulte um médico para investigação das causas" },
    { name: "Irritabilidade excessiva", guidance: "Avaliação médica pode ajudar a identificar causas" },
    { name: "Perda de interesse", guidance: "Sintoma que requer atenção médica especializada" },
    { name: "Dificuldade de concentração", guidance: "Procure orientação médica para investigação" }
  ], []);

  const nutritionTips = useMemo(() => [
    { topic: "Hidratação", guidance: "Beba pelo menos 2 litros de água por dia", details: "Mantenha uma garrafa de água sempre por perto" },
    { topic: "Frutas e Vegetais", guidance: "Consuma ao menos 5 porções por dia", details: "Variedade de cores garante diferentes nutrientes" },
    { topic: "Proteínas", guidance: "Inclua proteínas em todas as refeições", details: "Carnes magras, ovos, leguminosas e laticínios" },
    { topic: "Carboidratos Integrais", guidance: "Prefira versões integrais", details: "Arroz integral, pães integrais, aveia" },
    { topic: "Redução de Açúcar", guidance: "Limite doces e refrigerantes", details: "Prefira frutas como sobremesa" },
    { topic: "Horários Regulares", guidance: "Faça refeições em horários fixos", details: "Evite pular refeições principais" }
  ], []);

  const exerciseTips = useMemo(() => [
    { activity: "Caminhada", frequency: "30 min, 5x por semana", benefits: "Melhora cardiovascular e disposição" },
    { activity: "Alongamento", frequency: "10 min diários", benefits: "Flexibilidade e alívio de tensões" },
    { activity: "Musculação", frequency: "2-3x por semana", benefits: "Fortalecimento muscular e ósseo" },
    { activity: "Dança", frequency: "2x por semana", benefits: "Coordenação e bem-estar mental" },
    { activity: "Natação", frequency: "2-3x por semana", benefits: "Exercício completo, baixo impacto" },
    { activity: "Yoga/Pilates", frequency: "2x por semana", benefits: "Flexibilidade, força e relaxamento" }
  ], []);

  const preventiveCare = useMemo(() => [
    { care: "Check-up Anual", frequency: "1x por ano", description: "Exames gerais para prevenção" },
    { care: "Exame Oftalmológico", frequency: "1-2x por ano", description: "Avaliação da visão e saúde ocular" },
    { care: "Exame Dentário", frequency: "2x por ano", description: "Limpeza e prevenção de problemas bucais" },
    { care: "Mamografia", frequency: "Anual após 40 anos", description: "Prevenção do câncer de mama" },
    { care: "Papanicolau", frequency: "Anual ou conforme orientação", description: "Prevenção do câncer cervical" },
    { care: "Colonoscopia", frequency: "Conforme orientação médica", description: "Prevenção do câncer colorretal" },
    { care: "Vacinação", frequency: "Conforme calendário", description: "Manter cartão de vacinas atualizado" }
  ], []);
  
  // Estado para itens filtrados
  const [filteredItems, setFilteredItems] = useState({
    physical: physicalSymptoms,
    mental: mentalHealthSymptoms,
    nutrition: nutritionTips,
    exercise: exerciseTips,
    preventive: preventiveCare
  });

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Função para filtrar itens com base no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems({
        physical: physicalSymptoms,
        mental: mentalHealthSymptoms,
        nutrition: nutritionTips,
        exercise: exerciseTips,
        preventive: preventiveCare
      });
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    const newFilteredItems = {
      physical: physicalSymptoms.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.exams.some(exam => exam.toLowerCase().includes(term))
      ),
      mental: mentalHealthSymptoms.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.guidance.toLowerCase().includes(term)
      ),
      nutrition: nutritionTips.filter(item => 
        item.topic.toLowerCase().includes(term) || 
        item.guidance.toLowerCase().includes(term) || 
        item.details.toLowerCase().includes(term)
      ),
      exercise: exerciseTips.filter(item => 
        item.activity.toLowerCase().includes(term) || 
        item.frequency.toLowerCase().includes(term) || 
        item.benefits.toLowerCase().includes(term)
      ),
      preventive: preventiveCare.filter(item => 
        item.care.toLowerCase().includes(term) || 
        item.frequency.toLowerCase().includes(term) || 
        item.description.toLowerCase().includes(term)
      )
    };
    
    setFilteredItems(newFilteredItems);

    // Se encontrou resultados em alguma categoria, mude para a aba correspondente
    if (newFilteredItems.physical.length > 0 || newFilteredItems.mental.length > 0) {
      setActiveTab("sintomas");
    } else if (newFilteredItems.nutrition.length > 0 || newFilteredItems.exercise.length > 0) {
      setActiveTab("habitos");
    } else if (newFilteredItems.preventive.length > 0) {
      setActiveTab("prevencao");
    }
  }, [searchTerm, physicalSymptoms, mentalHealthSymptoms, nutritionTips, exerciseTips, preventiveCare]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Heart className="h-8 w-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Orientações de Saúde e Bem-estar</h2>
            </div>
            <p className="text-white/90 ml-11">Informações e dicas para cuidar da sua saúde física e mental</p>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2">
            <Phone className="h-4 w-4" /> Contato Médico
          </Button>
        </div>
      </div>
      
      {/* Barra de pesquisa */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Pesquisar sintomas, dicas ou cuidados..."
          className="pl-10 bg-white border-gray-200 focus:border-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm("")}
          >
            Limpar
          </Button>
        )}
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertTriangle className="h-5 w-5 text-blue-600" />
        <div>
          <AlertTitle className="text-blue-800 font-medium">Atenção</AlertTitle>
          <AlertDescription className="text-blue-700">
            As orientações abaixo são apenas informativas. 
            Sempre consulte um médico para diagnóstico e tratamento adequados.
          </AlertDescription>
        </div>
      </Alert>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="sintomas" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" /> Sintomas
          </TabsTrigger>
          <TabsTrigger value="habitos" className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Hábitos Saudáveis
          </TabsTrigger>
          <TabsTrigger value="prevencao" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Prevenção
          </TabsTrigger>
        </TabsList>

        {/* Aba de Sintomas */}
        <TabsContent value="sintomas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sintomas Físicos */}
            <Card className="overflow-hidden border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-blue-800">Sintomas Físicos</CardTitle>
                </div>
                <CardDescription className="text-blue-600">
                  Identifique sintomas e exames recomendados
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredItems.physical.map((symptom, index) => (
                    <div key={index} className="border border-blue-100 rounded-lg p-4 bg-white hover:bg-blue-50 transition-colors">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        {symptom.name}
                      </h4>
                      <div className="space-y-2">
                        <p className="text-sm text-blue-700 font-medium">Exames sugeridos:</p>
                        <div className="flex flex-wrap gap-2">
                          {symptom.exams.map((exam, examIndex) => (
                            <Badge key={examIndex} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {exam}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Saúde Mental */}
            <Card className="overflow-hidden border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-purple-800">Saúde Mental</CardTitle>
                </div>
                <CardDescription className="text-purple-600">
                  Orientações sobre saúde mental e bem-estar psicológico
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <Alert className="mb-4 bg-purple-50 border-purple-200">
                  <Info className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-700">
                    Para questões de saúde mental, recomendamos buscar profissionais especializados.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  {filteredItems.mental.map((symptom, index) => (
                    <div key={index} className="border border-purple-100 rounded-lg p-4 bg-white hover:bg-purple-50 transition-colors">
                      <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                        {symptom.name}
                      </h4>
                      <p className="text-sm text-purple-700">{symptom.guidance}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Hábitos Saudáveis */}
        <TabsContent value="habitos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nutrição */}
            <Card className="overflow-hidden border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
                <div className="flex items-center space-x-2">
                  <Apple className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-green-800">Nutrição e Alimentação</CardTitle>
                </div>
                <CardDescription className="text-green-600">
                  Dicas para uma alimentação equilibrada e saudável
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredItems.nutrition.map((tip, index) => (
                    <div key={index} className="border border-green-100 rounded-lg p-4 bg-white hover:bg-green-50 transition-colors">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        {tip.topic}
                      </h4>
                      <p className="text-sm text-green-800 font-medium mb-1">{tip.guidance}</p>
                      <p className="text-xs text-green-700">{tip.details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Exercícios */}
            <Card className="overflow-hidden border-orange-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-orange-800">Exercícios Físicos</CardTitle>
                </div>
                <CardDescription className="text-orange-600">
                  Atividades físicas recomendadas para seu bem-estar
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {filteredItems.exercise.map((tip, index) => (
                    <div key={index} className="border border-orange-100 rounded-lg p-4 bg-white hover:bg-orange-50 transition-colors">
                      <h4 className="font-medium text-orange-900 mb-2 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                        {tip.activity}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-orange-50 p-2 rounded-md">
                          <p className="text-xs text-orange-800 font-medium">Frequência</p>
                          <p className="text-sm text-orange-700">{tip.frequency}</p>
                        </div>
                        <div className="bg-orange-50 p-2 rounded-md">
                          <p className="text-xs text-orange-800 font-medium">Benefícios</p>
                          <p className="text-sm text-orange-700">{tip.benefits}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Prevenção */}
        <TabsContent value="prevencao" className="space-y-6">
          <Card className="overflow-hidden border-teal-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100 border-b border-teal-200">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-teal-600" />
                <CardTitle className="text-teal-800">Cuidados Preventivos</CardTitle>
              </div>
              <CardDescription className="text-teal-600">
                Exames e cuidados recomendados para prevenção de doenças
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.preventive.map((item, index) => (
                  <div key={index} className="border border-teal-100 rounded-lg p-4 bg-white hover:bg-teal-50 transition-colors">
                    <h4 className="font-medium text-teal-900 mb-3 flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
                      {item.care}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-teal-600 mr-2" />
                        <p className="text-sm text-teal-700">{item.frequency}</p>
                      </div>
                      <div className="flex items-start">
                        <Info className="h-4 w-4 text-teal-600 mr-2 mt-0.5" />
                        <p className="text-sm text-teal-700">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-teal-50 border-l-4 border-teal-400 rounded-md">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-teal-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-teal-900 mb-1">Lembrete importante</h4>
                    <p className="text-sm text-teal-700">
                      Mantenha um calendário de exames preventivos e consulte seu médico regularmente, mesmo sem sintomas aparentes.
                      A prevenção é sempre o melhor caminho para uma vida saudável.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
      
      {/* Seção de Contato */}
      <Card className="border-blue-200 shadow-sm mt-6">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-800">Precisa de ajuda?</CardTitle>
          </div>
          <CardDescription className="text-blue-600">
            Entre em contato com nossa equipe de saúde
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-center gap-2 h-auto py-3">
              <Phone className="h-5 w-5 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">Telefone</p>
                <p className="text-sm text-gray-500">(42) 3232-2273</p>
              </div>
            </Button>
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-center gap-2 h-auto py-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">E-mail</p>
                <p className="text-sm text-gray-500">atendimento@unomed.med.br</p>
              </div>
            </Button>
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-center gap-2 h-auto py-3">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div className="text-left">
                <p className="font-medium">Chat</p>
                <p className="text-sm text-gray-500">Atendimento online</p>
              </div>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-blue-50 border-t border-blue-100 flex justify-center p-4">
          <p className="text-sm text-blue-700 text-center">
            Horário de atendimento: Segunda a Sexta, das 8h às 18h
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
