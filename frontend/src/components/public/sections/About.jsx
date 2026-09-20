import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Target, Layers, Code2, Zap } from 'lucide-react';

export default function About() {
  const { content } = usePortfolio();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const aboutData = {
    title: "SOBRE",
    title_highlight: "MÍ",
    paragraphs: [
      "Más que escribir código, construyo soluciones. Entiendo el desarrollo de software como el puente directo entre los objetivos de negocio y un producto digital escalable.",
      "Combino pensamiento analítico, excelencia técnica y mentalidad de producto para diseñar ecosistemas digitales resilientes, interfaces de alto impacto y arquitecturas preparadas para el futuro."
    ],
    stats: [
      { value: "PRODUCTO", label: "VISIÓN ESTRATÉGICA", color: "neon-blue" },
      { value: "IMPACTO", label: "RESULTADOS MEDIBLES", color: "neon-purple" },
      { value: "ESCALAR", label: "ARQUITECTURAS ROBUSTAS", color: "neon-green" },
      { value: "CALIDAD", label: "CLEAN CODE", color: "neon-blue" }
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % aboutData.stats.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [aboutData.stats.length]);

  const icons = [
    <Target size={40} className="text-neon-blue drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]" />,
    <Zap size={40} className="text-neon-purple drop-shadow-[0_0_15px_rgba(188,19,254,0.5)]" />,
    <Layers size={40} className="text-neon-green drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]" />,
    <Code2 size={40} className="text-neon-blue drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
  ];

  return (
    <section id="sobre-mi" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 bg-neon-blue/10 rounded-full blur-[50px]"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-neon-purple/10 rounded-full blur-[60px]"
        />
      </div>

      <div className="container mx-auto px-6 max-w-[90rem] relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            {aboutData.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow">{aboutData.title_highlight}</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto mb-10 space-y-4"
          >
            {aboutData.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </motion.div>
        </div>
        
        {/* RULETA FUTURISTA (VALORES CLAVE) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-8 relative max-w-3xl mx-auto"
        >
          {/* Cybernetic Container */}
          <div className="relative w-full h-64 md:h-72 rounded-[40px] glass border border-white/10 overflow-hidden flex flex-col items-center justify-center p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {/* Dynamic Background Glow based on current active item */}
            <div className={`absolute inset-0 bg-${aboutData.stats[currentIndex].color}/5 transition-colors duration-1000`}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-[60px] mix-blend-overlay pointer-events-none"></div>

            {/* Target Reticle Accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-xl"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-xl"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-xl"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-xl"></div>
            
            {/* Roulette Animation */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentIndex}
                  initial={{ y: 80, opacity: 0, scale: 0.8, rotateX: -45 }}
                  animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ y: -80, opacity: 0, scale: 0.8, rotateX: 45 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center origin-center"
                  style={{ perspective: "1000px" }}
                >
                  <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 shadow-inner backdrop-blur-md">
                    {icons[currentIndex]}
                  </div>
                  <h4 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter mb-4 drop-shadow-xl">
                    {aboutData.stats[currentIndex].value}
                  </h4>
                  <p className={`text-xs md:text-sm font-bold tracking-[0.4em] uppercase text-${aboutData.stats[currentIndex].color} drop-shadow-[0_0_8px_currentColor]`}>
                    {aboutData.stats[currentIndex].label}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Progress / Status Indicators */}
            <div className="absolute bottom-6 flex gap-3 z-10">
              {aboutData.stats.map((_, i) => (
                <div 
                  key={i} 
                  onClick={() => setCurrentIndex(i)}
                  className={`cursor-pointer rounded-full transition-all duration-500 ${i === currentIndex ? `h-2 w-12 bg-${aboutData.stats[currentIndex].color} shadow-[0_0_15px_currentColor]` : 'h-2 w-2 bg-white/20 hover:bg-white/40'}`} 
                />
              ))}
            </div>

          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
