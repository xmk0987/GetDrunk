const express = require("express"); // Import Express.js framework
const cors = require("cors"); // Import CORS middleware
const http = require("http"); // Import HTTP module to create server
const dotenv = require("dotenv"); // Import dotenv to handle environment variables

// Load environment variables from .env file
dotenv.config();

// Define the port to run the server, defaulting to 8888 if not set in environment variables
const PORT = process.env.PORT || 8888;

// Define CORS options for the server
const corsOptions = {
  origin: process.env.ORIGIN, // Allow requests only from the specified origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers in requests
  credentials: true, // Allow cookies to be sent with requests
  transports: ["websocket"], // Allow WebSocket transport for real-time communication
};

// Create an instance of an Express application
const app = express();

// Use CORS middleware with the specified options
app.use(cors(corsOptions));
// Use middleware to parse JSON request bodies
app.use(express.json());

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Import and initialize socket.io for real-time communication
const initializeSocket = require("./sockets/socket");
initializeSocket(server, {
  cors: {
    origin: process.env.ORIGIN, // Allow requests only from the specified origin
    methods: ["GET", "POST"], // Allow these HTTP methods
  },
});

// Middleware to set CORS headers for responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === process.env.ORIGIN) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
