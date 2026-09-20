import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ history: [], totalVisits: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:3001/api/metrics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Format date for chart
          const formattedHistory = data.history.map(item => ({
            name: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            Visitas: item.visits
          })).reverse();
          
          setMetrics({ history: formattedHistory, totalVisits: data.totalVisits });
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8 relative max-w-6xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold tracking-wider">MÉTRICAS <span className="text-neon-blue">Y TRÁFICO</span></h1>
        <p className="text-gray-400 mt-2">Visión general del rendimiento de tu portfolio</p>
      </header>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/30">
            <Users size={32} className="text-neon-blue" />
          </div>
          <div>
            <div className="text-sm text-gray-400 font-semibold tracking-widest uppercase mb-1">Visitas Totales</div>
            <div className="text-4xl font-black text-white">{metrics.totalVisits}</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl border border-white/10 flex items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-neon-purple/10 flex items-center justify-center border border-neon-purple/30">
            <Activity size={32} className="text-neon-purple" />
          </div>
          <div>
            <div className="text-sm text-gray-400 font-semibold tracking-widest uppercase mb-1">Estado del Sitio</div>
            <div className="text-2xl font-black text-green-400 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span> Online
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-8 rounded-2xl border border-white/10"
      >
        <h3 className="text-lg font-bold text-white mb-8">Tráfico de los últimos 30 días</h3>
        
        <div className="h-96 w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">Cargando métricas...</div>
          ) : metrics.history.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No hay suficientes datos de tráfico aún.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#00f3ff' }}
                />
                <Bar dataKey="Visitas" fill="#00f3ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </div>
  );
}
