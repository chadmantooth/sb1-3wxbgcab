import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Threat Intel', href: '/threat-intel' },
  { label: 'About', href: '/about' }
];

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-[#1a1f3d] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-bold group-hover:text-[#e63946] transition-colors duration-200">
                TechAnchorman
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                  ${location.pathname === item.href
                    ? 'text-[#e63946] bg-white/10'
                    : 'text-white hover:text-[#e63946]'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`
                block px-3 py-2 rounded-md text-base font-medium
                ${location.pathname === item.href
                  ? 'text-[#e63946] bg-white/10'
                  : 'text-white hover:text-[#e63946]'
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;