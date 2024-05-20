import React from "react";
import { cardsBySuit } from "../../../../utils/images/cards/cards";
import { Card } from "../../../../utils/types/types";

interface GuesserOptionsProps {
  handleCardClick: (index: number) => void;
  isMasked: (index: number) => boolean;
  playedCards: Record<string, Card[]>;
}

const GuesserOptions: React.FC<GuesserOptionsProps> = ({
  handleCardClick,
  isMasked,
  playedCards,
}) => {
  const allCardsPlayed = (value: number) => {
    return playedCards[value]?.length === 4;
  };

  return (
    <section className="ftd-guesser-card-container">
      <p>Guess card number:</p>
      <div className="ftd-guesser-options">
        {cardsBySuit.H.map((card, index) => {
          return (
            <button
              key={index}
              onClick={() => handleCardClick(index + 1)}
              className={`${
                isMasked(index + 1) || allCardsPlayed(index + 1) ? "masked" : ""
              }`}
              disabled={isMasked(index + 1) || allCardsPlayed(index + 1)}
            >
              <img src={card} alt="card"></img>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default GuesserOptions;
