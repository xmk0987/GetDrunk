const { getNewDeck, drawACard } = require("../deckApi/deckApi");

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
      console.log("Deck fetched", deck);

      // Update the game state
      if (this.socketData[this.roomId]) {
        const roomData = this.socketData[this.roomId];

        // Set room and game status
        roomData.roomStatus = "game";
        roomData.game.status = "playing";
        roomData.game.deck = deck; // Store deck data in roomData

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

        console.log("sending this", roomData.game.deck);

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
    // Implement action handling logic
    this.io.to(this.roomId).emit("player-action", { action, socketId });
  }
}

module.exports = FuckTheDealerLogic;
