import React, { useState } from 'react';
import { auditService } from '../services/auditService';
import { AuditLog } from '../types';
import { Download, Shield, FileText, Scale, ClipboardList } from 'lucide-react';

const AuditReport: React.FC = () => {
  const [filters, setFilters] = useState({
    entityType: '',
    action: '',
    startDate: '',
    endDate: '',
  });

  const logs = auditService.getLogs(filters.entityType || filters.action ? {
    entityType: filters.entityType || undefined,
    action: filters.action || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
  } : undefined);

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
          <div>
            <h2 className="text-2xl font-black">Sistema em Conformidade</h2>
            <p className="text-gray-300 mt-2">
              Todas as operações críticas são registradas automaticamente em conformidade com a Lei 14.133/2021 
              (Nova Lei de Licitações e Contratos). O sistema mantém trilha de auditoria completa para transparência 
              e controle de gastos públicos.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/10 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-400">Registros</p>
                <p className="text-xl font-black">{logs.length}</p>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-400">Entidades Monitoradas</p>
                <p className="text-xl font-black">{entityTypes.length}</p>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-xl">
                <p className="text-xs text-gray-400">Tipos de Ação</p>
                <p className="text-xl font-black">{actionTypes.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <th className="px-6 py-4 text-left">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-brand-muted">
                    <ClipboardList size={48} className="mx-auto mb-4" />
                    <p>Nenhum registro de auditoria encontrado</p>
                    <p className="text-sm mt-1">Os registros aparecerão conforme ações forem realizadas no sistema</p>
                  </td>
                </tr>
              ) : (
                logs.slice(0, 50).map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
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
                      <p className="text-brand-muted text-xs">{log.userRole}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-brand-info/10 text-brand-info rounded-full text-xs font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-brand-dark">{log.entityType}</p>
                      <p className="text-brand-muted text-xs">{log.entityId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-brand-dark max-w-xs truncate" title={log.details}>
                        {log.details || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-brand-muted text-sm font-mono">{log.ipAddress}</span>
                    </td>
                  </tr>
                ))
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
              Este módulo de auditoria foi desenvolvido em conformidade com os requisitos da Lei 14.133/2021 
              (Nova Lei de Licitações e Contratos Administrativos). Todos os registros são imutáveis e 
              armazenados com timestamp, identificação do usuário e IP de origem, garantindo a rastreabilidade 
              completa das operações realizadas no sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReport;