import "./Dashboard.css";

interface DashboardProps {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

function Dashboard({ total, pending, inProgress, completed }: DashboardProps) {
  return (
    <section className="dashboard">
      <div className="dashboard__card">
        <span className="dashboard__label">Total de tarefas</span>
        <strong className="dashboard__value">{total}</strong>
      </div>
      <div className="dashboard__card dashboard__card--pending">
        <span className="dashboard__label">Pendentes</span>
        <strong className="dashboard__value">{pending}</strong>
      </div>
      <div className="dashboard__card dashboard__card--progress">
        <span className="dashboard__label">Em andamento</span>
        <strong className="dashboard__value">{inProgress}</strong>
      </div>
      <div className="dashboard__card dashboard__card--completed">
        <span className="dashboard__label">Concluídas</span>
        <strong className="dashboard__value">{completed}</strong>
      </div>
    </section>
  );
}

export default Dashboard;
