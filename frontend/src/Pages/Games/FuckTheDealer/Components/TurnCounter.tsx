import React from "react";

interface TurnCounterProps {
  dealerTurn: number;
}

// Renders the wrong guesses amount for the current dealer
const TurnCounter: React.FC<TurnCounterProps> = ({ dealerTurn }) => {
  return (
    <section className="ftd-turn-counter">
      <p>
        Wrong guesses: <span>{dealerTurn - 1}/3</span>
      </p>
    </section>
  );
};

export default TurnCounter;
