import React from "react";
import { Card } from "../../../../utils/types/types";

interface HandProps {
  hand: Record<string, Card[]>;
  isEqual: (cardCode: string, lastTurnedCard: string | null) => boolean;
  lastTurnedCard: string | null;
  handlePlayCard: (card: Card) => void;
  ready: boolean;
  toggleReady: () => void;
  sortedGroupedCards: Record<string, Card[]>;
  playingCard: boolean;
}

const Hand: React.FC<HandProps> = ({
  hand,
  isEqual,
  lastTurnedCard,
  handlePlayCard,
  ready,
  toggleReady,
  sortedGroupedCards,
  playingCard,
}) => {
  return (
    <section className="bd-player-hand-container">
      <div className="bd-player-hand">
        {Object.entries(sortedGroupedCards).map(([value, cards]) =>
          cards.map((card) => (
            <button
              key={card.code}
              className={`${
                !isEqual(card.code, lastTurnedCard) ? "masked" : ""
              }`}
              disabled={!isEqual(card.code, lastTurnedCard) || playingCard}
              onClick={() => handlePlayCard(card)}
            >
              <img src={card.image} alt={card.code} />
            </button>
          ))
        )}
      </div>
      <div className={`bd-player-options ${ready ? "ready" : "not-ready"}`}>
        <button onClick={toggleReady}>{ready ? "Ready" : "Ready?"}</button>
      </div>
    </section>
  );
};

export default Hand;
