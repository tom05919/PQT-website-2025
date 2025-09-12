'use client';

import React, { useState, useEffect, useRef } from 'react';

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

interface MarketData {
  symbols: string[];
  prices: { [symbol: string]: number };
  trends: { [symbol: string]: 'bull' | 'bear' | 'neutral' };
  volatility: number;
  news: string[];
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

  // Generate unique player ID
  useEffect(() => {
    if (!gameState.playerId) {
      setGameState((prev: GameState) => ({
        ...prev,
        playerId: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
    }
  }, [gameState.playerId]);

  // Generate market data
  const generateMarketData = (): MarketData => {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX'];
    const prices: { [symbol: string]: number } = {};
    const trends: { [symbol: string]: 'bull' | 'bear' | 'neutral' } = {};
    const news = [
      'Tech stocks rally on AI breakthrough news',
      'Federal Reserve hints at rate cuts',
      'Earnings season shows mixed results',
      'Market volatility increases amid uncertainty',
      'Crypto market shows signs of recovery',
      'Energy sector faces headwinds'
    ];

    symbols.forEach(symbol => {
      const basePrice = 50 + Math.random() * 200;
      prices[symbol] = basePrice;
      const trendRand = Math.random();
      trends[symbol] = trendRand < 0.4 ? 'bull' : trendRand < 0.7 ? 'bear' : 'neutral';
    });

    return {
      symbols,
      prices,
      trends,
      volatility: 0.1 + Math.random() * 0.3,
      news: [news[Math.floor(Math.random() * news.length)]]
    };
  };

  // Create a new game room
  const createRoom = () => {
    if (!playerNameInput.trim()) return;

    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newPlayer: Player = {
      id: gameState.playerId,
      name: playerNameInput.trim(),
      balance: 10000,
      portfolio: {},
      totalValue: 10000,
      rank: 1,
      isConnected: true,
      profitLoss: 0
    };

    const newRoom: GameRoom = {
      id: roomId,
      name: roomNameInput.trim() || `Room ${roomId.slice(-4)}`,
      players: [newPlayer],
      gameMode: selectedGameMode,
      status: 'waiting',
      currentRound: 0,
      maxRounds: selectedGameMode === 'speed' ? 10 : selectedGameMode === 'prediction' ? 5 : 8,
      timeLeft: 0,
      marketData: generateMarketData(),
      leaderboard: [newPlayer]
    };

    setGameState((prev: GameState) => ({
      ...prev,
      currentRoom: newRoom,
      playerName: playerNameInput.trim(),
      gamePhase: 'lobby',
      isHost: true,
      showCreateRoom: false
    }));
  };

  // Join an existing room
  const joinRoom = (roomId: string) => {
    if (!playerNameInput.trim()) return;

    const newPlayer: Player = {
      id: gameState.playerId,
      name: playerNameInput.trim(),
      balance: 10000,
      portfolio: {},
      totalValue: 10000,
      rank: 1,
      isConnected: true,
      profitLoss: 0
    };

    // Simulate joining a room (in real implementation, this would be a WebSocket call)
    const mockRoom: GameRoom = {
      id: roomId,
      name: `Room ${roomId.slice(-4)}`,
      players: [newPlayer, ...generateMockPlayers()],
      gameMode: 'classic',
      status: 'waiting',
      currentRound: 0,
      maxRounds: 8,
      timeLeft: 0,
      marketData: generateMarketData(),
      leaderboard: []
    };

    setGameState((prev: GameState) => ({
      ...prev,
      currentRoom: mockRoom,
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

  // Start the game
  const startGame = () => {
    if (!gameState.currentRoom || !gameState.isHost) return;

    const updatedRoom = {
      ...gameState.currentRoom,
      status: 'playing' as const,
      currentRound: 1,
      timeLeft: 30 // 30 seconds per round
    };

    setGameState((prev: GameState) => ({
      ...prev,
      currentRoom: updatedRoom,
      gamePhase: 'playing'
    }));

    // Start game timer
    startGameTimer();
  };

  // Game timer logic
  const startGameTimer = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);

    gameTimerRef.current = window.setInterval(() => {
      setGameState((prev: GameState) => {
        if (!prev.currentRoom || prev.currentRoom.status !== 'playing') return prev;

        const newTimeLeft = prev.currentRoom.timeLeft - 1;
        
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

    const price = gameState.currentRoom.marketData.prices[symbol];
    const cost = price * quantity;

    const updatedPlayer = { ...currentPlayer };
    let actionMessage = '';

    if (action === 'buy' && currentPlayer.balance >= cost) {
      updatedPlayer.balance -= cost;
      updatedPlayer.portfolio[symbol] = (updatedPlayer.portfolio[symbol] || 0) + quantity;
      actionMessage = `Bought ${quantity} ${symbol} at $${price.toFixed(2)}`;
    } else if (action === 'sell' && (updatedPlayer.portfolio[symbol] || 0) >= quantity) {
      updatedPlayer.balance += cost;
      updatedPlayer.portfolio[symbol] = (updatedPlayer.portfolio[symbol] || 0) - quantity;
      actionMessage = `Sold ${quantity} ${symbol} at $${price.toFixed(2)}`;
    } else {
      return; // Invalid trade
    }

    // Update total value
    updatedPlayer.totalValue = updatedPlayer.balance;
    Object.entries(updatedPlayer.portfolio).forEach(([sym, qty]) => {
      updatedPlayer.totalValue += (qty as number) * gameState.currentRoom!.marketData.prices[sym];
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

                {/* Start Game Button (Host Only) */}
                {gameState.isHost && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={startGame}
                      disabled={gameState.currentRoom.players.length < 2}
                      className="bg-bright text-neutral-100 px-8 py-3 rounded-xl font-semibold hover:bg-bright-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start Game ({gameState.currentRoom.players.length} players)
                    </button>
                    {gameState.currentRoom.players.length < 2 && (
                      <p className="text-neutral-60 text-sm mt-2">Need at least 2 players to start</p>
                    )}
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {gameState.currentRoom.marketData.symbols.slice(0, 4).map((symbol: string) => {
                    const price = gameState.currentRoom!.marketData.prices[symbol];
                    const trend = gameState.currentRoom!.marketData.trends[symbol];
                    const currentPlayer = getCurrentPlayer();
                    const owned = currentPlayer?.portfolio[symbol] || 0;
                    
                    return (
                      <div key={symbol} className="bg-neutral-85 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-neutral-05">{symbol}</span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            trend === 'bull' ? 'bg-green-900 text-green-300' :
                            trend === 'bear' ? 'bg-red-900 text-red-300' :
                            'bg-neutral-80 text-neutral-40'
                          }`}>
                            {trend === 'bull' ? '📈' : trend === 'bear' ? '📉' : '➡️'}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-neutral-05 mb-2">${price.toFixed(2)}</div>
                        <div className="text-sm text-neutral-60 mb-3">Owned: {owned}</div>
                        <div className="grid grid-cols-2 gap-2">
                <button
                            onClick={() => makeTrade(symbol, 'buy')}
                            disabled={!getCurrentPlayer() || getCurrentPlayer()!.balance < price}
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
                    );
                  })}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-neutral-60">
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
              <h4 className="font-semibold text-neutral-10 mb-2">Trading:</h4>
              <ul className="space-y-1">
                <li>• Start with $10,000</li>
                <li>• Buy/sell stocks in real-time</li>
                <li>• Watch market trends and news</li>
                <li>• Compete for the top spot!</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-10 mb-2">Strategy Tips:</h4>
              <ul className="space-y-1">
                <li>• Diversify your portfolio</li>
                <li>• Watch for market trends</li>
                <li>• Manage risk carefully</li>
                <li>• Learn from other players</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
