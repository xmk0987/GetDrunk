const {
  getNewDeck,
  drawACard,
  addToPile,
  listPileCards,
  drawFromPile,
  discardCard,
  returnPileToDeck,
  returnAllCardsToDeck,
} = require("../deckApi/deckApi");

class BussDriverLogic {
  constructor(io, roomId, socketData) {
    this.io = io;
    this.roomId = roomId;
    this.socketData = socketData; // Store the reference to socketData
  }

  // Emit an error message to the room
  throwError(message) {
    this.io.to(this.roomId).emit("error", message);
  }

  // Start the game and initialize it
  async startGame() {
    console.log(`Buss Driver game started in room ${this.roomId}`);
    const deckId = await this.initializeGame();

    if (!deckId) return this.throwError("Game could not be initialized");

    const roomData = this.socketData[this.roomId];
    this.setupInitialGameState(roomData, deckId);

    for (let player of roomData.players) {
      await this.sendPlayerHand(deckId, player);
    }

    this.handleTurnPyramidCard();

    this.io.to(this.roomId).emit("game-started", { gameData: roomData });
  }

  // Send the player's hand to the client
  async sendPlayerHand(deckId, player) {
    const playerHand = await listPileCards(deckId, player.username);
    console.log("Player hand received", playerHand);
    this.io.to(player.socketId).emit("player-hand", playerHand);
  }

  // Initialize the game by creating a new deck and distributing cards
  async initializeGame() {
    try {
      const newDeck = await getNewDeck();
      if (!newDeck.success) throw new Error("Failed to get a new deck");

      const deckId = newDeck.deck_id;
      const pyramidCards = await this.drawAndAddPyramidCards(deckId);
      if (!pyramidCards) throw new Error("Failed to setup pyramid cards");

      await this.distributePlayerCards(deckId);

      console.log("Buss Driver all initialized");
      return deckId;
    } catch (error) {
      console.error("Error initializing game:", error);
      return null;
    }
  }

  // Draw and add pyramid cards to the deck
  async drawAndAddPyramidCards(deckId) {
    const pyramidCards = await drawACard(deckId, 15);
    if (!pyramidCards) return null;

    const cardCodes = pyramidCards.cards.map((card) => card.code).join(",");
    const pyramidPile = await addToPile(deckId, "pyramid", cardCodes);
    if (!pyramidPile.success) return null;

    return pyramidPile;
  }

  // Distribute cards among players
  async distributePlayerCards(deckId) {
    const roomData = this.socketData[this.roomId];
    const cardsLeft = 52 - 15;
    const cardsPerPlayer = Math.floor(cardsLeft / roomData.players.length);
    const allPlayerCards = await drawACard(deckId, cardsLeft);

    if (!allPlayerCards) throw new Error("Failed to draw cards for players");

    for (let player of roomData.players) {
      const playerCards = allPlayerCards.cards.splice(0, cardsPerPlayer);
      const playerCardCodes = playerCards.map((card) => card.code).join(",");
      const result = await addToPile(deckId, player.username, playerCardCodes);

      if (result && !result.success)
        throw new Error(
          `Failed to add cards to pile for player ${player.username}`
        );
    }
  }

  // Set up initial game state
  async setupInitialGameState(roomData, deckId) {
    const pyramid = await listPileCards(deckId, "pyramid");

    console.log("PYRAMID", pyramid);
    roomData.game = {
      ...roomData.game, // Retain existing game data
      status: "playing",
      deckId: deckId,
      round: 0,
      bussDriver: null,
      pyramid: pyramid.piles.pyramid.cards,
      drinkAmount: 2,
      playedCards: [],
      turnedCards: {},
      readyPlayers: [],
      drinkHistory: [],
    };
  }

  // Handle player actions
  handlePlayerAction(action, data) {
    console.log(`Buss Driver action: ${action}`);
    console.log("data here ", data);

    switch (action) {
      case "READY":
        this.handleReadyAction(data.player);
        break;
      case "TURN_CARD":
        this.handleTurnPyramidCard(data.cardCode);
        break;
      case "PLAY_CARD":
        this.handlePlayCard(data);
        break;
      case "PLAY_BONUS_CARD":
        this.handlePlayBonusCard(data);
        break;
      case "START_BONUS":
        this.handleStartBonus(data);
        break;
      case "RESET_BONUS":
        this.handleResetBonusRound(data);
        break;
      default:
        console.log(`Unknown action type: ${action}`);
    }
  }

  async handleStartBonus() {
    console.log("BONUS ROUND STARTING");
    const currentGameData = this.socketData[this.roomId].game;
    const roomData = this.socketData[this.roomId];

    const deckId = currentGameData.deckId;
    let maxCards = 0;
    let playersWithMaxCards = [];

    // Loop through each player to determine the number of cards left
    for (let player of roomData.players) {
      const deck = await listPileCards(deckId, player.username);
      const numCards = deck.piles[player.username].cards.length;

      // Check if the current player has more cards than the current maximum
      if (numCards > maxCards) {
        maxCards = numCards;
        playersWithMaxCards = [player]; // Reset the list with the current player
      } else if (numCards === maxCards) {
        playersWithMaxCards.push(player); // Add to the list of players with max cards
      }
    }

    // Randomly choose one of the tied players if there is a tie
    let loser;
    if (playersWithMaxCards.length > 1) {
      const randomIndex = Math.floor(
        Math.random() * playersWithMaxCards.length
      );
      loser = playersWithMaxCards[randomIndex];
    } else {
      loser = playersWithMaxCards[0];
    }

    console.log(
      `Player with most cards: ${loser.username} (Cards left: ${maxCards})`
    );

    const bonusDeck = await returnAllCardsToDeck(deckId);

    if (!bonusDeck.success) {
      return this.throwError("Bonus game could not be setup");
    }

    const pyramid = await this.drawAndAddPyramidCards(deckId);
    if (!pyramid) throw new Error("Failed to setup pyramid cards");

    currentGameData.bussDriver = loser.username;

    // Update the game state with the new pyramid for the bonus round
    currentGameData.status = "bonus";
    currentGameData.round = 1;
    currentGameData.pyramid = (
      await listPileCards(deckId, "pyramid")
    ).piles.pyramid.cards;
    currentGameData.drinkAmount = 0;
    currentGameData.playedCards = [];
    currentGameData.turnedCards = {};
    currentGameData.readyPlayers = [];
    currentGameData.drinkHistory = [];

    console.log("GAME DATA FOR THE BONUS ROUND", currentGameData);
    // Emit an event to notify about the bonus round loser and the updated game state
    this.io.to(this.roomId).emit("next-turn", {
      message: `${loser.username} is the BUSS DRIVER!`,
      gameData: roomData,
    });
  }

  // Handle play card action
  async handlePlayCard(data) {
    try {
      console.log("card played:", data);
      const { card, player, drinkDistribution } = data;
      const currentGameData = this.socketData[this.roomId].game;
      const turnedCardCode = this.getCurrentTurnedCardCode(currentGameData);

      if (!currentGameData.turnedCards[turnedCardCode]) {
        currentGameData.turnedCards[turnedCardCode] = [];
      }
      currentGameData.turnedCards[turnedCardCode].push(card);

      // Save the drink distribution data
      for (const [recipient, amount] of Object.entries(drinkDistribution)) {
        // Find existing entry
        const existingEntry = currentGameData.drinkHistory.find(
          (entry) =>
            entry.giver === player.username && entry.recipient === recipient
        );

        if (existingEntry) {
          // If entry exists, update the amount
          existingEntry.amount += amount;
        } else {
          // If entry doesn't exist, create a new one
          currentGameData.drinkHistory.push({
            giver: player.username,
            recipient: recipient,
            amount: amount,
          });
        }
      }

      await this.removeAndDiscardCard(
        currentGameData.deckId,
        player.username,
        card.code
      );

      this.io.to(this.roomId).emit("next-turn", {
        gameData: this.socketData[this.roomId],
      });
    } catch (error) {
      console.error("Error handling play card:", error);
    }
  }

  async handlePlayBonusCard(card) {
    console.log("Bonus card played", card);
    const currentGameData = this.socketData[this.roomId].game;
    const cardValue = this.mapCardValueToNumber(card.value);
    let message = `${currentGameData.bussDriver} is the BUSS DRIVER!`;

    if ([1, 11, 12, 13].includes(cardValue)) {
      currentGameData.drinkAmount = 2 * currentGameData.round;
      /*       currentGameData.turnedCards = {};*/
      message = `${currentGameData.bussDriver} has to drink ${currentGameData.drinkAmount}`;
    } else {
      currentGameData.round++;
      if (currentGameData.round === 6) {
        message = "Can you take more?";
      }
    }

    currentGameData.turnedCards[card.code] = [];

    this.io.to(this.roomId).emit("next-turn", {
      gameData: this.socketData[this.roomId],
      message,
    });
  }

  async handleResetBonusRound() {
    console.log("WE LOST RESET BONUS");
    const currentGameData = this.socketData[this.roomId].game;
    console.log(currentGameData);
    const cardsToBeReplaced = Object.keys(currentGameData.turnedCards);
    console.log("Cards to discard again");
    for (let cardCode of cardsToBeReplaced) {
      // Find the index of the card to be removed
      const cardIndex = currentGameData.pyramid.findIndex(
        (card) => card.code === cardCode
      );
      console.log("CARD INDEX", cardIndex);
      if (cardIndex !== -1) {
        // Draw a new card
        let newCardObject = await drawACard(currentGameData.deckId);
        if (newCardObject.cards.length === 0) {
          const result = await returnPileToDeck(
            currentGameData.deckId,
            "discard"
          );
          if (!result.success) {
            this.throwError("Shuffling the deck failed");
            return;
          }
          newCardObject = await drawACard(currentGameData.deckId);
        }
        const newCard = newCardObject.cards[0];
        // Replace the old card with the new card
        console.log("NEW CARD TO ADD", newCard);

        currentGameData.pyramid[cardIndex] = newCard;

        // Discard the old card
        await this.removeAndDiscardCard(
          currentGameData.deckId,
          "pyramid",
          cardCode
        );
      } else {
        console.log("Card not found in the pyramid");
      }
    }

    currentGameData.round = 1;
    currentGameData.drinkAmount = 0;
    currentGameData.turnedCards = {};
    console.log("BONUS ROUND RESET");
    this.io.to(this.roomId).emit("next-turn", {
      message: `${currentGameData.bussDriver} goes back to the bottom.`,
      gameData: this.socketData[this.roomId],
    });
  }

  // Get the current turned card code
  getCurrentTurnedCardCode(currentGameData) {
    return currentGameData.pyramid[
      currentGameData.pyramid.length - currentGameData.round
    ].code;
  }

  // Function to remove and discard a card
  async removeAndDiscardCard(deckId, pileName, cardCode) {
    try {
      const result = await drawFromPile(deckId, pileName, cardCode);
      console.log("Card removed from pile", result);

      if (result && result.success) {
        await discardCard(result.deck_id, result.cards[0].code);
        console.log("Card discarded");
      } else {
        throw new Error("Failed to remove card from pile");
      }
    } catch (error) {
      console.error("Error in removing and discarding card:", error);
    }
  }

  // Handle turn pyramid card action
  handleTurnPyramidCard() {
    console.log("Turning a pyramid card");
    const currentGameData = this.socketData[this.roomId].game;
    currentGameData.round++;
    if (
      currentGameData.round === 6 ||
      currentGameData.round === 10 ||
      currentGameData.round === 13 ||
      currentGameData.round === 15
    ) {
      currentGameData.drinkAmount += 2;
    }
    const cardCode = this.getCurrentTurnedCardCode(currentGameData);
    currentGameData.turnedCards[cardCode] = [];
    currentGameData.readyPlayers = [];
    currentGameData.drinkHistory = [];

    this.io.to(this.roomId).emit("next-turn", {
      gameData: this.socketData[this.roomId],
    });
  }

  // Handle player ready action
  handleReadyAction(player) {
    console.log("Player is ready");
    const roomData = this.socketData[this.roomId];
    const readyPlayers = roomData.game.readyPlayers;
    const playerIndex = readyPlayers.findIndex(
      (readyPlayer) => readyPlayer.username === player.username
    );

    if (playerIndex === -1) {
      readyPlayers.push(player);
      console.log(`${player.username} added to readyPlayers`);
    } else {
      readyPlayers.splice(playerIndex, 1);
      console.log(`${player.username} removed from readyPlayers`);
    }

    this.io.to(this.roomId).emit("ready-players-updated", readyPlayers);
  }

  // Rejoin game
  rejoinGame(player, socket) {
    console.log("trying to reconnect bd");
  }

  // Map card value to number
  mapCardValueToNumber(value) {
    const valueMapping = {
      ACE: 1,
      JACK: 11,
      QUEEN: 12,
      KING: 13,
    };
    return valueMapping[value] || parseInt(value, 10);
  }
}

module.exports = BussDriverLogic;
