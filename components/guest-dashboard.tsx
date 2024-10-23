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
  const [standings, setStandings] = useState([]);
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

      // Calculate standings
      const standingsData = fetchedTeams.map(team => {
        const teamMatches = fetchedMatches.filter(match => 
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
            <StandingsTable standings={standings} />
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