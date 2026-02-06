import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Hash, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';

interface PairingModalProps {
  onClose: () => void;
}

type PairingStrategy = 'manual' | 'download';

export const PairingModal: React.FC<PairingModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [activeStrategy, setActiveStrategy] = useState<PairingStrategy>('manual');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [userId, setUserId] = useState<string | null>(null);
  const [pairing, setPairing] = useState<{ code: string; deviceId: string; token: string; apiUrl: string; userId: string | null } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        const resp = await fetch(`/api/new-pairing?user_id=${encodeURIComponent(userId || '')}`);
        const json = await resp.json();
        if (!resp.ok) return;
        setPairing(json);
      } catch {
        setPairing(null);
      }
    };

    run();
  }, [userId]);

  const downloadUrl = `${window.location.origin}/api/download-apk.html`;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary border border-accent-blue/30 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-border-color flex items-center justify-between bg-bg-tertiary/50">
          <h2 className="text-lg font-bold font-tactical tracking-wider text-white flex items-center gap-2">
            <Smartphone className="text-accent-blue" />
            {t('pairing.title') || 'CONECTAR DISPOSITIVO'}
          </h2>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-color overflow-x-auto">
          <TabButton
            active={activeStrategy === 'download'}
            onClick={() => setActiveStrategy('download')}
            icon={<Download size={18} />}
            label="DOWNLOAD APP"
          />
          <TabButton
            active={activeStrategy === 'manual'}
            onClick={() => setActiveStrategy('manual')}
            icon={<Hash size={18} />}
            label="CÓDIGO MANUAL"
          />
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          
          {activeStrategy === 'download' && (
             <div className="flex flex-col items-center justify-center space-y-6">
               <div className="bg-white p-4 rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                 <QRCodeSVG 
                   value={downloadUrl} 
                   size={200} 
                   level="H"
                   includeMargin={true}
                 />
               </div>
               <div className="text-center space-y-4">
                 <p className="text-text-primary font-bold text-lg">Baixar Aegis Prime APK</p>
                 <p className="text-text-secondary text-sm max-w-xs mx-auto">
                   Escaneie com a câmera do celular para baixar o aplicativo.
                 </p>
                 <a
                    href={`${window.location.origin}/aegis-prime.apk`}
                    download="aegis-prime.apk"
                    className="inline-flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/80 text-black font-bold py-3 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                 >
                    <Download size={20} />
                    BAIXAR AGORA
                 </a>
                 <p className="text-xs text-text-secondary opacity-70">
                    Versão: 3.1.8-FINAL • Tamanho: 13MB
                 </p>
               </div>
             </div>
          )}


          {activeStrategy === 'manual' && (
            <div className="flex flex-col items-center justify-center space-y-8 py-8">
              <div className="text-center space-y-4">
                <p className="text-text-secondary text-sm uppercase tracking-wider font-bold">CÓDIGO DE PAREAMENTO</p>
                <div className="bg-bg-primary border-2 border-accent-blue rounded-xl p-6">
                  <div className="text-6xl font-mono font-bold text-accent-blue tracking-[0.3em] animate-pulse">
                    {pairing?.code || '------'}
                  </div>
                </div>
                <div className="text-left bg-bg-tertiary/50 border border-border-color rounded-lg p-6 max-w-md space-y-3">
                  <p className="text-text-primary font-bold text-sm flex items-center gap-2">
                    <span className="bg-accent-blue text-black rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                    Baixe e instale o APK (aba "DOWNLOAD APP")
                  </p>
                  <p className="text-text-primary font-bold text-sm flex items-center gap-2">
                    <span className="bg-accent-blue text-black rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                    Abra o app Aegis Prime no celular
                  </p>
                  <p className="text-text-primary font-bold text-sm flex items-center gap-2">
                    <span className="bg-accent-blue text-black rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                    Digite o código acima e clique em CONNECT
                  </p>
                </div>
              </div>
            </div>
          )}


        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-color bg-bg-primary/50 flex justify-between items-center text-xs font-mono text-text-secondary">
          <div className="flex items-center gap-2">
            <span>{t('pairing.expires_in')}</span>
            <span className={`font-bold ${timeLeft < 300 ? 'text-accent-red' : 'text-accent-green'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div>{t('pairing.id')}: {pairing?.deviceId ? `${pairing.deviceId.substring(0, 8)}...` : '—'}</div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`
      flex-1 flex flex-col items-center justify-center gap-2 py-3 px-2 transition-all relative min-w-[80px]
      ${active 
        ? 'text-accent-blue bg-accent-blue/5' 
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'}
    `}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    {active && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-blue shadow-[0_0_8px_#00d4ff]" />
    )}
  </button>
);
