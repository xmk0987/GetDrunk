import React from "react";
import "./rules.css";

// Define a specific type for the props
type ToggleRulesButtonProps = {
  toggleRules: () => void; // This specifies that toggleRules is a function that takes no arguments and does not return anything
};

const ToggleRulesButton: React.FC<ToggleRulesButtonProps> = ({
  toggleRules,
}) => (
  <button className="toggle-rules-button" onClick={toggleRules}>
    Rules
  </button>
);

export default ToggleRulesButton;
