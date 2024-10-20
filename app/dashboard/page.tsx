"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import { TournamentList } from '@/components/tournament-list';
import { CreateTournamentForm } from '@/components/create-tournament-form';
import { useTournament } from '@/contexts/TournamentContext';
import { useAuth } from '@/contexts/AuthContext';
import { getAllTournaments, deleteTournament } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Dashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedTournament, setSelectedTournament } = useTournament();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      fetchTournaments();
    }
  }, [user, router]);

  const fetchTournaments = async () => {
    if (user) {
      try {
        setLoading(true);
        setError(null);
        const fetchedTournaments = await getAllTournaments();
        setTournaments(fetchedTournaments);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        setError("Failed to fetch tournaments. Please try again.");
        toast({
          title: "Error",
          description: "Failed to fetch tournaments. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const addTournament = (newTournament) => {
    setTournaments(prevTournaments => [newTournament, ...prevTournaments]);
    setSelectedTournament(newTournament);
  };

  const deleteTournamentHandler = async (id) => {
    try {
      await deleteTournament(id);
      setTournaments(prevTournaments => prevTournaments.filter(tournament => tournament.id !== id));
      if (selectedTournament && selectedTournament.id === id) {
        setSelectedTournament(null);
      }
      toast({
        title: "Success",
        description: "Tournament deleted successfully.",
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

  const handleSelectTournament = (tournament) => {
    router.push(`/dashboard/${tournament.id}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <UserProfile user={user} />
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : loading ? (
            <div>Loading tournaments...</div>
          ) : (
            <>
              <TournamentList 
                tournaments={tournaments} 
                onDeleteTournament={deleteTournamentHandler}
                onSelectTournament={handleSelectTournament}
                selectedTournament={selectedTournament}
              />
              <CreateTournamentForm onCreateTournament={addTournament} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}