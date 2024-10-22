"use client"

import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const ROUNDS = ['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Final'];

export function TournamentBracket({ matches, teams, onUpdateMatch }) {
  const bracketData = useMemo(() => generateBracket(matches, teams), [matches, teams]);

  function generateBracket(matches, teams) {
    // ... (keep the existing generateBracket function)
  }

  const bracketVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const roundVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="flex justify-between overflow-x-auto"
      variants={bracketVariants}
      initial="hidden"
      animate="visible"
    >
      {bracketData.map((round, roundIndex) => (
        <motion.div key={roundIndex} className="flex-1 min-w-[200px]" variants={roundVariants}>
          <h3 className="text-lg font-semibold text-center mb-4 gradient-text">{ROUNDS[roundIndex]}</h3>
          <div className="space-y-4">
            {round.map((match, matchIndex) => (
              <Card key={matchIndex} className="mb-2 glassmorphism hover-scale">
                <CardContent className="p-2">
                  <MatchCard
                    match={match}
                    onUpdateMatch={onUpdateMatch}
                    isCompleted={!!match.winner}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function MatchCard({ match, onUpdateMatch, isCompleted }) {
  const handleWinner = (winner) => {
    if (!isCompleted && match.matchId) {
      onUpdateMatch(match.matchId, winner.team.id);
    }
  };

  return (
    <div className="space-y-2">
      <TeamButton
        team={match.team1}
        onClick={() => handleWinner(match.team1)}
        isWinner={match.winner === match.team1}
        isCompleted={isCompleted}
      />
      <TeamButton
        team={match.team2}
        onClick={() => handleWinner(match.team2)}
        isWinner={match.winner === match.team2}
        isCompleted={isCompleted}
      />
    </div>
  );
}

function TeamButton({ team, onClick, isWinner, isCompleted }) {
  if (!team) return <div className="h-8"></div>;

  return (
    <Button
      onClick={onClick}
      disabled={isCompleted}
      variant={isWinner ? "default" : "outline"}
      className={`w-full justify-start ${isWinner ? 'bg-primary text-primary-foreground' : ''}`}
    >
      {team.team.name}
    </Button>
  );
}