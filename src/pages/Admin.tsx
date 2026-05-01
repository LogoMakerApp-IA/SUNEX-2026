import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { escutarPedidos, atualizarStatus, zerarPedidos, deletarPedido, anexarImagemAdmin, Pedido, StatusPedido } from '../lib/pedidos';
import { formatDate } from '../lib/utils';
import { ExternalLink, LogOut, Trash2, Search, ImagePlus, Loader2, X, Eye } from 'lucide-react';

const STATUS_OPTIONS: {value: StatusPedido, label: string}[] = [
  { value: 'aguardando_pagamento', label: 'Aguardando Pagamento' },
  { value: 'pagamento_enviado', label: 'Pagamento em Análise' },
  { value: 'confirmado', label: 'Pedido Confirmado' },
  { value: 'agendado', label: 'Serviço Agendado' },
  { value: 'em_execucao', label: 'Em Execução' },
  { value: 'finalizado', label: 'Finalizado' }
];

export default function Admin() {
   const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void} | null>(null);
  
  // Filtros
  const [filterNome, setFilterNome] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterData, setFilterData] = useState('');
  const [uploadingAdminImage, setUploadingAdminImage] = useState<string | null>(null);
  const [viewImage, setViewImage] = useState<{ url: string, title: string } | null>(null);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('sunex_admin_auth');
    navigate('/login');
  };

  const handleAnexarAdmin = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setUploadingAdminImage(id);
    try {
      await anexarImagemAdmin(id, file);
    } catch (err) {
      alert('Erro ao anexar imagem do admin. Tente novamente.');
    } finally {
      setUploadingAdminImage(null);
    }
  };

  const handleZerar = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Zerar Pedidos',
      message: 'Tem certeza que deseja DELETAR TODOS os pedidos? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        setLoading(true);
        setConfirmDialog(null);
        try {
          await zerarPedidos();
        } catch (e) {
          console.error("Erro ao zerar pedidos:", e);
        }
        setLoading(false);
      }
    });
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Pedido',
      message: `Tem certeza que deseja excluir o pedido ${id}? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await deletarPedido(id);
        } catch (e) {
          console.error("Erro ao deletar pedido:", e);
        }
      }
    });
  };

  useEffect(() => {
    const unsubscribe = escutarPedidos((lista) => {
      setPedidos(lista);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, novoStatus: StatusPedido) => {
    try {
      await atualizarStatus(id, novoStatus);
    } catch (e) {
      alert("Erro ao mudar status.");
    }
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    if (filterNome && !pedido.nome.toLowerCase().includes(filterNome.toLowerCase())) return false;
    if (filterStatus !== 'all' && pedido.status !== filterStatus) return false;
    if (filterData) {
      const pedidoDate = new Date(pedido.data).toISOString().split('T')[0];
      if (pedidoDate !== filterData) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 animate-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-white">Painel Administrativo</h1>
          <p className="text-[#888] mt-2 font-medium tracking-wide">Gerenciamento de solicitações SUNEX do mais recente ao mais antigo.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={handleZerar}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all hover:scale-105 active:scale-95 text-sm font-bold uppercase tracking-wider"
          >
            <Trash2 className="w-4 h-4" />
            Zerar Tudo
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-xl transition-all hover:scale-105 active:scale-95 text-sm font-bold uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in slide-in-from-bottom-8 duration-500 shadow-xl shadow-black/50">
        <div>
          <label className="text-xs uppercase tracking-widest text-[#888] mb-2 font-bold flex items-center gap-2">Buscar por Cliente</label>
          <input 
            type="text" 
            placeholder="Nome do cliente..." 
            value={filterNome}
            onChange={e => setFilterNome(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-sunex-gold transition-colors focus:bg-white/10"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[#888] mb-2 font-bold flex items-center gap-2">Filtrar por Status</label>
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-sunex-gold transition-colors cursor-pointer focus:bg-white/10"
          >
            <option value="all">Todos os Status</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[#888] mb-2 font-bold flex items-center gap-2">Data do Pedido</label>
          <input 
            type="date" 
            value={filterData}
            onChange={e => setFilterData(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white outline-none focus:border-sunex-gold transition-colors [color-scheme:dark] focus:bg-white/10"
          />
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-12 duration-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left bg-transparent">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-[#888]">ID / Data</th>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-[#888]">Cliente</th>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-[#888]">Serviço</th>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-[#888]">Pagamento</th>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-[#888]">Anexos</th>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-[#888]">Status</th>
                <th className="p-5 text-[11px] font-black uppercase tracking-widest text-[#888] text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pedidosFiltrados.map(pedido => (
                <tr key={pedido.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="p-5">
                    <div className="font-mono font-bold text-sunex-gold">{pedido.id}</div>
                    <div className="text-xs text-[#888] mt-1 font-medium">{formatDate(new Date(pedido.data))}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-white text-sm">{pedido.nome}</div>
                    <div className="text-xs text-blue-400 mt-1 hover:underline cursor-pointer">{pedido.email}</div>
                    <div className="text-xs text-[#888] mt-1 tracking-wide">{pedido.telefone}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-sm text-white">{pedido.servico}</div>
                    <div className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-[#bbb] mt-2 inline-block shadow-inner">{pedido.placas} Painéis</div>
                  </td>
                  <td className="p-5">
                    <div className={`text-[10px] font-black uppercase tracking-widest inline-block px-2 py-1 rounded border ${pedido.pagamento === 'pix' ? 'text-teal-400 bg-teal-400/10 border-teal-400/20' : 'text-amber-400 bg-amber-400/10 border-amber-400/20'}`}>
                      {pedido.pagamento}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      {pedido.comprovanteUrl ? (
                        <div className="relative group/preview inline-block">
                          <button onClick={() => setViewImage({ url: pedido.comprovanteUrl!, title: 'Comprovante' })} className="inline-flex items-center justify-center p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-blue-400 transition-all hover:scale-105" title="Ver Comprovante">
                            <Eye className="w-4 h-4" />
                          </button>
                          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 z-50 opacity-0 invisible group-hover/preview:opacity-100 group-hover/preview:visible transition-all duration-200 pointer-events-none data-[side=left]:-translate-x-2">
                            <div className="bg-[#111] p-3 rounded-2xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                              <div className="w-[280px] h-[350px] bg-black/50 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                                <img src={pedido.comprovanteUrl} alt="Comprovante" className="max-w-full max-h-full object-contain" />
                              </div>
                              <div className="text-center mt-3 text-[10px] font-bold text-[#888] uppercase tracking-widest">
                                Preview do Comprovante
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-white/20 text-sm">-</span>
                      )}

                      {pedido.imagemAdminUrl ? (
                        <div className="relative group/preview inline-block">
                          <button onClick={() => setViewImage({ url: pedido.imagemAdminUrl!, title: 'Foto do Local' })} className="inline-flex items-center justify-center p-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-400 transition-all hover:scale-105" title="Ver Foto do Local">
                            <Eye className="w-4 h-4" />
                          </button>
                          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 z-50 opacity-0 invisible group-hover/preview:opacity-100 group-hover/preview:visible transition-all duration-200 pointer-events-none data-[side=left]:-translate-x-2">
                            <div className="bg-[#111] p-3 rounded-2xl border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                              <div className="w-[280px] h-[350px] bg-black/50 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                                <img src={pedido.imagemAdminUrl} alt="Foto do Local" className="max-w-full max-h-full object-contain" />
                              </div>
                              <div className="text-center mt-3 text-[10px] font-bold text-[#888] uppercase tracking-widest">
                                Preview da Foto do Local
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="inline-flex items-center justify-center p-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-emerald-400 transition-all hover:scale-105 cursor-pointer" title="Anexar Foto do Local (Antes/Depois)">
                          {uploadingAdminImage === pedido.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <ImagePlus className="w-4 h-4" />
                              <input type="file" accept="image/*" className="hidden" disabled={uploadingAdminImage === pedido.id} onChange={(e) => handleAnexarAdmin(pedido.id, e)} />
                            </>
                          )}
                        </label>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <select 
                      value={pedido.status}
                      onChange={(e) => handleStatusChange(pedido.id, e.target.value as StatusPedido)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-bold uppercase tracking-wider text-white focus:outline-none focus:border-sunex-accent outline-none cursor-pointer focus:ring-2 focus:ring-sunex-accent/20 transition-all"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleDelete(pedido.id)}
                      className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Excluir Pedido"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {pedidosFiltrados.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-16 text-center text-[#888]">
                    <div className="inline-flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-white/20" />
                      </div>
                      <p className="font-bold text-lg text-white mb-1">Nenhum pedido encontrado</p>
                      <p className="text-sm">Ajuste os filtros ou aguarde novas solicitações.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-3">{confirmDialog.title}</h3>
            <p className="text-[#888] text-sm mb-6 leading-relaxed bg-white-5">{confirmDialog.message}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-bold text-sm uppercase tracking-wider border border-white/10"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold text-sm uppercase tracking-wider"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {viewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setViewImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-md border border-white/10 font-bold z-10">
              {viewImage.title}
            </div>
            <button 
              onClick={() => setViewImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={viewImage.url} alt={viewImage.title} className="max-w-full max-h-full object-contain rounded-xl border border-white/10 shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
