import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

function hashSenha(senha: string): string {
  return createHash('sha256').update(senha, 'utf8').digest('hex');
}

export async function POST(request: NextRequest) {
  const { email, senha } = await request.json();

  try {
    const res = await fetch(`${process.env.API_URL}/api/usuarios`);
    const usuarios = await res.json();

    const senhaHash = hashSenha(senha);

    const usuario = usuarios.find(
      (u: { email: string; senha: string }) =>
        u.email === email && u.senha === senhaHash
    );

    if (!usuario) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

    const { senha: _, ...usuarioSemSenha } = usuario;
    return NextResponse.json(usuarioSemSenha);

  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}