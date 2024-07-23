import React from "react";
import { HTBet, HorseKey } from "../../../../utils/types/types";
import {
  SpadeIcon,
  HeartIcon,
  CrossIcon,
  DiamondIcon,
} from "../../../../utils/icons/CardSuitIcons";
import drink from "../../../../utils/images/giveBeer.png";

interface HTGameOverProps {
  bets: { [playerName: string]: HTBet };
  winningSuit: string;
  handleResetGame: () => void;
}

const suitIcons: { [key in HorseKey]: JSX.Element } = {
  spade: <SpadeIcon />,
  heart: <HeartIcon />,
  cross: <CrossIcon />,
  diamond: <DiamondIcon />,
};

const HTGameOver: React.FC<HTGameOverProps> = ({
  bets,
  winningSuit,
  handleResetGame,
}) => {
  return (
    <div className="ht-game-over-container">
      <h2>GAME OVER</h2>
      <div className="ht-game-over-bets">
        {bets &&
        Object.keys(bets).filter((name) => bets[name].suit === winningSuit)
          .length > 0 ? (
          <>
            <p>Winners: {suitIcons[winningSuit as HorseKey]}</p>
            {Object.keys(bets)
              .filter((name) => bets[name].suit === winningSuit)
              .map((name) => (
                <div className="ht-bet" key={name}>
                  <div className="ht-bet-name-suit">
                    <p className="ht-bet-name">{name}</p>
                  </div>
                  <div className="ht-bet-amount">
                    <p>{bets[name].bet}x </p>
                    <img src={drink} alt="Beer mug" />
                  </div>
                </div>
              ))}
          </>
        ) : (
          <p>No winners</p>
        )}
      </div>
      <button onClick={handleResetGame} className="pinkBlackHover">
        RETURN TO LOBBY
      </button>
    </div>
  );
};

export default HTGameOver;
