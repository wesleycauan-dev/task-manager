// Confere se o texto é uma data REAL no formato AAAA-MM-DD.
// "2026-02-31" tem o formato certo, mas não existe: o JavaScript
// "corrige" para 3 de março, então comparamos o resultado com o original.
export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
