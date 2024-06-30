const {
  getNewDeck,
  drawACard,
  addToPile,
  listPileCards,
} = require("../deckApi/deckApi");

class FuckTheDealerLogic {
  /**
   * Initializes a new instance of the FuckTheDealerLogic class.
   * @param {Object} io - The Socket.IO server instance.
   * @param {string} roomId - The ID of the room.
   * @param {Object} socketData - The data structure to store socket and game state information.
   */
  constructor(io, roomId, socketData) {
    this.io = io;
    this.roomId = roomId;
    this.socketData = socketData; // Store the reference to socketData
  }

  /**
   * Starts the game by initializing the deck and setting up the game state.
   * This function is asynchronous and interacts with the deck API.
   */
  async startGame() {
    console.log(`Fuck the dealer game started in room ${this.roomId}`);

    // Fetch the deck
    const deck = await this.initializeGame();
    if (deck.success) {
      // Update the game state
      if (this.socketData[this.roomId]) {
        const roomData = this.socketData[this.roomId];

        // Set room and game status
        roomData.game.status = "playing";
        roomData.game.deck = deck; // Store deck data in roomData
        roomData.game.dealerTurn = 1;
        roomData.game.guessNumber = 1;
        roomData.game.playedCards = [];

        // Assign dealer and player in turn
        const players = roomData.players;
        const dealerIndex = Math.floor(Math.random() * players.length);
        const dealer = players[dealerIndex];
        let playerInTurnIndex = (dealerIndex + 1) % players.length;
        const playerInTurn = players[playerInTurnIndex];

        // Add dealer and player in turn to roomData
        roomData.game.dealer = dealer;
        roomData.game.guesser = playerInTurn;

        this.io.to(this.roomId).emit("game-started", roomData);
      }
    }
  }

  /**
   * Initializes the game by fetching a new deck and drawing a card.
   * @returns {Object|null} The deck object if successful, otherwise null.
   */
  async initializeGame() {
    const newDeck = await getNewDeck();
    if (newDeck.success) {
      const deck = await drawACard(newDeck.deck_id);
      return deck;
    } else {
      return null;
    }
  }

  /**
   * Handles player actions based on the action type.
   * @param {string} action - The action type (e.g., "GUESS_CORRECT", "GUESS_BIGGER").
   * @param {Object} data - Additional data associated with the action.
   */
  handlePlayerAction(action, data) {
    console.log(`Fuck the dealer action: ${action}`);
    console.log("data here ", data);
    // Implement action handling logic based on action type
    switch (action) {
      case "GUESS_CORRECT":
        console.log("GUESS_CORRECT");
        this.handleGuessCorrect();
        break;
      case "GUESS_BIGGER":
        console.log("GUESS BIGGER");
        this.handleGuessBigger(data);
        break;
      case "GUESS_SMALLER":
        console.log("GUESS SMALLER");
        this.handleGuessSmaller(data);
        break;
      case "GUESS_WRONG":
        console.log("GUESS WRONG");
        this.handleGuessWrong(data);
        break;
      default:
        console.log(`Unknown action type: ${action}`);
    }
  }

  /**
   * Handles the action when the player's guess is smaller than the target card.
   * @param {Object} data - Data associated with the action.
   */
  async handleGuessSmaller(data) {
    this.socketData[this.roomId].game.guessNumber = 2;
    console.log("DATA HERE", data);

    const message = `${
      this.socketData[this.roomId].game.guesser.username
    } guessed ${data.value}. The card is smaller.`;
    this.io.to(this.roomId).emit("next-turn", {
      gameData: this.socketData[this.roomId],
      message,
    });
  }

  /**
   * Handles the action when the player's guess is bigger than the target card.
   * @param {Object} data - Data associated with the action.
   */
  async handleGuessBigger(data) {
    this.socketData[this.roomId].game.guessNumber = 2;
    console.log("DATA HERE", data);
    const message = `${
      this.socketData[this.roomId].game.guesser.username
    } guessed ${data.value}. The card is bigger.`;
    this.io.to(this.roomId).emit("next-turn", {
      gameData: this.socketData[this.roomId],
      message,
    });
  }

  /**
   * Handles the action when the player's guess is correct.
   */
  async handleGuessCorrect() {
    const deckId = this.socketData[this.roomId].game.deck.deck_id;
    const guessedCard = this.socketData[this.roomId].game.deck.cards[0];
    const addCard = await addToPile(deckId, "played", guessedCard.code);
    if (addCard.success) {
      const playedCards = await listPileCards(deckId, "played");
      const message =
        this.socketData[this.roomId].game.guessNumber === 1
          ? `${
              this.socketData[this.roomId].game.guesser.username
            } guessed correct ${guessedCard.code}. ${
              this.socketData[this.roomId].game.dealer.username
            } drink 5`
          : `${
              this.socketData[this.roomId].game.guesser.username
            } guessed correct ${guessedCard.code}. ${
              this.socketData[this.roomId].game.dealer.username
            } drink 2`;
      const deck = await drawACard(deckId);
      this.socketData[this.roomId].game.deck = deck;
      this.socketData[this.roomId].game.dealerTurn = 1;
      this.socketData[this.roomId].game.playedCards =
        playedCards.piles.played.cards;
      this.socketData[this.roomId].game.guessNumber = 1;
      this.changeGuesser();

      this.io.to(this.roomId).emit("next-turn", {
        gameData: this.socketData[this.roomId],
        message,
      });
    } else {
      console.log("Error occured");
    }
  }

  /**
   * Handles the action when the player's guess is wrong.
   * @param {Object} data - Data associated with the action.
   */
  async handleGuessWrong(data) {
    const deckId = this.socketData[this.roomId].game.deck.deck_id;
    const card = this.socketData[this.roomId].game.deck.cards[0];
    const guessedValue = data.value;
    const correctValue = this.mapCardValueToNumber(card.value);
    const difference = Math.abs(correctValue - guessedValue);
    const addCard = await addToPile(deckId, "played", card.code);
    if (addCard.success) {
      const playedCards = await listPileCards(deckId, "played");
      let message = `${
        this.socketData[this.roomId].game.guesser.username
      } you guessed wrong. Drink ${difference}.`;

      const deck = await drawACard(deckId);

      this.socketData[this.roomId].game.deck = deck;
      if (this.socketData[this.roomId].game.dealerTurn === 3) {
        this.changeDealer();
        this.socketData[this.roomId].game.dealerTurn = 1;
        message += " Dealer changes.";
      } else {
        this.socketData[this.roomId].game.dealerTurn++;
      }

      this.socketData[this.roomId].game.playedCards =
        playedCards.piles.played.cards;
      this.socketData[this.roomId].game.guessNumber = 1;
      this.changeGuesser();
      this.io.to(this.roomId).emit("next-turn", {
        gameData: this.socketData[this.roomId],
        message,
      });
    }
  }

  /**
   * Changes the current guesser to the next player in line.
   */
  changeGuesser() {
    const roomData = this.socketData[this.roomId];
    const players = roomData.players;
    const currentGuesserIndex = players.findIndex(
      (player) => player.socketId === roomData.game.guesser.socketId
    );
    let newGuesserIndex = currentGuesserIndex;

    // Find the next player who is not the dealer
    do {
      newGuesserIndex = (newGuesserIndex + 1) % players.length;
    } while (
      players[newGuesserIndex].socketId === roomData.game.dealer.socketId
    );

    roomData.game.guesser = players[newGuesserIndex];
  }

  /**
   * Changes the current dealer to the next player in line.
   */
  changeDealer() {
    const roomData = this.socketData[this.roomId];
    const players = roomData.players;
    const currentDealerIndex = players.findIndex(
      (player) => player.socketId === roomData.game.dealer.socketId
    );
    let newDealerIndex = currentDealerIndex;

    // Find the next player who is not the dealer
    do {
      newDealerIndex = (newDealerIndex + 1) % players.length;
    } while (
      players[newDealerIndex].socketId === roomData.game.dealer.socketId
    );

    roomData.game.dealer = players[newDealerIndex];
  }

  rejoinGame(player, socket) {
    // Update game state references for dealer and guesser
    if (
      this.socketData[this.roomId].game.dealer &&
      this.socketData[this.roomId].game.dealer.username === player.username
    ) {
      console.log("Player was dealer");
      this.socketData[this.roomId].game.dealer.socketId = socket.id;
    }
    if (
      this.socketData[this.roomId].game.guesser &&
      this.socketData[this.roomId].game.guesser.username === player.username
    ) {
      console.log("Player was guesser");
      this.socketData[this.roomId].game.guesser.socketId = socket.id;
    }
  }

  /**
   * Maps card values to their respective numbers.
   * @param {string} value - The card value as a string (e.g., "ACE", "KING").
   * @returns {number} The numerical value of the card.
   */
  mapCardValueToNumber(value) {
    if (value === "ACE") return 1;
    if (value === "JACK") return 11;
    if (value === "QUEEN") return 12;
    if (value === "KING") return 13;
    return parseInt(value, 10);
  }
}

module.exports = FuckTheDealerLogic;
