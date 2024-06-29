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

const FuckTheDealer: React.FC = () => {
  // Get the game logic for "Fuck the Dealer"
  const GAME = games["fuckTheDealer"];

  // Create an instance of the game logic using useMemo to memoize it
  const ftdLogic = useMemo(() => new FuckTheDealerLogic(), []);

  // Hook to manage socket events and state
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

  // State to track the guessed card and whether the guess is bigger or smaller
  const [guessedCard, setGuessedCard] = useState<number | null>(null);
  const [bigger, setBigger] = useState<boolean>(false);
  const [smaller, setSmaller] = useState<boolean>(false);

  /**
   * Handles the click event for guessing a card.
   * @param value - The value of the guessed card.
   */
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

  /**
   * Handles wrong guesses and sets state accordingly.
   * @param value - The value of the guessed card.
   * @param sizeComparison - The comparison result ("smaller" or "bigger").
   */
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

  /**
   * Resets the guess state.
   */
  const resetGuessState = () => {
    setBigger(false);
    setSmaller(false);
  };

  /**
   * Checks if the card should be masked based on the current guess state.
   * @param value - The value of the card.
   * @returns True if the card should be masked, otherwise false.
   */
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

  // Sort and group the cards using useMemo to memoize the result
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

  // Render loading state
  if (loading) {
    return (
      <>
        <Navbar text="F*CK THE DEALER" header={true} />
        <main className="center-container">
          <div className="game-over">Loading ...</div>
        </main>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <Navbar text="F*CK THE DEALER" header={true} />
        <main className="center-container">
          <div className="game-over">{error}</div>
          <button className="default-btn-style" onClick={resetAll}>
            PLAY AGAIN
          </button>
        </main>
      </>
    );
  }

  // Render game over state
  if (
    gameLogic &&
    gameLogic.deck &&
    gameLogic.deck.remaining === 0 &&
    gameLogic.deck.cards.length === 0
  ) {
    return (
      <>
        <Navbar text="F*CK THE DEALER" header={true} />
        <main className="center-container">
          <div className="game-over">GAME OVER</div>
          <button className="default-btn-style" onClick={resetAll}>
            PLAY AGAIN
          </button>
        </main>
      </>
    );
  }

  // Render game components
  return (
    <>
      <Navbar text="F*CK THE DEALER" header={true} />
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
            <p className="game-message">{message}</p>
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
              gameLogic.dealer.socketId === player?.socketId ? (
                <section className="ftd-dealer-card-container">
                  {gameLogic.deck?.cards?.length === 1 && (
                    <button className="ftd-dealer-card">
                      <img
                        src={gameLogic.deck.cards[0].image}
                        alt="Card to guess"
                      />
                    </button>
                  )}
                </section>
              ) : null}
              {gameLogic.guesser &&
              gameLogic.guesser.socketId === player?.socketId ? (
                <GuesserOptions
                  playedCards={sortedGroupedCards}
                  handleCardClick={handleCardClick}
                  isMasked={isMasked}
                />
              ) : null}
            </div>
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

export default FuckTheDealer;
