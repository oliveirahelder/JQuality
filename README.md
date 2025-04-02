# JQuality

Este projeto contém o frontend e o backend para a ferramenta JQuality, que permite gerenciar cenários de qualidade.

## Funcionalidades

### Frontend Features

- Listagem de cenários.
- Criação de novos cenários.
- Edição de cenários existentes.
- Exclusão de cenários.
- Interface responsiva com React.
- Menu lateral (drawer) para criação e edição de cenários.

### Backend API

- API RESTful desenvolvida com Node.js e SQLite.
- Endpoints para gerenciar cenários:
  - `GET /api/scenarios`: Lista todos os cenários.
  - `GET /api/scenarios/:id`: Busca um cenário específico pelo ID.
  - `POST /api/scenarios`: Cria um novo cenário.
  - `PUT /api/scenarios/:id`: Atualiza um cenário existente.
  - `DELETE /api/scenarios/:id`: Exclui um cenário.

## Como executar

### Pré-requisitos

- Node.js instalado.
- SQLite instalado.

### Backend

1. Navegue até a pasta `backend`:

   ```bash
   cd backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor:

   ```bash
   npm start
   ```

4. O backend estará disponível em `http://localhost:3000`.

### Frontend

1. Navegue até a pasta `frontend`:

   ```bash
   cd frontend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor:

   ```bash
   npm start
   ```

4. O frontend estará disponível em `http://localhost:3001`.

## Estrutura do Projeto

``` plaintext
JQuality/
├── backend/
│   ├── index.js          # Servidor Node.js
│   ├── package.json      # Dependências do backend
│   └── database/
│       └── schema.sql    # Esquema do banco de dados SQLite
├── frontend/
│   ├── src/
│   │   ├── App.js        # Componente principal do React
│   │   └── index.js      # Ponto de entrada do React
│   ├── public/
│   │   └── index.html    # HTML principal
│   └── package.json      # Dependências do frontend
```

## Tecnologias Utilizadas

- **Frontend**: React
- **Backend**: Node.js, Express
- **Banco de Dados**: SQLite
