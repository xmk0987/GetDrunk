import { useEffect, useState } from "react";
import { useSocket } from "../Providers/SocketContext";
import { Player, RoomData } from "../utils/types/types";
import { FuckTheDealerLogic } from "../utils/gameLogics/fuckTheDealerLogic";

export const useGameSocket = (initialGameLogic: FuckTheDealerLogic) => {
  const { socket } = useSocket();

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [gameState, setGameState] = useState<string>(() => {
    return sessionStorage.getItem("gameState") || "choose";
  });

  const [player, setPlayer] = useState<any>(() => {
    return sessionStorage.getItem("player") || "";
  });
  const [roomId, setRoomId] = useState<string | null>(() => {
    return sessionStorage.getItem("roomId") || null;
  });
  const [roomInfo, setRoomInfo] = useState<RoomData | null>(() => {
    const savedRoomInfo = sessionStorage.getItem("roomInfo");
    return savedRoomInfo ? JSON.parse(savedRoomInfo) : null;
  });

  const [gameLogic] = useState<FuckTheDealerLogic>(initialGameLogic);

  // Save state to local storage when it changes
  useEffect(() => {
    sessionStorage.setItem("gameState", gameState);
  }, [gameState]);

  useEffect(() => {
    sessionStorage.setItem("player", player);
  }, [player]);

  useEffect(() => {
    if (roomId !== null) {
      sessionStorage.setItem("roomId", roomId);
    } else {
      sessionStorage.removeItem("roomId");
    }
  }, [roomId]);

  useEffect(() => {
    if (roomInfo !== null) {
      sessionStorage.setItem("roomInfo", JSON.stringify(roomInfo));
    } else {
      sessionStorage.removeItem("roomInfo");
    }
  }, [roomInfo]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log(`You connected with id: ${socket.id}`);
      });

      socket.on("room-created", (data) => {
        console.log("Room created, received information", data);
        const { roomId, player, roomData } = data;
        setRoomId(roomId);
        setPlayer(player);
        setRoomInfo(roomData);
        setLoading(false);
        setGameState("lobby");
      });

      socket.on("room-joined", (data) => {
        console.log("Room joined, received information", data);
        const { roomId, player, roomData } = data;
        setRoomId(roomId);
        setPlayer(player);
        setRoomInfo(roomData);
        setLoading(false);
        setGameState("lobby");
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
        gameLogic.initializeGame(data);
        setGameState("game");
        setRoomInfo(data);
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
    if (roomId && socket) {
      gameLogic.startGame(socket, roomId);
    }
  };

  const handlePlayerAction = (action: string) => {
    if (roomId && socket) {
      gameLogic.handlePlayerAction(action, socket, roomId);
    }
  };

  return {
    message,
    error,
    loading,
    gameState,
    player,
    roomId,
    roomInfo,
    gameLogic, // Return the game logic instance
    setError,
    setLoading,
    startGame,
    handlePlayerAction,
  };
};
