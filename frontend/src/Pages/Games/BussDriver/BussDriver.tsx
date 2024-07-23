import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useGameSocket } from "../../../Hooks/useGameSocket";
import { games } from "../../../utils/games/games";
import { BussDriverLogic } from "../../../gameLogics/bussDriverLogic";
import { Card } from "../../../utils/types/types";
import Navbar from "../../../Components/Navbar/Navbar";
import GetIntoGame from "../../../Components/Games/GetIntoGame/GetIntoGame";
import GameLobby from "../../../Components/Games/Lobby/GameLobby";
import Players from "./Components/Players";
import "./bussdriver.css";
import Pyramid from "./Components/Pyramid";
import RulesPopup from "../../../Components/Rules/RulesPopup";
import { getPileCards } from "../../../services/deckApi/deckApi";
import { groupCardsByValue, isEqual } from "../../../utils/helperFunctions";
import giveBeer from "../../../utils/images/giveBeer.png";
import Hand from "./Components/Hand";
import SharedDrinks from "./Components/SharedDrinks";
import SendDrinks from "./Components/SendDrinks";
import BonusPyramid from "./Components/BonusPyramid";
import GameOver from "../../../Components/Games/GameOver/GameOver";

const BussDriver: React.FC = () => {
  const GAME = games["bussDriver"];
  const bdLogic = useMemo(() => new BussDriverLogic(), []);

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
  } = useGameSocket(bdLogic);

  const [hand, setHand] = useState<Card[]>([]);
  const [playingCard, setPlayingCard] = useState<boolean>(false);
  const [showDrinks, setShowDrinks] = useState<boolean>(false);
  const [showSharedDrinks, setShowSharedDrinks] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [drinkDistribution, setDrinkDistribution] = useState<
    Record<string, number>
  >({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  const ready = useMemo(() => {
    return gameLogic.readyPlayers.find(
      (existingPlayer: any) => existingPlayer.username === player?.username
    );
  }, [gameLogic.readyPlayers, player?.username]);

  useEffect(() => {
    if (ready && gameLogic.drinkHistory.length > 0) {
      setShowSharedDrinks(true);
    }
  }, [gameLogic.drinkHistory.length, ready]);

  useEffect(() => {
    if (gameLogic.drinkHistory.length > 0) {
      setShowSharedDrinks(true);
    } else {
      setShowSharedDrinks(false);
    }
  }, [gameLogic.drinkHistory]);

  const allReady = useMemo(() => {
    return gameLogic.readyPlayers.length === gameLogic.players.length;
  }, [gameLogic.players.length, gameLogic.readyPlayers.length]);

  const getPlayerHand = useCallback(async () => {
    console.log("TRying to fetch plater hand", gameLogic.deckId);
    if (player && gameLogic?.deckId) {
      console.log("Fetching player hand");
      const result = await getPileCards(gameLogic.deckId, player.username);
      if (result && result.success) {
        console.log("Hand fetched successfully", result);
        setHand(result.piles[player.username].cards);
      } else {
        console.error("Failed to fetch hand", result);
      }
    }
  }, [player, gameLogic?.deckId]);

  useEffect(() => {
    if (gameLogic && gameLogic.status === "playing" && gameLogic.pyramid) {
      console.log("Game is playing and pyramid is set up");
      getPlayerHand();
    }
  }, [gameLogic, gameLogic?.status, gameLogic?.pyramid, getPlayerHand]);

  const toggleReady = useCallback(() => {
    handlePlayerAction("READY", { player });
  }, [handlePlayerAction, player]);

  const resetMessage = useCallback(() => {
    setTimeout(() => {
      setErrorMessage("");
    }, 5000); // Delay of 5000 milliseconds (5 seconds)
  }, []);

  useEffect(() => {
    if (errorMessage) {
      resetMessage();
    }
  }, [errorMessage, resetMessage]);

  // Sort and group the cards using useMemo to memoize the result
  const sortedGroupedCards = useMemo(() => {
    const groupedCards = groupCardsByValue(hand);
    return Object.keys(groupedCards)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .reduce((acc, key) => {
        acc[key] = groupedCards[key];
        return acc;
      }, {} as Record<string, Card[]>);
  }, [hand]);

  const handleNextTurn = (): void => {
    if (
      Object.keys(gameLogic.turnedCards).length < gameLogic?.pyramid?.length
    ) {
      handlePlayerAction("TURN_CARD");
    } else {
      handlePlayerAction("START_BONUS");
    }
  };

  const cancelPlayCard = (): void => {
    setShowDrinks(false);
    setSelectedCard(null);
  };

  const handlePlayCard = (card: Card): void => {
    if (!playingCard) {
      console.log("Card selected to play", card);
      setSelectedCard(card);
      setShowDrinks(true);
    }
  };

  const handleSendDrinks = (): void => {
    const totalDrinks = Object.values(drinkDistribution).reduce(
      (a, b) => a + b,
      0
    );
    if (totalDrinks === gameLogic.drinkAmount) {
      if (selectedCard) {
        console.log("Sending drinks", drinkDistribution);
        setPlayingCard(true); // Set playingCard to true immediately
        handlePlayerAction("PLAY_CARD", {
          card: selectedCard,
          player,
          drinkDistribution,
        });

        setTimeout(() => {
          setPlayingCard(false); // Reset playingCard after a delay
          setShowDrinks(false); // Hide drink distribution popup
          setSelectedCard(null); // Clear selected card
          setDrinkDistribution({}); // Reset drink distribution
        }, 500); // Adjust the delay as needed
      }
    } else {
      setErrorMessage(
        `Please distribute exactly ${gameLogic.drinkAmount} drinks`
      );
    }
  };

  const handleDrinkInputChange = (username: string, amount: number): void => {
    const totalDrinks =
      Object.values(drinkDistribution).reduce((a, b) => a + b, 0) -
      (drinkDistribution[username] || 0) +
      amount;
    if (totalDrinks <= gameLogic.drinkAmount) {
      setDrinkDistribution((prev) => ({
        ...prev,
        [username]: amount,
      }));
      setErrorMessage("");
    } else {
      setErrorMessage(`Total drinks cannot exceed ${gameLogic.drinkAmount}`);
    }
  };

  const getLastTurnedCard = () => {
    const keys = Object.keys(gameLogic.turnedCards);
    return keys.length ? keys[keys.length - 1] : null;
  };

  const lastTurnedCard = getLastTurnedCard();

  const toggleSharedDrinks = (event: any): void => {
    event.stopPropagation();
    setShowSharedDrinks(!showSharedDrinks);
  };

  const handlePlayBonusCard = (card: Card): void => {
    handlePlayerAction("PLAY_BONUS_CARD", card);
  };

  const handleResetBonusRound = (): void => {
    handlePlayerAction("RESET_BONUS");
  };

  const isGameGoing = (): boolean => {
    return gameLogic?.status !== "playing" && gameLogic?.status !== "bonus";
  };

  return (
    <>
      <Navbar text="BUSS DRIVER" resetGame={resetAll} />
      <main
        className="bd-container"
        style={
          isGameGoing() ? { paddingTop: "var(--header-padding)" } : undefined
        }
      >
        {roomInfo?.game?.status === "lobby" ? (
          <GameLobby
            roomId={roomInfo.roomId}
            roomData={roomInfo}
            player={player}
            gameData={GAME}
            onStartGame={startGame}
          />
        ) : gameLogic && gameLogic.status === "playing" ? (
          <>
            <Players
              players={gameLogic.players}
              readyPlayers={gameLogic.readyPlayers}
              username={player?.username || null}
            />
            {gameLogic.pyramid?.length > 0 ? (
              <Pyramid
                pyramid={gameLogic.pyramid}
                turnedCards={gameLogic.turnedCards}
              />
            ) : (
              <p>Loading pyramid...</p>
            )}
            <Hand
              hand={sortedGroupedCards}
              isEqual={isEqual}
              lastTurnedCard={lastTurnedCard}
              handlePlayCard={handlePlayCard}
              ready={!!ready}
              toggleReady={toggleReady}
              sortedGroupedCards={sortedGroupedCards}
              playingCard={playingCard}
            />
            {allReady &&
            player?.username === gameLogic.admin &&
            gameLogic.round !== 16 ? (
              <button className="bd-next-turn-popup" onClick={handleNextTurn}>
                NEXT TURN
              </button>
            ) : null}
            {showSharedDrinks ? (
              <SharedDrinks
                giveBeer={giveBeer}
                drinkHistory={gameLogic.drinkHistory}
                onClose={toggleSharedDrinks}
                player={player?.username}
              />
            ) : (
              <button
                className="bd-show-drinks pinkBlackHover"
                onClick={(e) => toggleSharedDrinks(e)}
              >
                <img src={giveBeer} alt="Mug of Beer"></img>
              </button>
            )}
            {showDrinks && (
              <SendDrinks
                drinkAmount={gameLogic.drinkAmount}
                giveBeer={giveBeer}
                errorMessage={errorMessage}
                players={gameLogic.players}
                drinkDistribution={drinkDistribution}
                handleDrinkInputChange={handleDrinkInputChange}
                handleSendDrinks={handleSendDrinks}
                username={player?.username}
                cancelPlayCard={cancelPlayCard}
              />
            )}
          </>
        ) : gameLogic && gameLogic.status === "bonus" ? (
          <>
            {gameLogic.pyramid?.length > 0 && player ? (
              <>
                <BonusPyramid
                  onCardTurned={handlePlayBonusCard}
                  gameLogic={gameLogic}
                  player={player}
                  message={message}
                  resetBonus={handleResetBonusRound}
                />
                {gameLogic.round === 6 ? (
                  <GameOver resetAll={resetAll} />
                ) : null}
              </>
            ) : (
              <p>Loading pyramid...</p>
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

export default BussDriver;
