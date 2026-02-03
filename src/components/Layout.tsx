import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { MOCK_SCHOOLS } from '../constants';
import SchoolSelector from './SchoolSelector';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onLogout: () => void;
  selectedSchoolId: string;
  currentUser: User;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: [UserRole.ADMIN, UserRole.SECRETARY] },
  { id: 'grading_management', label: 'Lançamentos', icon: '📝', roles: [UserRole.ADMIN, UserRole.SECRETARY, UserRole.PROFESSOR] },
  { id: 'diary', label: 'Diário de Classe', icon: '📓', roles: [UserRole.PROFESSOR] },
  { id: 'lesson_plan', label: 'Plano de Aula', icon: '📋', roles: [UserRole.PROFESSOR] },
  { id: 'grading', label: 'Correção Automática', icon: '✅', roles: [UserRole.PROFESSOR] },
  { id: 'student_portal', label: 'Portal do Aluno', icon: '🎓', roles: [UserRole.STUDENT] },
  { id: 'enrollment_manager', label: 'Matrículas', icon: '📝', roles: [UserRole.ADMIN, UserRole.SECRETARY] },
  { id: 'professor_manager', label: 'Professores', icon: '👨‍🏫', roles: [UserRole.ADMIN, UserRole.SECRETARY] },
  { id: 'transfer_manager', label: 'Transferências', icon: '🔄', roles: [UserRole.ADMIN, UserRole.SECRETARY] },
  { id: 'transport', label: 'Transporte', icon: '🚌', roles: [UserRole.ADMIN, UserRole.SECRETARY] },
  { id: 'calendar_letivo', label: 'Calendário', icon: '📅', roles: [UserRole.ADMIN, UserRole.SECRETARY, UserRole.PROFESSOR] },
  { id: 'idep_integration', label: 'IDEP', icon: '🔗', roles: [UserRole.ADMIN] },
  { id: 'audit', label: 'Auditoria', icon: '🔒', roles: [UserRole.ADMIN] },
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, onLogout, selectedSchoolId, currentUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));
  const currentSchool = MOCK_SCHOOLS.find(s => s.id === selectedSchoolId);

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-brand-dark text-white transition-all duration-300 flex flex-col fixed h-full z-40`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center text-brand-dark font-black text-xl shadow-lg">
              E
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-2xl font-black tracking-tight">EduX</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Gestão Educacional</p>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-4 border-b border-white/10">
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="font-bold text-sm truncate">{currentUser.name}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                {userRole === UserRole.ADMIN ? 'Administrador' : 
                 userRole === UserRole.SECRETARY ? 'Secretaria' :
                 userRole === UserRole.PROFESSOR ? 'Professor' : 'Aluno'}
              </p>
              {currentSchool && (
                <p className="text-[9px] text-brand-yellow mt-2 truncate">{currentSchool.name}</p>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-brand-yellow text-brand-dark font-bold shadow-lg shadow-brand-yellow/20'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all mb-2"
          >
            <span>{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span className="text-sm">Recolher</span>}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
          >
            <span>🚪</span>
            {sidebarOpen && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
