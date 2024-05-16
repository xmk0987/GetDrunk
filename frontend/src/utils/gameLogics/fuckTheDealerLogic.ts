import { Socket } from "socket.io-client";

export class FuckTheDealerLogic {
  deck: any = null;
  dealer: string | null = null;
  guesser: string | null = null;

  startGame(socket: Socket, roomId: string) {
    console.log("send start game");
    socket.emit("start-game", roomId);
    console.log("Fuck the dealer game started!");
  }

  initializeGame(data: any) {
    console.log("Game initialized with data:", data);
    this.deck = data.game.deck;
    this.dealer = data.game.dealer;
    this.guesser = data.game.guesser;
  }

  handlePlayerAction(action: string, socket: Socket, roomId: string | null) {
    console.log(`Fuck the dealer player action: ${action}`);
    socket.emit("player-action", { action, roomId });
  }
}
