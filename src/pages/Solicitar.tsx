import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarPedido } from '../lib/pedidos';
import { generateId } from '../lib/utils';
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft, ChevronDown, Rocket, ShieldCheck } from 'lucide-react';

export default function Solicitar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  
  // States for form data
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    placas: '',
    servico: 'Essencial',
    pagamento: 'pix'
  });

  const dropdownOptions = [
    { value: 'Essencial', label: 'Essencial (Limpeza Padrão)' },
    { value: 'Performance', label: 'Performance (Limpeza + Inspeção Visual)' },
    { value: 'Elite', label: 'Elite (Limpeza + Inspeção + Aplicação Protetora)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectService = (val: string) => {
    setFormData(prev => ({ ...prev, servico: val }));
    setIsSelectOpen(false);
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.nome || !formData.email || !formData.telefone || !formData.endereco) {
        alert("Preencha todos os campos.");
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }
      
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const novoId = generateId();
      await criarPedido({
        id: novoId,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        placas: Number(formData.placas),
        servico: formData.servico as any,
        pagamento: formData.pagamento as any,
        status: 'aguardando_pagamento',
        comprovanteUrl: '',
        data: new Date().toISOString()
      });
      setSuccessId(novoId);
    } catch (error) {
      alert('Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (successId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="glass-panel text-center p-12 max-w-lg w-full">
          <div className="mx-auto bg-green-500/20 shadow-[0_0_50px_rgba(74,222,128,0.3)] text-green-400 p-5 rounded-full inline-flex mb-8">
            <CheckCircle2 className="h-14 w-14" />
          </div>
          <h2 className="text-3xl font-black mb-3 text-white">Pedido Registrado!</h2>
          <p className="text-[#888] font-medium leading-relaxed mb-8">Sua solicitação foi salva com sucesso. Guarde o seu código exclusivo abaixo para acompanhar o status e fazer o pagamento.</p>
          <div className="bg-black/50 border border-white/10 rounded-2xl p-6 mb-10 shadow-inner">
            <span className="text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent tracking-widest">{successId}</span>
          </div>
          <button
            onClick={() => navigate(`/acompanhar?id=${successId}`)}
            className="btn-primary group"
          >
            Acompanhar Agora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 lg:grid lg:grid-cols-2 p-6 lg:p-0 relative w-full max-w-[1600px] mx-auto z-10">
      
      {/* Visual / Info Left Side */}
      <div className="hidden lg:flex flex-col justify-center p-[4rem_5rem] relative">
         <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-sunex-gold/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
         
         <div className="hero-badge mb-6 gap-2"><Rocket className="w-3.5 h-3.5" /> PROCESSO RÁPIDO</div>
         <h2 className="text-[4rem] leading-[1.05] font-black text-white mb-8 tracking-tight">
           Pronto para<br/>brilhar <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunex-gold to-sunex-accent">mais?</span>
         </h2>
         <p className="text-[#888] max-w-lg text-lg font-medium leading-relaxed mb-12">
           Preencha o formulário e nossa equipe avaliará sua solicitação em minutos. Aplicamos o tratamento ideal para a máxima captação de fótons.
         </p>

         <div className="flex gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md">
              <ShieldCheck className="text-sunex-gold w-6 h-6" />
              <span className="text-sm font-bold tracking-wide uppercase text-white">100% Seguro</span>
            </div>
         </div>
      </div>

      {/* Form Right Side */}
      <div className="bg-gradient-to-l from-white/[0.02] to-transparent lg:border-l border-white/5 flex flex-col justify-center items-center lg:p-12 w-full">
        <div className="glass-panel p-8 sm:p-10 w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <h3 className="text-2xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Solicitar Orçamento</h3>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-10">
            <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-gradient-to-r from-sunex-gold to-sunex-accent shadow-[0_0_15px_rgba(255,122,0,0.3)]' : 'bg-white/10'}`}></div>
            <div className={`h-2 flex-1 rounded-full transition-all duration-500 delay-100 ${step >= 2 ? 'bg-gradient-to-r from-sunex-gold to-sunex-accent shadow-[0_0_15px_rgba(255,122,0,0.3)]' : 'bg-white/10'}`}></div>
          </div>

          <form onSubmit={step === 1 ? nextStep : handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h4 className="text-sm font-black uppercase tracking-widest text-[#888] mb-6 flex items-center gap-3">
                  <span className="w-6 h-[2px] bg-sunex-gold/50 block"></span> 1. Dados Pessoais
                </h4>
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="input-label">Nome Completo</label>
                    <input required name="nome" value={formData.nome} onChange={handleInputChange} type="text" className="input-field" placeholder="Ex: João da Silva"/>
                  </div>
                  <div>
                    <label className="input-label">E-mail</label>
                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="input-field" placeholder="seu@email.com"/>
                  </div>
                  <div>
                    <label className="input-label">Telefone / WhatsApp</label>
                    <input required name="telefone" value={formData.telefone} onChange={handleInputChange} type="tel" className="input-field" placeholder="(00) 00000-0000"/>
                  </div>
                  <div>
                    <label className="input-label">Endereço Completo</label>
                    <input required name="endereco" value={formData.endereco} onChange={handleInputChange} type="text" className="input-field" placeholder="Rua, Número, Bairro, Cidade - Estado"/>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5">
                  <button type="submit" className="btn-primary group">
                    Avançar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h4 className="text-sm font-black uppercase tracking-widest text-[#888] mb-6 flex items-center gap-3">
                  <span className="w-6 h-[2px] bg-sunex-gold/50 block"></span> 2. Detalhes do Serviço
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="input-label">Quantidade de Placas</label>
                    <input required name="placas" value={formData.placas} onChange={handleInputChange} type="number" min="1" className="input-field" placeholder="Ex: 8"/>
                  </div>
                  <div className="relative">
                    <label className="input-label">Tipo de Serviço</label>
                    <div 
                      className="input-field cursor-pointer text-sm flex items-center justify-between group"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                    >
                      <span className={formData.servico ? 'text-white font-medium' : 'text-gray-500'}>
                        {dropdownOptions.find(opt => opt.value === formData.servico)?.label.split(' (')[0] || 'Selecione...'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isSelectOpen ? 'rotate-180 text-sunex-gold' : 'group-hover:text-white'}`} />
                    </div>
                    {isSelectOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-[#141416] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-3xl">
                        {dropdownOptions.map(opt => (
                          <div 
                            key={opt.value}
                            className={`px-4 py-3.5 text-sm cursor-pointer transition-colors font-medium border-b border-white/5 last:border-0 ${formData.servico === opt.value ? 'bg-sunex-accent/10 text-sunex-gold' : 'text-white hover:bg-white/5'}`}
                            onClick={() => handleSelectService(opt.value)}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="input-label">Forma de Pagamento</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="relative flex cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
                      <input type="radio" name="pagamento" value="pix" onChange={handleInputChange} checked={formData.pagamento === 'pix'} className="peer sr-only" />
                      <div className="flex flex-col w-full text-center">
                        <span className="font-bold text-[#888] text-sm peer-checked:text-sunex-gold uppercase tracking-wider transition-colors">PIX Antecipado</span>
                      </div>
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-sunex-accent pointer-events-none transition-colors shadow-[0_0_15px_rgba(255,122,0,0)] peer-checked:shadow-[0_0_15px_rgba(255,122,0,0.15)]"></div>
                    </label>
                    
                    <label className="relative flex cursor-pointer rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
                      <input type="radio" name="pagamento" value="local" onChange={handleInputChange} checked={formData.pagamento === 'local'} className="peer sr-only" />
                      <div className="flex flex-col w-full text-center">
                        <span className="font-bold text-[#888] text-sm peer-checked:text-sunex-gold uppercase tracking-wider transition-colors">No Local</span>
                      </div>
                      <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-sunex-accent pointer-events-none transition-colors shadow-[0_0_15px_rgba(255,122,0,0)] peer-checked:shadow-[0_0_15px_rgba(255,122,0,0.15)]"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                  <button type="button" onClick={prevStep} className="btn-secondary sm:w-1/3 flex items-center justify-center gap-2 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Voltar
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary sm:w-2/3 flex items-center justify-center gap-2 flex-1"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : null}
                    {loading ? 'Processando...' : 'Confirmar Solicitação'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
