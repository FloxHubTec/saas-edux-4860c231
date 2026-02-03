import React, { useState } from 'react';
import { User, UserRole, DiaryEntry } from '../types';
import { MOCK_SCHOOLS, SUBJECTS_LIST } from '../constants';

interface ClassDiaryProps {
  currentUser: User;
  selectedSchoolId: string;
}

const MOCK_CLASSES = ['4º Ano A', '4º Ano B', '5º Ano A', '5º Ano B', '3º Ano A'];

const ClassDiary: React.FC<ClassDiaryProps> = ({ currentUser, selectedSchoolId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState(MOCK_CLASSES[0]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS_LIST[0]);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  
  const [newEntry, setNewEntry] = useState({
    content: '',
    objectives: '',
    resources: '',
  });

  const handleSaveEntry = () => {
    if (!newEntry.content) {
      alert('Por favor, preencha o conteúdo da aula.');
      return;
    }

    const entry: DiaryEntry = {
      id: `diary-${Date.now()}`,
      date: selectedDate,
      subject: selectedSubject,
      className: selectedClass,
      content: newEntry.content,
      objectives: newEntry.objectives,
      resources: newEntry.resources,
      professorId: currentUser.id,
      schoolId: selectedSchoolId,
    };

    setEntries([entry, ...entries]);
    setNewEntry({ content: '', objectives: '', resources: '' });
    alert('Registro salvo com sucesso!');
  };

  const todayEntries = entries.filter(e => e.date === selectedDate);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Diário de Classe</h1>
          <p className="text-brand-gray mt-1">Registre o conteúdo das aulas e frequência</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Data</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark font-medium focus:outline-none focus:border-brand-yellow transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Turma</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark font-medium focus:outline-none focus:border-brand-yellow transition-all"
            >
              {MOCK_CLASSES.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Disciplina</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark font-medium focus:outline-none focus:border-brand-yellow transition-all"
            >
              {SUBJECTS_LIST.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-6 py-3 bg-brand-info text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-blue-600 transition-all">
              📋 Chamada
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Entry Form */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">📝</span>
            Novo Registro
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">
                Conteúdo da Aula *
              </label>
              <textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark focus:outline-none focus:border-brand-yellow transition-all resize-none"
                placeholder="Descreva o conteúdo trabalhado na aula..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">
                Objetivos de Aprendizagem
              </label>
              <textarea
                value={newEntry.objectives}
                onChange={(e) => setNewEntry({ ...newEntry, objectives: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark focus:outline-none focus:border-brand-yellow transition-all resize-none"
                placeholder="Quais objetivos foram trabalhados?"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">
                Recursos Utilizados
              </label>
              <input
                type="text"
                value={newEntry.resources}
                onChange={(e) => setNewEntry({ ...newEntry, resources: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-brand-dark focus:outline-none focus:border-brand-yellow transition-all"
                placeholder="Livro didático, projetor, etc."
              />
            </div>

            <button
              onClick={handleSaveEntry}
              className="w-full px-6 py-4 bg-brand-dark text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-brand-dark/20"
            >
              💾 Salvar Registro
            </button>
          </div>
        </div>

        {/* Today's Entries */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
            <span className="w-10 h-10 bg-brand-success/10 rounded-xl flex items-center justify-center text-brand-success">📅</span>
            Registros do Dia
          </h2>

          {todayEntries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-6xl mb-4">📓</p>
              <p className="text-brand-gray text-lg">Nenhum registro para esta data</p>
              <p className="text-brand-gray text-sm mt-1">Crie um novo registro ao lado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayEntries.map((entry) => (
                <div key={entry.id} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="px-3 py-1 bg-brand-info/10 text-brand-info rounded-full text-xs font-bold">
                        {entry.subject}
                      </span>
                      <span className="px-3 py-1 bg-brand-warning/10 text-brand-warning rounded-full text-xs font-bold ml-2">
                        {entry.className}
                      </span>
                    </div>
                  </div>
                  <p className="text-brand-dark font-medium">{entry.content}</p>
                  {entry.objectives && (
                    <p className="text-brand-gray text-sm mt-2">
                      <strong>Objetivos:</strong> {entry.objectives}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Aulas Registradas', value: entries.length.toString(), icon: '📚' },
          { label: 'Turmas Atendidas', value: '5', icon: '👥' },
          { label: 'Frequência Média', value: '94%', icon: '✅' },
          { label: 'Dias Letivos', value: '120', icon: '📅' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-black text-brand-dark">{stat.value}</p>
                <p className="text-brand-gray text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassDiary;
