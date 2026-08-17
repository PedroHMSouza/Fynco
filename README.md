<div align="center">

# 💰 Fynco

**Controle financeiro pessoal — do cadastro de contas às metas de investimento.**

![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?logo=springboot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Oracle](https://img.shields.io/badge/Oracle-Database-F80000?logo=oracle&logoColor=white)

</div>

---

## 📌 Sobre o projeto

Fynco é uma aplicação full stack de finanças pessoais, com API REST em **Spring Boot** e frontend em **Next.js**, persistindo dados em um banco **Oracle**. Permite cadastrar contas, cartões, categorias, receitas, despesas, investimentos e metas financeiras, acompanhando tudo em um painel único.

O projeto nasceu como trabalho da disciplina de ADS na FIAP (Grupo 63) e hoje também compõe meu portfólio pessoal como desenvolvedor.

## ✨ Funcionalidades

- 🔐 Cadastro e login de usuário
- 🏦 Gestão de contas e cartões
- 🏷️ Categorias personalizadas
- 📈 Lançamento de receitas e despesas
- 💹 Acompanhamento de investimentos
- 🎯 Definição de metas financeiras

## 🛠️ Tecnologias

| Camada | Stack |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Java 21, Spring Boot 4, Spring Data JPA |
| **Banco de dados** | Oracle (instância acadêmica FIAP) |

## 🏗️ Arquitetura

```
fynco-frontend (Next.js)
        │
        │  API Routes (proxy)
        ▼
 fintech-api (Spring Boot REST)
        │
        ▼
   Oracle Database
```

## 🚀 Como executar localmente

### Pré-requisitos

- Node.js 18+
- Java 21+
- Maven
- Acesso a uma instância Oracle (ambiente acadêmico FIAP ou local)

### 1. Backend (Spring Boot)

```bash
cd fintech-api
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Edite o `application.properties` recém-criado com suas credenciais:

```properties
spring.datasource.username=SEU_RM
spring.datasource.password=SUA_SENHA
```

Depois, rode pela IDE (IntelliJ) ou via terminal:

```bash
./mvnw spring-boot:run
```

API disponível em `http://localhost:8080`.

### 2. Frontend (Next.js)

```bash
cd fynco-frontend
npm install
npm run dev
```

Aplicação disponível em `http://localhost:3000`.

### 🔑 Usuário de teste

| Campo | Valor |
|---|---|
| E-mail | `pedro@fintech.com` |
| Senha | `123456` |

> Se o usuário não existir no seu banco, crie uma nova conta em `/cadastro`.

## 📁 Estrutura do projeto

```
fintech-api/
├── model/          Entidades JPA
├── repository/     Spring Data JPA
├── service/        Regras de negócio
├── controller/     Endpoints REST
├── exception/      Tratamento de erros
└── util/           Utilitários (hash SHA-256)

fynco-frontend/
└── src/
    ├── app/
    │   ├── (interno)/   Páginas autenticadas
    │   ├── api/         API Routes (proxy)
    │   ├── login/       Página de login
    │   └── cadastro/    Página de cadastro
    ├── components/      Header e Sidebar
    ├── interfaces/      Tipagem TypeScript
    └── utils/           Funções utilitárias
```

## ✅ Entidades implementadas

| Entidade | Backend | Frontend |
|---|:---:|:---:|
| Usuário | ✅ | ✅ |
| Categoria | ✅ | ✅ |
| Conta | ✅ | ✅ |
| Cartão | ✅ | — |
| Receita | ✅ | ✅ |
| Despesa | ✅ | ✅ |
| Investimento | ✅ | ✅ |
| Meta Financeira | ✅ | ✅ |

## 🗺️ Próximos passos

- [ ] Testes automatizados (JUnit / Jest)
- [ ] Dashboard com gráficos de gastos por categoria
- [ ] Deploy em ambiente cloud

## 👥 Integrantes

- Pedro Henrique Martins de Souza — RM568089

---

<div align="center">
<sub>Projeto acadêmico desenvolvido na FIAP — Análise e Desenvolvimento de Sistemas</sub>
</div>
