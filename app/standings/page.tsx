"use client"

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { UpcomingMatch } from '@/components/upcoming-match';
import { StandingsTable } from '@/components/standings-table';
import { useTournament } from '@/contexts/TournamentContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function StandingsPage() {
  const [upcomingMatch, setUpcomingMatch] = useState(null);
  const [standings, setStandings] = useState([]);
  const { selectedTournament } = useTournament();

  useEffect(() => {
    if (selectedTournament) {
      // In a real application, you would fetch this data from your backend based on the selected tournament
      setUpcomingMatch({
        teamA: 'Team A',
        teamB: 'Team B',
        date: 'March 15, 2025',
        time: '7:30 PM EST'
      });

      setStandings([
        { id: 1, name: 'Team A', wins: 10, ties: 2, losses: 3, gf: 30, ga: 15, pins: 45, streak: { type: 'win', count: 3 } },
        { id: 2, name: 'Team B', wins: 8, ties: 4, losses: 3, gf: 25, ga: 18, pins: 40, streak: { type: 'loss', count: 2 } },
        // Add more teams as needed
      ]);
    }
  }, [selectedTournament]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Standings</h1>
        {selectedTournament ? (
          <>
            <UpcomingMatch match={upcomingMatch} />
            <StandingsTable standings={standings} />
          </>
        ) : (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No tournament selected</AlertTitle>
            <AlertDescription>
              Please select a tournament from the dashboard to view standings.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}