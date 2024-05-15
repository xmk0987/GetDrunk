import React from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import GetIntoGame from "../../../Components/Games/GetIntoGame/GetIntoGame";
import GameLobby from "../../../Components/Games/Lobby/GameLobby";
import { useGameSocket } from "../../../Hooks/useGameSocket";
import { games } from "../../../utils/games/games";
import { FuckTheDealerLogic } from "../../../utils/gameLogics/fuckTheDealerLogic";
import "./fuckthedealer.css";

const FuckTheDealer: React.FC = () => {
  const GAME = games["fuckTheDealer"];
  const ftdLogic = new FuckTheDealerLogic();

  const {
    message,
    error,
    loading,
    roomState,
    username,
    roomId,
    roomInfo,
    setError,
    setLoading,
    startGame,
  } = useGameSocket(ftdLogic);

  if (loading) {
    return <div>Loading...</div>; // Render loading state
  }

  if (error) {
    return <div>Error occured...</div>; // Render loading state
  }

  return (
    <>
      <Navbar text="F*CK THE DEALER" />
      <main className="fuck-the-dealer-container">
        {roomState === "lobby" && roomInfo ? (
          <GameLobby
            roomId={roomId}
            roomData={roomInfo}
            username={username}
            gameData={GAME}
            onStartGame={startGame}
          />
        ) : roomState === "game" ? (
          <div>Game started</div>
        ) : (
          <GetIntoGame
            setError={setError}
            setLoading={setLoading}
            game_name={GAME.route}
          />
        )}
      </main>
    </>
  );
};

export default FuckTheDealer;
