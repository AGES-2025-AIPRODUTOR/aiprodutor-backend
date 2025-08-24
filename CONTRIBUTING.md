# Guia de Contribuição

Agradecemos o seu interesse em contribuir para o projeto Ai Produtor! Para garantir que o processo de desenvolvimento seja suave e organizado para todos, pedimos que siga as diretrizes abaixo.

## Fluxo de Trabalho com Git

Nosso projeto utiliza um fluxo de trabalho baseado na branch `developer` como principal branch de integração. A branch `main` é reservada para versões estáveis. **Ninguém deve fazer push diretamente para a `developer` ou `main`**. Todo o trabalho deve ser feito em *feature branches* e integrado através de Pull Requests.

### Padrão de Nomes de Branch

Toda nova funcionalidade, correção ou tarefa deve ser desenvolvida em sua própria branch, criada a partir da versão mais recente da `developer`. O nome da branch deve seguir o formato:

`tipo/US<id>-nome-descritivo`

- **`tipo`**: Categoria da tarefa. As mais comuns são:
    - `feat`: Para novas funcionalidades.
    - `fix`: Para correção de bugs.
    - `chore`: Para tarefas de manutenção que não afetam o código-fonte (ex: ajustes no Docker).
    - `docs`: Para alterações na documentação.

- **`US<id>`**: O identificador da User Story (ou tarefa) no seu sistema de gerenciamento. Substitua `<id>` pelo número da tarefa.

- **`nome-descritivo`**: Um nome curto, em inglês, que descreve a tarefa, com palavras separadas por hífen.

**Exemplos:**
- `feat/US101-auth-module`
- `fix/US125-producer-validation-error`
- `chore/US130-update-dockerfile`
- `docs/US132-update-readme-contribution-guide`


### Como Fazer um Pull Request (PR)

1.  **Sincronize sua branch `developer` local:**
    Antes de começar qualquer trabalho, garanta que sua branch `developer` local está atualizada com o repositório remoto.
    ```bash
    git checkout developer
    git pull origin developer
    ```

2.  **Crie sua feature branch:**
    Crie sua nova branch a partir da `developer` atualizada, seguindo o padrão de nomes.
    ```bash
    git checkout -b feat/US101-auth-module
    ```

3.  **Desenvolva e Faça Commits:**
    Trabalhe na sua funcionalidade. Faça commits pequenos e atômicos sempre que atingir um ponto lógico. Lembre-se de seguir o nosso **[Padrão de Mensagens de Commit](COMMIT_CONVENTION.md)**.

4.  **Envie sua branch para o repositório remoto:**
    ```bash
    git push origin feat/US101-auth-module
    ```

5.  **Abra o Pull Request no GitLab:**
    - Vá para a página do repositório no GitLab.
    - O GitLab geralmente irá sugerir a criação de um Pull Request para a branch que você acabou de enviar.
    - O Pull Request deve ser aberto da sua branch (ex: `feat/US101-auth-module`) para a branch `developer`.
    - **Preencha um bom título e uma descrição clara**, explicando *o que* foi feito e *por quê*. O título do PR deve, idealmente, conter o ID da US (ex: `feat(auth): US-101 Implement Authentication Module`).
    - Marque um ou mais colegas de equipe como "reviewers" (revisores).
    - Aguarde a revisão do código. Esteja aberto a feedbacks e aplique as alterações sugeridas (se houver) em novos commits na sua branch.
    - Após a aprovação dos revisores e a passagem dos testes de CI/CD, o PR poderá ser "mergeado" na `developer`.