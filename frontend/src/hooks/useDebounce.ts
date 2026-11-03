import { useEffect, useState } from "react";

// Devolve uma versão "atrasada" de um valor: só muda depois que o valor
// ficar parado por "delay" milissegundos.
// <T> é um genérico: funciona com texto, número, qualquer tipo.
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // Agenda a atualização para daqui a "delay" ms.
    const timer = setTimeout(() => setDebounced(value), delay);

    // Cleanup: se "value" mudar antes do tempo acabar, cancela o agendamento.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
