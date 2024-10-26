"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/login-form';
import { TournamentList } from '@/components/tournament-list';
import { CreateTournamentForm } from '@/components/create-tournament-form';
import { useAuth } from '@/contexts/AuthContext';
import { getAllTournaments, deleteTournament } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast";

interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  [key: string]: any;
}

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const fetchTournaments = useCallback(async () => {
    try {
      const fetchedTournaments = await getAllTournaments() as Tournament[];
      setTournaments(fetchedTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tournaments. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    } else if (!loading) {
      fetchTournaments();
    }
  }, [user, loading, router, fetchTournaments]);

  const handleCreateTournament = (newTournament: Tournament) => {
    setTournaments([newTournament, ...tournaments]);
    toast({
      title: "Success",
      description: "Tournament created successfully!",
    });
  };

  const handleSelectTournament = (tournament: Tournament) => {
    router.push(`/dashboard/${tournament.id}`);
  };

  const handleDeleteTournament = async (tournamentId: string) => {
    try {
      await deleteTournament(tournamentId);
      setTournaments(tournaments.filter(t => t.id !== tournamentId));
      toast({
        title: "Success",
        description: "Tournament deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast({
        title: "Error",
        description: "Failed to delete tournament. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="mb-4">Loading... Please wait.</p>
          <p>Auth state: {loading ? 'Loading' : user ? 'Authenticated' : 'Not authenticated'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      {!user ? (
        <LoginForm />
      ) : (
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-4 text-center">3 Pin Dodgeball Tournament Manager</h1>
          <TournamentList 
            tournaments={tournaments} 
            onSelectTournament={handleSelectTournament}
            onDeleteTournament={handleDeleteTournament}
          />
          <CreateTournamentForm 
            onCreateTournament={handleCreateTournament}
            onCancel={() => {}} // Add empty onCancel handler as required by the component
          />
        </div>
      )}
    </div>
  );
}
