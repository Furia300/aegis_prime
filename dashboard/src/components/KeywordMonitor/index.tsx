import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, ShieldAlert, Eye, Bell } from 'lucide-react';

interface Keyword {
  id: string;
  word: string;
  category: 'kidnapping' | 'inappropriate' | 'drugs' | 'violence';
  severity: 'high' | 'medium' | 'low';
}

const KeywordMonitor = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newWord, setNewWord] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Keyword['category']>('inappropriate');
  const [selectedSeverity, setSelectedSeverity] = useState<Keyword['severity']>('medium');

  const handleAddKeyword = () => {
    if (!newWord.trim()) return;
    const newKeyword: Keyword = {
      id: Date.now().toString(),
      word: newWord.trim(),
      category: selectedCategory,
      severity: selectedSeverity,
    };
    setKeywords([...keywords, newKeyword]);
    setNewWord('');
  };

  const handleDeleteKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'kidnapping': return 'text-accent-red border-accent-red';
      case 'violence': return 'text-accent-red border-accent-red';
      case 'drugs': return 'text-accent-yellow border-accent-yellow';
      case 'inappropriate': return 'text-accent-blue border-accent-blue';
      default: return 'text-text-secondary border-border-color';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-primary overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border-color bg-bg-secondary flex justify-between items-center">
        <div>
          <h2 className="text-xl font-tactical font-bold text-accent-yellow flex items-center gap-2">
            <Eye className="animate-pulse" />
            KEYWORD SENTINEL
          </h2>
          <p className="text-xs font-mono text-text-secondary">
            Monitoramento semântico de mensagens e digitação em tempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded bg-accent-red/10 border border-accent-red text-accent-red text-xs font-bold animate-pulse flex items-center gap-1">
                <Bell size={12} />
                ACTIVE MONITORING
            </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Input Panel */}
        <div className="w-1/3 border-r border-border-color p-4 bg-bg-secondary/50 flex flex-col gap-4">
          <div className="bg-bg-tertiary p-4 rounded border border-border-color">
            <h3 className="text-sm font-bold text-text-primary mb-4 font-tactical uppercase tracking-wider">
              Adicionar Novo Gatilho
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-secondary mb-1">Palavra-Chave / Frase</label>
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Ex: me ajuda, encontro secreto..."
                  className="w-full bg-bg-primary border border-border-color rounded p-2 text-text-primary focus:border-accent-yellow focus:outline-none font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono text-text-secondary mb-1">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full bg-bg-primary border border-border-color rounded p-2 text-text-primary text-xs font-mono"
                  >
                    <option value="kidnapping">Sequestro/Risco</option>
                    <option value="violence">Violência</option>
                    <option value="drugs">Drogas/Ilícito</option>
                    <option value="inappropriate">Impróprio/Adulto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-secondary mb-1">Severidade</label>
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value as any)}
                    className="w-full bg-bg-primary border border-border-color rounded p-2 text-text-primary text-xs font-mono"
                  >
                    <option value="high">ALTA (Alerta Vermelho)</option>
                    <option value="medium">MÉDIA (Notificação)</option>
                    <option value="low">BAIXA (Registro)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddKeyword}
                className="w-full bg-accent-yellow/20 hover:bg-accent-yellow/30 border border-accent-yellow text-accent-yellow py-2 rounded font-bold font-tactical tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                ATIVAR GATILHO
              </button>
            </div>
          </div>

          <div className="flex-1 bg-bg-tertiary p-4 rounded border border-border-color overflow-y-auto">
             <h3 className="text-xs font-bold text-text-secondary mb-2 font-tactical uppercase">
              Últimas Detecções
            </h3>
            <div className="space-y-2">
              <div className="p-2 bg-bg-primary/50 text-xs text-text-secondary font-mono border border-border-color rounded">
                Sem dados recebidos.
              </div>
            </div>
          </div>
        </div>

        {/* List Panel */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <h3 className="text-sm font-bold text-text-primary mb-4 font-tactical uppercase tracking-wider flex justify-between items-center">
            <span>Gatilhos Ativos ({keywords.length})</span>
            <span className="text-xs font-mono text-accent-green">SYNCED WITH AGENT</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {keywords.length === 0 ? (
              <div className="p-4 text-sm text-text-secondary font-mono bg-bg-secondary border border-border-color rounded">
                Sem dados recebidos.
              </div>
            ) : keywords.map((k) => (
              <div
                key={k.id}
                className={`p-3 rounded border bg-bg-tertiary relative group hover:bg-bg-secondary transition-colors ${getCategoryColor(k.category)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold uppercase border px-1.5 py-0.5 rounded ${getCategoryColor(k.category)}`}>
                    {k.category}
                  </span>
                  <button
                    onClick={() => handleDeleteKeyword(k.id)}
                    className="text-text-secondary hover:text-accent-red opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <h4 className="text-lg font-mono font-bold text-text-primary mb-1">"{k.word}"</h4>
                <div className="flex items-center gap-2 text-[10px] text-text-secondary uppercase">
                    {k.severity === 'high' ? <ShieldAlert size={12} className="text-accent-red" /> : <AlertTriangle size={12} />}
                    <span>Severity: {k.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordMonitor;
