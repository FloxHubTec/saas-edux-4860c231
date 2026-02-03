import React from 'react';
import { Student } from '../types';
import { MOCK_SCHOOLS } from '../constants';

interface StudentDetailsModalProps {
  student: Student;
  onClose: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, onClose }) => {
  const school = MOCK_SCHOOLS.find(s => s.id === student.schoolId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-dark text-white p-8 rounded-t-[2rem]">
          <div className="flex items-center gap-6">
            <img 
              src={student.photo} 
              alt={student.name} 
              className="w-24 h-24 rounded-2xl object-cover border-4 border-brand-yellow shadow-lg"
            />
            <div>
              <h2 className="text-2xl font-black">{student.name}</h2>
              <p className="text-brand-yellow font-bold mt-1">{student.currentGrade}</p>
              <p className="text-gray-400 text-sm mt-1">{school?.name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
              student.status === 'active' ? 'bg-brand-success/10 text-brand-success' :
              student.status === 'transferred' ? 'bg-brand-warning/10 text-brand-warning' :
              'bg-brand-danger/10 text-brand-danger'
            }`}>
              {student.status === 'active' ? 'Ativo' : 
               student.status === 'transferred' ? 'Transferido' : 'Inativo'}
            </span>
          </div>

          {/* Personal Info */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-black text-brand-dark mb-4 text-sm uppercase tracking-widest">Dados Pessoais</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-brand-gray text-xs uppercase tracking-widest mb-1">Data de Nascimento</p>
                <p className="font-bold text-brand-dark">{new Date(student.birthDate).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-brand-gray text-xs uppercase tracking-widest mb-1">CPF</p>
                <p className="font-bold text-brand-dark">{student.documents.cpf}</p>
              </div>
              {student.documents.rg && (
                <div>
                  <p className="text-brand-gray text-xs uppercase tracking-widest mb-1">RG</p>
                  <p className="font-bold text-brand-dark">{student.documents.rg}</p>
                </div>
              )}
            </div>
          </div>

          {/* Responsibles */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-black text-brand-dark mb-4 text-sm uppercase tracking-widest">Responsáveis</h3>
            <div className="space-y-4">
              {student.responsibles.map((resp, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-brand-dark">{resp.name}</p>
                      <p className="text-brand-gray text-xs uppercase tracking-widest">{resp.relationship}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-brand-gray text-xs">Telefone</p>
                      <p className="font-medium">{resp.phone}</p>
                    </div>
                    {resp.email && (
                      <div>
                        <p className="text-brand-gray text-xs">Email</p>
                        <p className="font-medium">{resp.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Records */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-black text-brand-dark mb-4 text-sm uppercase tracking-widest">Desempenho Acadêmico</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-brand-gray text-xs uppercase tracking-widest">
                    <th className="pb-3">Disciplina</th>
                    <th className="pb-3 text-center">1º B</th>
                    <th className="pb-3 text-center">2º B</th>
                    <th className="pb-3 text-center">3º B</th>
                    <th className="pb-3 text-center">4º B</th>
                    <th className="pb-3 text-center">Média</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(student.academicRecords).map(([subject, data]) => {
                    const grades = [data.grades[1], data.grades[2], data.grades[3], data.grades[4]];
                    const validGrades = grades.filter(g => g !== null) as number[];
                    const avg = validGrades.length > 0 ? validGrades.reduce((a, b) => a + b, 0) / validGrades.length : 0;
                    
                    return (
                      <tr key={subject} className="border-t border-gray-200">
                        <td className="py-3 font-bold text-brand-dark">{subject}</td>
                        {grades.map((grade, i) => (
                          <td key={i} className="py-3 text-center">
                            {grade !== null ? grade.toFixed(1) : '-'}
                          </td>
                        ))}
                        <td className={`py-3 text-center font-bold ${avg >= 7 ? 'text-brand-success' : avg >= 5 ? 'text-brand-warning' : 'text-brand-danger'}`}>
                          {avg.toFixed(1)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-brand-dark text-white font-bold text-sm hover:bg-black transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
