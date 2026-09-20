import { motion } from 'framer-motion';
import { usePortfolio } from '../../../context/PortfolioContext';

// Predefined icon map to automatically assign icons/colors to text-based skills from DB
const iconMap = {
  'React': { color: 'text-[#61DAFB]', shadow: 'shadow-[#61DAFB]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  'Node.js': { color: 'text-[#339933]', shadow: 'shadow-[#339933]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg' },
  'TypeScript': { color: 'text-[#3178C6]', shadow: 'shadow-[#3178C6]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
  'Tailwind CSS': { color: 'text-[#38B2AC]', shadow: 'shadow-[#38B2AC]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  'Next.js': { color: 'text-white', shadow: 'shadow-white/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg' },
  'HTML5': { color: 'text-[#E34F26]', shadow: 'shadow-[#E34F26]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  'HTML5/CSS3': { color: 'text-[#E34F26]', shadow: 'shadow-[#E34F26]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  'CSS3': { color: 'text-[#1572B6]', shadow: 'shadow-[#1572B6]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  'JavaScript': { color: 'text-[#F7DF1E]', shadow: 'shadow-[#F7DF1E]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  'Python': { color: 'text-[#3776AB]', shadow: 'shadow-[#3776AB]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
  'SQL': { color: 'text-[#4479A1]', shadow: 'shadow-[#4479A1]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg' },
  'SQLite': { color: 'text-[#003B57]', shadow: 'shadow-[#003B57]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg' },
  'Git / GitHub': { color: 'text-[#F05032]', shadow: 'shadow-[#F05032]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg' },
  'PostgreSQL': { color: 'text-[#336791]', shadow: 'shadow-[#336791]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
  'MongoDB': { color: 'text-[#47A248]', shadow: 'shadow-[#47A248]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
  'Express': { color: 'text-white', shadow: 'shadow-white/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg' },
  'Docker': { color: 'text-[#2496ED]', shadow: 'shadow-[#2496ED]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
  'Figma': { color: 'text-[#F24E1E]', shadow: 'shadow-[#F24E1E]/20', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
};

const getIconData = (name) => {
  return iconMap[name] || {
    color: 'text-white',
    shadow: 'shadow-neon-blue/20',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/devicon/devicon-original.svg' // Fallback
  };
};

export default function TechStack() {
  const { content } = usePortfolio();
  
  const techData = content.tech_stack?.data || {
    title: "TECH",
    title_highlight: "STACK",
    description: "Cargando...",
    soft_skills: [],
    categories: []
  };

  return (
    <section id="tecnologias" className="py-24 relative overflow-hidden">
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-blue/10 via-dark-bg to-dark-bg pointer-events-none"
      />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            {techData.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white text-glow">{techData.title_highlight}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            {techData.description}
          </motion.p>
        </div>

        {/* Dynamic Categories Grid */}
        <div className="space-y-16 mb-24">
          {techData.categories.map((category, catIdx) => (
            <div key={catIdx}>
              <h3 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-4">
                <div className="h-px bg-white/10 flex-1"></div>
                {category.name}
                <div className="h-px bg-white/10 flex-1"></div>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {category.skills.map((skill, index) => {
                  const uiData = getIconData(skill.name);
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, type: "spring" }}
                      animate={{ y: [0, -5, 0] }}
                      style={{ animationDelay: `${Math.random() * 2}s` }}
                      className="group relative"
                    >
                      <div className={`absolute -inset-0.5 bg-white/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200 ${uiData.shadow}`}></div>
                      <div className="relative glass p-6 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-4 h-full hover:bg-white/5 transition-colors">
                        <img src={uiData.icon} alt={skill.name} className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-300" />
                        <span className={`text-xs md:text-sm font-bold tracking-wider ${uiData.color} text-center`}>
                          {skill.name}
                        </span>
                        {/* Optional Level Indicator */}
                        <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <div className={`h-full bg-current ${uiData.color}`} style={{ width: `${skill.level}%` }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Soft Skills Flowing Marquee */}
        {techData.soft_skills && techData.soft_skills.length > 0 && (
          <div className="mt-10 pt-16 border-t border-white/10 relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-dark-bg to-transparent z-10"></div>
            <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-dark-bg to-transparent z-10"></div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-center mb-12 text-white"
            >
              Habilidades <span className="text-neon-purple">Blandas</span>
            </motion.h3>

            <div className="flex whitespace-nowrap overflow-hidden">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 70 }}
                className="flex gap-6 w-max"
              >
                {/* Duplicate the array to create the infinite seamless loop effect */}
                {[...techData.soft_skills, ...techData.soft_skills, ...techData.soft_skills].map((skill, index) => (
                  <div
                    key={index}
                    className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl glass border border-white/10 hover:border-neon-purple/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(188,19,254,0.2)]"
                  >
                    <div className="w-2 h-2 rounded-full bg-neon-purple group-hover:animate-ping"></div>
                    <span className="text-gray-300 font-semibold tracking-wide group-hover:text-white transition-colors">{skill}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
