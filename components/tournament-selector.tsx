"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TournamentSelector({ tournaments, onSelect }) {
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