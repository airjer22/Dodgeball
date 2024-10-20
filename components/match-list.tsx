"use client"

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function MatchList({ matches, scheduledMatches }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMatches = matches.filter(match =>
    match.teams.some(team => team.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDragStart = (e, match) => {
    if (isMatchScheduled(match)) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', match.id.toString());
  };

  const isMatchScheduled = (match) => {
    return Object.values(scheduledMatches).some(dayMatches => 
      dayMatches.some(scheduledMatch => scheduledMatch.id === match.id)
    );
  };

  return (
    <div className="w-1/4 pr-4 overflow-y-auto">
      <Input
        type="text"
        placeholder="Search teams..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {filteredMatches.map((match) => {
        const scheduled = isMatchScheduled(match);
        return (
          <Card 
            key={match.id} 
            className={`mb-2 ${scheduled ? 'bg-green-100 dark:bg-green-900 cursor-not-allowed' : 'cursor-move'}`}
            draggable={!scheduled}
            onDragStart={(e) => handleDragStart(e, match)}
          >
            <CardContent className="p-2">
              <p>{match.teams.join(' vs ')}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}