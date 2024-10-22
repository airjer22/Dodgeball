"use client"

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UpcomingMatch } from '@/components/upcoming-match';
import { StandingsTable } from '@/components/standings-table';
import { TournamentCalendar } from '@/components/tournament-calendar';
import { ChevronLeft } from 'lucide-react';
import { getMatchesByTournament, getTeamsByTournament } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast";

export function GuestDashboard({ tournament, onBack }) {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState({});
  const { toast } = useToast();

  const fetchTournamentData = useCallback(async () => {
    try {
      const [fetchedMatches, fetchedTeams] = await Promise.all([
        getMatchesByTournament(tournament.id),
        getTeamsByTournament(tournament.id)
      ]);
      setMatches(fetchedMatches);
      setTeams(fetchedTeams);

      // Initialize scheduledMatches
      const scheduled = {};
      fetchedMatches.forEach(match => {
        if (match.scheduledDate) {
          const date = new Date(match.scheduledDate).toISOString().split('T')[0];
          if (!scheduled[date]) scheduled[date] = [];
          scheduled[date].push(match);
        }
      });
      setScheduledMatches(scheduled);
    } catch (error) {
      console.error("Error fetching tournament data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tournament data. Please try again.",
        variant: "destructive",
      });
    }
  }, [tournament.id, toast]);

  useEffect(() => {
    if (tournament) {
      fetchTournamentData();
    }
  }, [tournament, fetchTournamentData]);

  const upcomingMatches = matches
    .filter(match => !match.isCompleted && match.scheduledDate)
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 1);

  const calculateStandings = () => {
    const standingsData = teams.map(team => {
      const teamMatches = matches.filter(match => 
        (match.teamA === team.id || match.teamB === team.id) && match.isCompleted
      );
      const wins = teamMatches.filter(match => match.winner === team.id).length;
      const losses = teamMatches.filter(match => match.winner && match.winner !== team.id).length;
      const ties = teamMatches.filter(match => !match.winner).length;

      return {
        id: team.id,
        name: team.name,
        wins,
        losses,
        ties,
        gf: teamMatches.reduce((sum, match) => sum + (match.teamA === team.id ? match.score.teamA : match.score.teamB), 0),
        ga: teamMatches.reduce((sum, match) => sum + (match.teamA === team.id ? match.score.teamB : match.score.teamA), 0),
        pins: teamMatches.reduce((sum, match) => sum + (match.teamA === team.id ? match.pins.teamA : match.pins.teamB), 0),
      };
    }).sort((a, b) => (b.wins * 3 + b.ties) - (a.wins * 3 + a.ties));

    return standingsData;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{tournament.name}</h2>
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tournaments
        </Button>
      </div>
      
      <section>
        <h3 className="text-xl font-semibold mb-4">Next Match</h3>
        {upcomingMatches.map((match, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="p-4">
              <UpcomingMatch match={match} />
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Current Standings</h3>
        <Card>
          <CardContent className="p-4">
            <StandingsTable standings={calculateStandings()} />
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Tournament Schedule</h3>
        <Card>
          <CardContent className="p-4">
            <TournamentCalendar 
              matches={matches}
              isEditing={false}
              scheduledMatches={scheduledMatches}
              setScheduledMatches={setScheduledMatches}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}