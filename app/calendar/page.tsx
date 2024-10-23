"use client"

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { MatchList } from '@/components/match-list';
import { TournamentCalendar } from '@/components/tournament-calendar';
import { Button } from "@/components/ui/button";
import { useTournament } from '@/contexts/TournamentContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function CalendarPage() {
  const [matches, setMatches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [scheduledMatches, setScheduledMatches] = useState({});
  const { selectedTournament } = useTournament();

  useEffect(() => {
    if (selectedTournament) {
      // In a real application, you would fetch this data from your backend based on the selected tournament
      const dummyGeneratedMatchups = [
        { id: 1, teams: ['Flashy Friday Falafels', "Mr. Hendypin's Minions"], date: null },
        { id: 2, teams: ['Demons Dodging Big Balls', 'Totoro Clan'], date: null },
        { id: 3, teams: ['The Bounties', 'Mini Milo'], date: null },
        { id: 4, teams: ['Wicked Nuggets', 'Fat Teddies'], date: null },
        { id: 5, teams: ['Dodgeball Dolphins', 'Banana Republic'], date: null },
        { id: 6, teams: ['Fanum Taxers', 'Freezing Cold Cheetos'], date: null },
        { id: 7, teams: ['Goose Frappe', 'In A Pickle'], date: null },
        { id: 8, teams: ['Dodging Pickle Demons', 'Flashy Friday Falafels'], date: null },
      ];

      setMatches(dummyGeneratedMatchups);
    }
  }, [selectedTournament]);

  const handleSaveCalendar = () => {
    // Implement save logic here
    console.log('Calendar saved');
    setIsEditing(false);
  };

  const handleEditCalendar = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Calendar</h1>
          {selectedTournament && (
            <div>
              {isEditing ? (
                <Button onClick={handleSaveCalendar}>Save Calendar</Button>
              ) : (
                <Button onClick={handleEditCalendar}>Edit Calendar</Button>
              )}
            </div>
          )}
        </div>
        {selectedTournament ? (
          <div className="flex h-[calc(100vh-12rem)] space-x-4">
            <MatchList matches={matches} scheduledMatches={scheduledMatches} />
            <TournamentCalendar 
              matches={matches} 
              isEditing={isEditing} 
              scheduledMatches={scheduledMatches}
              setScheduledMatches={setScheduledMatches}
            />
          </div>
        ) : (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No tournament selected</AlertTitle>
            <AlertDescription>
              Please select a tournament from the dashboard to view and manage the calendar.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}