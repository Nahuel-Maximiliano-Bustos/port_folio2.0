import { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../../config.js';

export default function Settings() {
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('23:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');

  useEffect(() => {
    // Check push subscription status
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(subscription => {
          setIsPushEnabled(subscription !== null);
        });
      });
    }

    // Load quiet hours from backend
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.quiet_hours_start) setQuietHoursStart(data.quiet_hours_start);
        if (data.quiet_hours_end) setQuietHoursEnd(data.quiet_hours_end);
      }
    } catch (err) {
      console.error('Error fetching settings', err);
    }
  };

  const saveSettings = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key: 'quiet_hours_start', value: quietHoursStart })
      });
      await fetch(`${API_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key: 'quiet_hours_end', value: quietHoursEnd })
      });
      alert('Configuración guardada correctamente.');
    } catch (err) {
      console.error('Error saving settings', err);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const togglePushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Las notificaciones Push no están soportadas en este navegador.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      if (isPushEnabled) {
        // Unsubscribe
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          // Optionally, call backend to remove subscription
        }
        setIsPushEnabled(false);
      } else {
        // Subscribe
        const token = localStorage.getItem('token');
        const vapidRes = await fetch(`${API_URL}/api/push/vapidPublicKey`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { publicKey } = await vapidRes.json();
        
        const convertedVapidKey = urlBase64ToUint8Array(publicKey);

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });

        // Send to backend
        await fetch(`${API_URL}/api/push/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(subscription)
        });

        setIsPushEnabled(true);
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      alert('Error al configurar notificaciones Push. Permite las notificaciones en tu navegador.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-wider">CONFIGURACIÓN <span className="text-neon-blue">SISTEMA</span></h1>
        <p className="text-gray-400 mt-2">Administra tus preferencias de notificaciones y cuenta.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Notificaciones Push */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-xl ${isPushEnabled ? 'bg-neon-blue/20 text-neon-blue' : 'bg-gray-800 text-gray-400'}`}>
              {isPushEnabled ? <Bell size={24} /> : <BellOff size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Notificaciones Push</h3>
              <p className="text-sm text-gray-400">Recibe avisos nativos en tu escritorio.</p>
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-8 leading-relaxed">
            Las notificaciones Push permiten que tu PC/Mac te avise instantáneamente cuando recibes un nuevo Lead, incluso si el panel de control está cerrado.
          </p>

          <button 
            onClick={togglePushNotifications}
            className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              isPushEnabled 
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30' 
                : 'bg-neon-blue text-black shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] hover:scale-[1.02]'
            }`}
          >
            {isPushEnabled ? 'Desactivar Notificaciones' : 'Activar Notificaciones Nativas'}
          </button>
        </motion.div>

        {/* Horas de Silencio */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-8 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-neon-purple/20 text-neon-purple">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Horas de Silencio</h3>
              <p className="text-sm text-gray-400">Pausa las notificaciones para dormir.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Inicio (Quiet Hours)</label>
              <input 
                type="time" 
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-neon-purple transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Fin (Quiet Hours)</label>
              <input 
                type="time" 
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-neon-purple transition-colors"
              />
            </div>

            <button 
              onClick={saveSettings}
              className="w-full py-3 rounded-lg font-bold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Save size={18} /> Guardar Horarios
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
