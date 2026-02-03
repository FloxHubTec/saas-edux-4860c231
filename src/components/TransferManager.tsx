import React, { useState } from 'react';
import { User, Student } from '../types';
import { MOCK_SCHOOLS } from '../constants';
import { auditService } from '../services/auditService';
import StudentDetailsModal from './StudentDetailsModal';
import { Users, Clock, ArrowLeftRight, Building2, Search, Eye, RefreshCw } from 'lucide-react';

interface TransferManagerProps {
  currentUser: User;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const TransferManager: React.FC<TransferManagerProps> = ({ currentUser, students, setStudents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    studentId: '',
    targetSchoolId: '',
    reason: '',
    effectiveDate: new Date().toISOString().split('T')[0],
  });
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    s.status === 'active'
  );

  const handleStartTransfer = (student: Student) => {
    setSelectedStudent(student);
    setTransferData({
      ...transferData,
      studentId: student.id,
      targetSchoolId: '',
    });
    setShowTransferModal(true);
  };

  const handleConfirmTransfer = () => {
    if (!selectedStudent || !transferData.targetSchoolId || !transferData.reason) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const sourceSchool = MOCK_SCHOOLS.find(s => s.id === selectedStudent.schoolId);
    const targetSchool = MOCK_SCHOOLS.find(s => s.id === transferData.targetSchoolId);

    setStudents(prev => prev.map(s =>
      s.id === selectedStudent.id
        ? { ...s, schoolId: transferData.targetSchoolId, status: 'active' as const }
        : s
    ));

    auditService.log(
      currentUser,
      'Transferência de Aluno',
      'Student',
      selectedStudent.id,
      { schoolId: selectedStudent.schoolId, schoolName: sourceSchool?.name },
      { schoolId: transferData.targetSchoolId, schoolName: targetSchool?.name },
      `Aluno ${selectedStudent.name} transferido de ${sourceSchool?.name} para ${targetSchool?.name}. Motivo: ${transferData.reason}`
    );

    alert(`Transferência realizada com sucesso!\n\nAluno: ${selectedStudent.name}\nOrigem: ${sourceSchool?.name}\nDestino: ${targetSchool?.name}`);
    setShowTransferModal(false);
    setSelectedStudent(null);
    setTransferData({ studentId: '', targetSchoolId: '', reason: '', effectiveDate: new Date().toISOString().split('T')[0] });
  };

  const stats = [
    { label: 'Alunos Ativos', value: students.filter(s => s.status === 'active').length, icon: <Users size={20} className="text-white" />, color: 'bg-brand-success' },
    { label: 'Transferências Pendentes', value: '0', icon: <Clock size={20} className="text-white" />, color: 'bg-brand-warning' },
    { label: 'Transferidos', value: students.filter(s => s.status === 'transferred').length, icon: <ArrowLeftRight size={20} className="text-white" />, color: 'bg-brand-info' },
    { label: 'Escolas', value: MOCK_SCHOOLS.length, icon: <Building2 size={20} className="text-white" />, color: 'bg-brand-dark' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Gestão de Transferências</h1>
          <p className="text-brand-muted mt-1">Realize transferências entre escolas da rede</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-brand-dark">{stat.value}</p>
                <p className="text-brand-muted text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Buscar aluno por nome para transferência..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-4 border-2 border-gray-100 rounded-2xl text-brand-dark font-medium focus:outline-none focus:border-brand-primary transition-all"
          />
        </div>
      </div>

      {/* Lista de Alunos */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-dark text-white text-xs uppercase tracking-widest">
                <th className="px-6 py-4 text-left">Aluno</th>
                <th className="px-6 py-4 text-left">Turma</th>
                <th className="px-6 py-4 text-left">Escola Atual</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => {
                const school = MOCK_SCHOOLS.find(s => s.id === student.schoolId);
                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-brand-dark">{student.name}</p>
                          <p className="text-brand-muted text-xs">{new Date(student.birthDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-brand-info/10 text-brand-info rounded-full text-xs font-bold">
                        {student.currentGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-brand-dark">{school?.name}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-brand-success/10 text-brand-success rounded-full text-[10px] font-black uppercase tracking-widest">
                        Ativo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setViewingStudent(student)}
                          className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-brand-muted rounded-lg text-xs font-bold hover:bg-gray-200 transition-all"
                        >
                          <Eye size={14} />
                          Ver
                        </button>
                        <button
                          onClick={() => handleStartTransfer(student)}
                          className="flex items-center gap-1 px-3 py-2 bg-brand-warning text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all"
                        >
                          <RefreshCw size={14} />
                          Transferir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-brand-muted mb-4" />
            <p className="text-brand-muted text-lg">Nenhum aluno encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de Transferência */}
      {showTransferModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTransferModal(false)}>
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-brand-dark mb-2">Transferir Aluno</h2>
            <p className="text-brand-muted mb-6">Selecione a escola de destino para {selectedStudent.name}</p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-1">Escola de Origem</p>
                <p className="font-bold text-brand-dark">
                  {MOCK_SCHOOLS.find(s => s.id === selectedStudent.schoolId)?.name}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
                  Escola de Destino *
                </label>
                <select
                  value={transferData.targetSchoolId}
                  onChange={(e) => setTransferData({ ...transferData, targetSchoolId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                >
                  <option value="">Selecione a escola...</option>
                  {MOCK_SCHOOLS.filter(s => s.id !== selectedStudent.schoolId).map((school) => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
                  Motivo da Transferência *
                </label>
                <textarea
                  value={transferData.reason}
                  onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all resize-none"
                  placeholder="Descreva o motivo da transferência..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
                  Data Efetiva
                </label>
                <input
                  type="date"
                  value={transferData.effectiveDate}
                  onChange={(e) => setTransferData({ ...transferData, effectiveDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-brand-muted rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmTransfer}
                className="flex-1 px-6 py-3 bg-brand-warning text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all"
              >
                Confirmar Transferência
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {viewingStudent && (
        <StudentDetailsModal student={viewingStudent} onClose={() => setViewingStudent(null)} />
      )}
    </div>
  );
};

export default TransferManager;