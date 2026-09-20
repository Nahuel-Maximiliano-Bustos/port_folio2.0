import WhatsAppButton from '../../components/public/WhatsAppButton';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import About from '../../components/public/sections/About';
import Education from '../../components/public/sections/Education';
import TechStack from '../../components/public/sections/TechStack';
import Projects from '../../components/public/sections/Projects';
import Contact from '../../components/public/sections/Contact';
import Footer from '../../components/public/Footer';
export default function Home() {
  const { content, isLoading } = usePortfolio();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-dark-bg text-neon-blue">Cargando...</div>;
  }
  
  const heroData = {
    title_prefix: "Nahuel Maximiliano",
    title_highlight: "Bustos",
    subtitle: "Construyo arquitecturas robustas y experiencias digitales que generan impacto real. Mi enfoque combina excelencia técnica, visión estratégica de negocio y resolución de problemas complejos.",
    tag: "SOFTWARE & PRODUCT ENGINEERING",
    github_url: "https://github.com/tu-usuario",
    linkedin_url: "https://linkedin.com/in/tu-perfil",
    email: "tu@email.com"
  };

  return (
    <div className="w-full relative text-white bg-[#030014]">
      {/* Global Futuristic Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030014]">
        {/* Prominent Cyber Grid */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,243,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(188,19,254,0.05)_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{ maskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, #000 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 100% 100% at 50% 50%, #000 20%, transparent 80%)' }}
        ></div>
        
        {/* Floating Glowing Orbs (More Prominent) */}
        <motion.div 
          animate={{ x: [0, 150, 0], y: [0, -150, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[5%] w-[40vw] h-[40vw] rounded-full bg-neon-blue/20 blur-[100px] mix-blend-screen"
        ></motion.div>
        
        <motion.div 
          animate={{ x: [0, -150, 0], y: [0, 150, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] -right-[5%] w-[35vw] h-[35vw] rounded-full bg-neon-purple/20 blur-[120px] mix-blend-screen"
        ></motion.div>
        
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 200, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] left-[30%] w-[50vw] h-[50vw] rounded-full bg-neon-green/15 blur-[130px] mix-blend-screen"
        ></motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-center mt-20 gap-8">
          
          {/* Profile Photo - Cutout (Left Side) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center md:justify-end relative"
          >
            {/* Loose Subject Cutout (No background glow) */}
            <div className="relative w-80 md:w-[450px] group z-10">
              <img 
                src="/foto_cutout.png" 
                alt="Nahuel Maximiliano Bustos" 
                className="w-full h-auto object-contain relative z-10 transition-all duration-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_30px_rgba(0,243,255,0.2)]"
                style={{
                  maskImage: 'linear-gradient(to top, transparent 2%, black 20%)',
                  WebkitMaskImage: 'linear-gradient(to top, transparent 2%, black 20%)'
                }}
              />
            </div>
          </motion.div>

          {/* Text Content (Right Side) */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start md:pl-10">
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-6"
            >
              <img src="/logo.jpeg" alt="Logo" className="h-12 w-auto object-contain rounded-lg drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
              <div className="px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-xs font-semibold tracking-widest uppercase">
                {heroData.tag}
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter"
            >
              {heroData.title_prefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple text-glow block mt-2">{heroData.title_highlight}</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto md:mx-0 mb-8"
            >
              {heroData.subtitle}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex justify-center md:justify-start gap-6 mb-10"
            >
              <a href={heroData.linkedin_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-neon-blue transition-colors hover:scale-110">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href={heroData.github_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors hover:scale-110">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href={`mailto:${heroData.email}`} className="text-gray-400 hover:text-neon-purple transition-colors hover:scale-110">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center md:justify-start gap-4"
            >
              <a href="#proyectos" className="px-8 py-3 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all duration-300">
                Ver Proyectos
              </a>
              <a href="#contacto" className="px-8 py-3 rounded-full glass border-white/20 hover:border-neon-blue hover:text-neon-blue transition-all duration-300">
                Contactar
              </a>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Dynamic Modular Sections */}
      {content.about?.is_active && <About />}
      {content.education?.is_active && <Education />}
      {content.tech_stack?.is_active && <TechStack />}
      {content.projects?.is_active && <Projects />}
      {content.contact?.is_active && <Contact />}

      <WhatsAppButton />
      {content.footer?.is_active && <Footer />}
    </div>
  );
}
