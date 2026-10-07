import {
  CATEGORIES,
  INITIAL_FILTERS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  type TaskFilters,
} from "../../types/task";
import "./Filters.css";

interface FiltersProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

function Filters({ filters, onChange }: FiltersProps) {
  // Atualiza UM campo dos filtros, mantendo os outros como estavam.
  function handleChange<K extends keyof TaskFilters>(
    key: K,
    value: TaskFilters[K],
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <section className="filters">
      <input
        className="filters__search"
        type="text"
        placeholder="🔎 Pesquisar tarefa..."
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
      />

      <select
        className="filters__select"
        value={filters.status}
        onChange={(e) =>
          handleChange("status", e.target.value as TaskFilters["status"])
        }
      >
        <option value="all">Status: Todas</option>
        <option value="pending">{STATUS_LABELS.pending}s</option>
        <option value="in_progress">{STATUS_LABELS.in_progress}</option>
        <option value="completed">{STATUS_LABELS.completed}s</option>
      </select>

      <select
        className="filters__select"
        value={filters.priority}
        onChange={(e) =>
          handleChange("priority", e.target.value as TaskFilters["priority"])
        }
      >
        <option value="all">Prioridade: Todas</option>
        <option value="low">{PRIORITY_LABELS.low}</option>
        <option value="medium">{PRIORITY_LABELS.medium}</option>
        <option value="high">{PRIORITY_LABELS.high}</option>
      </select>

      <select
        className="filters__select"
        value={filters.category}
        onChange={(e) =>
          handleChange("category", e.target.value as TaskFilters["category"])
        }
      >
        <option value="all">Categoria: Todas</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <button
        className="filters__clear"
        onClick={() => onChange(INITIAL_FILTERS)}
      >
        Limpar
      </button>
    </section>
  );
}

export default Filters;
