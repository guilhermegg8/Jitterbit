# API de Gerenciamento de Pedidos - Desafio Jitterbit

Esta é a implementação de uma API RESTful como solução para o desafio técnico da Jitterbit. A API permite gerenciar pedidos, incluindo operações de CRUD (Criar, Ler, Atualizar, Deletar ) e é construída com Node.js, Express e MongoDB.

## Funcionalidades Implementadas

- **CRUD Completo para Pedidos:**
  - `POST /order`: Cria um novo pedido.
  - `GET /order/list`: Lista todos os pedidos.
  - `GET /order/:id`: Obtém um pedido específico.
  - `PUT /order/:id`: Atualiza um pedido.
  - `DELETE /order/:id`: Deleta um pedido.
- **Autenticação com JWT:** As rotas de pedidos são protegidas. É necessário obter um token via o endpoint `POST /login` para acessá-las.
- **Documentação com Swagger:** Uma documentação interativa da API está disponível para facilitar os testes e a visualização dos endpoints.

## Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/en/ ) (versão 14 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community ) (servidor rodando localmente)

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd <nome-da-pasta>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Renomeie o arquivo `.env.example` para `.env` (se você criar um) ou crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
    ```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/jitterbit_db
    JWT_SECRET=<sua-chave-secreta-gerada>
    ```

4.  **Inicie o servidor:**
    ```bash
    npm run dev
    ```

### Como Usar a API

1.  **Acesse a Documentação:**
    - Abra seu navegador e acesse `http://localhost:3000/api-docs`.

2.  **Obtenha um Token de Autenticação:**
    - Na documentação, use o endpoint `POST /login` com o seguinte corpo para obter um token:
      ```json
      {
        "user": "jitterbit",
        "password": "challenge"
      }
      ```

3.  **Autorize suas requisições:**
    - Clique no botão "Authorize" no topo da página do Swagger.
    - No campo "Value", cole o token recebido no formato `Bearer <seu_token_aqui>`.
    - Agora você pode testar todos os endpoints protegidos diretamente pela documentação.