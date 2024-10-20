"use client"

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TournamentBracket } from '@/components/tournament-bracket';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTournament } from '@/contexts/TournamentContext';

export default function BracketPage() {
  const [bracketData, setBracketData] = useState(null);
  const [isAllMatchesCompleted, setIsAllMatchesCompleted] = useState(false);
  const { toast } = useToast();
  const { selectedTournament } = useTournament();

  useEffect(() => {
    if (selectedTournament) {
      // In a real application, you would fetch this data from your backend based on the selected tournament
      const dummyBracketData = {
        title: `${selectedTournament.name} Bracket`,
        rounds: [
          {
            name: "Round of 16",
            matches: [
              { id: 1, team1: { name: "Flashy Friday Falafels", seed: 1 }, team2: { name: "Mr. Hendypin's Minions", seed: 8 }, date: null },
              { id: 2, team1: { name: "Demons Dodging Big Balls", seed: 9 }, team2: null, date: null },
              { id: 3, team1: { name: "Totoro Clan", seed: 4 }, team2: { name: "The Bounties", seed: 13 }, date: null },
              { id: 4, team1: { name: "Mini Milo", seed: 5 }, team2: { name: "Wicked Nuggets", seed: 12 }, date: null },
              { id: 5, team1: { name: "Fat Teddies", seed: 2 }, team2: { name: "Dodgeball Dolphins", seed: 15 }, date: null },
              { id: 6, team1: { name: "Banana Republic", seed: 7 }, team2: { name: "Fanum Taxers", seed: 10 }, date: null },
              { id: 7, team1: { name: "Freezing Cold Cheetos", seed: 3 }, team2: { name: "Goose Frappe", seed: 14 }, date: null },
              { id: 8, team1: { name: "In A Pickle", seed: 6 }, team2: { name: "Dodging Pickle Demons", seed: 11 }, date: null },
            ]
          },
          // ... other rounds
        ]
      };

      setBracketData(dummyBracketData);

      // Check if all matches are completed (this would be based on your actual data)
      setIsAllMatchesCompleted(false); // Set to true when all matches are completed
    }
  }, [selectedTournament]);

  const handleUpdateMatch = (matchId, date) => {
    if (!isAllMatchesCompleted) {
      toast({
        title: "Action not allowed",
        description: "The bracket can only be updated once all generated matchups are completed.",
        variant: "destructive",
      });
      return;
    }

    setBracketData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      for (const round of newData.rounds) {
        const match = round.matches.find(m => m.id === matchId);
        if (match) {
          match.date = date;
          break;
        }
      }
      return newData;
    });

    toast({
      title: "Match Date Updated",
      description: `Match ${matchId} has been scheduled for ${date.toDateString()}.`,
    });
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Tournament Bracket</h1>
        {selectedTournament ? (
          <>
            {!isAllMatchesCompleted && (
              <Alert variant="warning" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Bracket not yet active</AlertTitle>
                <AlertDescription>
                  The bracket will become interactive once all generated matchups from the tournament creation are completed.
                </AlertDescription>
              </Alert>
            )}
            {bracketData && <TournamentBracket data={bracketData} onUpdateMatch={handleUpdateMatch} isInteractive={isAllMatchesCompleted} />}
          </>
        ) : (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No tournament selected</AlertTitle>
            <AlertDescription>
              Please select a tournament from the dashboard to view the bracket.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}