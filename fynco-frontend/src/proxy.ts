import { NextRequest, NextResponse } from 'next/server';

const rotasPublicas = ['/login', '/cadastro'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const ehRotaPublica = rotasPublicas.some((rota) =>
        pathname.startsWith(rota)
    );

    const usuario = request.cookies.get('usuario');

    if (!ehRotaPublica && !usuario) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (ehRotaPublica && usuario) {
        return NextResponse.redirect(new URL('/inicio', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)'],
};