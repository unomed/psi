
export const physicalSymptoms = [
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

export const mentalHealthSymptoms = [
  { name: "Ansiedade persistente", guidance: "Procure um médico clínico ou psiquiatra para avaliação" },
  { name: "Tristeza profunda", guidance: "Importante buscar acompanhamento médico especializado" },
  { name: "Insônia crônica", guidance: "Consulte um médico para investigação das causas" },
  { name: "Irritabilidade excessiva", guidance: "Avaliação médica pode ajudar a identificar causas" },
  { name: "Perda de interesse", guidance: "Sintoma que requer atenção médica especializada" },
  { name: "Dificuldade de concentração", guidance: "Procure orientação médica para investigação" }
];

export const nutritionTips = [
  { topic: "Hidratação", guidance: "Beba pelo menos 2 litros de água por dia", details: "Mantenha uma garrafa de água sempre por perto" },
  { topic: "Frutas e Vegetais", guidance: "Consuma ao menos 5 porções por dia", details: "Variedade de cores garante diferentes nutrientes" },
  { topic: "Proteínas", guidance: "Inclua proteínas em todas as refeições", details: "Carnes magras, ovos, leguminosas e laticínios" },
  { topic: "Carboidratos Integrais", guidance: "Prefira versões integrais", details: "Arroz integral, pães integrais, aveia" },
  { topic: "Redução de Açúcar", guidance: "Limite doces e refrigerantes", details: "Prefira frutas como sobremesa" },
  { topic: "Horários Regulares", guidance: "Faça refeições em horários fixos", details: "Evite pular refeições principais" }
];

export const exerciseTips = [
  { activity: "Caminhada", frequency: "30 min, 5x por semana", benefits: "Melhora cardiovascular e disposição" },
  { activity: "Alongamento", frequency: "10 min diários", benefits: "Flexibilidade e alívio de tensões" },
  { activity: "Musculação", frequency: "2-3x por semana", benefits: "Fortalecimento muscular e ósseo" },
  { activity: "Dança", frequency: "2x por semana", benefits: "Coordenação e bem-estar mental" },
  { activity: "Natação", frequency: "2-3x por semana", benefits: "Exercício completo, baixo impacto" },
  { activity: "Yoga/Pilates", frequency: "2x por semana", benefits: "Flexibilidade, força e relaxamento" }
];

export const preventiveCare = [
  { care: "Check-up Anual", frequency: "1x por ano", description: "Exames gerais para prevenção" },
  { care: "Exame Oftalmológico", frequency: "1-2x por ano", description: "Avaliação da visão e saúde ocular" },
  { care: "Exame Dentário", frequency: "2x por ano", description: "Limpeza e prevenção de problemas bucais" },
  { care: "Mamografia", frequency: "Anual após 40 anos", description: "Prevenção do câncer de mama" },
  { care: "Papanicolau", frequency: "Anual ou conforme orientação", description: "Prevenção do câncer cervical" },
  { care: "Colonoscopia", frequency: "Conforme orientação médica", description: "Prevenção do câncer colorretal" },
  { care: "Vacinação", frequency: "Conforme calendário", description: "Manter cartão de vacinas atualizado" }
];
