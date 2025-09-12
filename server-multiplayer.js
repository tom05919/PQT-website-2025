const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for all origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create Socket.IO instance
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store game rooms and players
const gameRooms = new Map();
const players = new Map();

// Clean up inactive rooms and players
setInterval(() => {
  const now = Date.now();
  
  // Remove inactive players (not seen for 30 seconds)
  for (const [playerId, player] of players.entries()) {
    if (now - player.lastSeen > 30000) {
      players.delete(playerId);
      
      // Remove player from room
      if (player.roomId && gameRooms.has(player.roomId)) {
        const room = gameRooms.get(player.roomId);
        room.players = room.players.filter(p => p.id !== playerId);
        
        if (room.players.length === 0) {
          gameRooms.delete(player.roomId);
        } else {
          // Update room
          gameRooms.set(player.roomId, room);
          io.to(player.roomId).emit('roomUpdate', room);
        }
      }
    }
  }
  
  // Remove empty rooms
  for (const [roomId, room] of gameRooms.entries()) {
    if (room.players.length === 0) {
      gameRooms.delete(roomId);
    }
  }
}, 10000); // Clean up every 10 seconds

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Join room
  socket.on('joinRoom', (data) => {
    const { roomId, playerName, playerId } = data;
    
    // Create or get room
    if (!gameRooms.has(roomId)) {
      gameRooms.set(roomId, {
        id: roomId,
        name: `Room ${roomId.slice(-4)}`,
        players: [],
        gameMode: 'classic',
        status: 'waiting',
        currentRound: 0,
        maxRounds: 8,
        timeLeft: 0,
        marketData: null,
        leaderboard: []
      });
    }
    
    const room = gameRooms.get(roomId);
    
    // Create player
    const player = {
      id: playerId,
      name: playerName,
      balance: 10000,
      portfolio: {},
      totalValue: 10000,
      rank: 1,
      isConnected: true,
      profitLoss: 0,
      lastSeen: Date.now(),
      roomId: roomId,
      socketId: socket.id
    };
    
    // Add player to room if not already there
    const existingPlayerIndex = room.players.findIndex(p => p.id === playerId);
    if (existingPlayerIndex >= 0) {
      room.players[existingPlayerIndex] = player;
    } else {
      room.players.push(player);
    }
    
    // Update player data
    players.set(playerId, player);
    
    // Join socket room
    socket.join(roomId);
    
    // Update room
    gameRooms.set(roomId, room);
    
    // Send room update to all players in room
    io.to(roomId).emit('roomUpdate', room);
    
    console.log(`Player ${playerName} joined room ${roomId}`);
  });

  // Update player data
  socket.on('updatePlayer', (data) => {
    const { playerId, playerData } = data;
    
    if (players.has(playerId)) {
      const player = players.get(playerId);
      player.lastSeen = Date.now();
      
      // Update player data
      Object.assign(player, playerData);
      players.set(playerId, player);
      
      // Update room
      if (player.roomId && gameRooms.has(player.roomId)) {
        const room = gameRooms.get(player.roomId);
        const playerIndex = room.players.findIndex(p => p.id === playerId);
        
        if (playerIndex >= 0) {
          room.players[playerIndex] = player;
          
          // Sort players by total value
          room.players.sort((a, b) => b.totalValue - a.totalValue);
          room.players.forEach((p, index) => {
            p.rank = index + 1;
          });
          
          room.leaderboard = [...room.players];
          gameRooms.set(player.roomId, room);
          
          // Broadcast update to room
          io.to(player.roomId).emit('roomUpdate', room);
        }
      }
    }
  });

  // Update room state (game start, rounds, etc.)
  socket.on('updateRoom', (data) => {
    const { roomId, roomData } = data;
    
    if (gameRooms.has(roomId)) {
      const room = gameRooms.get(roomId);
      Object.assign(room, roomData);
      gameRooms.set(roomId, room);
      
      // Broadcast to all players in room
      io.to(roomId).emit('roomUpdate', room);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    // Find and mark player as disconnected
    for (const [playerId, player] of players.entries()) {
      if (player.socketId === socket.id) {
        player.isConnected = false;
        player.lastSeen = Date.now();
        
        // Update room
        if (player.roomId && gameRooms.has(player.roomId)) {
          const room = gameRooms.get(player.roomId);
          const playerIndex = room.players.findIndex(p => p.id === playerId);
          
          if (playerIndex >= 0) {
            room.players[playerIndex] = player;
            gameRooms.set(player.roomId, room);
            io.to(player.roomId).emit('roomUpdate', room);
          }
        }
        break;
      }
    }
  });
});

// API endpoints
app.get('/api/rooms', (req, res) => {
  const roomsList = Array.from(gameRooms.values()).map(room => ({
    id: room.id,
    name: room.name,
    playerCount: room.players.length,
    status: room.status,
    gameMode: room.gameMode
  }));
  res.json(roomsList);
});

app.get('/api/room/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  if (gameRooms.has(roomId)) {
    res.json(gameRooms.get(roomId));
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Multiplayer server running on port ${PORT}`);
  console.log(`Accessible at: http://localhost:${PORT}`);
  console.log(`Network access: http://[your-ip]:${PORT}`);
});
