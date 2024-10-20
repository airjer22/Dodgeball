"use client"

import React, { useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ROUNDS = ['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Final'];

export function TournamentBracket({ matches, teams, onUpdateMatch }) {
  const bracketData = useMemo(() => generateBracket(matches, teams), [matches, teams]);

  function generateBracket(matches, teams) {
    // Sort teams by their standings (wins, then goal difference, then goals for)
    const sortedTeams = teams.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      const aGoalDiff = a.gf - a.ga;
      const bGoalDiff = b.gf - b.ga;
      if (bGoalDiff !== aGoalDiff) return bGoalDiff - aGoalDiff;
      return b.gf - a.gf;
    });

    // Generate initial round with seeded matchups
    let currentRound = [];
    for (let i = 0; i < sortedTeams.length / 2; i++) {
      currentRound.push({
        team1: { team: sortedTeams[i] },
        team2: { team: sortedTeams[sortedTeams.length - 1 - i] }
      });
    }

    const bracket = [];

    while (currentRound.length > 0) {
      const roundMatches = currentRound.map(pairing => {
        const match = matches.find(m => 
          (m.teamA === pairing.team1.team.id && m.teamB === pairing.team2.team.id) ||
          (m.teamB === pairing.team1.team.id && m.teamA === pairing.team2.team.id)
        );

        return {
          ...pairing,
          winner: match?.winner ? (match.winner === pairing.team1.team.id ? pairing.team1 : pairing.team2) : null,
          matchId: match?.id
        };
      });

      bracket.push(roundMatches);

      // Prepare next round
      currentRound = [];
      for (let i = 0; i < roundMatches.length; i += 2) {
        currentRound.push({
          team1: roundMatches[i].winner,
          team2: roundMatches[i + 1]?.winner
        });
      }
      currentRound = currentRound.filter(match => match.team1 && match.team2);
    }

    return bracket;
  }

  return (
    <div className="flex justify-between overflow-x-auto">
      {bracketData.map((round, roundIndex) => (
        <div key={roundIndex} className="flex-1 min-w-[200px]">
          <h3 className="text-lg font-semibold text-center mb-4">{ROUNDS[roundIndex]}</h3>
          <div className="space-y-4">
            {round.map((match, matchIndex) => (
              <Card key={matchIndex} className="mb-2">
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
        </div>
      ))}
    </div>
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
      className="w-full justify-start"
    >
      {team.team.name}
    </Button>
  );
}