import { AuditLog, User, UserRole } from '../types';

// Função para obter IP do cliente (simulado em dev, real em prod)
const getClientIP = (): string => {
  // Em produção, isso seria obtido do backend
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

class AuditService {
  private logs: AuditLog[] = [];

  log(
    user: User,
    action: string,
    entityType: string,
    entityId: string,
    oldValue: any,
    newValue: any,
    details: string = '',
    justification?: string
  ): void {
    // Validar justificativa obrigatória para alterações sensíveis
    const sensitiveTypes = ['StudentGrade', 'StudentAcademicRecord', 'ProfessorData', 'UserData'];
    const requiresJustification = sensitiveTypes.includes(entityType) && 
      (action.includes('Alteração') || action.includes('Exclusão') || action.includes('Edição'));
    
    if (requiresJustification && !justification && user.role === UserRole.PROFESSOR) {
      console.warn('[AUDIT] Justificativa recomendada para esta ação');
    }

    const logEntry: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      ipAddress: getClientIP(),
      details,
      justification,
      schoolId: user.schoolId
    };

    this.logs.unshift(logEntry);
    
    // Manter apenas os últimos 1000 registros em memória
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }

    // Log no console para desenvolvimento
    console.log('[AUDIT]', logEntry);
  }

  // Método específico para log de alteração de notas (requer justificativa)
  logGradeChange(
    user: User,
    studentId: string,
    subject: string,
    bimester: number,
    oldGrade: number | null,
    newGrade: number,
    justification: string
  ): void {
    this.log(
      user,
      'Alteração de Nota',
      'StudentGrade',
      `${studentId}-${subject}-bim${bimester}`,
      oldGrade,
      newGrade,
      `Nota alterada de ${oldGrade ?? 'N/A'} para ${newGrade} em ${subject}, ${bimester}º Bimestre`,
      justification
    );
  }

  getLogs(filters?: {
    userId?: string;
    entityType?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    schoolId?: string;
  }): AuditLog[] {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      if (filters.entityType) {
        filteredLogs = filteredLogs.filter(log => log.entityType === filters.entityType);
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action.toLowerCase().includes(filters.action!.toLowerCase()));
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
      }
      if (filters.schoolId) {
        filteredLogs = filteredLogs.filter(log => log.schoolId === filters.schoolId);
      }
    }

    return filteredLogs;
  }

  getLogById(id: string): AuditLog | undefined {
    return this.logs.find(log => log.id === id);
  }

  exportToCSV(): string {
    const headers = ['ID', 'Data/Hora', 'Usuário', 'Função', 'Ação', 'Tipo Entidade', 'ID Entidade', 'Detalhes', 'Justificativa', 'IP', 'Unidade'];
    const rows = this.logs.map(log => [
      log.id,
      new Date(log.timestamp).toLocaleString('pt-BR'),
      log.userName,
      log.userRole,
      log.action,
      log.entityType,
      log.entityId,
      log.details,
      log.justification || '',
      log.ipAddress,
      log.schoolId || 'Global'
    ]);

    return [headers, ...rows].map(row => row.join(';')).join('\n');
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const auditService = new AuditService();
