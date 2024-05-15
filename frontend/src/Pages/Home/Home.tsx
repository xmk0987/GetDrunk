import Navbar from "../../Components/Navbar/Navbar.tsx";
import Footer from "../../Components/Footer/Footer.tsx";

import "./home.css";
import React from "react";

const Home = () => {
  return (
    <>
      <Navbar text="GET DRUNK" size={true} />
      <main className="home-main">
        <button className="lets-drink default-btn-style"></button>
      </main>
      <Footer />
    </>
  );
};

export default Home;
