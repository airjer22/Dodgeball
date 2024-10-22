"use client"

import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TournamentBracket } from '@/components/tournament-bracket';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTournament } from '@/contexts/TournamentContext';
import { getMatchesByTournament, getTeamsByTournament, updateMatch } from '@/lib/firestore';

export default function BracketPage({ params }) {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const { toast } = useToast();
  const { selectedTournament } = useTournament();

  const fetchTournament = useCallback(async () => {
    try {
      const [fetchedMatches, fetchedTeams] = await Promise.all([
        getMatchesByTournament(params.id),
        getTeamsByTournament(params.id)
      ]);
      setMatches(fetchedMatches);
      setTeams(fetchedTeams);
    } catch (error) {
      console.error("Error fetching tournament data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tournament data. Please try again.",
        variant: "destructive",
      });
    }
  }, [params.id, toast]);

  useEffect(() => {
    if (selectedTournament) {
      fetchTournament();
    }
  }, [selectedTournament, fetchTournament]);

  const handleUpdateMatch = async (matchId, winnerId) => {
    try {
      await updateMatch(matchId, { winner: winnerId });
      toast({
        title: "Success",
        description: "Match updated successfully.",
      });
      fetchTournament(); // Refresh the bracket data
    } catch (error) {
      console.error("Error updating match:", error);
      toast({
        title: "Error",
        description: "Failed to update match. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar tournamentId={params.id} />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Tournament Bracket</h1>
        {selectedTournament ? (
          <TournamentBracket 
            matches={matches} 
            teams={teams} 
            onUpdateMatch={handleUpdateMatch}
          />
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