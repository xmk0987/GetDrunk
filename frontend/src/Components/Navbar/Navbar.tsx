import { useNavigate } from "react-router-dom";
import "./navbar.css";

interface NavBarProps {
  text: string;
  resetGame?: () => void; // Making `resetGame` optional
}

const Navbar: React.FC<NavBarProps> = ({ text, resetGame }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (resetGame) {
      resetGame();
    }
    navigate(path);
  };

  return (
    <nav
      className="main-navbar"
      style={{
        justifyContent: "space-between",
      }}
    >
      <p>{text}</p>
      <ul>
        <li>
          <button onClick={() => handleNavigate("/")}>Home</button>
        </li>
        <li>
          <button onClick={() => handleNavigate("/games")}>Games</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
