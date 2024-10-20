"use client"

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MatchList({ matches, scheduledMatches, isEditing }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMatches = matches.filter(match =>
    (match.teamAName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (match.teamBName?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );

  const handleDragStart = (e, match) => {
    if (!isEditing) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', JSON.stringify(match));
  };

  const isMatchScheduled = (match) => {
    return Object.values(scheduledMatches).some(dayMatches => 
      dayMatches.some(scheduledMatch => scheduledMatch.id === match.id)
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col">
      <Input
        type="text"
        placeholder="Search matches..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="flex-1">
        {filteredMatches.map((match) => {
          const scheduled = isMatchScheduled(match);
          return (
            <Card 
              key={match.id} 
              className={`mb-2 ${scheduled ? 'bg-green-100 dark:bg-green-900' : ''} ${isEditing ? 'cursor-move' : 'cursor-default'}`}
              draggable={isEditing}
              onDragStart={(e) => handleDragStart(e, match)}
            >
              <CardContent className="p-2">
                <p className="text-sm font-medium">{match.teamAName || 'Team A'} vs {match.teamBName || 'Team B'}</p>
                <p className="text-xs text-gray-500">Round {match.round}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(match.scheduledDate)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </ScrollArea>
    </div>
  );
}