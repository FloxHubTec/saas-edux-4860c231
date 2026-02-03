import React, { useState } from 'react';
import { UserRole, User, UserRoleLabels } from '../types';
import { MOCK_SCHOOLS } from '../constants';
import { useIsMobile } from '../hooks/use-mobile';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  ClipboardList,
  CheckSquare,
  GraduationCap,
  Users,
  UserCog,
  ArrowLeftRight,
  Bus,
  Calendar,
  Link2,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Building2,
  Palette,
} from 'lucide-react';

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
  icon: React.ReactNode;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Painel', icon: <LayoutDashboard size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA, UserRole.COORDENADOR, UserRole.SECRETARIO] },
  { id: 'grading_management', label: 'Lançamentos', icon: <FileText size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA, UserRole.COORDENADOR, UserRole.SECRETARIO, UserRole.PROFESSOR] },
  { id: 'diary', label: 'Diário de Classe', icon: <BookOpen size={20} />, roles: [UserRole.PROFESSOR] },
  { id: 'lesson_plan', label: 'Plano de Aula', icon: <ClipboardList size={20} />, roles: [UserRole.PROFESSOR] },
  { id: 'grading', label: 'Correção Automática', icon: <CheckSquare size={20} />, roles: [UserRole.PROFESSOR] },
  { id: 'student_portal', label: 'Portal do Aluno', icon: <GraduationCap size={20} />, roles: [UserRole.ALUNO] },
  { id: 'guardian_portal', label: 'Portal do Responsável', icon: <Users size={20} />, roles: [UserRole.RESPONSAVEL] },
  { id: 'enrollment_manager', label: 'Matrículas', icon: <FileText size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA, UserRole.SECRETARIO] },
  { id: 'professor_manager', label: 'Professores', icon: <UserCog size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA, UserRole.COORDENADOR] },
  { id: 'transfer_manager', label: 'Transferências', icon: <ArrowLeftRight size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA, UserRole.SECRETARIO] },
  { id: 'transport', label: 'Transporte', icon: <Bus size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA, UserRole.SECRETARIO, UserRole.ALUNO, UserRole.RESPONSAVEL] },
  { id: 'calendar_letivo', label: 'Calendário', icon: <Calendar size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA, UserRole.COORDENADOR, UserRole.SECRETARIO, UserRole.PROFESSOR] },
  { id: 'idep_integration', label: 'IDEP', icon: <Link2 size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA] },
  { id: 'audit', label: 'Auditoria', icon: <Shield size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA] },
];

const SETTINGS_ITEMS: NavItem[] = [
  { id: 'settings_profile', label: 'Perfil', icon: <UserIcon size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA] },
  { id: 'settings_users', label: 'Usuários', icon: <Users size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA] },
  { id: 'settings_branding', label: 'Sistema (Branding)', icon: <Palette size={20} />, roles: [UserRole.SUPER_ADM, UserRole.DIRETORIA] },
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, onLogout, selectedSchoolId, currentUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const filteredNavItems = NAV_ITEMS.filter(item => item.roles.includes(userRole));
  const filteredSettingsItems = SETTINGS_ITEMS.filter(item => item.roles.includes(userRole));
  const currentSchool = MOCK_SCHOOLS.find(s => s.id === selectedSchoolId);
  const showSettings = userRole === UserRole.SUPER_ADM || userRole === UserRole.DIRETORIA;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobile) setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-brand-dark font-black text-xl shadow-lg">
            <Building2 size={24} />
          </div>
          {(sidebarOpen || isMobile) && (
            <div>
              <h1 className="text-2xl font-black tracking-tight">EduX</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Gestão Educacional</p>
            </div>
          )}
        </div>
      </div>

      {/* Informações do Usuário */}
      {(sidebarOpen || isMobile) && (
        <div className="p-4 border-b border-white/10">
          <div className="bg-white/5 rounded-2xl p-4">
            <p className="font-bold text-sm truncate">{currentUser.name}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
              {UserRoleLabels[userRole]}
            </p>
            {currentSchool && (
              <p className="text-[9px] text-brand-primary mt-2 truncate">{currentSchool.name}</p>
            )}
          </div>
        </div>
      )}

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-brand-primary text-brand-dark font-bold shadow-lg'
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            {(sidebarOpen || isMobile) && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}

        {/* Menu de Configurações */}
        {showSettings && (
          <div className="pt-4 border-t border-white/10 mt-4">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab.startsWith('settings_')
                  ? 'bg-brand-primary text-brand-dark font-bold shadow-lg'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings size={20} />
              {(sidebarOpen || isMobile) && (
                <>
                  <span className="text-sm font-medium flex-1 text-left">Configurações</span>
                  <ChevronRight size={16} className={`transition-transform ${settingsOpen ? 'rotate-90' : ''}`} />
                </>
              )}
            </button>
            
            {settingsOpen && (sidebarOpen || isMobile) && (
              <div className="ml-4 mt-2 space-y-1">
                {filteredSettingsItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                      activeTab === item.id
                        ? 'bg-brand-primary/20 text-brand-primary font-medium'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-white/10">
        {!isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all mb-2"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            {sidebarOpen && <span className="text-sm">Recolher</span>}
          </button>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
        >
          <LogOut size={20} />
          {(sidebarOpen || isMobile) && <span className="text-sm font-medium">Sair</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Overlay Mobile */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Desktop */}
      {!isMobile && (
        <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-brand-dark text-white transition-all duration-300 flex flex-col fixed h-full z-40`}>
          <SidebarContent />
        </aside>
      )}

      {/* Sidebar Mobile */}
      {isMobile && (
        <aside className={`fixed inset-y-0 left-0 w-72 bg-brand-dark text-white flex flex-col z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
          <SidebarContent />
        </aside>
      )}

      {/* Conteúdo Principal */}
      <main className={`flex-1 ${!isMobile ? (sidebarOpen ? 'ml-72' : 'ml-20') : ''} transition-all duration-300`}>
        {/* Header Mobile com Nome da Escola */}
        {isMobile && (
          <header className="bg-brand-dark text-white p-4 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-brand-primary" />
                <span className="font-bold text-sm">EduX</span>
              </div>
              {currentSchool && (
                <span className="text-[10px] text-brand-primary truncate max-w-[180px]">
                  {currentSchool.name}
                </span>
              )}
            </div>
            <div className="w-10" />
          </header>
        )}
        
        {/* Header Desktop com Nome da Escola */}
        {!isMobile && currentSchool && (
          <header className="bg-white border-b border-gray-100 px-8 py-3 flex items-center gap-3">
            <Building2 size={18} className="text-brand-primary" />
            <span className="font-bold text-brand-dark">{currentSchool.name}</span>
            <span className="text-xs text-brand-muted px-2 py-1 bg-brand-light rounded-full">
              Unidade Ativa
            </span>
          </header>
        )}
        
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;