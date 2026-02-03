import React, { useState } from 'react';
import { User, Professor } from '../types';
import { MOCK_PROFESSORS, MOCK_SCHOOLS, SUBJECTS_LIST } from '../constants';
import { auditService } from '../services/auditService';

interface ProfessorManagerProps {
  currentUser: User;
}

const ProfessorManager: React.FC<ProfessorManagerProps> = ({ currentUser }) => {
  const [professors, setProfessors] = useState<Professor[]>(MOCK_PROFESSORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    subjects: [] as string[],
    schoolIds: [] as string[],
    classes: '',
  });

  const filteredProfessors = professors.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prof.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (professor?: Professor) => {
    if (professor) {
      setEditingProfessor(professor);
      setFormData({
        name: professor.name,
        email: professor.email,
        cpf: professor.cpf,
        subjects: professor.subjects,
        schoolIds: professor.schoolIds,
        classes: professor.classes.join(', '),
      });
    } else {
      setEditingProfessor(null);
      setFormData({ name: '', email: '', cpf: '', subjects: [], schoolIds: [], classes: '' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.cpf) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const professorData: Professor = {
      id: editingProfessor?.id || `prof-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf,
      subjects: formData.subjects,
      schoolIds: formData.schoolIds,
      classes: formData.classes.split(',').map(c => c.trim()).filter(c => c),
      status: 'active',
      hireDate: editingProfessor?.hireDate || new Date().toISOString().split('T')[0],
    };

    if (editingProfessor) {
      setProfessors(prev => prev.map(p => p.id === editingProfessor.id ? professorData : p));
      auditService.log(currentUser, 'Atualização de Professor', 'Professor', professorData.id, editingProfessor, professorData, `Professor ${professorData.name} atualizado`);
    } else {
      setProfessors(prev => [...prev, professorData]);
      auditService.log(currentUser, 'Cadastro de Professor', 'Professor', professorData.id, null, professorData, `Professor ${professorData.name} cadastrado`);
    }

    setShowModal(false);
    alert('Professor salvo com sucesso!');
  };

  const handleToggleStatus = (professor: Professor) => {
    const newStatus = professor.status === 'active' ? 'inactive' : 'active';
    setProfessors(prev => prev.map(p => 
      p.id === professor.id ? { ...p, status: newStatus } : p
    ));
    auditService.log(currentUser, 'Alteração de Status de Professor', 'Professor', professor.id, professor.status, newStatus, `Status de ${professor.name} alterado para ${newStatus}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Gestão de Professores</h1>
          <p className="text-brand-gray mt-1">Cadastre e gerencie o corpo docente</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-brand-yellow text-brand-dark rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-brand-yellow/20"
        >
          ➕ Novo Professor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: professors.length, color: 'bg-brand-dark' },
          { label: 'Ativos', value: professors.filter(p => p.status === 'active').length, color: 'bg-brand-success' },
          { label: 'Inativos', value: professors.filter(p => p.status === 'inactive').length, color: 'bg-brand-danger' },
          { label: 'Disciplinas', value: [...new Set(professors.flatMap(p => p.subjects))].length, color: 'bg-brand-info' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white font-bold text-lg mb-3`}>
              {stat.value}
            </div>
            <p className="text-brand-gray text-xs font-bold uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-brand-dark font-medium focus:outline-none focus:border-brand-yellow transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  statusFilter === status
                    ? 'bg-brand-yellow text-brand-dark'
                    : 'bg-gray-50 text-brand-gray hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'Todos' : status === 'active' ? 'Ativos' : 'Inativos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Professors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessors.map((professor) => (
          <div key={professor.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 bg-brand-info/10 rounded-2xl flex items-center justify-center text-2xl">
                👨‍🏫
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                professor.status === 'active' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-danger/10 text-brand-danger'
              }`}>
                {professor.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            
            <h3 className="font-black text-brand-dark text-lg">{professor.name}</h3>
            <p className="text-brand-gray text-sm mt-1">{professor.email}</p>
            
            <div className="mt-4">
              <p className="text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Disciplinas</p>
              <div className="flex flex-wrap gap-1">
                {professor.subjects.map((subject, i) => (
                  <span key={i} className="px-2 py-1 bg-brand-info/10 text-brand-info rounded text-xs font-bold">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Escolas</p>
              <div className="flex flex-wrap gap-1">
                {professor.schoolIds.map((schoolId, i) => {
                  const school = MOCK_SCHOOLS.find(s => s.id === schoolId);
                  return (
                    <span key={i} className="px-2 py-1 bg-brand-warning/10 text-brand-warning rounded text-xs font-bold">
                      {school?.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => handleOpenModal(professor)}
                className="flex-1 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => handleToggleStatus(professor)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  professor.status === 'active'
                    ? 'bg-brand-danger/10 text-brand-danger hover:bg-brand-danger/20'
                    : 'bg-brand-success/10 text-brand-success hover:bg-brand-success/20'
                }`}
              >
                {professor.status === 'active' ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-brand-dark mb-6">
              {editingProfessor ? 'Editar Professor' : 'Novo Professor'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-yellow transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-yellow transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">CPF *</label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-yellow transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Disciplinas</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS_LIST.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          subjects: prev.subjects.includes(subject)
                            ? prev.subjects.filter(s => s !== subject)
                            : [...prev.subjects, subject]
                        }));
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        formData.subjects.includes(subject)
                          ? 'bg-brand-info text-white'
                          : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Escolas</label>
                <div className="flex flex-wrap gap-2">
                  {MOCK_SCHOOLS.map((school) => (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          schoolIds: prev.schoolIds.includes(school.id)
                            ? prev.schoolIds.filter(s => s !== school.id)
                            : [...prev.schoolIds, school.id]
                        }));
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        formData.schoolIds.includes(school.id)
                          ? 'bg-brand-warning text-white'
                          : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
                      }`}
                    >
                      {school.name.split(' ').slice(0, 2).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Turmas (separadas por vírgula)</label>
                <input
                  type="text"
                  value={formData.classes}
                  onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-yellow transition-all"
                  placeholder="4º Ano A, 5º Ano B"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-brand-gray rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorManager;
