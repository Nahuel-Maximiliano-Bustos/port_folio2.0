import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Inbox, FolderKanban, Settings, LogOut, PanelLeftClose, PanelLeftOpen, Eye, FileText, Bell, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    
    socket.on('new_lead', (lead) => {
      const newToast = { 
        id: Date.now(), 
        title: 'Nuevo Mensaje Recibido', 
        message: `${lead.full_name} te ha contactado.` 
      };
      
      setToasts(prev => [...prev, newToast]);
      
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    });

    return () => socket.disconnect();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/inbox", icon: Inbox, label: "CRM Inbox" },
    { to: "/admin/projects", icon: FolderKanban, label: "Proyectos CMS" },
    { to: "/admin/content", icon: FileText, label: "Editor Contenido" },
    { to: "/admin/settings", icon: Settings, label: "Configuración" }
  ];

  return (
    <div className="flex h-screen bg-dark-bg text-white overflow-hidden font-sans relative">
      {/* Toasts Container */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="bg-black/80 border border-neon-blue/30 p-4 rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.2)] backdrop-blur-md flex items-start gap-4 min-w-[300px]"
            >
              <div className="bg-neon-blue/20 p-2 rounded-full text-neon-blue shrink-0">
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-sm">{toast.title}</h4>
                <p className="text-gray-400 text-sm mt-0.5">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-gray-500 hover:text-white transition-colors shrink-0">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-[#0a0a0a] border-r border-white/10 flex flex-col z-40`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          {!isCollapsed && <h1 className="font-black text-xl tracking-wider text-neon-blue">ADMIN PANEL</h1>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-400 hover:text-white transition-colors">
            {isCollapsed ? <PanelLeftOpen size={24} className="mx-auto" /> : <PanelLeftClose size={24} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => 
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-neon-blue/10 text-neon-blue font-semibold shadow-[inset_4px_0_0_0_#00f3ff]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={22} className={isCollapsed ? "mx-auto" : ""} />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
          <a 
            href="/" 
            target="_blank"
            className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
            title={isCollapsed ? "Ver Sitio" : undefined}
          >
            <Eye size={22} className={isCollapsed ? "mx-auto" : ""} />
            {!isCollapsed && <span>Ver Sitio Vivo</span>}
          </a>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title={isCollapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut size={22} className={isCollapsed ? "mx-auto" : ""} />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-black/40 relative z-0">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
