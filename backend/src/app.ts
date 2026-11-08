import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { routes } from "./routes";

// Aqui só MONTAMOS o app. Quem liga na porta é o server.ts.
export const app = express();

// 1. CORS: autoriza o frontend (outra porta) a chamar esta API.
app.use(cors({ origin: env.frontendUrl }));

// 2. Transforma o JSON enviado pelo cliente em um objeto em req.body.
app.use(express.json());

// 3. Nossas rotas.
app.use(routes);

// 4. Se nenhuma rota respondeu, devolve 404.
app.use(notFound);

// 5. Por último, o tratador de erros.
app.use(errorHandler);
