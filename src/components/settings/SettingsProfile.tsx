import React from 'react';
import { User, UserRoleLabels } from '../../types';
import { User as UserIcon, Mail, Building2, Shield } from 'lucide-react';

interface SettingsProfileProps {
  currentUser: User;
}

const SettingsProfile: React.FC<SettingsProfileProps> = ({ currentUser }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-black text-brand-dark tracking-tight">Perfil</h1>
        <p className="text-brand-muted mt-1">Gerencie suas informações pessoais</p>
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-brand-primary rounded-2xl flex items-center justify-center">
            <UserIcon size={40} className="text-brand-dark" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-brand-dark">{currentUser.name}</h2>
            <p className="text-brand-muted">{UserRoleLabels[currentUser.role]}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-widest flex items-center gap-2">
              <Mail size={14} />
              Email
            </label>
            <input
              type="email"
              value={currentUser.email}
              disabled
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-widest flex items-center gap-2">
              <Shield size={14} />
              Perfil de Acesso
            </label>
            <input
              type="text"
              value={UserRoleLabels[currentUser.role]}
              disabled
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark"
            />
          </div>

          {currentUser.schoolId && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-muted uppercase tracking-widest flex items-center gap-2">
                <Building2 size={14} />
                Unidade
              </label>
              <input
                type="text"
                value={currentUser.schoolId}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-dark"
              />
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-brand-info/10 rounded-xl">
          <p className="text-sm text-brand-info">
            Para alterar suas informações de perfil, entre em contato com o administrador do sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfile;