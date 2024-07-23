import React from "react";

interface GatesProps {}

// Renders the wrong guesses amount for the current dealer
const Gates: React.FC<GatesProps> = () => {
  return (
    <div className="ht-gates">
      <p>START</p>
      <p>1</p>
      <p>2</p>
      <p>3</p>
      <p>4</p>
      <p>GOAL</p>
    </div>
  );
};

export default Gates;
