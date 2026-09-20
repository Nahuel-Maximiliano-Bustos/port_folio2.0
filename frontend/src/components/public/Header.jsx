import { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-2xl font-bold tracking-widest text-glow">NAHUEL.</span>
        </Link>
        
        <nav className="hidden md:flex gap-8">
          <a href="#sobre-mi" className="text-gray-300 hover:text-neon-blue transition-colors text-sm uppercase tracking-widest font-semibold">Sobre Mí</a>
          <a href="#formacion" className="text-gray-300 hover:text-neon-purple transition-colors text-sm uppercase tracking-widest font-semibold">Formación</a>
          <a href="#tecnologias" className="text-gray-300 hover:text-neon-green transition-colors text-sm uppercase tracking-widest font-semibold">Tecnologías</a>
          <a href="#proyectos" className="text-gray-300 hover:text-neon-blue transition-colors text-sm uppercase tracking-widest font-semibold">Proyectos</a>
          <a href="#contacto" className="text-gray-300 hover:text-neon-purple transition-colors text-sm uppercase tracking-widest font-semibold">Contacto</a>
        </nav>

        <button className="hidden md:block px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:border-neon-blue hover:text-neon-blue transition-all duration-300 text-sm tracking-widest">
          LET'S TALK
        </button>

        <button className="md:hidden text-gray-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass absolute top-full left-0 right-0 p-4 border-t border-white/10 flex flex-col gap-4">
          <a href="#sobre-mi" className="p-2 hover:bg-white/5 rounded text-gray-300">Sobre Mí</a>
          <a href="#formacion" className="p-2 hover:bg-white/5 rounded text-gray-300">Formación</a>
          <a href="#tecnologias" className="p-2 hover:bg-white/5 rounded text-gray-300">Tecnologías</a>
          <a href="#proyectos" className="p-2 hover:bg-white/5 rounded text-gray-300">Proyectos</a>
          <a href="#contacto" className="p-2 hover:bg-white/5 rounded text-gray-300">Contacto</a>
        </div>
      )}
    </header>
  );
}
