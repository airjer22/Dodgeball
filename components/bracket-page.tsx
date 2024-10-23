"use client"

import { useState, useEffect, useCallback } from 'react';
import { TournamentBracket } from '@/components/tournament-bracket';
import { useToast } from "@/components/ui/use-toast";
import { getMatchesByTournament, getTeamsByTournament, updateMatch } from '@/lib/firestore';

export function BracketPage({ tournament }) {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const { toast } = useToast();

  const fetchMatchesAndTeams = useCallback(async () => {
    try {
      const [fetchedMatches, fetchedTeams] = await Promise.all([
        getMatchesByTournament(tournament.id),
        getTeamsByTournament(tournament.id)
      ]);
      setMatches(fetchedMatches);
      setTeams(fetchedTeams);
    } catch (error) {
      console.error("Error fetching matches and teams:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bracket data. Please try again.",
        variant: "destructive",
      });
    }
  }, [tournament.id, toast]);

  useEffect(() => {
    if (tournament) {
      fetchMatchesAndTeams();
    }
  }, [tournament, fetchMatchesAndTeams]);

  const handleUpdateMatch = async (matchId, winnerId) => {
    try {
      await updateMatch(matchId, { winner: winnerId });
      toast({
        title: "Success",
        description: "Match updated successfully.",
      });
      fetchMatchesAndTeams(); // Refresh the bracket data
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