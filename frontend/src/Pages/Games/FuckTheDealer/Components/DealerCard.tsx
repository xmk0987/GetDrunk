import React from "react";

interface DealerCardProps {
  gameLogic: any;
}

// Renders the wrong guesses amount for the current dealer
const DealerCard: React.FC<DealerCardProps> = ({ gameLogic }) => {
  return (
    <section
      data-testid="dealer-container"
      className="ftd-dealer-card-container"
    >
      <p>Turned card:</p>
      <div className="ftd-dealer-card">
        {gameLogic.deck?.cards?.length === 1 && (
          <img src={gameLogic.deck.cards[0].image} alt="Card to guess" />
        )}
      </div>
    </section>
  );
};

export default DealerCard;
