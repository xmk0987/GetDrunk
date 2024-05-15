import { useEffect, useState } from "react";
import { useSocket } from "../Providers/SocketContext";
import { Player, RoomData } from "../utils/types/types";

export const useGameSocket = (gameLogic: any) => {
  const { socket } = useSocket();

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [gameState, setGameState] = useState<string>("choose");

  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomData | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log(`You connected with id: ${socket.id}`);
      });

      socket.on("room-created", (data) => {
        console.log("Room created, received information", data);
        const { roomId, username, roomData } = data;
        setRoomId(roomId); // Use the received roomId as needed
        setUsername(username); // Use the received username as needed
        setRoomInfo(roomData);
        setLoading(false); // Stop loading state
        setGameState("lobby"); // Move to lobby state
      });

      socket.on("room-joined", (data) => {
        console.log("Room joined, received information", data);
        const { roomId, username, roomData } = data;
        setRoomId(roomId); // Use the received roomId as needed
        setUsername(username); // Use the received username as needed
        setRoomInfo(roomData);
        setLoading(false); // Stop loading state
        setGameState("lobby"); // Move to lobby state
      });

      socket.on("new-player", (player: Player) => {
        console.log("new player joined", player.username);
        setRoomInfo((prevRoomInfo) => {
          if (!prevRoomInfo) {
            return null; // or handle initializing a new RoomData object if needed
          }

          return {
            ...prevRoomInfo,
            players: [...prevRoomInfo.players, player],
          };
        });
      });

      socket.on("game-started", () => {
        setGameState("game");
      });

      return () => {
        socket.off("connect");
        socket.off("room-created");
        socket.off("room-joined");
        socket.off("game-started");
        socket.off("new-player");
      };
    }
  }, [socket]);

  const startGame = () => {
    socket?.emit("start-game", roomId);
    setGameState("game");
    gameLogic.startGame();
  };

  return {
    message,
    error,
    loading,
    gameState,
    username,
    roomId,
    roomInfo,
    setError,
    setLoading,
    startGame,
  };
};
