import React from "react";
import "./gamemessage.css";

interface GameMessageProps {
  message: string;
}

// Renders the wrong guesses amount for the current dealer
const GameMessage: React.FC<GameMessageProps> = ({ message }) => {
  return (
    <section className="game-message">
      <p>{message}</p>
    </section>
  );
};

export default GameMessage;
