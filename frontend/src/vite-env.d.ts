/// <reference types="vite/client" />

// Dizemos ao TypeScript quais variáveis de ambiente existem.
// Sem isso, import.meta.env.VITE_API_URL seria do tipo "any".
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
