'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Despesa, Categoria } from '@/interfaces';
import { formatarData } from '@/utils/formatarData';
import { fetchApi } from '@/utils/fetchApi';
import { dataAtual } from '@/utils/dataAtual';

export default function GastosPage() {
    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [idUsuario, setIdUsuario] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [erro, setErro] = useState('');
    const [erroGeral, setErroGeral] = useState('');
    const [despesaEditando, setDespesaEditando] = useState<Despesa | null>(null);

    const [form, setForm] = useState({
        valor: '',
        descricao: '',
        dataGasto: dataAtual(),
        idCategoria: '',
    });

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (usuario?.idUsuario) setIdUsuario(usuario.idUsuario);
    }, []);

    useEffect(() => {
        if (!idUsuario) return;
        buscarDespesas();
        fetch('/api/categorias?tipo=DESPESA')
            .then((r) => r.json())
            .then(setCategorias);
    }, [idUsuario]);

    function buscarDespesas() {
        fetchApi(`/api/despesas/usuario/${idUsuario}`)
            .then(setDespesas)
            .catch(() => setErroGeral('Erro ao carregar despesas.'));
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        try {
            await fetchApi('/api/despesas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { idUsuario },
                    categoria: { idCategoria: Number(form.idCategoria) },
                    valor: Number(form.valor),
                    descricao: form.descricao,
                    dataGasto: form.dataGasto,
                }),
            });
            setForm({ valor: '', descricao: '', dataGasto: '', idCategoria: '' });
            setMostrarForm(false);
            buscarDespesas();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao salvar gasto.');
        } finally {
            setCarregando(false);
        }
    }

    async function handleDeletar(id: number) {
        try {
            await fetchApi(`/api/despesas/${id}?idUsuario=${idUsuario}`, {
                method: 'DELETE',
            });
            buscarDespesas();
        } catch {
            setErroGeral('Erro ao deletar gasto.');
        }
    }

    async function handleAtualizar(e: React.FormEvent) {
        e.preventDefault();
        if (!despesaEditando) return;
        setCarregando(true);
        setErro('');
        try {
            await fetchApi(`/api/despesas/${despesaEditando.idDespesa}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { idUsuario },
                    categoria: { idCategoria: Number(form.idCategoria) },
                    valor: Number(form.valor),
                    descricao: form.descricao,
                    dataGasto: form.dataGasto,
                }),
            });
            setDespesaEditando(null);
            setMostrarForm(false);
            setForm({ valor: '', descricao: '', dataGasto: dataAtual(), idCategoria: '' });
            buscarDespesas();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao atualizar gasto.');
        } finally {
            setCarregando(false);
        }
    }

    function iniciarEdicao(d: Despesa) {
        setDespesaEditando(d);
        setForm({
            valor: String(d.valor),
            descricao: d.descricao,
            dataGasto: d.dataGasto,
            idCategoria: String(d.categoria?.idCategoria || ''),
        });
        setMostrarForm(true);
    }

    const total = despesas.reduce((acc, d) => acc + d.valor, 0);

    function formatarMoeda(valor: number) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    const inputClass =
        'w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-red-400 transition-colors';

    return (
        <>
            <Header titulo="Gastos" />
            <main className="p-10 flex flex-col gap-6">

                {erroGeral && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {erroGeral}
                    </div>
                )}

                {/* Card total */}
                <div className="bg-gradient-to-br from-red-500 to-red-400 text-white p-8 rounded-xl shadow">
                    <p className="text-sm opacity-90 mb-2">Total de Gastos</p>
                    <p className="text-4xl font-bold">{formatarMoeda(total)}</p>
                </div>

                {/* Botão adicionar */}
                <button
                    onClick={() => setMostrarForm(!mostrarForm)}
                    className="bg-red-400 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
                >
                    {mostrarForm ? '✕ Cancelar' : '+ Adicionar Gasto'}
                </button>

                {/* Formulário */}
                {mostrarForm && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-[#1a3a5c] mb-4">
                            {despesaEditando ? 'Editar Gasto' : 'Novo Gasto'}
                        </h3>
                        <form onSubmit={despesaEditando ? handleAtualizar : handleSalvar} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Valor (R$)
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
                                    Categoria
                                </label>
                                <select
                                    required
                                    value={form.idCategoria}
                                    onChange={(e) => setForm({ ...form, idCategoria: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="">Selecione...</option>
                                    {categorias.map((c) => (
                                        <option key={c.idCategoria} value={c.idCategoria}>
                                            {c.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Descrição
                                </label>
                                <input
                                    type="text"
                                    placeholder="Descrição do gasto"
                                    required
                                    value={form.descricao}
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Data do Gasto
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={form.dataGasto}
                                    onChange={(e) => setForm({ ...form, dataGasto: e.target.value })}
                                    onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                                    className={`${inputClass} cursor-pointer`}
                                />
                            </div>

                            {erro && (
                                <p className="text-red-500 text-sm text-center">{erro}</p>
                            )}

                            <button
                                type="submit"
                                disabled={carregando}
                                className="bg-red-400 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                            >
                                {carregando ? 'Salvando...' : despesaEditando ? 'Atualizar Gasto' : 'Salvar Gasto'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Histórico */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-[#1a3a5c] mb-4">
                        Histórico de Gastos
                    </h3>
                    {despesas.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhum gasto registrado.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {despesas.map((d) => (
                                <div
                                    key={d.idDespesa}
                                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-lg">
                                            💸
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-[#1a3a5c]">
                                                {d.descricao}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {d.categoria?.nome} · {formatarData(d.dataGasto)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-red-400 font-bold text-sm">
                                            - {formatarMoeda(d.valor)}
                                        </span>
                                        <button
                                            onClick={() => iniciarEdicao(d)}
                                            className="text-teal-500 hover:text-teal-700 text-xs font-semibold cursor-pointer bg-transparent border-none"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeletar(d.idDespesa)}
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