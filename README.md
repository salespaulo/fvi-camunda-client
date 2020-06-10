# fvi-camunda-client

-   `npm run compile`: Executa a limpeza dos arquivos e diretorios.
-   `npm run debug-test`: Executa os testes unitários com o DEBUG ativo.
-   `npm run test`: Executa os testes unitários.
-   `npm run debug-dev`: Executa os testes unitários e espera por alterações com o DEBUG ativo.
-   `npm run dev`: Executa os testes unitários e espera por alterçãoes.
-   `npm run prod`: Executa o código com NODE_ENV=production.
-   `npm run coverage`: Executa os testes unitários e retorna a cobertura dos códigos através do [nyc](https://github.com/istanbuljs/nyc/)
-   `npm run release`: Inicia uma nova release de versão incrementando o **patch**, [git flow](https://github.com/nvie/gitflow/) release start.
-   `npm run release:minor`: Inicia uma nova release de versão incrementando o **minor**, [git flow](https://github.com/nvie/gitflow/) release start.
-   `npm run release:major`: Inicia uma nova release de versão incrementando o **major**, [git flow](https://github.com/nvie/gitflow/) release start.
-   `npm run release:finish`: Finaliza a release, ou seja, realiza o [git flow](https://github.com/nvie/gitflow/) release finish.

## FVI - Camunda Client

Biblioteca que disponibiliza um cliente _HTTP_ com funções utilitárias para um servidor (Camunda BPMN)[//camunda.com], seguindo as especificações da (API Rest)[https://docs.camunda.org/manual/7.10/reference/rest/] disponível na ferramenta.

## Configuração

A configuração é responsável por criar uma instância de um client _HTTP_ utilizando a lib [i-axios-client](https://console.aws.amazon.com/codesuite/codecommit/repositories/i-axios-client/browse?region=us-east-1). Portanto, podemos considerar a sessão de como configurar a lib _i-axios-client_ como a configuração desta biblioteca.

## Mode de Usar

```javascript
const client = require('fvi-camunda-client')
const camunda = client({ url: 'http://localhost:9991' })

// Core client (get-post-put-delete)
camunda
    .get('/engine-rest/task')
    .then(res => res.data)
    .then(console.log)
    .catch(done)

// Camunda client (steroids)
camunda
    .getTaskVariables('task-id-here')
    .then(res => res.data)
    .then(console.log)
    .catch(done)

camunda
    .doStartByProcessDefinitionKey('process-def', { vars: 'vars' })
    .then(res => res.data)
    .then(console.log)
    .catch(done)
```

### Camunda Steroids

-   **getTaskById(taskId: string)**: Recupera a tarefa pelo id.
-   **getTaskVariables(taskId: string)**: Recupera as variáveis de uma tarefa pelo id no camunda.
-   **getTasksByTenantIdProcessDefAndTaskDef(tenantId: string, processDef: string, taskDef: string)**: Recupera as tarefas por Tenant Id, Process Definition Key e Task Definition Key.
-   **getProcessInstanceByTaskId(taskId: string)**: Recupera o Process Instance pelo id da tarefa.

-   **doTaskClaim(taskId: string, username: string)**: Faz a atribuição de uma tarefa para um usuário pelo id da tarefa.
-   **doTaskComplete(taskId: string, vars: object)**: Completa uma tarefa atualizando as variávies pelo id da tarefa.
-   **doUpdateVariables(taskId: string, vars: object)**: Faz a atualização das variáveis de uma tarefa pelo id.
-   **doStartByProcessDefinitionKey(tenantId: string, processDef: string)**: Inicia um processo no camunda pelo Tenant Id e Process Definition Key.
