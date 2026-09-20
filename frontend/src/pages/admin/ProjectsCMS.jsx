import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../../config.js';

export default function ProjectsCMS() {
  const [projects, setProjects] = useState([]);
  const [sections, setSections] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  const handleFetchError = (res) => {
    if (res.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return true; // handled
    }
    return false;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [projRes, secRes] = await Promise.all([
        fetch(`${API_URL}/api/cms/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/cms/sections`)
      ]);
      if (handleFetchError(projRes) || handleFetchError(secRes)) return;
      if (projRes.ok) setProjects(await projRes.json());
      if (secRes.ok) setSections(await secRes.json());
    } catch (err) {
      console.error('Error fetching CMS data', err);
    }
  };

  const handleAddSection = () => {
    const sectionName = prompt('Nombre de la nueva sección (ej: contact, footer, skills):');
    if (sectionName && sectionName.trim() !== '') {
      const key = sectionName.trim().toLowerCase().replace(/\s+/g, '_');
      handleToggleSection(key, true); // Create it by toggling to true
    }
  };

  const handleToggleSection = async (sectionKey, forceActive = undefined) => {
    const current = sections[sectionKey] !== false; // Defaults to true if undefined
    const newState = forceActive !== undefined ? forceActive : !current;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/cms/sections/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ section_key: sectionKey, is_active: newState })
      });
      if (handleFetchError(res)) return;
      if (res.ok) {
        setSections(prev => ({ ...prev, [sectionKey]: newState }));
      } else {
        alert('Error al cambiar sección: ' + await res.text());
      }
    } catch (err) {
      console.error('Error toggling section', err);
      alert('Error de red al cambiar sección');
    }
  };

  const handleSaveProject = async () => {
    if (!editForm.title || editForm.title.trim() === '') {
      alert('El título del proyecto es obligatorio.');
      return;
    }

    const token = localStorage.getItem('token');
    const method = isCreating ? 'POST' : 'PUT';
    const url = isCreating ? `${API_URL}/api/cms/projects` : `http://localhost:3001/api/cms/projects/${isEditing}`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      if (handleFetchError(res)) return;
      if (res.ok) {
        fetchData();
        setIsEditing(null);
        setIsCreating(false);
        setEditForm({});
        alert('Guardado exitosamente!');
      } else {
        alert('Error al guardar proyecto: ' + await res.text());
      }
    } catch (err) {
      console.error('Error saving project', err);
      alert('Error de conexión al guardar');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar este proyecto?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/api/cms/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (handleFetchError(res)) return;
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Error al eliminar proyecto');
      }
    } catch (err) {
      console.error('Error deleting project', err);
    }
  };

  const handleToggleProjectVisibility = async (project) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/api/cms/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_active: project.is_active === 0 ? 1 : 0 })
      });
      if (handleFetchError(res)) return;
      if (res.ok) {
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, is_active: project.is_active === 0 ? 1 : 0 } : p));
      } else {
        alert('Error al cambiar visibilidad');
      }
    } catch (err) {
      console.error('Error toggling project visibility', err);
    }
  };

  const startEdit = (project) => {
    setIsEditing(project.id);
    setEditForm(project);
    setIsCreating(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* SECTIONS CONTROL */}
      <section>
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-wider">GESTIÓN DE <span className="text-neon-blue">SECCIONES</span></h2>
            <p className="text-gray-400 mt-1">Activa o desactiva las secciones públicas de tu portfolio en tiempo real.</p>
          </div>
          <button 
            onClick={handleAddSection}
            className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 text-neon-purple rounded-lg hover:bg-neon-purple/30 transition-colors border border-neon-purple/30"
          >
            <Plus size={20} /> Nueva Sección
          </button>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries({
            hero: 'Hero',
            about: 'About',
            education: 'Education',
            projects: 'Projects',
            ...Object.keys(sections).reduce((acc, key) => {
              if (!['hero', 'about', 'education', 'projects'].includes(key)) {
                acc[key] = key.charAt(0).toUpperCase() + key.slice(1);
              }
              return acc;
            }, {})
          }).map(([id, label]) => (
            <div key={id} className="glass p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <span className="font-semibold text-gray-200">{label}</span>
              <button 
                onClick={() => handleToggleSection(id)}
                className={`transition-colors ${sections[id] !== false ? 'text-green-400' : 'text-red-400'}`}
              >
                {sections[id] !== false ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS CONTROL */}
      <section>
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-wider">PORTFOLIO <span className="text-neon-blue">PROYECTOS</span></h2>
            <p className="text-gray-400 mt-1">Gestiona los proyectos que se muestran en el sitio.</p>
          </div>
          <button 
            onClick={() => { setIsCreating(true); setEditForm({ title: '', description: '', is_active: 1 }); setIsEditing(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg hover:bg-neon-blue/30 transition-colors border border-neon-blue/30"
          >
            <Plus size={20} /> Nuevo Proyecto
          </button>
        </header>

        {/* Edit Form */}
        {(isEditing || isCreating) && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl border border-neon-blue/30 mb-8 shadow-[0_0_20px_rgba(0,243,255,0.1)]">
            <h3 className="text-xl font-bold text-white mb-4">{isCreating ? 'Nuevo Proyecto' : 'Editar Proyecto'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Título</label>
                <input 
                  type="text" 
                  value={editForm.title || ''} 
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">URL Imagen</label>
                <input 
                  type="text" 
                  value={editForm.image_url || ''} 
                  onChange={e => setEditForm({...editForm, image_url: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">URL Repositorio (GitHub)</label>
                <input 
                  type="text" 
                  value={editForm.repo_url || ''} 
                  onChange={e => setEditForm({...editForm, repo_url: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">URL Demo (Live)</label>
                <input 
                  type="text" 
                  value={editForm.live_url || ''} 
                  onChange={e => setEditForm({...editForm, live_url: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Descripción</label>
                <textarea 
                  rows="3"
                  value={editForm.description || ''} 
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-neon-blue transition-colors custom-scrollbar"
                ></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Tecnologías (separadas por coma)</label>
                <input 
                  type="text" 
                  value={editForm.tags || ''} 
                  onChange={e => setEditForm({...editForm, tags: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Orden (1, 2, 3...)</label>
                <input 
                  type="number" 
                  value={editForm.order_index ?? 0} 
                  onChange={e => setEditForm({...editForm, order_index: parseInt(e.target.value) || 0})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div className="flex items-end pb-1 gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input 
                    type="checkbox" 
                    checked={editForm.is_active !== 0}
                    onChange={e => setEditForm({...editForm, is_active: e.target.checked ? 1 : 0})}
                    className="w-4 h-4 rounded border-gray-600 bg-transparent text-neon-blue focus:ring-neon-blue"
                  />
                  Proyecto Visible
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => { setIsEditing(null); setIsCreating(false); }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSaveProject}
                className="flex items-center gap-2 px-6 py-2 bg-neon-blue text-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
              >
                <Save size={18} /> Guardar
              </button>
            </div>
          </motion.div>
        )}

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className={`glass rounded-xl border ${project.is_active === 0 ? 'border-red-500/30 opacity-60' : 'border-white/10'} overflow-hidden flex flex-col group`}>
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="h-40 w-full object-cover border-b border-white/10" />
              ) : (
                <div className="h-40 w-full bg-white/5 flex items-center justify-center text-gray-600 border-b border-white/10">Sin imagen</div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white truncate pr-2">{project.title}</h3>
                  <button 
                    onClick={() => handleToggleProjectVisibility(project)} 
                    className="shrink-0 focus:outline-none" 
                    title={project.is_active === 0 ? "Mostrar proyecto" : "Ocultar proyecto"}
                  >
                    {project.is_active === 0 
                      ? <EyeOff size={18} className="text-red-400 hover:text-red-300 transition-colors" /> 
                      : <Eye size={18} className="text-neon-blue hover:text-neon-blue/80 transition-colors" />}
                  </button>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{project.description}</p>
                <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-white/5">
                  <button onClick={() => startEdit(project)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
