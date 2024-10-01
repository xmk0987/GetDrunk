const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8888;

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [process.env.ORIGIN, `${process.env.ORIGIN}/`]; // Check both with and without trailing slash
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  transports: ["websocket"],
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);

const initializeSocket = require("./sockets/socket");
initializeSocket(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Additional middleware to handle CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === process.env.ORIGIN || origin === `${process.env.ORIGIN}/`) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
