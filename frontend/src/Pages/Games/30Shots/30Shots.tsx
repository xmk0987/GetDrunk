import { useState, useEffect, useMemo, useCallback } from "react";
import { games } from "../../../utils/games/games";

import "./thirtyshots.css";
import Navbar from "../../../Components/Navbar/Navbar";
import RulesPopup from "../../../Components/Rules/RulesPopup";
import JSConfetti from "js-confetti";

import shotgun from "../../../utils/sounds/shotgun.mp3";

const ThirtyShots: React.FC = () => {
  const GAME = games["thirtyShots"];
  const [time, setTime] = useState(30 * 60); // 30 minutes in seconds
  const [timerOn, setTimerOn] = useState<boolean>(false);
  const [shotTime, setShotTime] = useState<boolean>(false);

  const jsConfetti = useMemo(() => new JSConfetti(), []);

  const shotSound = useMemo(() => new Audio(shotgun), []);

  const fireConfetti = useCallback(() => {
    jsConfetti.addConfetti();
  }, [jsConfetti]);

  useEffect(() => {
    if (time > 0 && timerOn) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId); // Cleanup the interval on component unmount
    }
  }, [time, timerOn]);

  const toggleTimer = () => {
    setTimerOn(!timerOn);
  };

  useEffect(() => {
    if (time % 60 === 0 && time !== 60 * 30) {
      setShotTime(true);
      shotSound.play();
      fireConfetti();
    }
  }, [fireConfetti, jsConfetti, shotSound, time]);

  useEffect(() => {
    if (shotTime) {
      setTimeout(() => {
        setShotTime(false);
      }, 3000);
    }
  }, [shotTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const resetAll = () => {
    setTime(60 * 30);
    setTimerOn(false);
    setShotTime(false);
  };

  return (
    <>
      <Navbar text="30 Shots" />
      <main className="thirtyshots-container">
        {shotTime ? <p className="thirtyshots-shot">SHOT</p> : null}
        <p className="thirtyshots-timer">{formatTime(time)}</p>
        <button
          className={`${
            !timerOn || time === 0
              ? "thirtyshots-timer-button"
              : "thirtyshots-timer-button-pause"
          } pinkBlackHover`}
          onClick={time === 0 ? resetAll : toggleTimer}
        >
          {time === 0 ? "NEW ROUND?" : timerOn ? "PAUSE" : "START"}
        </button>
        <RulesPopup header={GAME.name} rules={GAME.rules} />
      </main>
    </>
  );
};

export default ThirtyShots;
