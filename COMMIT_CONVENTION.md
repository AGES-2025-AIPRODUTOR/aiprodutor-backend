# Padrão de Mensagens de Commit

Neste projeto, utilizamos o padrão **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)**. Seguir essa convenção é obrigatório, pois nos ajuda a manter um histórico de alterações claro, legível e automatizável.

## Estrutura do Commit

A estrutura de uma mensagem de commit deve ser a seguinte:

`<tipo>(<escopo>): <descrição>`

---

### **Tipo**

O tipo deve ser um dos seguintes, em letra minúscula:

- **feat**: Uma nova funcionalidade (`feature`).
- **fix**: Uma correção de bug (`bug fix`).
- **chore**: Tarefas de manutenção que não alteram o código-fonte visível ao usuário (ex: ajustes de build, configuração de CI/CD, gerenciamento de dependências).
- **docs**: Alterações na documentação (ex: `README.md`, `CONTRIBUTING.md`).
- **style**: Alterações que não afetam o significado do código (espaços em branco, formatação, ponto e vírgula, etc.). Geralmente relacionado ao Prettier/ESLint.
- **refactor**: Uma alteração no código que não corrige um bug nem adiciona uma funcionalidade (ex: renomear uma variável, melhorar a performance de um algoritmo).
- **test**: Adicionando ou corrigindo testes.
- **ci**: Alterações em arquivos de configuração de Integração Contínua (ex: `.gitlab-ci.yml`).

### **Escopo (Opcional)**

O escopo é um substantivo que descreve a seção do código afetada pela alteração.

- **Exemplos:** `(producers)`, `(auth)`, `(prisma)`, `(docker)`, `(docs)`.

### **Descrição**

- Uma descrição curta e concisa da alteração.
- Use o tempo verbal imperativo (ex: "adiciona", "corrige", "altera" em vez de "adicionado", "corrigindo").
- Comece com letra minúscula.
- Não termine com um ponto final.

### Exemplos de Boas Mensagens de Commit