import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Code } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContentEditor() {
  const [content, setContent] = useState({});
  const [activeTab, setActiveTab] = useState('hero');
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const baseTabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'Sobre Mí' },
    { id: 'education', label: 'Formación' },
    { id: 'tech_stack', label: 'Tech Stack' },
    { id: 'contact', label: 'Contacto' },
    { id: 'footer', label: 'Footer' },
  ];

  const [tabs, setTabs] = useState(baseTabs);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (content[activeTab]) {
      setJsonInput(JSON.stringify(content[activeTab].data, null, 2));
      setStatus({ type: '', message: '' });
    } else {
      setJsonInput('{\n  \n}');
    }
  }, [activeTab, content]);

  const fetchContent = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/cms/content/public');
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        
        // Dynamically add any missing tabs from the database
        const newTabs = [...baseTabs];
        Object.keys(data).forEach(key => {
          if (!newTabs.find(t => t.id === key) && key !== 'projects') {
            newTabs.push({ id: key, label: key.charAt(0).toUpperCase() + key.slice(1) });
          }
        });
        setTabs(newTabs);

        if (data[activeTab]) {
          setJsonInput(JSON.stringify(data[activeTab].data, null, 2));
        }
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    }
  };

  const handleSave = async () => {
    let parsedData;
    try {
      parsedData = JSON.parse(jsonInput);
    } catch (e) {
      setStatus({ type: 'error', message: 'JSON Inválido. Por favor revisa la sintaxis.' });
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3001/api/cms/content/${activeTab}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content_json: parsedData })
      });
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Contenido guardado correctamente.' });
        // Update local state so switching tabs doesn't revert
        setContent(prev => ({
          ...prev,
          [activeTab]: {
            ...prev[activeTab],
            data: parsedData
          }
        }));
      } else {
        setStatus({ type: 'error', message: 'Error al guardar en el servidor.' });
      }
    } catch (err) {
      console.error('Error saving content:', err);
      setStatus({ type: 'error', message: 'Error de conexión.' });
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setStatus({ type: '', message: '' });
    } catch (e) {
      setStatus({ type: 'error', message: 'No se puede formatear: JSON Inválido.' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-wider">EDITOR DE <span className="text-neon-blue">CONTENIDO</span></h1>
        <p className="text-gray-400 mt-2">Modifica absolutamente todos los textos, habilidades y datos de tu web en formato JSON estructurado.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-5 py-4 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50 shadow-[0_0_15px_rgba(0,243,255,0.2)]' 
                  : 'bg-black/40 text-gray-400 hover:bg-white/5 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[700px]"
          >
            {/* Toolbar */}
            <div className="bg-black/60 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code className="text-gray-400" size={20} />
                <h3 className="font-bold text-white tracking-wider uppercase">{activeTab}.json</h3>
              </div>
              <div className="flex items-center gap-4">
                {status.message && (
                  <div className={`flex items-center gap-2 text-sm font-semibold ${status.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                    {status.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                    {status.message}
                  </div>
                )}
                <button 
                  onClick={handleFormat}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-white/10 transition-colors"
                >
                  Formatear
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg text-sm font-bold bg-neon-blue text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all flex items-center gap-2"
                >
                  <Save size={16} /> Guardar
                </button>
              </div>
            </div>

            {/* Textarea */}
            <textarea 
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setStatus({ type: '', message: '' });
              }}
              className="flex-1 w-full bg-[#0d1117] text-[#c9d1d9] p-6 font-mono text-sm leading-relaxed outline-none resize-none custom-scrollbar"
              spellCheck="false"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
