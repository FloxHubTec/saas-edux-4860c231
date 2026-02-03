import React, { useState } from 'react';
import { User, Student } from '../types';
import { MOCK_STUDENTS, SUBJECTS_LIST, BIMESTERS, MOCK_SCHOOLS } from '../constants';
import { auditService } from '../services/auditService';

interface GradingManagementProps {
  students: Student[];
  currentUser: User;
  onUpdateStudent: (student: Student) => void;
}

const MOCK_CLASSES = ['4º Ano A', '5º Ano B', '3º Ano A'];

const GradingManagement: React.FC<GradingManagementProps> = ({ students, currentUser, onUpdateStudent }) => {
  const [selectedClass, setSelectedClass] = useState(MOCK_CLASSES[0]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS_LIST[0]);
  const [selectedBimester, setSelectedBimester] = useState(3);
  const [editingCell, setEditingCell] = useState<{ studentId: string; field: 'grade' | 'absence' } | null>(null);
  const [tempValue, setTempValue] = useState('');

  const filteredStudents = students.filter(s => s.currentGrade === selectedClass);

  const handleStartEdit = (studentId: string, field: 'grade' | 'absence', currentValue: number | null) => {
    setEditingCell({ studentId, field });
    setTempValue(currentValue?.toString() || '');
  };

  const handleSaveEdit = (studentId: string, field: 'grade' | 'absence') => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const numValue = parseFloat(tempValue);
    if (isNaN(numValue)) {
      setEditingCell(null);
      return;
    }

    const updatedStudent = JSON.parse(JSON.stringify(student)) as Student;
    
    if (!updatedStudent.academicRecords[selectedSubject]) {
      updatedStudent.academicRecords[selectedSubject] = { grades: {}, absences: {}, recovery: null };
    }

    const oldValue = field === 'grade' 
      ? updatedStudent.academicRecords[selectedSubject].grades[selectedBimester]
      : updatedStudent.academicRecords[selectedSubject].absences[selectedBimester];

    if (field === 'grade') {
      updatedStudent.academicRecords[selectedSubject].grades[selectedBimester] = numValue;
    } else {
      updatedStudent.academicRecords[selectedSubject].absences[selectedBimester] = numValue;
    }

    auditService.log(
      currentUser,
      `Lançamento de ${field === 'grade' ? 'Nota' : 'Falta'}`,
      'StudentAcademicRecord',
      `${studentId}-${selectedSubject}-${selectedBimester}`,
      oldValue,
      numValue,
      `${field === 'grade' ? 'Nota' : 'Faltas'} lançada para ${student.name} em ${selectedSubject}, ${selectedBimester}º Bimestre`
    );

    onUpdateStudent(updatedStudent);
    setEditingCell(null);
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'text-brand-gray';
    if (grade >= 7) return 'text-brand-success';
    if (grade >= 5) return 'text-brand-warning';
    return 'text-brand-danger';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Lançamento de Notas</h1>
          <p className="text-brand-gray mt-1">Gerencie notas e faltas dos alunos</p>
        </div>
        <button className="px-6 py-3 bg-brand-success text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg">
          📊 Exportar Boletins
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div>
            <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Bimestre</label>
            <div className="flex gap-2">
              {BIMESTERS.map((bim) => (
                <button
                  key={bim}
                  onClick={() => setSelectedBimester(bim)}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    selectedBimester === bim
                      ? 'bg-brand-yellow text-brand-dark'
                      : 'bg-gray-50 text-brand-gray hover:bg-gray-100'
                  }`}
                >
                  {bim}º
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-dark text-white text-xs uppercase tracking-widest">
                <th className="px-6 py-4 text-left">Aluno</th>
                <th className="px-6 py-4 text-center">Nota {selectedBimester}º Bim</th>
                <th className="px-6 py-4 text-center">Faltas {selectedBimester}º Bim</th>
                <th className="px-6 py-4 text-center">Média Geral</th>
                <th className="px-6 py-4 text-center">Total Faltas</th>
                <th className="px-6 py-4 text-center">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => {
                const record = student.academicRecords[selectedSubject];
                const currentGrade = record?.grades[selectedBimester] ?? null;
                const currentAbsence = record?.absences[selectedBimester] ?? null;
                
                const allGrades = record ? Object.values(record.grades).filter(g => g !== null) as number[] : [];
                const avg = allGrades.length > 0 ? allGrades.reduce((a, b) => a + b, 0) / allGrades.length : 0;
                
                const totalAbsences = record ? Object.values(record.absences).reduce((a, b) => (a || 0) + (b || 0), 0) : 0;

                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={student.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-brand-dark">{student.name}</p>
                          <p className="text-brand-gray text-xs">{student.currentGrade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editingCell?.studentId === student.id && editingCell?.field === 'grade' ? (
                        <input
                          type="number"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          onBlur={() => handleSaveEdit(student.id, 'grade')}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(student.id, 'grade')}
                          className="w-20 px-2 py-1 border-2 border-brand-yellow rounded-lg text-center font-bold focus:outline-none"
                          min="0"
                          max="10"
                          step="0.1"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => handleStartEdit(student.id, 'grade', currentGrade)}
                          className={`px-4 py-2 rounded-lg font-bold ${getGradeColor(currentGrade)} hover:bg-gray-100 transition-all`}
                        >
                          {currentGrade !== null ? currentGrade.toFixed(1) : '-'}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editingCell?.studentId === student.id && editingCell?.field === 'absence' ? (
                        <input
                          type="number"
                          value={tempValue}
                          onChange={(e) => setTempValue(e.target.value)}
                          onBlur={() => handleSaveEdit(student.id, 'absence')}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(student.id, 'absence')}
                          className="w-20 px-2 py-1 border-2 border-brand-yellow rounded-lg text-center font-bold focus:outline-none"
                          min="0"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => handleStartEdit(student.id, 'absence', currentAbsence)}
                          className="px-4 py-2 rounded-lg font-bold text-brand-dark hover:bg-gray-100 transition-all"
                        >
                          {currentAbsence !== null ? currentAbsence : '-'}
                        </button>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-center font-black ${getGradeColor(avg)}`}>
                      {avg.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-brand-dark">
                      {totalAbsences || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        avg >= 7 ? 'bg-brand-success/10 text-brand-success' :
                        avg >= 5 ? 'bg-brand-warning/10 text-brand-warning' :
                        'bg-brand-danger/10 text-brand-danger'
                      }`}>
                        {avg >= 7 ? 'Aprovado' : avg >= 5 ? 'Recuperação' : 'Atenção'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brand-gray text-lg">Nenhum aluno encontrado nesta turma</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-black text-brand-dark mb-4 uppercase tracking-widest">Legenda</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-brand-success rounded-full" />
            <span className="text-sm text-brand-gray">Nota ≥ 7.0 (Aprovado)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-brand-warning rounded-full" />
            <span className="text-sm text-brand-gray">Nota 5.0 - 6.9 (Recuperação)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-brand-danger rounded-full" />
            <span className="text-sm text-brand-gray">Nota &lt; 5.0 (Atenção)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingManagement;
