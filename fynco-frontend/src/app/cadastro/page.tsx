'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function CadastroPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        telefone: '',
    });
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function handleCadastro(e: React.FormEvent) {
        e.preventDefault();
        setErro('');

        if (form.senha !== form.confirmarSenha) {
            setErro('As senhas não coincidem.');
            return;
        }

        if (form.senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setCarregando(true);
        try {
            const res = await fetch('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: form.nome,
                    email: form.email,
                    senha: form.senha,
                    telefone: form.telefone,
                }),
            });

            if (!res.ok) {
                const erro = await res.json();
                setErro(erro.mensagem || 'Erro ao cadastrar. Tente novamente.');
                return;
            }

            router.push('/login?cadastro=sucesso');
        } catch {
            setErro('Erro ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    }

    const inputClass =
        'w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 transition-colors';

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#1a3a5c] to-teal-400">

            {/* Lado esquerdo */}
            <div className="hidden md:flex flex-col justify-center px-16 flex-1 text-white">
                <div className="mb-10">
                    <Image src="/logo.png" alt="Fynco" width={80} height={80} className="mb-4" />
                    <h1 className="text-5xl font-bold mb-3">Fynco</h1>
                    <p className="text-lg text-white/90">Sua vida financeira organizada</p>
                </div>
                <ul className="flex flex-col gap-4">
                    {[
                        'Controle total de suas finanças',
                        'Acompanhe receitas e despesas',
                        'Crie metas financeiras',
                        'Gerencie seus cartões',
                    ].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-base">
                            <span className="text-yellow-400 text-xl font-bold">✓</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Lado direito — formulário */}
            <div className="flex items-center justify-center flex-1 px-6 py-12">
                <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
                    <h2 className="text-3xl font-bold text-[#1a3a5c] mb-2">Criar Conta</h2>
                    <p className="text-sm text-gray-400 mb-8">
                        Já tem conta?{' '}
                        <Link href="/login" className="text-teal-500 font-semibold hover:underline">
                            Faça login
                        </Link>
                    </p>

                    <form onSubmit={handleCadastro} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                Nome completo
                            </label>
                            <input
                                type="text"
                                placeholder="Seu nome"
                                required
                                value={form.nome}
                                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                Telefone
                            </label>
                            <input
                                type="tel"
                                placeholder="11999999999"
                                value={form.telefone}
                                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                required
                                value={form.senha}
                                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                Confirmar senha
                            </label>
                            <input
                                type="password"
                                placeholder="Repita a senha"
                                required
                                value={form.confirmarSenha}
                                onChange={(e) => setForm({ ...form, confirmarSenha: e.target.value })}
                                className={inputClass}
                            />
                        </div>

                        {erro && (
                            <p className="text-red-500 text-sm text-center">{erro}</p>
                        )}

                        <button
                            type="submit"
                            disabled={carregando}
                            className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60 cursor-pointer"
                        >
                            {carregando ? 'Cadastrando...' : 'Criar Conta'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}