'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Receita, Categoria } from '@/interfaces';
import { formatarData } from '@/utils/formatarData';
import { fetchApi } from '@/utils/fetchApi';
import { dataAtual } from '@/utils/dataAtual';

export default function ReceitasPage() {
    const [receitas, setReceitas] = useState<Receita[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [idUsuario, setIdUsuario] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [erro, setErro] = useState('');
    const [erroGeral, setErroGeral] = useState('');
    const [receitaEditando, setReceitaEditando] = useState<Receita | null>(null);

    const [form, setForm] = useState({
        valor: '',
        descricao: '',
        dataRecebimento: dataAtual(),
        idCategoria: '',
    });

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (usuario?.idUsuario) setIdUsuario(usuario.idUsuario);
    }, []);

    useEffect(() => {
        if (!idUsuario) return;
        buscarReceitas();
        fetch('/api/categorias?tipo=RECEITA')
            .then((r) => r.json())
            .then(setCategorias);
    }, [idUsuario]);

    function buscarReceitas() {
        fetchApi(`/api/receitas/usuario/${idUsuario}`)
            .then(setReceitas)
            .catch(() => setErroGeral('Erro ao carregar receitas.'));
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        try {
            await fetchApi('/api/receitas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { idUsuario },
                    categoria: { idCategoria: Number(form.idCategoria) },
                    valor: Number(form.valor),
                    descricao: form.descricao,
                    dataRecebimento: form.dataRecebimento,
                }),
            });
            setForm({ valor: '', descricao: '', dataRecebimento: '', idCategoria: '' });
            setMostrarForm(false);
            buscarReceitas();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao salvar receita.');
        } finally {
            setCarregando(false);
        }
    }

    async function handleDeletar(id: number) {
        try {
            await fetchApi(`/api/receitas/${id}?idUsuario=${idUsuario}`, {
                method: 'DELETE',
            });
            buscarReceitas();
        } catch {
            setErroGeral('Erro ao deletar receita.');
        }
    }

    async function handleAtualizar(e: React.FormEvent) {
        e.preventDefault();
        if (!receitaEditando) return;
        setCarregando(true);
        setErro('');
        try {
            await fetchApi(`/api/receitas/${receitaEditando.idReceita}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { idUsuario },
                    categoria: { idCategoria: Number(form.idCategoria) },
                    valor: Number(form.valor),
                    descricao: form.descricao,
                    dataRecebimento: form.dataRecebimento,
                }),
            });
            setReceitaEditando(null);
            setForm({ valor: '', descricao: '', dataRecebimento: dataAtual(), idCategoria: '' });
            setReceitaEditando(null);
            setMostrarForm(false);
            setForm({ valor: '', descricao: '', dataRecebimento: dataAtual(), idCategoria: '' });
            buscarReceitas();
            buscarReceitas();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao atualizar receita.');
        } finally {
            setCarregando(false);
        }
    }

    function iniciarEdicao(r: Receita) {
        setReceitaEditando(r);
        setForm({
            valor: String(r.valor),
            descricao: r.descricao,
            dataRecebimento: r.dataRecebimento,
            idCategoria: String(r.categoria?.idCategoria || ''),
        });
        setMostrarForm(true);
    }

    const total = receitas.reduce((acc, r) => acc + r.valor, 0);

    function formatarMoeda(valor: number) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    const inputClass =
        'w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 transition-colors';

    return (
        <>
            <Header titulo="Receitas" />
            <main className="p-10 flex flex-col gap-6">

                {erroGeral && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {erroGeral}
                    </div>
                )}

                {/* Card total */}
                <div className="bg-gradient-to-br from-teal-500 to-teal-400 text-white p-8 rounded-xl shadow">
                    <p className="text-sm opacity-90 mb-2">Total de Receitas</p>
                    <p className="text-4xl font-bold">{formatarMoeda(total)}</p>
                </div>

                {/* Botão adicionar */}
                <button
                    onClick={() => setMostrarForm(!mostrarForm)}
                    className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
                >
                    {mostrarForm ? '✕ Cancelar' : '+ Adicionar Receita'}
                </button>

                {/* Formulário */}
                {mostrarForm && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-[#1a3a5c] mb-4">
                            {receitaEditando ? 'Editar Receita' : 'Nova Receita'}
                        </h3>
                        <form onSubmit={receitaEditando ? handleAtualizar : handleSalvar} className="flex flex-col gap-4">
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
                                    placeholder="Descrição da receita"
                                    required
                                    value={form.descricao}
                                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Data de Recebimento
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={form.dataRecebimento}
                                    onChange={(e) => setForm({ ...form, dataRecebimento: e.target.value })}
                                    onClick={(e) => (e.target as HTMLInputElement).showPicker}
                                    className={`${inputClass} cursor-pointer`}
                                />
                            </div>

                            {erro && (
                                <p className="text-red-500 text-sm text-center">{erro}</p>
                            )}

                            <button
                                type="submit"
                                disabled={carregando}
                                className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                            >
                                {carregando ? 'Salvando...' : receitaEditando ? 'Atualizar Receita' : 'Salvar Receita'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Histórico */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-[#1a3a5c] mb-4">
                        Histórico de Receitas
                    </h3>
                    {receitas.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhuma receita registrada.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {receitas.map((r) => (
                                <div
                                    key={r.idReceita}
                                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-lg">
                                            💰
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-[#1a3a5c]">
                                                {r.descricao}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {r.categoria?.nome} · {formatarData(r.dataRecebimento)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-teal-500 font-bold text-sm">
                                            + {formatarMoeda(r.valor)}
                                        </span>
                                        <button
                                            onClick={() => iniciarEdicao(r)}
                                            className="text-teal-500 hover:text-teal-700 text-xs font-semibold cursor-pointer bg-transparent border-none"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeletar(r.idReceita)}
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