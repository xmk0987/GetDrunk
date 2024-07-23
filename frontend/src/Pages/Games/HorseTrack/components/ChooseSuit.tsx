import React from "react";
import {
  SpadeIcon,
  HeartIcon,
  DiamondIcon,
  CrossIcon,
} from "../../../../utils/icons/CardSuitIcons";

import { HTSuitOption } from "../../../../utils/types/types";

const options: HTSuitOption[] = [
  {
    value: "spade",
    label: (
      <>
        <SpadeIcon /> Spade
      </>
    ),
  },
  {
    value: "heart",
    label: (
      <>
        <HeartIcon /> Heart
      </>
    ),
  },
  {
    value: "cross",
    label: (
      <>
        <CrossIcon /> Cross
      </>
    ),
  },
  {
    value: "diamond",
    label: (
      <>
        <DiamondIcon /> Diamond
      </>
    ),
  },
];

interface ChooseSuitProps {
  selectedOption: HTSuitOption | null;
  handleSelect: (option: HTSuitOption) => void;
}

const ChooseSuit: React.FC<ChooseSuitProps> = ({
  selectedOption,
  handleSelect,
}) => {
  return (
    <div className="ht-suit-dropdown">
      {options.map((option) => (
        <button
          key={option.value}
          className={`ht-dropdown-item ${
            selectedOption?.value === option.value ? "ht-selected-item" : ""
          }`}
          onClick={() => handleSelect(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ChooseSuit;
