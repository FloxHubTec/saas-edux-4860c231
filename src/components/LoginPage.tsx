import React, { useState } from 'react';
import { User, UserRole, UserRoleLabels } from '../types';
import { Building2, LogIn, Eye, EyeOff, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { auditService } from '../services/auditService';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

// Dados de demonstração com CPF
const DEMO_CREDENTIALS: { cpf: string; password: string; user: Omit<User, 'id'> }[] = [
  { cpf: '000.000.000-00', password: 'SuperAdm@2024', user: { name: 'Administrador do Sistema', email: 'superadm@edux.com', role: UserRole.SUPER_ADM } },
  { cpf: '111.111.111-11', password: 'Diretoria@2024', user: { name: 'Maria Silva', email: 'diretoria@emjbs.edu.br', role: UserRole.DIRETORIA, schoolId: 'school-01' } },
  { cpf: '222.222.222-22', password: 'Coordenador@2024', user: { name: 'Carlos Souza', email: 'coordenador@emjbs.edu.br', role: UserRole.COORDENADOR, schoolId: 'school-01' } },
  { cpf: '333.333.333-33', password: 'Professor@2024', user: { name: 'Ana Costa', email: 'ana.costa@emjbs.edu.br', role: UserRole.PROFESSOR, schoolId: 'school-01' } },
  { cpf: '444.444.444-44', password: 'Secretaria@2024', user: { name: 'Paula Santos', email: 'secretaria@emjbs.edu.br', role: UserRole.SECRETARIO, schoolId: 'school-01' } },
  { cpf: '555.555.555-55', password: 'Aluno@2024', user: { name: 'João Pedro', email: 'joao.pedro@aluno.edu.br', role: UserRole.ALUNO, schoolId: 'school-01' } },
  { cpf: '666.666.666-66', password: 'Responsavel@2024', user: { name: 'Roberto Almeida', email: 'roberto.almeida@email.com', role: UserRole.RESPONSAVEL, schoolId: 'school-01' } },
];

// Validação de CPF
const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const isValidCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '');
  return numbers.length === 11;
};

// Validação de complexidade de senha
interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

const validatePassword = (password: string): PasswordValidation => ({
  minLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasLowercase: /[a-z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
});

const isPasswordValid = (validation: PasswordValidation): boolean => {
  return Object.values(validation).every(v => v);
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordValidation = validatePassword(password);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidCPF(cpf)) {
      setError('CPF inválido. Digite os 11 dígitos.');
      return;
    }

    if (!isPasswordValid(passwordValidation)) {
      setError('Senha não atende aos requisitos de segurança.');
      return;
    }

    setIsLoading(true);

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 800));

    const credential = DEMO_CREDENTIALS.find(
      c => c.cpf === cpf && c.password === password
    );

    if (credential) {
      const user: User = {
        id: `user-${credential.user.role.toLowerCase()}-${Date.now()}`,
        ...credential.user,
      };

      // Registrar login na auditoria
      auditService.log(
        user,
        'Login no Sistema',
        'Session',
        user.id,
        null,
        { timestamp: new Date().toISOString() },
        `Acesso realizado com sucesso. Perfil: ${UserRoleLabels[user.role]}`
      );

      onLogin(user);
    } else {
      setError('CPF ou senha incorretos.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (credential: typeof DEMO_CREDENTIALS[0]) => {
    setCpf(credential.cpf);
    setPassword(credential.password);
    setShowDemo(false);
  };

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
          <div className="flex items-center gap-2 mb-6">
            <Shield size={24} className="text-brand-primary" />
            <div>
              <h2 className="text-2xl font-bold text-brand-dark">Acesso Seguro</h2>
              <p className="text-brand-muted text-sm">Autenticação por CPF</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo CPF */}
            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
                CPF
              </label>
              <input
                type="text"
                value={cpf}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary transition-colors"
                maxLength={14}
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Validação de Senha */}
            {password && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">
                  Requisitos de Segurança
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-brand-success' : 'text-brand-muted'}`}>
                    <CheckCircle2 size={12} />
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? 'text-brand-success' : 'text-brand-muted'}`}>
                    <CheckCircle2 size={12} />
                    <span>Letra maiúscula</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordValidation.hasLowercase ? 'text-brand-success' : 'text-brand-muted'}`}>
                    <CheckCircle2 size={12} />
                    <span>Letra minúscula</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-brand-success' : 'text-brand-muted'}`}>
                    <CheckCircle2 size={12} />
                    <span>Número</span>
                  </div>
                  <div className={`flex items-center gap-1 ${passwordValidation.hasSpecial ? 'text-brand-success' : 'text-brand-muted'}`}>
                    <CheckCircle2 size={12} />
                    <span>Caractere especial</span>
                  </div>
                </div>
              </div>
            )}

            {/* Erro */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading || !cpf || !password}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                isLoading || !cpf || !password
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-brand-dark text-white hover:bg-brand-dark/90 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Entrar no Sistema
                </>
              )}
            </button>
          </form>

          {/* Botão Demo */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="w-full text-center text-sm text-brand-muted hover:text-brand-dark transition-colors"
            >
              {showDemo ? 'Ocultar credenciais de demonstração' : 'Ver credenciais de demonstração'}
            </button>

            {showDemo && (
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {DEMO_CREDENTIALS.map((cred, index) => (
                  <button
                    key={index}
                    onClick={() => handleDemoLogin(cred)}
                    className="w-full p-3 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-medium text-brand-dark text-sm">{UserRoleLabels[cred.user.role]}</p>
                    <p className="text-xs text-brand-muted">CPF: {cred.cpf}</p>
                    <p className="text-xs text-brand-muted">Senha: {cred.password}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
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