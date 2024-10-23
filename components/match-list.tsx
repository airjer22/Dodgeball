"use client"

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MatchList({ matches, scheduledMatches, isEditing, setUnscheduledMatches, setScheduledMatches }) {
  const [searchTerm, setSearchTerm] = useState('');

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => a.round - b.round);
  }, [matches]);

  const filteredMatches = useMemo(() => {
    return sortedMatches.filter(match =>
      (match.teamAName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (match.teamBName?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );
  }, [sortedMatches, searchTerm]);

  const handleDragStart = (e, match) => {
    if (!isEditing) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', JSON.stringify(match));
  };

  const handleDragEnd = (e, match) => {
    if (e.dataTransfer.dropEffect === 'none') {
      // The match was not dropped on a valid target
      return;
    }
    
    // Remove the match from unscheduledMatches
    setUnscheduledMatches(prev => prev.filter(m => m.id !== match.id));
  };

  return (
    <div className="w-1/4 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Unscheduled Matches</h2>
      <Input
        type="text"
        placeholder="Search matches..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="flex-1">
        {filteredMatches.map((match) => (
          <Card 
            key={match.id} 
            className={`mb-2 ${isEditing ? 'cursor-move' : 'cursor-default'}`}
            draggable={isEditing}
            onDragStart={(e) => handleDragStart(e, match)}
            onDragEnd={(e) => handleDragEnd(e, match)}
          >
            <CardContent className="p-2">
              <p className="text-sm font-medium">{match.teamAName || 'Team A'} vs {match.teamBName || 'Team B'}</p>
              <p className="text-xs text-gray-500">Round {match.round}</p>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}