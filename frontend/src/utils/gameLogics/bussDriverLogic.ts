import { Socket } from "socket.io-client";
import { Player } from "../types/types";

/**
 * Class representing the game logic for "Buss Driver".
 */
export class BussDriverLogic {
  status: string = "choose";
  admin: string | null = null;
  players: Array<Player> = [];
  roomId: string | null = null;
  round: number = 1;
  bussDriver: string | null = null;
  playedCards: any = [];
  pyramid: any = null;
  hand: any = null;
  turnedCards: { [key: string]: string[] } = {}; // Initialize as an object
  readyPlayers: Array<Player> = [];
  deckId: string | null = null;
  drinkAmount: number = 2;
  drinkHistory: any[] = [];

  /**
   * Starts the game by emitting a "start-game" event.
   * @param {Socket} socket - The socket instance to emit the event.
   * @param {string} roomId - The ID of the room where the game is started.
   */
  startGame(socket: Socket, roomId: string) {
    socket.emit("start-game", roomId);
    console.log("Buss Driver game started!");
  }

  /**
   * Sets the game data using the provided room data.
   * @param {any} data - The room data containing game information.
   */
  setGameData(data: any) {
    console.log("Game set with data:", data);
    this.status = data.game.status;
    this.admin = data.admin;
    this.players = data.players;
    this.roomId = data.roomId;
    this.round = data.game.round;
    this.bussDriver = data.game.bussDriver;
    this.playedCards = data.game.playedCards;
    this.deckId = data.game.deckId;
    this.pyramid = data.game.pyramid.reverse();
    this.turnedCards = data.game.turnedCards;
    this.readyPlayers = data.game.readyPlayers;
    this.drinkAmount = data.game.drinkAmount;
    this.drinkHistory = data.game.drinkHistory;
  }

  setHand(hand: any) {
    this.hand = hand;
  }

  setReadyPlayers(players: any) {
    console.log("setting ready players", players);
    this.readyPlayers = players;
  }

  turnPyramidCard(card: string) {
    this.turnedCards[card] = [];
  }

  /**
   * Resets the game to its initial state.
   */
  resetGame() {
    this.status = "choose";
    this.admin = null;
    this.players = [];
    this.roomId = null;
    this.round = 1;
    this.bussDriver = null;
    this.playedCards = [];
    this.pyramid = null;
    this.hand = null;
    this.turnedCards = {}; // Initialize as an empty object
    this.readyPlayers = [];
    this.deckId = null;
    this.drinkAmount = 2;
    this.drinkHistory = [];

    console.log("Game has been reset to initial state.");
  }
}
