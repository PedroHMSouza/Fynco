import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await fetch(`${process.env.API_URL}/api/contas/${id}`, {
        method: 'DELETE',
    });
    return new NextResponse(null, { status: 204 });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const res = await fetch(`${process.env.API_URL}/api/contas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}