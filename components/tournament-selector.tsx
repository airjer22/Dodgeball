"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TournamentSelector({ onSelect }) {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const fetchTournaments = async () => {
      // Simulating API call
      const tournamentData = [
        { id: 1, name: 'Summer Dodgeball Classic 2025' },
        { id: 2, name: 'Corporate Challenge 2025' },
        { id: 3, name: 'Winter Dodgeball Cup 2025' },
      ];
      setTournaments(tournamentData);
    };

    fetchTournaments();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Select a Tournament</h2>
      <div className="grid gap-4">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className="cursor-pointer hover:bg-accent" onClick={() => onSelect(tournament)}>
            <CardHeader>
              <CardTitle>{tournament.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>View Tournament</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}