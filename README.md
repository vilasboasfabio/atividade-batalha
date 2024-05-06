# Batalha de Barraqueiros API

Esta API permite que você gerencie uma batalha de barraqueiros. Você pode criar, ler, atualizar e deletar barraqueiros, bem como gerenciar batalhas entre eles.

<p align="center">
  <img src="assets/adoro-um-barraco.jpg" alt="Texto alternativo" width="200"/>
</p>

## Endpoints

### `GET /barraqueiros`

Retorna uma lista de todos os barraqueiros.

### `GET /barraqueiros/:id`

Retorna um barraqueiro específico, onde `:id` é o ID do barraqueiro.

### `POST /barraqueiros`

Cria um novo barraqueiro. O corpo da requisição deve ser um objeto JSON com as seguintes propriedades:

- `nome`: O nome do barraqueiro (string)
- `classe`: A classe do barraqueiro (string)
- `nivel`: O nível do barraqueiro (integer)
- `vida`: A vida do barraqueiro (integer)
- `deboche`: O deboche do barraqueiro (integer)
- `forca`: A força do barraqueiro (integer)
- `recalque`: O recalque do barraqueiro (integer)
- `frase`: A frase do barraqueiro (string)

### `PUT /barraqueiros/:id`

Atualiza um barraqueiro existente, onde `:id` é o ID do barraqueiro. O corpo da requisição deve ser um objeto JSON com as mesmas propriedades que o `POST /barraqueiros`.

### `DELETE /barraqueiros/:id`

Deleta um barraqueiro específico, onde `:id` é o ID do barraqueiro.

### `GET /batalhas`

Retorna uma lista de todas as batalhas.

### `GET /batalhas/:id`

Retorna uma batalha específica, onde `:id` é o ID da batalha.

### `GET /batalhas/nome/:nome`

Retorna uma lista de batalhas em que o barraqueiro com o nome `:nome` participou.

## Como rodar localmente

1. Clone este repositório
2. Instale as dependências com `npm install`
3. Inicie o servidor com `npm start`
4. A API estará disponível em `http://localhost:3000`

## Como rodar os testes

1. Instale as dependências de desenvolvimento com `npm install --only=dev`
2. Rode os testes com `npm test`

## Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- Jest (para testes)

## Contribuindo

Por favor, abra uma issue para discutir qualquer alteração que você queira fazer. Pull requests são bem-vindos, mas certifique-se de atualizar os testes conforme necessário.
