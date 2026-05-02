import React from 'react';
import { Shield, Sparkles, Target, Zap, Mail, Smartphone } from 'lucide-react';

export default function Sobre() {
  const diferenciais = [
    {
      icon: <Zap className="w-7 h-7 text-sunex-gold" />,
      titulo: 'Alta Performance',
      descricao: 'Utilizamos tecnologias que garantem a remoção completa de resíduos, maximizando a captação de energia.'
    },
    {
      icon: <Shield className="w-7 h-7 text-sunex-gold" />,
      titulo: 'Segurança Total',
      descricao: 'Processo seguro que não danifica as placas, preservando a garantia do seu equipamento.'
    },
    {
      icon: <Target className="w-7 h-7 text-sunex-gold" />,
      titulo: 'Foco no Cliente',
      descricao: 'Atendimento personalizado e transparência em todas as etapas do serviço.'
    },
    {
      icon: <Sparkles className="w-7 h-7 text-sunex-gold" />,
      titulo: 'Sustentabilidade',
      descricao: 'Produtos biodegradáveis e uso consciente de água em nossos processos de limpeza.'
    }
  ];

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-16 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sunex-accent/10 rounded-full blur-[150px] -z-10 pointer-events-none opacity-40 mix-blend-screen" />
      
      <div className="text-center mb-20 animate-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight mb-6 mt-8">Sobre a SUNEX</h1>
        <p className="text-xl text-[#888] max-w-2xl mx-auto font-medium leading-relaxed">
          Especialistas em limpeza e manutenção de painéis solares para garantir a máxima eficiência da sua usina.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24 animate-in slide-in-from-bottom-8 duration-[900ms] lg:px-10">
        <div className="glass-panel p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-sunex-gold/5 rounded-full blur-[80px] -z-10 pointer-events-none transition-transform duration-1000 group-hover:scale-150 group-hover:bg-sunex-gold/10" />
          <h2 className="text-3xl font-black text-white mb-6">Nossa Missão</h2>
          <p className="text-[#aaa] leading-[1.8] font-medium text-lg mb-6">
            A SUNEX nasceu com o propósito de otimizar a geração de energia renovável no Brasil. 
            Sabemos que o acúmulo de sujeira, poeira e detritos pode reduzir a eficiência dos painéis solares em até 30%.
          </p>
          <p className="text-[#aaa] leading-[1.8] font-medium text-lg">
            Nossa equipe técnica capacitada utiliza métodos seguros e eficientes para limpar as placas,
            garantindo que o seu investimento traga o máximo de retorno possível, sempre focados em sustentabilidade
            e responsabilidade ambiental.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {diferenciais.map((item, index) => (
            <div key={index} className="glass-panel p-8 border-transparent hover:border-sunex-accent/30 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(255,122,0,0.1)] group">
              <div className="bg-gradient-to-br from-sunex-gold/10 to-transparent w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-sunex-gold/20 shadow-inner group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-3 tracking-wide">{item.titulo}</h3>
              <p className="text-sm text-[#888] font-medium leading-relaxed">{item.descricao}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-12 mb-12 animate-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-sunex-gold/5 via-transparent to-sunex-accent/5 pointer-events-none" />
        <h2 className="text-3xl font-black text-center text-white mb-10 tracking-tight">Entre em Contato</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-10 md:gap-24 relative z-10 w-fit mx-auto">
          
          <a href="mailto:sunex589@gmail.com" className="flex items-center gap-5 sm:gap-6 group hover:scale-[1.02] transition-transform w-full md:w-auto">
            <div className="bg-gradient-to-br from-sunex-gold/20 to-sunex-accent/10 p-4 sm:p-5 rounded-3xl border border-sunex-gold/20 shadow-[0_5px_20px_rgba(255,195,0,0.1)] group-hover:border-sunex-gold/40 transition-colors shrink-0">
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-sunex-gold" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[10px] sm:text-[11px] text-[#888] uppercase tracking-[3px] mb-1 font-black">E-mail</p>
              <span className="text-white font-bold transition-colors text-lg sm:text-xl break-all">
                sunex589@gmail.com
              </span>
            </div>
          </a>

          <div className="hidden md:block w-[1px] h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          
          <a href="https://wa.me/5584988126175" target="_blank" rel="noreferrer" className="flex items-center gap-5 sm:gap-6 group hover:scale-[1.02] transition-transform w-full md:w-auto">
            <div className="bg-gradient-to-br from-sunex-gold/20 to-sunex-accent/10 p-4 sm:p-5 rounded-3xl border border-sunex-gold/20 shadow-[0_5px_20px_rgba(255,195,0,0.1)] group-hover:border-sunex-gold/40 transition-colors shrink-0">
              <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-sunex-gold" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[10px] sm:text-[11px] text-[#888] uppercase tracking-[3px] mb-1 font-black">WhatsApp</p>
              <span className="text-white font-bold transition-colors text-lg sm:text-xl break-all">
                (84) 98812-6175
              </span>
            </div>
          </a>

        </div>
      </div>
    </div>
  );
}
