import { motion } from 'framer-motion';
import { Terminal, Send, Code, Database, Globe } from 'lucide-react';
import ContactForm from '../ContactForm';
import { usePortfolio } from '../../../context/PortfolioContext';

export default function Contact() {
  const { content } = usePortfolio();
  
  const contactData = content.contact?.data || {
    title: "INICIAR",
    title_highlight: "PROYECTO",
    description: "Cargando..."
  };

  return (
    <section id="contacto" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-30"></div>
      
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/20 bg-neon-blue/10 text-neon-blue text-xs font-semibold tracking-widest mb-6 uppercase"
          >
            <Terminal size={14} /> ./initiate_connection.sh
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter"
          >
            {contactData.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green text-glow">{contactData.title_highlight}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto mt-4"
          >
            {contactData.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,243,255,0.1)] bg-dark-bg/80 backdrop-blur-xl"
          >
            <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto text-xs font-mono text-gray-400 opacity-80 flex items-center gap-2">
                <Terminal size={12} /> root@server:~
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <ContactForm />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-neon-blue/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-[50px]"></div>
              <Code className="text-neon-blue mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Desarrollo End-to-End</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Desde la concepción de la arquitectura en la nube hasta el desarrollo de interfaces fluidas y reactivas. Cada línea de código está optimizada para la escalabilidad.
              </p>
            </div>
            
            <div className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-neon-purple/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-[50px]"></div>
              <Database className="text-neon-purple mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Datos y Rendimiento</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sistemas construidos con bases de datos relacionales y no relacionales preparadas para Big Data, integrando cachés y WebSockets para tiempo real.
              </p>
            </div>
            
            <div className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-neon-green/50 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/10 rounded-full blur-[50px]"></div>
              <Globe className="text-neon-green mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Disponibilidad Global</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Despliegues en contenedores Docker y arquitecturas Serverless. Aplicaciones diseñadas para estar disponibles 24/7 sin caídas.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
