"use client"

import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface Team {
  id: string;
  name: string;
  wins: number;
  ties: number;
  gf: number;
  ga: number;
}

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  winner?: string;
  score?: {
    teamA: number;
    teamB: number;
  };
}

interface BracketTeam {
  team: Team;
  seed: number;
}

interface BracketMatch {
  matchId?: string;
  team1: BracketTeam | null;
  team2: BracketTeam | null;
  winner: BracketTeam | null;
}

const ROUNDS = ['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Final'];

export function TournamentBracket({ 
  matches, 
  teams, 
  onUpdateMatch 
}: { 
  matches: Match[];
  teams: Team[];
  onUpdateMatch: (matchId: string, winnerId: string) => void;
}) {
  const bracketData = useMemo(() => generateBracket(matches, teams), [matches, teams]);

  function generateBracket(matches: Match[], teams: Team[]): BracketMatch[][] {
    // Sort teams by standings (wins, ties, goal difference, goals for)
    const sortedTeams = [...teams].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.ties !== a.ties) return b.ties - a.ties;
      const aGoalDiff = a.gf - a.ga;
      const bGoalDiff = b.gf - b.ga;
      if (bGoalDiff !== aGoalDiff) return bGoalDiff - aGoalDiff;
      return b.gf - a.gf;
    });

    // Create initial round matchups based on seeding
    // 1 vs 16, 8 vs 9, 5 vs 12, 4 vs 13, 6 vs 11, 3 vs 14, 7 vs 10, 2 vs 15
    const seedMatchups = [
      [0, 15], [7, 8], [4, 11], [3, 12],
      [5, 10], [2, 13], [6, 9], [1, 14]
    ];

    // Initialize rounds array
    const rounds: BracketMatch[][] = [[], [], [], []];

    // Create first round matches
    rounds[0] = seedMatchups.map(([seed1, seed2]) => {
      const team1 = sortedTeams[seed1];
      const team2 = sortedTeams[seed2];
      
      // Find if there's an existing match between these teams
      const existingMatch = matches.find(m => 
        (m.teamA === team1?.id && m.teamB === team2?.id) ||
        (m.teamA === team2?.id && m.teamB === team1?.id)
      );

      return {
        matchId: existingMatch?.id,
        team1: team1 ? { team: team1, seed: seed1 + 1 } : null,
        team2: team2 ? { team: team2, seed: seed2 + 1 } : null,
        winner: existingMatch?.winner ? {
          team: sortedTeams.find(t => t.id === existingMatch.winner) as Team,
          seed: existingMatch.winner === team1?.id ? seed1 + 1 : seed2 + 1
        } : null
      };
    });

    // Generate subsequent rounds
    for (let round = 1; round < 4; round++) {
      const previousRound = rounds[round - 1];
      const numMatches = previousRound.length / 2;

      for (let i = 0; i < numMatches; i++) {
        const match1 = previousRound[i * 2];
        const match2 = previousRound[i * 2 + 1];

        // Find if there's an existing match between potential winners
        const potentialTeams = [
          match1.winner?.team || match1.team1?.team,
          match2.winner?.team || match2.team1?.team
        ].filter(Boolean);

        const existingMatch = matches.find(m => 
          potentialTeams.some(t => t?.id === m.teamA) && 
          potentialTeams.some(t => t?.id === m.teamB)
        );

        rounds[round].push({
          matchId: existingMatch?.id,
          team1: match1.winner || null,
          team2: match2.winner || null,
          winner: existingMatch?.winner ? {
            team: sortedTeams.find(t => t.id === existingMatch.winner) as Team,
            seed: match1.winner?.seed || match2.winner?.seed || 0
          } : null
        });
      }
    }

    return rounds;
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
      className="flex justify-between overflow-x-auto p-4"
      variants={bracketVariants}
      initial="hidden"
      animate="visible"
    >
      {bracketData.map((round, roundIndex) => (
        <motion.div key={roundIndex} className="flex-1 min-w-[250px] mx-2" variants={roundVariants}>
          <h3 className="text-lg font-semibold text-center mb-4 gradient-text">{ROUNDS[roundIndex]}</h3>
          <div className="space-y-8">
            {round.map((match, matchIndex) => (
              <Card key={matchIndex} className="mb-2 glassmorphism hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
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

interface MatchCardProps {
  match: BracketMatch;
  onUpdateMatch: (matchId: string, winnerId: string) => void;
  isCompleted: boolean;
}

function MatchCard({ match, onUpdateMatch, isCompleted }: MatchCardProps) {
  const handleWinner = (winner: BracketTeam) => {
    if (!isCompleted && match.matchId) {
      onUpdateMatch(match.matchId, winner.team.id);
    }
  };

  return (
    <div className="space-y-3">
      <TeamButton
        team={match.team1}
        onClick={() => match.team1 && handleWinner(match.team1)}
        isWinner={match.winner?.team.id === match.team1?.team.id}
        isCompleted={isCompleted}
      />
      <TeamButton
        team={match.team2}
        onClick={() => match.team2 && handleWinner(match.team2)}
        isWinner={match.winner?.team.id === match.team2?.team.id}
        isCompleted={isCompleted}
      />
    </div>
  );
}

interface TeamButtonProps {
  team: BracketTeam | null;
  onClick: () => void;
  isWinner: boolean;
  isCompleted: boolean;
}

function TeamButton({ team, onClick, isWinner, isCompleted }: TeamButtonProps) {
  if (!team) return <div className="h-12 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400">TBD</div>;

  return (
    <Button
      onClick={onClick}
      disabled={isCompleted}
      variant={isWinner ? "default" : "outline"}
      className={`w-full justify-between px-4 py-2 ${isWinner ? 'bg-primary text-primary-foreground' : ''}`}
    >
      <span className="font-semibold">#{team.seed}</span>
      <span className="flex-1 text-center">{team.team.name}</span>
    </Button>
  );
}
