'use client';

import React, { useState, useEffect } from 'react';

interface PasswordProtectionProps {
  round: number;
  onVerified: () => void;
}

export default function PasswordProtection({
  round,
  onVerified,
}: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already verified in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const verifiedRounds = JSON.parse(localStorage.getItem('tournament_verified_rounds') || '[]');
      if (verifiedRounds.includes(round)) {
        onVerified();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/tournament/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ round, password }),
      });

      const data = await response.json();

      if (data.verified) {
        // Store verification in localStorage
        if (typeof window !== 'undefined') {
          const verifiedRounds = JSON.parse(localStorage.getItem('tournament_verified_rounds') || '[]');
          if (!verifiedRounds.includes(round)) {
            verifiedRounds.push(round);
            localStorage.setItem('tournament_verified_rounds', JSON.stringify(verifiedRounds));
          }
        }
        onVerified();
      } else {
        setError(data.error || 'Incorrect password');
      }
    } catch (error) {
      setError('Failed to verify password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen flex items-center justify-center px-4">
      <div className="bg-neutral-90 rounded-2xl shadow-lg p-8 max-w-md w-full border-2 border-neutral-75">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-neutral-05 mb-2">
            Password Required
          </h1>
          <p className="text-neutral-60">
            This round is password protected. Please enter the password to
            continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-10 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-85 border border-neutral-70 rounded-xl text-neutral-05 focus:outline-none focus:ring-2 focus:ring-bright"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bright text-neutral-100 py-3 px-6 rounded-xl font-semibold hover:bg-bright-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
}
