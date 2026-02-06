import React from 'react';
import { MessageSquare, Search, Download, Filter, User } from 'lucide-react';

const SocialMessages = () => {
  const messages: Array<{ id: string; app: string; contact: string; message: string; type: string; time: string; unread: boolean }> = [];

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-accent-blue flex items-center gap-2">
            <MessageSquare className="animate-pulse" />
            REDES SOCIAIS & MENSAGENS
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Interceptação de 14+ aplicativos de mensagens
          </p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-border-color rounded hover:bg-bg-secondary transition-colors text-xs font-bold font-tactical">
            <Filter size={14} /> FILTRAR APP
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 border border-accent-blue text-accent-blue rounded hover:bg-accent-blue/30 transition-colors text-xs font-bold font-tactical">
            <Download size={14} /> EXPORTAR CHAT
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-lg border border-border-color flex-1 flex overflow-hidden">
        {/* Sidebar List */}
        <div className="w-1/3 border-r border-border-color flex flex-col">
           <div className="p-3 border-b border-border-color bg-bg-tertiary/50">
             <div className="relative">
               <Search size={14} className="absolute left-2 top-2.5 text-text-muted" />
               <input 
                 type="text" 
                 placeholder="Buscar conversas..." 
                 className="w-full bg-bg-primary border border-border-color rounded pl-8 pr-2 py-1.5 text-xs text-text-primary outline-none focus:border-accent-blue"
               />
             </div>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar">
             {messages.length === 0 ? (
               <div className="p-6 text-sm text-text-secondary font-mono">
                 Sem dados recebidos.
               </div>
             ) : messages.map(msg => (
               <div key={msg.id} className="p-3 border-b border-border-color hover:bg-bg-tertiary cursor-pointer transition-colors flex items-start gap-3">
                 <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center border border-border-color">
                   <User size={18} className="text-text-secondary" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-baseline mb-1">
                     <span className="text-sm font-bold text-text-primary truncate">{msg.contact}</span>
                     <span className="text-[10px] text-text-muted">{msg.time}</span>
                   </div>
                   <p className="text-xs text-text-secondary truncate">{msg.message}</p>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] uppercase bg-bg-tertiary px-1.5 rounded text-text-muted border border-border-color">
                       {msg.app}
                     </span>
                     {msg.unread && (
                       <span className="w-2 h-2 rounded-full bg-accent-blue"></span>
                     )}
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Chat View Placeholder */}
        <div className="flex-1 bg-bg-primary/50 flex flex-col justify-center items-center text-text-muted">
          <MessageSquare size={48} className="opacity-20 mb-4" />
          <p className="text-sm font-mono">Selecione uma conversa para visualizar</p>
        </div>
      </div>
    </div>
  );
};

export default SocialMessages;
