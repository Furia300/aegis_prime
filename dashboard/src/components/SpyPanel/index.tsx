import React, { useState } from 'react';
import { FileAudio, Image as ImageIcon, Keyboard, Clock, Play, Download, Trash2, Mic, FolderLock } from 'lucide-react';

const SpyPanel = () => {
  const [activeTab, setActiveTab] = useState<'keylogger' | 'media' | 'schedule'>('keylogger');
  const keylogs: Array<{ id: string; app: string; text: string; time: string; isAudio?: boolean }> = [];
  const media: Array<{ id: string; type: string; name: string; size: string; time: string }> = [];

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-primary overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border-color bg-bg-secondary flex justify-between items-center">
        <div>
          <h2 className="text-xl font-tactical font-bold text-accent-red flex items-center gap-2">
            <FolderLock className="animate-pulse" />
            DEEP SURVEILLANCE
          </h2>
          <p className="text-xs font-mono text-text-secondary">
            Acesso a dados brutos e arquivos ocultos
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('keylogger')}
            className={`px-3 py-1.5 rounded text-xs font-bold font-tactical transition-colors ${activeTab === 'keylogger' ? 'bg-accent-blue text-bg-primary' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'}`}
          >
            KEYLOGGER
          </button>
          <button 
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1.5 rounded text-xs font-bold font-tactical transition-colors ${activeTab === 'media' ? 'bg-accent-blue text-bg-primary' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'}`}
          >
            ARQUIVOS & MÍDIA
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded text-xs font-bold font-tactical transition-colors ${activeTab === 'schedule' ? 'bg-accent-blue text-bg-primary' : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'}`}
          >
            AGENDAMENTOS
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        
        {/* KEYLOGGER VIEW */}
        {activeTab === 'keylogger' && (
          <div className="h-full flex flex-col gap-4">
            <div className="bg-bg-tertiary p-3 rounded border border-border-color flex justify-between items-center">
               <span className="text-xs font-mono text-text-secondary">
                 Status do Keylogger: <span className="text-text-muted font-bold">INATIVO</span>
               </span>
               <button className="text-xs text-accent-red border border-accent-red px-2 py-1 rounded hover:bg-accent-red/10">
                 LIMPAR LOGS
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
              {keylogs.length === 0 ? (
                <div className="p-6 text-sm text-text-secondary font-mono">
                  Sem dados recebidos.
                </div>
              ) : keylogs.map(log => (
                <div key={log.id} className="bg-bg-secondary p-3 rounded border-l-2 border-l-accent-blue hover:bg-bg-tertiary transition-colors">
                  <div className="flex justify-between text-xs text-text-muted mb-1 font-mono">
                    <span className="flex items-center gap-1">
                      {log.isAudio ? <Mic size={10} /> : <Keyboard size={10} />}
                      {log.app}
                    </span>
                    <span>{log.time}</span>
                  </div>
                  <p className={`text-sm ${log.isAudio ? 'text-accent-yellow italic' : 'text-text-primary font-mono'}`}>
                    {log.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEDIA VIEW */}
        {activeTab === 'media' && (
          <div className="h-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {media.length === 0 ? (
                <div className="p-6 text-sm text-text-secondary font-mono bg-bg-secondary border border-border-color rounded">
                  Sem dados recebidos.
                </div>
              ) : media.map(file => (
                <div key={file.id} className="bg-bg-secondary p-3 rounded border border-border-color group hover:border-accent-blue transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className={`p-2 rounded bg-bg-primary ${file.type.includes('audio') ? 'text-accent-yellow' : 'text-accent-blue'}`}>
                      {file.type.includes('audio') ? <FileAudio size={20} /> : <ImageIcon size={20} />}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:text-accent-green"><Play size={14} /></button>
                      <button className="p-1 hover:text-accent-blue"><Download size={14} /></button>
                      <button className="p-1 hover:text-accent-red"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-text-primary truncate mb-1">{file.name}</h4>
                  <div className="flex justify-between text-[10px] text-text-muted font-mono">
                    <span className="uppercase">{file.type.replace('_', ' ')}</span>
                    <span>{file.size} • {file.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE VIEW */}
        {activeTab === 'schedule' && (
          <div className="h-full flex flex-col gap-4">
             <div className="bg-bg-tertiary p-4 rounded border border-border-color">
                <h3 className="text-sm font-bold text-accent-yellow mb-4 font-tactical uppercase flex items-center gap-2">
                  <Clock size={16} />
                  NOVA REGRA DE GRAVAÇÃO AUTOMÁTICA
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Tipo de Captura</label>
                    <select className="w-full bg-bg-primary border border-border-color rounded p-2 text-xs text-text-primary">
                      <option>Gravar Áudio Ambiente</option>
                      <option>Tirar Screenshot</option>
                      <option>Foto Câmera Frontal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Intervalo</label>
                    <select className="w-full bg-bg-primary border border-border-color rounded p-2 text-xs text-text-primary">
                      <option>A cada 5 minutos</option>
                      <option>A cada 15 minutos</option>
                      <option>A cada 30 minutos</option>
                      <option>A cada 1 hora</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Duração (se áudio)</label>
                    <select className="w-full bg-bg-primary border border-border-color rounded p-2 text-xs text-text-primary">
                      <option>10 segundos</option>
                      <option>30 segundos</option>
                      <option>1 minuto</option>
                      <option>5 minutos</option>
                    </select>
                  </div>
                </div>
                
                <button className="w-full py-2 bg-accent-green/20 border border-accent-green text-accent-green rounded font-bold font-tactical hover:bg-accent-green/30 transition-colors">
                  ATIVAR CRONOGRAMA
                </button>
             </div>

             <div className="flex-1">
               <h3 className="text-xs font-bold text-text-secondary mb-2 uppercase">Regras Ativas</h3>
               <div className="space-y-2">
                 <div className="p-4 text-sm text-text-secondary font-mono bg-bg-secondary border border-border-color rounded">
                   Sem dados recebidos.
                 </div>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SpyPanel;
