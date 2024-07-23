import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  ChangeEvent,
  useCallback,
} from "react";
import { useGameSocket } from "../../../Hooks/useGameSocket";
import { games } from "../../../utils/games/games";
import Navbar from "../../../Components/Navbar/Navbar";
import GetIntoGame from "../../../Components/Games/GetIntoGame/GetIntoGame";
import GameLobby from "../../../Components/Games/Lobby/GameLobby";
import RulesPopup from "../../../Components/Rules/RulesPopup";
import { HorseTrackLogic } from "../../../gameLogics/horseTrackLogic";

import "./horsetrack.css";
import drink from "../../../utils/images/giveBeer.png";

import Lanes from "./components/Lanes";
import StartingBet from "./components/StartingBet";

import { HorseKey } from "../../../utils/types/types";
import Bets from "./components/Bets";
import shotgun from "../../../utils/sounds/shotgun.mp3";
import HTGameOver from "./components/HTGameOver";

type Option = {
  value: string;
  label: JSX.Element;
};

const HorseTrack: React.FC = () => {
  const GAME = games["horseRace"];
  const htLogic = useMemo(() => new HorseTrackLogic(), []);
  const {
    error,
    message,
    loading,
    player,
    gameLogic,
    roomInfo,
    resetAll,
    setError,
    setLoading,
    startGame,
    handlePlayerAction,
  } = useGameSocket(htLogic);

  const [bet, setBet] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showBets, setShowBets] = useState<boolean>(false);
  const [moving, setMoving] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const moveTimeout = useRef<NodeJS.Timeout | null>(null);
  const [gamePlaying, setGamePlaying] = useState<boolean>(false);

  const shotSound = useMemo(() => new Audio(shotgun), []);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
  };

  const handleChangeBet = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0));
    setBet(value);
  };

  const isGameOver = useCallback(() => gameLogic?.gameOver(), [gameLogic]);

  const horseKeys: HorseKey[] = ["spade", "heart", "cross", "diamond"];

  const moveHorse = useCallback(() => {
    if (!isGameOver() && !moving) {
      console.log("Start moving horse");
      setMoving(true);
      handlePlayerAction("MOVE_HORSE");
      moveTimeout.current = setTimeout(() => {
        setMoving(false);
        if (!isGameOver()) {
          moveHorse();
        }
      }, 3000);
    }
  }, [handlePlayerAction, isGameOver, moving]);

  const sendBet = () => {
    if (!bet || !selectedOption || bet <= 0) {
      setErrorMessage("Choose a suit and place a bet amount");
      setTimeout(() => setErrorMessage(""), 3000);
    } else {
      handlePlayerAction("SET_BET", {
        bet,
        suit: selectedOption.value,
        player,
      });
    }
  };

  const toggleBets = () => setShowBets(!showBets);

  const betsPlaced = useCallback(() => {
    const betsCount = Object.keys(gameLogic.bets).length;
    return betsCount > 0 && betsCount === gameLogic.players.length;
  }, [gameLogic]);

  const startRace = useCallback(() => {
    console.log("Race starting in 3 seconds...");
    setGamePlaying(true);
    let countdownValue = 3;
    setCountdown(countdownValue);
    countdownInterval.current = setInterval(() => {
      countdownValue -= 1;
      setCountdown(countdownValue);
      if (countdownValue <= 0) {
        clearInterval(countdownInterval.current!);
        shotSound
          .play()
          .then(() => {
            moveHorse();
            setGamePlaying(false);
          })
          .catch(console.error);
      }
    }, 1000);
  }, [moveHorse, shotSound]);

  useEffect(() => {
    return () => {
      clearInterval(countdownInterval.current!);
      clearTimeout(moveTimeout.current!); // Clear the move timeout on unmount
    };
  }, []);

  const isBetSet = () =>
    player && gameLogic.bets.hasOwnProperty(player.username);

  const handleResetGame = () => {
    clearInterval(countdownInterval.current!);
    clearTimeout(moveTimeout.current!); // Clear the move timeout on reset
    resetAll();
    setBet(0);
    setErrorMessage("");
    setMoving(false);
    setShowBets(false);
    setSelectedOption(null);
    setCountdown(0);
    setGamePlaying(false);
  };

  return (
    <>
      <Navbar text={GAME.name} resetGame={handleResetGame} />
      <main className="ht-container">
        {roomInfo?.game.status === "lobby" ? (
          <GameLobby
            roomId={roomInfo.roomId}
            roomData={roomInfo}
            player={player}
            gameData={GAME}
            onStartGame={startGame}
          />
        ) : gameLogic &&
          (gameLogic.status === "playing" ||
            gameLogic.status === "game-over" ||
            gameLogic.status === "bets") ? (
          <>
            {!isBetSet() && gameLogic.status === "bets" ? (
              <StartingBet
                bet={bet}
                handleChangeBet={handleChangeBet}
                selectedOption={selectedOption}
                handleSelect={handleSelect}
                sendBet={sendBet}
                errorMessage={errorMessage}
              />
            ) : null}
            {showBets && betsPlaced() && (
              <Bets bets={gameLogic.bets} toggleBets={toggleBets} />
            )}
            {betsPlaced() && (
              <button
                className="ht-toggle-bets default-btn-style"
                onClick={toggleBets}
              >
                <img src={drink} alt="Beer canister" />
              </button>
            )}
            <div className="ht-race-track">
              {horseKeys.map((key) => (
                <Lanes key={key} horse={htLogic.horses[key]} />
              ))}
            </div>
            {roomInfo?.admin === player?.username &&
              betsPlaced() &&
              gameLogic.status === "bets" &&
              !gamePlaying && (
                <button
                  className="ht-start-race-btn pinkBlackHover"
                  onClick={startRace}
                >
                  Start race
                </button>
              )}
            {countdown > 0 && (
              <div className="ht-countdown-timer">
                <h2>{countdown}</h2>
              </div>
            )}
            {isGameOver() && (
              <HTGameOver
                bets={gameLogic.bets}
                winningSuit={gameLogic.winningSuit}
                handleResetGame={handleResetGame}
              />
            )}
          </>
        ) : (
          <GetIntoGame
            setError={setError}
            setLoading={setLoading}
            game_name={GAME.route}
          />
        )}
        <RulesPopup header={GAME.name} rules={GAME.rules} />
      </main>
    </>
  );
};

export default HorseTrack;
