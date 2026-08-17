'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h1 className="text-2xl font-bold text-[#1a3a5c] mb-3">
                    Página não encontrada
                </h1>
                <p className="text-gray-400 text-sm mb-8">
                    A página que você está procurando não existe ou foi removida.
                </p>
                <button
                    onClick={() => router.push('/inicio')}
                    className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer border-none"
                >
                    Voltar para o início
                </button>
            </div>
        </div>
    );
}