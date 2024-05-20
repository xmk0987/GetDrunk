import React from "react";
import { Card } from "../../../../utils/types/types";

interface PlayedCardsProps {
  groupedCards: Record<string, Card[]>;
}

const PlayedCards: React.FC<PlayedCardsProps> = ({ groupedCards }) => {
  // Renders the Played cards in order in stacks to the game board
  return (
    <section className="ftd-played-cards-container">
      <p>Played cards:</p>
      <div className="ftd-played-cards">
        {Object.keys(groupedCards).map((value) => (
          <div className="ftd-card-stack" key={value}>
            {groupedCards[value].map((card: Card, index: number) => (
              <div
                className="ftd-card"
                key={card.code}
                style={{ top: `${index * 25}px` }}
              >
                <img src={card.image} alt={`card-${card.code}`}></img>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlayedCards;
