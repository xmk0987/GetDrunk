import MainHeader from "../Header/MainHeader";
import "./navbar.css";

interface MainHeaderProps {
  text: string;
  size?: boolean | null; // Making `size` optional and can be boolean or null
}

const Navbar: React.FC<MainHeaderProps> = ({
  text,
  size = null, // Default `size` to `null` if not provided
}) => (
  <nav className="main-navbar">
    <ul>
      <li>
        <button>Home</button>
      </li>
      <li>
        <button>Games</button>
      </li>
      <li>
        <button>About</button>
      </li>
    </ul>
    <MainHeader text={text} size={size} />
  </nav>
);

export default Navbar;
