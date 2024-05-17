const { Server } = require("socket.io");
const { nanoid } = require("nanoid");
const FuckTheDealerLogic = require("../gamesLogic/FuckTheDealerLogic");

const socketData = {};
const socketIdToUsername = {};

function initializeSocket(server, options) {
  const io = new Server(server, options);

  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on("create-room", (data) => {
      const { game_name, username } = data;
      console.log("Trying to create room with username:", username);

      const roomId = nanoid(10);
      socket.join(roomId);

      const roomData = {
        game: {
          name: game_name,
          status: "lobby",
        },
        players: [{ socketId: socket.id, username }],
        admin: socket.id,
        roomId: roomId,
      };

      socketData[roomId] = roomData;
      socketIdToUsername[socket.id] = username;
      socket.emit("room-created", {
        roomData,
        player: { socketId: socket.id, username },
      });
    });

    socket.on("join-room", (data) => {
      const { username, roomId } = data;
      console.log("Trying to join room", roomId, "with username:", username);

      if (socketData[roomId] && socketData[roomId].game.status === "lobby") {
        socket.join(roomId);
        socketData[roomId].players.push({ socketId: socket.id, username });
        socketIdToUsername[socket.id] = username;
        socket.emit("room-joined", {
          player: { socketId: socket.id, username },
          roomData: socketData[roomId],
        });
        console.log("player added", socketData[roomId]);
        socket.to(roomId).emit("new-player", { socketId: socket.id, username });
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    socket.on("start-game", (roomId) => {
      if (socketData[roomId]) {
        console.log("starting game");
        switch (socketData[roomId].game.name) {
          case "fuckTheDealer":
            const ftdLogic = new FuckTheDealerLogic(io, roomId, socketData);
            ftdLogic.startGame();
            break;
          default:
            console.log(`Unknown game: ${socketData[roomId].game.name}`);
            break;
        }
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    socket.on("player-action", (data) => {
      const { action, roomId, ...extraData } = data; // Destructure action, roomId and extra data
      console.log("Ekstra data", extraData);
      if (socketData[roomId]) {
        console.log(`Action received: ${action} for room: ${roomId}`);
        switch (socketData[roomId].game.name) {
          case "fuckTheDealer":
            const ftdLogic = new FuckTheDealerLogic(io, roomId, socketData);
            ftdLogic.handlePlayerAction(action, extraData); // Pass extra data to the game logic
            break;
          default:
            console.log(`Unknown game: ${socketData[roomId].game.name}`);
            break;
        }
      } else {
        socket.emit("error", "Room does not exist");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const username = socketIdToUsername[socket.id];
      delete socketIdToUsername[socket.id];

      console.log(socketData);
      for (const roomId in socketData) {
        const room = socketData[roomId];
        const playerIndex = room.players.findIndex(
          (player) => player.socketId === socket.id
        );
        if (playerIndex !== -1) {
          room.players.splice(playerIndex, 1);
          socket.to(roomId).emit("player-left", username);

          if (room.players.length === 0) {
            delete socketData[roomId];
            console.log(`Room ${roomId} deleted because it is empty.`);
          }
          break;
        }
      }
    });
  });
}

module.exports = initializeSocket;
