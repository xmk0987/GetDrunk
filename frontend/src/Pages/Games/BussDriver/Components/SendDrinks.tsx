import React from "react";
import { Player } from "../../../../utils/types/types";
import CloseIcon from "../../../../utils/icons/CloseIcon";

interface SendDrinksProps {
  drinkAmount: number;
  giveBeer: string;
  errorMessage: string;
  players: Player[];
  drinkDistribution: any;
  handleDrinkInputChange: (username: string, value: number) => void;
  handleSendDrinks: () => void;
  cancelPlayCard: () => void;
  username: string | undefined;
}

const SendDrinks: React.FC<SendDrinksProps> = ({
  drinkAmount,
  giveBeer,
  errorMessage,
  players,
  drinkDistribution,
  handleDrinkInputChange,
  handleSendDrinks,
  cancelPlayCard,
  username,
}) => {
  // Sort players so that the player with the given username is first
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.username === username) return 1;
    if (b.username === username) return -1;
    return 0;
  });

  return (
    <div className="bd-send-drinks-popup">
      <button className="bd-close-button opacHover" onClick={cancelPlayCard}>
        <CloseIcon size={25} />
      </button>
      <div className="bd-send-drinks-amount">
        <h2>{`SEND ${drinkAmount}x`}</h2>
        <img src={giveBeer} alt="Give Beer" />
      </div>
      {errorMessage !== "" ? <p className="error">{errorMessage}</p> : null}
      <div className="bd-send-drinks">
        {sortedPlayers.map((p: any) => (
          <div key={p.username} className="bd-send-drinks-player">
            <p className={`${p.username === username ? "red" : ""}`}>
              {p.username}
            </p>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={drinkDistribution[p.username] || ""}
              onChange={(e) =>
                handleDrinkInputChange(
                  p.username,
                  parseInt(e.target.value) || 0
                )
              }
            />
          </div>
        ))}
      </div>
      <button
        className="pinkBlackHover bd-send-drinks-button"
        onClick={handleSendDrinks}
      >
        SEND
      </button>
    </div>
  );
};

export default SendDrinks;
