import React, { useState, useMemo, useEffect } from "react";
import { useGameSocket } from "../../../Hooks/useGameSocket";
import { games } from "../../../utils/games/games";
import Navbar from "../../../Components/Navbar/Navbar";
import GetIntoGame from "../../../Components/Games/GetIntoGame/GetIntoGame";
import GameLobby from "../../../Components/Games/Lobby/GameLobby";
import RulesPopup from "../../../Components/Rules/RulesPopup";
import { RingOfFireLogic } from "../../../gameLogics/ringOfFireLogic";
import GameMessage from "../../../Components/Games/Message/GameMessage";
import GameOver from "../../../Components/Games/GameOver/GameOver";

import "./ringoffire.css";
import { mapCardValueToNumber } from "../../../utils/helperFunctions";

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

  const [showCardRule, setShowCardRule] = useState<boolean>(false);
  const [radius, setRadius] = useState<number>(200); // Default radius is 200

  const cardRules: { [key: number]: string } = {
    1: "Ace (A): 'Waterfall' - The player who drew the card starts drinking, then the next player in the circle starts, and so on. Players can only stop drinking when the person before them stops.",
    2: "Two (2): 'You' - The player who drew the card points at another player, who must take a drink.",
    3: "Three (3): 'Me' - The player who drew the card must take a drink.",
    4: "Four (4): 'Floor' - All players must touch the floor. The last player to do so takes a drink.",
    5: "Five (5): 'Guys' - All male players take a drink.",
    6: "Six (6): 'Chicks' - All female players take a drink.",
    7: "Seven (7): 'Heaven' - All players must raise their hands. The last player to do so takes a drink.",
    8: "Eight (8): 'Mate' - The player who drew the card chooses another player to be their 'mate.' Whenever one drinks, both must drink.",
    9: "Nine (9): 'Rhyme' - The player who drew the card says a word, and players take turns saying words that rhyme with it. The first player who can't think of a rhyme or repeats a word drinks.",
    10: "Ten (10): 'Categories' - The player who drew the card chooses a category (e.g., types of beer). Players take turns naming items in that category. The first player who can't think of an item or repeats an item drinks.",
    11: "Jack (J): 'Make a Rule' - The player who drew the card creates a new rule that must be followed for the rest of the game. Anyone who breaks the rule drinks.",
    12: "Queen (Q): 'Question Master' - The player who drew the card becomes the Question Master. They can ask questions, and if another player answers any of their questions, that player must drink. This lasts until another Queen is drawn.",
    13: "King (K): 'King's Cup' - The first three players to draw a King pour some of their drink into the King's Cup. The player who draws the fourth King must drink the entire King's Cup.",
  };

  // Set radius based on screen width
  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth <= 450) {
        setRadius(100); // Smaller radius for small screens
      } else if (window.innerWidth <= 600) {
        setRadius(150); // Smaller radius for small screens
      } else {
        setRadius(200); // Default radius for larger screens
      }
    };

    // Set the radius initially
    updateRadius();

    // Listen for window resize events
    window.addEventListener("resize", updateRadius);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const handleCardClick = (index: number) => {
    handlePlayerAction("CARD-TURNED", { index });
  };

  const isGameOver = () => {
    return gameLogic?.deck?.remaining === 1;
  };

  const cardBack = "https://deckofcardsapi.com/static/img/back.png";

  const isPlayerTurn = () => {
    if (!player || !gameLogic) {
      return false;
    }
    return player.username === gameLogic.playerInTurn.username;
  };

  const toggleShowCardRule = (): void => {
    setShowCardRule(!showCardRule);
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
            <GameMessage message={message ?? ""} />
            {player ? (
              <p data-testid="rof-self-player" className="rof-player-name">
                {player.username}
              </p>
            ) : null}
            {gameLogic.playerInTurn ? (
              <p data-testid="rof-turn" className="rof-turn">
                <span className="rof-turn-span">Turn:</span>{" "}
                {gameLogic.playerInTurn.username}
              </p>
            ) : null}
            {gameLogic.questionMaster ? (
              <p className="rof-qm">
                <span className="rof-turn-span">QM:</span>{" "}
                {gameLogic.questionMaster.username}
              </p>
            ) : null}
            {gameLogic.card ? (
              <>
                <div className="rof-turned-card">
                  <img
                    src={gameLogic.card.image}
                    alt={`Turned card is ${gameLogic.card.code}`}
                  ></img>
                </div>
                {showCardRule ? (
                  <div
                    data-testid="rof-turned-card-rules"
                    className="rof-turned-card-rule-popup"
                  >
                    <p className="rof-turned-card-rule">
                      {cardRules[mapCardValueToNumber(gameLogic.card.value)]}
                    </p>
                    <button onClick={toggleShowCardRule}>CLOSE</button>
                  </div>
                ) : null}
                <button
                  className="rof-show-card-rule"
                  onClick={toggleShowCardRule}
                >
                  Card Rule
                </button>
              </>
            ) : null}
            {gameLogic.cards.map((card: number, index: number) => {
              if (card === 0) return null; // Do not render cards that have been "removed"
              const angle = (360 / gameLogic.cards.length) * index;
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
                    disabled={!isPlayerTurn()}
                    onClick={() => handleCardClick(index)}
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
