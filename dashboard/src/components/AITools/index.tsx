import React, { useState } from 'react';
import { Bot, Sparkles, Send, User, Cpu } from 'lucide-react';

interface AIToolsProps {
  type: 'chatgpt' | 'gemini';
}

const AITools: React.FC<AIToolsProps> = ({ type }) => {
  const [input, setInput] = useState('');
  
  const isGemini = type === 'gemini';
  const themeColor = isGemini ? 'text-purple-400' : 'text-green-400';
  const borderColor = isGemini ? 'border-purple-400/30' : 'border-green-400/30';
  const bgColor = isGemini ? 'bg-purple-400/10' : 'bg-green-400/10';

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-primary">
      {/* Header */}
      <div className="p-4 border-b border-border-color flex items-center justify-between bg-bg-secondary">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded ${bgColor} border ${borderColor} ${themeColor}`}>
            {isGemini ? <Sparkles size={24} /> : <Bot size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-tactical font-bold text-text-primary tracking-widest">
              {isGemini ? 'GEMINI PRO INTELLIGENCE' : 'CHATGPT 4.0 TACTICAL'}
            </h2>
            <p className="text-xs font-mono text-text-secondary">AI THREAT ANALYSIS & SUPPORT</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-bg-tertiary border border-border-color">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
          <span className="text-[10px] font-mono text-text-secondary">ONLINE</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Welcome Message */}
        <div className="flex gap-4 max-w-3xl">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgColor} border ${borderColor}`}>
             <Cpu size={20} className={themeColor} />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className={`font-bold font-mono text-sm ${themeColor}`}>{isGemini ? 'GEMINI' : 'CHATGPT'}</span>
              <span className="text-[10px] text-text-muted">10:42 AM</span>
            </div>
            <div className="p-4 bg-bg-secondary border border-border-color rounded-lg rounded-tl-none text-sm text-text-primary leading-relaxed shadow-lg">
              <p>Greetings, Operator. I am ready to assist with surveillance data analysis, pattern recognition, and tactical decision support. How can I help you today?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border-color bg-bg-secondary">
        <div className="relative max-w-4xl mx-auto">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${isGemini ? 'Gemini' : 'ChatGPT'}...`}
            className="w-full bg-bg-primary border border-border-color rounded-lg pl-4 pr-12 py-4 text-sm font-mono text-text-primary focus:border-accent-blue focus:outline-none focus:shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all"
          />
          <button className="absolute right-2 top-2 p-2 text-text-secondary hover:text-accent-blue transition-colors">
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] font-mono text-text-muted mt-2 opacity-50">
          AI generated content may be inaccurate. Use discretion for tactical decisions.
        </p>
      </div>
    </div>
  );
};

export default AITools;
