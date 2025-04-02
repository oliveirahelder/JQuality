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

```plaintext
JQuality/
├── backend/
│   ├── index.js          # Servidor Node.js
│   ├── package.json      # Dependências do backend
│   └── database/
│       └── schema.sql    # Esquema do banco de dados SQLite
├── frontend/
│   ├── src/
│   │   ├── App.js        # Componente principal do React
│   │   ├── ScenarioForm.js # Formulário para criação/edição de cenários
│   │   ├── ScenarioList.js # Lista de cenários
│   │   ├── index.js      # Ponto de entrada do React
│   │   └── style.css     # Estilos do frontend
│   ├── public/
│   │   └── index.html    # HTML principal
│   └── package.json      # Dependências do frontend
└── .gitignore            # Arquivos ignorados pelo Git
```

## Tecnologias Utilizadas

- **Frontend**: React
  - Componentes reutilizáveis (`ScenarioForm`, `ScenarioList`).
  - Estilização com CSS responsivo.
  - Gerenciamento de estado com hooks (`useState`, `useEffect`).

- **Backend**: Node.js, Express
  - Banco de dados SQLite para persistência.
  - API RESTful com endpoints para CRUD de cenários.

- **Banco de Dados**: SQLite
  - Esquema definido no arquivo `schema.sql`.

## Melhorias Futuras

- Adicionar autenticação e autorização.
- Implementar paginação na listagem de cenários.
- Adicionar testes unitários para o frontend e backend.
- Melhorar o feedback visual para erros e carregamento.
- Criar integração com ferramentas externas, como Jira.

## Como Contribuir

1. Faça um fork do repositório.
2. Crie uma branch para sua feature ou correção de bug:

   ```bash
   git checkout -b minha-feature
   ```

3. Faça commit das suas alterações:

   ```bash
   git commit -m "Descrição da minha feature"
   ```

4. Envie para o repositório remoto:

   ```bash
   git push origin minha-feature
   ```

5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
