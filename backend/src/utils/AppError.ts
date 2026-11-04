// Erro "esperado" da aplicação: carrega o status HTTP que deve ser respondido.
// Exemplos: new AppError('Tarefa não encontrada', 404)
//           new AppError('Dados inválidos', 400, ['O título é obrigatório'])
export class AppError extends Error {
  statusCode: number;
  details: string[];

  constructor(message: string, statusCode = 500, details: string[] = []) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
  }
}
