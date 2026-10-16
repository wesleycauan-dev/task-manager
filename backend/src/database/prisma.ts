import { PrismaClient } from "@prisma/client";
import "../config/env"; // garante que o .env já foi lido

// Uma única instância do client para o projeto inteiro.
// Cada PrismaClient abre um "pool" de conexões com o banco,
// então não devemos criar um novo a cada requisição.
export const prisma = new PrismaClient();
