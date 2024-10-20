"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UpcomingMatch } from '@/components/upcoming-match';
import { StandingsTable } from '@/components/standings-table';
import { TournamentCalendar } from '@/components/tournament-calendar';
import { ChevronLeft } from 'lucide-react';
import { getMatchesByTournament, getTeamsByTournament } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function GuestDashboard({ tournament, onBack }) {
  const [upcomingMatch, setUpcomingMatch] = useState(null);
  const [standings, setStandings] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (tournament) {
      fetchTournamentData();
    }
  }, [tournament]);

  const fetchTournamentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [matches, teams] = await Promise.all([
        getMatchesByTournament(tournament.id),
        getTeamsByTournament(tournament.id)
      ]);

      console.log("Fetched matches:", matches);
      console.log("Fetched teams:", teams);

      // Process matches and teams
      const teamMap = teams.reduce((acc, team) => {
        acc[team.id] = team.name;
        return acc;
      }, {});

      const processedMatches = matches.map(match => ({
        ...match,
        teamAName: teamMap[match.teamA],
        teamBName: teamMap[match.teamB]
      }));

      // Set upcoming match
      const upcomingMatches = processedMatches
        .filter(match => !match.isCompleted && match.scheduledDate)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      setUpcomingMatch(upcomingMatches[0] || null);

      // Calculate standings
      const standingsData = calculateStandings(teams, processedMatches);
      console.log("Calculated standings:", standingsData);
      setStandings(standingsData);

      // Set scheduled matches
      const scheduled = processedMatches.reduce((acc, match) => {
        if (match.scheduledDate) {
          const dateKey = new Date(match.scheduledDate).toISOString().split('T')[0];
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push(match);
        }
        return acc;
      }, {});
      setScheduledMatches(scheduled);

    } catch (error) {
      console.error("Error fetching tournament data:", error);
      setError("Failed to fetch tournament data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch tournament data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStandings = (teams, matches) => {
    const standingsMap = teams.reduce((acc, team) => {
      acc[team.id] = {
        id: team.id,
        name: team.name,
        wins: 0,
        ties: 0,
        losses: 0,
        gf: 0,
        ga: 0,
        pins: 0
      };
      return acc;
    }, {});

    matches.forEach(match => {
      if (match.isCompleted) {
        const teamA = standingsMap[match.teamA];
        const teamB = standingsMap[match.teamB];

        if (teamA && teamB) {
          const scoreA = match.score.teamA;
          const scoreB = match.score.teamB;

          teamA.gf += scoreA;
          teamA.ga += scoreB;
          teamA.pins += match.pins.teamA;

          teamB.gf += scoreB;
          teamB.ga += scoreA;
          teamB.pins += match.pins.teamB;

          if (scoreA > scoreB) {
            teamA.wins++;
            teamB.losses++;
          } else if (scoreB > scoreA) {
            teamB.wins++;
            teamA.losses++;
          } else {
            teamA.ties++;
            teamB.ties++;
          }
        }
      }
    });

    return Object.values(standingsMap).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.ties !== a.ties) return b.ties - a.ties;
      if (b.gf !== a.gf) return b.gf - a.gf;
      if (a.ga !== b.ga) return a.ga - b.ga;
      return b.pins - a.pins;
    });
  };

  if (loading) {
    return <div>Loading tournament data...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{tournament.name}</h2>
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tournaments
        </Button>
      </div>
      
      <section>
        <h3 className="text-xl font-semibold mb-4">Next Upcoming Match</h3>
        {upcomingMatch ? (
          <UpcomingMatch match={upcomingMatch} />
        ) : (
          <p>No upcoming matches scheduled.</p>
        )}
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
              matches={[]} 
              isEditing={false} 
              scheduledMatches={scheduledMatches}
              onScheduleMatch={() => {}}
              onUnscheduleMatch={() => {}}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}