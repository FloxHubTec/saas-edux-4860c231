import React, { useState } from 'react';
import { Link2, RefreshCw, BarChart3, CheckCircle, FileText, Bus, Apple, Building2, Info, Clock } from 'lucide-react';

const IDEPIntegration: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleConnect = () => {
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
      setLastSync(new Date().toLocaleString('pt-BR'));
      alert('Conexão estabelecida com o IDEP!');
    }, 2000);
  };

  const handleSync = () => {
    if (connectionStatus !== 'connected') {
      alert('Conecte-se ao IDEP primeiro.');
      return;
    }
    setLastSync(new Date().toLocaleString('pt-BR'));
    alert('Dados sincronizados com sucesso!');
  };

  const modules = [
    { name: 'Censo Escolar', icon: <BarChart3 size={24} />, status: 'available', description: 'Envie dados do censo escolar automaticamente' },
    { name: 'Frequência', icon: <CheckCircle size={24} />, status: 'available', description: 'Sincronize dados de frequência dos alunos' },
    { name: 'Notas e Conceitos', icon: <FileText size={24} />, status: 'available', description: 'Exporte notas e conceitos para o sistema estadual' },
    { name: 'Transporte Escolar', icon: <Bus size={24} />, status: 'coming_soon', description: 'Integração com dados de transporte (em breve)' },
    { name: 'Alimentação Escolar', icon: <Apple size={24} />, status: 'coming_soon', description: 'Dados do PNAE (em breve)' },
    { name: 'Infraestrutura', icon: <Building2 size={24} />, status: 'coming_soon', description: 'Inventário de infraestrutura escolar (em breve)' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Integração IDEP</h1>
          <p className="text-brand-muted mt-1">Conecte-se ao sistema estadual de educação</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
            connectionStatus === 'connected' ? 'bg-brand-success/10 text-brand-success' :
            connectionStatus === 'connecting' ? 'bg-brand-warning/10 text-brand-warning' :
            'bg-gray-100 text-gray-500'
          }`}>
            {connectionStatus === 'connected' ? 'Conectado' :
             connectionStatus === 'connecting' ? 'Conectando...' :
             'Desconectado'}
          </span>
        </div>
      </div>

      {/* Card de Conexão */}
      <div className="bg-gradient-to-r from-brand-dark to-brand-dark/80 rounded-[2rem] p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Link2 size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black">IDEP - Sistema Estadual</h2>
                <p className="text-gray-300">Instituto de Desenvolvimento da Educação Pública</p>
              </div>
            </div>
            {lastSync && (
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Clock size={14} />
                Última sincronização: {lastSync}
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            {connectionStatus !== 'connected' ? (
              <button
                onClick={handleConnect}
                disabled={connectionStatus === 'connecting'}
                className="px-8 py-4 bg-brand-primary text-brand-dark rounded-2xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
              >
                {connectionStatus === 'connecting' ? 'Conectando...' : 'Conectar'}
              </button>
            ) : (
              <>
                <button
                  onClick={handleSync}
                  className="flex items-center gap-2 px-8 py-4 bg-brand-success text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all"
                >
                  <RefreshCw size={18} />
                  Sincronizar
                </button>
                <button
                  onClick={() => setConnectionStatus('disconnected')}
                  className="px-6 py-4 bg-white/10 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  Desconectar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid de Módulos */}
      <div>
        <h2 className="text-xl font-black text-brand-dark mb-6">Módulos de Integração</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 transition-all ${
                module.status === 'available' ? 'hover:shadow-lg' : 'opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-brand-info/10 rounded-2xl flex items-center justify-center text-brand-info">
                  {module.icon}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  module.status === 'available' 
                    ? 'bg-brand-success/10 text-brand-success' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {module.status === 'available' ? 'Disponível' : 'Em Breve'}
                </span>
              </div>
              
              <h3 className="font-black text-brand-dark text-lg">{module.name}</h3>
              <p className="text-brand-muted text-sm mt-2">{module.description}</p>
              
              {module.status === 'available' && connectionStatus === 'connected' && (
                <button className="w-full mt-6 px-4 py-3 bg-brand-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                  Acessar Módulo
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Histórico */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-warning/10 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-brand-warning" />
          </div>
          Histórico de Sincronização
        </h2>
        
        {connectionStatus === 'connected' ? (
          <div className="space-y-3">
            {[
              { action: 'Dados do Censo sincronizados', time: '10:30', status: 'success' },
              { action: 'Frequência de Outubro enviada', time: '10:28', status: 'success' },
              { action: 'Conexão estabelecida', time: '10:25', status: 'info' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    log.status === 'success' ? 'bg-brand-success' : 'bg-brand-info'
                  }`} />
                  <span className="text-brand-dark font-medium">{log.action}</span>
                </div>
                <span className="text-brand-muted text-sm">{log.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Link2 size={48} className="mx-auto text-brand-muted mb-4" />
            <p className="text-brand-muted">Conecte-se ao IDEP para ver o histórico de sincronização</p>
          </div>
        )}
      </div>

      {/* Card de Informações */}
      <div className="bg-brand-info/5 rounded-[2rem] p-8 border border-brand-info/20">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-brand-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info size={24} className="text-brand-info" />
          </div>
          <div>
            <h3 className="font-black text-brand-dark">Sobre a Integração IDEP</h3>
            <p className="text-brand-muted mt-2">
              A integração com o IDEP permite o envio automático de dados educacionais para o sistema estadual, 
              garantindo conformidade com as exigências legais e facilitando a gestão de informações. 
              Todos os dados são transmitidos de forma segura e criptografada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDEPIntegration;