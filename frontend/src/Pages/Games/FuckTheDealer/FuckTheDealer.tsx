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
    error,
    loading,
    gameState,
    player,
    roomId,
    roomInfo,
    gameLogic, // Access the game logic instance
    setError,
    setLoading,
    startGame,
    handlePlayerAction,
  } = useGameSocket(ftdLogic);

  if (loading) {
    return <div>Loading...</div>; // Render loading state
  }

  if (error) {
    return <div>Error occurred...</div>; // Render error state
  }

  console.log(gameLogic);
  console.log(gameState);
  return (
    <>
      <Navbar text="F*CK THE DEALER" />
      <main className="ftd-container">
        {gameState === "lobby" && roomInfo ? (
          <GameLobby
            roomId={roomId}
            roomData={roomInfo}
            username={player.username}
            gameData={GAME}
            onStartGame={startGame}
          />
        ) : gameState === "game" ? (
          <div className="ftd-board">
            <section className="ftd-players">
              {roomInfo?.players.map((mPlayer) => (
                <div className="ftd-player" key={mPlayer.socketId}>
                  <p className="ftd-player-name">{mPlayer.username}</p>
                  {gameLogic.dealer === mPlayer.socketId ? (
                    <p className={`ftd-player-turn dealer`}>Dealer</p>
                  ) : null}
                  {gameLogic.guesser === mPlayer.socketId ? (
                    <p className={`ftd-player-turn guesser`}>Guesser</p>
                  ) : null}
                </div>
              ))}
            </section>

            <section className="ftd-turn-counter">
              <p>
                Wrong guesses: <span>0/3</span>
              </p>
            </section>

            <section className="ftd-played-cards-container">
              <p>Played cards:</p>
              <div className="ftd-played-cards">
                <div className="ftd-card">Aces</div>
                <div className="ftd-card">2</div>
                <div className="ftd-card">3</div>
                <div className="ftd-card">4</div>
                <div className="ftd-card">5</div>
                <div className="ftd-card">6</div>
                <div className="ftd-card">7</div>
                <div className="ftd-card">8</div>
                <div className="ftd-card">9</div>
                <div className="ftd-card">10</div>
                <div className="ftd-card">J</div>
                <div className="ftd-card">Q</div>
                <div className="ftd-card">K</div>
                <div className="ftd-card">Cards left</div>
              </div>
            </section>

            {gameLogic && gameLogic.dealer === player.socketId ? (
              <section className="ftd-dealer-card-container">
                {gameLogic?.deck?.cards?.length === 1 ? (
                  <div className="ftd-dealer-card">
                    <img
                      src={gameLogic.deck.cards[0].image}
                      alt="Card to guess"
                    ></img>
                  </div>
                ) : null}
              </section>
            ) : null}

            <section className="ftd-guesser-card-container"></section>
          </div>
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
