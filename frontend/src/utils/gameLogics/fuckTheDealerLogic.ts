export class FuckTheDealerLogic {
  startGame() {
    console.log("Fuck the dealer game started!");
  }

  handlePlayerAction(action: string, socket: any, roomId: string | null) {
    console.log(`Fuck the dealer player action: ${action}`);
    socket.emit("player-action", { action, roomId });
  }

}
