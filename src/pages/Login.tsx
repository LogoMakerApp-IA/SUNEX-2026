import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Sun } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, this should be handled securely on the backend.
    // For this prototype, we use VITE_ADMIN_PASSWORD from environment variables.
    // @ts-ignore
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME || 'SUNEX';
    // @ts-ignore
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'sunex2026';
    
    if (username.toLowerCase() === adminUsername.toLowerCase() && password === adminPassword) {
      sessionStorage.setItem('sunex_admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Credenciais incorretas.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative w-full overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sunex-accent/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="glass-panel text-center p-12 max-w-[420px] w-full animate-in fade-in zoom-in-95 duration-500 shadow-2xl shadow-black">
        <div className="mx-auto bg-gradient-to-br from-sunex-gold/20 to-sunex-accent/10 border border-sunex-gold/20 text-sunex-gold p-5 rounded-3xl inline-flex mb-8 shadow-[0_0_30px_rgba(255,195,0,0.15)] relative group">
          <Sun className="absolute w-full h-full inset-0 text-sunex-gold/20 blur-md group-hover:blur-xl transition-all" />
          <Lock className="h-10 w-10 relative z-10" />
        </div>
        
        <h2 className="text-3xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">Acesso Restrito</h2>
        <p className="text-[#888] mb-10 font-medium">Área exclusiva para administração SUNEX.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="group">
            <label className="input-label text-left mb-2 text-[#888] font-bold text-xs uppercase tracking-widest group-focus-within:text-white transition-colors">Usuário</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite o usuário"
              className="input-field text-center tracking-widest font-mono text-sm uppercase"
              required
            />
          </div>
          <div className="group">
            <label className="input-label text-left mb-2 text-[#888] font-bold text-xs uppercase tracking-widest group-focus-within:text-white transition-colors">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field text-center tracking-widest font-mono text-xl"
              required
            />
          </div>
          
          {error && (
            <div className="flex items-center justify-center gap-3 text-red-400 text-sm font-semibold bg-red-500/10 border border-red-500/20 p-4 rounded-xl animate-in zoom-in-95 duration-200">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <button type="submit" className="btn-primary mt-6 !py-5">
            Autenticar
          </button>
        </form>
      </div>
    </div>
  );
}
