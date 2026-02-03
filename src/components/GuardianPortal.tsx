import React, { useState } from 'react';
import { User, Student } from '../types';
import { MOCK_STUDENTS, MOCK_ROUTES, MOCK_SCHOOLS, GRADES_OPTIONS } from '../constants';
import { 
  Users, GraduationCap, BookOpen, Bus, Bell, FileText, Calendar, TrendingUp, 
  MapPin, Clock, CheckCircle, AlertCircle, ChevronRight, Route, School, 
  ClipboardList, Send, User as UserIcon, Phone, Mail
} from 'lucide-react';

interface GuardianPortalProps {
  currentUser: User;
  students: Student[];
}

const GuardianPortal: React.FC<GuardianPortalProps> = ({ currentUser, students }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'grades' | 'attendance' | 'transport' | 'enrollment' | 'communications'>('overview');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Simula os alunos vinculados ao responsável
  const linkedStudents = students.slice(0, 2);
  const selectedStudentData = selectedStudent || linkedStudents[0];

  // Rotas de transporte vinculadas
  const studentRoutes = MOCK_ROUTES.filter(r => r.status === 'active').slice(0, 2);

  // Comunicados
  const communications = [
    { id: 1, title: 'Reunião de Pais - 1º Bimestre', date: '15/02/2026', type: 'evento', read: false },
    { id: 2, title: 'Calendário de Provas', date: '10/02/2026', type: 'aviso', read: true },
    { id: 3, title: 'Atualização do Transporte Escolar', date: '05/02/2026', type: 'info', read: false },
    { id: 4, title: 'Festa Junina - Confirmação de Presença', date: '01/02/2026', type: 'evento', read: true },
  ];

  const renderOverview = () => (
    <>
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
            <div className="w-12 h-12 bg-brand-danger/20 rounded-xl flex items-center justify-center">
              <Bell size={24} className="text-brand-danger" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-dark">{communications.filter(c => !c.read).length}</p>
              <p className="text-xs text-brand-muted uppercase tracking-widest">Não Lidos</p>
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
            <div 
              key={student.id} 
              className={`bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors cursor-pointer ${
                selectedStudent?.id === student.id ? 'ring-2 ring-brand-primary' : ''
              }`}
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-brand-primary rounded-xl flex items-center justify-center text-brand-dark font-black text-xl">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-brand-dark text-lg">{student.name}</h3>
                    <p className="text-brand-muted">{student.currentGrade}</p>
                    <p className="text-brand-muted text-sm">{MOCK_SCHOOLS.find(s => s.id === student.schoolId)?.name}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveSection('grades'); setSelectedStudent(student); }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-info/10 text-brand-info rounded-xl font-medium hover:bg-brand-info/20 transition-colors"
                  >
                    <BookOpen size={16} />
                    Notas
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveSection('attendance'); setSelectedStudent(student); }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-warning/10 text-brand-warning rounded-xl font-medium hover:bg-brand-warning/20 transition-colors"
                  >
                    <Calendar size={16} />
                    Frequência
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveSection('transport'); }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-success/10 text-brand-success rounded-xl font-medium hover:bg-brand-success/20 transition-colors"
                  >
                    <Bus size={16} />
                    Transporte
                  </button>
                </div>
              </div>

              {/* Resumo de Notas */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(student.academicRecords).slice(0, 5).map(([subject, record]) => {
                  const grades = Object.values(record.grades).filter(g => g !== null) as number[];
                  const avg = grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : '-';
                  const avgNum = parseFloat(avg);
                  return (
                    <div key={subject} className="bg-white rounded-xl p-3">
                      <p className="text-xs text-brand-muted uppercase tracking-widest truncate">{subject}</p>
                      <p className={`text-xl font-black ${
                        avgNum >= 7 ? 'text-brand-success' : 
                        avgNum >= 5 ? 'text-brand-warning' : 'text-brand-danger'
                      }`}>{avg}</p>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
            <Bell size={24} />
            Comunicados Recentes
          </h2>
          <button 
            onClick={() => setActiveSection('communications')}
            className="text-brand-info hover:underline text-sm font-medium flex items-center gap-1"
          >
            Ver todos <ChevronRight size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {communications.slice(0, 3).map((notice) => (
            <div key={notice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  notice.type === 'evento' ? 'bg-brand-info' :
                  notice.type === 'aviso' ? 'bg-brand-warning' : 'bg-brand-success'
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-brand-dark">{notice.title}</p>
                    {!notice.read && (
                      <span className="px-2 py-0.5 bg-brand-danger/10 text-brand-danger rounded text-[10px] font-bold">NOVO</span>
                    )}
                  </div>
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
    </>
  );

  const renderGrades = () => (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
          <BookOpen size={24} />
          Boletim Escolar - {selectedStudentData.name}
        </h2>
        <button 
          onClick={() => setActiveSection('overview')}
          className="px-4 py-2 bg-gray-100 text-brand-muted rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
        >
          Voltar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="text-left py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">Disciplina</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">1º Bim</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">2º Bim</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">3º Bim</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">4º Bim</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">Média</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">Situação</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(selectedStudentData.academicRecords).map(([subject, record]) => {
              const grades = Object.values(record.grades).filter(g => g !== null) as number[];
              const avg = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
              return (
                <tr key={subject} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-4 font-bold text-brand-dark">{subject}</td>
                  {[1, 2, 3, 4].map(bim => (
                    <td key={bim} className="text-center py-4 px-4">
                      <span className={`font-bold ${
                        record.grades[bim] === null ? 'text-brand-muted' :
                        (record.grades[bim] as number) >= 7 ? 'text-brand-success' :
                        (record.grades[bim] as number) >= 5 ? 'text-brand-warning' : 'text-brand-danger'
                      }`}>
                        {record.grades[bim] !== null ? record.grades[bim]?.toFixed(1) : '-'}
                      </span>
                    </td>
                  ))}
                  <td className="text-center py-4 px-4">
                    <span className={`text-lg font-black ${
                      avg >= 7 ? 'text-brand-success' :
                      avg >= 5 ? 'text-brand-warning' : 'text-brand-danger'
                    }`}>
                      {avg > 0 ? avg.toFixed(1) : '-'}
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    {avg >= 7 ? (
                      <span className="flex items-center justify-center gap-1 text-brand-success">
                        <CheckCircle size={16} /> Aprovado
                      </span>
                    ) : avg >= 5 ? (
                      <span className="flex items-center justify-center gap-1 text-brand-warning">
                        <AlertCircle size={16} /> Em recuperação
                      </span>
                    ) : avg > 0 ? (
                      <span className="flex items-center justify-center gap-1 text-brand-danger">
                        <AlertCircle size={16} /> Abaixo da média
                      </span>
                    ) : (
                      <span className="text-brand-muted">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
          <Calendar size={24} />
          Frequência - {selectedStudentData.name}
        </h2>
        <button 
          onClick={() => setActiveSection('overview')}
          className="px-4 py-2 bg-gray-100 text-brand-muted rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
        >
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-brand-success/10 rounded-2xl p-6">
          <p className="text-sm text-brand-success font-bold uppercase tracking-widest">Frequência Geral</p>
          <p className="text-4xl font-black text-brand-success mt-2">95%</p>
          <p className="text-sm text-brand-muted mt-1">Presenças: 114 de 120 aulas</p>
        </div>
        <div className="bg-brand-danger/10 rounded-2xl p-6">
          <p className="text-sm text-brand-danger font-bold uppercase tracking-widest">Total de Faltas</p>
          <p className="text-4xl font-black text-brand-danger mt-2">6</p>
          <p className="text-sm text-brand-muted mt-1">Limite: 30 faltas (25% de 120)</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="text-left py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">Disciplina</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">1º Bim</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">2º Bim</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">3º Bim</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">4º Bim</th>
              <th className="text-center py-4 px-4 text-xs font-bold text-brand-muted uppercase tracking-widest">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(selectedStudentData.academicRecords).map(([subject, record]) => {
              const absences = Object.values(record.absences).filter(a => a !== null) as number[];
              const total = absences.reduce((a, b) => a + b, 0);
              return (
                <tr key={subject} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-4 font-bold text-brand-dark">{subject}</td>
                  {[1, 2, 3, 4].map(bim => (
                    <td key={bim} className="text-center py-4 px-4">
                      <span className={`font-bold ${
                        record.absences[bim] === null ? 'text-brand-muted' :
                        (record.absences[bim] as number) === 0 ? 'text-brand-success' :
                        (record.absences[bim] as number) <= 2 ? 'text-brand-warning' : 'text-brand-danger'
                      }`}>
                        {record.absences[bim] !== null ? record.absences[bim] : '-'}
                      </span>
                    </td>
                  ))}
                  <td className="text-center py-4 px-4">
                    <span className={`font-black ${total <= 3 ? 'text-brand-success' : total <= 6 ? 'text-brand-warning' : 'text-brand-danger'}`}>
                      {total}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTransport = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
          <Bus size={24} />
          Transporte Escolar
        </h2>
        <button 
          onClick={() => setActiveSection('overview')}
          className="px-4 py-2 bg-gray-100 text-brand-muted rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
        >
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studentRoutes.map((route) => (
          <div key={route.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-brand-info/10 rounded-2xl flex items-center justify-center">
                <Bus size={28} className="text-brand-info" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-brand-dark text-lg">{route.name}</h3>
                <p className="text-brand-muted text-sm">{route.vehicle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <UserIcon size={14} className="text-brand-muted" />
                  <span className="text-sm text-brand-muted">Motorista: {route.driver}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-brand-success/10 text-brand-success rounded-full text-xs font-bold">
                Ativa
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">Paradas da Rota</p>
              <div className="space-y-2">
                {route.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0 ? 'bg-brand-success text-white' :
                      idx === route.stops.length - 1 ? 'bg-brand-info text-white' :
                      'bg-gray-200 text-brand-muted'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <MapPin size={14} className="text-brand-muted" />
                      <span className="text-sm text-brand-dark">{stop}</span>
                    </div>
                    {idx === 0 && <span className="text-xs text-brand-success font-bold">Embarque</span>}
                    {idx === route.stops.length - 1 && <span className="text-xs text-brand-info font-bold">Destino</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} className="text-brand-muted" />
                <span className="text-brand-muted">Horário estimado de embarque:</span>
                <span className="font-bold text-brand-dark">07:15</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEnrollment = () => {
    const [formData, setFormData] = useState({
      studentName: '',
      birthDate: '',
      requestedGrade: '',
      schoolId: '',
      type: 'matricula' as 'matricula' | 'rematricula',
    });

    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
            <ClipboardList size={24} />
            Solicitar Matrícula / Rematrícula
          </h2>
          <button 
            onClick={() => setActiveSection('overview')}
            className="px-4 py-2 bg-gray-100 text-brand-muted rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
          >
            Voltar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Tipo de Solicitação</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setFormData({ ...formData, type: 'matricula' })}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    formData.type === 'matricula' 
                      ? 'bg-brand-primary text-brand-dark' 
                      : 'bg-gray-100 text-brand-muted hover:bg-gray-200'
                  }`}
                >
                  Nova Matrícula
                </button>
                <button
                  onClick={() => setFormData({ ...formData, type: 'rematricula' })}
                  className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    formData.type === 'rematricula' 
                      ? 'bg-brand-primary text-brand-dark' 
                      : 'bg-gray-100 text-brand-muted hover:bg-gray-200'
                  }`}
                >
                  Rematrícula
                </button>
              </div>
            </div>

            {formData.type === 'rematricula' && linkedStudents.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Selecionar Dependente</label>
                <select 
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                  onChange={(e) => {
                    const student = linkedStudents.find(s => s.id === e.target.value);
                    if (student) {
                      setFormData({
                        ...formData,
                        studentName: student.name,
                        birthDate: student.birthDate,
                        schoolId: student.schoolId,
                      });
                    }
                  }}
                >
                  <option value="">Selecione um dependente</option>
                  {linkedStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Nome do Aluno *</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                placeholder="Nome completo do aluno"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Data de Nascimento *</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Série Desejada *</label>
              <select
                value={formData.requestedGrade}
                onChange={(e) => setFormData({ ...formData, requestedGrade: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
              >
                <option value="">Selecione a série</option>
                {GRADES_OPTIONS.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Escola *</label>
              <select
                value={formData.schoolId}
                onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
              >
                <option value="">Selecione a escola</option>
                {MOCK_SCHOOLS.filter(s => s.isEnrollmentOpen).map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => alert('Solicitação enviada com sucesso! Você receberá uma notificação sobre o status.')}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-dark text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all"
            >
              <Send size={16} />
              Enviar Solicitação
            </button>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-black text-brand-dark mb-4 flex items-center gap-2">
              <FileText size={20} />
              Documentos Necessários
            </h3>
            <ul className="space-y-3">
              {[
                'Certidão de Nascimento',
                'RG e CPF do Responsável',
                'Comprovante de Residência',
                'Carteira de Vacinação',
                'Histórico Escolar (para transferência)',
                'Foto 3x4 recente',
              ].map((doc, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-brand-muted">
                  <CheckCircle size={16} className="text-brand-success" />
                  {doc}
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-brand-warning/10 rounded-xl">
              <p className="text-sm text-brand-warning font-bold">Atenção</p>
              <p className="text-sm text-brand-muted mt-1">
                Após enviar a solicitação, você deverá comparecer à secretaria da escola com os documentos originais.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCommunications = () => (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
          <Bell size={24} />
          Comunicados
        </h2>
        <button 
          onClick={() => setActiveSection('overview')}
          className="px-4 py-2 bg-gray-100 text-brand-muted rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
        >
          Voltar
        </button>
      </div>

      <div className="space-y-4">
        {communications.map((notice) => (
          <div 
            key={notice.id} 
            className={`p-6 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
              notice.read ? 'bg-gray-50 border-gray-100' : 'bg-white border-brand-info/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  notice.type === 'evento' ? 'bg-brand-info/20' :
                  notice.type === 'aviso' ? 'bg-brand-warning/20' : 'bg-brand-success/20'
                }`}>
                  {notice.type === 'evento' ? <Calendar size={20} className="text-brand-info" /> :
                   notice.type === 'aviso' ? <AlertCircle size={20} className="text-brand-warning" /> :
                   <Bell size={20} className="text-brand-success" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-brand-dark">{notice.title}</h3>
                    {!notice.read && (
                      <span className="px-2 py-0.5 bg-brand-danger/10 text-brand-danger rounded text-[10px] font-bold">NOVO</span>
                    )}
                  </div>
                  <p className="text-sm text-brand-muted mt-1">{notice.date}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                    notice.type === 'evento' ? 'bg-brand-info/10 text-brand-info' :
                    notice.type === 'aviso' ? 'bg-brand-warning/10 text-brand-warning' : 'bg-brand-success/10 text-brand-success'
                  }`}>
                    {notice.type === 'evento' ? 'Evento' : notice.type === 'aviso' ? 'Aviso' : 'Informativo'}
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-brand-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Portal do Responsável</h1>
          <p className="text-brand-muted mt-1">Acompanhe o desempenho dos seus dependentes</p>
        </div>
        
        {/* Menu de navegação rápida */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Users },
            { id: 'enrollment', label: 'Matrícula', icon: ClipboardList },
            { id: 'transport', label: 'Transporte', icon: Bus },
            { id: 'communications', label: 'Comunicados', icon: Bell },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                activeSection === item.id
                  ? 'bg-brand-primary text-brand-dark'
                  : 'bg-gray-100 text-brand-muted hover:bg-gray-200'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo baseado na seção ativa */}
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'grades' && renderGrades()}
      {activeSection === 'attendance' && renderAttendance()}
      {activeSection === 'transport' && renderTransport()}
      {activeSection === 'enrollment' && renderEnrollment()}
      {activeSection === 'communications' && renderCommunications()}
    </div>
  );
};

export default GuardianPortal;