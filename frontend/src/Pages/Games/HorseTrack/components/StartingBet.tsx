import ChooseSuit from "./ChooseSuit";
import { HTSuitOption } from "../../../../utils/types/types";
import { ChangeEvent } from "react";

interface StartingBetProps {
  bet: number;
  handleChangeBet: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedOption: HTSuitOption | null;
  handleSelect: (option: HTSuitOption) => void;
  sendBet: () => void;
  errorMessage: string;
}

const StartingBet: React.FC<StartingBetProps> = ({
  bet,
  handleChangeBet,
  selectedOption,
  handleSelect,
  sendBet,
  errorMessage,
}) => {
  return (
    <div className="ht-starting-bet">
      <h2>STARTING BET</h2>
      {errorMessage ? <p className="red">{errorMessage}</p> : null}
      <ChooseSuit selectedOption={selectedOption} handleSelect={handleSelect} />
      <div className="ht-starting-bet-options">
        <p>Drink amount:</p>
        <input
          value={bet}
          min={0}
          max={100}
          type="number"
          onChange={handleChangeBet}
        />
      </div>
      <div className="ht-starting-bet-options-2">
        <p>Buy in drink amount:</p>
        <p>{bet ? Math.round(bet / 3) : 0}</p>
      </div>
      <button
        className="pinkBlackHover ht-starting-bet-button"
        onClick={sendBet}
      >
        SEND BET
      </button>
    </div>
  );
};

export default StartingBet;
