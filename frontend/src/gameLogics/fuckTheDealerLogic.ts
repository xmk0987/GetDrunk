import { Socket } from "socket.io-client";
import { Player } from "../utils/types/types";

/**
 * Class representing the game logic for "Fuck the Dealer".
 */
export class FuckTheDealerLogic {
  status: string = "choose";
  deck: any = null;
  dealer: Player | null = null;
  guesser: Player | null = null;
  dealerTurn: number = 0;
  guessNumber: number = 1;
  admin: string | null = null;
  players: Array<Player> = [];
  roomId: string | null = null;
  playedCards: Array<any> = [];

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
    console.log("Game set with data:", data);
    const {
      status,
      dealer,
      dealerTurn,
      guesser,
      guessNumber,
      deck,
      playedCards,
    } = data.game;
    this.status = status;
    this.deck = deck;
    this.dealer = dealer;
    this.dealerTurn = dealerTurn;
    this.guesser = guesser;
    this.guessNumber = guessNumber;
    this.players = data.players;
    this.roomId = data.roomId;
    this.admin = data.admin;
    this.playedCards = playedCards;
  }

  /**
   * Resets the game to its initial state.
   */
  resetGame() {
    this.status = "choose";
    this.deck = null;
    this.dealer = null;
    this.guesser = null;
    this.dealerTurn = 0;
    this.guessNumber = 1;
    this.admin = null;
    this.players = [];
    this.roomId = null;
    this.playedCards = [];
    console.log("Game has been reset to initial state.");
  }

  setHand() {
    return;
  }
}
