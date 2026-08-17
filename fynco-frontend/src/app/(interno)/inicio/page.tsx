'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Receita, Despesa, MetaFinanceira } from '@/interfaces';

export default function InicioPage() {
    const [receitas, setReceitas] = useState<Receita[]>([]);
    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [metas, setMetas] = useState<MetaFinanceira[]>([]);
    const [idUsuario, setIdUsuario] = useState<number | null>(null);

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (usuario?.idUsuario) {
            setIdUsuario(usuario.idUsuario);
        }
    }, []);

    useEffect(() => {
        if (!idUsuario) return;

        fetch(`/api/receitas/usuario/${idUsuario}`)
            .then((r) => r.json())
            .then(setReceitas);

        fetch(`/api/despesas/usuario/${idUsuario}`)
            .then((r) => r.json())
            .then(setDespesas);

        fetch(`/api/metas/usuario/${idUsuario}`)
            .then((r) => r.json())
            .then(setMetas);
    }, [idUsuario]);

    const totalReceitas = receitas.reduce((acc, r) => acc + r.valor, 0);
    const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
    const saldoTotal = totalReceitas - totalDespesas;

    function formatarMoeda(valor: number) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }

    return (
        <>
            <Header titulo="Início" />
            <main className="p-10 flex flex-col gap-6">

                {/* Card saldo */}
                <div className="bg-gradient-to-br from-[#1a3a5c] to-teal-400 text-white p-8 rounded-xl shadow">
                    <p className="text-sm opacity-90 mb-2">Saldo Total</p>
                    <p className="text-4xl font-bold">{formatarMoeda(saldoTotal)}</p>
                </div>

                {/* Receita e Despesa */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Receitas</p>
                        <p className="text-2xl font-bold text-teal-500">
                            {formatarMoeda(totalReceitas)}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Despesas</p>
                        <p className="text-2xl font-bold text-red-400">
                            {formatarMoeda(totalDespesas)}
                        </p>
                    </div>
                </div>

                {/* Últimas transações */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-[#1a3a5c] mb-4">
                        Últimas Despesas
                    </h3>
                    {despesas.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhuma despesa registrada.</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {despesas.slice(0, 5).map((d) => (
                                <div
                                    key={d.idDespesa}
                                    className="flex items-center justify-between py-2 border-b last:border-0"
                                >
                                    <div>
                                        <p className="font-semibold text-sm text-[#1a3a5c]">
                                            {d.descricao}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {d.categoria?.nome} · {d.dataGasto}
                                        </p>
                                    </div>
                                    <span className="text-red-400 font-bold text-sm">
                                        - {formatarMoeda(d.valor)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Metas */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-base font-bold text-[#1a3a5c] mb-4">Metas</h3>
                    {metas.length === 0 ? (
                        <p className="text-sm text-gray-400">Nenhuma meta registrada.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {metas.map((meta) => {
                                const progresso = Math.min(
                                    Math.round((meta.valorAtual / meta.valorObjetivo) * 100),
                                    100
                                );
                                return (
                                    <div key={meta.idMeta}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-semibold text-[#1a3a5c]">
                                                {meta.descricaoMeta}
                                            </span>
                                            <span className="text-gray-500">{progresso}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-teal-400 h-2 rounded-full transition-all"
                                                style={{ width: `${progresso}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatarMoeda(meta.valorAtual)} de{' '}
                                            {formatarMoeda(meta.valorObjetivo)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </main>
        </>
    );
}