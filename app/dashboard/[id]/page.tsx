"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { getTournament, getTeamsByTournament, getMatchesByTournament } from '@/lib/firestore';
import { StandingsPage } from '@/components/standings-page';
import { useTournament } from '@/contexts/TournamentContext';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Dashboard({ params }) {
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { setSelectedTournament } = useTournament();
  const { toast } = useToast();

  const fetchTournamentData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching tournament data for ID:", params.id);
      const tournamentData = await getTournament(params.id);
      console.log("Fetched tournament data:", tournamentData);
      
      if (!tournamentData) {
        throw new Error("Tournament not found");
      }
      setTournament(tournamentData);
      setSelectedTournament(tournamentData);

      const [teamsData, matchesData] = await Promise.all([
        getTeamsByTournament(params.id),
        getMatchesByTournament(params.id)
      ]);
      console.log("Fetched teams:", teamsData);
      console.log("Fetched matches:", matchesData);
      
      setTeams(teamsData);
      setMatches(matchesData);
    } catch (error) {
      console.error("Error fetching tournament data:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [params.id, setSelectedTournament, toast]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        fetchTournamentData();
      }
    }
  }, [user, authLoading, router, fetchTournamentData]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar tournamentId={params.id} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : tournament ? (
            <>
              <h1 className="text-2xl font-bold mb-4 gradient-text">{tournament.name}</h1>
              <StandingsPage tournament={tournament} teams={teams} matches={matches} />
            </>
          ) : (
            <div>No tournament data available.</div>
          )}
        </div>
      </main>
    </div>
  );
}