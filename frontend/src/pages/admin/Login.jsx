import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 rounded-2xl w-full max-w-md relative z-10 border border-white/10"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white/5 rounded-full border border-neon-purple/30">
            <Lock className="text-neon-purple" size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-8 tracking-wider">ACCESO <span className="text-neon-purple">RESTRINGIDO</span></h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-sm text-center">{error}</div>}
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple text-white transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-purple text-white transition-colors"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 rounded-lg bg-neon-purple text-white font-bold tracking-widest hover:bg-opacity-80 hover:shadow-[0_0_15px_rgba(188,19,254,0.4)] transition-all duration-300"
          >
            INICIAR SESIÓN
          </button>
        </form>
      </motion.div>
    </div>
  );
}
