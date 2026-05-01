/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Home from './pages/Home';
import Solicitar from './pages/Solicitar';
import Acompanhar from './pages/Acompanhar';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Sobre from './pages/Sobre';
import Simulacao from './pages/Simulacao';
import Avaliacoes from './pages/Avaliacoes';
import { Sun, Menu, X } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = sessionStorage.getItem('sunex_admin_auth') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  
  const linkClass = (path: string) => 
    `text-xs lg:text-sm uppercase tracking-[2px] no-underline pb-2 transition-all font-bold border-b-2 relative overflow-hidden inline-block group ` + 
    (isActive(path) 
      ? 'text-sunex-gold border-sunex-gold' 
      : 'text-[#888] border-transparent hover:text-white hover:border-white/20');

  const mobileLinkClass = (path: string) =>
    `block text-lg uppercase tracking-[2px] no-underline py-5 px-8 transition-all font-bold border-b border-white/5 ` +
    (isActive(path)
      ? 'text-sunex-gold bg-white/5 border-l-4 border-l-sunex-gold'
      : 'text-[#888] hover:text-white hover:bg-white/5 border-l-4 border-l-transparent');

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Prevent scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="h-[80px] border-b border-white/5 bg-black/50 backdrop-blur-2xl sticky top-0 z-40 flex items-center px-6 lg:px-16 justify-between shrink-0 shadow-lg shadow-black/20">
        <Link to="/admin" className="text-xl lg:text-2xl font-black tracking-[3px] text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent flex items-center gap-3 drop-shadow-sm hover:scale-105 transition-transform origin-left">
          <Sun className="h-6 w-6 lg:h-7 lg:w-7 text-sunex-accent" /> SUNEX
        </Link>
        <div className="hidden lg:flex items-center gap-5 xl:gap-8 mt-2">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/sobre" className={linkClass('/sobre')}>Sobre Nós</Link>
          <Link to="/simulacao" className={linkClass('/simulacao')}>Simulação</Link>
          <Link to="/avaliacoes" className={linkClass('/avaliacoes')}>Avaliações</Link>
          <Link to="/solicitar" className={linkClass('/solicitar')}>Solicitar</Link>
          <Link to="/acompanhar" className={linkClass('/acompanhar')}>Status</Link>
        </div>
        <button 
          className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-8 h-8" />
        </button>
      </nav>

      {/* Mobile Menu Fullscreen Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0a0a0c] animate-in fade-in slide-in-from-right-8 duration-300 flex flex-col">
          <div className="h-[80px] flex items-center justify-between px-6 border-b border-white/5 shrink-0 bg-black/40">
            <Link to="/admin" onClick={closeMenu} className="text-xl font-black tracking-[3px] text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent flex items-center gap-3 drop-shadow-sm">
              <Sun className="h-6 w-6 text-sunex-accent" /> SUNEX
            </Link>
            <button 
              className="p-2 text-white/70 hover:text-white transition-colors bg-white/5 rounded-full"
              onClick={closeMenu}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col py-2 overflow-y-auto flex-1">
            <Link to="/" className={mobileLinkClass('/')} onClick={closeMenu}>Home</Link>
            <Link to="/sobre" className={mobileLinkClass('/sobre')} onClick={closeMenu}>Sobre Nós</Link>
            <Link to="/simulacao" className={mobileLinkClass('/simulacao')} onClick={closeMenu}>Simulação</Link>
            <Link to="/avaliacoes" className={mobileLinkClass('/avaliacoes')} onClick={closeMenu}>Avaliações</Link>
            <Link to="/solicitar" className={mobileLinkClass('/solicitar')} onClick={closeMenu}>Solicitar</Link>
            <Link to="/acompanhar" className={mobileLinkClass('/acompanhar')} onClick={closeMenu}>Status</Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-sunex-dark text-white font-sans selection:bg-sunex-accent selection:text-white overflow-hidden">
        <Navbar />
        <main className="flex-1 flex flex-col overflow-y-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/simulacao" element={<Simulacao />} />
            <Route path="/avaliacoes" element={<Avaliacoes />} />
            <Route path="/solicitar" element={<Solicitar />} />
            <Route path="/acompanhar" element={<Acompanhar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          </Routes>
        </main>
        <SpeedInsights />
      </div>
    </BrowserRouter>
  );
}
