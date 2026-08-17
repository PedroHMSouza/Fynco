'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
                <div className="text-6xl mb-6">⚠️</div>
                <h1 className="text-2xl font-bold text-[#1a3a5c] mb-3">
                    Algo deu errado
                </h1>
                <p className="text-gray-400 text-sm mb-8">
                    Ocorreu um erro inesperado. Tente novamente ou volte para o início.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-colors cursor-pointer border-none"
                    >
                        Tentar novamente
                    </button>
                    <button
                        onClick={() => router.push('/inicio')}
                        className="border-2 border-gray-200 text-gray-500 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer bg-transparent"
                    >
                        Ir para o início
                    </button>
                </div>
            </div>
        </div>
    );
}