import React from "react";
import CloseIcon from "../../../../utils/icons/CloseIcon";

interface SharedDrinksProps {
  giveBeer: string;
  drinkHistory: { giver: string; recipient: string; amount: number }[];
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void; // Function to handle close button
  player: string | undefined;
}

const SharedDrinks: React.FC<SharedDrinksProps> = ({
  giveBeer,
  drinkHistory,
  onClose,
  player,
}) => {
  return (
    <div className="bd-shared-drinks-popup">
      <button className="opacHover" onClick={onClose}>
        <CloseIcon size={25} />
      </button>
      <h2>SHARED DRINKS</h2>
      <div className="bd-shared-drinks">
        {drinkHistory.map((entry, index) => (
          <div key={index} className="bd-shared-drink">
            <p className={`${entry.giver === player ? "red" : ""}`}>
              {entry.giver}
            </p>
            <div className="bd-shared-drink-amount">
              <p>{entry.amount}x</p>
              <img src={giveBeer} alt="give beer" />
            </div>
            <p className={`${entry.recipient === player ? "red" : ""}`}>
              {entry.recipient}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedDrinks;
