import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');

    const res = await fetch(`${process.env.API_URL}/api/categorias`, {
        cache: 'no-store',
    });
    const data = await res.json();

    if (tipo) {
        return NextResponse.json(
            data.filter((c: { tipo: string }) => c.tipo === tipo)
        );
    }

    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const res = await fetch(`${process.env.API_URL}/api/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}