import { Socket } from "socket.io-client";
import { Deck, Player } from "../types/types";

/**
 * Class representing the game logic for "Ring Of Fire".
 */
export class RingOfFireLogic {
  roomId: string | null = null;
  admin: string | null = null;
  players: Array<Player> = [];
  status: string = "choose";
  playerInTurn: Player | null = null;
  deck: any = null;
  deckId: string | null = null;

  /**
   * Starts the game by emitting a "start-game" event.
   * @param {Socket} socket - The socket instance to emit the event.
   * @param {string} roomId - The ID of the room where the game is started.
   */
  startGame(socket: Socket, roomId: string) {
    socket.emit("start-game", roomId);
    console.log("Fuck the dealer game started!");
  }

  /**
   * Sets the game data using the provided room data.
   * @param {RoomData} data - The room data containing game information.
   */
  setGameData(data: any) {
    console.log("Ring Of Fire set with data:", data);
    const { status, deck, deckId, playerInTurn } = data.game;
    this.roomId = data.roomId;
    this.players = data.players;
    this.admin = data.admin;
    this.status = status;
    this.deck = deck;
    this.deckId = deckId;
    this.playerInTurn = playerInTurn;
  }

  /**
   * Resets the game to its initial state.
   */
  resetGame() {
    console.log("Game has been reset to initial state.");
  }

  setHand() {
    return;
  }
}
