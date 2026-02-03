import { AuditLog, User, UserRole } from '../types';

class AuditService {
  private logs: AuditLog[] = [];

  log(
    user: User,
    action: string,
    entityType: string,
    entityId: string,
    oldValue: any,
    newValue: any,
    details: string = ''
  ): void {
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
      ipAddress: '192.168.1.1', // Em produção, capturar IP real
      details
    };

    this.logs.unshift(logEntry);
    
    // Manter apenas os últimos 1000 registros em memória
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }

    // Log no console para desenvolvimento
    console.log('[AUDIT]', logEntry);
  }

  getLogs(filters?: {
    userId?: string;
    entityType?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
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
    }

    return filteredLogs;
  }

  getLogById(id: string): AuditLog | undefined {
    return this.logs.find(log => log.id === id);
  }

  exportToCSV(): string {
    const headers = ['ID', 'Data/Hora', 'Usuário', 'Função', 'Ação', 'Tipo Entidade', 'ID Entidade', 'Detalhes', 'IP'];
    const rows = this.logs.map(log => [
      log.id,
      new Date(log.timestamp).toLocaleString('pt-BR'),
      log.userName,
      log.userRole,
      log.action,
      log.entityType,
      log.entityId,
      log.details,
      log.ipAddress
    ]);

    return [headers, ...rows].map(row => row.join(';')).join('\n');
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const auditService = new AuditService();
