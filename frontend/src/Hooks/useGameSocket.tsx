import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../Providers/SocketContext";
import { Player, RoomData } from "../utils/types/types";
import { FuckTheDealerLogic } from "../utils/gameLogics/fuckTheDealerLogic";

/**
 * Custom hook to manage the game socket and game state.
 * @param initialGameLogic - The initial game logic object.
 * @returns An object containing various game states and functions to manage the game.
 */
export const useGameSocket = (initialGameLogic: FuckTheDealerLogic) => {
  const { socket } = useSocket();

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [player, setPlayer] = useState<Player | null>(() => {
    const savedPlayer = sessionStorage.getItem("player");
    return savedPlayer ? JSON.parse(savedPlayer) : null;
  });

  const [roomInfo, setRoomInfo] = useState<RoomData | null>(() => {
    const savedRoomInfo = sessionStorage.getItem("roomInfo");
    return savedRoomInfo ? JSON.parse(savedRoomInfo) : null;
  });

  const [gameLogic] = useState<FuckTheDealerLogic>(initialGameLogic);

  // Save roomInfo to session storage whenever it changes
  useEffect(() => {
    if (roomInfo !== null) {
      sessionStorage.setItem("roomInfo", JSON.stringify(roomInfo));
    } else {
      sessionStorage.removeItem("roomInfo");
    }
  }, [roomInfo]);

  // Save player to session storage whenever it changes
  useEffect(() => {
    if (player !== null) {
      sessionStorage.setItem("player", JSON.stringify(player));
    } else {
      sessionStorage.removeItem("player");
    }
  }, [player]);

  // Set up socket event handlers
  useEffect(() => {
    if (!socket) return;

    /**
     * Handle socket connection.
     */
    const handleConnect = () => {
      console.log(`You connected with id: ${socket.id}`);
      const savedRoomInfo = sessionStorage.getItem("roomInfo");
      const savedPlayer = sessionStorage.getItem("player");
      if (savedRoomInfo && savedPlayer) {
        const roomInfo = JSON.parse(savedRoomInfo);
        const player = JSON.parse(savedPlayer);
        socket.emit("rejoin-room", { roomId: roomInfo.roomId, player });
      }
    };

    /**
     * Handle socket error.
     * @param message - The error message.
     */
    const handleError = (message: string) => {
      console.log("Error occurred", message);
      setLoading(false);
      setError(message);
    };

    /**
     * Handle room creation.
     * @param data - The room data.
     */
    const handleRoomCreated = (data: any) => {
      console.log("Room created, received information", data);
      const { roomData, player } = data;
      setRoomInfo(roomData);
      setPlayer(player);
      setLoading(false);
    };

    /**
     * Handle room joining.
     * @param data - The room data.
     */
    const handleRoomJoined = (data: any) => {
      console.log("Room joined, received information", data);
      const { roomData, player } = data;
      setRoomInfo(roomData);
      setPlayer(player);
      setLoading(false);
      if (roomData.game.status === "playing") {
        console.log("setting new game data to player");
        gameLogic.setGameData(roomData);
      }
    };

    /**
     * Handle new player joining.
     * @param player - The new player data.
     */
    const handleNewPlayer = (player: Player) => {
      console.log("New player joined", player.username);
      setRoomInfo((prevRoomInfo) => {
        if (!prevRoomInfo) return null;
        return {
          ...prevRoomInfo,
          players: [...prevRoomInfo.players, player],
        };
      });
    };

    /**
     * Handle game start.
     * @param data - The game data.
     */
    const handleGameStarted = (data: any) => {
      console.log("Game started with data:", data);
      setMessage("");
      gameLogic.setGameData(data);
      setRoomInfo(data);
    };

    /**
     * Handle next turn.
     * @param data - The turn data.
     */
    const handleNextTurn = (data: any) => {
      console.log("Next turn starting", data);
      const { message, gameData } = data;
      setRoomInfo(gameData);
      setMessage(message);
      gameLogic.setGameData(gameData);
    };

    /**
     * Handle guess again.
     * @param data - The guess data.
     */
    const handleGuessAgain = (data: any) => {
      console.log("Guess again", data);
      const { message, gameData } = data;
      setRoomInfo(gameData);
      setMessage(message);
      gameLogic.setGameData(gameData);
    };

    const handleRejoin = (data: any) => {
      console.log("Player rejoined");
      const { roomData } = data;
      setRoomInfo(roomData);
      if (roomData.game.status === "playing") {
        console.log("Game data changed");
        gameLogic.setGameData(roomData);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("error", handleError);
    socket.on("room-created", handleRoomCreated);
    socket.on("room-joined", handleRoomJoined);
    socket.on("new-player", handleNewPlayer);
    socket.on("game-started", handleGameStarted);
    socket.on("next-turn", handleNextTurn);
    socket.on("guess-again", handleGuessAgain);
    socket.on("player-rejoined", handleRejoin);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("error", handleError);
      socket.off("room-created", handleRoomCreated);
      socket.off("room-joined", handleRoomJoined);
      socket.off("new-player", handleNewPlayer);
      socket.off("game-started", handleGameStarted);
      socket.off("next-turn", handleNextTurn);
      socket.off("guess-again", handleGuessAgain);
    };
  }, [socket, gameLogic]);

  /**
   * Starts the game by emitting a start-game event.
   */
  const startGame = useCallback(() => {
    if (roomInfo?.roomId && socket) {
      gameLogic.startGame(socket, roomInfo.roomId);
    }
  }, [roomInfo, socket, gameLogic]);

  /**
   * Handles player actions by emitting appropriate events.
   * @param action - The action type.
   * @param data - Additional data for the action.
   */
  const handlePlayerAction = useCallback(
    (action: string, data?: any) => {
      if (roomInfo?.roomId && socket) {
        if (data !== undefined && data !== null) {
          gameLogic.handlePlayerAction(action, socket, roomInfo.roomId, data);
        } else {
          gameLogic.handlePlayerAction(action, socket, roomInfo.roomId);
        }
      }
    },
    [roomInfo, socket, gameLogic]
  );

  /**
   * Resets all game states and clears session storage.
   */
  const resetAll = () => {
    sessionStorage.removeItem("player");
    sessionStorage.removeItem("roomInfo");
    setPlayer(null);
    setRoomInfo(null);
    setMessage("");
    setError(null);
    setLoading(false);
    gameLogic.resetGame();
  };

  return {
    message,
    error,
    loading,
    gameLogic,
    roomInfo,
    player,
    resetAll,
    setError,
    setLoading,
    startGame,
    handlePlayerAction,
  };
};
