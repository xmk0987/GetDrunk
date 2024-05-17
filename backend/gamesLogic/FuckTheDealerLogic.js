const {
  getNewDeck,
  drawACard,
  addToPile,
  listPileCards,
} = require("../deckApi/deckApi");

class FuckTheDealerLogic {
  constructor(io, roomId, socketData) {
    this.io = io;
    this.roomId = roomId;
    this.socketData = socketData; // Store the reference to socketData
  }

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
        roomData.game.dealerTurn = 0;
        roomData.game.guessNumber = 1;

        // Assign dealer and player in turn
        const players = roomData.players;
        const dealerIndex = Math.floor(Math.random() * players.length);
        const dealer = players[dealerIndex];
        let playerInTurnIndex = dealerIndex + 1;
        if (playerInTurnIndex >= players.length) {
          playerInTurnIndex = 0;
        }
        const playerInTurn = players[playerInTurnIndex];

        // Add dealer and player in turn to roomData
        roomData.game.dealer = dealer.socketId;
        roomData.game.guesser = playerInTurn.socketId;

        this.io.to(this.roomId).emit("game-started", roomData);
      }
    }
  }

  async initializeGame() {
    const newDeck = await getNewDeck();
    if (newDeck.success) {
      const deck = await drawACard(newDeck.deck_id);
      return deck;
    } else {
      return null;
    }
  }

  handlePlayerAction(action, socketId) {
    console.log(`Fuck the dealer action: ${action} by socket ${socketId}`);
    // Implement action handling logic based on action type
    switch (action) {
      case "GUESS_CORRECT":
        console.log("GUESS_CORRECT");
        this.handleGuessCorrect(socketId);
        break;
      case "GUESS_BIGGER":
        break;
      case "GUESS_SMALLER":
        break;
      // Add more cases for different action types as needed
      default:
        console.log(`Unknown action type: ${action}`);
    }
  }

  async handleGuessCorrect(socketId) {
    const deckId = this.socketData[this.roomId].game.deck.deck_id;
    const guessedCard = this.socketData[this.roomId].game.deck.cards[0];
    const addCard = await addToPile(deckId, "played", guessedCard.code);
    if (addCard.success) {
      const deck = await listPileCards(deckId, "played");
      this.socketData[this.roomId].game.deck = deck;
      this.socketData[this.roomId].game.dealerTurn = 0;
      const message =
        this.socketData[this.roomId].game.guessNumber === 1
          ? "Dealer drink 5"
          : "Dealer drink 2";
      this.socketData[this.roomId].game.guessNumber = 1;
      this.changeGuesser();
      this.io
        .to(this.roomId)
        .emit("next-turn", { gameData: this.socketData[this.roomId], message });
    } else {
      console.log("Error occured");
    }
  }

  changeGuesser() {
    const roomData = this.socketData[this.roomId];
    const players = roomData.players;
    const currentGuesserIndex = players.findIndex(
      (player) => player.socketId === roomData.game.guesser
    );
    let newGuesserIndex = currentGuesserIndex;

    // Find the next player who is not the dealer
    do {
      newGuesserIndex = (newGuesserIndex + 1) % players.length;
    } while (players[newGuesserIndex].socketId === roomData.game.dealer);

    roomData.game.guesser = players[newGuesserIndex].socketId;
  }
}

module.exports = FuckTheDealerLogic;
