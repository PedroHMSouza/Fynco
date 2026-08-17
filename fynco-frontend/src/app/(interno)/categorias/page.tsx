'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Categoria } from '@/interfaces';
import { fetchApi } from '@/utils/fetchApi';

export default function CategoriasPage() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const [erroGeral, setErroGeral] = useState('');

    const [form, setForm] = useState({ nome: '', tipo: '' });

    useEffect(() => {
        buscarCategorias();
    }, []);

    function buscarCategorias() {
        fetchApi('/api/categorias')
            .then(setCategorias)
            .catch(() => setErroGeral('Erro ao carregar categorias.'));
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        try {
            await fetchApi('/api/categorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            setForm({ nome: '', tipo: '' });
            setMostrarForm(false);
            buscarCategorias();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao salvar categoria.');
        } finally {
            setCarregando(false);
        }
    }

    async function handleDeletar(id: number) {
        try {
            await fetchApi(`/api/categorias/${id}`, { method: 'DELETE' });
            buscarCategorias();
        } catch {
            setErroGeral(
                'Não é possível excluir esta categoria pois ela possui receitas ou despesas vinculadas.'
            );
        }
    }

    const inputClass =
        'w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 transition-colors';

    const receitas = categorias.filter((c) => c.tipo === 'RECEITA');
    const despesas = categorias.filter((c) => c.tipo === 'DESPESA');

    return (
        <>
            <Header titulo="Categorias" />
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
                    {mostrarForm ? '✕ Cancelar' : '+ Nova Categoria'}
                </button>

                {mostrarForm && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-[#1a3a5c] mb-4">Nova Categoria</h3>
                        <form onSubmit={handleSalvar} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Alimentação, Salário"
                                    required
                                    value={form.nome}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Tipo
                                </label>
                                <select
                                    required
                                    value={form.tipo}
                                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="RECEITA">Receita</option>
                                    <option value="DESPESA">Despesa</option>
                                </select>
                            </div>

                            {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

                            <button
                                type="submit"
                                disabled={carregando}
                                className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                            >
                                {carregando ? 'Salvando...' : 'Salvar Categoria'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-teal-500 mb-4">📈 Receitas</h3>
                        {receitas.length === 0 ? (
                            <p className="text-sm text-gray-400">Nenhuma categoria de receita.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {receitas.map((c) => (
                                    <div
                                        key={c.idCategoria}
                                        className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                                    >
                                        <span className="text-sm text-[#1a3a5c] font-medium">{c.nome}</span>
                                        <button
                                            onClick={() => handleDeletar(c.idCategoria)}
                                            className="text-red-400 hover:text-red-600 text-xs cursor-pointer bg-transparent border-none"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-red-400 mb-4">📉 Despesas</h3>
                        {despesas.length === 0 ? (
                            <p className="text-sm text-gray-400">Nenhuma categoria de despesa.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {despesas.map((c) => (
                                    <div
                                        key={c.idCategoria}
                                        className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                                    >
                                        <span className="text-sm text-[#1a3a5c] font-medium">{c.nome}</span>
                                        <button
                                            onClick={() => handleDeletar(c.idCategoria)}
                                            className="text-red-400 hover:text-red-600 text-xs cursor-pointer bg-transparent border-none"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </>
    );
}