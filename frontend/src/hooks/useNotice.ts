import { useCallback, useEffect, useState } from "react";

export interface Notice {
  type: "success" | "error";
  message: string;
}

export function useNotice() {
  const [notice, setNotice] = useState<Notice | null>(null);

  // Sempre que aparece uma mensagem nova, agenda o sumiço dela.
  // Como cada mensagem é um objeto novo, o cronômetro reinicia a cada uma.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const notifySuccess = useCallback((message: string) => {
    setNotice({ type: "success", message });
  }, []);

  const notifyError = useCallback((message: string) => {
    setNotice({ type: "error", message });
  }, []);

  const clearNotice = useCallback(() => setNotice(null), []);

  return { notice, notifySuccess, notifyError, clearNotice };
}
