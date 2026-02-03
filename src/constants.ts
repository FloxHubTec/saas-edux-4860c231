import { School, Student, Route, Professor, EnrollmentApplication, EnrollmentStatus, CalendarEvent, LessonPlan, Assessment } from './types';

// ==================== CONFIGURAÇÃO WHITE LABEL ====================
export interface TenantConfig {
  id: string;
  name: string;
  logoUrl?: string;
  colors: {
    primary: string;      // HSL values: "45 93% 52%"
    dark: string;
    secondary: string;
    accent: string;
    light: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
    muted: string;
  };
}

// Configuração padrão do tenant (pode ser sobrescrita pela Diretoria)
export const DEFAULT_TENANT_CONFIG: TenantConfig = {
  id: 'default',
  name: 'EduX',
  logoUrl: '',
  colors: {
    primary: '45 93% 52%',
    dark: '240 17% 14%',
    secondary: '220 14% 40%',
    accent: '220 90% 56%',
    light: '220 14% 96%',
    success: '160 84% 39%',
    danger: '0 84% 60%',
    warning: '38 92% 50%',
    info: '217 91% 60%',
    muted: '220 9% 46%',
  },
};

// Função para aplicar configuração de tenant via CSS
export const applyTenantConfig = (config: TenantConfig) => {
  const root = document.documentElement;
  root.style.setProperty('--brand-primary', config.colors.primary);
  root.style.setProperty('--brand-dark', config.colors.dark);
  root.style.setProperty('--brand-secondary', config.colors.secondary);
  root.style.setProperty('--brand-accent', config.colors.accent);
  root.style.setProperty('--brand-light', config.colors.light);
  root.style.setProperty('--brand-success', config.colors.success);
  root.style.setProperty('--brand-danger', config.colors.danger);
  root.style.setProperty('--brand-warning', config.colors.warning);
  root.style.setProperty('--brand-info', config.colors.info);
  root.style.setProperty('--brand-muted', config.colors.muted);
  if (config.logoUrl) {
    root.style.setProperty('--brand-logo-url', `url(${config.logoUrl})`);
  }
};

// ==================== DADOS MOCK ====================
export const MOCK_SCHOOLS: School[] = [
  { id: 'escola-01', name: 'EMEF Prof. Maria Silva', students: 420, maxCapacity: 500, address: 'Rua das Flores, 123 - Centro', levels: ['Fundamental I', 'Fundamental II'], isEnrollmentOpen: true },
  { id: 'escola-02', name: 'EMEI Pequenos Sonhos', students: 180, maxCapacity: 200, address: 'Av. Brasil, 456 - Jardim Primavera', levels: ['Infantil'], isEnrollmentOpen: false },
  { id: 'escola-03', name: 'EMEF Dr. Carlos Santos', students: 380, maxCapacity: 450, address: 'Rua Ipê, 789 - Vila Nova', levels: ['Fundamental I', 'Fundamental II'], isEnrollmentOpen: true },
  { id: 'escola-04', name: 'Creche Municipal Sol Nascente', students: 95, maxCapacity: 100, address: 'Rua das Acácias, 321 - Centro', levels: ['Creche'], isEnrollmentOpen: false },
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'stu-01',
    name: 'Ana Clara Oliveira',
    birthDate: '2015-03-15',
    currentGrade: '4º Ano A',
    schoolId: 'escola-01',
    photo: 'https://images.unsplash.com/photo-1595454223600-91548e6f57cd?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    documents: { cpf: '123.456.789-00', rg: '12.345.678-9', birthCertificate: 'BC-001', proofOfAddress: 'PA-001' },
    responsibles: [
      { name: 'Maria Oliveira', relationship: 'Mãe', phone: '(11) 99999-0001', email: 'maria@email.com', cpf: '987.654.321-00' }
    ],
    academicRecords: {
      'Português': { grades: { 1: 8.5, 2: 7.0, 3: 9.0, 4: null }, absences: { 1: 2, 2: 1, 3: 3, 4: null }, recovery: null },
      'Matemática': { grades: { 1: 7.0, 2: 6.5, 3: 8.0, 4: null }, absences: { 1: 1, 2: 2, 3: 1, 4: null }, recovery: null },
      'Ciências': { grades: { 1: 9.0, 2: 8.5, 3: 9.5, 4: null }, absences: { 1: 0, 2: 1, 3: 0, 4: null }, recovery: null },
      'História': { grades: { 1: 8.0, 2: 7.5, 3: 8.5, 4: null }, absences: { 1: 1, 2: 0, 3: 2, 4: null }, recovery: null },
      'Geografia': { grades: { 1: 7.5, 2: 8.0, 3: 7.0, 4: null }, absences: { 1: 2, 2: 1, 3: 1, 4: null }, recovery: null },
    }
  },
  {
    id: 'stu-02',
    name: 'Pedro Henrique Costa',
    birthDate: '2014-07-22',
    currentGrade: '5º Ano B',
    schoolId: 'escola-01',
    photo: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    documents: { cpf: '234.567.890-11', rg: '23.456.789-0', birthCertificate: 'BC-002', proofOfAddress: 'PA-002' },
    responsibles: [
      { name: 'José Costa', relationship: 'Pai', phone: '(11) 99999-0002', email: 'jose@email.com', cpf: '876.543.210-99' }
    ],
    academicRecords: {
      'Português': { grades: { 1: 6.0, 2: 5.5, 3: 6.5, 4: null }, absences: { 1: 4, 2: 3, 3: 5, 4: null }, recovery: 7.0 },
      'Matemática': { grades: { 1: 5.0, 2: 6.0, 3: 5.5, 4: null }, absences: { 1: 3, 2: 4, 3: 3, 4: null }, recovery: 6.5 },
      'Ciências': { grades: { 1: 7.0, 2: 6.5, 3: 7.5, 4: null }, absences: { 1: 2, 2: 2, 3: 2, 4: null }, recovery: null },
      'História': { grades: { 1: 6.5, 2: 7.0, 3: 6.0, 4: null }, absences: { 1: 3, 2: 2, 3: 4, 4: null }, recovery: null },
      'Geografia': { grades: { 1: 7.0, 2: 7.5, 3: 7.0, 4: null }, absences: { 1: 2, 2: 1, 3: 3, 4: null }, recovery: null },
    }
  },
  {
    id: 'stu-03',
    name: 'Beatriz Santos Lima',
    birthDate: '2016-11-08',
    currentGrade: '3º Ano A',
    schoolId: 'escola-03',
    photo: 'https://images.unsplash.com/photo-1595454223600-91548e6f57cd?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    documents: { cpf: '345.678.901-22', rg: '34.567.890-1', birthCertificate: 'BC-003', proofOfAddress: 'PA-003' },
    responsibles: [
      { name: 'Fernanda Lima', relationship: 'Mãe', phone: '(11) 99999-0003', email: 'fernanda@email.com', cpf: '765.432.109-88' }
    ],
    academicRecords: {
      'Português': { grades: { 1: 9.5, 2: 9.0, 3: 9.5, 4: null }, absences: { 1: 0, 2: 1, 3: 0, 4: null }, recovery: null },
      'Matemática': { grades: { 1: 10.0, 2: 9.5, 3: 10.0, 4: null }, absences: { 1: 0, 2: 0, 3: 1, 4: null }, recovery: null },
      'Ciências': { grades: { 1: 9.0, 2: 9.5, 3: 9.0, 4: null }, absences: { 1: 1, 2: 0, 3: 0, 4: null }, recovery: null },
      'História': { grades: { 1: 9.5, 2: 9.0, 3: 9.5, 4: null }, absences: { 1: 0, 2: 1, 3: 1, 4: null }, recovery: null },
      'Geografia': { grades: { 1: 9.0, 2: 9.5, 3: 9.0, 4: null }, absences: { 1: 1, 2: 0, 3: 0, 4: null }, recovery: null },
    }
  }
];

export const MOCK_PROFESSORS: Professor[] = [
  { id: 'prof-01', name: 'Carla Mendes', email: 'carla.mendes@edu.gov', cpf: '111.222.333-44', subjects: ['Português', 'Redação'], schoolIds: ['escola-01'], classes: ['4º Ano A', '5º Ano B'], status: 'active', hireDate: '2018-02-15' },
  { id: 'prof-02', name: 'Roberto Alves', email: 'roberto.alves@edu.gov', cpf: '222.333.444-55', subjects: ['Matemática'], schoolIds: ['escola-01', 'escola-03'], classes: ['4º Ano A', '5º Ano B', '3º Ano A'], status: 'active', hireDate: '2015-08-01' },
  { id: 'prof-03', name: 'Juliana Ferreira', email: 'juliana.ferreira@edu.gov', cpf: '333.444.555-66', subjects: ['Ciências', 'Geografia'], schoolIds: ['escola-03'], classes: ['3º Ano A', '4º Ano B'], status: 'active', hireDate: '2020-03-10' },
];

export const MOCK_ROUTES: Route[] = [
  { id: 'route-01', name: 'Rota Centro-Norte', vehicle: 'Ônibus Escolar 01', driver: 'João da Silva', capacity: 45, passengersCount: 38, status: 'active', stops: ['Praça Central', 'Av. Norte', 'Rua das Flores', 'EMEF Prof. Maria Silva'] },
  { id: 'route-02', name: 'Rota Sul', vehicle: 'Van Escolar 02', driver: 'Maria Santos', capacity: 15, passengersCount: 12, status: 'active', stops: ['Bairro Sul', 'Vila Nova', 'EMEF Dr. Carlos Santos'] },
  { id: 'route-03', name: 'Rota Rural', vehicle: 'Ônibus Escolar 03', driver: 'Pedro Costa', capacity: 40, passengersCount: 25, status: 'maintenance', stops: ['Sítio Boa Vista', 'Fazenda Esperança', 'Bairro Rural', 'Centro'] },
];

export const MOCK_ENROLLMENTS: EnrollmentApplication[] = [
  { id: 'enroll-01', studentName: 'Lucas Gabriel Souza', birthDate: '2017-05-20', requestedGrade: '2º Ano', schoolId: 'escola-01', status: EnrollmentStatus.PENDING, submittedAt: '2024-11-15T10:30:00', documents: [{ name: 'Certidão de Nascimento', status: 'approved' }, { name: 'Comprovante de Residência', status: 'pending' }, { name: 'Carteira de Vacinação', status: 'approved' }], responsibleName: 'Marcos Souza', responsibleCpf: '444.555.666-77', responsiblePhone: '(11) 99999-1234', responsibleEmail: 'marcos.souza@email.com', address: 'Rua das Palmeiras, 456 - Centro' },
  { id: 'enroll-02', studentName: 'Isabela Martins', birthDate: '2018-09-12', requestedGrade: '1º Ano', schoolId: 'escola-01', status: EnrollmentStatus.ANALYSIS, submittedAt: '2024-11-14T14:20:00', documents: [{ name: 'Certidão de Nascimento', status: 'approved' }, { name: 'Comprovante de Residência', status: 'approved' }, { name: 'Carteira de Vacinação', status: 'rejected' }], responsibleName: 'Ana Martins', responsibleCpf: '555.666.777-88', responsiblePhone: '(11) 99999-5678', responsibleEmail: 'ana.martins@email.com', address: 'Av. Brasil, 789 - Jardim Primavera', notes: 'Aguardando nova carteira de vacinação' },
  { id: 'enroll-03', studentName: 'Matheus Rocha', birthDate: '2016-02-28', requestedGrade: '3º Ano', schoolId: 'escola-03', status: EnrollmentStatus.APPROVED, submittedAt: '2024-11-10T09:00:00', documents: [{ name: 'Certidão de Nascimento', status: 'approved' }, { name: 'Comprovante de Residência', status: 'approved' }, { name: 'Carteira de Vacinação', status: 'approved' }], responsibleName: 'Carlos Rocha', responsibleCpf: '666.777.888-99', responsiblePhone: '(11) 99999-9012', responsibleEmail: 'carlos.rocha@email.com', address: 'Rua Ipê, 321 - Vila Nova' },
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'evt-01', title: 'Início do Ano Letivo', date: '2024-02-05', type: 'event', description: 'Primeiro dia de aula para todos os alunos' },
  { id: 'evt-02', title: 'Carnaval', date: '2024-02-12', endDate: '2024-02-14', type: 'holiday', description: 'Feriado de Carnaval - Recesso escolar' },
  { id: 'evt-03', title: 'Reunião de Pais - 1º Bimestre', date: '2024-04-15', type: 'meeting', description: 'Entrega de boletins e reunião com responsáveis' },
  { id: 'evt-04', title: 'Festa Junina', date: '2024-06-22', type: 'event', schoolId: 'escola-01', description: 'Festa Junina da escola - Participação de toda a comunidade' },
  { id: 'evt-05', title: 'Recesso de Julho', date: '2024-07-08', endDate: '2024-07-22', type: 'holiday', description: 'Férias escolares de meio de ano' },
  { id: 'evt-06', title: 'Dia dos Professores', date: '2024-10-15', type: 'holiday', description: 'Feriado em homenagem aos professores' },
  { id: 'evt-07', title: 'Encerramento do Ano Letivo', date: '2024-12-20', type: 'event', description: 'Último dia de aula e entrega de boletins finais' },
];

export const MOCK_LESSON_PLANS: LessonPlan[] = [
  {
    id: 'lp-01',
    professorId: 'prof-01',
    subject: 'Português',
    className: '4º Ano A',
    bimester: 3,
    week: 1,
    theme: 'Gêneros Textuais: A Fábula',
    objectives: ['Identificar características do gênero fábula', 'Reconhecer a moral da história', 'Produzir pequenas fábulas'],
    content: 'Leitura e interpretação de fábulas clássicas de Esopo e La Fontaine. Identificação de personagens, conflito e moral.',
    methodology: 'Aula expositiva dialogada, leitura compartilhada, trabalho em grupos para criação de fábulas.',
    resources: ['Livro didático', 'Projetor', 'Folhas para produção textual'],
    evaluation: 'Produção de uma fábula original com moral definida pelo aluno.',
    status: 'approved',
    createdAt: '2024-07-25T10:00:00',
    updatedAt: '2024-07-28T14:30:00'
  },
  {
    id: 'lp-02',
    professorId: 'prof-02',
    subject: 'Matemática',
    className: '5º Ano B',
    bimester: 3,
    week: 1,
    theme: 'Frações: Conceitos Básicos',
    objectives: ['Compreender o conceito de fração', 'Identificar numerador e denominador', 'Resolver problemas com frações'],
    content: 'Introdução ao conceito de fração como parte de um todo. Nomenclatura e representação gráfica.',
    methodology: 'Aula prática com material concreto (pizzas de papel), resolução de exercícios em duplas.',
    resources: ['Material concreto', 'Livro didático', 'Fichas de exercícios'],
    evaluation: 'Lista de exercícios e participação em atividades práticas.',
    status: 'submitted',
    createdAt: '2024-07-26T08:00:00',
    updatedAt: '2024-07-26T08:00:00'
  }
];

export const MOCK_ASSESSMENTS: Assessment[] = [
  { id: 'assess-01', name: 'Prova de Português - 3º Bimestre', subject: 'Português', className: '4º Ano A', bimester: 3, schoolId: 'escola-01', professorId: 'prof-01', date: '2024-09-15', totalQuestions: 10, answerKey: ['A', 'B', 'C', 'A', 'D', 'B', 'C', 'A', 'B', 'D'], status: 'active' },
  { id: 'assess-02', name: 'Prova de Matemática - 3º Bimestre', subject: 'Matemática', className: '5º Ano B', bimester: 3, schoolId: 'escola-01', professorId: 'prof-02', date: '2024-09-18', totalQuestions: 10, answerKey: ['B', 'A', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B'], status: 'draft' },
];

export const GRADES_OPTIONS = ['Creche I', 'Creche II', 'Pré I', 'Pré II', '1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'];

export const SUBJECTS_LIST = ['Português', 'Matemática', 'Ciências', 'História', 'Geografia', 'Arte', 'Educação Física', 'Inglês', 'Redação'];

export const BIMESTERS = [1, 2, 3, 4];
