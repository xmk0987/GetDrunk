import React, { useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import GetIntoGame from "../../../Components/Games/GetIntoGame/GetIntoGame";
import GameLobby from "../../../Components/Games/Lobby/GameLobby";
import { useGameSocket } from "../../../Hooks/useGameSocket";
import { games } from "../../../utils/games/games";
import { FuckTheDealerLogic } from "../../../utils/gameLogics/fuckTheDealerLogic";
import "./fuckthedealer.css";
import { cardsBySuit } from "../../../utils/images/cards/cards";
import { Card } from "../../../utils/types/types";

const FuckTheDealer: React.FC = () => {
  const GAME = games["fuckTheDealer"];
  const ftdLogic = new FuckTheDealerLogic();

  const {
    error,
    message,
    loading,
    player,
    gameLogic,
    roomInfo,
    setError,
    setLoading,
    startGame,
    handlePlayerAction,
  } = useGameSocket(ftdLogic);

  const [guessedCard, setGuessedCard] = useState<number | null>(null);
  const [cardToGuessValue, setCardToGuessValue] = useState<number | null>(null);
  const [bigger, setBigger] = useState<boolean>(false);
  const [smaller, setSmaller] = useState<boolean>(false);

  useEffect(() => {
    if (gameLogic && gameLogic.deck?.cards?.length > 0) {
      const firstCardValue = mapCardValueToNumber(
        gameLogic.deck.cards[0].value
      );
      if (!isNaN(firstCardValue)) {
        setCardToGuessValue(firstCardValue);
      }
    }
  }, [gameLogic]);

  const mapCardValueToNumber = (value: string): number => {
    if (value === "ACE") return 1;
    if (value === "JACK") return 11;
    if (value === "QUEEN") return 12;
    if (value === "KING") return 13;
    return parseInt(value, 10);
  };

  const handleCardClick = (index: number) => {
    console.log("Card clicked");
    setGuessedCard(index);
    console.log(gameLogic);
    const cardToGuessValue = mapCardValueToNumber(
      gameLogic.deck!.cards[0].value
    );
    console.log(cardToGuessValue);
    if (cardToGuessValue === index) {
      console.log("card to guess is correct");
      setBigger(false);
      setSmaller(false);
      handlePlayerAction("GUESS_CORRECT");
    } else if (cardToGuessValue < index) {
      console.log("card to guess is smaller");
      setBigger(false);
      setSmaller(true);
      handlePlayerAction("GUESS_SMALLER");
    } else if (cardToGuessValue > index) {
      console.log("card to guess is bigger");
      setBigger(true);
      setSmaller(false);
      handlePlayerAction("GUESS_BIGGER");
    }
  };

  const isMasked = (index: number): boolean => {
    if (guessedCard !== null) {
      if (bigger) {
        return index <= guessedCard;
      } else if (smaller) {
        return index >= guessedCard;
      }
    }
    return false;
  };

  const groupCardsByValue = (cards: Card[]): Record<string, Card[]> => {
    return cards.reduce((acc, card) => {
      const cardValue = mapCardValueToNumber(card.value);
      if (!acc[cardValue]) {
        acc[cardValue] = [];
      }
      acc[cardValue].push(card);
      return acc;
    }, {} as Record<string, Card[]>);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sortedGroupedCards = Object.keys(
    groupCardsByValue(gameLogic?.playedCards || [])
  )
    .sort((a, b) => mapCardValueToNumber(a) - mapCardValueToNumber(b))
    .reduce((acc, key) => {
      acc[key] = groupCardsByValue(gameLogic?.playedCards || [])[key];
      return acc;
    }, {} as Record<string, Card[]>);

  console.log(sortedGroupedCards);
  return (
    <>
      <Navbar text="F*CK THE DEALER" />
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
            <p className="ftd-message">{message}</p>
            <div className="ftd-board">
              <section className="ftd-players">
                {gameLogic.players.map((mPlayer) => (
                  <div className="ftd-player" key={mPlayer.socketId}>
                    <p
                      className={`ftd-player-name ${
                        mPlayer.socketId === player.socketId ? "you" : ""
                      }`}
                    >
                      {mPlayer.username}
                    </p>
                    {gameLogic.dealer.socketId === mPlayer.socketId ? (
                      <p className={`ftd-player-turn dealer`}>Dealer</p>
                    ) : null}
                    {gameLogic.guesser.socketId === mPlayer.socketId ? (
                      <p className={`ftd-player-turn guesser`}>Guesser</p>
                    ) : null}
                  </div>
                ))}
              </section>
              <section className="ftd-turn-counter">
                <p>
                  Wrong guesses: <span>0/3</span>
                </p>
              </section>
              <section className="ftd-played-cards-container">
                <p>Played cards:</p>
                <div className="ftd-played-cards">
                  {Object.keys(sortedGroupedCards).map((value) => (
                    <div className="ftd-card-stack" key={value}>
                      {sortedGroupedCards[value].map(
                        (card: Card, index: number) => (
                          <div
                            className="ftd-card"
                            key={card.code}
                            style={{ top: `${index * 25}px` }}
                          >
                            <img
                              src={card.image}
                              alt={`card-${card.code}`}
                            ></img>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </section>
              {gameLogic.dealer.socketId === player?.socketId ? (
                <section className="ftd-dealer-card-container">
                  {gameLogic.deck?.cards?.length === 1 ? (
                    <button className="ftd-dealer-card">
                      <img
                        src={gameLogic.deck.cards[0].image}
                        alt="Card to guess"
                      ></img>
                    </button>
                  ) : null}
                </section>
              ) : null}
              {gameLogic.guesser.socketId === player?.socketId ? (
                <section className="ftd-guesser-card-container">
                  <p>Guess card number:</p>
                  <div className="ftd-guesser-options">
                    {cardsBySuit.H.map((card, index) => (
                      <button
                        key={index}
                        onClick={() => handleCardClick(index + 1)}
                        className={`${isMasked(index + 1) ? "masked" : ""}`}
                        disabled={isMasked(index + 1)}
                      >
                        <img src={card} alt="card"></img>
                      </button>
                    ))}
                  </div>
                </section>
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
      </main>
    </>
  );
};

export default FuckTheDealer;
