import type { z } from "zod";
import { AppError } from "../utils/AppError";

// Valida "data" com o schema. Se estiver tudo certo, devolve o dado LIMPO e tipado.
// Se não, lança um AppError 400 com a lista de problemas.
export function validate<T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.output<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    // Cada "issue" é um problema encontrado. Pegamos só a mensagem.
    // new Set remove mensagens repetidas.
    const details = [
      ...new Set(result.error.issues.map((issue) => issue.message)),
    ];
    throw new AppError("Dados inválidos", 400, details);
  }

  return result.data;
}
