"use client"

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';

export function TournamentList({ tournaments, onDeleteTournament, onSelectTournament, selectedTournament }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-8">
      <Input
        type="text"
        placeholder="Search tournaments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {filteredTournaments.map((tournament) => (
        <Card key={tournament.id} className={`mb-2 ${selectedTournament?.id === tournament.id ? 'border-primary' : ''}`}>
          <CardContent className="p-4 flex justify-between items-center">
            <button
              onClick={() => onSelectTournament(tournament)}
              className="text-left flex-grow hover:underline focus:outline-none"
            >
              {tournament.name}
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteTournament(tournament.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}