'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';

interface Player {
  id: string;
  name: string;
  balance: number;
  portfolio: { [symbol: string]: number };
  totalValue: number;
  rank: number;
  isConnected: boolean;
  lastAction?: string;
  profitLoss: number;
}

interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  gameMode: 'speed' | 'prediction' | 'classic' | 'volatility';
  status: 'waiting' | 'playing' | 'finished';
  currentRound: number;
  maxRounds: number;
  timeLeft: number;
  marketData: MarketData;
  leaderboard: Player[];
}

interface StockMetrics {
  price: number;
  previousClose: number;
  volume: number;
  marketCap: number;
  pe: number; // Price-to-Earnings ratio
  pb: number; // Price-to-Book ratio
  debtToEquity: number;
  roe: number; // Return on Equity
  revenue: number;
  profitMargin: number;
  beta: number;
  dividendYield: number;
  rsi: number; // Relative Strength Index
  sma20: number; // 20-day Simple Moving Average
  sma50: number; // 50-day Simple Moving Average
  volatility: number;
  trend: 'bull' | 'bear' | 'neutral';
  support: number;
  resistance: number;
}

interface MarketData {
  symbols: string[];
  stocks: { [symbol: string]: StockMetrics };
  marketVolatility: number;
  news: string[];
  economicIndicators: {
    inflation: number;
    interestRate: number;
    gdp: number;
    unemployment: number;
  };
}

interface GameState {
  currentRoom: GameRoom | null;
  playerId: string;
  playerName: string;
  gamePhase: 'lobby' | 'playing' | 'ended';
  isHost: boolean;
  showCreateRoom: boolean;
  showJoinRoom: boolean;
  availableRooms: GameRoom[];
}

const initialGameState: GameState = {
  currentRoom: null,
  playerId: '',
  playerName: '',
  gamePhase: 'lobby',
  isHost: false,
  showCreateRoom: false,
  showJoinRoom: false,
  availableRooms: []
};

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [roomNameInput, setRoomNameInput] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [selectedGameMode, setSelectedGameMode] = useState<'speed' | 'prediction' | 'classic' | 'volatility'>('classic');
  const gameTimerRef = useRef<number | null>(null);
  const syncTimerRef = useRef<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Generate unique player ID
  useEffect(() => {
    if (!gameState.playerId) {
      setGameState((prev: GameState) => ({
        ...prev,
        playerId: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
    }
  }, [gameState.playerId]);

  // Initialize Socket.IO connection
  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      const { io } = await import('socket.io-client');
      const base = process.env.NEXT_PUBLIC_MULTIPLAYER_ORIGIN || 'http://localhost:3002';
      const socket = io(base, { transports: ['websocket', 'polling'] });

      if (!mounted) return;
      socketRef.current = socket;
      
      // Handle room updates
      socket.on('roomUpdate', (room: GameRoom) => {
        setGameState(prev => ({
          ...prev,
          currentRoom: room,
          gamePhase: room.status === 'playing' ? 'playing' : 
                    room.status === 'finished' ? 'ended' : 'lobby'
        }));
      });
      
      // Handle connection events
      socket.on('connect', () => {
        console.log('Connected to multiplayer server');
      });
      
      socket.on('disconnect', () => {
        console.log('Disconnected from multiplayer server');
      });
    };

    connect();
    
    return () => {
      mounted = false;
      socketRef.current?.disconnect();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Join room via Socket.IO
  const joinRoomSocket = (roomId: string, playerName: string) => {
    if (socketRef.current) {
      socketRef.current.emit('joinRoom', {
        roomId,
        playerName,
        playerId: gameState.playerId
      });
    }
  };

  // Update player data via Socket.IO
  const updatePlayerSocket = (playerData: Partial<Player>) => {
    if (socketRef.current && gameState.currentRoom) {
      socketRef.current.emit('updatePlayer', {
        playerId: gameState.playerId,
        playerData
      });
    }
  };

  // Update room data via Socket.IO
  const updateRoomSocket = (roomData: Partial<GameRoom>) => {
    if (socketRef.current && gameState.currentRoom) {
      socketRef.current.emit('updateRoom', {
        roomId: gameState.currentRoom.id,
        roomData
      });
    }
  };

  // Generate realistic stock metrics
  const generateStockMetrics = (symbol: string): StockMetrics => {
    const basePrice = 50 + Math.random() * 200;
    const previousClose = basePrice * (0.95 + Math.random() * 0.1);
    const priceChange = basePrice - previousClose;
    const priceChangePercent = (priceChange / previousClose) * 100;
    
    // Generate realistic financial metrics
    const marketCap = basePrice * (1000000 + Math.random() * 9000000); // 1M to 10M shares
    const pe = 10 + Math.random() * 40; // PE ratio 10-50
    const pb = 0.5 + Math.random() * 5; // PB ratio 0.5-5.5
    const debtToEquity = Math.random() * 2; // 0-2
    const roe = -10 + Math.random() * 30; // ROE -10% to 20%
    const revenue = marketCap * (0.1 + Math.random() * 0.5); // Revenue as % of market cap
    const profitMargin = -5 + Math.random() * 25; // Profit margin -5% to 20%
    const beta = 0.5 + Math.random() * 1.5; // Beta 0.5-2.0
    const dividendYield = Math.random() * 5; // Dividend yield 0-5%
    
    // Technical indicators
    const rsi = 20 + Math.random() * 60; // RSI 20-80
    const sma20 = basePrice * (0.95 + Math.random() * 0.1);
    const sma50 = basePrice * (0.9 + Math.random() * 0.2);
    const volatility = 0.1 + Math.random() * 0.4; // 10-50% volatility
    
    // Determine trend based on technical analysis
    let trend: 'bull' | 'bear' | 'neutral' = 'neutral';
    if (basePrice > sma20 && sma20 > sma50 && rsi > 50) {
      trend = 'bull';
    } else if (basePrice < sma20 && sma20 < sma50 && rsi < 50) {
      trend = 'bear';
    }
    
    // Support and resistance levels
    const support = basePrice * (0.85 + Math.random() * 0.1);
    const resistance = basePrice * (1.05 + Math.random() * 0.1);
    
    return {
      price: basePrice,
      previousClose,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap,
      pe,
      pb,
      debtToEquity,
      roe,
      revenue,
      profitMargin,
      beta,
      dividendYield,
      rsi,
      sma20,
      sma50,
      volatility,
      trend,
      support,
      resistance
    };
  };

  // Generate market data
  const generateMarketData = (): MarketData => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];
    const stocks: { [symbol: string]: StockMetrics } = {};
    
    symbols.forEach(symbol => {
      stocks[symbol] = generateStockMetrics(symbol);
    });

    const news = [
      'Tech stocks rally on AI breakthrough news - NVDA, META leading gains',
      'Federal Reserve hints at rate cuts - Financial sector mixed',
      'Earnings season shows mixed results - TSLA beats, NFLX misses',
      'Market volatility increases amid uncertainty - Defensive stocks favored',
      'Crypto market shows signs of recovery - Tech stocks benefit',
      'Energy sector faces headwinds - Oil prices decline',
      'Inflation data shows cooling trend - Growth stocks rally',
      'Unemployment rate drops to 3.5% - Consumer stocks gain'
    ];

    return {
      symbols,
      stocks,
      marketVolatility: 0.15 + Math.random() * 0.25,
      news: [news[Math.floor(Math.random() * news.length)]],
      economicIndicators: {
        inflation: 2.5 + Math.random() * 2, // 2.5-4.5%
        interestRate: 4.5 + Math.random() * 1.5, // 4.5-6%
        gdp: 1.5 + Math.random() * 3, // 1.5-4.5%
        unemployment: 3.5 + Math.random() * 2 // 3.5-5.5%
      }
    };
  };

  // Create a new game room
  const createRoom = () => {
    if (!playerNameInput.trim()) return;

    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Join room via Socket.IO
    joinRoomSocket(roomId, playerNameInput.trim());

    setGameState((prev: GameState) => ({
      ...prev,
      playerName: playerNameInput.trim(),
      gamePhase: 'lobby',
      isHost: true,
      showCreateRoom: false
    }));
  };

  // Resolve room code to full room ID
  const resolveRoomIdByCode = async (code: string): Promise<string | null> => {
    const base = process.env.NEXT_PUBLIC_MULTIPLAYER_ORIGIN || 'http://localhost:3002';
    try {
      const res = await fetch(`${base}/api/rooms`, { cache: 'no-store' });
      if (!res.ok) return null;
      const rooms: Array<{ id: string; name: string }> = await res.json();
      const normalized = code.trim().toUpperCase();
      const match = rooms.find(r => 
        r.id.slice(-6).toUpperCase() === normalized || 
        r.name.toUpperCase() === normalized
      );
      return match ? match.id : null;
    } catch {
      return null;
    }
  };

  // Join an existing room
  const joinRoom = async (codeOrId: string) => {
    if (!playerNameInput.trim()) return;

    let targetId = codeOrId.trim();
    if (targetId.length <= 8) { // Assuming short codes are 8 chars or less
      const resolved = await resolveRoomIdByCode(targetId);
      if (!resolved) {
        alert('Room not found. Please check the room code.');
        return;
      }
      targetId = resolved;
    }

    // Join room via Socket.IO
    joinRoomSocket(targetId, playerNameInput.trim());

    setGameState((prev: GameState) => ({
      ...prev,
      playerName: playerNameInput.trim(),
      gamePhase: 'lobby',
      isHost: false,
      showJoinRoom: false
    }));
  };

  // Generate mock players for demonstration
  const generateMockPlayers = (): Player[] => {
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
    return names.slice(0, Math.floor(Math.random() * 4) + 2).map((name, index) => ({
      id: `player_${index}`,
      name,
      balance: 10000 - (index * 500),
      portfolio: {},
      totalValue: 10000 - (index * 500),
      rank: index + 2,
      isConnected: true,
      profitLoss: -(index * 500)
    }));
  };

  // Add AI players for solo mode
  const addAIPlayers = () => {
    if (!gameState.currentRoom) return;

    const aiPlayers: Player[] = [
      {
        id: 'ai_alice',
        name: 'Alice (AI)',
        balance: 10000,
        portfolio: {},
        totalValue: 10000,
        rank: 2,
        isConnected: true,
        profitLoss: 0
      },
      {
        id: 'ai_bob',
        name: 'Bob (AI)',
        balance: 10000,
        portfolio: {},
        totalValue: 10000,
        rank: 3,
        isConnected: true,
        profitLoss: 0
      }
    ];

    const updatedPlayers = [...gameState.currentRoom.players, ...aiPlayers];
    const updatedRoom = {
      ...gameState.currentRoom,
      players: updatedPlayers,
      leaderboard: updatedPlayers
    };

    setGameState((prev: GameState) => ({
      ...prev,
      currentRoom: updatedRoom
    }));
  };

  // Start the game
  const startGame = () => {
    if (!gameState.currentRoom || !gameState.isHost) return;

    // Add AI players if playing solo
    if (gameState.currentRoom.players.length === 1) {
      addAIPlayers();
    }

    const updatedRoom = {
      ...gameState.currentRoom,
      status: 'playing' as const,
      currentRound: 1,
      timeLeft: 30, // 30 seconds per round
      marketData: generateMarketData()
    };

    // Update room via Socket.IO
    updateRoomSocket(updatedRoom);

    setGameState((prev: GameState) => ({
      ...prev,
      currentRoom: updatedRoom,
      gamePhase: 'playing'
    }));

    // Start game timer
    startGameTimer();
  };

  // AI trading logic with financial analysis
  const makeAITrade = (player: Player, marketData: MarketData) => {
    const symbols = marketData.symbols.slice(0, 4);
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const stock = marketData.stocks[randomSymbol];
    
    // AI decision making based on financial metrics
    let shouldBuy = false;
    let shouldSell = false;
    
    // Fundamental analysis
    const goodPE = stock.pe > 0 && stock.pe < 25; // Reasonable PE ratio
    const goodROE = stock.roe > 10; // Good return on equity
    const lowDebt = stock.debtToEquity < 1; // Low debt
    const goodMargin = stock.profitMargin > 5; // Profitable
    
    // Technical analysis
    const bullishTrend = stock.trend === 'bull';
    const oversold = stock.rsi < 30; // Oversold condition
    const aboveSMA = stock.price > stock.sma20; // Above moving average
    const nearSupport = stock.price <= stock.support * 1.05; // Near support level
    
    // AI decision logic
    if (goodPE && goodROE && lowDebt && (bullishTrend || oversold || nearSupport)) {
      shouldBuy = Math.random() > 0.2; // 80% chance to buy good fundamentals
    } else if (stock.trend === 'bear' || stock.rsi > 70) {
      shouldSell = Math.random() > 0.3; // 70% chance to sell in bearish conditions
    }
    
    if (shouldBuy && player.balance >= stock.price) {
      const quantity = Math.floor(Math.random() * 3) + 1;
      const cost = stock.price * quantity;
      if (player.balance >= cost) {
        player.balance -= cost;
        player.portfolio[randomSymbol] = (player.portfolio[randomSymbol] || 0) + quantity;
        player.lastAction = `Bought ${quantity} ${randomSymbol} (PE:${stock.pe.toFixed(1)})`;
      }
    } else if (shouldSell && (player.portfolio[randomSymbol] || 0) > 0) {
      const quantity = Math.min(player.portfolio[randomSymbol] || 0, Math.floor(Math.random() * 2) + 1);
      const revenue = stock.price * quantity;
      player.balance += revenue;
      player.portfolio[randomSymbol] = (player.portfolio[randomSymbol] || 0) - quantity;
      player.lastAction = `Sold ${quantity} ${randomSymbol} (RSI:${stock.rsi.toFixed(0)})`;
    }
    
    // Update total value
    player.totalValue = player.balance;
    Object.entries(player.portfolio).forEach(([sym, qty]) => {
      player.totalValue += (qty as number) * marketData.stocks[sym].price;
    });
    player.profitLoss = player.totalValue - 10000;
  };

  // Game timer logic
  const startGameTimer = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);

    gameTimerRef.current = window.setInterval(() => {
      setGameState((prev: GameState) => {
        if (!prev.currentRoom || prev.currentRoom.status !== 'playing') return prev;

        const newTimeLeft = prev.currentRoom.timeLeft - 1;
        
        // Make AI trades every 5 seconds
        if (newTimeLeft % 5 === 0) {
          const updatedPlayers = prev.currentRoom.players.map(player => {
            if (player.id.startsWith('ai_')) {
              const aiPlayer = { ...player };
              makeAITrade(aiPlayer, prev.currentRoom!.marketData);
              return aiPlayer;
            }
            return player;
          });
          
          // Sort players by total value
          updatedPlayers.sort((a: Player, b: Player) => b.totalValue - a.totalValue);
          updatedPlayers.forEach((player: Player, index: number) => {
            player.rank = index + 1;
          });
          
          prev.currentRoom.players = updatedPlayers;
          prev.currentRoom.leaderboard = updatedPlayers;
        }
        
        if (newTimeLeft <= 0) {
          // Round ended, update market and move to next round
          const newRound = prev.currentRoom.currentRound + 1;
          const isGameOver = newRound > prev.currentRoom.maxRounds;
          
          const updatedRoom = {
            ...prev.currentRoom,
            currentRound: newRound,
            timeLeft: isGameOver ? 0 : 30,
            status: isGameOver ? 'finished' as const : 'playing' as const,
            marketData: generateMarketData()
          };

          // Update room via Socket.IO
          updateRoomSocket(updatedRoom);

          if (isGameOver) {
            clearInterval(gameTimerRef.current!);
            return {
              ...prev,
              currentRoom: updatedRoom,
              gamePhase: 'ended'
            };
          }

          return {
            ...prev,
            currentRoom: updatedRoom
          };
        }

        return {
          ...prev,
          currentRoom: {
            ...prev.currentRoom,
            timeLeft: newTimeLeft
          }
        };
      });
      }, 1000);
  };

  // Make a trade
  const makeTrade = (symbol: string, action: 'buy' | 'sell', quantity: number = 1) => {
    if (!gameState.currentRoom || gameState.currentRoom.status !== 'playing') return;

    const currentPlayer = gameState.currentRoom.players.find((p: Player) => p.id === gameState.playerId);
    if (!currentPlayer) return;

    const stock = gameState.currentRoom.marketData.stocks[symbol];
    const price = stock.price;
    const cost = price * quantity;

    const updatedPlayer = { ...currentPlayer };
    let actionMessage = '';

    if (action === 'buy' && currentPlayer.balance >= cost) {
      updatedPlayer.balance -= cost;
      updatedPlayer.portfolio[symbol] = (updatedPlayer.portfolio[symbol] || 0) + quantity;
      actionMessage = `Bought ${quantity} ${symbol} at $${price.toFixed(2)} (PE:${stock.pe.toFixed(1)})`;
    } else if (action === 'sell' && (updatedPlayer.portfolio[symbol] || 0) >= quantity) {
      updatedPlayer.balance += cost;
      updatedPlayer.portfolio[symbol] = (updatedPlayer.portfolio[symbol] || 0) - quantity;
      actionMessage = `Sold ${quantity} ${symbol} at $${price.toFixed(2)} (RSI:${stock.rsi.toFixed(0)})`;
    } else {
      return; // Invalid trade
    }

    // Update total value
    updatedPlayer.totalValue = updatedPlayer.balance;
    Object.entries(updatedPlayer.portfolio).forEach(([sym, qty]) => {
      updatedPlayer.totalValue += (qty as number) * gameState.currentRoom!.marketData.stocks[sym].price;
    });

    updatedPlayer.profitLoss = updatedPlayer.totalValue - 10000;
    updatedPlayer.lastAction = actionMessage;

    // Update room with new player data
    const updatedPlayers = gameState.currentRoom.players.map((p: Player) => 
      p.id === gameState.playerId ? updatedPlayer : p
    );

    // Sort players by total value for ranking
    updatedPlayers.sort((a: Player, b: Player) => b.totalValue - a.totalValue);
    updatedPlayers.forEach((player: Player, index: number) => {
      player.rank = index + 1;
    });

    // Update player via Socket.IO
    updatePlayerSocket(updatedPlayer);

    setGameState((prev: GameState) => ({
      ...prev,
      currentRoom: {
        ...prev.currentRoom!,
        players: updatedPlayers,
        leaderboard: updatedPlayers
      }
    }));
  };

  // Leave room
  const leaveRoom = () => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
    }
    
    // Disconnect from socket
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    setGameState(initialGameState);
  };

  // Get current player
  const getCurrentPlayer = (): Player | null => {
    if (!gameState.currentRoom) return null;
    return gameState.currentRoom.players.find((p: Player) => p.id === gameState.playerId) || null;
  };

  return (
    <div className="bg-neutral-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-05 mb-4">
            🚀 Multiplayer Trading Arena
          </h1>
          <p className="text-neutral-60 text-lg">
            Compete with friends in real-time trading battles!
          </p>
        </div>

        {/* Main Game Area */}
        {gameState.gamePhase === 'lobby' && !gameState.currentRoom && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Room */}
        <div className="bg-neutral-90 rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-neutral-05 mb-6">Create Game Room</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={playerNameInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-neutral-85 border border-neutral-70 rounded-xl text-neutral-05 focus:outline-none focus:ring-2 focus:ring-bright"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">Room Name</label>
                  <input
                    type="text"
                    value={roomNameInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomNameInput(e.target.value)}
                    placeholder="Enter room name (optional)"
                    className="w-full px-4 py-3 bg-neutral-85 border border-neutral-70 rounded-xl text-neutral-05 focus:outline-none focus:ring-2 focus:ring-bright"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">Game Mode</label>
                  <select
                    value={selectedGameMode}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGameMode(e.target.value as 'speed' | 'prediction' | 'classic' | 'volatility')}
                    className="w-full px-4 py-3 bg-neutral-85 border border-neutral-70 rounded-xl text-neutral-05 focus:outline-none focus:ring-2 focus:ring-bright"
                  >
                    <option value="classic">Classic Trading (8 rounds)</option>
                    <option value="speed">Speed Trading (10 rounds, 15s each)</option>
                    <option value="prediction">Prediction Markets (5 rounds)</option>
                    <option value="volatility">High Volatility (8 rounds)</option>
                  </select>
                </div>

              <button
                  onClick={createRoom}
                  disabled={!playerNameInput.trim()}
                  className="w-full bg-bright text-neutral-100 py-3 px-6 rounded-xl font-semibold hover:bg-bright-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Create Room
              </button>
              </div>
            </div>

            {/* Join Room */}
            <div className="bg-neutral-90 rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-neutral-05 mb-6">Join Game Room</h2>

              <div className="space-y-4">
            <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={playerNameInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-neutral-85 border border-neutral-70 rounded-xl text-neutral-05 focus:outline-none focus:ring-2 focus:ring-bright"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">Room Code</label>
                  <input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomCodeInput(e.target.value)}
                    placeholder="Enter room code"
                    className="w-full px-4 py-3 bg-neutral-85 border border-neutral-70 rounded-xl text-neutral-05 focus:outline-none focus:ring-2 focus:ring-bright"
                  />
                </div>

                <button
                  onClick={() => joinRoom(roomCodeInput)}
                  disabled={!playerNameInput.trim() || !roomCodeInput.trim()}
                  className="w-full bg-bright text-neutral-100 py-3 px-6 rounded-xl font-semibold hover:bg-bright-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Room
                </button>

                <div className="text-center">
                  <p className="text-neutral-60 text-sm mb-2">Or try a demo room:</p>
                  <button
                    onClick={() => joinRoom('DEMO123')}
                    className="text-bright hover:text-bright-light font-medium"
                  >
                    Join Demo Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room Lobby */}
        {gameState.currentRoom && gameState.gamePhase === 'lobby' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Room Info */}
            <div className="lg:col-span-2">
              <div className="bg-neutral-90 rounded-2xl shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-05">{gameState.currentRoom.name}</h2>
                    <p className="text-neutral-60">Room Code: {gameState.currentRoom.id.slice(-6).toUpperCase()}</p>
                  </div>
                  <button
                    onClick={leaveRoom}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Leave Room
                  </button>
                </div>

                {/* Players List */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-neutral-05 mb-4">Players ({gameState.currentRoom.players.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {gameState.currentRoom.players.map((player: Player) => (
                      <div
                        key={player.id}
                        className={`p-3 rounded-lg border-2 ${
                          player.id === gameState.playerId
                            ? 'border-bright bg-bright/10'
                            : 'border-neutral-70 bg-neutral-85'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              player.isConnected ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span className="font-medium text-neutral-05">{player.name}</span>
                            {player.id === gameState.playerId && (
                              <span className="text-xs bg-bright text-neutral-100 px-2 py-1 rounded">You</span>
                            )}
                          </div>
                          <span className="text-sm text-neutral-60">#{player.rank}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Game Settings */}
                <div className="bg-neutral-85 rounded-xl p-4">
                  <h4 className="font-semibold text-neutral-05 mb-2">Game Settings</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-neutral-60">
                    <div>Mode: <span className="text-neutral-05 font-medium">{gameState.currentRoom.gameMode}</span></div>
                    <div>Rounds: <span className="text-neutral-05 font-medium">{gameState.currentRoom.maxRounds}</span></div>
                    <div>Starting Balance: <span className="text-neutral-05 font-medium">$10,000</span></div>
                    <div>Players: <span className="text-neutral-05 font-medium">{gameState.currentRoom.players.length}</span></div>
                  </div>
                </div>

                {/* Add AI Players Button */}
                {gameState.isHost && gameState.currentRoom.players.length === 1 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={addAIPlayers}
                      className="bg-neutral-70 text-neutral-05 px-6 py-2 rounded-lg font-medium hover:bg-neutral-60 transition-colors duration-200"
                    >
                      Add AI Players for Competition
                    </button>
                  </div>
                )}

                {/* Start Game Button (Host Only) */}
                {gameState.isHost && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={startGame}
                      className="bg-bright text-neutral-100 px-8 py-3 rounded-xl font-semibold hover:bg-bright-light transition-colors duration-200"
                    >
                      Start Game ({gameState.currentRoom.players.length} player{gameState.currentRoom.players.length !== 1 ? 's' : ''})
                    </button>
                    <p className="text-neutral-60 text-sm mt-2">
                      {gameState.currentRoom.players.length === 1 
                        ? "Playing solo mode - you can still trade and compete against the market!"
                        : "Ready to compete with other players!"
                      }
                    </p>
                  </div>
                )}
              </div>
                    </div>

            {/* Quick Stats */}
            <div>
              <div className="bg-neutral-90 rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-neutral-05 mb-4">Your Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-60">Balance:</span>
                    <span className="text-neutral-05 font-medium">$10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-60">Rank:</span>
                    <span className="text-neutral-05 font-medium">#{getCurrentPlayer()?.rank || 1}</span>
                    </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-60">P&L:</span>
                    <span className="text-neutral-05 font-medium">$0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Game */}
        {gameState.currentRoom && gameState.gamePhase === 'playing' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Trading Area */}
            <div className="lg:col-span-3">
              <div className="bg-neutral-90 rounded-2xl shadow-md p-6">
                {/* Game Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-05">{gameState.currentRoom.name}</h2>
                    <p className="text-neutral-60">Round {gameState.currentRoom.currentRound} of {gameState.currentRoom.maxRounds}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-bright">{gameState.currentRoom.timeLeft}s</div>
                    <div className="text-sm text-neutral-60">Time Left</div>
                  </div>
                </div>

                {/* Market Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {gameState.currentRoom.marketData.symbols.slice(0, 4).map((symbol: string) => {
                    const stock = gameState.currentRoom!.marketData.stocks[symbol];
                    const currentPlayer = getCurrentPlayer();
                    const owned = currentPlayer?.portfolio[symbol] || 0;
                    const priceChange = stock.price - stock.previousClose;
                    const priceChangePercent = (priceChange / stock.previousClose) * 100;
                    
                    return (
                      <div key={symbol} className="bg-neutral-85 rounded-xl p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="font-bold text-neutral-05 text-xl">{symbol}</span>
                            <div className="text-2xl font-bold text-neutral-05">${stock.price.toFixed(2)}</div>
                            <div className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(1)}%)
                            </div>
                          </div>
                          <div className={`text-sm px-3 py-1 rounded-full ${
                            stock.trend === 'bull' ? 'bg-green-900 text-green-300' :
                            stock.trend === 'bear' ? 'bg-red-900 text-red-300' :
                            'bg-neutral-80 text-neutral-40'
                          }`}>
                            {stock.trend === 'bull' ? '📈 Bull' : stock.trend === 'bear' ? '📉 Bear' : '➡️ Neutral'}
                          </div>
                        </div>

                        {/* Financial Metrics */}
                        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                          <div className="bg-neutral-90 p-2 rounded">
                            <div className="text-neutral-60">P/E Ratio</div>
                            <div className="text-neutral-05 font-medium">{stock.pe.toFixed(1)}</div>
                          </div>
                          <div className="bg-neutral-90 p-2 rounded">
                            <div className="text-neutral-60">P/B Ratio</div>
                            <div className="text-neutral-05 font-medium">{stock.pb.toFixed(1)}</div>
                          </div>
                          <div className="bg-neutral-90 p-2 rounded">
                            <div className="text-neutral-60">ROE</div>
                            <div className="text-neutral-05 font-medium">{stock.roe.toFixed(1)}%</div>
                          </div>
                          <div className="bg-neutral-90 p-2 rounded">
                            <div className="text-neutral-60">Debt/Equity</div>
                            <div className="text-neutral-05 font-medium">{stock.debtToEquity.toFixed(1)}</div>
                          </div>
                          <div className="bg-neutral-90 p-2 rounded">
                            <div className="text-neutral-60">RSI</div>
                            <div className={`font-medium ${stock.rsi > 70 ? 'text-red-400' : stock.rsi < 30 ? 'text-green-400' : 'text-neutral-05'}`}>
                              {stock.rsi.toFixed(0)}
                            </div>
                          </div>
                          <div className="bg-neutral-90 p-2 rounded">
                            <div className="text-neutral-60">Beta</div>
                            <div className="text-neutral-05 font-medium">{stock.beta.toFixed(1)}</div>
                          </div>
                        </div>

                        {/* Technical Levels */}
                        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                          <div className="bg-neutral-90 p-2 rounded">
                            <div className="text-neutral-60">Support</div>
                            <div className="text-green-400 font-medium">${stock.support.toFixed(2)}</div>
                          </div>
                          <div className="bg-neutral-90 p-2 rounded">
                            <div className="text-neutral-60">Resistance</div>
                            <div className="text-red-400 font-medium">${stock.resistance.toFixed(2)}</div>
                          </div>
                        </div>

                        {/* Trading Section */}
                        <div className="border-t border-neutral-70 pt-4">
                          <div className="text-sm text-neutral-60 mb-2">Owned: {owned} shares</div>
                          <div className="grid grid-cols-2 gap-2">
                <button
                              onClick={() => makeTrade(symbol, 'buy')}
                              disabled={!getCurrentPlayer() || getCurrentPlayer()!.balance < stock.price}
                              className="bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy
                </button>
                <button
                              onClick={() => makeTrade(symbol, 'sell')}
                              disabled={!getCurrentPlayer() || owned === 0}
                              className="bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sell
                </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Economic Indicators */}
                <div className="bg-neutral-85 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-neutral-05 mb-3">📊 Economic Indicators</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-neutral-60">Inflation</div>
                      <div className="text-neutral-05 font-medium">{gameState.currentRoom.marketData.economicIndicators.inflation.toFixed(1)}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-neutral-60">Interest Rate</div>
                      <div className="text-neutral-05 font-medium">{gameState.currentRoom.marketData.economicIndicators.interestRate.toFixed(1)}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-neutral-60">GDP Growth</div>
                      <div className="text-neutral-05 font-medium">{gameState.currentRoom.marketData.economicIndicators.gdp.toFixed(1)}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-neutral-60">Unemployment</div>
                      <div className="text-neutral-05 font-medium">{gameState.currentRoom.marketData.economicIndicators.unemployment.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                {/* Market News */}
                <div className="bg-neutral-85 rounded-xl p-4">
                  <h4 className="font-semibold text-neutral-05 mb-2">📰 Market News</h4>
                  <p className="text-neutral-60 text-sm">{gameState.currentRoom.marketData.news[0]}</p>
                </div>
              </div>
              </div>

            {/* Leaderboard */}
            <div>
              <div className="bg-neutral-90 rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-neutral-05 mb-4">🏆 Leaderboard</h3>
                <div className="space-y-3">
                  {gameState.currentRoom.leaderboard.slice(0, 8).map((player: Player, index: number) => (
                    <div
                      key={player.id}
                      className={`p-3 rounded-lg ${
                        player.id === gameState.playerId
                          ? 'bg-bright/20 border-2 border-bright'
                          : 'bg-neutral-85'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-neutral-60">#{index + 1}</span>
                          <span className="text-sm font-medium text-neutral-05 truncate">
                            {player.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-neutral-05">
                            ${player.totalValue.toFixed(0)}
                          </div>
                          <div className={`text-xs ${
                            player.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {player.profitLoss >= 0 ? '+' : ''}${player.profitLoss.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          )}

        {/* Game Over */}
        {gameState.currentRoom && gameState.gamePhase === 'ended' && (
            <div className="text-center">
            <div className="bg-neutral-90 rounded-2xl shadow-md p-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-neutral-05 mb-6">🎉 Game Over!</h2>
              
              {/* Final Leaderboard */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-neutral-05 mb-4">Final Results</h3>
                <div className="space-y-3">
                  {gameState.currentRoom.leaderboard.slice(0, 5).map((player: Player, index: number) => (
                    <div
                      key={player.id}
                      className={`p-4 rounded-lg ${
                        player.id === gameState.playerId
                          ? 'bg-bright/20 border-2 border-bright'
                          : 'bg-neutral-85'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-neutral-60">#{index + 1}</span>
                          <span className="text-lg font-medium text-neutral-05">{player.name}</span>
                          {index === 0 && <span className="text-yellow-500">👑</span>}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-neutral-05">
                            ${player.totalValue.toFixed(0)}
                          </div>
                          <div className={`text-sm ${
                            player.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {player.profitLoss >= 0 ? '+' : ''}${player.profitLoss.toFixed(0)}
                          </div>
                        </div>
                      </div>
                </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={leaveRoom}
                  className="bg-bright text-neutral-100 px-6 py-3 rounded-xl font-semibold hover:bg-bright-light transition-colors duration-200"
                >
                  Back to Lobby
                </button>
                {gameState.isHost && (
              <button
                    onClick={startGame}
                    className="bg-neutral-70 text-neutral-05 px-6 py-3 rounded-xl font-semibold hover:bg-neutral-60 transition-colors duration-200"
              >
                Play Again
              </button>
                )}
                  </div>
              </div>
            </div>
          )}

        {/* Game Instructions */}
        <div className="mt-8 bg-neutral-90 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-neutral-05 mb-4">🎮 How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-neutral-60">
            <div>
              <h4 className="font-semibold text-neutral-10 mb-2">Game Modes:</h4>
              <ul className="space-y-1">
                <li>• <strong>Classic:</strong> 8 rounds, 30s each</li>
                <li>• <strong>Speed:</strong> 10 rounds, 15s each</li>
                <li>• <strong>Prediction:</strong> 5 rounds, market predictions</li>
                <li>• <strong>Volatility:</strong> 8 rounds, high volatility</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-10 mb-2">Financial Metrics:</h4>
              <ul className="space-y-1">
                <li>• <strong>P/E Ratio:</strong> Lower is often better (10-25 ideal)</li>
                <li>• <strong>ROE:</strong> Higher return on equity (10%+ good)</li>
                <li>• <strong>RSI:</strong> &lt;30 oversold, &gt;70 overbought</li>
                <li>• <strong>Debt/Equity:</strong> Lower is safer (&lt;1 ideal)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-10 mb-2">Technical Analysis:</h4>
              <ul className="space-y-1">
                <li>• <strong>Support/Resistance:</strong> Key price levels</li>
                <li>• <strong>Trend:</strong> Bull/Bear/Neutral indicators</li>
                <li>• <strong>Beta:</strong> Volatility vs market (1.0 = market avg)</li>
                <li>• <strong>Moving Averages:</strong> Price momentum</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-10 mb-2">Strategy Tips:</h4>
              <ul className="space-y-1">
                <li>• Analyze fundamentals first</li>
                <li>• Use technical indicators</li>
                <li>• Watch economic indicators</li>
                <li>• Diversify your portfolio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
