# psel-backend-junior

## Primeiros passos

1. Instale dependências com `npm ci`.
2. Copie o arquivo `.env.example` para o arquivo `.env`.
3. Se você tiver um PostgreSQL local instalado, crie um database vazio nele e configure o `.env` com os acessos.
4. Se não tiver, utilize `npm run postgres:start` e `npm run database:create` para criar e configurar um com Docker.
5. Migrações podem ser executadas no ambiente local com `npm run migration:run`. Isso é feito automaticamente pelo `npm run dev`.
6. Execute o projeto localmente com `npm run dev`.
7. Execute a suite de testes do projeto com `npm test`.

# Pessoa Backend Junior

## Introdução

A Cubos pode ser definida como um hub de conhecimento e inovação, capaz de criar empresas digitais próprias e apoiar negócios distintos na tomada de decisões, além do desenvolvimento e resolução de desafios técnicos complexos.

Veja o que já construímos ao longo de 9 anos [clicando aqui](https://cubos.io/cases).

## Contexto

A Cubos é especialista em tecnologia financeira, implementamos ideias que têm o desejo de inovar e otimizar os serviços do sistema financeiro. e para este desafio técnico vamos construir uma API com as principais funcionalidades de uma aplicação financeira.

## Sobre a aplicação

- A aplicação deve ser construída utilizando NodeJS, Typescript e utilizando o framework [express](https://expressjs.com/).
- O banco de dados deve ser o [PostgreSQL](https://www.postgresql.org/).
- Testes de integração e/ou unitários são obrigatórios, com cobertura mínima de 70%.

## Requisitos

Uma pessoa deseja se cadastrar em sua aplicação para usufruir dos serviços financeiros oferecidos:

- Pessoa pode ter várias contas.
- Conta pode ter vários cartões.
- Cartão pode ser do tipo físico ou virtual, onde é possível ter apenas um físico e vários virtuais por conta.
- Conta possui diversas transações de crédito e débito.

## Funcionalidades

- Criar uma pessoa, o documento deve ser único por pessoa.
- Adicionar e listar contas de uma pessoa.
- Adicionar e listar cartões de uma conta. Na listagem do cartão, deve ser retornado somente os 4 últimos dígitos do número do cartão.
- Listar cartões de uma pessoa com paginação.
- Realizar transações em uma conta, validando o saldo (não é permitido saldo negativo).
- Listar transações em uma conta com paginação e filtro por data (ambos opcionais).
- Consultar o saldo de uma conta.
- [Opcional] Reverter uma transação.

## Entrega

Utilizando o github, nos envie o seu repositório. Nele deve conter as instruções de como executar a aplicação.

Observação: Caso configure o repositório como privado, nos solicite as contas que devem ter acesso para realizar a correção.

Aguardamos você! :)

## Endpoints

_Foi adicionado query params para paginação e crédito/débito para transações (era opcional)_

Siga exatamente os padrões de request e response.

- POST /people

  Realizar a criação de uma pessoa.

  Request:

  ```json
  {
    "name": "Carolina Rosa Marina Barros",
    "document": "569.679.155-76",
    "password": "senhaforte"
  }
  ```

  Response:

  ```json
  {
    "id": "4ca336a9-b8a5-4cc6-8ef8-a0a3b5b45ed7",
    "name": "Carolina Rosa Marina Barros",
    "document": "56967915576",
    "createdAt": "2022-08-01T14:30:41.203653",
    "updatedAt": "2022-08-01T14:30:41.203653"
  }
  ```

- POST /people/:peopleId/accounts

  Realizar a criação de uma conta para uma pessoa.

  Request:

  ```json
  {
    "branch": "001",
    "account": "2033392-5"
  }
  ```

  Response:

  ```json
  {
    "id": "b0a0ec35-6161-4ebf-bb4f-7cf73cf6448f",
    "branch": "001",
    "account": "2033392-5",
    "createdAt": "2022-08-01T14:30:41.203653",
    "updatedAt": "2022-08-01T14:30:41.203653"
  }
  ```

- GET /people/:peopleId/accounts

  Realiza a listagem de todas as contas de uma pessoa

  Response:

  ```json
  [
    {
      "id": "48bb7773-8ccc-4686-83f9-79581a5e5cd8",
      "branch": "001",
      "account": "2033392-5",
      "createdAt": "2022-08-01T14:30:41.203653",
      "updatedAt": "2022-08-01T14:30:41.203653"
    }
  ]
  ```

- POST /accounts/:accountId/cards

  Realiza a criação de um cartão em uma conta.

  Request:

  ```json
  {
    "type": "virtual",
    "number": "5179 7447 8594 6978",
    "cvv": "512"
  }
  ```

  Response:

  ```json
  {
    "id": "b0a0ec35-6161-4ebf-bb4f-7cf73cf6448f",
    "type": "virtual",
    "number": "6978",
    "cvv": "512",
    "createdAt": "2022-08-01T14:30:41.203653",
    "updatedAt": "2022-08-01T14:30:41.203653"
  }
  ```

- GET /accounts/:accountId/cards

  Realiza a listagem de todos os cartões de uma conta.

  Response:

  ```json
  {
    "id": "48bb7773-8ccc-4686-83f9-79581a5e5cd8",
    "branch": "001",
    "account": "2033392-5",
    "cards": [
      {
        "id": "05a0ab2d-5ece-45b6-b7d3-f3ecce2713d5",
        "type": "physical",
        "number": "0423",
        "cvv": "231",
        "createdAt": "2022-08-01T14:30:41.203653",
        "updatedAt": "2022-08-01T14:30:41.203653"
      },
      {
        "id": "b0a0ec35-6161-4ebf-bb4f-7cf73cf6448f",
        "type": "virtual",
        "number": "2145",
        "cvv": "512",
        "createdAt": "2022-08-01T14:30:41.203653",
        "updatedAt": "2022-08-01T14:30:41.203653"
      }
    ],
    "createdAt": "2022-08-01T14:30:41.203653",
    "updatedAt": "2022-08-01T14:30:41.203653"
  }
  ```

- GET /people/:peopleId/cards?page=1&pageSize=5

  Realiza a listagem de todos os cartões de uma pessoa.

  Response:

  ```json
  {
    "cards": [
      {
        "id": "05a0ab2d-5ece-45b6-b7d3-f3ecce2713d5",
        "type": "physical",
        "number": "0423",
        "cvv": "231",
        "createdAt": "2022-08-01T14:30:41.203653",
        "updatedAt": "2022-08-01T14:30:41.203653"
      },
      {
        "id": "b0a0ec35-6161-4ebf-bb4f-7cf73cf6448f",
        "type": "virtual",
        "number": "6978",
        "cvv": "512",
        "createdAt": "2022-08-01T14:30:41.203653",
        "updatedAt": "2022-08-01T14:30:41.203653"
      }
    ],
    "pagination": {
      "itemsPerPage": 5,
      "currentPage": 1
    }
  }
  ```

- POST /accounts/:accountId/transactions

  Realiza a criação de uma transação em uma conta.

  Request:

  ```json
  {
    "value": 100.0,
    "description": "Venda do cimento para Clodson",
    "cvv": "512",
    "type": "credit"
  }
  ```

  Response:

  ```json
  {
    "id": "05a0ab2d-5ece-45b6-b7d3-f3ecce2713d5",
    "value": 100.0,
    "description": "Venda do cimento para Lucas",
    "cvv": "512",
    "type": "credit",
    "createdAt": "2022-08-01T14:30:41.203653",
    "updatedAt": "2022-08-01T14:30:41.203653"
  }
  ```

- GET /accounts/:accountId/transactions?page=1&pageSize=5

  Listagem de todas as transações de uma conta, com paginação opcional via query parameters.

  Response:

  ```json
  {
    "transactions": [
      {
        "id": "05a0ab2d-5ece-45b6-b7d3-f3ecce2713d5",
        "value": 100.0,
        "description": "Venda do cimento para Lucas.",
        "type": "credit",
        "createdAt": "2022-08-01T14:30:41.203653",
        "updatedAt": "2022-08-01T14:30:41.203653"
      }
    ],
    "pagination": {
      "itemsPerPage": 5,
      "currentPage": 1
    }
  }
  ```

- GET /accounts/:accountId/balance

  Retorna o saldo de uma conta.

  Response:

  ```json
  {
    "balance": 100.0
  }
  ```

- POST /accounts/:accountId/transactions/:transactionId/revert

  Realiza a reversão de uma transação, portanto a ação inversa deve ser realizada. Caso seja a transação seja de crédito, deve ser feito um débito e vice-versa.

  Response:

  ```json
  {
    "id": "092ec73f-d7c3-4afb-bac0-9c7e8eb33eae",
    "value": 100.0,
    "description": "Estorno de cobrança indevida.",
    "type": "debit",
    "createdAt": "2022-08-01T14:30:41.203653",
    "updatedAt": "2022-08-01T14:30:41.203653"
  }
  ```
