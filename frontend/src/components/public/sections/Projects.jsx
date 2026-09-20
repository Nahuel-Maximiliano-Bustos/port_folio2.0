import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Code } from 'lucide-react';
import { usePortfolio } from '../../../context/PortfolioContext';

const TiltCard = ({ project, index }) => {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // The DB stores tags as comma separated string
  const tagsList = project.tags ? project.tags.split(',').map(t => t.trim()) : [];
  // Generate random glow colors if missing
  const glowColors = ["from-neon-blue to-neon-purple", "from-neon-green to-neon-blue", "from-neon-purple to-neon-green"];
  const glowColor = glowColors[project.id % glowColors.length];

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full h-full cursor-pointer group perspective-1000"
    >
      <div 
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${glowColor} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
        style={{ transform: "translateZ(-50px)" }}
      ></div>
      
      <div 
        className="glass h-full rounded-3xl p-8 border border-white/10 flex flex-col relative overflow-hidden"
        style={{ transform: "translateZ(0px)" }}
      >
        {project.image_url && (
          <div className="absolute inset-0 z-0 opacity-50 group-hover:opacity-90 transition-opacity duration-500 rounded-3xl overflow-hidden">
            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20"></div>
          </div>
        )}
        
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20 z-10">
          <span className="text-8xl font-black text-white">
            {String(project.order_index > 0 ? project.order_index : (index !== undefined ? index + 1 : project.id)).padStart(2, '0')}
          </span>
        </div>
        
        <div className="flex-1 z-10" style={{ transform: "translateZ(50px)" }}>
          <div className="flex gap-2 mb-6 flex-wrap">
            {tagsList.map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 text-gray-300 backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
          
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{project.title}</h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {project.description}
          </p>
        </div>
        
        <div className="flex gap-4 items-center mt-auto z-10" style={{ transform: "translateZ(30px)" }}>
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-neon-blue transition-colors">
              Ver Demo <ExternalLink size={16} />
            </a>
          )}
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold border border-white/20 text-white px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors">
              <Code size={16} /> Código
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const { content, projects } = usePortfolio();
  
  const projectsData = content.projects?.data || {
    title: "Casos de",
    title_highlight: "Éxito",
    description: "Sistemas de misión crítica y aplicaciones de alto rendimiento diseñadas desde cero."
  };

  return (
    <section id="proyectos" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tighter"
          >
            {projectsData.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white text-glow">{projectsData.title_highlight}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto mt-4"
          >
            {projectsData.description}
          </motion.p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Aún no hay proyectos activos. ¡Añade algunos desde el panel de control!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="h-[450px]"
              >
                <TiltCard project={project} index={index} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
