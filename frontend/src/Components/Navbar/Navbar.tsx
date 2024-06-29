import { useNavigate } from "react-router-dom";
import MainHeader from "../Header/MainHeader";
import "./navbar.css";

interface MainHeaderProps {
  text: string;
  size?: boolean | null; // Making `size` optional and can be boolean or null
  header: boolean;
}

const Navbar: React.FC<MainHeaderProps> = ({
  text,
  size = null, // Default `size` to `null` if not provided
  header = true,
}) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <nav
      className="main-navbar"
      style={{
        justifyContent: header ? "flex-end" : "space-between",
      }}
    >
      {header ? <MainHeader text={text} size={size} /> : <p>{text}</p>}
      <ul>
        <li>
          <button onClick={() => handleNavigate("/")}>Home</button>
        </li>
        <li>
          <button onClick={() => handleNavigate("/games")}>Games</button>
        </li>
        <li>
          <button onClick={() => handleNavigate("/about")}>About</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
