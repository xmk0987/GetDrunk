import Navbar from "../../Components/Navbar/Navbar.tsx";
import Footer from "../../Components/Footer/Footer.tsx";
import GameCard from "./Games/GameCard.tsx";

import "./gamespage.css";

import { games } from "../../utils/games/games.ts";

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
