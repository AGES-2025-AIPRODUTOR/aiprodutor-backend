# Ai Produtor - Backend

> API RESTful para o sistema de cadastro e gestão de produtores de hortifrúti, desenvolvido para a disciplina de AGES.

Este projeto contém todo o código relacionado ao servidor e à lógica de negócios da aplicação. Ele é construído com NestJS, se conecta a um banco de dados PostgreSQL com PostGIS via Prisma e fornece uma API documentada com Swagger para ser consumida pelo [aiprodutor-frontend](https://tools.ages.pucrs.br/ai-produtor-sistema-de-cadastro-e-gestao-de-produtores-de-hortifrutie/aiprodutor-frontend.git).

## ✨ Funcionalidades

- Arquitetura Modular e escalável.
- Validação automática dos dados de entrada (DTOs).
- Documentação interativa e automática de todos os endpoints com Swagger.
- Gerenciamento de configuração através de variáveis de ambiente.
- Suporte a dados geoespaciais com PostGIS.

## 🛠️ Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) + [PostGIS](https://postgis.net/)
- **Containerização:** [Docker](https://www.docker.com/)
- **Validação:** [class-validator](https://github.com/typestack/class-validator), [class-transformer](https://github.com/typestack/class-transformer)
- **Documentação:** [Swagger (OpenAPI)](https://swagger.io/)
- **Qualidade de Código:** [ESLint](https://eslint.org/) e [Prettier](https://prettier.io/)

## 🚀 Começando

Siga os passos abaixo para configurar e rodar o projeto. A aplicação inteira (API e Banco de Dados) é orquestrada com Docker, garantindo um ambiente consistente para todos os desenvolvedores.

### Pré-requisitos

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose
- [Node.js](https://nodejs.org/) e [npm](https://www.npmjs.com/) → Fortemente recomendados para executar comandos do Prisma localmente e para a integração com o VS Code (TypeScript/ESLint).

### Instalação e Primeira Execução (Feito apenas uma vez)

1.  **Clone o repositório:**
    ```bash
    git clone [https://tools.ages.pucrs.br/ai-produtor-sistema-de-cadastro-e-gestao-de-produtores-de-hortifrutie/aiprodutor-backend.git](https://tools.ages.pucrs.br/ai-produtor-sistema-de-cadastro-e-gestao-de-produtores-de-hortifrutie/aiprodutor-backend.git)
    cd aiprodutor-backend
    ```

2.  **Configure as Variáveis de Ambiente:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`. O arquivo já vem pré-configurado para o ambiente Docker.
    ```bash
    cp .env.example .env
    ```

3.  **Construa e Inicie os Containers:**
    Este comando irá construir a imagem da API (instalando as dependências do `npm` dentro dela) e iniciar os containers do backend e do banco de dados em segundo plano.
    ```bash
    docker compose up -d --build
    ```
    *É normal que o container da API (`aiprodutor-api`) pare ou reinicie na primeira vez, pois o banco de dados ainda não foi configurado com as tabelas.*

4.  **Aplique as Migrações do Banco de Dados:**
    Este comando irá criar as tabelas no seu banco de dados que está rodando no Docker.
    ```bash
    npx prisma migrate dev
    ```
    *Se for a primeira vez ou se precisar recomeçar do zero, o comando `npx prisma migrate reset` é uma opção mais segura.*

5.  **Reinicie o Container da API (se necessário):**
    Após a migração, a API já deve se reconectar automaticamente. Se não, reinicie-a:
    ```bash
    docker compose restart backend
    ```

### Como Rodar a Aplicação no Dia a Dia

1.  **Inicie os containers:**
    Na raiz do projeto, execute:
    ```bash
    docker compose up
    ```
    *Este comando irá iniciar o container do banco de dados e o da API. Você verá os logs de ambos os serviços neste terminal. As alterações no código-fonte na sua máquina serão refletidas automaticamente dentro do container.*

2.  A API estará disponível em [http://localhost:3000](http://localhost:3000).
3.  A documentação interativa da API (Swagger) estará em [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

---

### 💡 Rodando em modo desenvolvimento com auto-reload (sem Docker para a API)

Se você deseja desenvolver com atualização automática do código (hot-reload) e maior agilidade, pode rodar apenas o banco de dados via Docker e executar a API localmente:

1. **Suba apenas o banco de dados com Docker:**
   ```bash
   docker compose up -d postgres
   ```

2. **Execute a API em modo desenvolvimento na sua máquina:**
   ```bash
   npm run start:dev
   ```
   *Assim, qualquer alteração feita no código será refletida automaticamente, sem precisar reconstruir o container.*

3. **Certifique-se de que as variáveis de ambiente (`.env`) estejam corretas e apontando para o banco de dados rodando no Docker (exemplo: `localhost:5433`).*

---

## 🌱 Populando o Banco de Dados (Seed)

O projeto contém um script para popular o banco com dados de exemplo (produtores, áreas, safras, etc).

### Execução Automática
O seed é executado automaticamente na primeira vez que o ambiente é criado com:

    docker compose up --build

ou após:

    npx prisma migrate reset

### Execução Manual
Para executar o seed a qualquer momento, garanta que o banco de dados esteja rodando e execute:

    npx prisma db seed

### Para visualizar o banco de dados de forma visual, rode o comando

    npx prisma studio

E acesse a página 

    http://localhost:5555/

* O container de banco de dados deve estar rodando.

---

## 🔄 Resetando o Banco de Dados

Para limpar completamente o banco de dados, recriar todas as tabelas e repopular com os dados do seed, use o comando:

    npx prisma migrate reset


---

## 🖥️ Configuração para Desenvolvedores Windows

O PowerShell no Windows possui uma política de segurança que pode bloquear a execução de comandos como `npm` e `npx`.  
Para uma experiência de desenvolvimento fluida, recomendamos a seguinte solução:



###  Alterar a Política de Execução
No mesmo terminal do PowerShell onde você viu o erro, execute o seguinte comando:

    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Após executar o comando acima, tente rodar seu script novamente:

    npm run start:dev

Isso deve resolver o problema imediatamente e é o método mais seguro, pois não altera as configurações de segurança do seu sistema permanentemente.

---

### ⚠️ Corrigindo o erro de "Collation Version Mismatch" no PostgreSQL

Se ao acessar o banco de dados via Docker você encontrar uma mensagem semelhante a:

```
WARNING:  database "aiprodutor" has a collation version mismatch
DETAIL:  The database was created using collation version X.XX, but the operating system provides version Y.YY.
HINT:  Rebuild all objects in this database that use the default collation and run ALTER DATABASE aiprodutor REFRESH COLLATION VERSION, or build PostgreSQL with the right library version.
```

Isso significa que a versão da collation (ordenação de textos) do banco de dados está diferente da versão fornecida pelo sistema operacional atual do container.

**Como corrigir:**

1. Acesse o banco de dados dentro do container Docker:
   ```bash
   docker exec -it aiprodutor-db psql -U devuser -d aiprodutor
   ```

2. No prompt do PostgreSQL, execute:
   ```sql
   ALTER DATABASE template1 REFRESH COLLATION VERSION;
   ```

Isso irá atualizar a versão da collation do banco de dados para corresponder à versão do sistema operacional do container, eliminando o aviso.

---

### 🛑 Parando a Aplicação

Para parar todos os containers (API e Banco de Dados), pressione `Ctrl + C` no terminal onde o `docker compose up` está rodando, ou em outro terminal execute:
```bash
docker compose down
```

## 🔄 Resetando o Banco de Dados

Se você precisar **resetar o banco de dados** (por exemplo, para limpar todos os dados e recriar as tabelas do zero durante o desenvolvimento ou testes), utilize o comando:

```bash
npx prisma migrate reset
```

Esse comando irá:
- Apagar todas as tabelas e dados do banco,
- Reaplicar todas as migrações existentes,
- (Opcionalmente) executar o script de seed, se houver.

**Por que isso é útil?**
- Permite começar do zero rapidamente, útil para testes automatizados, desenvolvimento de novas funcionalidades ou correção de problemas de estrutura.
- Garante que o banco está alinhado com o estado atual do seu modelo Prisma.

> **Atenção:** Use apenas em ambientes de desenvolvimento ou testes, pois todos os dados serão perdidos!