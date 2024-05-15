import React, { useState } from "react";
import { Game } from "../../../utils/games/games.ts";
import { IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";

import RulesOnly from "../../../Components/Rules/RulesOnly.tsx";
import "./gamecard.css";

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const [showRules, setShowRules] = useState<boolean>(false);

  const toggleRules = (): void => {
    setShowRules(!showRules);
  };

  return (
    <div className="game-card relative">
      <p className="game-card-header">{game.name}</p>
      <div
        className="game-card-main"
        style={{ overflow: showRules ? "scroll" : "hidden" }}
      >
        {showRules ? (
          <RulesOnly rules={game.rules} />
        ) : (
          <>
            <img src={game.image} alt={game.name.toLowerCase()} />
            <p className="game-card-info">{game.desc}</p>
          </>
        )}
      </div>
      <button className="game-card-button" onClick={toggleRules}></button>
      <div className="game-card-rules-container">
        <div className="game-card-players">
          <p>
            {game.minPlayers} -{" "}
            {game.maxPlayers === Infinity ? "∞" : game.maxPlayers}
          </p>
          <IonIcon icon={personCircleOutline} />
        </div>
        <button className="game-card-rule-button" onClick={toggleRules}>
          {showRules ? "CLOSE RULES" : "RULES"}
        </button>
      </div>
    </div>
  );
};

export default GameCard;
