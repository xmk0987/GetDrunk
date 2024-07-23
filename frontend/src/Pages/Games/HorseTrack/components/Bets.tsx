import React from "react";

import drink from "../../../../utils/images/giveBeer.png";
import {
  SpadeIcon,
  HeartIcon,
  CrossIcon,
  DiamondIcon,
} from "../../../../utils/icons/CardSuitIcons";
import CloseIcon from "../../../../utils/icons/CloseIcon";

import { HorseKey, HTBet } from "../../../../utils/types/types";

const suitIcons: { [key in HorseKey]: JSX.Element } = {
  spade: <SpadeIcon />,
  heart: <HeartIcon />,
  cross: <CrossIcon />,
  diamond: <DiamondIcon />,
};

interface BetsProps {
  bets: { [playerName: string]: HTBet };
  toggleBets: () => void;
}
// Renders the wrong guesses amount for the current dealer
const Bets: React.FC<BetsProps> = ({ bets, toggleBets }) => {
  return (
    <div className="ht-bets-container">
      <h2>BETS</h2>
      <div className="ht-all-bets">
        {bets
          ? Object.keys(bets).map((name) => (
              <div className="ht-bet" key={name}>
                <div className="ht-bet-name-suit">
                  <p>{suitIcons[bets[name].suit as HorseKey]}</p>
                  <p className="ht-bet-name">{name} </p>
                </div>
                <div className="ht-bet-amount">
                  <p>{bets[name].bet}x </p>
                  <img src={drink} alt="Beer mug" />
                </div>
              </div>
            ))
          : null}
      </div>
      <button className="ht-bet-close opacHover" onClick={toggleBets}>
        <CloseIcon size={20} />
      </button>
    </div>
  );
};

export default Bets;
