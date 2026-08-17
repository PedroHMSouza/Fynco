'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    titulo: string;
}

export default function Header({ titulo }: HeaderProps) {
    const router = useRouter();
    const [usuario, setUsuario] = useState<{ nome?: string; email?: string }>({});
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        const dados = JSON.parse(localStorage.getItem('usuario') || '{}');
        setUsuario(dados);
    }, []);

    useEffect(() => {
        function fecharMenu(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (!target.closest('#menu-usuario')) {
                setMenuAberto(false);
            }
        }
        document.addEventListener('click', fecharMenu);
        return () => document.removeEventListener('click', fecharMenu);
    }, []);

    function handleSair() {
        localStorage.removeItem('usuario');
        document.cookie = 'usuario=; path=/; max-age=0';
        router.push('/login');
    }

    return (
        <header className="bg-white px-10 py-5 flex justify-between items-center shadow-sm">
            <h1 className="text-2xl font-bold text-[#1a3a5c]">{titulo}</h1>
            <div className="flex items-center gap-4">

                {/* Notificação */}
                <button
                    title="Notificações"
                    className="text-xl w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer border-none bg-transparent"
                >
                    🔔
                </button>

                {/* Menu do usuário */}
                <div id="menu-usuario" className="relative">
                    <button
                        onClick={() => setMenuAberto(!menuAberto)}
                        title={usuario?.nome || 'Usuário'}
                        className="text-xl w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer border-none bg-transparent"
                    >
                        👤
                    </button>

                    {menuAberto && (
                        <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-100 w-48 py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-semibold text-[#1a3a5c]">
                                    {usuario?.nome || 'Usuário'}
                                </p>
                                <p className="text-xs text-gray-400">{usuario?.email || ''}</p>
                            </div>
                            <button
                                onClick={handleSair}
                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none"
                            >
                                Sair
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}