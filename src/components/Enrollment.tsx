import React from 'react';
import { FileText } from 'lucide-react';

const Enrollment: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-brand-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText size={40} className="text-brand-primary" />
        </div>
        <h2 className="text-2xl font-black text-brand-dark">Formulário de Matrícula</h2>
        <p className="text-brand-muted mt-2">Use o módulo de Gestão de Matrículas para gerenciar solicitações</p>
      </div>
    </div>
  );
};

export default Enrollment;