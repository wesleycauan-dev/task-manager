import "./Header.css";

interface HeaderProps {
  onNewTask: () => void; // função chamada ao clicar no botão
}

function Header({ onNewTask }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header__content">
        <h1 className="header__title">📋 Task Manager</h1>
        <button className="header__button" onClick={onNewTask}>
          + Nova tarefa
        </button>
      </div>
    </header>
  );
}

export default Header;
