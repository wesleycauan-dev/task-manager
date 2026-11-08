# 📋 Task Manager

Aplicação **Full Stack** de gerenciamento de tarefas, com CRUD completo, filtros combinados, pesquisa e dashboard. Construída para praticar a integração entre **React, Node.js e PostgreSQL**.

🔗 **Demo:** _em breve (link do deploy)_

![Tela principal](docs/home-desktop.png)

## ✨ Funcionalidades

- Criar, visualizar, editar e excluir tarefas
- Marcar tarefas como concluídas com um clique
- Definir título, descrição, status, prioridade, categoria e data de vencimento
- Filtrar por status, prioridade e categoria (filtros combináveis)
- Pesquisar tarefas pelo título, com _debounce_ para evitar requisições desnecessárias
- Dashboard com totais gerais (total, pendentes, em andamento e concluídas)
- Validação de dados no formulário, na API e no banco
- Mensagens de sucesso e erro, estados de carregamento e de lista vazia
- Layout responsivo (desktop, tablet e celular)
- Testes automatizados (API e validação)

## 🛠️ Tecnologias

| Camada             | Tecnologias                                                      |
| ------------------ | ---------------------------------------------------------------- |
| **Frontend**       | React, TypeScript, Vite, HTML5, CSS3                             |
| **Backend**        | Node.js, Express, TypeScript, API REST, Zod                      |
| **Banco de dados** | PostgreSQL, Prisma ORM                                           |
| **Testes**         | Vitest, Supertest                                                |
| **Ferramentas**    | Git, GitHub, npm, Docker Compose, variáveis de ambiente (`.env`) |

## 🖼️ Screenshots

| Filtros e pesquisa           | Formulário com validação           | Mobile                     |
| ---------------------------- | ---------------------------------- | -------------------------- |
| ![Filtros](docs/filtros.png) | ![Formulário](docs/formulario.png) | ![Mobile](docs/mobile.png) |

## 🏗️ Arquitetura

```text
React (Vite, porta 5173)  →  API Node.js (Express, porta 3333)  →  PostgreSQL (porta 5432)
        fetch                   Route → Controller → Service            via Prisma
```

**Backend em camadas:**

| Camada        | Responsabilidade                                              |
| ------------- | ------------------------------------------------------------- |
| `routes`      | Liga cada URL e método HTTP a um controller                   |
| `controllers` | Lê a requisição, valida a entrada e devolve a resposta HTTP   |
| `services`    | Regras de negócio e acesso ao banco (Prisma)                  |
| `middlewares` | CORS, leitura de JSON, rota 404 e tratamento central de erros |
| `validators`  | Schemas Zod que validam o que chega na API                    |

## 📁 Estrutura do projeto

```text
task-manager/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/          # leitura das variáveis de ambiente
│   │   ├── controllers/
│   │   ├── database/        # cliente do Prisma
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts           # monta o Express
│   │   └── server.ts        # liga na porta
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Header, Dashboard, Filters, TaskCard, TaskList, TaskForm, Toast
│   │   ├── hooks/           # useTasks, useDebounce, useNotice
│   │   ├── pages/Home/
│   │   ├── services/api.ts  # todas as chamadas à API
│   │   ├── types/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── docs/                    # screenshots
├── docker-compose.yml
└── README.md
```

## 🚀 Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org) 20 ou superior
- [Git](https://git-scm.com)
- [Docker](https://www.docker.com/products/docker-desktop/) (recomendado para o PostgreSQL) ou um PostgreSQL 16+ instalado

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/task-manager.git
cd task-manager
```

### 2. Subir o banco de dados

```bash
docker compose up -d
```

Isso cria um PostgreSQL na porta 5432, com o banco `task_manager`.

> Sem Docker? Crie o banco manualmente (`CREATE DATABASE task_manager;`) e ajuste a `DATABASE_URL` no próximo passo.

### 3. Configurar e executar o backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run dev
```

No Windows (PowerShell), troque `cp` por `copy`.

A API fica em `http://localhost:3333`. Teste em `http://localhost:3333/health`.

### 4. Configurar e executar o frontend

Em **outro terminal**:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Abra `http://localhost:5173`.

## 🔐 Variáveis de ambiente

**`backend/.env`**

| Variável       | Descrição                       | Exemplo                                                                    |
| -------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `PORT`         | Porta da API                    | `3333`                                                                     |
| `DATABASE_URL` | URL de conexão com o PostgreSQL | `postgresql://postgres:postgres@localhost:5432/task_manager?schema=public` |
| `FRONTEND_URL` | Origem permitida pelo CORS      | `http://localhost:5173`                                                    |

**`frontend/.env`**

| Variável       | Descrição       | Exemplo                 |
| -------------- | --------------- | ----------------------- |
| `VITE_API_URL` | URL base da API | `http://localhost:3333` |

> Os arquivos `.env` não são versionados. Use os `.env.example` como modelo.

## 📡 Endpoints da API

URL base: `http://localhost:3333`

| Método   | Rota           | Descrição                      | Sucesso |
| -------- | -------------- | ------------------------------ | ------- |
| `GET`    | `/health`      | Verifica se a API está no ar   | 200     |
| `GET`    | `/tasks`       | Lista tarefas (aceita filtros) | 200     |
| `GET`    | `/tasks/stats` | Totais para o dashboard        | 200     |
| `GET`    | `/tasks/:id`   | Busca uma tarefa               | 200     |
| `POST`   | `/tasks`       | Cria uma tarefa                | 201     |
| `PATCH`  | `/tasks/:id`   | Atualiza campos de uma tarefa  | 200     |
| `DELETE` | `/tasks/:id`   | Exclui uma tarefa              | 204     |

### Filtros (query parameters)

Todos opcionais e combináveis:

| Parâmetro  | Valores                                              |
| ---------- | ---------------------------------------------------- |
| `status`   | `pending`, `in_progress`, `completed`                |
| `priority` | `low`, `medium`, `high`                              |
| `category` | `Estudos`, `Trabalho`, `Pessoal`, `Outros`           |
| `search`   | Texto contido no título (sem diferenciar maiúsculas) |

```text
GET /tasks?status=pending&priority=high&search=react
```

### Exemplo: criar uma tarefa

**Requisição**

```http
POST /tasks
Content-Type: application/json

{
  "title": "Estudar React",
  "description": "Componentes, props e hooks.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-10-10",
  "category": "Estudos"
}
```

**Resposta `201 Created`**

```json
{
  "id": 1,
  "title": "Estudar React",
  "description": "Componentes, props e hooks.",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-10-10",
  "category": "Estudos",
  "createdAt": "2026-10-05T14:30:00.000Z"
}
```

### Exemplo: estatísticas

```json
{ "total": 12, "pending": 5, "inProgress": 4, "completed": 3 }
```

### Erros

Toda resposta de erro segue o mesmo formato:

```json
{
  "message": "Dados inválidos",
  "details": ["O título é obrigatório", "A data de vencimento é obrigatória"]
}
```

| Status | Quando                                          |
| ------ | ----------------------------------------------- |
| `400`  | Dados inválidos, ID inválido ou JSON malformado |
| `404`  | Tarefa ou rota não encontrada                   |
| `500`  | Erro interno do servidor                        |

## 🗄️ Modelo de dados

Tabela `tasks`:

| Coluna        | Tipo           | Observação                                 |
| ------------- | -------------- | ------------------------------------------ |
| `id`          | `SERIAL`       | Chave primária                             |
| `title`       | `VARCHAR(100)` | Obrigatório                                |
| `description` | `TEXT`         | Padrão: vazio                              |
| `status`      | enum           | `pending`, `in_progress`, `completed`      |
| `priority`    | enum           | `low`, `medium`, `high`                    |
| `due_date`    | `DATE`         | Obrigatório                                |
| `category`    | enum           | `Estudos`, `Trabalho`, `Pessoal`, `Outros` |
| `created_at`  | `TIMESTAMP`    | Preenchido automaticamente                 |
| `updated_at`  | `TIMESTAMP`    | Atualizado automaticamente                 |

## 🧪 Testes

### Backend (Vitest + Supertest)

Os testes usam um **banco separado** (`task_manager_test`) e se recusam a rodar em qualquer banco cujo nome não termine em `_test`.

```bash
# Criar o banco de teste (uma vez)
docker exec -it task-manager-db psql -U postgres -c "CREATE DATABASE task_manager_test;"

cd backend
cp .env.test.example .env.test
npm run test:setup   # aplica as migrations no banco de teste
npm run test
```

### Frontend (Vitest)

```bash
cd frontend
npm run test
```

### Verificação de qualidade

```bash
npm run typecheck   # em backend/ e frontend/
npm run build
npm run lint        # em frontend/
```

## 📜 Scripts úteis

**Backend:** `dev`, `build`, `start`, `typecheck`, `test`, `prisma:migrate`, `prisma:studio`
**Frontend:** `dev`, `build`, `preview`, `typecheck`, `lint`, `test`

## 🗺️ Próximos passos

- [ ] Autenticação de usuários (cada pessoa vê só as suas tarefas)
- [ ] Paginação da lista de tarefas
- [ ] Testes de componentes (React Testing Library) e E2E (Playwright)
- [ ] Modal de confirmação próprio para exclusão
- [ ] Pesquisa sem diferenciar acentos (extensão `unaccent` do PostgreSQL)

## 👤 Autor

**SEU NOME**
[GitHub](https://github.com/SEU_USUARIO) · [LinkedIn](https://www.linkedin.com/in/SEU_PERFIL)
