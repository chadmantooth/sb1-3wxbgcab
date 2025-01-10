import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';

export function Header() {
  return (
    <header className="bg-[#1a1f3d] text-white sticky top-0 z-40 shadow-md">
      <Container>
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center group">
            <span className="text-3xl font-bold group-hover:text-[#e63946] transition-colors duration-200">
              TechAnchorman
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="text-white hover:text-[#e63946] font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="text-white hover:text-[#e63946] font-medium transition-colors duration-200"
            >
              Events
            </Link>
            <Link 
              to="/threat-intel" 
              className="text-white hover:text-[#e63946] font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Threat Intelligence
            </Link>
            <Link 
              to="/about" 
              className="text-white hover:text-[#e63946] font-medium transition-colors duration-200"
            >
              About
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}