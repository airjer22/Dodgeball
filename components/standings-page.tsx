"use client"

import { useState, useEffect, useCallback } from 'react';
import { UpcomingMatch } from '@/components/upcoming-match';
import { StandingsTable } from '@/components/standings-table';
import { useToast } from "@/components/ui/use-toast";
import { getMatchesByTournament, getTeamsByTournament } from '@/lib/firestore';

export function StandingsPage({ tournament }) {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const { toast } = useToast();

  const fetchMatchesAndTeams = useCallback(async () => {
    if (!tournament) return;

    try {
      const [matches, teams] = await Promise.all([
        getMatchesByTournament(tournament.id),
        getTeamsByTournament(tournament.id)
      ]);

      // Process matches to get upcoming matches
      const now = new Date();
      const upcoming = matches
        .filter(match => new Date(match.scheduledDate) > now && !match.isCompleted)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
        .slice(0, 1);  // Get next upcoming match
      setUpcomingMatches(upcoming);

      // Calculate standings
      const standingsData = teams.map(team => {
        const teamMatches = matches.filter(match => 
          match.teamA === team.id || match.teamB === team.id
        );
        
        let wins = 0;
        let losses = 0;
        let ties = 0;
        let gf = 0;
        let ga = 0;
        let pins = 0;

        teamMatches.forEach(match => {
          if (match.isCompleted) {
            const isTeamA = match.teamA === team.id;
            const teamScore = isTeamA ? match.score.teamA : match.score.teamB;
            const opponentScore = isTeamA ? match.score.teamB : match.score.teamA;
            
            gf += teamScore;
            ga += opponentScore;
            pins += isTeamA ? match.pins.teamA : match.pins.teamB;

            if (teamScore > opponentScore) {
              wins++;
            } else if (teamScore < opponentScore) {
              losses++;
            } else {
              ties++;
            }
          }
        });

        return {
          id: team.id,
          name: team.name,
          wins,
          losses,
          ties,
          gf,
          ga,
          pins,
        };
      });

      // Sort standings
      standingsData.sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.ties !== a.ties) return b.ties - a.ties;
        const aGoalDiff = a.gf - a.ga;
        const bGoalDiff = b.gf - b.ga;
        if (bGoalDiff !== aGoalDiff) return bGoalDiff - aGoalDiff;
        return b.gf - a.gf;
      });

      setStandings(standingsData);
    } catch (error) {
      console.error("Error fetching matches and teams:", error);
      toast({
        title: "Error",
        description: "Failed to fetch standings data. Please try again.",
        variant: "destructive",
      });
    }
  }, [tournament, toast]);

  useEffect(() => {
    fetchMatchesAndTeams();
  }, [fetchMatchesAndTeams]);

  if (!tournament) {
    return <div>No tournament selected</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upcoming Match</h2>
      {upcomingMatches.map((match, index) => (
        <UpcomingMatch key={index} match={match} />
      ))}
      <h2 className="text-xl font-semibold my-4">Standings</h2>
      <StandingsTable standings={standings} />
    </div>
  );
}