import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface Team {
  name: string;
  seed?: number;
}

interface Match {
  id: number;
  team1: Team | null;
  team2: Team | null;
  date: Date | null;
}

interface Round {
  name: string;
  matches: Match[];
}

interface BracketData {
  title: string;
  rounds: Round[];
}

interface TournamentBracketProps {
  data: BracketData;
  onUpdateMatch: (matchId: number, date: Date) => void;
  isInteractive: boolean;
}

export function TournamentBracket({ data, onUpdateMatch, isInteractive }: TournamentBracketProps) {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-6">{data.title}</h2>
      <div className="flex justify-between" style={{ minWidth: data.rounds.length * 250 + 'px' }}>
        {data.rounds.map((round, roundIndex) => (
          <div key={roundIndex} className="flex-1">
            <h3 className="text-lg font-semibold text-center mb-4">{round.name}</h3>
            <div className="space-y-4">
              {round.matches.map((match, matchIndex) => (
                <Card key={match.id} className="mx-2">
                  <CardContent className="p-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs text-gray-500">
                        {match.date ? format(match.date, 'MMM dd, yyyy') : 'No date set'}
                      </div>
                      {isInteractive && (
                        <DatePicker 
                          date={match.date} 
                          onSelect={(date) => onUpdateMatch(match.id, date)} 
                        />
                      )}
                    </div>
                    <div className="space-y-1">
                      <TeamSlot team={match.team1} isWinner={roundIndex > 0 && matchIndex % 2 === 0} />
                      <TeamSlot team={match.team2} isWinner={roundIndex > 0 && matchIndex % 2 === 1} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatePicker({ date, onSelect }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {date ? format(date, 'MMM dd, yyyy') : 'Set date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function TeamSlot({ team, isWinner }: { team: Team | null, isWinner: boolean }) {
  if (!team) {
    return <div className="h-6 bg-gray-200 rounded"></div>;
  }

  return (
    <div className={`flex items-center ${isWinner ? 'font-bold' : ''}`}>
      {team.seed && <span className="mr-2 text-xs">{team.seed}</span>}
      <span className="truncate">{team.name}</span>
    </div>
  );
}