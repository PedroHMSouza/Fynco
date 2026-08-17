import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ idUsuario: string }> }
) {
    const { idUsuario } = await params;
    const res = await fetch(
        `${process.env.API_URL}/api/contas/usuario/${idUsuario}`,
        { cache: 'no-store' }
    );
    const data = await res.json();
    return NextResponse.json(data);
}