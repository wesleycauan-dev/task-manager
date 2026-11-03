import type { Notice } from "../../hooks/useNotice";
import "./Toast.css";

interface ToastProps {
  notice: Notice;
  onClose: () => void;
}

function Toast({ notice, onClose }: ToastProps) {
  const isError = notice.type === "error";

  return (
    // role="alert" faz leitores de tela anunciarem o erro na hora;
    // role="status" anuncia o sucesso de forma mais discreta.
    <div
      className={`toast toast--${notice.type}`}
      role={isError ? "alert" : "status"}
    >
      <span>
        {isError ? "❌" : "✅"} {notice.message}
      </span>
      <button
        className="toast__close"
        onClick={onClose}
        aria-label="Fechar mensagem"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
