import React from "react";
import "./rules.css";

const RulesOnly = ({ rules }: { rules: string[] }) => {
  return (
    <ul className="rules-list">
      {rules && rules.map((rule, index) => <li key={index}>{rule}</li>)}
    </ul>
  );
};

export default RulesOnly;
