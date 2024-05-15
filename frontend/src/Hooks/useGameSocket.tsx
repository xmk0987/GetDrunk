import { useEffect, useState } from "react";
import { useSocket } from "../Providers/SocketContext";
import { Player, RoomData } from "../utils/types/types";

export const useGameSocket = (gameLogic: any) => {
  const { socket } = useSocket();

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [roomState, setRoomStatus] = useState<string>(() => {
    return sessionStorage.getItem("roomState") || "choose";
  });

  const [username, setUsername] = useState<string>(() => {
    return sessionStorage.getItem("username") || "";
  });
  const [roomId, setRoomId] = useState<string | null>(() => {
    return sessionStorage.getItem("roomId") || null;
  });
  const [roomInfo, setRoomInfo] = useState<RoomData | null>(() => {
    const savedRoomInfo = sessionStorage.getItem("roomInfo");
    return savedRoomInfo ? JSON.parse(savedRoomInfo) : null;
  });

  // Save state to local storage when it changes
  useEffect(() => {
    sessionStorage.setItem("roomState", roomState);
  }, [roomState]);

  useEffect(() => {
    sessionStorage.setItem("username", username);
  }, [username]);

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
        const { roomId, username, roomData } = data;
        setRoomId(roomId);
        setUsername(username);
        setRoomInfo(roomData);
        setLoading(false);
        setRoomStatus("lobby");
      });

      socket.on("room-joined", (data) => {
        console.log("Room joined, received information", data);
        const { roomId, username, roomData } = data;
        setRoomId(roomId);
        setUsername(username);
        setRoomInfo(roomData);
        setLoading(false);
        setRoomStatus("lobby");
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
        setRoomInfo(data);
        setRoomStatus(data.roomStatus);
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
    setRoomStatus("game");
    gameLogic.startGame();
  };

  return {
    message,
    error,
    loading,
    roomState,
    username,
    roomId,
    roomInfo,
    setError,
    setLoading,
    startGame,
  };
};
