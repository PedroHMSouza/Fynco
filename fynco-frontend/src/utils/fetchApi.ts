export async function fetchApi(url: string, options?: RequestInit) {
    const res = await fetch(url, options);

    if (!res.ok) {
        let mensagem = 'Erro ao processar a requisição.';
        try {
            const erro = await res.json();
            if (erro?.mensagem) mensagem = erro.mensagem;
            else if (erro?.error) mensagem = erro.error;
        } catch {
            mensagem = `Erro ${res.status}`;
        }
        throw new Error(mensagem);
    }

    if (res.status === 204) return null;
    return res.json();
}