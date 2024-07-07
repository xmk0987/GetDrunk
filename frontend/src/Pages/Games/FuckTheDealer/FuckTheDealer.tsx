import React, { useState, useCallback, useMemo } from "react";
import { useGameSocket } from "../../../Hooks/useGameSocket";
import { games } from "../../../utils/games/games";
import { FuckTheDealerLogic } from "../../../utils/gameLogics/fuckTheDealerLogic";
import { Card } from "../../../utils/types/types";
import Navbar from "../../../Components/Navbar/Navbar";
import GetIntoGame from "../../../Components/Games/GetIntoGame/GetIntoGame";
import GameLobby from "../../../Components/Games/Lobby/GameLobby";
import PlayerList from "./Components/PlayerList";
import PlayedCards from "./Components/PlayedCards";
import GuesserOptions from "./Components/GuesserOptions";
import TurnCounter from "./Components/TurnCounter";
import RulesPopup from "../../../Components/Rules/RulesPopup";
import {
  mapCardValueToNumber,
  groupCardsByValue,
} from "../../../utils/helperFunctions";
import "./fuckthedealer.css";
import GameMessage from "../../../Components/Games/Message/GameMessage";
import GameOver from "../../../Components/Games/GameOver/GameOver";
import DealerCard from "./Components/DealerCard";

const FuckTheDealer: React.FC = () => {
  const GAME = games["fuckTheDealer"];
  const ftdLogic = useMemo(() => new FuckTheDealerLogic(), []);
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
  } = useGameSocket(ftdLogic);

  const [guessedCard, setGuessedCard] = useState<number | null>(null);
  const [bigger, setBigger] = useState<boolean>(false);
  const [smaller, setSmaller] = useState<boolean>(false);

  const handleCardClick = (value: number) => {
    setGuessedCard(value);
    const cardToGuessValue = mapCardValueToNumber(
      gameLogic.deck!.cards[0].value
    );
    const isGuessCorrect = cardToGuessValue === value;

    if (gameLogic.guessNumber === 2 && !isGuessCorrect) {
      handleWrongGuess(value);
    } else if (cardToGuessValue < value) {
      handleWrongGuess(value, "smaller");
    } else if (cardToGuessValue > value) {
      handleWrongGuess(value, "bigger");
    } else {
      handlePlayerAction("GUESS_CORRECT");
      resetGuessState();
    }
  };

  const handleWrongGuess = (value: number, sizeComparison: string = "") => {
    const isLastGuess =
      gameLogic.deck?.remaining <= 20 || sizeComparison === "";
    const action = isLastGuess
      ? "GUESS_WRONG"
      : `GUESS_${sizeComparison.toUpperCase()}`;
    handlePlayerAction(action, { value });
    if (isLastGuess) {
      sizeComparison = "";
    }
    setBigger(sizeComparison === "bigger");
    setSmaller(sizeComparison === "smaller");
  };

  const resetGuessState = () => {
    setBigger(false);
    setSmaller(false);
  };

  const isMasked = (value: number): boolean => {
    if (guessedCard !== null) {
      return bigger
        ? value <= guessedCard
        : smaller
        ? value >= guessedCard
        : false;
    }
    return false;
  };

  const sortedGroupedCards = useMemo(() => {
    const groupedCards = gameLogic
      ? groupCardsByValue(gameLogic.playedCards)
      : {};
    return Object.keys(groupedCards)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .reduce((acc, key) => {
        acc[key] = groupedCards[key];
        return acc;
      }, {} as Record<string, Card[]>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameLogic, groupCardsByValue, gameLogic.playedCards.length]);

  const isGameOver = useCallback(() => {
    if (!gameLogic || !gameLogic.deck) {
      return false;
    }

    const { deck } = gameLogic;
    return deck.remaining === 0 && deck.cards.length === 0;
  }, [gameLogic]);

  return (
    <>
      <Navbar text="F*CK THE DEALER" resetGame={resetAll} />
      <main className="ftd-container">
        {roomInfo?.game.status === "lobby" ? (
          <GameLobby
            roomId={roomInfo.roomId}
            roomData={roomInfo}
            player={player}
            gameData={GAME}
            onStartGame={startGame}
          />
        ) : gameLogic && gameLogic.status === "playing" ? (
          <>
            <GameMessage message={message} />
            <div className="ftd-board">
              <PlayerList
                players={gameLogic.players}
                dealer={gameLogic.dealer}
                guesser={gameLogic.guesser}
                currentPlayer={player}
              />
              <TurnCounter dealerTurn={gameLogic.dealerTurn} />
              <PlayedCards groupedCards={sortedGroupedCards} />
              {gameLogic.dealer &&
              gameLogic.dealer.socketId === player?.socketId &&
              !isGameOver() ? (
                <DealerCard gameLogic={gameLogic} />
              ) : gameLogic.guesser &&
                gameLogic.guesser.socketId === player?.socketId &&
                !isGameOver() ? (
                <GuesserOptions
                  playedCards={sortedGroupedCards}
                  handleCardClick={handleCardClick}
                  isMasked={isMasked}
                />
              ) : null}
            </div>
          </>
        ) : (
          <>
            <GetIntoGame
              setError={setError}
              setLoading={setLoading}
              game_name={GAME.route}
            />
          </>
        )}
        {isGameOver() && <GameOver resetAll={resetAll} />}
        <RulesPopup header={GAME.name} rules={GAME.rules} />
      </main>
    </>
  );
};

export default FuckTheDealer;
