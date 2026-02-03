import React, { useState } from 'react';
import { User, UserRole, UserRoleLabels } from '../../types';
import { Users, Plus, Search, Edit2, Trash2, Shield, Mail, Building2 } from 'lucide-react';

interface SettingsUsersProps {
  currentUser: User;
}

const MOCK_SYSTEM_USERS = [
  { id: '1', name: 'Administrador do Sistema', email: 'superadm@edux.com', role: UserRole.SUPER_ADM, status: 'ativo' },
  { id: '2', name: 'Maria Silva', email: 'diretoria@emjbs.edu.br', role: UserRole.DIRETORIA, schoolId: 'school-01', status: 'ativo' },
  { id: '3', name: 'Carlos Souza', email: 'coordenador@emjbs.edu.br', role: UserRole.COORDENADOR, schoolId: 'school-01', status: 'ativo' },
  { id: '4', name: 'Ana Costa', email: 'ana.costa@emjbs.edu.br', role: UserRole.PROFESSOR, schoolId: 'school-01', status: 'ativo' },
  { id: '5', name: 'Paula Santos', email: 'secretaria@emjbs.edu.br', role: UserRole.SECRETARIO, schoolId: 'school-01', status: 'ativo' },
];

const SettingsUsers: React.FC<SettingsUsersProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');

  const filteredUsers = MOCK_SYSTEM_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Usuários</h1>
          <p className="text-brand-muted mt-1">Gerencie os usuários do sistema</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-dark/90 transition-colors">
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
          >
            <option value="all">Todos os perfis</option>
            {Object.entries(UserRoleLabels).map(([role, label]) => (
              <option key={role} value={role}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase tracking-widest">Usuário</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase tracking-widest">Perfil</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase tracking-widest">Unidade</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-brand-muted uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-primary/20 rounded-full flex items-center justify-center">
                        <Users size={18} className="text-brand-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark">{user.name}</p>
                        <p className="text-sm text-brand-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-info/10 text-brand-info text-xs font-bold rounded-full">
                      <Shield size={12} />
                      {UserRoleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.schoolId ? (
                      <span className="text-brand-dark">{user.schoolId}</span>
                    ) : (
                      <span className="text-brand-muted">Todas</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 bg-brand-success/10 text-brand-success text-xs font-bold rounded-full">
                      Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 size={16} className="text-brand-muted" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} className="text-brand-danger" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingsUsers;