import React, { useState } from 'react';
import { auditService } from '../services/auditService';
import { AuditLog, UserRoleLabels } from '../types';
import { Download, Shield, Scale, ClipboardList, Building2, MessageSquare, AlertTriangle } from 'lucide-react';
import { MOCK_SCHOOLS } from '../constants';

const AuditReport: React.FC = () => {
  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
    startDate: '',
    endDate: '',
    schoolId: '',
  });
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const logs = auditService.getLogs({
    entityType: filters.entityType || undefined,
    action: filters.action || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    schoolId: filters.schoolId || undefined,
  });

  const handleExportCSV = () => {
    const csv = auditService.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    alert('Relatório exportado com sucesso!');
  };

  const entityTypes = [...new Set(logs.map(l => l.entityType))];
  const actionTypes = [...new Set(logs.map(l => l.action))];
  const logsWithJustification = logs.filter(l => l.justification).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Relatório de Auditoria</h1>
          <p className="text-brand-muted mt-1">Conformidade com a Lei 14.133/2021 - Trilha de Auditoria</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-brand-success text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
        >
          <Download size={18} />
          Exportar CSV
        </button>
      </div>

      {/* Informações de Conformidade */}
      <div className="bg-gradient-to-r from-brand-dark to-brand-dark/80 rounded-[2rem] p-8 text-white">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center flex-shrink-0">
            <Shield size={32} className="text-brand-dark" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black">Sistema em Conformidade</h2>
            <p className="text-gray-300 mt-2">
              Todas as operações críticas são registradas automaticamente em conformidade com a Lei 14.133/2021. 
              Alterações de notas e dados de RH requerem justificativa obrigatória.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/10 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-400">Registros</p>
                <p className="text-xl font-black">{logs.length}</p>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-400">Entidades</p>
                <p className="text-xl font-black">{entityTypes.length}</p>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-400">Tipos de Ação</p>
                <p className="text-xl font-black">{actionTypes.length}</p>
              </div>
              <div className="bg-brand-warning/20 px-4 py-2 rounded-xl">
                <p className="text-xs text-brand-warning">Com Justificativa</p>
                <p className="text-xl font-black">{logsWithJustification}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Unidade Escolar</label>
            <select
              value={filters.schoolId}
              onChange={(e) => setFilters({ ...filters, schoolId: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark focus:outline-none focus:border-brand-primary transition-all"
            >
              <option value="">Todas</option>
              {MOCK_SCHOOLS.map((school) => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Tipo de Entidade</label>
            <select
              value={filters.entityType}
              onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark focus:outline-none focus:border-brand-primary transition-all"
            >
              <option value="">Todos</option>
              {entityTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Ação</label>
            <input
              type="text"
              placeholder="Buscar ação..."
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Data Início</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Data Fim</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-dark text-white text-xs uppercase tracking-widest">
                <th className="px-6 py-4 text-left">Data/Hora</th>
                <th className="px-6 py-4 text-left">Usuário</th>
                <th className="px-6 py-4 text-left">Ação</th>
                <th className="px-6 py-4 text-left">Entidade</th>
                <th className="px-6 py-4 text-left">Detalhes</th>
                <th className="px-6 py-4 text-left">Unidade</th>
                <th className="px-6 py-4 text-left">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-brand-muted">
                    <ClipboardList size={48} className="mx-auto mb-4" />
                    <p>Nenhum registro de auditoria encontrado</p>
                    <p className="text-sm mt-1">Os registros aparecerão conforme ações forem realizadas no sistema</p>
                  </td>
                </tr>
              ) : (
                logs.slice(0, 50).map((log) => {
                  const school = MOCK_SCHOOLS.find(s => s.id === log.schoolId);
                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedLog === log.id ? 'bg-brand-light' : ''}`}
                        onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-brand-dark text-sm">
                            {new Date(log.timestamp).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-brand-muted text-xs">
                            {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-brand-dark text-sm">{log.userName}</p>
                          <p className="text-brand-muted text-xs">{UserRoleLabels[log.userRole] || log.userRole}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-brand-info/10 text-brand-info rounded-full text-xs font-bold">
                              {log.action}
                            </span>
                            {log.justification && (
                              <span title="Possui justificativa">
                                <MessageSquare size={14} className="text-brand-warning" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-brand-dark">{log.entityType}</p>
                          <p className="text-brand-muted text-xs truncate max-w-[120px]">{log.entityId}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-brand-dark max-w-xs truncate" title={log.details}>
                            {log.details || '-'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {school ? (
                            <span className="flex items-center gap-1 text-xs text-brand-dark">
                              <Building2 size={12} className="text-brand-primary" />
                              <span className="truncate max-w-[100px]">{school.name}</span>
                            </span>
                          ) : (
                            <span className="text-brand-muted text-xs">Global</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-brand-muted text-sm font-mono">{log.ipAddress}</span>
                        </td>
                      </tr>
                      {/* Linha expandida com justificativa */}
                      {expandedLog === log.id && log.justification && (
                        <tr className="bg-brand-warning/5">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle size={18} className="text-brand-warning flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-brand-warning uppercase tracking-widest mb-1">
                                  Justificativa do Professor
                                </p>
                                <p className="text-sm text-brand-dark">{log.justification}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aviso Legal */}
      <div className="bg-brand-warning/5 rounded-[2rem] p-8 border border-brand-warning/20">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-brand-warning/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Scale size={24} className="text-brand-warning" />
          </div>
          <div>
            <h3 className="font-black text-brand-dark">Aviso Legal - Lei 14.133/2021</h3>
            <p className="text-brand-muted mt-2 text-sm">
              Este módulo de auditoria foi desenvolvido em conformidade com a Lei 14.133/2021. 
              Todos os registros são imutáveis e armazenados com timestamp, identificação do usuário, 
              IP de origem e justificativa quando aplicável, garantindo rastreabilidade completa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReport;