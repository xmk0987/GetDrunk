import { useEffect, useState } from "react";
import { useSocket } from "../Providers/SocketContext";
import { Player, RoomData } from "../utils/types/types";
import { FuckTheDealerLogic } from "../utils/gameLogics/fuckTheDealerLogic";

export const useGameSocket = (initialGameLogic: FuckTheDealerLogic) => {
  const { socket } = useSocket();

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [player, setPlayer] = useState<any>(null);

  const [roomInfo, setRoomInfo] = useState<RoomData | null>(() => {
    const savedRoomInfo = sessionStorage.getItem("roomInfo");
    return savedRoomInfo ? JSON.parse(savedRoomInfo) : null;
  });

  const [gameLogic] = useState<FuckTheDealerLogic>(initialGameLogic);

  useEffect(() => {
    if (roomInfo !== null) {
      sessionStorage.setItem("roomInfo", JSON.stringify(roomInfo));
    } else {
      sessionStorage.removeItem("roomInfo");
    }
  }, [roomInfo]);

  useEffect(() => {
    if (player !== null) {
      sessionStorage.setItem("player", JSON.stringify(player));
    } else {
      sessionStorage.removeItem("player");
    }
  }, [player]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log(`You connected with id: ${socket.id}`);
      });

      socket.on("error", (message) => {
        console.log("error occured", message);
        setLoading(false);
        setError(message);
      });

      socket.on("room-created", (data) => {
        console.log("Room created, received information", data);
        const { roomData, player } = data;
        setRoomInfo(roomData);
        setPlayer(player);
        setLoading(false);
      });

      socket.on("room-joined", (data) => {
        console.log("Room joined, received information", data);
        const { roomData, player } = data;
        setPlayer(player);
        setRoomInfo(roomData);
        setLoading(false);
      });

      socket.on("new-player", (player: Player) => {
        console.log("new player joined", player.username);
        setRoomInfo((prevRoomInfo) => {
          if (!prevRoomInfo) {
            return null;
          }

          return {
            ...prevRoomInfo,
            players: [...prevRoomInfo.players, player],
          };
        });
      });

      socket.on("game-started", (data) => {
        console.log("Game started with data:", data);
        gameLogic.setGameData(data);
        setRoomInfo(data);
      });

      socket.on("next-turn", (data) => {
        console.log("Next turn starting");
        const { message, gameData } = data;
        console.log(message, gameData);
      });

      return () => {
        socket.off("connect");
        socket.off("room-created");
        socket.off("room-joined");
        socket.off("game-started");
        socket.off("new-player");
      };
    }
  }, [socket, gameLogic]);

  const startGame = () => {
    if (roomInfo?.roomId && socket) {
      gameLogic.startGame(socket, roomInfo.roomId);
    }
  };

  const handlePlayerAction = (action: string) => {
    if (roomInfo?.roomId && socket) {
      gameLogic.handlePlayerAction(action, socket, roomInfo.roomId);
    }
  };

  return {
    message,
    error,
    loading,
    gameLogic, // Return the game logic instance
    roomInfo,
    player,
    setError,
    setLoading,
    startGame,
    handlePlayerAction,
  };
};
