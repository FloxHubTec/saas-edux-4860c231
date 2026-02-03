import React, { useState } from 'react';
import { MOCK_SCHOOLS } from '../constants';
import { Student } from '../types';

interface StudentPortalProps {
  currentStudent: Student;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ currentStudent }) => {
  const [activeBimester, setActiveBimester] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
  const currentSchool = MOCK_SCHOOLS.find(s => s.id === currentStudent.schoolId);
  const schoolName = currentSchool?.name || "Rede Municipal";
  const isEnrollmentOpen = currentSchool?.isEnrollmentOpen || false;
  const year = "2024";

  const subjects = Object.entries(currentStudent.academicRecords).map(([name, data]) => {
    const gradesArr = [data.grades[1], data.grades[2], data.grades[3], data.grades[4]];
    const absArr = [data.absences[1], data.absences[2], data.absences[3], data.absences[4]];
    const validGrades = gradesArr.filter(g => g !== null) as number[];
    const avg = validGrades.length > 0 ? validGrades.reduce((a, b) => a + b, 0) / validGrades.length : 0;
    const totalAbsences = absArr.reduce((a, b) => (a || 0) + (b || 0), 0) || 0;
    return { name, grades: gradesArr, absences: absArr, avg, recovery: data.recovery, totalAbsences, final: avg >= 7 ? 'Aprovado' : 'Em Análise' };
  });

  const handlePrint = () => { window.print(); };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className={`p-8 rounded-[3rem] border-4 transition-all ${isEnrollmentOpen ? 'bg-brand-yellow/10 border-brand-yellow shadow-xl' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-lg ${isEnrollmentOpen ? 'bg-brand-yellow text-brand-dark' : 'bg-gray-200 text-gray-400'}`}>
              {isEnrollmentOpen ? '🔓' : '🔒'}
            </div>
            <div>
              <h3 className="text-2xl font-black text-brand-dark tracking-tighter">Renovação de Matrícula 2025</h3>
              <p className="font-bold text-sm text-brand-gray mt-1">
                {isEnrollmentOpen ? 'O período de rematrícula online está disponível!' : 'Aguardando liberação pela secretaria escolar.'}
              </p>
            </div>
          </div>
          <button disabled={!isEnrollmentOpen} className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl ${isEnrollmentOpen ? 'bg-brand-dark text-white hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
            {isEnrollmentOpen ? 'Iniciar Rematrícula →' : 'Bloqueado'}
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <img src={currentStudent.photo} className="w-16 h-16 rounded-2xl border-2 border-brand-yellow object-cover shadow-lg" alt="" />
          <div>
            <h3 className="text-xl font-black text-brand-dark">{currentStudent.name}</h3>
            <p className="text-brand-gray font-bold text-sm uppercase tracking-widest">{schoolName}</p>
          </div>
        </div>
        <button onClick={handlePrint} className="bg-brand-dark text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">🖨️ Imprimir Boletim</button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap gap-2">
        {[{ id: 'ALL', label: 'Anual' }, { id: 1, label: '1º Bim' }, { id: 2, label: '2º Bim' }, { id: 3, label: '3º Bim' }, { id: 4, label: '4º Bim' }].map((btn) => (
          <button key={btn.id} onClick={() => setActiveBimester(btn.id as any)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeBimester === btn.id ? 'bg-brand-yellow text-brand-dark shadow-lg' : 'bg-gray-50 text-brand-gray hover:bg-gray-100'}`}>
            {btn.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-brand-dark text-white text-[10px] uppercase font-black tracking-widest">
              <th className="p-4 border border-white/10 text-left">Disciplina</th>
              {activeBimester === 'ALL' ? [1,2,3,4].map(b => <th key={b} className="p-2 border border-white/10">N{b}</th>) : <th className="p-4 border border-white/10">Nota</th>}
              {activeBimester === 'ALL' ? [1,2,3,4].map(b => <th key={`f${b}`} className="p-2 border border-white/10">F{b}</th>) : <th className="p-4 border border-white/10">Faltas</th>}
              <th className="p-4 border border-white/10">Média</th>
              <th className="p-4 border border-white/10">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjects.map((sub, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-left font-black text-brand-dark text-xs">{sub.name}</td>
                {activeBimester === 'ALL' ? sub.grades.map((g, idx) => <td key={idx} className="p-4 text-xs font-bold text-brand-gray">{g !== null ? g.toFixed(1) : '-'}</td>) : <td className="p-4 text-sm font-black text-brand-dark">{sub.grades[(activeBimester as number) - 1]?.toFixed(1) || '-'}</td>}
                {activeBimester === 'ALL' ? sub.absences.map((a, idx) => <td key={idx} className="p-4 text-xs font-bold text-brand-gray">{a ?? '-'}</td>) : <td className="p-4 text-sm font-black text-brand-dark">{sub.absences[(activeBimester as number) - 1] ?? '-'}</td>}
                <td className={`p-4 font-black text-sm ${sub.avg >= 7 ? 'text-brand-success' : 'text-brand-danger'}`}>{sub.avg.toFixed(1)}</td>
                <td className="p-4"><span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-brand-success/10 text-brand-success">{sub.final}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPortal;
