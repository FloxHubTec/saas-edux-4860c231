import React from 'react';

const CalendarManager: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Gerenciador de Calendário</h1>
          <p className="text-brand-gray mt-1">Configure os períodos letivos e eventos do ano</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <div className="text-center py-12">
          <p className="text-6xl mb-4">📅</p>
          <h3 className="text-xl font-black text-brand-dark">Módulo em Desenvolvimento</h3>
          <p className="text-brand-gray mt-2">O gerenciador avançado de calendário está sendo implementado</p>
          <p className="text-brand-gray text-sm mt-1">Use o Calendário Letivo interativo para visualizar e adicionar eventos</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarManager;
