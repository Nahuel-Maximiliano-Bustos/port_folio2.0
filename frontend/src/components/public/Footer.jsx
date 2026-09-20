import { Terminal } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export default function Footer() {
  const { content } = usePortfolio();
  
  const footerData = content.footer?.data || {
    text: "Diseñado y desarrollado con pasión por Nahuel Maximiliano Bustos.",
    copyright: "© 2026 Todos los derechos reservados."
  };

  const heroData = content.hero?.data || {
    github_url: "#",
    linkedin_url: "#",
    email: "test@test.com"
  };

  return (
    <footer className="border-t border-white/10 bg-black py-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Terminal className="text-neon-blue" size={20} />
          <span className="text-xl font-bold tracking-widest text-glow">NAHUEL.</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-2">
          {footerData.text}
        </p>
        <p className="text-gray-600 text-xs mb-6">
          {footerData.copyright}
        </p>
        
        <div className="flex justify-center gap-6 text-sm font-semibold">
          <a href={heroData.linkedin_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-neon-blue transition-colors">LinkedIn</a>
          <a href={heroData.github_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
          <a href={`mailto:${heroData.email}`} className="text-gray-400 hover:text-neon-purple transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}
