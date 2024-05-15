const { Server } = require("socket.io");
const { nanoid } = require("nanoid");

const socketData = {};
const socketIdToUsername = {}; // Map to keep track of socket IDs to usernames

function initializeSocket(server, options) {
  const io = new Server(server, options);

  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on("create-room", (data) => {
      const { game_name, username } = data;
      console.log("Trying to create room with username:", username);

      // Additional logic for room creation
      const roomId = nanoid(10);
      socket.join(roomId);

      const roomData = {
        game: {
          name: game_name,
          status: "not started",
        },
        players: [{ socketId: socket.id, username }],
        admin: username,
        roomStatus: "lobby",
      };

      socketData[roomId] = roomData;
      socketIdToUsername[socket.id] = username;
      socket.emit("room-created", { roomId, username, roomData });
    });

    socket.on("join-room", (data) => {
      const { username, roomId } = data;
      console.log("Trying to join room", roomId, "with username:", username);

      if (socketData[roomId]) {
        socket.join(roomId);
        socketData[roomId].players.push({ socketId: socket.id, username });
        socketIdToUsername[socket.id] = username;
        socket.emit("room-joined", {
          username,
          roomId,
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
        socket.to(roomId).emit("game-started");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const username = socketIdToUsername[socket.id];
      delete socketIdToUsername[socket.id];

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
