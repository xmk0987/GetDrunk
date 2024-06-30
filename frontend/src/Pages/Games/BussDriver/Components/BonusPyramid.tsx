import React from "react";
import { Player } from "../../../../utils/types/types";
import GameMessage from "../../../../Components/Games/Message/GameMessage";

interface Card {
  code: string;
  image: string;
  value: string;
  suit: string;
}

interface BonusPyramidProps {
  onCardTurned: (card: Card) => void;
  gameLogic: any;
  player: Player;
  message: string;
  resetBonus: () => void;
}

const BonusPyramid: React.FC<BonusPyramidProps> = ({
  onCardTurned,
  gameLogic,
  player,
  message,
  resetBonus,
}) => {
  const totalRows: number = 5;

  const isTurned = (cardCode: string) => {
    return gameLogic.turnedCards.hasOwnProperty(cardCode);
  };

  const handleTurnCard = (card: Card) => {
    if (isRowOpen(gameLogic.round - 1) && gameLogic.drinkAmount === 0) {
      onCardTurned(card);
    }
  };

  const isBussDriver = () => {
    return gameLogic.bussDriver === player.username;
  };

  const isRowOpen = (row: number) => {
    return gameLogic.round - 1 === row && isBussDriver();
  };

  // Debugging logs
  console.log("Current row:", gameLogic.round);
  console.log("Bus driver:", gameLogic.bussDriver);
  console.log("Player username:", player.username);
  console.log(
    "Is player the bus driver:",
    gameLogic.bussDriver === player.username
  );

  let cardIndex = 0;
  const rows = Array.from({ length: totalRows }, (_, row) => {
    const cards = Array.from({ length: totalRows - row }, (_, col) => {
      if (cardIndex < gameLogic.pyramid.length) {
        const card = gameLogic.pyramid[cardIndex];
        cardIndex++;
        return (
          <button
            key={card.code}
            className={`bd-bonus-pyramid-stack`}
            onClick={() => handleTurnCard(card)}
            disabled={!isRowOpen(row) || gameLogic.drinkAmount !== 0}
          >
            <img
              src={
                isTurned(card.code)
                  ? card.image
                  : "https://deckofcardsapi.com/static/img/back.png"
              }
              alt={card.code}
            />
          </button>
        );
      }
      return null;
    });
    return (
      <div
        className={`bd-bonus-pyramid-row ${
          isRowOpen(row) ? "bd-card-can-turn" : ""
        }`}
        key={row}
      >
        {cards}
      </div>
    );
  }).reverse();

  console.log("drink amount now", gameLogic.drinkAmount);

  return (
    <>
      <GameMessage message={message} />
      <div className="bd-pyramid-container">{rows}</div>
      {gameLogic.drinkAmount !== 0 && isBussDriver() ? (
        <div className="bd-pyramid-drinks-container">
          <h2>Drink {gameLogic.drinkAmount}</h2>
          <button onClick={resetBonus}>START OVER</button>
        </div>
      ) : null}
    </>
  );
};

export default BonusPyramid;
