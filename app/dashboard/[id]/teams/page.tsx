"use client"

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TeamsPage } from '@/components/teams-page';
import { useAuth } from '@/contexts/AuthContext';
import { getTournament } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Teams({ params }) {
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTournament();
    }
  }, [user, params.id]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      setError(null);
      const tournamentData = await getTournament(params.id);
      if (!tournamentData) {
        throw new Error("Tournament not found");
      }
      setTournament(tournamentData);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      setError("Failed to fetch tournament data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch tournament data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading tournament data...</div>;
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
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar tournamentId={params.id} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">{tournament?.name} - Teams</h1>
          <TeamsPage tournament={tournament} />
        </div>
      </main>
    </div>
  );
}