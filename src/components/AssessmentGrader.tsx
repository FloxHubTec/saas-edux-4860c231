import React, { useState } from 'react';
import { User, Assessment, StudentAnswer } from '../types';
import { MOCK_ASSESSMENTS, MOCK_STUDENTS, SUBJECTS_LIST } from '../constants';

interface AssessmentGraderProps {
  currentUser: User;
  onSyncGrade: (studentId: string, subject: string, bimester: number, grade: number) => void;
}

const AssessmentGrader: React.FC<AssessmentGraderProps> = ({ currentUser, onSyncGrade }) => {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string[]>>({});
  const [gradedResults, setGradedResults] = useState<Record<string, number>>({});

  const handleAnswerChange = (studentId: string, questionIndex: number, answer: string) => {
    setStudentAnswers(prev => {
      const current = prev[studentId] || Array(selectedAssessment?.totalQuestions || 10).fill('');
      const updated = [...current];
      updated[questionIndex] = answer.toUpperCase();
      return { ...prev, [studentId]: updated };
    });
  };

  const handleGradeAll = () => {
    if (!selectedAssessment) return;

    const results: Record<string, number> = {};
    const answerKey = selectedAssessment.answerKey;

    Object.entries(studentAnswers).forEach(([studentId, answers]) => {
      let correct = 0;
      answers.forEach((answer, index) => {
        if (answer === answerKey[index]) correct++;
      });
      const score = (correct / answerKey.length) * 10;
      results[studentId] = parseFloat(score.toFixed(1));
    });

    setGradedResults(results);
    alert('Correção automática concluída!');
  };

  const handleSyncToGrading = (studentId: string) => {
    if (!selectedAssessment || !gradedResults[studentId]) return;
    onSyncGrade(studentId, selectedAssessment.subject, selectedAssessment.bimester, gradedResults[studentId]);
  };

  const relevantStudents = MOCK_STUDENTS.filter(s => 
    s.currentGrade === selectedAssessment?.className
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Correção Automática</h1>
          <p className="text-brand-gray mt-1">Corrija avaliações objetivas automaticamente</p>
        </div>
      </div>

      {/* Assessment Selection */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-brand-dark mb-6">Selecione a Avaliação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_ASSESSMENTS.map((assessment) => (
            <button
              key={assessment.id}
              onClick={() => {
                setSelectedAssessment(assessment);
                setStudentAnswers({});
                setGradedResults({});
              }}
              className={`p-6 rounded-2xl text-left transition-all ${
                selectedAssessment?.id === assessment.id
                  ? 'bg-brand-yellow border-2 border-brand-dark'
                  : 'bg-gray-50 border-2 border-transparent hover:border-brand-yellow'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  assessment.status === 'active' ? 'bg-brand-success/10 text-brand-success' :
                  assessment.status === 'graded' ? 'bg-brand-info/10 text-brand-info' :
                  'bg-brand-warning/10 text-brand-warning'
                }`}>
                  {assessment.status === 'active' ? 'Ativa' : 
                   assessment.status === 'graded' ? 'Corrigida' : 'Rascunho'}
                </span>
              </div>
              <h3 className="font-black text-brand-dark">{assessment.name}</h3>
              <p className="text-brand-gray text-sm mt-1">{assessment.className}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-2 py-1 bg-brand-info/10 text-brand-info rounded text-xs font-bold">
                  {assessment.subject}
                </span>
                <span className="px-2 py-1 bg-brand-warning/10 text-brand-warning rounded text-xs font-bold">
                  {assessment.totalQuestions} questões
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedAssessment && (
        <>
          {/* Answer Key Display */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-brand-success/10 rounded-xl flex items-center justify-center text-brand-success">🔑</span>
              Gabarito Oficial
            </h2>
            <div className="flex flex-wrap gap-3">
              {selectedAssessment.answerKey.map((answer, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-brand-gray font-bold">Q{index + 1}</span>
                  <span className="w-10 h-10 bg-brand-success text-white rounded-xl flex items-center justify-center font-black">
                    {answer}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Answers Input */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-brand-dark flex items-center gap-3">
                <span className="w-10 h-10 bg-brand-info/10 rounded-xl flex items-center justify-center text-brand-info">📝</span>
                Respostas dos Alunos
              </h2>
              <button
                onClick={handleGradeAll}
                className="px-6 py-3 bg-brand-yellow text-brand-dark rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg"
              >
                ✅ Corrigir Todos
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-brand-dark text-white text-xs uppercase tracking-widest">
                    <th className="px-4 py-3 text-left">Aluno</th>
                    {Array.from({ length: selectedAssessment.totalQuestions }, (_, i) => (
                      <th key={i} className="px-2 py-3 text-center w-12">Q{i + 1}</th>
                    ))}
                    <th className="px-4 py-3 text-center">Nota</th>
                    <th className="px-4 py-3 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {relevantStudents.map((student) => {
                    const answers = studentAnswers[student.id] || [];
                    const grade = gradedResults[student.id];

                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img src={student.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <span className="font-bold text-brand-dark text-sm">{student.name}</span>
                          </div>
                        </td>
                        {Array.from({ length: selectedAssessment.totalQuestions }, (_, i) => (
                          <td key={i} className="px-1 py-2 text-center">
                            <input
                              type="text"
                              maxLength={1}
                              value={answers[i] || ''}
                              onChange={(e) => handleAnswerChange(student.id, i, e.target.value)}
                              className={`w-10 h-10 text-center font-bold rounded-lg border-2 focus:outline-none focus:border-brand-yellow transition-all ${
                                grade !== undefined
                                  ? answers[i] === selectedAssessment.answerKey[i]
                                    ? 'border-brand-success bg-brand-success/10 text-brand-success'
                                    : 'border-brand-danger bg-brand-danger/10 text-brand-danger'
                                  : 'border-gray-200'
                              }`}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          {grade !== undefined ? (
                            <span className={`text-xl font-black ${
                              grade >= 7 ? 'text-brand-success' :
                              grade >= 5 ? 'text-brand-warning' :
                              'text-brand-danger'
                            }`}>
                              {grade.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-brand-gray">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {grade !== undefined && (
                            <button
                              onClick={() => handleSyncToGrading(student.id)}
                              className="px-3 py-2 bg-brand-info text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-all"
                            >
                              📤 Sincronizar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {relevantStudents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-brand-gray">Nenhum aluno encontrado para esta turma</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AssessmentGrader;
