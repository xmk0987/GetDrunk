import React, { useState } from "react";
import "./spinthebottle.css";

// Assuming the path and imports are correct and the images are module declared.
import bottle from "../../../utils/images/games/gambina.png";

// Type definitions for games should ideally be defined where the games object is declared.
// Assuming it's correctly imported with its types.
import { games } from "../../../utils/games/games.ts";

import RulesPopup from "../../../Components/Rules/RulesPopup.tsx";
import Navbar from "../../../Components/Navbar/Navbar.tsx";

const SpinTheBottle: React.FC = () => {
  const GAME = games["spinTheBottle"];

  const [rotation, setRotation] = useState<number>(0);

  const spinTheBottle = (): void => {
    // Generate a random rotation between 0 and 3600 degrees (for multiple spins)
    const newRotation = Math.floor(Math.random() * 3600) + rotation;
    setRotation(newRotation);
  };

  return (
    <>
      <Navbar text="SPIN THE BOTTLE" />
      <main className="spinthebottle-main">
        <img
          src={bottle}
          alt="bottle"
          className="bottle"
          style={{ transform: `rotate(${rotation}deg)` }}
          onClick={spinTheBottle}
        />
        <RulesPopup header={GAME.name} rules={GAME.rules} />
        <button onClick={spinTheBottle} className="spin-button">
          Spin
        </button>
      </main>
    </>
  );
};

export default SpinTheBottle;
