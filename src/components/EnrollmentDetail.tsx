import React, { useState } from 'react';
import { User, EnrollmentApplication, EnrollmentStatus } from '../types';
import { MOCK_SCHOOLS } from '../constants';
import { auditService } from '../services/auditService';

interface EnrollmentDetailProps {
  application: EnrollmentApplication;
  currentUser: User;
  onClose: () => void;
  onUpdateStatus: (id: string, status: EnrollmentStatus) => void;
}

const EnrollmentDetail: React.FC<EnrollmentDetailProps> = ({ application, currentUser, onClose, onUpdateStatus }) => {
  const [notes, setNotes] = useState(application.notes || '');
  const school = MOCK_SCHOOLS.find(s => s.id === application.schoolId);

  const handleStatusChange = (newStatus: EnrollmentStatus) => {
    auditService.log(
      currentUser,
      `Alteração de Status de Matrícula`,
      'EnrollmentApplication',
      application.id,
      application.status,
      newStatus,
      `Status alterado de ${application.status} para ${newStatus}. Aluno: ${application.studentName}`
    );
    onUpdateStatus(application.id, newStatus);
  };

  const getStatusBadge = (status: EnrollmentStatus) => {
    const styles = {
      [EnrollmentStatus.PENDING]: 'bg-brand-warning/10 text-brand-warning border-brand-warning',
      [EnrollmentStatus.ANALYSIS]: 'bg-brand-info/10 text-brand-info border-brand-info',
      [EnrollmentStatus.APPROVED]: 'bg-brand-success/10 text-brand-success border-brand-success',
      [EnrollmentStatus.REJECTED]: 'bg-brand-danger/10 text-brand-danger border-brand-danger',
      [EnrollmentStatus.WAITING_LIST]: 'bg-gray-100 text-gray-600 border-gray-300',
    };
    const labels = {
      [EnrollmentStatus.PENDING]: 'Pendente',
      [EnrollmentStatus.ANALYSIS]: 'Em Análise',
      [EnrollmentStatus.APPROVED]: 'Aprovada',
      [EnrollmentStatus.REJECTED]: 'Rejeitada',
      [EnrollmentStatus.WAITING_LIST]: 'Lista de Espera',
    };
    return (
      <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <button 
            onClick={onClose}
            className="text-brand-gray hover:text-brand-dark font-bold text-sm mb-4 flex items-center gap-2"
          >
            ← Voltar para lista
          </button>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Detalhes da Matrícula</h1>
          <p className="text-brand-gray mt-1">Solicitação #{application.id}</p>
        </div>
        {getStatusBadge(application.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-brand-info/10 rounded-xl flex items-center justify-center text-brand-info">👨‍🎓</span>
              Dados do Aluno
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest mb-1">Nome Completo</p>
                <p className="text-brand-dark font-bold text-lg">{application.studentName}</p>
              </div>
              <div>
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest mb-1">Data de Nascimento</p>
                <p className="text-brand-dark font-bold">{new Date(application.birthDate).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest mb-1">Série Solicitada</p>
                <span className="px-4 py-2 bg-brand-info/10 text-brand-info rounded-full text-sm font-bold">
                  {application.requestedGrade}
                </span>
              </div>
              <div>
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest mb-1">Escola</p>
                <p className="text-brand-dark font-bold">{school?.name}</p>
              </div>
            </div>
          </div>

          {/* Responsible Info */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-brand-warning/10 rounded-xl flex items-center justify-center text-brand-warning">👤</span>
              Dados do Responsável
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest mb-1">Nome</p>
                <p className="text-brand-dark font-bold">{application.responsibleName}</p>
              </div>
              <div>
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest mb-1">CPF</p>
                <p className="text-brand-dark font-bold">{application.responsibleCpf}</p>
              </div>
              <div>
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest mb-1">Telefone</p>
                <p className="text-brand-dark font-bold">{application.responsiblePhone}</p>
              </div>
              <div>
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest mb-1">Email</p>
                <p className="text-brand-dark font-bold">{application.responsibleEmail}</p>
              </div>
              <div className="col-span-2">
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest mb-1">Endereço</p>
                <p className="text-brand-dark font-bold">{application.address}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-brand-success/10 rounded-xl flex items-center justify-center text-brand-success">📄</span>
              Documentos
            </h2>
            <div className="space-y-3">
              {application.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📎</span>
                    <span className="font-bold text-brand-dark">{doc.name}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    doc.status === 'approved' ? 'bg-brand-success/10 text-brand-success' :
                    doc.status === 'rejected' ? 'bg-brand-danger/10 text-brand-danger' :
                    'bg-brand-warning/10 text-brand-warning'
                  }`}>
                    {doc.status === 'approved' ? 'Aprovado' : 
                     doc.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-brand-dark mb-6">Ações</h2>
            <div className="space-y-3">
              {application.status !== EnrollmentStatus.APPROVED && (
                <button
                  onClick={() => handleStatusChange(EnrollmentStatus.APPROVED)}
                  className="w-full px-6 py-4 bg-brand-success text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-green-600 transition-all"
                >
                  ✓ Aprovar Matrícula
                </button>
              )}
              {application.status === EnrollmentStatus.PENDING && (
                <button
                  onClick={() => handleStatusChange(EnrollmentStatus.ANALYSIS)}
                  className="w-full px-6 py-4 bg-brand-info text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all"
                >
                  📋 Iniciar Análise
                </button>
              )}
              {application.status !== EnrollmentStatus.REJECTED && (
                <button
                  onClick={() => handleStatusChange(EnrollmentStatus.REJECTED)}
                  className="w-full px-6 py-4 bg-brand-danger text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-red-600 transition-all"
                >
                  ✕ Rejeitar Matrícula
                </button>
              )}
              {application.status !== EnrollmentStatus.WAITING_LIST && (
                <button
                  onClick={() => handleStatusChange(EnrollmentStatus.WAITING_LIST)}
                  className="w-full px-6 py-4 bg-gray-500 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-gray-600 transition-all"
                >
                  📝 Lista de Espera
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-brand-dark mb-6">Observações</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark focus:outline-none focus:border-brand-yellow transition-all resize-none"
              placeholder="Adicione observações sobre esta solicitação..."
            />
            <button className="w-full mt-3 px-4 py-3 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
              Salvar Observações
            </button>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-brand-dark mb-6">Histórico</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-3 h-3 bg-brand-success rounded-full mt-1.5" />
                <div>
                  <p className="font-bold text-brand-dark text-sm">Solicitação criada</p>
                  <p className="text-brand-gray text-xs">
                    {new Date(application.submittedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDetail;
