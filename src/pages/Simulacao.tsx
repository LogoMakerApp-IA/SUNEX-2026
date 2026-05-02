import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANOS = {
  Essencial: {
    preco: 18.0,
    descricao: "👉 Ideal para quem quer manter o sistema funcionando bem",
    inclui: ["✔️ 1 limpeza completa"]
  },
  Performance: {
    preco: 15.0,
    descricao: "👉 O plano mais equilibrado e mais vendido\nDuração: 4 meses",
    inclui: [
      "✔️ 1 limpeza completa (a cada 2 meses)",
      "✔️ Inspeção técnica",
      "✔️ 1 inspeção elétrica preventiva inclusa"
    ]
  },
  Elite: {
    preco: 13.0,
    descricao: "👉 Para quem quer máxima eficiência e segurança\nDuração: 6 meses",
    inclui: [
      "✔️ 1 limpeza profissional por mês",
      "✔️ Avaliação técnica",
      "✔️ Monitoramento",
      "✔️ Análise de possíveis perdas de eficiência",
      "✔️ Relatório técnico simplificado"
    ]
  }
};

export default function Simulacao() {
  const [placas, setPlacas] = useState<number | ''>('');
  const [plano, setPlano] = useState<keyof typeof PLANOS>('Essencial');

  const calcularValor = useMemo(() => {
    try {
      if (!placas || placas <= 0) return 0;
      const total = Number(placas) * PLANOS[plano].preco;
      return isNaN(total) ? 0 : total;
    } catch (e) {
      return 0;
    }
  }, [placas, plano]);

  const handlePlacasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setPlacas('');
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= 0) {
        setPlacas(num);
      }
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 flex flex-col items-center justify-center relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sunex-accent/10 rounded-full blur-[150px] -z-10 pointer-events-none opacity-50 mix-blend-screen" />

      <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto bg-gradient-to-br from-sunex-gold/20 to-sunex-accent/10 border border-sunex-gold/20 text-sunex-gold p-4 rounded-3xl inline-flex mb-8 shadow-[0_0_30px_rgba(255,195,0,0.15)] relative">
          <Calculator className="h-8 w-8 relative z-10" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight mb-4">Simule seu Investimento</h1>
        <p className="text-[#888] font-medium max-w-md mx-auto text-lg leading-relaxed">
          Descubra o valor para a limpeza das suas placas solares em tempo real.
        </p>
      </div>

      <div className="glass-panel p-10 w-full max-w-lg animate-in zoom-in-95 duration-500 shadow-2xl shadow-black/50 border border-white/10">
        <div className="space-y-8">
          <div className="group">
            <label className="input-label mb-2 text-[#888] font-bold text-xs uppercase tracking-widest group-focus-within:text-white transition-colors block">Quantidade de Placas</label>
            <input 
              type="number" 
              min="1"
              value={placas}
              onChange={handlePlacasChange}
              className="input-field text-xl font-black text-center font-mono py-4"
              placeholder="Ex: 10"
            />
          </div>

          <div>
            <label className="input-label mb-4 text-[#888] font-bold text-xs uppercase tracking-widest block">Selecione o Plano</label>
            <div className="space-y-4">
              {(Object.keys(PLANOS) as Array<keyof typeof PLANOS>).map((key) => (
                <label 
                  key={key}
                  className={`relative flex flex-col cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                    plano === key 
                      ? 'border-sunex-accent bg-sunex-accent/10 shadow-[0_5px_30px_rgba(255,122,0,0.15)]'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="plano" 
                    value={key} 
                    checked={plano === key}
                    onChange={(e) => setPlano(e.target.value as keyof typeof PLANOS)}
                    className="sr-only" 
                  />
                  
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`font-black text-lg ${plano === key ? 'text-sunex-gold' : 'text-white'}`}>
                      {key} {key === 'Performance' && <span className="ml-2 text-[10px] bg-sunex-gold/20 text-sunex-gold px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border border-sunex-gold/30">Recomendado</span>}
                    </span>
                    <span className={`font-mono font-bold ${plano === key ? 'text-sunex-accent' : 'text-[#888]'}`}>
                      R$ {PLANOS[key].preco.toFixed(2).replace('.', ',')} <span className="text-[10px] uppercase font-sans tracking-wide">/ placa</span>
                    </span>
                  </div>

                  {plano === key && (
                    <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in duration-300">
                      <p className="text-white text-sm font-medium mb-4 leading-relaxed">{PLANOS[key].descricao}</p>
                      
                      <div className="space-y-2">
                        {PLANOS[key].inclui.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-[#bbb] text-sm font-medium">{item.substring(item.indexOf(' ') + 1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 mt-8 text-center bg-gradient-to-b from-transparent to-black/30 -mx-10 -mb-10 p-10 rounded-b-[30px]">
            <span className="text-[#888] text-xs uppercase tracking-widest font-black mb-2 block">Investimento Estimado</span>
            <div className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent mb-8">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calcularValor)}
            </div>
            
            <Link to="/solicitar" className="btn-primary flex items-center justify-center gap-2 group w-full py-5 text-base">
              Solicitar Serviço Agora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
