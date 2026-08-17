'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Investimento } from '@/interfaces';
import { formatarData } from '@/utils/formatarData';
import { fetchApi } from '@/utils/fetchApi';
import { dataAtual } from '@/utils/dataAtual';

export default function InvestimentosPage() {
    const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
    const [idUsuario, setIdUsuario] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [erro, setErro] = useState('');
    const [erroGeral, setErroGeral] = useState('');
    const [investimentoEditando, setInvestimentoEditando] = useState<Investimento | null>(null);

    const [form, setForm] = useState({
        tipo: '',
        valor: '',
        taxa: '',
        dataInvestimento: dataAtual(),
    });

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (usuario?.idUsuario) setIdUsuario(usuario.idUsuario);
    }, []);

    useEffect(() => {
        if (!idUsuario) return;
        buscarInvestimentos();
    }, [idUsuario]);

    function buscarInvestimentos() {
        fetchApi(`/api/investimentos/usuario/${idUsuario}`)
            .then(setInvestimentos)
            .catch(() => setErroGeral('Erro ao carregar investimentos.'));
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        try {
            await fetchApi('/api/investimentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { idUsuario },
                    tipo: form.tipo,
                    valor: Number(form.valor),
                    taxa: Number(form.taxa) / 100,
                    dataInvestimento: form.dataInvestimento,
                }),
            });
            setForm({ tipo: '', valor: '', taxa: '', dataInvestimento: '' });
            setMostrarForm(false);
            buscarInvestimentos();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao salvar investimento.');
        } finally {
            setCarregando(false);
        }
    }

    async function handleDeletar(id: number) {
        try {
            await fetchApi(`/api/investimentos/${id}?idUsuario=${idUsuario}`, {
                method: 'DELETE',
            });
            buscarInvestimentos();
        } catch {
            setErroGeral('Erro ao deletar investimento.');
        }
    }

    async function handleAtualizar(e: React.FormEvent) {
        e.preventDefault();
        if (!investimentoEditando) return;
        setCarregando(true);
        setErro('');
        try {
            await fetchApi(`/api/investimentos/${investimentoEditando.idInvestimento}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { idUsuario },
                    tipo: form.tipo,
                    valor: Number(form.valor),
                    taxa: Number(form.taxa) / 100,
                    dataInvestimento: form.dataInvestimento,
                }),
            });
            setInvestimentoEditando(null);
            setMostrarForm(false);
            setForm({ tipo: '', valor: '', taxa: '', dataInvestimento: dataAtual() });
            buscarInvestimentos();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao atualizar investimento.');
        } finally {
            setCarregando(false);
        }
    }

    function iniciarEdicao(inv: Investimento) {
        setInvestimentoEditando(inv);
        setForm({
            tipo: inv.tipo,
            valor: String(inv.valor),
            taxa: String((inv.taxa * 100).toFixed(2)),
            dataInvestimento: inv.dataInvestimento,
        });
        setMostrarForm(true);
    }

    function formatarMoeda(valor: number) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function calcularRendimento(valor: number, taxa: number) {
        return valor * taxa;
    }

    const totalInvestido = investimentos.reduce((acc, i) => acc + i.valor, 0);
    const totalRendimento = investimentos.reduce(
        (acc, i) => acc + calcularRendimento(i.valor, i.taxa),
        0
    );

    const tiposInvestimento = [
        'Tesouro Direto',
        'CDB',
        'LCI',
        'LCA',
        'Poupança',
        'Ações',
        'Fundos Imobiliários',
        'Criptomoedas',
        'Outro',
    ];

    const inputClass =
        'w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 transition-colors';

    return (
        <>
            <Header titulo="Investimentos" />
            <main className="p-10 flex flex-col gap-6">

                {erroGeral && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {erroGeral}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#1a3a5c] to-teal-400 text-white p-8 rounded-xl shadow">
                        <p className="text-sm opacity-90 mb-2">Total Investido</p>
                        <p className="text-3xl font-bold">{formatarMoeda(totalInvestido)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-teal-500 to-teal-300 text-white p-8 rounded-xl shadow">
                        <p className="text-sm opacity-90 mb-2">Rendimento Estimado</p>
                        <p className="text-3xl font-bold">{formatarMoeda(totalRendimento)}</p>
                    </div>
                </div>

                <button
                    onClick={() => setMostrarForm(!mostrarForm)}
                    className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
                >
                    {mostrarForm ? '✕ Cancelar' : '+ Adicionar Investimento'}
                </button>

                {mostrarForm && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-[#1a3a5c] mb-4">
                            {investimentoEditando ? 'Editar Investimento' : 'Novo Investimento'}
                        </h3>
                        <form onSubmit={investimentoEditando ? handleAtualizar : handleSalvar} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">Tipo</label>
                                <select
                                    required
                                    value={form.tipo}
                                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="">Selecione...</option>
                                    {tiposInvestimento.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Valor Investido (R$)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0,00"
                                    required
                                    value={form.valor}
                                    onChange={(e) => setForm({ ...form, valor: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Taxa de Rendimento (% ao ano)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 12.5 para 12,5%"
                                    required
                                    value={form.taxa}
                                    onChange={(e) => setForm({ ...form, taxa: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Data do Investimento
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={form.dataInvestimento}
                                    onChange={(e) => setForm({ ...form, dataInvestimento: e.target.value })}
                                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                    className={`${inputClass} cursor-pointer`}
                                />
                            </div>

                            {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

                            <button
                                type="submit"
                                disabled={carregando}
                                className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                            >
                                {carregando ? 'Salvando...' : investimentoEditando ? 'Atualizar Investimento' : 'Salvar Investimento'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-[#1a3a5c] mb-4">Meus Investimentos</h3>
                    {investimentos.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhum investimento registrado.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {investimentos.map((inv) => (
                                <div
                                    key={inv.idInvestimento}
                                    className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-lg">
                                            💹
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-[#1a3a5c]">{inv.tipo}</p>
                                            <p className="text-xs text-gray-400">
                                                Taxa: {(inv.taxa * 100).toFixed(2)}% a.a. · {formatarData(inv.dataInvestimento)}
                                            </p>
                                            <p className="text-xs text-teal-500 font-medium mt-1">
                                                Rendimento: +{formatarMoeda(calcularRendimento(inv.valor, inv.taxa))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-bold text-sm text-[#1a3a5c]">
                                            {formatarMoeda(inv.valor)}
                                        </p>
                                        <button
                                            onClick={() => iniciarEdicao(inv)}
                                            className="text-teal-500 hover:text-teal-700 text-xs font-semibold cursor-pointer bg-transparent border-none"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeletar(inv.idInvestimento)}
                                            className="text-red-400 hover:text-red-600 text-xs cursor-pointer bg-transparent border-none"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </>
    );
}