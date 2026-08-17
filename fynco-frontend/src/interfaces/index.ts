export interface Usuario{
    idUsuario: number;
    nome: string;
    email: string;
    telefone?: string;
    dataCadastro?: string;
}

export interface Categoria{
    idCategoria: number;
    nome: string;
    tipo: 'RECEITA' | 'DESPESA';
}

export interface Conta {
    idConta:number;
    usuario: Usuario;
    banco: string;
    tipoConta: 'CORRENTE' | 'POUPANCA' | 'INVESTIMENTO' | 'DIGITAL';
    nomeConta: string;
    saldoInicial: number;
    saldoAtual: number;
}

export interface Cartao {
    idCartao: number;
    conta: Conta;
    tipoCartao: string;
    bandeira: string;
    limite: number;
    fechamentoFatura?: string;
    dataAtualizacao?: string;
}

export interface Despesa {
    idDespesa: number;
    usuario: Usuario;
    categoria: Categoria;
    valor: number;
    descricao: string;
    dataGasto: string;
}

export interface Receita {
    idReceita: number;
    usuario: Usuario;
    categoria: Categoria;
    valor: number;
    descricao: string;
    dataRecebimento: string;
}

export interface Investimento {
    idInvestimento: number;
    usuario: Usuario;
    tipo: string;
    valor: number;
    taxa: number;
    dataInvestimento: string;
}

export interface MetaFinanceira {
    idMeta: number;
    usuario: Usuario;
    descricaoMeta: string;
    valorObjetivo: number;
    valorAtual: number;
    dataInicio: string;
    dataFim?: string;
}