const {
  getNewDeck,
  drawACard,
  addToPile,
  listPileCards,
  discardCard,
} = require("../deckApi/deckApi");

class RingOfFireLogic {
  /**
   * Initializes a new instance of the RingOfFire class.
   * @param {Object} io - The Socket.IO server instance.
   * @param {string} roomId - The ID of the room.
   * @param {Object} socketData - The data structure to store socket and game state information.
   */
  constructor(io, roomId, socketData) {
    this.io = io;
    this.roomId = roomId;
    this.socketData = socketData; // Store the reference to socketData
  }

  // Emit an error message to the room
  throwError(message) {
    this.io.to(this.roomId).emit("error", message);
  }

  /**
   * Starts the game by initializing the deck and setting up the game state.
   * This function is asynchronous and interacts with the deck API.
   */
  async startGame() {
    console.log(`Ring Of Fire game started in room ${this.roomId}`);

    // Fetch the deck
    const deck = await getNewDeck();
    if (deck.success) {
      // Update the game state
      if (this.socketData[this.roomId]) {
        const roomData = this.socketData[this.roomId];

        // Set room and game status
        roomData.game.status = "playing";
        roomData.game.deck = deck;
        roomData.game.deckId = deck.deck_id;
        roomData.game.cards = Array(52).fill(1);
        roomData.game.questionMaster = null;

        // Assign player in turn
        const players = roomData.players;
        const playerIndex = Math.floor(Math.random() * players.length);
        const playerInTurn = players[playerIndex];

        roomData.game.playerInTurn = playerInTurn;
        let message = `WELCOME TO THE RING OF FIRE! ${playerInTurn.username} pick the first card.`;

        this.io
          .to(this.roomId)
          .emit("game-started", { gameData: roomData, message });
      }
    }
  }

  /**
   * Handles player actions based on the action type.
   * @param {string} action - The action type (e.g., "GUESS_CORRECT", "GUESS_BIGGER").
   * @param {Object} data - Additional data associated with the action.
   */
  handlePlayerAction(action, data) {
    console.log(`Ring of fire action: ${action}`);
    console.log("data here ", data);
    // Implement action handling logic based on action type
    switch (action) {
      case "CARD-TURNED":
        this.handleCardTurn(data.index);
        break;
      default:
        console.log(`Unknown action type: ${action}`);
    }
  }

  async handleCardTurn(index) {
    console.log("We received card", index);

    // Get the room data
    const roomData = this.socketData[this.roomId];

    if (roomData && roomData.game && roomData.game.cards) {
      if (roomData.game.deck && roomData.game.card) {
        const newDeck = await discardCard(
          roomData.game.deckId,
          roomData.game.card.code
        );
        if (!newDeck.success) {
          console.log("Error");
          return;
        }
        roomData.game.deck = newDeck;
      }
      // Remove the card from the deck
      roomData.game.cards[index] = 0;

      // Update the player turn (optional, based on your game logic)
      const currentIndex = roomData.players.findIndex(
        (player) => player.username === roomData.game.playerInTurn.username
      );
      const nextIndex = (currentIndex + 1) % roomData.players.length;
      let newPlayer = roomData.players[nextIndex];

      const cardResponse = await drawACard(roomData.game.deckId);

      if (!cardResponse.success) {
        console.log("Error");
        return;
      }
      console.log(cardResponse);
      const drawnCard = cardResponse.cards[0];

      if (drawnCard.value === "QUEEN") {
        roomData.game.questionMaster = roomData.game.playerInTurn;
      }

      roomData.game.playerInTurn = newPlayer;

      roomData.game.card = cardResponse.cards[0];

      // Broadcast the updated game state to all clients in the room
      this.io.to(this.roomId).emit("next-turn", { gameData: roomData });
    }
  }

  rejoinGame(player, socket) {}
}

module.exports = RingOfFireLogic;
