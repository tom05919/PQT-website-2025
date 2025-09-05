'use client';

import { useState } from 'react';

interface GameState {
  balance: number;
  round: number;
  outcomeMessages: string[];
  gamePhase: 'start' | 'playing' | 'ended';
  currentPrice: number;
  position: 'none' | 'long' | 'short';
  shares: number;
}

const initialGameState: GameState = {
  balance: 1000,
  round: 1,
  outcomeMessages: [],
  gamePhase: 'start',
  currentPrice: 100,
  position: 'none',
  shares: 0
};

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [marketTrend, setMarketTrend] = useState<'bull' | 'bear' | 'neutral'>('neutral');

  // Generate random price movement
  const generatePriceMovement = () => {
    const trend = Math.random();
    let priceChange = 0;
    
    if (trend < 0.4) {
      // Bull market - 40% chance
      priceChange = (Math.random() * 0.15 + 0.05) * 100; // 5-20% increase
      setMarketTrend('bull');
    } else if (trend < 0.7) {
      // Bear market - 30% chance
      priceChange = -(Math.random() * 0.15 + 0.05) * 100; // 5-20% decrease
      setMarketTrend('bear');
    } else {
      // Neutral - 30% chance
      priceChange = (Math.random() - 0.5) * 0.1 * 100; // -5% to +5%
      setMarketTrend('neutral');
    }
    
    return Math.max(50, gameState.currentPrice + priceChange); // Minimum price of $50
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
      currentPrice: 100,
      balance: 1000,
      round: 1,
      outcomeMessages: [],
      position: 'none',
      shares: 0
    }));
  };

  const makeTrade = (action: 'buy' | 'sell' | 'hold') => {
    if (gameState.gamePhase !== 'playing') return;

    const newPrice = generatePriceMovement();
    let newBalance = gameState.balance;
    let newShares = gameState.shares;
    let newPosition = gameState.position;
    let message = '';

    switch (action) {
      case 'buy':
        if (gameState.balance >= newPrice) {
          newShares = Math.floor(gameState.balance / newPrice);
          newBalance = gameState.balance - (newShares * newPrice);
          newPosition = 'long';
          message = `Bought ${newShares} shares at $${newPrice.toFixed(2)}`;
        } else {
          message = 'Insufficient funds to buy shares';
        }
        break;
      case 'sell':
        if (gameState.shares > 0) {
          newBalance = gameState.balance + (gameState.shares * newPrice);
          message = `Sold ${gameState.shares} shares at $${newPrice.toFixed(2)}`;
          newShares = 0;
          newPosition = 'none';
        } else {
          message = 'No shares to sell';
        }
        break;
      case 'hold':
        message = 'Held position - no action taken';
        break;
    }

    // Calculate profit/loss for the round
    const totalValue = newBalance + (newShares * newPrice);
    const previousValue = gameState.balance + (gameState.shares * gameState.currentPrice);
    const profitLoss = totalValue - previousValue;

    if (profitLoss > 0) {
      message += ` | +$${profitLoss.toFixed(2)} profit`;
    } else if (profitLoss < 0) {
      message += ` | -$${Math.abs(profitLoss).toFixed(2)} loss`;
    }

    const newOutcomeMessages = [...gameState.outcomeMessages, message];
    
    setGameState(prev => ({
      ...prev,
      balance: newBalance,
      shares: newShares,
      position: newPosition,
      currentPrice: newPrice,
      outcomeMessages: newOutcomeMessages,
      round: prev.round + 1
    }));

    // Check if game is over
    if (gameState.round >= 5) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          gamePhase: 'ended'
        }));
      }, 1000);
    }
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  const getFinalBalance = () => {
    return gameState.balance + (gameState.shares * gameState.currentPrice);
  };

  const getPerformanceMessage = () => {
    const finalBalance = getFinalBalance();
    const profit = finalBalance - 1000;
    const percentage = (profit / 1000) * 100;

    if (percentage > 20) return { message: "Outstanding! You're a trading genius!", color: "text-bright" };
    if (percentage > 10) return { message: "Great job! You're on the right track!", color: "text-bright" };
    if (percentage > 0) return { message: "Good work! You made a profit!", color: "text-neutral-10" };
    if (percentage > -10) return { message: "Not bad, but there's room for improvement.", color: "text-neutral-60" };
    return { message: "Keep learning! Trading takes practice.", color: "text-neutral-60" };
  };

  return (
    <div className="bg-neutral-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-05 mb-4">
            Interactive Trading Game
          </h1>
          <p className="text-neutral-60 text-lg">
            Test your trading skills with 5 rounds of market simulation
          </p>
        </div>

        {/* Game Panel */}
        <div className="bg-neutral-90 rounded-2xl shadow-md p-8">
          {gameState.gamePhase === 'start' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-05 mb-4">Ready to Trade?</h2>
              <p className="text-neutral-60 mb-6">
                Start with $1,000 and make trading decisions over 5 rounds. 
                Try to maximize your profit!
              </p>
              <button
                onClick={startGame}
                className="bg-bright text-neutral-100 px-8 py-3 rounded-full font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
              >
                Start Trading
              </button>
            </div>
          )}

          {gameState.gamePhase === 'playing' && (
            <div>
              {/* Game Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-neutral-85 rounded-xl p-4 text-center">
                  <div className="text-sm text-neutral-60 mb-1">Balance</div>
                  <div className="text-2xl font-bold text-bright">${gameState.balance.toFixed(2)}</div>
                </div>
                <div className="bg-neutral-85 rounded-xl p-4 text-center">
                  <div className="text-sm text-neutral-60 mb-1">Current Price</div>
                  <div className="text-2xl font-bold text-neutral-05">${gameState.currentPrice.toFixed(2)}</div>
                </div>
                <div className="bg-neutral-85 rounded-xl p-4 text-center">
                  <div className="text-sm text-neutral-60 mb-1">Round</div>
                  <div className="text-2xl font-bold text-bright">{gameState.round}/5</div>
                </div>
              </div>

              {/* Position Info */}
              <div className="bg-neutral-85 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-neutral-60">Position</div>
                    <div className="text-lg font-semibold text-neutral-05">
                      {gameState.position === 'long' ? `${gameState.shares} shares (Long)` : 'No Position'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neutral-60">Total Value</div>
                    <div className="text-lg font-semibold text-neutral-05">
                      ${(gameState.balance + (gameState.shares * gameState.currentPrice)).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trading Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={() => makeTrade('buy')}
                  className="bg-bright text-neutral-100 py-3 px-6 rounded-xl font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
                >
                  Buy
                </button>
                <button
                  onClick={() => makeTrade('sell')}
                  className="bg-bright text-neutral-100 py-3 px-6 rounded-xl font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
                >
                  Sell
                </button>
                <button
                  onClick={() => makeTrade('hold')}
                  className="bg-bright text-neutral-100 py-3 px-6 rounded-xl font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
                >
                  Hold
                </button>
              </div>

              {/* Market Trend Indicator */}
              <div className="text-center mb-6">
                <div className="text-sm text-neutral-60 mb-2">Market Trend</div>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  marketTrend === 'bull' ? 'bg-green-900 text-green-300' :
                  marketTrend === 'bear' ? 'bg-red-900 text-red-300' :
                  'bg-neutral-80 text-neutral-40'
                }`}>
                  {marketTrend === 'bull' ? '📈 Bull Market' :
                   marketTrend === 'bear' ? '📉 Bear Market' :
                   '➡️ Neutral Market'}
                </div>
              </div>
            </div>
          )}

          {gameState.gamePhase === 'ended' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-neutral-05 mb-6">Game Over!</h2>
              <div className="bg-neutral-85 rounded-xl p-6 mb-6">
                <div className="text-4xl font-bold text-bright mb-2">
                  ${getFinalBalance().toFixed(2)}
                </div>
                <div className="text-neutral-60 mb-4">Final Balance</div>
                <div className={`text-lg font-semibold ${getPerformanceMessage().color}`}>
                  {getPerformanceMessage().message}
                </div>
              </div>
              <button
                onClick={resetGame}
                className="bg-bright text-neutral-100 px-8 py-3 rounded-full font-semibold hover:bg-bright-light hover:text-neutral-100 transition-colors duration-200"
              >
                Play Again
              </button>
            </div>
          )}

          {/* Outcome Log */}
          {gameState.outcomeMessages.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-neutral-05 mb-4">Trading Log</h3>
              <div className="bg-neutral-85 rounded-xl p-4 max-h-48 overflow-y-auto">
                {gameState.outcomeMessages.map((message, index) => (
                  <div key={index} className="text-sm text-neutral-60 mb-2">
                    Round {index + 1}: {message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Game Instructions */}
        <div className="mt-8 bg-neutral-90 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-neutral-05 mb-4">How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-60">
            <div>
              <h4 className="font-semibold text-neutral-10 mb-2">Trading Actions:</h4>
              <ul className="space-y-1">
                <li>• <strong>Buy:</strong> Purchase shares at current market price</li>
                <li>• <strong>Sell:</strong> Sell all your shares at current price</li>
                <li>• <strong>Hold:</strong> Keep your current position</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-10 mb-2">Strategy Tips:</h4>
              <ul className="space-y-1">
                <li>• Watch market trends and price movements</li>
                <li>• Consider your risk tolerance</li>
                <li>• Don&apos;t put all your money in one trade</li>
                <li>• Learn from each round&apos;s outcome</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
