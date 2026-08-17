'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SELF_URL}/api/auth/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha }),
                }
            );

            if (!res.ok) {
                setErro('Email ou senha inválidos.');
                return;
            }

            const usuario = await res.json();

            // Salva no localStorage para uso nos componentes
            localStorage.setItem('usuario', JSON.stringify(usuario));

            // Salva no cookie para o middleware conseguir verificar
            document.cookie = `usuario=${JSON.stringify(usuario)}; path=/; max-age=${60 * 60 * 8}`;

            router.push('/inicio');
        } catch {
            setErro('Erro ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#1a3a5c] to-teal-400">

            {/* Lado esquerdo — benefícios */}
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
                    <h2 className="text-3xl font-bold text-[#1a3a5c] mb-8">Entrar na Conta</h2>

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1a3a5c] mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="Sua senha"
                                required
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 transition-colors"
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
                            {carregando ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <div className="text-center mt-6 text-sm text-gray-500">
                        <p>
                            Não tem conta?{' '}
                            <Link href="/cadastro" className="text-teal-500 font-semibold cursor-pointer hover:underline">
                                Cadastre-se aqui
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}