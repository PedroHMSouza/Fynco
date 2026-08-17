import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const res = await fetch(`${process.env.API_URL}/api/categorias/${id}`, {
        method: 'DELETE',
    });

    if (!res.ok) {
        const data = await res.json();
        return NextResponse.json(
            { mensagem: data.mensagem || 'Erro ao excluir categoria.' },
            { status: res.status }
        );
    }

    return new NextResponse(null, { status: 204 });
}