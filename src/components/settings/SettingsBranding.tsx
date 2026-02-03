import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { TenantConfig, DEFAULT_TENANT_CONFIG, applyTenantConfig } from '../../constants';
import { Palette, Image, Save, RotateCcw, Eye, Upload } from 'lucide-react';

interface SettingsBrandingProps {
  currentUser: User;
}

const SettingsBranding: React.FC<SettingsBrandingProps> = ({ currentUser }) => {
  const [config, setConfig] = useState<TenantConfig>(DEFAULT_TENANT_CONFIG);
  const [isSaving, setIsSaving] = useState(false);

  const handleColorChange = (key: keyof TenantConfig['colors'], value: string) => {
    setConfig(prev => ({ 
      ...prev, 
      colors: { ...prev.colors, [key]: value } 
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Aplica as configurações via CSS
    applyTenantConfig(config);
    setTimeout(() => {
      setIsSaving(false);
      alert('Configurações de branding salvas e aplicadas com sucesso!');
    }, 1000);
  };

  const handleReset = () => {
    setConfig(DEFAULT_TENANT_CONFIG);
    applyTenantConfig(DEFAULT_TENANT_CONFIG);
  };

  const handlePreview = () => {
    applyTenantConfig(config);
  };

  const colorLabels: Record<keyof TenantConfig['colors'], string> = {
    primary: 'Cor Primária',
    dark: 'Cor Escura',
    secondary: 'Cor Secundária',
    accent: 'Cor de Destaque',
    light: 'Cor Clara',
    success: 'Sucesso',
    warning: 'Alerta',
    danger: 'Erro',
    info: 'Informação',
    muted: 'Texto Secundário',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-dark tracking-tight">Sistema (Branding)</h1>
          <p className="text-brand-muted mt-1">Personalize a identidade visual da plataforma White Label</p>
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
            onClick={handlePreview}
            className="flex items-center gap-2 px-4 py-2 bg-brand-info text-white rounded-xl font-medium hover:bg-brand-info/90 transition-colors"
          >
            <Eye size={18} />
            Pré-visualizar
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
          <h2 className="text-xl font-black text-brand-dark">Identidade do Sistema</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-widest">
              Nome do Sistema
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
              placeholder="Nome exibido no sistema"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-widest">
              URL do Logo
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={config.logoUrl || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary"
                placeholder="https://exemplo.com/logo.png"
              />
              <button className="px-4 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <Upload size={18} className="text-brand-muted" />
              </button>
            </div>
          </div>
        </div>

        {config.logoUrl && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-2">Logo Atual</p>
            <img 
              src={config.logoUrl} 
              alt="Logo" 
              className="h-16 object-contain"
              onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
            />
          </div>
        )}
      </div>

      {/* Cores */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center">
            <Palette size={20} className="text-brand-primary" />
          </div>
          <h2 className="text-xl font-black text-brand-dark">Paleta de Cores (HSL)</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(Object.keys(config.colors) as Array<keyof TenantConfig['colors']>).map((key) => (
            <div key={key} className="space-y-2">
              <label className="text-xs font-bold text-brand-muted uppercase tracking-widest">
                {colorLabels[key]}
              </label>
              <div className="flex flex-col gap-2">
                <div
                  className="w-full h-12 rounded-xl border border-gray-200"
                  style={{ backgroundColor: `hsl(${config.colors[key]})` }}
                />
                <input
                  type="text"
                  value={config.colors[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-primary font-mono"
                  placeholder="H S% L%"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-brand-info/10 rounded-xl">
          <p className="text-sm text-brand-info flex items-center gap-2">
            <Eye size={16} />
            As cores devem ser especificadas no formato HSL (ex: 45 93% 52%). Clique em "Pré-visualizar" para testar as alterações.
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-brand-dark mb-6">Pré-visualização White Label</h2>
        
        <div className="p-6 bg-gray-50 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt="Logo" className="h-16 object-contain" />
            ) : (
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
                style={{ backgroundColor: `hsl(${config.colors.primary})` }}
              >
                {config.name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-2xl font-black" style={{ color: `hsl(${config.colors.dark})` }}>
                {config.name}
              </h3>
              <p className="text-sm" style={{ color: `hsl(${config.colors.muted})` }}>
                Sistema de Gestão Educacional
              </p>
            </div>
          </div>
          
          {/* Botões de exemplo */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
              style={{ backgroundColor: `hsl(${config.colors.primary})`, color: `hsl(${config.colors.dark})` }}
            >
              Botão Primário
            </button>
            <button 
              className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
              style={{ backgroundColor: `hsl(${config.colors.dark})` }}
            >
              Botão Escuro
            </button>
            <button 
              className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
              style={{ backgroundColor: `hsl(${config.colors.info})` }}
            >
              Botão Info
            </button>
          </div>
          
          {/* Badges de exemplo */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(config.colors) as Array<keyof TenantConfig['colors']>).map((key) => (
              <span
                key={key}
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ 
                  backgroundColor: `hsl(${config.colors[key]} / 0.2)`,
                  color: `hsl(${config.colors[key]})`
                }}
              >
                {colorLabels[key]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Info de ajuda */}
      <div className="bg-brand-warning/10 rounded-[2rem] p-6 border border-brand-warning/20">
        <h3 className="font-black text-brand-warning mb-2">Informações Importantes</h3>
        <ul className="space-y-1 text-sm text-brand-muted">
          <li>• As alterações de branding afetam toda a unidade escolar.</li>
          <li>• As cores são aplicadas em tempo real após clicar em "Pré-visualizar".</li>
          <li>• Recomenda-se usar logos com fundo transparente (PNG/SVG).</li>
          <li>• Para restaurar as cores padrão, clique em "Restaurar Padrão".</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsBranding;