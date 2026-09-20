import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Star, Trash2, Archive, Inbox as InboxIcon, AlertTriangle, RefreshCw, MailOpen, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../../config.js';

export default function Inbox() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('Inbox'); // Inbox, Starred, Archived, Trash
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLead, setExpandedLead] = useState(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    const socket = io(API_URL || '/');
    socket.on('new_lead', (lead) => {
      setLeads(prev => [lead, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const updateLead = async (id, updates) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updatedLead = await res.json();
        setLeads(prev => prev.map(l => l.id === id ? updatedLead : l));
      }
    } catch (err) {
      console.error('Error updating lead:', err);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedLeads.length === 0) return;
    
    // In a real app with bulk endpoints, we'd do one request. 
    // Here we map promises for simplicity since it's a personal admin panel.
    const promises = selectedLeads.map(id => {
      if (action === 'delete') return updateLead(id, { is_deleted: 1, is_archived: 0 });
      if (action === 'archive') return updateLead(id, { is_archived: 1, is_deleted: 0 });
      if (action === 'star') {
        const lead = leads.find(l => l.id === id);
        return updateLead(id, { is_starred: lead.is_starred ? 0 : 1 });
      }
      if (action === 'restore') return updateLead(id, { is_deleted: 0, is_archived: 0 });
    });

    await Promise.all(promises);
    setSelectedLeads([]);
  };

  const emptyTrash = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/api/leads/trash`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.is_deleted === 0));
      }
    } catch (err) {
      console.error('Error emptying trash:', err);
    }
  };

  const toggleSelection = (id) => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    const currentViewLeads = filteredLeads.map(l => l.id);
    if (selectedLeads.length === currentViewLeads.length) {
      setSelectedLeads([]); // Deselect all
    } else {
      setSelectedLeads(currentViewLeads);
    }
  };

  const handleLeadClick = (lead) => {
    if (expandedLead === lead.id) {
      setExpandedLead(null);
    } else {
      setExpandedLead(lead.id);
      if (lead.status === 'Nuevo') {
        updateLead(lead.id, { status: 'Contactado' });
      }
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (filter === 'Trash') return lead.is_deleted === 1;
    if (lead.is_deleted === 1) return false;
    
    if (filter === 'Starred') return lead.is_starred === 1;
    if (filter === 'Archived') return lead.is_archived === 1;
    
    // Inbox shows non-archived, non-deleted
    return lead.is_archived === 0;
  });

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
      {/* Top Toolbar */}
      <div className="h-16 border-b border-white/10 bg-white/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-gray-600 bg-transparent text-neon-blue focus:ring-neon-blue focus:ring-offset-gray-900 cursor-pointer"
            checked={selectedLeads.length > 0 && selectedLeads.length === filteredLeads.length}
            onChange={selectAll}
          />
          <button onClick={fetchLeads} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors" title="Actualizar">
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>

          <AnimatePresence>
            {selectedLeads.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2 border-l border-white/10 pl-4"
              >
                {filter !== 'Trash' && (
                  <>
                    <button onClick={() => handleBulkAction('archive')} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors" title="Archivar">
                      <Archive size={18} />
                    </button>
                    <button onClick={() => handleBulkAction('delete')} className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors" title="Eliminar">
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
                {filter === 'Trash' && (
                  <button onClick={() => handleBulkAction('restore')} className="p-2 text-gray-400 hover:text-green-400 rounded-full hover:bg-white/10 transition-colors" title="Restaurar">
                    <InboxIcon size={18} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          {filter === 'Trash' && (
            <button onClick={emptyTrash} className="px-4 py-1.5 text-sm font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors border border-red-500/30">
              Vaciar Papelera
            </button>
          )}
          <span className="text-sm text-gray-400 font-medium">{filteredLeads.length} mensajes</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Categories */}
        <div className="w-48 md:w-56 border-r border-white/10 bg-black/20 p-4 shrink-0 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => { setFilter('Inbox'); setSelectedLeads([]); setExpandedLead(null); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${filter === 'Inbox' ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
          >
            <InboxIcon size={18} /> Bandeja
          </button>
          <button 
            onClick={() => { setFilter('Starred'); setSelectedLeads([]); setExpandedLead(null); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${filter === 'Starred' ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
          >
            <Star size={18} /> Destacados
          </button>
          <button 
            onClick={() => { setFilter('Archived'); setSelectedLeads([]); setExpandedLead(null); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${filter === 'Archived' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
          >
            <Archive size={18} /> Archivados
          </button>
          <button 
            onClick={() => { setFilter('Trash'); setSelectedLeads([]); setExpandedLead(null); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${filter === 'Trash' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
          >
            <Trash2 size={18} /> Papelera
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/40 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className="animate-spin text-neon-blue" size={32} />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-4">
              <MailOpen size={48} className="opacity-20" />
              <p>Nada por aquí.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredLeads.map(lead => (
                <div key={lead.id} className="border-b border-white/5 flex flex-col">
                  {/* Row */}
                  <div 
                    onClick={() => handleLeadClick(lead)}
                    className={`flex items-center gap-4 px-6 py-4 transition-all cursor-pointer hover:bg-white/5 group ${lead.status === 'Nuevo' ? 'bg-white/5' : ''} ${selectedLeads.includes(lead.id) ? 'bg-neon-blue/5' : ''}`}
                  >
                    {/* Controls */}
                    <div className="flex items-center gap-3 shrink-0">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-600 bg-transparent text-neon-blue focus:ring-neon-blue focus:ring-offset-gray-900 cursor-pointer"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={(e) => { e.stopPropagation(); toggleSelection(lead.id); }}
                      />
                      <button onClick={(e) => { e.stopPropagation(); updateLead(lead.id, { is_starred: lead.is_starred ? 0 : 1 }); }} className="text-gray-500 hover:text-yellow-400 transition-colors">
                        <Star size={18} className={lead.is_starred ? "fill-yellow-400 text-yellow-400" : ""} />
                      </button>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-w-0">
                      <div className={`w-48 truncate font-medium ${lead.status === 'Nuevo' ? 'text-white' : 'text-gray-300'}`}>
                        {lead.full_name}
                      </div>
                      <div className="flex-1 flex items-center gap-2 truncate text-sm">
                        {lead.priority === 'Alta' && <AlertTriangle size={14} className="text-red-400 shrink-0" />}
                        <span className={`truncate ${lead.status === 'Nuevo' ? 'text-gray-200 font-medium' : 'text-gray-400'}`}>
                          {lead.subject || 'Sin asunto'} <span className="text-gray-600 mx-1">-</span> <span className="text-gray-500 font-normal">{lead.message}</span>
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="w-24 text-right text-xs text-gray-500 font-medium shrink-0">
                      {new Date(lead.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  {/* Expanded View */}
                  <AnimatePresence>
                    {expandedLead === lead.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/50"
                      >
                        <div className="p-8 ml-10 border-l-2 border-neon-blue/30 space-y-4 text-sm text-gray-300">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">{lead.subject || 'Sin asunto'}</h3>
                              <p className="text-gray-400">De: <a href={`mailto:${lead.email}`} className="text-neon-blue hover:underline">{lead.full_name} &lt;{lead.email}&gt;</a></p>
                              {lead.phone && <p className="text-gray-400">Tel: {lead.phone}</p>}
                            </div>
                            <span className="text-gray-500">{new Date(lead.created_at).toLocaleString()}</span>
                          </div>
                          
                          <div className="mt-6 pt-6 border-t border-white/10 whitespace-pre-wrap leading-relaxed">
                            {lead.message}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
