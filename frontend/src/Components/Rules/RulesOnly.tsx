import React from "react";
import "./rules.css";

const RulesOnly = ({ rules }: { rules: string[] }) => {
  return (
    <ol className="rules-list">
      {rules && rules.map((rule, index) => <li key={index}>{rule}</li>)}
    </ol>
  );
};

export default RulesOnly;
