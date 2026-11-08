import { describe, expect, it } from "vitest";
import { isValidDate } from "../src/utils/date";

describe("isValidDate", () => {
  it("aceita uma data real", () => {
    expect(isValidDate("2026-10-10")).toBe(true);
  });

  it("aceita 29/02 em ano bissexto", () => {
    expect(isValidDate("2028-02-29")).toBe(true);
  });

  it("rejeita 29/02 em ano não bissexto", () => {
    expect(isValidDate("2027-02-29")).toBe(false);
  });

  it("rejeita dia que não existe", () => {
    expect(isValidDate("2026-02-31")).toBe(false);
  });

  it("rejeita formato errado", () => {
    expect(isValidDate("10/10/2026")).toBe(false);
    expect(isValidDate("2026-1-1")).toBe(false);
    expect(isValidDate("")).toBe(false);
  });
});
