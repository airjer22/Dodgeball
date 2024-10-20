"use client"

import { useState, useEffect } from 'react';
import { TournamentBracket } from '@/components/tournament-bracket';
import { getMatchesByTournament, getTeamsByTournament, updateMatch } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function BracketPage({ tournament }) {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (tournament) {
      fetchMatchesAndTeams();
    }
  }, [tournament]);

  const fetchMatchesAndTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedMatches, fetchedTeams] = await Promise.all([
        getMatchesByTournament(tournament.id),
        getTeamsByTournament(tournament.id)
      ]);
      setMatches(fetchedMatches);
      setTeams(fetchedTeams);
    } catch (error) {
      console.error("Error fetching matches and teams:", error);
      setError("Failed to fetch bracket data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch bracket data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMatch = async (matchId, winner) => {
    try {
      const match = matches.find(m => m.id === matchId);
      if (!match) throw new Error("Match not found");

      const updatedMatch = {
        ...match,
        winner: winner,
        isCompleted: true
      };

      await updateMatch(matchId, updatedMatch);
      setMatches(matches.map(m => m.id === matchId ? updatedMatch : m));
      toast({
        title: "Success",
        description: "Match result updated successfully.",
      });
    } catch (error) {
      console.error("Error updating match:", error);
      toast({
        title: "Error",
        description: "Failed to update match result. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading bracket data...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tournament Bracket</h2>
      <TournamentBracket
        matches={matches}
        teams={teams}
        onUpdateMatch={handleUpdateMatch}
      />
    </div>
  );
}