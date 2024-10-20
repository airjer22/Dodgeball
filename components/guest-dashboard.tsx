"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UpcomingMatch } from '@/components/upcoming-match';
import { StandingsTable } from '@/components/standings-table';
import { ChevronLeft } from 'lucide-react';

export function GuestDashboard({ tournament, onBack }) {
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend based on the selected tournament
    const fetchTournamentData = async () => {
      // Simulating API call
      const matchesData = [
        { teamA: 'Team A', teamB: 'Team B', date: 'March 15, 2025', time: '7:30 PM EST' },
        { teamA: 'Team C', teamB: 'Team D', date: 'March 16, 2025', time: '6:00 PM EST' },
        { teamA: 'Team E', teamB: 'Team F', date: 'March 17, 2025', time: '8:00 PM EST' },
      ];

      const standingsData = [
        { id: 1, name: 'Team A', wins: 10, ties: 2, losses: 3, gf: 30, ga: 15, pins: 45, streak: { type: 'win', count: 3 } },
        { id: 2, name: 'Team B', wins: 8, ties: 4, losses: 3, gf: 25, ga: 18, pins: 40, streak: { type: 'loss', count: 2 } },
        { id: 3, name: 'Team C', wins: 7, ties: 3, losses: 5, gf: 22, ga: 20, pins: 38, streak: { type: 'win', count: 1 } },
      ];

      setUpcomingMatches(matchesData);
      setStandings(standingsData);
    };

    if (tournament) {
      fetchTournamentData();
    }
  }, [tournament]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{tournament.name}</h2>
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Tournaments
        </Button>
      </div>
      
      <section>
        <h3 className="text-xl font-semibold mb-4">Upcoming Matches</h3>
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
    </div>
  );
}