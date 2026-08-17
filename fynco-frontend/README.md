# Fynco — Aplicação Fintech

Aplicação de controle financeiro pessoal desenvolvida com Next.js (frontend) e Spring Boot (backend), integrada ao banco de dados Oracle da FIAP.

---

## Tecnologias utilizadas

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Backend:** Java, Spring Boot, Spring Data JPA
- **Banco de dados:** Oracle (instância FIAP)

---

## Como inicializar o projeto

### Pré-requisitos

- Node.js 18+
- Java 17+
- Maven
- Acesso à instância Oracle da FIAP

---

### 1. Backend (Spring Boot)

Abra o projeto `fintech-api` no IntelliJ IDEA.

Verifique o arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:oracle:thin:@//oracle.fiap.com.br:1521/ORCL
spring.datasource.username=SEU_RM
spring.datasource.password=SUA_SENHA
```

Execute a aplicação clicando no botão **Run** ou pressione `Shift + F10`.

O backend estará disponível em: `http://localhost:8080`

---

### 2. Frontend (Next.js)

Abra o projeto `fynco-frontend` no terminal e execute:

```bash
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:3000`

---

## Dados de autenticação do usuário de teste

| Campo | Valor |
|---|---|
| Email | pedro@fintech.com |
| Senha | 123456 |

> Caso o usuário não exista no banco, acesse `http://localhost:3000/cadastro` para criar uma nova conta. Ou acesse pela tela o cadastro de usuário.

---

## Estrutura do projeto

### Backend

fintech-api/
├── model/          Entidades JPA
├── repository/     Spring Data JPA
├── service/        Regras de negócio
├── controller/     Endpoints REST
├── exception/      Tratamento de erros
└── util/           Utilitários (hash SHA-256)

### Frontend

fynco-frontend/
├── src/
│   ├── app/
│   │   ├── (interno)/   Páginas autenticadas
│   │   ├── api/         API Routes (proxy)
│   │   ├── login/       Página de login
│   │   └── cadastro/    Página de cadastro
│   ├── components/      Header e Sidebar
│   ├── interfaces/      Tipagem TypeScript
│   └── utils/           Funções utilitárias

---

## Entidades implementadas

| Entidade | Backend | Frontend |
|---|---|---|
| Usuário | ✅ | ✅ |
| Categoria | ✅ | ✅ |
| Conta | ✅ | ✅ |
| Cartão | ✅ | — |
| Receita | ✅ | ✅ |
| Despesa | ✅ | ✅ |
| Investimento | ✅ | ✅ |
| Meta Financeira | ✅ | ✅ |

---

## Integrantes do grupo

- Pedro Henrique Martins de Souza — RM568089