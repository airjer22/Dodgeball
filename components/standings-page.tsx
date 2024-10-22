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
      console.log("Fetched matches:", matches);
      console.log("Fetched teams:", teams);

      // Process matches to get upcoming matches
      const now = new Date();
      const upcoming = matches
        .filter(match => new Date(match.scheduledDate) > now && !match.isCompleted)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
        .slice(0, 1);  // Get next upcoming match
      setUpcomingMatches(upcoming);

      // Calculate standings
      console.log("Calculating standings...");
      const standingsData = teams.map(team => {
        const teamMatches = matches.filter(match => 
          match.teamA === team.id || match.teamB === team.id
        );
        console.log("Processing match:", teamMatches[0]);
        const wins = teamMatches.filter(match => match.winner === team.id).length;
        const losses = teamMatches.filter(match => match.winner && match.winner !== team.id).length;
        const ties = teamMatches.filter(match => match.isCompleted && !match.winner).length;

        return {
          id: team.id,
          name: team.name,
          wins,
          losses,
          ties,
          gf: teamMatches.reduce((sum, match) => 
            sum + (match.teamA === team.id ? (match.score?.teamA || 0) : (match.score?.teamB || 0)), 0
          ),
          ga: teamMatches.reduce((sum, match) => 
            sum + (match.teamA === team.id ? (match.score?.teamB || 0) : (match.score?.teamA || 0)), 0
          ),
          pins: teamMatches.reduce((sum, match) => 
            sum + (match.teamA === team.id ? (match.pins?.teamA || 0) : (match.pins?.teamB || 0)), 0
          ),
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