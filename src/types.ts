export enum UserRole {
  ADMIN = 'ADMIN',
  SECRETARY = 'SECRETARY',
  PROFESSOR = 'PROFESSOR',
  STUDENT = 'STUDENT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  isSelfRegistered?: boolean;
}

export interface School {
  id: string;
  name: string;
  students: number;
  maxCapacity?: number;
  address?: string;
  levels?: string[];
  isEnrollmentOpen?: boolean;
}

export interface Student {
  id: string;
  name: string;
  birthDate: string;
  currentGrade: string;
  schoolId: string;
  photo: string;
  status: 'active' | 'inactive' | 'transferred';
  documents: StudentDocuments;
  responsibles: Responsible[];
  academicRecords: Record<string, SubjectRecord>;
}

export interface SubjectRecord {
  grades: { [bimester: number]: number | null };
  absences: { [bimester: number]: number | null };
  recovery: number | null;
}

export interface StudentDocuments {
  cpf: string;
  rg?: string;
  birthCertificate?: string;
  proofOfAddress?: string;
  medicalInfo?: string;
}

export interface Responsible {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  cpf: string;
}

export enum EnrollmentStatus {
  PENDING = 'PENDING',
  ANALYSIS = 'ANALYSIS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WAITING_LIST = 'WAITING_LIST',
}

export interface EnrollmentApplication {
  id: string;
  studentName: string;
  birthDate: string;
  requestedGrade: string;
  schoolId: string;
  status: EnrollmentStatus;
  submittedAt: string;
  documents: { name: string; status: 'pending' | 'approved' | 'rejected' }[];
  responsibleName: string;
  responsibleCpf: string;
  responsiblePhone: string;
  responsibleEmail: string;
  address: string;
  notes?: string;
}

export interface Professor {
  id: string;
  name: string;
  email: string;
  cpf: string;
  subjects: string[];
  schoolIds: string[];
  classes: string[];
  status: 'active' | 'inactive';
  hireDate: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  subject: string;
  className: string;
  content: string;
  objectives: string;
  resources: string;
  professorId: string;
  schoolId: string;
}

export interface Route {
  id: string;
  name: string;
  vehicle: string;
  driver: string;
  capacity: number;
  passengersCount: number;
  status: 'active' | 'maintenance' | 'inactive';
  stops: string[];
}

export interface Passenger {
  id: string;
  studentId: string;
  studentName: string;
  routeId: string;
  boardingStop: string;
  dropoffStop: string;
  status: 'active' | 'inactive';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  type: 'holiday' | 'event' | 'meeting' | 'deadline' | 'school_day';
  schoolId?: string;
  description?: string;
  isRecurring?: boolean;
}

export interface LessonPlan {
  id: string;
  professorId: string;
  subject: string;
  className: string;
  bimester: number;
  week: number;
  theme: string;
  objectives: string[];
  content: string;
  methodology: string;
  resources: string[];
  evaluation: string;
  status: 'draft' | 'submitted' | 'approved' | 'revision';
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: any;
  newValue: any;
  ipAddress: string;
  details: string;
}

export interface Assessment {
  id: string;
  name: string;
  subject: string;
  className: string;
  bimester: number;
  schoolId: string;
  professorId: string;
  date: string;
  totalQuestions: number;
  answerKey: string[];
  status: 'draft' | 'active' | 'graded';
}

export interface StudentAnswer {
  studentId: string;
  assessmentId: string;
  answers: string[];
  score?: number;
  gradedAt?: string;
}
