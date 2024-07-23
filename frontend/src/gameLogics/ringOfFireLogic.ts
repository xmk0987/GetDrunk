import { Socket } from "socket.io-client";
import { Card, Player } from "../utils/types/types";

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
  cards: Array<number> = [];
  card: Card | null = null;
  questionMaster: Player | null = null;

  /**
   * Starts the game by emitting a "start-game" event.
   * @param {Socket} socket - The socket instance to emit the event.
   * @param {string} roomId - The ID of the room where the game is started.
   */
  startGame(socket: Socket, roomId: string) {
    socket.emit("start-game", roomId);
    console.log("Ring of Fire game started!");
  }

  /**
   * Sets the game data using the provided room data.
   * @param {RoomData} data - The room data containing game information.
   */
  setGameData(data: any) {
    console.log("Ring Of Fire set with data:", data);
    const { status, deck, deckId, playerInTurn, cards, card, questionMaster } =
      data.game;
    this.roomId = data.roomId;
    this.players = data.players;
    this.admin = data.admin;
    this.status = status;
    this.deck = deck;
    this.deckId = deckId;
    this.playerInTurn = playerInTurn;
    this.cards = cards;
    this.card = card;
    this.questionMaster = questionMaster;
  }
  /**
   * Resets the game to its initial state.
   */
  resetGame() {
    this.roomId = null;
    this.admin = null;
    this.players = [];
    this.status = "choose";
    this.playerInTurn = null;
    this.deck = null;
    this.deckId = null;
    this.cards = [];
    this.card = null;
    this.questionMaster = null;
    console.log("Game has been reset to initial state.");
  }
}
