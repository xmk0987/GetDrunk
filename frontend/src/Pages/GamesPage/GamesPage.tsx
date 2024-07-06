import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import GameCard from "./Games/GameCard";

import "./gamespage.css";

import { games } from "../../utils/games/games";

const GamesPage = () => {
  return (
    <>
      <Navbar text="GAMES" />
      <main className="games-main">
        {Object.values(games).map((game, index) => (
          <GameCard key={index} game={game} />
        ))}
      </main>
      <Footer />
    </>
  );
};

export default GamesPage;
