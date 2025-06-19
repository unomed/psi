
// ===== CONFIGURAÇÕES GLOBAIS DO SISTEMA =====

// Rotas principais do sistema
export const ROUTES = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    EMPLOYEE: '/auth/employee',
  },
  
  // Dashboard e páginas principais
  DASHBOARD: '/dashboard',
  
  // Gestão
  COMPANIES: '/empresas',
  EMPLOYEES: '/funcionarios',
  SECTORS: '/setores',
  ROLES: '/funcoes',
  
  // Avaliações
  ASSESSMENTS: '/avaliacoes',
  TEMPLATES: '/templates',
  RESULTS: '/resultados',
  SCHEDULING: '/agendamentos',
  
  // Análise e relatórios
  RISKS: '/gestao-riscos',
  ACTION_PLANS: '/plano-acao',
  REPORTS: '/relatorios',
  
  // Portal do funcionário
  EMPLOYEE_PORTAL: '/employee-portal',
  PUBLIC_ASSESSMENT: '/assessment',
  
  // Configurações
  SETTINGS: '/configuracoes',
  BILLING: '/faturamento',
  AUTOMATION: '/automacao-gestores',
} as const;

// Cores do tema PSI
export const PSI_COLORS = {
  PRIMARY: {
    blue: 'hsl(221, 83%, 53%)',
    teal: 'hsl(178, 60%, 45%)',
    amber: 'hsl(43, 96%, 56%)',
    red: 'hsl(0, 84%, 60%)',
  },
  RISK_LEVELS: {
    low: 'hsl(142, 71%, 45%)',
    medium: 'hsl(43, 96%, 56%)',
    high: 'hsl(25, 95%, 53%)',
    critical: 'hsl(0, 84%, 60%)',
  }
} as const;

// Configurações de avaliação
export const ASSESSMENT_CONFIG = {
  DEFAULT_EXPIRY_DAYS: 30,
  REMINDER_DAYS: [7, 3, 1],
  MAX_QUESTIONS_PER_TEMPLATE: 100,
  MIN_QUESTIONS_PER_TEMPLATE: 5,
} as const;

// Permissões por role
export const ROLE_PERMISSIONS = {
  superadmin: ['*'],
  admin: [
    'companies.manage',
    'employees.manage',
    'assessments.manage',
    'reports.view',
    'settings.manage'
  ],
  manager: [
    'employees.view',
    'assessments.create',
    'assessments.view',
    'reports.view'
  ],
  user: [
    'assessments.view',
    'reports.view'
  ],
  employee: [
    'portal.access',
    'assessments.respond'
  ]
} as const;
