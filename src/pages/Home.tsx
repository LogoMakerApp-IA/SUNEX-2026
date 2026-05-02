import { Link } from 'react-router-dom';
import { Zap, Target, ShieldCheck, ArrowRight, Activity, SunDim } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 lg:grid lg:grid-cols-[1.2fr_1fr] flex flex-col relative z-10 w-full max-w-[1600px] mx-auto">
      {/* Background Decorators */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-sunex-accent/10 rounded-full blur-[150px] -z-10 pointer-events-none opacity-50 mix-blend-screen" />
      
      {/* Hero Section */}
      <section className="flex flex-col justify-center relative p-8 md:p-16 lg:p-[4rem_5rem] pt-12 animate-in fade-in slide-in-from-left-8 duration-700">
        <div className="mb-6 flex items-center gap-3">
          <div className="hero-badge gap-2"><SunDim className="w-3.5 h-3.5" /> EFICIÊNCIA ENERGÉTICA</div>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-[5rem] leading-[1.05] font-black mb-8 tracking-tight">
          Energia Limpa,<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold via-sunex-accent to-[#D46600]">
            Máxima Performance.
          </span>
        </h1>
        <p className="text-[#bbb] text-lg font-medium leading-[1.7] max-w-[500px] mb-12">
          Especialistas em limpeza técnica de placas solares. Aumente a eficiência do seu sistema fotovoltaico em até <span className="text-white font-bold">30%</span> com nossa tecnologia especializada.
        </p>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-5 mb-14 w-full max-w-[550px]">
          <div className="glass-panel p-2 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
            <span className="block text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-sunex-gold to-sunex-accent mb-1">+25%</span>
            <span className="text-[9px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-[#888] block">Ganho Médio</span>
          </div>
          <div className="glass-panel p-2 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
            <span className="block text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-sunex-gold to-sunex-accent mb-1">1.2k</span>
            <span className="text-[9px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-[#888] block">Painéis Limpos</span>
          </div>
          <div className="glass-panel p-2 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
            <span className="block text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-sunex-gold to-sunex-accent mb-1">100%</span>
            <span className="text-[9px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-[#888] block">Sustentável</span>
          </div>
        </div>

        <div className="mt-auto hidden lg:flex items-center gap-3 text-xs font-bold tracking-wider uppercase text-[#888] bg-black/20 p-4 rounded-xl border border-white/5 w-fit backdrop-blur-sm">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)] relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
          Sistemas Firebase Online • Atualização Funcional em Tempo Real
        </div>
      </section>

      {/* Services / Features side */}
      <section className="bg-gradient-to-l from-white/[0.02] to-transparent border-t lg:border-t-0 lg:border-l border-white/5 p-8 md:p-16 flex flex-col items-center lg:items-start justify-center relative animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-sunex-gold/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <div className="glass-panel p-10 w-full max-w-[500px] border-t border-t-white/10 bg-black/40 xl:ml-10">
          <h3 className="text-2xl font-extrabold mb-8 text-white flex items-center gap-3">
            <Activity className="w-6 h-6 text-sunex-accent" /> Por que a SUNEX?
          </h3>
          <div className="space-y-8">
            <div className="flex gap-5 group">
              <div className="shrink-0 bg-gradient-to-br from-sunex-accent/20 to-transparent border border-sunex-accent/30 p-4 rounded-2xl h-fit shadow-[0_0_20px_rgba(255,122,0,0.1)] group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-sunex-gold" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 text-lg">Mais Geração, Menos Perda</h4>
                <p className="text-sm text-[#888] leading-relaxed font-medium">A sujeira bloqueia a luz solar. Nossa limpeza especializada garante máxima absorção de fótons.</p>
              </div>
            </div>
            
            <div className="flex gap-5 group">
              <div className="shrink-0 bg-gradient-to-br from-sunex-accent/20 to-transparent border border-sunex-accent/30 p-4 rounded-2xl h-fit shadow-[0_0_20px_rgba(255,122,0,0.1)] group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6 text-sunex-gold" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 text-lg">Segurança Tecnológica</h4>
                <p className="text-sm text-[#888] leading-relaxed font-medium">Equipamentos adequados e água purificada desmineralizada para manter a garantia dos seus módulos.</p>
              </div>
            </div>

            <div className="flex gap-5 group">
              <div className="shrink-0 bg-gradient-to-br from-sunex-accent/20 to-transparent border border-sunex-accent/30 p-4 rounded-2xl h-fit shadow-[0_0_20px_rgba(255,122,0,0.1)] group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 text-sunex-gold" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-2 text-lg">Serviço de Alta Precisão</h4>
                <p className="text-sm text-[#888] leading-relaxed font-medium">Acompanhe seu pedido online com nosso sistema e tenha o serviço executado com rigorosa pontualidade.</p>
              </div>
            </div>
            
            <div className="pt-8 mt-4 border-t border-white/10">
               <Link to="/solicitar" className="btn-primary flex items-center justify-center gap-2 group">
                 Agendar Meu Serviço Agora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-12 text-center text-xs font-bold tracking-widest text-[#444] w-full">
          SUNEX - INTELIGÊNCIA EM ENERGIA SOLAR &copy; {new Date().getFullYear()}
        </div>
      </section>
    </div>
  );
}
