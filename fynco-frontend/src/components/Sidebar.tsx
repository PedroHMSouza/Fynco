'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const menuItems = [
    { href: '/inicio', label: 'Início', icon: '🏠' },
    { href: '/receitas', label: 'Receitas', icon: '📈' },
    { href: '/gastos', label: 'Gastos', icon: '📉' },
    { href: '/contas', label: 'Contas', icon: '🏦' },
    { href: '/metas', label: 'Metas', icon: '🎯' },
    { href: '/investimentos', label: 'Investimentos', icon: '💹' },
    { href: '/categorias', label: 'Categorias', icon: '🏷️' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [nomeUsuario, setNomeUsuario] = useState('');

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (usuario?.nome) {
            setNomeUsuario(usuario.nome);
        }
    }, []);

    function handleSair() {
        localStorage.removeItem('usuario');
        // Remove o cookie também
        document.cookie = 'usuario=; path=/; max-age=0';
        router.push('/login');
    }

    return (
        <aside className="w-64 bg-teal-400 text-white flex flex-col fixed h-full">
            <div className="flex items-center gap-3 p-6 mb-4">
                <Image src="/logo.png" alt="Fynco" width={32} height={32} />
                <span className="text-xl font-bold">Fynco</span>
            </div>

            <nav className="flex flex-col gap-1 px-3 flex-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                            ? 'bg-white/20 font-bold'
                            : 'hover:bg-white/10'
                            }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="border-t border-white/20 p-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                        👤
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {nomeUsuario || 'Carregando...'}
                        </p>
                        <button
                            onClick={handleSair}
                            className="text-xs text-white/80 hover:text-white cursor-pointer bg-transparent border-none"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}