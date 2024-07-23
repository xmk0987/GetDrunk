import React from "react";
import { HorseProps } from "../../../../utils/types/types";

interface SingleHorseProps {
  horse: HorseProps;
}
// Renders the wrong guesses amount for the current dealer
const Horse: React.FC<SingleHorseProps> = ({ horse }) => {
  return (
    <>
      <div id={`${horse.suit}-horse`} className="ht-horse">
        <img src={horse.img} alt={`${horse.suit}-horse`} />
        {horse.frozen ? (
          <div className="frosted-overlay">
            <p>Frozen</p>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Horse;
