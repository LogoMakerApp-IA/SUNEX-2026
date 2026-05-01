import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';

interface Avaliacao {
  id: string;
  nome: string;
  comentario: string;
  nota: number;
  data: string;
}

export default function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [nome, setNome] = useState('');
  const [comentario, setComentario] = useState('');
  const [nota, setNota] = useState<number>(5);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sunex_avaliacoes');
      if (stored) {
        setAvaliacoes(JSON.parse(stored));
      } else {
        // Initial simulated reviews
        const iniciais: Avaliacao[] = [
          { id: '1', nome: 'Carlos Silva', comentario: 'Serviço excelente! Minha geração de energia aumentou notavelmente após a limpeza.', nota: 5, data: new Date().toISOString() },
          { id: '2', nome: 'Ana Costa', comentario: 'Muito profissionais. Chegaram no horário e o resultado foi ótimo. Pretendo gerar outro ciclo de limpeza.', nota: 4, data: new Date(Date.now() - 86400000).toISOString() }
        ];
        setAvaliacoes(iniciais);
        localStorage.setItem('sunex_avaliacoes', JSON.stringify(iniciais));
      }
    } catch (e) {
      console.error("Erro ao carregar avaliações", e);
    }
  }, []);

  const adicionarAvaliacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !comentario.trim()) return;

    const novaAvaliacao: Avaliacao = {
      id: Math.random().toString(36).substring(2, 9),
      nome: nome.trim(),
      comentario: comentario.trim(),
      nota: nota,
      data: new Date().toISOString()
    };

    try {
      const novaLista = [novaAvaliacao, ...avaliacoes];
      setAvaliacoes(novaLista);
      localStorage.setItem('sunex_avaliacoes', JSON.stringify(novaLista));
      
      // Clear form
      setNome('');
      setComentario('');
      setNota(5);
    } catch (e) {
      alert("Erro ao salvar avaliação.");
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-6 h-6 drop-shadow-sm ${star <= rating ? 'fill-sunex-gold text-sunex-gold' : 'text-white/10'} ${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : ''}`}
            onClick={() => interactive && setNota(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-16 relative">
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-sunex-gold/10 rounded-full blur-[120px] -z-10 pointer-events-none opacity-50 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sunex-accent/10 rounded-full blur-[150px] -z-10 pointer-events-none opacity-40 mix-blend-screen" />

      <div className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight mb-4">Experiências SUNEX</h1>
        <p className="text-[#888] font-medium max-w-xl mx-auto text-lg leading-relaxed">
          Veja o que nossos clientes dizem sobre a excelência dos nossos serviços.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 xl:gap-16 items-start lg:px-10">
        <div className="lg:sticky lg:top-32 animate-in slide-in-from-left-8 duration-700">
          <div className="glass-panel p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sunex-gold/10 rounded-bl-full -z-10 blur-2xl" />
            
            <h3 className="text-2xl font-black text-white mb-8 border-b border-white/10 pb-4">Deixe sua Opinião</h3>
            
            <form onSubmit={adicionarAvaliacao} className="space-y-6">
              <div className="group">
                <label className="input-label mb-2 text-[#888] font-bold text-xs uppercase tracking-widest group-focus-within:text-white transition-colors block">Seu Nome</label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="input-field shadow-inner" 
                  placeholder="Ex: Maria Oliveira"
                  required
                />
              </div>
              
              <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                <label className="input-label mb-3 text-[#888] font-bold text-[10px] uppercase tracking-widest block text-center">Classificação</label>
                <div className="flex justify-center">
                  {renderStars(nota, true)}
                </div>
              </div>

              <div className="group">
                <label className="input-label mb-2 text-[#888] font-bold text-xs uppercase tracking-widest group-focus-within:text-white transition-colors block">Seu Relato</label>
                <textarea 
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="input-field min-h-[120px] resize-none shadow-inner" 
                  placeholder="Como foi a sua experiência com a nossa limpeza?"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-base mt-4 shadow-[0_5px_20px_rgba(255,122,0,0.2)]">
                Publicar Avaliação
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {avaliacoes.length === 0 ? (
            <div className="glass-panel p-16 text-center text-[#888] flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
              <MessageSquareQuote className="w-16 h-16 mb-4 opacity-20 text-sunex-gold" />
              <p className="font-medium text-lg">Nenhuma avaliação ainda. Seja o primeiro a relatar sua experiência!</p>
            </div>
          ) : (
            avaliacoes.map((av, idx) => (
              <div key={av.id} className="glass-panel p-8 animate-in slide-in-from-right-8 duration-500 hover:shadow-2xl hover:shadow-sunex-accent/5 hover:-translate-y-1 transition-all group" style={{animationDelay: `${idx * 100}ms`}}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-xl font-black text-sunex-gold shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                      {av.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg tracking-wide">{av.nome}</h4>
                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#666]">
                        {new Date(av.data).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 bg-black/30 px-3 py-1.5 rounded-full border border-white/5">
                    {renderStars(av.nota)}
                  </div>
                </div>
                <p className="text-[#bbb] leading-[1.8] font-medium text-base relative z-10 pl-4 border-l-2 border-sunex-accent/30 italic">
                  "{av.comentario}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
