/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Solicitar from './pages/Solicitar';
import Acompanhar from './pages/Acompanhar';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Sobre from './pages/Sobre';
import Simulacao from './pages/Simulacao';
import Avaliacoes from './pages/Avaliacoes';
import { Sun } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = sessionStorage.getItem('sunex_admin_auth') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const linkClass = (path: string) => 
    `text-xs uppercase tracking-[2px] no-underline pb-2 transition-all font-bold border-b-2 relative overflow-hidden inline-block group ` + 
    (isActive(path) 
      ? 'text-sunex-gold border-sunex-gold' 
      : 'text-[#888] border-transparent hover:text-white');

  return (
    <nav className="h-[80px] border-b border-white/5 bg-black/50 backdrop-blur-2xl sticky top-0 z-50 flex items-center px-8 md:px-16 justify-between shrink-0 shadow-lg shadow-black/20">
      <Link to="/admin" className="text-2xl font-black tracking-[3px] text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent flex items-center gap-3 drop-shadow-sm hover:scale-105 transition-transform origin-left">
        <Sun className="h-7 w-7 text-sunex-accent" /> SUNEX
      </Link>
      <div className="hidden md:flex gap-8 mt-2">
        <Link to="/" className={linkClass('/')}>Home</Link>
        <Link to="/sobre" className={linkClass('/sobre')}>Sobre Nós</Link>
        <Link to="/simulacao" className={linkClass('/simulacao')}>Simulação</Link>
        <Link to="/avaliacoes" className={linkClass('/avaliacoes')}>Avaliações</Link>
        <Link to="/solicitar" className={linkClass('/solicitar')}>Solicitar</Link>
        <Link to="/acompanhar" className={linkClass('/acompanhar')}>Status</Link>
      </div>
    </nav>
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
      </div>
    </BrowserRouter>
  );
}

