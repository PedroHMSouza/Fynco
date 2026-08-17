export function dataAtual(): string {
    return new Date().toISOString().split('T')[0];
}