import React, { useState } from 'react';
import { User, LessonPlan } from '../types';
import { MOCK_LESSON_PLANS, SUBJECTS_LIST, BIMESTERS } from '../constants';
import { auditService } from '../services/auditService';
import { Plus, ClipboardList, Edit2, Send, FileText } from 'lucide-react';

interface LessonPlannerProps {
  currentUser: User;
}

const MOCK_CLASSES = ['4º Ano A', '5º Ano B', '3º Ano A'];

const LessonPlanner: React.FC<LessonPlannerProps> = ({ currentUser }) => {
  const [plans, setPlans] = useState<LessonPlan[]>(MOCK_LESSON_PLANS);
  const [selectedBimester, setSelectedBimester] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);

  const [formData, setFormData] = useState({
    subject: SUBJECTS_LIST[0],
    className: MOCK_CLASSES[0],
    week: 1,
    theme: '',
    objectives: '',
    content: '',
    methodology: '',
    resources: '',
    evaluation: '',
  });

  const filteredPlans = plans.filter(p => 
    p.bimester === selectedBimester &&
    p.professorId === currentUser.id
  );

  const handleOpenModal = (plan?: LessonPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        subject: plan.subject,
        className: plan.className,
        week: plan.week,
        theme: plan.theme,
        objectives: plan.objectives.join('\n'),
        content: plan.content,
        methodology: plan.methodology,
        resources: plan.resources.join(', '),
        evaluation: plan.evaluation,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        subject: SUBJECTS_LIST[0],
        className: MOCK_CLASSES[0],
        week: 1,
        theme: '',
        objectives: '',
        content: '',
        methodology: '',
        resources: '',
        evaluation: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.theme || !formData.content) {
      alert('Preencha pelo menos o tema e o conteúdo.');
      return;
    }

    const planData: LessonPlan = {
      id: editingPlan?.id || `lp-${Date.now()}`,
      professorId: currentUser.id,
      subject: formData.subject,
      className: formData.className,
      bimester: selectedBimester,
      week: formData.week,
      theme: formData.theme,
      objectives: formData.objectives.split('\n').filter(o => o.trim()),
      content: formData.content,
      methodology: formData.methodology,
      resources: formData.resources.split(',').map(r => r.trim()).filter(r => r),
      evaluation: formData.evaluation,
      status: 'draft',
      createdAt: editingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? planData : p));
      auditService.log(currentUser, 'Atualização de Plano de Aula', 'LessonPlan', planData.id, editingPlan, planData, `Plano de aula atualizado para ${formData.subject}`);
    } else {
      setPlans(prev => [...prev, planData]);
      auditService.log(currentUser, 'Criação de Plano de Aula', 'LessonPlan', planData.id, null, planData, `Novo plano de aula criado para ${formData.subject}`);
    }

    setShowModal(false);
    alert('Plano de aula salvo com sucesso!');
  };

  const handleSubmitForApproval = (planId: string) => {
    setPlans(prev => prev.map(p => 
      p.id === planId ? { ...p, status: 'submitted' as const } : p
    ));
    alert('Plano enviado para aprovação da coordenação!');
  };

  const getStatusBadge = (status: LessonPlan['status']) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-600',
      submitted: 'bg-brand-warning/10 text-brand-warning',
      approved: 'bg-brand-success/10 text-brand-success',
      revision: 'bg-brand-danger/10 text-brand-danger',
    };
    const labels: Record<string, string> = {
      draft: 'Rascunho',
      submitted: 'Enviado',
      approved: 'Aprovado',
      revision: 'Revisão',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Plano de Aula</h1>
          <p className="text-brand-muted mt-1">Organize e planeje suas aulas por bimestre</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-dark rounded-2xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
        >
          <Plus size={18} />
          Novo Plano
        </button>
      </div>

      {/* Seleção de Bimestre */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex gap-2">
          {BIMESTERS.map((bim) => (
            <button
              key={bim}
              onClick={() => setSelectedBimester(bim)}
              className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all ${
                selectedBimester === bim
                  ? 'bg-brand-primary text-brand-dark'
                  : 'bg-gray-50 text-brand-muted hover:bg-gray-100'
              }`}
            >
              {bim}º Bimestre
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Planos */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-gray-100 text-center">
          <ClipboardList size={64} className="mx-auto text-brand-muted mb-4" />
          <h3 className="text-xl font-black text-brand-dark">Nenhum plano para este bimestre</h3>
          <p className="text-brand-muted mt-2">Clique em "Novo Plano" para criar seu primeiro plano de aula</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-brand-info/10 text-brand-info rounded-full text-xs font-bold">
                    {plan.subject}
                  </span>
                  <span className="px-3 py-1 bg-brand-warning/10 text-brand-warning rounded-full text-xs font-bold">
                    {plan.className}
                  </span>
                </div>
                {getStatusBadge(plan.status)}
              </div>

              <h3 className="font-black text-brand-dark text-lg mb-2">{plan.theme}</h3>
              <p className="text-brand-muted text-sm mb-4">Semana {plan.week}</p>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-1">Objetivos</p>
                  <ul className="list-disc list-inside text-brand-dark">
                    {plan.objectives.slice(0, 2).map((obj, i) => (
                      <li key={i} className="truncate">{obj}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-1">Recursos</p>
                  <div className="flex flex-wrap gap-1">
                    {plan.resources.slice(0, 3).map((res, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-brand-muted rounded text-xs">
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => handleOpenModal(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                >
                  <Edit2 size={14} />
                  Editar
                </button>
                {plan.status === 'draft' && (
                  <button
                    onClick={() => handleSubmitForApproval(plan.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-success text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                  >
                    <Send size={14} />
                    Enviar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-[2rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black text-brand-dark mb-6">
              {editingPlan ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Disciplina</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                >
                  {SUBJECTS_LIST.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Turma</label>
                <select
                  value={formData.className}
                  onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                >
                  {MOCK_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Semana</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.week}
                  onChange={(e) => setFormData({ ...formData, week: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Tema *</label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                  placeholder="Ex: Gêneros Textuais"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
                  Objetivos de Aprendizagem (um por linha)
                </label>
                <textarea
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all resize-none"
                  placeholder="Identificar características do gênero&#10;Reconhecer elementos..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Conteúdo *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all resize-none"
                  placeholder="Descreva o conteúdo a ser trabalhado..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Metodologia</label>
                <textarea
                  value={formData.methodology}
                  onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all resize-none"
                  placeholder="Como será conduzida a aula..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
                  Recursos (separados por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.resources}
                  onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all"
                  placeholder="Livro didático, Projetor, Folhas"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Avaliação</label>
                <textarea
                  value={formData.evaluation}
                  onChange={(e) => setFormData({ ...formData, evaluation: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all resize-none"
                  placeholder="Como será avaliada a aprendizagem..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-brand-muted rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-black transition-all"
              >
                Salvar Plano
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlanner;