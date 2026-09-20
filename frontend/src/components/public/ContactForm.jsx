import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../../config.js';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ full_name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMsg(data.error || 'Ocurrió un error al enviar el mensaje.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-purple/20 rounded-full blur-[80px] pointer-events-none"></div>
      
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-neon-blue">{"//"}</span> Iniciar Conversación
      </h3>
      
      {status === 'success' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-500/10 border border-green-500/30 p-8 rounded-xl text-center flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="p-4 bg-green-500/20 rounded-full mb-4">
            <CheckCircle className="text-green-400" size={48} />
          </div>
          <h4 className="text-xl font-bold text-white mb-2">¡Mensaje Enviado!</h4>
          <p className="text-gray-400">Gracias por contactarme. Revisaré tu mensaje y te responderé a la brevedad.</p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-6 px-6 py-2 rounded-full border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors"
          >
            Enviar otro mensaje
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input 
                type="text" 
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Nombre Completo *"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue text-white transition-colors placeholder:text-gray-600"
                required
              />
            </div>
            <div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo Electrónico *"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue text-white transition-colors placeholder:text-gray-600"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Teléfono / WhatsApp"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue text-white transition-colors placeholder:text-gray-600"
              />
            </div>
            <div>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Asunto"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue text-white transition-colors placeholder:text-gray-600"
              />
            </div>
          </div>
          <div>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="¿En qué puedo ayudarte? *"
              rows="5"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue text-white transition-colors resize-none placeholder:text-gray-600"
              required
            ></textarea>
          </div>
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-4 rounded-lg bg-neon-blue text-dark-bg font-bold tracking-widest hover:bg-opacity-90 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? <Loader className="animate-spin" size={20} /> : <><Send size={20} /> ENVIAR MENSAJE</>}
          </button>
        </form>
      )}
    </div>
  );
}
