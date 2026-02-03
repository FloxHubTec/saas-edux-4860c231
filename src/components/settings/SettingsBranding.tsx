import React, { useState } from 'react';
import { User } from '../../types';
import { Palette, Image, Save, RotateCcw, Eye } from 'lucide-react';

interface SettingsBrandingProps {
  currentUser: User;
}

const DEFAULT_COLORS = {
  primary: '45 93% 52%',
  dark: '240 17% 14%',
  secondary: '220 14% 40%',
  accent: '220 90% 56%',
  success: '160 84% 39%',
  warning: '38 92% 50%',
  danger: '0 84% 60%',
  info: '217 91% 60%',
};

const SettingsBranding: React.FC<SettingsBrandingProps> = ({ currentUser }) => {
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [logoUrl, setLogoUrl] = useState('');
  const [systemName, setSystemName] = useState('EduX');
  const [isSaving, setIsSaving] = useState(false);

  const handleColorChange = (key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simula salvamento
    setTimeout(() => {
      setIsSaving(false);
      alert('Configurações de branding salvas com sucesso!');
    }, 1000);
  };

  const handleReset = () => {
    setColors(DEFAULT_COLORS);
    setLogoUrl('');
    setSystemName('EduX');
  };

  const colorLabels: Record<string, string> = {
    primary: 'Cor Primária',
    dark: 'Cor Escura',
    secondary: 'Cor Secundária',
    accent: 'Cor de Destaque',
    success: 'Sucesso',
    warning: 'Alerta',
    danger: 'Erro',
    info: 'Informação',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Sistema (Branding)</h1>
          <p className="text-brand-muted mt-1">Personalize a identidade visual da plataforma</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={18} />
            Restaurar Padrão
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-dark/90 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Identidade */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center">
            <Image size={20} className="text-brand-primary" />
          </div>
          <h2 className="text-xl font-black text-brand-dark">Identidade</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-widest">
              Nome do Sistema
            </label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
              placeholder="Nome exibido no sistema"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-widest">
              URL do Logo
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
              placeholder="https://exemplo.com/logo.png"
            />
          </div>
        </div>
      </div>

      {/* Cores */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center">
            <Palette size={20} className="text-brand-primary" />
          </div>
          <h2 className="text-xl font-black text-brand-dark">Paleta de Cores</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-xs font-bold text-brand-muted uppercase tracking-widest">
                {colorLabels[key]}
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-12 h-12 rounded-xl border border-gray-200"
                  style={{ backgroundColor: `hsl(${value})` }}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary"
                  placeholder="HSL"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-brand-info/10 rounded-xl">
          <p className="text-sm text-brand-info flex items-center gap-2">
            <Eye size={16} />
            As cores devem ser especificadas no formato HSL (ex: 45 93% 52%)
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-brand-dark mb-6">Pré-visualização</h2>
        
        <div className="p-6 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
              style={{ backgroundColor: `hsl(${colors.primary})` }}
            >
              {systemName.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-black" style={{ color: `hsl(${colors.dark})` }}>
                {systemName}
              </h3>
              <p className="text-sm" style={{ color: `hsl(${colors.secondary})` }}>
                Sistema de Gestão Educacional
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(colors).map(([key, value]) => (
              <span
                key={key}
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: `hsl(${value})` }}
              >
                {colorLabels[key]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsBranding;