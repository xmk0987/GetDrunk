import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

import Horse from "./Horse";
import { HorseProps } from "../../../../utils/types/types";

interface LanesProps {
  horse: HorseProps;
}

const Lanes: React.FC<LanesProps> = ({ horse }) => {
  const { position, suit } = horse;
  const horseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (position !== 0) {
      const horseElement = horseRef.current;
      if (!horseElement) return;

      const currentRect = horseElement.getBoundingClientRect();
      const targetGate = document.querySelector(
        `.ht-gate-${position}-${suit}`
      ) as HTMLElement;

      if (!targetGate) return;

      // Append the horse to the target gate
      targetGate.appendChild(horseElement);

      const targetRect = targetGate.getBoundingClientRect();

      gsap.set(horseElement, { x: 0, y: 0 });
      gsap.fromTo(
        horseElement,
        {
          x: currentRect.left - targetRect.left,
          y: currentRect.top - targetRect.top,
        },
        {
          x: 0,
          y: 0,
          duration: 2, // Set the duration to slow down the animation
          ease: "power3.out",
        }
      );
    }
  }, [position, suit]);

  return (
    <div className="ht-race-lane">
      <div key={0} className={`ht-gate ht-gate-${0}-${suit}`}>
        <div ref={horseRef}>
          <Horse horse={horse} />
        </div>
      </div>
      <div key={1} className={`ht-gate ht-gate-${1}-${suit}`}></div>
      <div key={2} className={`ht-gate ht-gate-${2}-${suit}`}></div>
      <div key={3} className={`ht-gate ht-gate-${3}-${suit}`}></div>
      <div key={4} className={`ht-gate ht-gate-${4}-${suit}`}></div>
      <div key={5} className={`ht-gate ht-gate-${5}-${suit}`}></div>
    </div>
  );
};

export default Lanes;
