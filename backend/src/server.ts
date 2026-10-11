import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { routes } from "./routes";

const app = express();

// CORS: autoriza o frontend (outra porta) a chamar esta API.
app.use(cors({ origin: env.frontendUrl }));

// Transforma o JSON enviado pelo cliente em um objeto em req.body.
app.use(express.json());

// Nossas rotas.
app.use(routes);

// Se nenhuma rota respondeu, devolve 404.
app.use(notFound);

// Por último, o tratador de erros.
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(` API rodando em http://localhost:${env.port}`);
});
