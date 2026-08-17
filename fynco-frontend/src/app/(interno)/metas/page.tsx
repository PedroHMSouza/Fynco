'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { MetaFinanceira } from '@/interfaces';
import { formatarData } from '@/utils/formatarData';
import { fetchApi } from '@/utils/fetchApi';
import { dataAtual } from '@/utils/dataAtual';

export default function MetasPage() {
    const [metas, setMetas] = useState<MetaFinanceira[]>([]);
    const [idUsuario, setIdUsuario] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [erro, setErro] = useState('');
    const [erroGeral, setErroGeral] = useState('');
    const [metaSelecionada, setMetaSelecionada] = useState<MetaFinanceira | null>(null);
    const [valorProgresso, setValorProgresso] = useState('');
    const [metaEditando, setMetaEditando] = useState<MetaFinanceira | null>(null);

    const [form, setForm] = useState({
        descricaoMeta: '',
        valorObjetivo: '',
        dataInicio: dataAtual(),
        dataFim: '',
    });

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (usuario?.idUsuario) setIdUsuario(usuario.idUsuario);
    }, []);

    useEffect(() => {
        if (!idUsuario) return;
        buscarMetas();
    }, [idUsuario]);

    function buscarMetas() {
        fetchApi(`/api/metas/usuario/${idUsuario}`)
            .then(setMetas)
            .catch(() => setErroGeral('Erro ao carregar metas.'));
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        try {
            await fetchApi('/api/metas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { idUsuario },
                    descricaoMeta: form.descricaoMeta,
                    valorObjetivo: Number(form.valorObjetivo),
                    dataInicio: form.dataInicio,
                    dataFim: form.dataFim || null,
                }),
            });
            setForm({ descricaoMeta: '', valorObjetivo: '', dataInicio: '', dataFim: '' });
            setMostrarForm(false);
            buscarMetas();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao salvar meta.');
        } finally {
            setCarregando(false);
        }
    }

    async function handleDeletar(id: number) {
        try {
            await fetchApi(`/api/metas/${id}?idUsuario=${idUsuario}`, {
                method: 'DELETE',
            });
            buscarMetas();
        } catch {
            setErroGeral('Erro ao deletar meta.');
        }
    }

    async function handleAtualizar(e: React.FormEvent) {
        e.preventDefault();
        if (!metaEditando) return;
        setCarregando(true);
        setErro('');
        try {
            await fetchApi(`/api/metas/${metaEditando.idMeta}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { idUsuario },
                    descricaoMeta: form.descricaoMeta,
                    valorObjetivo: Number(form.valorObjetivo),
                    dataInicio: form.dataInicio,
                    dataFim: form.dataFim || null,
                }),
            });
            setMetaEditando(null);
            setMostrarForm(false);
            setForm({ descricaoMeta: '', valorObjetivo: '', dataInicio: dataAtual(), dataFim: '' });
            buscarMetas();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao atualizar meta.');
        } finally {
            setCarregando(false);
        }
    }

    function iniciarEdicao(meta: MetaFinanceira) {
        setMetaEditando(meta);
        setForm({
            descricaoMeta: meta.descricaoMeta,
            valorObjetivo: String(meta.valorObjetivo),
            dataInicio: meta.dataInicio,
            dataFim: meta.dataFim || '',
        });
        setMostrarForm(true);
    }

    async function handleProgresso(e: React.FormEvent) {
        e.preventDefault();
        if (!metaSelecionada) return;
        try {
            await fetchApi(`/api/metas/${metaSelecionada.idMeta}/progresso`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Number(valorProgresso)),
            });
            setMetaSelecionada(null);
            setValorProgresso('');
            buscarMetas();
        } catch {
            setErroGeral('Erro ao atualizar progresso.');
        }
    }

    function formatarMoeda(valor: number) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function calcularProgresso(meta: MetaFinanceira) {
        if (meta.valorObjetivo === 0) return 0;
        return Math.min(Math.round((meta.valorAtual / meta.valorObjetivo) * 100), 100);
    }

    function corProgresso(progresso: number) {
        if (progresso >= 75) return 'bg-teal-400';
        if (progresso >= 40) return 'bg-yellow-400';
        return 'bg-red-400';
    }

    const inputClass =
        'w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 transition-colors';

    return (
        <>
            <Header titulo="Metas Financeiras" />
            <main className="p-10 flex flex-col gap-6">

                {erroGeral && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {erroGeral}
                    </div>
                )}

                <button
                    onClick={() => setMostrarForm(!mostrarForm)}
                    className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
                >
                    {mostrarForm ? '✕ Cancelar' : '+ Criar Nova Meta'}
                </button>

                {mostrarForm && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-[#1a3a5c] mb-4">
                            {metaEditando ? 'Editar Meta' : 'Nova Meta'}
                        </h3>
                        <form onSubmit={metaEditando ? handleAtualizar : handleSalvar} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Nome da Meta
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Novo carro, Reserva de emergência"
                                    required
                                    value={form.descricaoMeta}
                                    onChange={(e) => setForm({ ...form, descricaoMeta: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Valor Objetivo (R$)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0,00"
                                    required
                                    value={form.valorObjetivo}
                                    onChange={(e) => setForm({ ...form, valorObjetivo: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Data de Início
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={form.dataInicio}
                                    onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                    className={`${inputClass} cursor-pointer`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Data Limite{' '}
                                    <span className="text-gray-400 font-normal">(opcional)</span>
                                </label>
                                <input
                                    type="date"
                                    value={form.dataFim}
                                    onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

                            <button
                                type="submit"
                                disabled={carregando}
                                className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                            >
                                {carregando ? 'Salvando...' : metaEditando ? 'Atualizar Meta' : 'Criar Meta'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-[#1a3a5c] mb-4">Minhas Metas</h3>
                    {metas.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhuma meta registrada.</p>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {metas.map((meta) => {
                                const progresso = calcularProgresso(meta);
                                return (
                                    <div key={meta.idMeta} className="bg-gray-50 rounded-xl p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-[#1a3a5c]">{meta.descricaoMeta}</h4>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Objetivo: {formatarMoeda(meta.valorObjetivo)}
                                                    {meta.dataFim && ` · Prazo: ${formatarData(meta.dataFim)}`}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setMetaSelecionada(meta)}
                                                    className="text-teal-500 hover:text-teal-700 text-xs font-semibold cursor-pointer bg-transparent border-none"
                                                >
                                                    + Valor
                                                </button>
                                                <span className="text-sm font-bold text-[#1a3a5c]">{progresso}%</span>
                                                <button
                                                    onClick={() => iniciarEdicao(meta)}
                                                    className="text-teal-500 hover:text-teal-700 text-xs font-semibold cursor-pointer bg-transparent border-none"
                                                >
                                                    ✏️
                                                </button>
                                                <button

                                                    onClick={() => handleDeletar(meta.idMeta)}
                                                    className="text-red-400 hover:text-red-600 text-xs cursor-pointer bg-transparent border-none"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                            <div
                                                className={`${corProgresso(progresso)} h-3 rounded-full transition-all`}
                                                style={{ width: `${progresso}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Acumulado: {formatarMoeda(meta.valorAtual)}</span>
                                            <span>
                                                Faltam:{' '}
                                                {formatarMoeda(Math.max(meta.valorObjetivo - meta.valorAtual, 0))}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {metaSelecionada && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                            <h3 className="text-lg font-bold text-[#1a3a5c] mb-1">Atualizar Progresso</h3>
                            <p className="text-sm text-gray-400 mb-6">
                                {metaSelecionada.descricaoMeta} · Acumulado:{' '}
                                {formatarMoeda(metaSelecionada.valorAtual)} de{' '}
                                {formatarMoeda(metaSelecionada.valorObjetivo)}
                            </p>
                            <form onSubmit={handleProgresso} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                        Valor a adicionar (R$)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0,00"
                                        required
                                        value={valorProgresso}
                                        onChange={(e) => setValorProgresso(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 transition-colors"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setMetaSelecionada(null); setValorProgresso(''); }}
                                        className="flex-1 border-2 border-gray-200 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </>
    );
}