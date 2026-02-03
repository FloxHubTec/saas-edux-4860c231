import React, { useState } from 'react';
import { User, UserRole, EnrollmentApplication, EnrollmentStatus } from '../types';
import { MOCK_ENROLLMENTS, MOCK_SCHOOLS } from '../constants';
import { Search, Plus, FileText, Clock, CheckCircle, XCircle, Users } from 'lucide-react';

interface EnrollmentManagerProps {
  currentUser: User;
  onViewDetails: (application: EnrollmentApplication) => void;
  selectedSchoolId: string;
}

const EnrollmentManager: React.FC<EnrollmentManagerProps> = ({ currentUser, onViewDetails, selectedSchoolId }) => {
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = MOCK_ENROLLMENTS.filter(app => {
    const matchesSchool = selectedSchoolId === 'all' || app.schoolId === selectedSchoolId;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.responsibleName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSchool && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: EnrollmentStatus) => {
    const styles = {
      [EnrollmentStatus.PENDING]: 'bg-brand-warning/10 text-brand-warning',
      [EnrollmentStatus.ANALYSIS]: 'bg-brand-info/10 text-brand-info',
      [EnrollmentStatus.APPROVED]: 'bg-brand-success/10 text-brand-success',
      [EnrollmentStatus.REJECTED]: 'bg-brand-danger/10 text-brand-danger',
      [EnrollmentStatus.WAITING_LIST]: 'bg-gray-100 text-gray-600',
    };
    const labels = {
      [EnrollmentStatus.PENDING]: 'Pendente',
      [EnrollmentStatus.ANALYSIS]: 'Em Análise',
      [EnrollmentStatus.APPROVED]: 'Aprovada',
      [EnrollmentStatus.REJECTED]: 'Rejeitada',
      [EnrollmentStatus.WAITING_LIST]: 'Lista de Espera',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const stats = [
    { label: 'Total', value: MOCK_ENROLLMENTS.length, color: 'bg-brand-dark', icon: <FileText size={20} className="text-white" /> },
    { label: 'Pendentes', value: MOCK_ENROLLMENTS.filter(e => e.status === EnrollmentStatus.PENDING).length, color: 'bg-brand-warning', icon: <Clock size={20} className="text-white" /> },
    { label: 'Em Análise', value: MOCK_ENROLLMENTS.filter(e => e.status === EnrollmentStatus.ANALYSIS).length, color: 'bg-brand-info', icon: <Search size={20} className="text-white" /> },
    { label: 'Aprovadas', value: MOCK_ENROLLMENTS.filter(e => e.status === EnrollmentStatus.APPROVED).length, color: 'bg-brand-success', icon: <CheckCircle size={20} className="text-white" /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Gestão de Matrículas</h1>
          <p className="text-brand-muted mt-1">Gerencie solicitações de matrícula da rede</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark rounded-2xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">
          <Plus size={18} />
          Nova Matrícula
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-black text-brand-dark">{stat.value}</p>
            <p className="text-brand-muted text-xs font-bold uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Buscar por nome do aluno ou responsável..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-4 border-2 border-gray-100 rounded-2xl text-brand-dark font-medium focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['ALL', ...Object.values(EnrollmentStatus)] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  statusFilter === status
                    ? 'bg-brand-primary text-brand-dark'
                    : 'bg-gray-50 text-brand-muted hover:bg-gray-100'
                }`}
              >
                {status === 'ALL' ? 'Todos' : 
                 status === EnrollmentStatus.PENDING ? 'Pendente' :
                 status === EnrollmentStatus.ANALYSIS ? 'Análise' :
                 status === EnrollmentStatus.APPROVED ? 'Aprovada' :
                 status === EnrollmentStatus.REJECTED ? 'Rejeitada' : 'Espera'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Matrículas */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-dark text-white text-xs uppercase tracking-widest">
                <th className="px-6 py-4 text-left">Aluno</th>
                <th className="px-6 py-4 text-left">Série</th>
                <th className="px-6 py-4 text-left">Escola</th>
                <th className="px-6 py-4 text-left">Responsável</th>
                <th className="px-6 py-4 text-left">Data</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((app) => {
                const school = MOCK_SCHOOLS.find(s => s.id === app.schoolId);
                return (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-dark">{app.studentName}</p>
                      <p className="text-brand-muted text-xs">{new Date(app.birthDate).toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-brand-info/10 text-brand-info rounded-full text-xs font-bold">
                        {app.requestedGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-brand-dark">{school?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-brand-dark">{app.responsibleName}</p>
                      <p className="text-brand-muted text-xs">{app.responsiblePhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-brand-dark">
                        {new Date(app.submittedAt).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-brand-muted text-xs">
                        {new Date(app.submittedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onViewDetails(app)}
                        className="px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-brand-muted mb-4" />
            <p className="text-brand-muted text-lg">Nenhuma solicitação encontrada</p>
            <p className="text-brand-muted text-sm mt-1">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentManager;