import React from "react";
import "./gameover.css";

interface GameOverProps {
  resetAll: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ resetAll }) => {
  return (
    <div className="game-over">
      <h2>GAME OVER</h2>
      <button onClick={resetAll}>RETURN TO LOBBY</button>
    </div>
  );
};

export default GameOver;
