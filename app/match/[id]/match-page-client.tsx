"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { MatchScoring } from '@/components/match-scoring'
import { useToast } from "@/components/ui/use-toast"
import { getMatch, updateMatch, getTournament } from '@/lib/firestore'
import { useTournament } from '@/contexts/TournamentContext'

export default function MatchPageClient({ id }) {
  const router = useRouter()
  const { toast } = useToast()
  const [match, setMatch] = useState(null)
  const { setSelectedTournament } = useTournament()

  useEffect(() => {
    const fetchMatchAndTournament = async () => {
      try {
        const matchData = await getMatch(id);
        setMatch(matchData);

        // Fetch and set the tournament
        const tournamentData = await getTournament(matchData.tournamentId);
        setSelectedTournament(tournamentData);
      } catch (error) {
        console.error("Error fetching match or tournament:", error);
        toast({
          title: "Error",
          description: "Failed to fetch match data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchMatchAndTournament();
  }, [id, toast, setSelectedTournament]);

  const handleSaveMatch = async (updatedMatch) => {
    try {
      await updateMatch(id, updatedMatch);
      toast({
        title: "Match Saved",
        description: "The match data has been successfully saved.",
      });
      // Redirect to the standings page of the current tournament
      router.push(`/dashboard/${updatedMatch.tournamentId}`);
    } catch (error) {
      console.error("Error saving match:", error);
      toast({
        title: "Error",
        description: "Failed to save match data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!match) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Match Scoring</h1>
        <MatchScoring match={match} onSave={handleSaveMatch} />
      </main>
    </div>
  );
}