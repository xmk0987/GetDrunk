import { Socket } from "socket.io-client";
import { HTBet, Player } from "../utils/types/types";

import spadesHorse from "../utils/images/horses/spadesHorse.png";
import heartsHorse from "../utils/images/horses/heartsHorse.png";
import crossesHorse from "../utils/images/horses/crossesHorse.png";
import diamondsHorse from "../utils/images/horses/diamondsHorse.png";

import { HorsesState } from "../utils/types/types";

type HorseSuit = "spade" | "heart" | "cross" | "diamond";

/**
 * Class representing the game logic for "Horse Track".
 */
export class HorseTrackLogic {
  status: string = "choose";
  players: Array<Player> = [];
  roomId: string | null = null;
  horses: HorsesState = {
    spade: { position: 0, img: spadesHorse, suit: "SPADE", frozen: false },
    heart: { position: 0, img: heartsHorse, suit: "HEART", frozen: false },
    cross: { position: 0, img: crossesHorse, suit: "CROSS", frozen: false },
    diamond: {
      position: 0,
      img: diamondsHorse,
      suit: "DIAMOND",
      frozen: false,
    },
  };
  bets: { [playerName: string]: HTBet } = {};
  winningSuit: string = "";

  /**
   * Starts the game by emitting a "start-game" event.
   * @param {Socket} socket - The socket instance to emit the event.
   * @param {string} roomId - The ID of the room where the game is started.
   */
  startGame(socket: Socket, roomId: string) {
    socket.emit("start-game", roomId);
    console.log("Horse track game started!");
  }

  /**
   * Sets the game data using the provided room data.
   * @param {any} data - The room data containing game information.
   */
  setGameData(data: any) {
    console.log("Game set with data:", data);
    this.status = data.game.status;
    this.players = data.players;
    this.roomId = data.roomId;
    (Object.keys(this.horses) as HorseSuit[]).forEach((suit: HorseSuit) => {
      if (data.game.horses[suit]) {
        this.horses[suit].position = data.game.horses[suit].position;
      }
    });
    this.bets = data.game.bets;
    this.winningSuit = data.game.winningSuit;
  }

  /**
   * Resets the game to its initial state.
   */
  resetGame() {
    console.log("Game has been reset to initial state.");
    this.status = "choose";
    this.horses = {
      spade: { position: 0, img: spadesHorse, suit: "SPADE", frozen: false },
      heart: { position: 0, img: heartsHorse, suit: "HEART", frozen: false },
      cross: { position: 0, img: crossesHorse, suit: "CROSS", frozen: false },
      diamond: {
        position: 0,
        img: diamondsHorse,
        suit: "DIAMOND",
        frozen: false,
      },
    };
    this.players = [];
    this.roomId = null;
    this.winningSuit = "";
    this.bets = {};
  }

  checkAllPositionsZero() {
    return Object.values(this.horses).every((horse) => horse.position === 0);
  }

  gameOver(): boolean {
    return this.status === "game-over";
  }
}
