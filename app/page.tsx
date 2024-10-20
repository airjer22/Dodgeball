"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/login-form';
import { TournamentList } from '@/components/tournament-list';
import { CreateTournamentForm } from '@/components/create-tournament-form';
import { useAuth } from '@/contexts/AuthContext';
import { getAllTournaments, deleteTournament } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { user, loading } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Auth state changed:", { user, loading });
    if (user) {
      fetchTournaments();
    }
  }, [user]);

  const fetchTournaments = async () => {
    try {
      const fetchedTournaments = await getAllTournaments();
      setTournaments(fetchedTournaments);
      console.log("Fetched tournaments:", fetchedTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tournaments. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateTournament = (newTournament) => {
    setTournaments([newTournament, ...tournaments]);
    toast({
      title: "Success",
      description: "Tournament created successfully!",
    });
  };

  const handleSelectTournament = (tournament) => {
    router.push(`/dashboard/${tournament.id}`);
  };

  const handleDeleteTournament = async (tournamentId) => {
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="mb-4">Loading... Please wait.</p>
          <p>Auth state: {loading ? 'Loading' : user ? 'Authenticated' : 'Not authenticated'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
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
          <CreateTournamentForm onCreateTournament={handleCreateTournament} />
        </div>
      )}
    </div>
  );
}