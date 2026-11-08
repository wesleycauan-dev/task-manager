import { describe, expect, it } from "vitest";
import type { TaskFormData } from "../types/task";
import { isValidDate, validateTaskForm } from "./validateTask";

const validData: TaskFormData = {
  title: "Estudar React",
  description: "Componentes e hooks.",
  status: "pending",
  priority: "high",
  dueDate: "2026-10-10",
  category: "Estudos",
};

describe("isValidDate", () => {
  it("aceita datas reais, inclusive 29/02 em ano bissexto", () => {
    expect(isValidDate("2026-10-10")).toBe(true);
    expect(isValidDate("2028-02-29")).toBe(true);
  });

  it("rejeita datas que não existem ou com formato errado", () => {
    expect(isValidDate("2027-02-29")).toBe(false);
    expect(isValidDate("2026-02-31")).toBe(false);
    expect(isValidDate("10/10/2026")).toBe(false);
    expect(isValidDate("")).toBe(false);
  });
});

describe("validateTaskForm", () => {
  it("não encontra erros em dados válidos", () => {
    expect(validateTaskForm(validData)).toEqual({});
  });

  it("exige o título", () => {
    expect(validateTaskForm({ ...validData, title: "" }).title).toBe(
      "O título é obrigatório.",
    );
  });

  it("trata título só com espaços como vazio", () => {
    expect(validateTaskForm({ ...validData, title: "   " }).title).toBe(
      "O título é obrigatório.",
    );
  });

  it("aceita título com 100 caracteres, mas não com 101", () => {
    expect(
      validateTaskForm({ ...validData, title: "a".repeat(100) }).title,
    ).toBeUndefined();
    expect(
      validateTaskForm({ ...validData, title: "a".repeat(101) }).title,
    ).toBeDefined();
  });

  it("limita a descrição a 500 caracteres", () => {
    expect(
      validateTaskForm({ ...validData, description: "a".repeat(501) })
        .description,
    ).toBeDefined();
  });

  it("descrição vazia é permitida", () => {
    expect(
      validateTaskForm({ ...validData, description: "" }).description,
    ).toBeUndefined();
  });

  it("exige a data de vencimento", () => {
    expect(validateTaskForm({ ...validData, dueDate: "" }).dueDate).toBe(
      "A data de vencimento é obrigatória.",
    );
  });

  it("rejeita data inexistente", () => {
    expect(
      validateTaskForm({ ...validData, dueDate: "2026-02-31" }).dueDate,
    ).toBe("Informe uma data válida.");
  });

  it("rejeita status inválido", () => {
    const invalidStatus = "pendente" as unknown as TaskFormData["status"];
    expect(
      validateTaskForm({ ...validData, status: invalidStatus }).status,
    ).toBeDefined();
  });

  it("reporta vários erros ao mesmo tempo", () => {
    const errors = validateTaskForm({ ...validData, title: "", dueDate: "" });
    expect(Object.keys(errors)).toEqual(["title", "dueDate"]);
  });
});
