import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const idUsuario = searchParams.get('idUsuario');

    await fetch(
        `${process.env.API_URL}/api/receitas/${id}?idUsuario=${idUsuario}`,
        { method: 'DELETE' }
    );
    return new NextResponse(null, { status: 204 });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const res = await fetch(`${process.env.API_URL}/api/receitas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}