import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

// Uma tarefa válida, usada como base. Cada teste pode sobrescrever campos.
const validTask = {
  title: "Estudar React",
  description: "Componentes, props e hooks.",
  status: "pending",
  priority: "high",
  dueDate: "2026-10-10",
  category: "Estudos",
};

// Cria uma tarefa pela API e devolve o corpo da resposta.
async function createTask(overrides: Record<string, unknown> = {}) {
  const response = await request(app)
    .post("/tasks")
    .send({ ...validTask, ...overrides });

  expect(response.status).toBe(201); // se falhar aqui, o problema está na preparação
  return response.body as { id: number; title: string };
}

describe("GET /health", () => {
  it("responde que a API está no ar", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});

describe("rota inexistente", () => {
  it("retorna 404 em JSON", async () => {
    const response = await request(app).get("/nao-existe");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Rota não encontrada: GET /nao-existe");
  });
});

describe("POST /tasks", () => {
  it("cria uma tarefa e devolve 201", async () => {
    const response = await request(app).post("/tasks").send(validTask);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(validTask); // todos os campos enviados voltam iguais
    expect(typeof response.body.id).toBe("number");
    expect(response.body.dueDate).toBe("2026-10-10"); // texto, sem hora
    expect(response.body.createdAt).toBeDefined();
  });

  it("remove espaços do título", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ ...validTask, title: "  Estudar Zod  " });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Estudar Zod");
  });

  it("usa descrição vazia quando ela não é enviada", async () => {
    const { description: _description, ...withoutDescription } = validTask;
    const response = await request(app).post("/tasks").send(withoutDescription);

    expect(response.status).toBe(201);
    expect(response.body.description).toBe("");
  });

  it('ignora um "id" enviado no corpo', async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ ...validTask, id: 999 });

    expect(response.status).toBe(201);
    expect(response.body.id).not.toBe(999);
  });

  it("retorna 400 com a lista de problemas quando o corpo está incompleto", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "Sem data" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados inválidos");
    expect(response.body.details).toEqual(
      expect.arrayContaining(["A data de vencimento é obrigatória"]),
    );
  });

  it("retorna 400 para título só com espaços", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ ...validTask, title: "   " });

    expect(response.status).toBe(400);
    expect(response.body.details).toContain("O título é obrigatório");
  });

  it("retorna 400 para data que não existe", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ ...validTask, dueDate: "2026-02-31" });

    expect(response.status).toBe(400);
    expect(response.body.details).toContain(
      "Data de vencimento inválida. Use o formato AAAA-MM-DD",
    );
  });

  it("retorna 400 para status inválido", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ ...validTask, status: "pendente" });

    expect(response.status).toBe(400);
  });

  it("retorna 400 para JSON malformado", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Content-Type", "application/json")
      .send('{"title":');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("JSON inválido no corpo da requisição");
  });
});

describe("GET /tasks", () => {
  it("devolve lista vazia quando não há tarefas", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("devolve as tarefas mais novas primeiro", async () => {
    await createTask({ title: "Primeira" });
    await createTask({ title: "Segunda" });

    const response = await request(app).get("/tasks");

    expect(response.body.map((task: { title: string }) => task.title)).toEqual([
      "Segunda",
      "Primeira",
    ]);
  });

  describe("filtros", () => {
    // Três tarefas diferentes, recriadas antes de cada teste deste bloco.
    async function seed() {
      await createTask({
        title: "Estudar React",
        status: "pending",
        priority: "high",
        category: "Estudos",
      });
      await createTask({
        title: "Finalizar relatório",
        status: "in_progress",
        priority: "medium",
        category: "Trabalho",
      });
      await createTask({
        title: "Estudar Node",
        status: "pending",
        priority: "low",
        category: "Estudos",
      });
    }

    it("filtra por status", async () => {
      await seed();
      const response = await request(app).get("/tasks?status=pending");

      expect(response.body).toHaveLength(2);
    });

    it("filtra por prioridade", async () => {
      await seed();
      const response = await request(app).get("/tasks?priority=medium");

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe("Finalizar relatório");
    });

    it("filtra por categoria", async () => {
      await seed();
      const response = await request(app).get("/tasks?category=Trabalho");

      expect(response.body).toHaveLength(1);
    });

    it("pesquisa pelo título sem diferenciar maiúsculas", async () => {
      await seed();
      const response = await request(app).get("/tasks?search=ESTUDAR");

      expect(response.body).toHaveLength(2);
    });

    it("combina vários filtros", async () => {
      await seed();
      const response = await request(app).get(
        "/tasks?status=pending&priority=high&search=react",
      );

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe("Estudar React");
    });

    it('trata filtro vazio como "sem filtro"', async () => {
      await seed();
      const response = await request(app).get("/tasks?status=");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
    });

    it("retorna 400 para filtro com valor inválido", async () => {
      const response = await request(app).get("/tasks?status=abc");

      expect(response.status).toBe(400);
    });
  });
});

describe("GET /tasks/stats", () => {
  it("conta as tarefas por status (e não é confundido com um id)", async () => {
    await createTask({ status: "pending" });
    await createTask({ status: "pending" });
    await createTask({ status: "in_progress" });
    await createTask({ status: "completed" });

    const response = await request(app).get("/tasks/stats");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      total: 4,
      pending: 2,
      inProgress: 1,
      completed: 1,
    });
  });

  it("devolve tudo zerado quando não há tarefas", async () => {
    const response = await request(app).get("/tasks/stats");

    expect(response.body).toEqual({
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    });
  });
});

describe("GET /tasks/:id", () => {
  it("devolve a tarefa pedida", async () => {
    const task = await createTask();
    const response = await request(app).get(`/tasks/${task.id}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(validTask.title);
  });

  it("retorna 404 quando a tarefa não existe", async () => {
    const response = await request(app).get("/tasks/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Tarefa não encontrada");
  });

  it("retorna 400 para id inválido", async () => {
    const response = await request(app).get("/tasks/abc");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("ID inválido");
  });
});

describe("PATCH /tasks/:id", () => {
  it("altera só os campos enviados e mantém o resto", async () => {
    const task = await createTask();

    const response = await request(app)
      .patch(`/tasks/${task.id}`)
      .send({ status: "completed" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "completed", // mudou
      title: validTask.title, // ficou igual
      description: validTask.description, // ficou igual (não foi apagada)
      priority: "high", // ficou igual
    });
  });

  it("não permite trocar o id", async () => {
    const task = await createTask();

    const response = await request(app)
      .patch(`/tasks/${task.id}`)
      .send({ id: 999, title: "Novo título" });

    expect(response.body.id).toBe(task.id);
    expect(response.body.title).toBe("Novo título");
  });

  it("retorna 400 quando nenhum campo é enviado", async () => {
    const task = await createTask();
    const response = await request(app).patch(`/tasks/${task.id}`).send({});

    expect(response.status).toBe(400);
  });

  it("retorna 400 para valor inválido", async () => {
    const task = await createTask();
    const response = await request(app)
      .patch(`/tasks/${task.id}`)
      .send({ priority: "urgente" });

    expect(response.status).toBe(400);
  });

  it("retorna 404 quando a tarefa não existe", async () => {
    const response = await request(app)
      .patch("/tasks/999")
      .send({ title: "x" });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /tasks/:id", () => {
  it("exclui a tarefa e devolve 204 sem corpo", async () => {
    const task = await createTask();

    const response = await request(app).delete(`/tasks/${task.id}`);
    expect(response.status).toBe(204);
    expect(response.text).toBe("");

    // E ela realmente sumiu:
    const after = await request(app).get(`/tasks/${task.id}`);
    expect(after.status).toBe(404);
  });

  it("retorna 404 quando a tarefa não existe", async () => {
    const response = await request(app).delete("/tasks/999");

    expect(response.status).toBe(404);
  });

  it("retorna 400 para id inválido", async () => {
    const response = await request(app).delete("/tasks/abc");

    expect(response.status).toBe(400);
  });
});
