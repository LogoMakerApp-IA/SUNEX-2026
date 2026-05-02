import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buscarPedido, enviarComprovante, escutarPedidoUnico, Pedido } from '../lib/pedidos';
import { formatDate } from '../lib/utils';
import { Search, FileImage, Upload, CheckCircle2, Loader2, AlertCircle, Copy, Link2, X } from 'lucide-react';
import QRCode from 'react-qr-code';

const STATUS_LABELS: Record<string, string> = {
  aguardando_pagamento: 'Aguardando Pagamento',
  pagamento_enviado: 'Pagamento em Análise',
  confirmado: 'Pedido Confirmado',
  agendado: 'Serviço Agendado',
  em_execucao: 'Em Execução',
  finalizado: 'Finalizado'
};

const STATUS_COLORS: Record<string, string> = {
  aguardando_pagamento: 'text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]',
  pagamento_enviado: 'text-blue-400 bg-blue-400/10 border-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.1)]',
  confirmado: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20 shadow-[0_0_15px_rgba(129,140,248,0.1)]',
  agendado: 'text-purple-400 bg-purple-400/10 border-purple-400/20 shadow-[0_0_15px_rgba(192,132,252,0.1)]',
  em_execucao: 'text-sunex-gold bg-sunex-gold/10 border-sunex-gold/20 shadow-[0_0_15px_rgba(255,195,0,0.1)]',
  finalizado: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]'
};

const PLANOS_PRECOS: Record<string, number> = {
  Essencial: 18.0,
  Performance: 15.0,
  Elite: 13.0
};

export default function Acompanhar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [searchId, setSearchId] = useState(initialId);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [chaveCopiada, setChaveCopiada] = useState(false);
  const [viewImage, setViewImage] = useState<string | null>(null);

  // Chave PIX aleatória para testes
  const CHAVE_PIX = "e2d8b74c-8a9d-4c3d-b2a1-ff3d8b2a9e1c";

  const getValorTotal = () => {
    if (!pedido) return 0;
    return pedido.placas * (PLANOS_PRECOS[pedido.servico] || 0);
  };

  const getPixPayload = () => {
    // Generates a mock BR Code for testing purposes
    const valorFloat = getValorTotal().toFixed(2);
    return `00020126580014br.gov.bcb.pix0136${CHAVE_PIX}5204000053039865405${valorFloat}5802BR5905SUNEX6008BRASILIA62070503***6304XXXX`;
  };

  const copiarChave = () => {
    navigator.clipboard.writeText(CHAVE_PIX);
    setChaveCopiada(true);
    setTimeout(() => setChaveCopiada(false), 2000);
  };

  const watchPedido = (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    
    if (unsubscribe) unsubscribe();

    const unsub = escutarPedidoUnico(id, (novoPedido) => {
      if (novoPedido) {
        setPedido(novoPedido);
        setSearchParams({ id: novoPedido.id });
      } else {
        setPedido(null);
        setError('Pedido não encontrado. Verifique o código e tente novamente.');
      }
      setLoading(false);
    });

    setUnsubscribe(() => unsub);
  };

  useEffect(() => {
    if (initialId) watchPedido(initialId);
    return () => { if (unsubscribe) unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    watchPedido(searchId);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pedido) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setUploading(true);
    setUploadSuccess(false);
    try {
      await enviarComprovante(pedido.id, file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      alert('Erro ao enviar comprovante. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const getAcompanharUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/acompanhar?id=${pedido?.id}`;
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 flex flex-col relative z-10">
      
      {/* Image Modal */}
      {viewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setViewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setViewImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={viewImage} alt="Visualização" className="max-w-full max-h-full object-contain rounded-xl border border-white/10 shadow-2xl" />
          </div>
        </div>
      )}

      <div className="mb-10 text-center animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Acompanhar Pedido</h1>
        <p className="text-[#888] font-medium tracking-wide">Digite seu código exclusivo para ver o andamento do seu serviço.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-12 animate-in zoom-in-95 duration-500">
        <div className="relative max-w-lg mx-auto shadow-2xl shadow-sunex-accent/5 rounded-xl">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value.toUpperCase())}
            placeholder="Ex: SUNEX-1234"
            className="w-full bg-black/40 border-2 border-white/10 focus:border-sunex-accent/50 p-4 pl-6 pr-16 rounded-xl text-lg uppercase outline-none transition-all placeholder:text-white/20 backdrop-blur-md"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-gradient-to-br from-sunex-accent to-[#D46600] text-white rounded-lg w-14 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,122,0,0.3)] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl mb-8 mx-auto max-w-md w-full shadow-[0_0_30px_rgba(239,68,68,0.1)] backdrop-blur-md">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {pedido && (
        <div className="glass-panel overflow-hidden transform transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
          <div className="p-6 sm:p-8 border-b border-white/10 bg-gradient-to-r from-white/[0.02] to-transparent flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">{pedido.id}</h2>
              </div>
              <p className="text-[#888] text-sm font-medium">Solicitado em {formatDate(new Date(pedido.data))}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className={`px-5 py-2.5 rounded-lg border-2 text-sm font-bold uppercase tracking-wider backdrop-blur-md ${STATUS_COLORS[pedido.status]}`}>
                {STATUS_LABELS[pedido.status]}
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-sunex-gold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-sunex-gold/50"></span>
                  Detalhes do Cliente
                </h3>
                <div className="bg-black/20 p-5 rounded-xl border border-white/5 backdrop-blur-sm">
                  <p className="font-semibold text-lg mb-1">{pedido.nome}</p>
                  <p className="text-[#888] text-sm mb-1">{pedido.telefone}</p>
                  <p className="text-[#888] text-sm leading-relaxed">{pedido.endereco}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-sunex-gold uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-sunex-gold/50"></span>
                  Resumo do Serviço
                </h3>
                <div className="bg-black/20 rounded-xl p-5 border border-white/5 space-y-4 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[#888] text-sm font-medium">Plano Especialista</span>
                    <span className="font-bold text-sunex-gold tracking-wide">{pedido.servico}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#888] text-sm font-medium">Capacidade Instalada</span>
                    <span className="font-semibold text-white">{pedido.placas} Painéis</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#888] text-sm font-medium">Método de Pagamento</span>
                    <span className="font-bold uppercase text-white bg-white/10 px-3 py-1 rounded-md text-xs">{pedido.pagamento}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-2">
                    <span className="text-[#888] text-sm font-medium">Valor Total</span>
                    <span className="font-black text-xl text-emerald-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getValorTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-dashed md:border-t-0 md:border-l-2 border-white/5 pt-10 md:pt-0 md:pl-10 flex flex-col justify-start">
              {/* PIX AREA */}
              {pedido.pagamento === 'pix' && pedido.status === 'aguardando_pagamento' && !uploadSuccess && !pedido.comprovanteUrl && (
                <div className="animate-in fade-in duration-700">
                  <h3 className="text-xl font-bold mb-4 text-white">Pagamento via PIX</h3>
                  <div className="bg-gradient-to-b from-sunex-accent/10 to-transparent border border-sunex-accent/20 rounded-2xl p-6 mb-6 text-center shadow-[0_0_30px_rgba(255,122,0,0.05)]">
                    
                    <div className="bg-white p-4 rounded-xl inline-block mb-5 shadow-lg shadow-black/50">
                      <QRCode value={getPixPayload()} size={160} level="M" />
                    </div>
                    
                    <p className="text-[#bbb] text-sm mb-4 leading-relaxed tracking-wide">
                      Escaneie o QR Code acima ou copie a chave aleatória de teste abaixo para realizar o pagamento.
                    </p>

                    <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-1 mb-5">
                      <code className="text-xs text-sunex-gold flex-1 text-center font-mono truncate px-2">{CHAVE_PIX}</code>
                      <button 
                        onClick={copiarChave}
                        className="bg-white/10 hover:bg-white/20 p-2.5 rounded-md transition-colors text-white"
                        title="Copiar Chave PIX"
                      >
                        {chaveCopiada ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <label className="relative flex cursor-pointer items-center justify-center gap-2 btn-primary !w-full !rounded-xl !py-4 group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="sr-only" 
                        onChange={handleUpload}
                        disabled={uploading}
                      />
                      <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-xl"></div>
                      {uploading ? (
                        <><Loader2 className="w-5 h-5 animate-spin relative z-10" /> <span className="relative z-10">Enviando...</span></>
                      ) : (
                        <><Upload className="w-5 h-5 relative z-10 group-hover:-translate-y-1 transition-transform" /> <span className="relative z-10">Já Paguei! Enviar Comprovante</span></>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* SUCCESS AREA */}
              {uploadSuccess && (
                <div className="flex flex-col items-center justify-center text-center animate-in zoom-in slide-in-from-bottom-4 duration-500 bg-green-500/5 rounded-2xl border border-green-500/20 p-10 h-full">
                  <div className="bg-green-500/20 text-green-400 p-5 rounded-full mb-5 shadow-[0_0_50px_rgba(74,222,128,0.3)]">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="font-extrabold text-2xl mb-2 text-green-400">Comprovante enviado com sucesso!</h3>
                  <p className="text-[#888] font-medium tracking-wide">Obrigado. Nosso time já foi notificado e fará a conferência em breve.</p>
                </div>
              )}

              {/* ALREADY UPLOADED AREA */}
              {pedido.comprovanteUrl && !uploadSuccess && (
                <div className="flex flex-col items-center text-center h-full justify-center p-8 bg-white/[0.02] border border-white/5 rounded-2xl animate-in fade-in duration-700">
                  <div className="bg-green-500/10 text-green-400 p-4 rounded-full mb-4 ring-4 ring-green-500/5">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white">Comprovante Recebido</h3>
                  <p className="text-[#888] text-sm mb-6">Aguardando a conferência da nossa equipe.</p>
                  <button onClick={() => setViewImage(pedido.comprovanteUrl!)} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <FileImage className="w-5 h-5 text-blue-400" />
                    Visualizar Anexo
                  </button>
                </div>
              )}

              {/* LOCAL PAYMENT AREA */}
              {pedido.pagamento === 'local' && (
                <div className="flex flex-col h-full justify-center">
                  <div className="text-center p-8 bg-gradient-to-br from-sunex-gold/5 to-transparent border border-sunex-gold/10 rounded-2xl shadow-[0_0_30px_rgba(255,195,0,0.05)]">
                    <div className="bg-sunex-gold/10 text-sunex-gold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-sunex-gold/5">
                      <span className="text-2xl font-black">$</span>
                    </div>
                    <h3 className="font-bold text-xl text-sunex-gold mb-3">Pagamento no Local</h3>
                    <p className="text-sm text-[#bbb] leading-relaxed">O pagamento será realizado presencialmente no dia do serviço. Aguarde nosso contato via telefone para a confirmação de horário.</p>
                  </div>
                </div>
              )}

              {/* TRACKING QR CODE (ALWAYS VISIBLE WHEN ORDER FOUND) */}
              <div className="mt-8 bg-black/40 border border-white/5 rounded-xl p-5 flex items-center gap-5 justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-sunex-accent" /> Link de Acompanhamento
                  </h4>
                  <p className="text-xs text-[#888] leading-relaxed">Salve este QR code ou a página para acompanhar as atualizações.</p>
                </div>
                <div className="bg-white p-2 rounded-lg shrink-0">
                  <QRCode value={getAcompanharUrl()} size={60} />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

