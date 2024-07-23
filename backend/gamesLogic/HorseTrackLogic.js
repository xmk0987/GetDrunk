const {
  getNewDeck,
  drawACard,
  addToPile,
  listPileCards,
} = require("../deckApi/deckApi");

class HorseTrackLogic {
  /**
   * Initializes a new instance of the HorseTrackLogic class.
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
    console.log(`Horse Track game started in room ${this.roomId}`);
    const roomData = this.socketData[this.roomId];

    roomData.game.status = "bets";
    roomData.game.horses = {
      spade: { position: 0, frozen: false },
      heart: { position: 0, frozen: false },
      cross: { position: 0, frozen: false },
      diamond: { position: 0, frozen: false },
    };
    roomData.game.bets = {};
    roomData.game.winningSuit = "";
    this.io.to(this.roomId).emit("game-started", { gameData: roomData });
  }

  /**
   * Handles player actions based on the action type.
   * @param {string} action - The action type (e.g., "GUESS_CORRECT", "GUESS_BIGGER").
   * @param {Object} data - Additional data associated with the action.
   */
  handlePlayerAction(action, data) {
    console.log(`Horse Track action: ${action}`);
    console.log("data here ", data);
    // Implement action handling logic based on action type
    switch (action) {
      case "MOVE_HORSE":
        this.moveHorse();
        break;
      case "SET_BET":
        this.setBet(data);
        break;
      default:
        console.log(`Unknown action type: ${action}`);
    }
  }

  /**
   * Moves a random horse forward by one position.
   */
  moveHorse() {
    const roomData = this.socketData[this.roomId];

    if (roomData.game.status === "bets") {
      console.log("we arrive in here to set game to playing");
      roomData.game.status = "playing";
    }
    const horseKeys = Object.keys(roomData.game.horses);
    const randomIndex = Math.floor(Math.random() * horseKeys.length);
    const selectedHorse = horseKeys[randomIndex];

    // Move the selected horse forward by one position
    roomData.game.horses[selectedHorse].position += 1;

    // Emit the updated game state to all clients
    // If horse reaches goal set game over
    if (roomData.game.horses[selectedHorse].position === 5) {
      roomData.game.winningSuit = selectedHorse;
      console.log(roomData.game.winningSuit);
      roomData.game.status = "game-over";
    }
    this.io.to(this.roomId).emit("next-turn", { gameData: roomData });
    console.log(
      `Horse ${selectedHorse} moved to position ${roomData.game.horses[selectedHorse].position}`
    );
  }

  /*
  Saves players bet 
   */
  setBet(data) {
    const { bet, suit, player } = data;
    console.log("SETTING BET WITH DATA", data);
    const name = player.username;
    const roomData = this.socketData[this.roomId];

    roomData.game.bets[name] = { bet, suit };
    this.io.to(this.roomId).emit("next-turn", { gameData: roomData });
  }

  // Rejoin game
  rejoinGame(player, socket) {
    console.log("trying to reconnect bd");
  }
}

module.exports = HorseTrackLogic;
