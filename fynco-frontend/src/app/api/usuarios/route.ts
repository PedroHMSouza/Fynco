import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

function hashSenha(senha: string): string {
    return createHash('sha256').update(senha, 'utf8').digest('hex');
}

export async function GET() {
    const res = await fetch(`${process.env.API_URL}/api/usuarios`, {
        cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const bodyComHash = {
        ...body,
        senha: hashSenha(body.senha),
    };

    const res = await fetch(`${process.env.API_URL}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyComHash),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}