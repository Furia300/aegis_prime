import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Contacts = () => {
  const [contacts, setContacts] = useState<Array<{ id: string; name: string; phone: string; email: string; address: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();

    const channel = supabase
      .channel('contacts-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'contacts'
      }, () => {
        fetchContacts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchContacts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Error fetching contacts:', error);
      setContacts([]);
    } else {
      console.log('✅ Fetched', data?.length || 0, 'contacts');
      setContacts(data || []);
    }

    setLoading(false);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone?.includes(searchTerm) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-bg-primary text-text-primary p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-accent-blue flex items-center gap-2">
            <Users className="animate-pulse" />
            CONTATOS
          </h2>
          <p className="text-sm text-text-secondary font-mono">
            Agenda de contatos sincronizada
          </p>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-lg border border-border-color flex-1 flex flex-col overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-border-color flex items-center gap-2 bg-bg-tertiary/50">
          <Search size={16} className="text-text-muted" />
          <input
            type="text"
            placeholder="Buscar contatos..."
            className="bg-transparent border-none outline-none text-sm text-text-primary w-full font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Contacts Grid */}
        <div className="p-4 overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {loading ? (
               <div className="text-sm text-text-secondary font-mono p-2 animate-pulse">
                 ⏳ Carregando dados...
               </div>
             ) : filteredContacts.length === 0 ? (
               <div className="text-sm text-text-secondary font-mono p-2">
                 {searchTerm ? 'Nenhum contato encontrado.' : 'Sem dados recebidos.'}
               </div>
             ) : filteredContacts.map(contact => (
               <div key={contact.id} className="bg-bg-tertiary p-4 rounded border border-border-color hover:border-accent-blue transition-colors group">
                 <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-accent-blue font-bold text-lg border border-accent-blue/30">
                     {contact.name?.charAt(0) || '?'}
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-text-primary group-hover:text-accent-blue transition-colors">
                       {contact.name || 'Sem nome'}
                     </h3>
                     <p className="text-xs text-text-muted">ID: {contact.id.slice(0, 8)}</p>
                   </div>
                 </div>

                 <div className="space-y-2 text-xs text-text-secondary font-mono">
                   {contact.phone && (
                     <div className="flex items-center gap-2">
                       <Phone size={12} className="text-text-muted" />
                       {contact.phone}
                     </div>
                   )}
                   {contact.email && (
                     <div className="flex items-center gap-2">
                       <Mail size={12} className="text-text-muted" />
                       {contact.email}
                     </div>
                   )}
                   {contact.address && (
                     <div className="flex items-center gap-2">
                       <MapPin size={12} className="text-text-muted" />
                       {contact.address}
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
