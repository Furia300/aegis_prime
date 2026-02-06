import React, { useState, useEffect } from 'react';
import { X, Globe, Check, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  // Sync state when modal opens or language changes externally
  useEffect(() => {
    if (isOpen) {
      // Normalize i18n.language (e.g., 'pt-BR' -> 'pt') if needed, 
      // but our supported list uses simple codes usually. 
      // We check if the exact code exists, otherwise try to match prefix.
      const current = i18n.language;
      const exactMatch = SUPPORTED_LANGUAGES.find(l => l.code === current);
      if (exactMatch) {
        setSelectedLang(current);
      } else {
        const prefixMatch = SUPPORTED_LANGUAGES.find(l => current.startsWith(l.code));
        setSelectedLang(prefixMatch ? prefixMatch.code : 'en');
      }
    }
  }, [isOpen, i18n.language]);

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    i18n.changeLanguage(selectedLang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[600px] h-[80vh] bg-bg-secondary border border-border-color shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-border-color flex justify-between items-center bg-bg-tertiary">
          <div className="flex items-center gap-2 text-accent-blue">
            <Globe size={20} />
            <h2 className="text-lg font-tactical font-bold tracking-wider">{t('settings.title')}</h2>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-accent-red transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          <h3 className="text-sm font-mono text-text-secondary mb-4 uppercase tracking-widest border-b border-border-color pb-2">
            {t('settings.select_language')} ({SUPPORTED_LANGUAGES.length})
          </h3>

          <input 
            type="text" 
            placeholder="Search language / Buscar idioma..." 
            className="w-full bg-bg-primary border border-border-color p-3 mb-4 text-text-primary font-mono text-sm focus:border-accent-blue focus:outline-none transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-2 gap-2 content-start">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`
                  flex items-center justify-between p-3 border text-left transition-all
                  ${selectedLang === lang.code 
                    ? 'bg-accent-blue/10 border-accent-blue text-accent-blue' 
                    : 'bg-bg-primary border-border-color text-text-secondary hover:border-text-secondary hover:text-text-primary'}
                `}
              >
                <div className="flex flex-col">
                  <span className="font-bold font-tactical text-sm">{lang.nativeName}</span>
                  <span className="text-xs font-mono opacity-70">{lang.name}</span>
                </div>
                {selectedLang === lang.code && <Check size={16} />}
              </button>
            ))}
            
            {filteredLanguages.length === 0 && (
                <div className="col-span-2 text-center text-text-muted py-8 font-mono text-sm">
                    No language found.
                </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-color bg-bg-tertiary flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary font-tactical transition-colors"
          >
            {t('settings.close')}
          </button>
          
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-accent-blue text-bg-primary font-bold font-tactical tracking-widest hover:bg-blue-400 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            {t('settings.save') || 'SALVAR'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
