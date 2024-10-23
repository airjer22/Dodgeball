"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import { TournamentList } from '@/components/tournament-list';
import { CreateTournamentForm } from '@/components/create-tournament-form';
import { useTournament } from '@/contexts/TournamentContext';
import { useAuth } from '@/contexts/AuthContext';
import { getAllTournaments } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { selectedTournament, setSelectedTournament } = useTournament();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const fetchTournaments = useCallback(async () => {
    try {
      setError(null);
      const fetchedTournaments = await getAllTournaments();
      setTournaments(fetchedTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (user) {
      fetchTournaments();
    }
  }, [user, loading, router, fetchTournaments]);

  const addTournament = (newTournament) => {
    setTournaments([newTournament, ...tournaments]);
    setSelectedTournament(newTournament);
    setShowCreateForm(false);
    toast({
      title: "Success",
      description: "New tournament created successfully.",
    });
  };

  const handleSelectTournament = (tournament) => {
    router.push(`/dashboard/${tournament.id}`);
  };

  const handleDeleteTournament = (deletedTournamentId) => {
    setTournaments(tournaments.filter(tournament => tournament.id !== deletedTournamentId));
    if (selectedTournament && selectedTournament.id === deletedTournamentId) {
      setSelectedTournament(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <UserProfile user={user} />
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Tournaments</h2>
            <Button onClick={() => setShowCreateForm(true)}>Create New Tournament</Button>
          </div>
          {showCreateForm ? (
            <CreateTournamentForm onCreateTournament={addTournament} onCancel={() => setShowCreateForm(false)} />
          ) : (
            <TournamentList 
              tournaments={tournaments} 
              onSelectTournament={handleSelectTournament}
              onDeleteTournament={handleDeleteTournament}
              selectedTournament={selectedTournament}
            />
          )}
        </div>
      </main>
    </div>
  );
}