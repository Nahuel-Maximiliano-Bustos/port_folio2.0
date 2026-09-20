import { motion } from 'framer-motion';
import { useDraggableScroll } from '../../../hooks/useDraggableScroll';

export default function Education() {
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, isDragging } = useDraggableScroll();
  
  const milestones = [
    {
      year: "2018",
      title: "INGENIERÍA EN SISTEMAS",
      subtitle: '"El comienzo de mi formación tecnológica."',
      keywords: ["Java", "Programación", "Lógica", "Sistemas"],
      isCurrent: false
    },
    {
      year: "2020",
      title: "DISEÑO GRÁFICO",
      subtitle: '"Aprender a construir también implica aprender a comunicar."',
      keywords: ["Diseño", "Composición", "Identidad", "Comunicación visual"],
      isCurrent: false
    },
    {
      year: "2024",
      title: "ANALÍTICA WEB & MULTIMEDIA",
      subtitle: '"Entender los datos permite tomar mejores decisiones digitales."',
      keywords: ["Analítica", "Métricas", "Datos", "Web", "Multimedia"],
      isCurrent: false
    },
    {
      year: "ACTUALIDAD",
      title: "DESARROLLO & TECNOLOGÍA",
      subtitle: '"Una visión multidisciplinaria para construir soluciones digitales."',
      keywords: ["Full-Stack", "Datos", "Ciberseguridad", "Web3", "Blockchain"],
      isCurrent: true
    }
  ];

  const colors = ["neon-blue", "neon-purple", "neon-green", "neon-green"]; // Last is highlighted

  return (
    <section id="formacion" className="py-24 relative overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[150px] pointer-events-none"
      />
      
      <div className="container mx-auto px-6 max-w-[90rem] relative z-10">
        
        {/* HEADER & INTRO */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-xs font-semibold tracking-widest mb-6 uppercase"
          >
            Trayectoria & Evolución
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-8"
          >
            MI <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green text-glow">RECORRIDO</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-gray-300"
          >
            <p className="text-lg md:text-xl font-medium leading-relaxed">
              "Mi formación no siguió un único camino. Fue construyéndose alrededor de una idea: entender la tecnología, comprender cómo interactúan las personas con ella y transformar ese conocimiento en soluciones reales."
            </p>
            <p className="text-base md:text-lg text-gray-400 font-light">
              Hoy combino desarrollo, diseño, datos y tecnología para abordar problemas desde una perspectiva integral.
            </p>
          </motion.div>
        </div>

        {/* TIMELINE INTERCALADA (DRAGGABLE) */}
        <div 
          ref={ref}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`relative w-full mt-8 md:mt-12 pb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab ${isDragging ? 'active:cursor-grabbing snap-none' : 'snap-x snap-mandatory'}`}
        >
          <div className="flex items-center w-max min-w-full px-6 md:px-12 h-[750px] relative">
            {/* Main connecting line */}
            <div className="absolute top-[50%] left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green/30 z-0"></div>
            
            {milestones.map((item, index) => {
              const isTop = index % 2 === 0;
              const color = colors[index];
              const isCurrent = item.isCurrent;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: isTop ? -30 : 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, type: "spring", bounce: 0.4 }}
                  className="relative w-80 md:w-[22rem] h-full flex flex-col justify-center items-center shrink-0 snap-center mx-6 group"
                >
                  {/* Dot on the line */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${isCurrent ? 'w-10 h-10' : 'w-8 h-8'} rounded-full border-4 border-dark-bg bg-${color} shadow-[0_0_15px_var(--tw-shadow-color)] z-20`} style={{ shadowColor: isCurrent ? '#39ff14' : color === 'neon-blue' ? '#00f3ff' : '#bc13fe' }}>
                    <motion.div 
                      animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }} 
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      className="absolute inset-0 bg-white rounded-full mix-blend-overlay"
                    />
                  </div>
                  
                  {/* Vertical line connecting dot to card */}
                  <div className={`absolute left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b ${isTop ? `from-transparent to-${color}` : `from-${color} to-transparent`} z-10 ${isTop ? 'bottom-1/2 h-10 md:h-12' : 'top-1/2 h-10 md:h-12'}`}></div>

                  {/* Node Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: isTop ? -5 : 5 }}
                    className={`absolute ${isTop ? 'bottom-[calc(50%+2.5rem)] md:bottom-[calc(50%+3rem)]' : 'top-[calc(50%+2.5rem)] md:top-[calc(50%+3rem)]'} w-full glass p-5 md:p-6 rounded-2xl border transition-all duration-300 overflow-hidden text-left flex flex-col ${isCurrent ? 'border-neon-green/40 shadow-[0_0_30px_rgba(57,255,20,0.1)] bg-neon-green/5' : `border-white/10 hover:border-${color}/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]`}`}
                  >
                    {/* Inner glowing blob */}
                    <div className={`absolute ${isTop ? 'bottom-0' : 'top-0'} right-0 w-32 h-32 bg-${color}/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-3">
                        <span className={`text-${color} font-bold tracking-widest text-[10px] md:text-xs uppercase inline-block bg-${color}/10 px-3 py-1 rounded-full border border-${color}/20 ${isCurrent ? 'animate-pulse' : ''}`}>
                          {item.year}
                        </span>
                      </div>
                      <h3 className={`text-lg md:text-xl font-black mb-2 leading-tight ${isCurrent ? 'text-white' : 'text-gray-100'}`}>
                        {item.title}
                      </h3>
                      <p className={`mb-5 italic text-[13px] md:text-sm ${isCurrent ? 'text-gray-200 font-medium' : 'text-gray-400 font-light'}`}>
                        {item.subtitle}
                      </p>
                      
                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {item.keywords.map((kw, j) => (
                          <span 
                            key={j} 
                            className={`text-[9px] md:text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border backdrop-blur-sm transition-colors ${
                              isCurrent 
                                ? 'border-neon-green/30 text-neon-green/90 bg-neon-green/5' 
                                : `border-white/10 text-gray-300 bg-black/40 group-hover:border-${color}/30`
                            }`}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CLOSING MESSAGE */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green blur-lg opacity-20 rounded-xl"></div>
            <div className="relative px-8 py-6 md:px-12 md:py-8 glass border border-white/10 rounded-xl">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed">
                "Una formación multidisciplinaria para construir productos digitales <br className="hidden md:block" /> con una visión más completa."
              </h3>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
