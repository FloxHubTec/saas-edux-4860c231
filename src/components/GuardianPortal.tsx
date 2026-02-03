import React from 'react';
import { User, Student } from '../types';
import { MOCK_STUDENTS } from '../constants';
import { Users, GraduationCap, BookOpen, Bus, Bell, FileText, Calendar, TrendingUp } from 'lucide-react';

interface GuardianPortalProps {
  currentUser: User;
  students: Student[];
}

const GuardianPortal: React.FC<GuardianPortalProps> = ({ currentUser, students }) => {
  // Simula os alunos vinculados ao responsável
  const linkedStudents = students.slice(0, 2);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-4xl font-black text-brand-dark tracking-tight">Portal do Responsável</h1>
        <p className="text-brand-muted mt-1">Acompanhe o desempenho dos seus dependentes</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-info/20 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-brand-info" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-dark">{linkedStudents.length}</p>
              <p className="text-xs text-brand-muted uppercase tracking-widest">Dependentes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-success/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-brand-success" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-dark">8.5</p>
              <p className="text-xs text-brand-muted uppercase tracking-widest">Média Geral</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-warning/20 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-brand-warning" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-dark">95%</p>
              <p className="text-xs text-brand-muted uppercase tracking-widest">Frequência</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center">
              <Bell size={24} className="text-brand-primary" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-dark">3</p>
              <p className="text-xs text-brand-muted uppercase tracking-widest">Comunicados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Dependentes */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
          <GraduationCap size={24} />
          Meus Dependentes
        </h2>

        <div className="space-y-4">
          {linkedStudents.map((student) => (
            <div key={student.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-brand-primary rounded-xl flex items-center justify-center text-brand-dark font-black text-xl">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-brand-dark text-lg">{student.name}</h3>
                    <p className="text-brand-muted">{student.currentGrade}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-brand-info/10 text-brand-info rounded-xl font-medium hover:bg-brand-info/20 transition-colors">
                    <BookOpen size={16} />
                    Notas
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-brand-warning/10 text-brand-warning rounded-xl font-medium hover:bg-brand-warning/20 transition-colors">
                    <Calendar size={16} />
                    Frequência
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-brand-success/10 text-brand-success rounded-xl font-medium hover:bg-brand-success/20 transition-colors">
                    <Bus size={16} />
                    Transporte
                  </button>
                </div>
              </div>

              {/* Resumo de Notas */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(student.academicRecords).slice(0, 4).map(([subject, record]) => {
                  const grades = Object.values(record.grades).filter(g => g !== null) as number[];
                  const avg = grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : '-';
                  return (
                    <div key={subject} className="bg-white rounded-xl p-3">
                      <p className="text-xs text-brand-muted uppercase tracking-widest">{subject}</p>
                      <p className="text-xl font-black text-brand-dark">{avg}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comunicados */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-2">
          <Bell size={24} />
          Comunicados Recentes
        </h2>

        <div className="space-y-4">
          {[
            { title: 'Reunião de Pais', date: '15/02/2026', type: 'evento' },
            { title: 'Calendário de Provas - 1º Bimestre', date: '10/02/2026', type: 'aviso' },
            { title: 'Atualização do Transporte Escolar', date: '05/02/2026', type: 'info' },
          ].map((notice, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  notice.type === 'evento' ? 'bg-brand-info' :
                  notice.type === 'aviso' ? 'bg-brand-warning' : 'bg-brand-success'
                }`} />
                <div>
                  <p className="font-bold text-brand-dark">{notice.title}</p>
                  <p className="text-sm text-brand-muted">{notice.date}</p>
                </div>
              </div>
              <button className="text-brand-info hover:underline text-sm font-medium">
                Ver detalhes
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuardianPortal;