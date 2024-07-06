import React, { useState, useCallback, useMemo } from "react";
import { useGameSocket } from "../../../Hooks/useGameSocket";
import { games } from "../../../utils/games/games";
import Navbar from "../../../Components/Navbar/Navbar";
import GetIntoGame from "../../../Components/Games/GetIntoGame/GetIntoGame";
import GameLobby from "../../../Components/Games/Lobby/GameLobby";
import RulesPopup from "../../../Components/Rules/RulesPopup";
import { RingOfFireLogic } from "../../../utils/gameLogics/ringOfFireLogic";
import GameMessage from "../../../Components/Games/Message/GameMessage";
import GameOver from "../../../Components/Games/GameOver/GameOver";

import "./ringoffire.css";

const RingOfFire: React.FC = () => {
  const GAME = games["ringOfFire"];
  const rofLogic = useMemo(() => new RingOfFireLogic(), []);
  const {
    error,
    message,
    loading,
    player,
    gameLogic,
    roomInfo,
    resetAll,
    setError,
    setLoading,
    startGame,
    handlePlayerAction,
  } = useGameSocket(rofLogic);

  const isGameOver = () => {
    return false;
  };

  return (
    <>
      <Navbar text="RING OF FIRE" resetGame={resetAll} />
      <main className="rof-container">
        {roomInfo?.game.status === "lobby" ? (
          <GameLobby
            roomId={roomInfo.roomId}
            roomData={roomInfo}
            player={player}
            gameData={GAME}
            onStartGame={startGame}
          />
        ) : gameLogic && gameLogic.status === "playing" ? (
          <>
            <GameMessage message={message} />
            <div className="rof-ring">
              <p>RING OF FIRE</p>
            </div>
          </>
        ) : (
          <GetIntoGame
            setError={setError}
            setLoading={setLoading}
            game_name={GAME.route}
          />
        )}
        {isGameOver() && <GameOver resetAll={resetAll} />}
        <RulesPopup header={GAME.name} rules={GAME.rules} />
      </main>
    </>
  );
};

export default RingOfFire;
