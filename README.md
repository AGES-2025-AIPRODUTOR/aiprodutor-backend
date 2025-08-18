# Ai Produtor - Backend

> API RESTful para o sistema de cadastro e gestão de produtores de hortifrúti, desenvolvido para a disciplina de AGES.

Este projeto contém todo o código relacionado ao servidor e à lógica de negócios da aplicação. Ele é construído com NestJS, se conecta a um banco de dados PostgreSQL via Prisma e fornece uma API documentada com Swagger para ser consumida pelo [aiprodutor-frontend](https://tools.ages.pucrs.br/ai-produtor-sistema-de-cadastro-e-gestao-de-produtores-de-hortifrutie/aiprodutor-frontend.git).

## ✨ Funcionalidades

- Validação automática dos dados de entrada (DTOs).
- Documentação interativa e automática de todos os endpoints com Swagger.
- Gerenciamento de configuração através de variáveis de ambiente.

## 🛠️ Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Validação:** [class-validator](https://github.com/typestack/class-validator), [class-transformer](https://github.com/typestack/class-transformer)
- **Documentação:** [Swagger (OpenAPI)](https://swagger.io/)
- **Qualidade de Código:** [ESLint](https://eslint.org/) e [Prettier](https://prettier.io/)

## 🚀 Começando

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento local.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS, ex: 20.x ou superior)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/)

### Instalação (Feita apenas uma vez)

1.  **Clone o repositório:**
    ```bash
    git clone [https://tools.ages.pucrs.br/ai-produtor-sistema-de-cadastro-e-gestao-de-produtores-de-hortifrutie/aiprodutor-backend.git](https://tools.ages.pucrs.br/ai-produtor-sistema-de-cadastro-e-gestao-de-produtores-de-hortifrutie/aiprodutor-backend.git)
    cd aiprodutor-backend
    ```

2.  **Configure as Variáveis de Ambiente:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.
    ```bash
    cp .env.example .env
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o Banco de Dados com Docker:**
    Este comando irá criar e iniciar um container PostgreSQL em segundo plano.
    ```bash
    docker compose up -d
    ```

5.  **Aplique as Migrações do Banco de Dados:**
    Este comando irá ler o `schema.prisma` e criar as tabelas no seu banco de dados Docker.
    ```bash
    npx prisma migrate dev
    ```

### Como Rodar a Aplicação no Dia a Dia

Com a instalação concluída, o processo para trabalhar no projeto é muito simples.

1.  **Suba toda a stack (API + Banco de Dados) com Docker:**
    ```bash
    docker compose up
    ```
    *Este comando irá iniciar o container do banco de dados e o container da API. Você verá os logs de ambos os serviços neste terminal.*

2.  A API estará disponível em [http://localhost:3000](http://localhost:3000).

### 🛑 Parando a Aplicação

Para parar todos os containers (API e Banco de Dados), pressione `Ctrl + C` no terminal onde o `docker compose up` está rodando, ou em outro terminal execute:
```bash
docker compose down