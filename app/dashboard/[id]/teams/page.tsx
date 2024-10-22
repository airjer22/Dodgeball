"use client"

import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TeamsPage } from '@/components/teams-page';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTournament } from '@/contexts/TournamentContext';
import { getTournament } from '@/lib/firestore';

export default function TournamentTeamsPage({ params }) {
  const [tournament, setTournament] = useState(null);
  const { toast } = useToast();
  const { setSelectedTournament } = useTournament();

  const fetchTournament = useCallback(async () => {
    try {
      const fetchedTournament = await getTournament(params.id);
      setTournament(fetchedTournament);
      setSelectedTournament(fetchedTournament);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tournament data. Please try again.",
        variant: "destructive",
      });
    }
  }, [params.id, toast, setSelectedTournament]);

  useEffect(() => {
    fetchTournament();
  }, [fetchTournament]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar tournamentId={params.id} />
      <main className="flex-1 p-8 overflow-y-auto">
        {tournament ? (
          <TeamsPage tournament={tournament} />
        ) : (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No tournament selected</AlertTitle>
            <AlertDescription>
              Please select a tournament from the dashboard to manage teams.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}