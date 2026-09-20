import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '+5491123456789'; // Replace with actual number
  const message = 'Hola Nahuel, me gustaría conversar sobre un proyecto.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4">
      {/* Tooltip that always stays visible but subtle, or pops on hover */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="hidden md:flex px-4 py-2 glass border border-white/10 rounded-full items-center justify-center pointer-events-none shadow-[0_0_15px_rgba(37,211,102,0.15)]"
      >
        <span className="text-xs font-bold text-gray-300 tracking-wider">¿Hablamos?</span>
      </motion.div>

      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="relative group flex items-center justify-center"
      >
        {/* Pulsing rings */}
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[#25D366] pointer-events-none"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
          className="absolute inset-0 rounded-full bg-[#25D366] pointer-events-none"
        ></motion.div>

        {/* Button core (Glassmorphic) */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full glass border border-white/20 bg-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(37,211,102,0.3)] group-hover:bg-[#25D366]/20 group-hover:border-[#25D366]/50 transition-all duration-300 group-hover:scale-110 group-active:scale-95">
          <MessageCircle size={32} className="text-[#25D366] drop-shadow-[0_0_10px_rgba(37,211,102,0.8)] group-hover:text-white transition-colors duration-300" />
        </div>
      </a>
    </div>
  );
}
