import React from 'react';
import { LayoutGrid, Globe, WifiOff, ShieldAlert, Lock, Unlock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BlockerProps {
  type: 'apps' | 'websites' | 'wifi';
}

const Blocker: React.FC<BlockerProps> = ({ type }) => {
  const { t } = useTranslation();

  const getHeader = () => {
    switch (type) {
      case 'apps': return { title: t('sidebar.block_apps'), icon: <LayoutGrid size={24} />, description: 'Restrict access to specific applications' };
      case 'websites': return { title: t('sidebar.block_websites'), icon: <Globe size={24} />, description: 'Filter web traffic and block domains' };
      case 'wifi': return { title: t('sidebar.block_wifi'), icon: <WifiOff size={24} />, description: 'Prevent connection to specific networks' };
      default: return { title: 'Blocker', icon: <ShieldAlert size={24} />, description: 'Access Control' };
    }
  };

  const header = getHeader();
  const data: any[] = [];

  return (
    <div className="flex-1 bg-bg-primary p-6 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-accent-red/10 border border-accent-red/30 rounded text-accent-red">
          {header.icon}
        </div>
        <div>
          <h2 className="text-2xl font-tactical font-bold text-text-primary tracking-widest">{header.title}</h2>
          <p className="text-sm font-mono text-text-secondary">{header.description}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.length === 0 ? (
            <div className="p-4 text-sm text-text-secondary font-mono bg-bg-secondary border border-border-color rounded">
              Sem dados recebidos.
            </div>
          ) : data.map((item: any) => (
            <div key={item.id} className={`
              p-4 rounded-lg border transition-all duration-200 relative group
              ${item.blocked 
                ? 'bg-accent-red/5 border-accent-red/50' 
                : 'bg-bg-secondary border-border-color hover:border-accent-blue'}
            `}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded flex items-center justify-center ${item.blocked ? 'bg-accent-red/20 text-accent-red' : 'bg-bg-tertiary text-text-secondary'}`}>
                     {type === 'apps' && <LayoutGrid size={20} />}
                     {type === 'websites' && <Globe size={20} />}
                     {type === 'wifi' && <WifiOff size={20} />}
                   </div>
                   <div>
                     <h3 className="font-bold font-tactical text-lg">{item.name}</h3>
                     <p className="text-xs font-mono text-text-muted">{item.category || item.ssid || 'Application'}</p>
                   </div>
                </div>
                {item.blocked && <Lock size={16} className="text-accent-red" />}
              </div>

              <button className={`
                w-full py-2 px-4 rounded font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2
                ${item.blocked 
                  ? 'bg-accent-red text-bg-primary hover:bg-red-600' 
                  : 'bg-bg-tertiary text-text-secondary hover:bg-accent-blue hover:text-bg-primary'}
              `}>
                {item.blocked ? (
                  <>
                    <Unlock size={14} /> Unblock
                  </>
                ) : (
                  <>
                    <Lock size={14} /> Block Access
                  </>
                )}
              </button>
            </div>
          ))}
          
          {/* Add New Button */}
          <div className="border-2 border-dashed border-border-color rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer hover:border-accent-blue hover:bg-accent-blue/5 transition-all text-text-secondary hover:text-accent-blue min-h-[150px]">
            <span className="text-4xl mb-2">+</span>
            <span className="font-bold font-tactical text-sm">ADD NEW RULE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blocker;
