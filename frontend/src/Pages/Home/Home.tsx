import Navbar from "../../Components/Navbar/Navbar.tsx";
import Footer from "../../Components/Footer/Footer.tsx";

import "./home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/games");
  };

  return (
    <>
      <Navbar text="GET DRUNK" size={true} />
      <main className="home-main">
        <button
          className="lets-drink default-btn-style"
          onClick={handleNavigate}
        ></button>
      </main>
      <Footer />
    </>
  );
};

export default Home;
