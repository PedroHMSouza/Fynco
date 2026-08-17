'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Conta } from '@/interfaces';
import { fetchApi } from '@/utils/fetchApi';
import { setSourceMapsEnabled } from 'process';

export default function ContasPage() {
    const [contas, setContas] = useState<Conta[]>([]);
    const [idUsuario, setIdUsuario] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [erro, setErro] = useState('');
    const [erroGeral, setErroGeral] = useState('');
    const [contaEditando, setContaEditando] = useState<Conta | null>(null);

    const [form, setForm] = useState({
        banco: '',
        tipoConta: '',
        nomeConta: '',
        saldoInicial: '',
    });

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (usuario?.idUsuario) setIdUsuario(usuario.idUsuario);
    }, []);

    useEffect(() => {
        if (!idUsuario) return;
        buscarContas();
    }, [idUsuario]);

    function buscarContas() {
        fetchApi(`/api/contas/usuario/${idUsuario}`)
            .then(setContas)
            .catch(() => setErroGeral('Erro ao carregar contas.'));
    }

    async function handleSalvar(e: React.FormEvent) {
        e.preventDefault();
        setCarregando(true);
        setErro('');
        try {
            await fetchApi('/api/contas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { idUsuario },
                    banco: form.banco,
                    tipoConta: form.tipoConta,
                    nomeConta: form.nomeConta,
                    saldoInicial: Number(form.saldoInicial),
                    saldoAtual: Number(form.saldoInicial),
                }),
            });
            setForm({ banco: '', tipoConta: '', nomeConta: '', saldoInicial: '' });
            setMostrarForm(false);
            buscarContas();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao salvar conta.');
        } finally {
            setCarregando(false);
        }
    }

    async function handleDeletar(id: number) {
        try {
            await fetchApi(`/api/contas/${id}`, { method: 'DELETE' });
            buscarContas();
        } catch {
            setErroGeral('Erro ao deletar conta.');
        }
    }

    async function handleAtualizar(e: React.FormEvent) {
        e.preventDefault();
        if (!contaEditando) return;
        setCarregando(true);
        setErro('');
        try {
            await fetchApi(`/api/contas/${contaEditando.idConta}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario: { idUsuario },
                    banco: form.banco,
                    tipoConta: form.tipoConta,
                    nomeConta: form.nomeConta,
                    saldoInicial: Number(form.saldoInicial),
                    saldoAtual: Number(form.saldoInicial),
                }),
            });
            setContaEditando(null);
            setMostrarForm(false);
            setForm({ banco: '', tipoConta: '', nomeConta: '', saldoInicial: '' });
            buscarContas();
        } catch (e: unknown) {
            setErro(e instanceof Error ? e.message : 'Erro ao atualizar conta.');
        } finally {
            setCarregando(false);
        }
    }

    function iniciarEdicao(c: Conta) {
        setContaEditando(c);
        setForm({
            banco: c.banco,
            tipoConta: c.tipoConta,
            nomeConta: c.nomeConta,
            saldoInicial: String(c.saldoAtual),
        });
        setMostrarForm(true);
    }

    function formatarMoeda(valor: number) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    const tiposIcone: Record<string, string> = {
        CORRENTE: '🏦',
        POUPANCA: '🐷',
        INVESTIMENTO: '📈',
        DIGITAL: '💳',
    };

    const inputClass =
        'w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 transition-colors';

    return (
        <>
            <Header titulo="Contas" />
            <main className="p-10 flex flex-col gap-6">

                {erroGeral && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {erroGeral}
                    </div>
                )}

                {/* Resumo */}
                <div className="bg-gradient-to-br from-[#1a3a5c] to-teal-400 text-white p-8 rounded-xl shadow">
                    <p className="text-sm opacity-90 mb-2">Total em Contas</p>
                    <p className="text-4xl font-bold">
                        {formatarMoeda(contas.reduce((acc, c) => acc + c.saldoAtual, 0))}
                    </p>
                </div>

                {/* Botão adicionar */}
                <button
                    onClick={() => setMostrarForm(!mostrarForm)}
                    className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer"
                >
                    {mostrarForm ? '✕ Cancelar' : '+ Adicionar Conta'}
                </button>

                {/* Formulário */}
                {mostrarForm && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-[#1a3a5c] mb-4">
                            {contaEditando ? 'Editar Conta' : 'Nova Conta'}
                        </h3>
                        <form onSubmit={contaEditando ? handleAtualizar : handleSalvar} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Nome da Conta
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Conta Principal"
                                    required
                                    value={form.nomeConta}
                                    onChange={(e) => setForm({ ...form, nomeConta: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Banco
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: Nubank, Itaú, Bradesco"
                                    required
                                    value={form.banco}
                                    onChange={(e) => setForm({ ...form, banco: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Tipo de Conta
                                </label>
                                <select
                                    required
                                    value={form.tipoConta}
                                    onChange={(e) => setForm({ ...form, tipoConta: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="CORRENTE">Corrente</option>
                                    <option value="POUPANCA">Poupança</option>
                                    <option value="INVESTIMENTO">Investimento</option>
                                    <option value="DIGITAL">Digital</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                    Saldo Inicial (R$)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0,00"
                                    required
                                    value={form.saldoInicial}
                                    onChange={(e) => setForm({ ...form, saldoInicial: e.target.value })}
                                    className={inputClass}
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
                                {carregando ? 'Salvando...' : contaEditando ? 'Atualizar Conta' : 'Salvar Conta'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Lista de contas */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-[#1a3a5c] mb-4">Minhas Contas</h3>
                    {contas.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhuma conta registrada.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {contas.map((c) => (
                                <div
                                    key={c.idConta}
                                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border-l-4 border-teal-400"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{tiposIcone[c.tipoConta] || '🏦'}</span>
                                        <div>
                                            <p className="font-semibold text-sm text-[#1a3a5c]">{c.nomeConta}</p>
                                            <p className="text-xs text-gray-400">{c.banco} · {c.tipoConta}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-teal-500 font-bold text-sm">
                                            {formatarMoeda(c.saldoAtual)}
                                        </span>
                                        <button
                                            onClick={() => iniciarEdicao(c)}
                                            className="text-teal-500 hover:text-teal-700 text-xs font-semibold cursor-pointer bg-transparent border-none"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeletar(c.idConta)}
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