import React, { useState } from 'react';
import { Shield, Bell, Settings, User, Radio } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SettingsModal from '../SettingsModal';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-bg-secondary border-b border-border-color flex items-center justify-between px-6 shadow-lg z-50 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-accent-red animate-pulse-slow">
            <Shield size={32} />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold leading-none tracking-wider font-tactical text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-red-800">
                {t('app.title')}
              </h1>
              <span className="text-xs text-text-secondary tracking-[0.2em] uppercase font-mono">
                {t('app.subtitle')}
              </span>
            </div>
          </div>
          
          <div className="h-8 w-px bg-border-color mx-2" />
          
          <div className="flex items-center gap-6 text-sm font-mono text-text-secondary hidden xl:flex">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span>{t('app.status')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-accent-blue" />
              <span>{t('app.encrypted')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent-yellow">{t('app.threat_level')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-text-secondary hover:text-accent-blue transition-colors relative group">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full animate-ping" />
            <div className="absolute top-full right-0 mt-2 w-48 bg-bg-tertiary border border-border-color p-2 hidden group-hover:block text-xs z-50 shadow-xl">
               {t('app.no_alerts')}
            </div>
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-text-secondary hover:text-accent-blue transition-colors"
          >
            <Settings size={20} />
          </button>
          <div className="h-8 w-px bg-border-color" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-bold text-text-primary font-tactical">{t('app.operator')}</div>
              <div className="text-xs text-accent-blue font-mono">{t('app.operator_id')}</div>
            </div>
            <div className="w-10 h-10 rounded bg-bg-tertiary border border-border-color flex items-center justify-center text-accent-blue shadow-[0_0_10px_rgba(0,212,255,0.2)]">
              <User size={20} />
            </div>
          </div>
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Header;
