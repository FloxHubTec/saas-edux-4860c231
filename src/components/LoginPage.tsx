import React, { useState } from 'react';
import { User, UserRole, UserRoleLabels } from '../types';
import { Building2, LogIn, ChevronDown, Crown, ClipboardList, Users, GraduationCap, BookOpen, UserCheck, Briefcase } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const DEMO_USERS: { role: UserRole; name: string; email: string; schoolId?: string; icon: React.ReactNode }[] = [
  { role: UserRole.SUPER_ADM, name: 'Administrador do Sistema', email: 'superadm@edux.com', icon: <Crown size={18} /> },
  { role: UserRole.DIRETORIA, name: 'Maria Silva', email: 'diretoria@emjbs.edu.br', schoolId: 'school-01', icon: <Briefcase size={18} /> },
  { role: UserRole.COORDENADOR, name: 'Carlos Souza', email: 'coordenador@emjbs.edu.br', schoolId: 'school-01', icon: <ClipboardList size={18} /> },
  { role: UserRole.PROFESSOR, name: 'Ana Costa', email: 'ana.costa@emjbs.edu.br', schoolId: 'school-01', icon: <BookOpen size={18} /> },
  { role: UserRole.SECRETARIO, name: 'Paula Santos', email: 'secretaria@emjbs.edu.br', schoolId: 'school-01', icon: <Users size={18} /> },
  { role: UserRole.ALUNO, name: 'João Pedro', email: 'joao.pedro@aluno.edu.br', schoolId: 'school-01', icon: <GraduationCap size={18} /> },
  { role: UserRole.RESPONSAVEL, name: 'Roberto Almeida', email: 'roberto.almeida@email.com', schoolId: 'school-01', icon: <UserCheck size={18} /> },
];

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogin = () => {
    if (!selectedRole) return;
    const demoUser = DEMO_USERS.find(u => u.role === selectedRole);
    if (demoUser) {
      onLogin({
        id: `user-${selectedRole.toLowerCase()}`,
        name: demoUser.name,
        email: demoUser.email,
        role: selectedRole,
        schoolId: demoUser.schoolId,
      });
    }
  };

  const selectedUser = DEMO_USERS.find(u => u.role === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-brand-dark to-brand-dark/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-brand-primary/30">
            <Building2 size={40} className="text-brand-dark" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">EduX</h1>
          <p className="text-brand-muted mt-2">Sistema de Gestão Educacional</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Bem-vindo</h2>
          <p className="text-brand-muted mb-6">Selecione seu perfil para acessar o sistema</p>

          {/* Dropdown de Seleção */}
          <div className="relative mb-6">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-brand-primary transition-colors"
            >
              <div className="flex items-center gap-3">
                {selectedUser && <span className="text-brand-dark">{selectedUser.icon}</span>}
                <span className={selectedRole ? 'text-brand-dark font-medium' : 'text-brand-muted'}>
                  {selectedRole ? UserRoleLabels[selectedRole] : 'Selecione o perfil de acesso'}
                </span>
              </div>
              <ChevronDown size={20} className={`text-brand-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden max-h-80 overflow-y-auto">
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.role}
                    onClick={() => {
                      setSelectedRole(user.role);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-brand-light transition-colors flex items-center gap-3 ${
                      selectedRole === user.role ? 'bg-brand-primary/10 text-brand-dark font-medium' : 'text-brand-dark'
                    }`}
                  >
                    <span className="text-brand-muted">{user.icon}</span>
                    <div>
                      <span className="font-medium">{UserRoleLabels[user.role]}</span>
                      <span className="text-sm text-brand-muted ml-2">({user.name})</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botão de Login */}
          <button
            onClick={handleLogin}
            disabled={!selectedRole}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              selectedRole
                ? 'bg-brand-dark text-white hover:bg-brand-dark/90 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <LogIn size={20} />
            Entrar no Sistema
          </button>

          {/* Informação */}
          <p className="text-center text-sm text-brand-muted mt-6">
            Ambiente de demonstração
          </p>
        </div>

        {/* Rodapé */}
        <p className="text-center text-brand-muted/60 text-sm mt-8">
          EduX Sistema de Gestão Educacional
        </p>
      </div>
    </div>
  );
};

export default LoginPage;