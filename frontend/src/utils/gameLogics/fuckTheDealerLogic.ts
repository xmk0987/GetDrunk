import { Socket } from "socket.io-client";

export class FuckTheDealerLogic {
  status: string = "choose";
  deck: any = null;
  dealer: any = null;
  guesser: any = null;
  dealerTurn: number = 0;
  guessNumber: number = 1;
  admin: string | null = null;
  players: Array<any> = [];
  roomId: string | null = null;
  playedCards: Array<any> = [];

  startGame(socket: Socket, roomId: string) {
    console.log("send start game");
    socket.emit("start-game", roomId);
    console.log("Fuck the dealer game started!");
  }

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

  handlePlayerAction(action: string, socket: Socket, roomId: string | null) {
    console.log(`Fuck the dealer player action: ${action}`);
    socket.emit("player-action", { action, roomId });
  }
}
