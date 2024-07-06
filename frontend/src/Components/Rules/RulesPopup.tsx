import React, { useState } from "react"; // Ensure React is in scope since JSX is used
import RulesOnly from "./RulesOnly";
import ToggleRulesButton from "./RulesButton";
import "./rules.css";

interface RulesPopupProps {
  header: string; // Use lowercase string type for primitives
  rules: string[]; // Use shorthand for array types
}

const RulesPopup: React.FC<RulesPopupProps> = ({ header, rules }) => {
  const [showRules, setRules] = useState<boolean>(false);

  const toggleRules = (): void => {
    setRules(!showRules);
  };

  return (
    <>
      {showRules ? (
        <div className="rules-popup-container">
          <h2>{header}</h2>
          <RulesOnly rules={rules} />
          <button onClick={toggleRules}>CLOSE</button>
        </div>
      ) : null}
      <ToggleRulesButton toggleRules={toggleRules} />
    </>
  );
};

export default RulesPopup;
