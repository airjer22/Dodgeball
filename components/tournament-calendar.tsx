"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function TournamentCalendar({ matches, isEditing, scheduledMatches, onScheduleMatch, onUnscheduleMatch }) {
  const [date, setDate] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    setDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }, []);

  const handleDrop = (e, day) => {
    e.preventDefault();
    if (!isEditing) return;

    const matchData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const sourceDate = e.dataTransfer.getData('source-date');
    onScheduleMatch(matchData, day, sourceDate);
    e.currentTarget.classList.remove('bg-accent');
  };

  const handleDragStart = (e, match, dayKey) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(match));
    e.dataTransfer.setData('source-date', dayKey);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (isEditing) {
      e.currentTarget.classList.add('bg-accent');
    }
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-accent');
  };

  const handleMatchClick = (match) => {
    if (!isEditing && match.id) {
      router.push(`/match/${match.id}`);
    }
  };

  const handleUnscheduleMatch = (e, match, dayKey) => {
    e.stopPropagation();
    if (isEditing) {
      onUnscheduleMatch(match, dayKey);
    }
  };

  const renderCell = (day) => {
    const dayKey = day.toISOString().split('T')[0];
    const matchesForDay = scheduledMatches[dayKey] || [];
    const isCurrentMonth = day.getMonth() === date.getMonth();

    return (
      <div
        key={dayKey}
        onDrop={(e) => handleDrop(e, day)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-32 border p-1 transition-colors ${
          isCurrentMonth ? 'bg-background' : 'bg-muted'
        } ${isEditing ? 'cursor-pointer' : ''}`}
      >
        <div className={`font-semibold ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
          {day.getDate()}
        </div>
        <div className="overflow-y-auto h-[calc(100%-1.5rem)]">
          {matchesForDay.map((match) => (
            <Card 
              key={match.id} 
              className={`mb-1 ${match.isCompleted ? 'bg-green-500' : 'bg-primary'} text-primary-foreground ${isEditing ? 'cursor-move' : 'cursor-pointer'} relative`}
              draggable={isEditing}
              onDragStart={(e) => handleDragStart(e, match, dayKey)}
              onClick={() => handleMatchClick(match)}
            >
              <CardContent className="p-1 text-xs">
                <div>{match.teamAName} vs {match.teamBName}</div>
                {match.isCompleted && <div>({match.score.teamA}-{match.score.teamB})</div>}
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-4 w-4 p-0"
                    onClick={(e) => handleUnscheduleMatch(e, match, dayKey)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDay = startDate.getDay();
    const totalDays = endDate.getDate();

    const calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(date.getFullYear(), date.getMonth(), i - startDay + 1);
      calendarDays.push(day);
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {calendarDays.map(renderCell)}
      </div>
    );
  };

  const prevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={prevMonth} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <Button onClick={nextMonth} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {renderCalendar()}
    </div>
  );
}