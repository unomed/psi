import { ChecklistTemplate } from "@/types";

interface StandardTemplate {
  id: string;
  name: string;
  description: string;
  type: "disc" | "psicossocial" | "stress" | "custom";
  scale_type: "likert5" | "binary" | "percentage" | "numeric" | "likert" | "yes_no" | "psicossocial";
  estimated_time_minutes: number;
  questions: (string | { text: string })[];
  instructions?: string;
}

const SRQ20_TEMPLATE: StandardTemplate = {
  id: "srq20",
  name: "SRQ-20 - Self-Reporting Questionnaire",
  description: "Questionário de rastreamento de transtornos mentais comuns",
  type: "psicossocial",
  scale_type: "binary",
  estimated_time_minutes: 5,
  questions: [
    "Você frequentemente tem dores de cabeça?",
    "Você tem pouco apetite?",
    "Você dorme mal?",
    "Você se assusta facilmente?",
    "Você se sente nervoso(a), tenso(a) ou preocupado(a)?",
    "Você sente tremores nas mãos?",
    "Você se sente cansado(a) o tempo todo?",
    "Você tem problemas de digestão?",
    "Você tem dificuldades para pensar claramente?",
    "Você se sente infeliz?",
    "Você chora mais do que de costume?",
    "Você acha difícil aproveitar as coisas?",
    "Você acha difícil tomar decisões?",
    "Você acha difícil fazer suas tarefas?",
    "Você se sente incapaz de desempenhar um papel útil na vida?",
    "Você perdeu o interesse pelas coisas?",
    "Você se sente uma pessoa inútil?",
    "Você tem se sentido cansado(a)?",
    "Você tem alguma dor ou desconforto no corpo?",
    "Você se sente facilmente cansado(a)?"
  ],
  instructions: "Responda SIM ou NÃO para cada pergunta, considerando os últimos 30 dias."
};

const PHQ9_TEMPLATE: StandardTemplate = {
  id: "phq9",
  name: "PHQ-9 - Patient Health Questionnaire-9",
  description: "Questionário de rastreamento de depressão",
  type: "psicossocial",
  scale_type: "likert5",
  estimated_time_minutes: 5,
  questions: [
    "Pouco interesse ou prazer em fazer as coisas",
    "Sentindo-se para baixo, deprimido(a) ou sem esperança",
    "Dificuldade em adormecer ou permanecer dormindo, ou dormindo demais",
    "Sentindo-se cansado(a) ou com pouca energia",
    "Falta de apetite ou comendo demais",
    "Sentindo-se mal consigo mesmo(a) - ou que você é um fracasso ou que decepcionou a si mesmo(a) ou à sua família",
    "Dificuldade em se concentrar nas coisas, como ler um jornal ou assistir televisão",
    "Movendo-se ou falando tão lentamente que outras pessoas poderiam ter notado? Ou o oposto; estando tão inquieto(a) que você está se movendo muito mais do que o normal",
    "Pensamentos de que você estaria melhor morto(a) ou de se machucar de alguma forma"
  ],
  instructions: "Responda cada questão com base em como você se sentiu NAS ÚLTIMAS DUAS SEMANAS."
};

const GAD7_TEMPLATE: StandardTemplate = {
  id: "gad7",
  name: "GAD-7 - Generalized Anxiety Disorder 7-item scale",
  description: "Questionário de rastreamento de ansiedade generalizada",
  type: "psicossocial",
  scale_type: "likert5",
  estimated_time_minutes: 5,
  questions: [
    "Sentindo-se nervoso(a), ansioso(a) ou muito agitado(a)",
    "Não conseguindo parar ou controlar a preocupação",
    "Preocupando-se demais com diferentes coisas",
    "Tendo dificuldade em relaxar",
    "Estando tão inquieto(a) que é difícil ficar parado(a)",
    "Tornando-se facilmente irritado(a) ou aborrecido(a)",
    "Sentindo medo como se algo terrível pudesse acontecer"
  ],
  instructions: "Responda cada questão com base em como você se sentiu NAS ÚLTIMAS DUAS SEMANAS."
};

const MBI_TEMPLATE: StandardTemplate = {
  id: "mbi",
  name: "MBI - Maslach Burnout Inventory",
  description: "Questionário de rastreamento de burnout",
  type: "psicossocial",
  scale_type: "likert5",
  estimated_time_minutes: 10,
  questions: [
    "Eu me sinto emocionalmente esgotado(a) pelo meu trabalho",
    "Eu me sinto esgotado(a) no final do dia de trabalho",
    "Eu me sinto cansado(a) quando me levanto pela manhã e tenho que encarar outro dia de trabalho",
    "Eu posso facilmente entender como meus pacientes se sentem em relação às coisas",
    "Eu sinto que estou tratando alguns pacientes como se fossem objetos impessoais",
    "Eu sinto que trabalhar com pessoas é estressante demais para mim",
    "Eu sinto que estou dando demais às pessoas",
    "Eu sinto que estou energizado(a) pelo meu trabalho",
    "Eu sinto que estou fazendo uma contribuição efetiva para as coisas",
    "Eu sinto que estou no limite",
    "Eu sinto que estou ficando mais insensível com as pessoas desde que comecei a trabalhar",
    "Eu me preocupo que este trabalho esteja me endurecendo emocionalmente",
    "Eu me sinto muito enérgico(a)",
    "Eu sinto que estou frustrado(a) com meu trabalho",
    "Eu sinto que não me importo realmente com o que acontece com alguns pacientes",
    "Eu sinto que trabalhar com pessoas é recompensador",
    "Eu sinto que estou em muitas situações emocionais",
    "Eu sinto que realizei muitas coisas valiosas neste trabalho",
    "Eu sinto que não consigo mais ser compreensivo(a) com meus pacientes",
    "Eu sinto que estou no limite"
  ],
  instructions: "Responda cada questão com base em como você se sente EM RELAÇÃO AO SEU TRABALHO."
};

const AUDIT_TEMPLATE: StandardTemplate = {
  id: "audit",
  name: "AUDIT - Alcohol Use Disorders Identification Test",
  description: "Questionário de rastreamento de transtornos por uso de álcool",
  type: "psicossocial",
  scale_type: "likert5",
  estimated_time_minutes: 5,
  questions: [
    "Com que frequência você costuma tomar alguma bebida que contenha álcool?",
    "Quantas doses que contenham álcool você costuma tomar em um dia normal?",
    "Com que frequência você toma seis ou mais doses em uma única ocasião?",
    "Com que frequência, durante o ano passado, você descobriu que não foi capaz de parar de beber uma vez que havia começado?",
    "Com que frequência, durante o ano passado, você deixou de fazer o que era esperado de você por causa da bebida?",
    "Com que frequência, durante o ano passado, você precisou de uma primeira bebida pela manhã para se firmar depois de uma bebedeira?",
    "Com que frequência, durante o ano passado, você teve um sentimento de culpa ou remorso depois de beber?",
    "Com que frequência, durante o ano passado, você não conseguiu se lembrar do que aconteceu na noite anterior por causa da bebida?",
    "Você ou outra pessoa já se machucou por causa da sua bebida?",
    "Algum familiar, amigo, médico ou outro profissional de saúde já se mostrou preocupado com a sua bebida ou sugeriu que você a reduzisse?"
  ],
  instructions: "Responda cada questão com base em como você se sentiu NO ÚLTIMO ANO."
};

export const STANDARD_QUESTIONNAIRE_TEMPLATES: StandardTemplate[] = [
  SRQ20_TEMPLATE,
  PHQ9_TEMPLATE,
  GAD7_TEMPLATE,
  MBI_TEMPLATE,
  AUDIT_TEMPLATE
];

export const createStandardTemplate = (templateId: string): ChecklistTemplate | null => {
  const standardTemplate = STANDARD_QUESTIONNAIRE_TEMPLATES.find(t => t.id === templateId);
  if (!standardTemplate) return null;

  return {
    id: `standard-${templateId}`,
    name: standardTemplate.name,
    title: standardTemplate.name,
    description: standardTemplate.description,
    category: standardTemplate.type,
    scale_type: standardTemplate.scale_type,
    is_standard: true,
    is_active: true,
    estimated_time_minutes: standardTemplate.estimated_time_minutes,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    instructions: standardTemplate.instructions,
    type: standardTemplate.type,
    questions: standardTemplate.questions.map((q, index) => ({
      id: `q-${index}`,
      template_id: `standard-${templateId}`,
      question_text: typeof q === 'string' ? q : q.text || '',
      text: typeof q === 'string' ? q : q.text || '',
      order_number: index + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
  };
};
