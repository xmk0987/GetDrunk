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

  const cardBack = "https://deckofcardsapi.com/static/img/back.png";
  const radius = 200;

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
            {[...Array(52)].map((_, index) => {
              const angle = (360 / 52) * index;
              const x = radius * Math.cos((angle * Math.PI) / 180);
              const y = radius * Math.sin((angle * Math.PI) / 180);
              return (
                <div
                  key={index}
                  className="rof-single-card-container"
                  style={{
                    transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
                  }}
                >
                  <button
                    className="rof-single-card"
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    <img src={cardBack} alt="back of card" />
                  </button>
                </div>
              );
            })}
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
