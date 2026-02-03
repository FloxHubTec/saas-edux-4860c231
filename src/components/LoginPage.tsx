import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_SCHOOLS, MOCK_PROFESSORS } from '../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const DEMO_USERS = [
  { id: 'admin-01', name: 'João Administrador', email: 'admin@edu.gov', role: UserRole.ADMIN, schoolId: undefined },
  { id: 'sec-01', name: 'Maria Secretária', email: 'secretaria@edu.gov', role: UserRole.SECRETARY, schoolId: 'escola-01' },
  { id: 'prof-01', name: 'Carla Mendes', email: 'carla.mendes@edu.gov', role: UserRole.PROFESSOR, schoolId: 'escola-01' },
  { id: 'stu-01', name: 'Ana Clara Oliveira', email: 'ana.clara@aluno.edu.gov', role: UserRole.STUDENT, schoolId: 'escola-01' },
];

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', phone: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = DEMO_USERS.find(u => u.email === email);
    if (user) {
      onLogin(user);
    } else {
      setError('Usuário não encontrado. Use um dos emails de demonstração.');
    }
  };

  const handleSelfRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserData.name && newUserData.email) {
      const newUser: User = {
        id: `self-${Date.now()}`,
        name: newUserData.name,
        email: newUserData.email,
        role: UserRole.STUDENT,
        isSelfRegistered: true
      };
      onLogin(newUser);
    }
  };

  const handleDemoLogin = (user: typeof DEMO_USERS[0]) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/90 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-8 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-brand-yellow rounded-3xl flex items-center justify-center text-brand-dark font-black text-4xl shadow-2xl shadow-brand-yellow/30">
                E
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight">EduX</h1>
                <p className="text-brand-yellow font-bold text-sm uppercase tracking-widest">Sistema de Gestão Educacional</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black leading-tight">
              Gestão Educacional<br />
              <span className="text-brand-yellow">Inteligente e Integrada</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Plataforma completa para administração escolar municipal com conformidade total à Lei 14.133/2021.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { icon: '📊', label: 'Dashboard Analítico' },
              { icon: '📝', label: 'Matrículas Online' },
              { icon: '🚌', label: 'Transporte Escolar' },
              { icon: '🔒', label: 'Auditoria Completa' },
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl">
          {!isNewUser ? (
            <>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-brand-dark">Bem-vindo de volta!</h3>
                <p className="text-brand-gray mt-2">Acesse sua conta para continuar</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-brand-dark font-medium focus:outline-none focus:border-brand-yellow transition-all"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Senha</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-brand-dark font-medium focus:outline-none focus:border-brand-yellow transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="bg-brand-danger/10 text-brand-danger px-4 py-3 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-brand-dark text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-brand-dark/20"
                >
                  Entrar
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-center text-xs font-bold text-brand-gray uppercase tracking-widest mb-4">Acesso Rápido (Demo)</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleDemoLogin(user)}
                      className="px-4 py-3 bg-gray-50 hover:bg-brand-yellow/10 rounded-xl text-xs font-bold text-brand-dark transition-all flex items-center gap-2"
                    >
                      <span className="text-lg">
                        {user.role === UserRole.ADMIN ? '👑' : 
                         user.role === UserRole.SECRETARY ? '📋' :
                         user.role === UserRole.PROFESSOR ? '👨‍🏫' : '🎓'}
                      </span>
                      <span className="truncate">{user.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsNewUser(true)}
                  className="text-brand-info font-bold text-sm hover:underline"
                >
                  Primeira vez? Cadastre-se para matrícula →
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-brand-dark">Pré-Cadastro</h3>
                <p className="text-brand-gray mt-2">Inicie sua solicitação de matrícula</p>
              </div>

              <form onSubmit={handleSelfRegister} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-brand-dark font-medium focus:outline-none focus:border-brand-yellow transition-all"
                    placeholder="Nome do responsável"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-brand-dark font-medium focus:outline-none focus:border-brand-yellow transition-all"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-brand-dark font-medium focus:outline-none focus:border-brand-yellow transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-yellow text-brand-dark py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-brand-yellow/20"
                >
                  Iniciar Solicitação de Matrícula
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsNewUser(false)}
                  className="text-brand-gray font-bold text-sm hover:underline"
                >
                  ← Voltar ao login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
